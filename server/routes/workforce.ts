import express from 'express';
import type { Request, Response } from 'express';
import { isAdminRole as isSharedAdminRole, normalizeAppRole } from '../../shared/authRoles';
import { FieldValue, adminDb } from '../lib/supabaseAdmin';
import { readBearerToken, resolveAuthenticatedActor } from '../lib/authSession';
import { deliverSubmissionAlert, maskEmail, maskName, truncateText } from '../lib/correspondence';
import {
  calculateProfileStrength,
  scorePractitionerForRequest,
} from '../../src/lib/workforce/scoring';
import type {
  AvailabilityStatus,
  ApplicationStatus,
  ClinicDashboardData,
  EmploymentType,
  InterviewStatus,
  MatchResult,
  OfferStatus,
  PractitionerDashboardData,
  PractitionerProfile,
  PractitionerProfileInput,
  PractitionerRole,
  RequestUrgency,
  StaffingRequest,
  StaffingRequestInput,
  WorkMode,
  WorkforceApplication,
  WorkforceApplicationInput,
  WorkforceCandidateCard,
  WorkforceInterview,
  WorkforceInterviewInput,
  WorkforceLocation,
  WorkforceNotification,
  WorkforceOffer,
  WorkforceOfferInput,
  WorkforceOpportunity,
  WorkforceRequestStatus,
} from '../../src/lib/workforce/types';

const router = express.Router();

const COLLECTIONS = {
  profiles: 'practitionerProfiles',
  requests: 'staffingRequests',
  applications: 'workforceApplications',
  interviews: 'workforceInterviews',
  offers: 'workforceOffers',
  notifications: 'workforceNotifications',
  users: 'users',
} as const;

const PRACTITIONER_ROLES: PractitionerRole[] = [
  'Medical Director (MD/DO)',
  'Nurse Practitioner (NP)',
  'Physician Assistant (PA)',
  'Registered Nurse (RN)',
  'Medical Assistant',
  'Other',
];

const EMPLOYMENT_TYPES: EmploymentType[] = [
  'Full-time',
  'Part-time',
  'Contract',
  'Per Diem',
  'Telehealth Only',
];

const WORK_MODES: WorkMode[] = ['Onsite', 'Hybrid', 'Remote'];
const AVAILABILITY_STATUSES: AvailabilityStatus[] = ['available', 'interviewing', 'placed', 'inactive'];
const REQUEST_STATUSES: WorkforceRequestStatus[] = [
  'draft',
  'open',
  'screening',
  'interviewing',
  'offer_extended',
  'filled',
  'closed',
];
const REQUEST_URGENCIES: RequestUrgency[] = ['Low', 'Medium', 'High', 'Critical'];
const APPLICATION_STATUSES: ApplicationStatus[] = [
  'applied',
  'screening',
  'interview_scheduled',
  'interview_completed',
  'offer_extended',
  'offer_accepted',
  'offer_declined',
  'rejected',
  'withdrawn',
];
const INTERVIEW_STATUSES: InterviewStatus[] = ['scheduled', 'completed', 'cancelled'];
const INTERVIEW_MODES: WorkforceInterview['mode'][] = ['video', 'phone', 'onsite'];
const OFFER_STATUSES: OfferStatus[] = ['extended', 'accepted', 'declined', 'expired'];
const ACTIVE_REQUEST_STATUSES: WorkforceRequestStatus[] = ['open', 'screening', 'interviewing', 'offer_extended'];
const CLINIC_APPLICATION_MANUAL_STATUSES: ApplicationStatus[] = ['screening', 'rejected'];

type Actor = {
  uid: string;
  email: string | null;
  name: string;
  role: string | null;
};

type AuthenticatedRequest = Request & {
  actor?: Actor | null;
};

class WorkforceHttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function asyncHandler(
  handler: (req: AuthenticatedRequest, res: Response) => Promise<void>,
) {
  return async (req: AuthenticatedRequest, res: Response) => {
    try {
      await handler(req, res);
    } catch (error) {
      const status =
        error instanceof WorkforceHttpError ? error.status : 500;
      let message =
        error instanceof Error ? error.message : 'Internal server error';
      if (
        status >= 500 &&
        typeof message === 'string' &&
        (
          message.includes('invalid_grant') ||
          message.includes('invalid_rapt') ||
          message.includes('invalid signature') ||
          message.includes('jwt') ||
          message.includes('auth session missing')
        )
      ) {
        message =
          'Supabase server credentials are not configured for this environment. Set SUPABASE_URL and SUPABASE_SECRET_KEY before using workforce routes.';
      }
      if (status >= 500) {
        console.error('Workforce route error:', error);
      }
      res.status(status).json({ error: message });
    }
  };
}

function isAdminRole(role: string | null | undefined) {
  return isSharedAdminRole(role);
}

function isClinicRole(role: string | null | undefined) {
  return role === 'clinic' || role === 'clinic_admin' || isAdminRole(role);
}

function toIso(value: unknown) {
  if (!value) {
    return new Date().toISOString();
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'object' && value && 'toDate' in value && typeof value.toDate === 'function') {
    return value.toDate().toISOString();
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return new Date().toISOString();
}

function sortByIsoDesc<T extends { updatedAt?: string; createdAt?: string }>(items: T[]) {
  return [...items].sort((left, right) => {
    const leftDate = new Date(left.updatedAt || left.createdAt || 0).getTime();
    const rightDate = new Date(right.updatedAt || right.createdAt || 0).getTime();
    return rightDate - leftDate;
  });
}

function sanitizeString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function sanitizeStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => sanitizeString(entry))
    .filter(Boolean);
}

function sanitizeNumber(value: unknown, fallback = 0) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
}

function ensureRequiredString(value: unknown, fieldLabel: string) {
  const sanitized = sanitizeString(value);
  if (!sanitized) {
    throw new WorkforceHttpError(400, `${fieldLabel} is required.`);
  }

  return sanitized;
}

function ensureEnumValue<T extends string>(
  value: unknown,
  allowedValues: readonly T[],
  fieldLabel: string,
) {
  const sanitized = sanitizeString(value);
  if (!allowedValues.includes(sanitized as T)) {
    throw new WorkforceHttpError(400, `Invalid ${fieldLabel}.`);
  }

  return sanitized as T;
}

function ensureEnumArray<T extends string>(
  value: unknown,
  allowedValues: readonly T[],
  fieldLabel: string,
) {
  const values = sanitizeStringArray(value);
  const invalidValue = values.find((entry) => !allowedValues.includes(entry as T));
  if (invalidValue) {
    throw new WorkforceHttpError(400, `Invalid ${fieldLabel}: ${invalidValue}.`);
  }

  return Array.from(new Set(values)) as T[];
}

function ensureIsoLikeDateString(value: unknown, fieldLabel: string) {
  const sanitized = ensureRequiredString(value, fieldLabel);
  if (Number.isNaN(Date.parse(sanitized))) {
    throw new WorkforceHttpError(400, `${fieldLabel} must be a valid date.`);
  }

  return sanitized;
}

function isCandidateMarketplaceProfile(profile: PractitionerProfile) {
  return profile.searchable && profile.availabilityStatus !== 'inactive' && profile.availabilityStatus !== 'placed';
}

function buildLocation(city: string, state: string, isRemote?: boolean): WorkforceLocation {
  return {
    city,
    state,
    label: isRemote ? `Remote${state ? ` (${state})` : ''}` : `${city}, ${state}`,
    isRemote,
  };
}

async function getActor(
  req: AuthenticatedRequest,
  required = true,
): Promise<Actor | null> {
  if (req.actor !== undefined) {
    return req.actor;
  }

  const token = readBearerToken(req);
  if (!token) {
    if (!required) {
      req.actor = null;
      return null;
    }

    throw new WorkforceHttpError(401, 'Authentication required.');
  }

  const resolvedActor = await resolveAuthenticatedActor(token);
  const userDoc = await adminDb.collection(COLLECTIONS.users).doc(resolvedActor.uid).get();
  const userData = userDoc.exists ? userDoc.data() ?? {} : {};
  const storedRole = normalizeAppRole(userData.role);

  const actor: Actor = {
    uid: resolvedActor.uid,
    email: resolvedActor.email ?? null,
    name: sanitizeString(userData.name) || resolvedActor.name || 'Unknown User',
    role: storedRole || resolvedActor.role,
  };

  req.actor = actor;
  return actor;
}

async function requireClinicActor(req: AuthenticatedRequest) {
  const actor = await getActor(req, true);
  if (!actor || !isClinicRole(actor.role)) {
    throw new WorkforceHttpError(403, 'Clinic access required.');
  }

  return actor;
}

async function requireAuthenticatedActor(req: AuthenticatedRequest) {
  const actor = await getActor(req, true);
  if (!actor) {
    throw new WorkforceHttpError(401, 'Authentication required.');
  }

  return actor;
}

function serializePractitionerProfile(
  id: string,
  data: Record<string, any>,
): PractitionerProfile {
  return {
    id,
    userId: sanitizeString(data.userId) || id,
    firstName: sanitizeString(data.firstName),
    lastName: sanitizeString(data.lastName),
    email: sanitizeString(data.email),
    phone: sanitizeString(data.phone),
    location: {
      city: sanitizeString(data.location?.city),
      state: sanitizeString(data.location?.state),
      label: sanitizeString(data.location?.label),
      isRemote: Boolean(data.location?.isRemote),
    },
    role: sanitizeString(data.role) as PractitionerRole,
    yearsExperience: sanitizeNumber(data.yearsExperience),
    licenseStates: sanitizeStringArray(data.licenseStates),
    licenseNumber: sanitizeString(data.licenseNumber) || undefined,
    npi: sanitizeString(data.npi) || undefined,
    dea: sanitizeString(data.dea) || undefined,
    specialties: sanitizeStringArray(data.specialties),
    protocols: sanitizeStringArray(data.protocols),
    employmentPreferences: sanitizeStringArray(data.employmentPreferences) as EmploymentType[],
    workModes: sanitizeStringArray(data.workModes) as WorkMode[],
    availabilityStatus: sanitizeString(data.availabilityStatus) as PractitionerProfile['availabilityStatus'],
    targetCompensation: sanitizeString(data.targetCompensation),
    targetRateMin: sanitizeNumber(data.targetRateMin) || undefined,
    targetRateMax: sanitizeNumber(data.targetRateMax) || undefined,
    travelPreference: sanitizeString(data.travelPreference),
    summary: sanitizeString(data.summary),
    resumeFileName: sanitizeString(data.resumeFileName) || undefined,
    resumeUploaded: Boolean(data.resumeUploaded),
    profileStrength: sanitizeNumber(data.profileStrength),
    searchable: Boolean(data.searchable),
    verified: Boolean(data.verified),
    createdAt: toIso(data.createdAt),
    updatedAt: toIso(data.updatedAt),
  };
}

function serializeStaffingRequest(
  id: string,
  data: Record<string, any>,
  overrides?: Partial<Pick<StaffingRequest, 'applicationCount' | 'matchCount'>>,
): StaffingRequest {
  return {
    id,
    clinicId: sanitizeString(data.clinicId),
    clinicName: sanitizeString(data.clinicName),
    title: sanitizeString(data.title),
    role: sanitizeString(data.role) as PractitionerRole,
    employmentType: sanitizeString(data.employmentType) as EmploymentType,
    workMode: sanitizeString(data.workMode) as WorkMode,
    location: {
      city: sanitizeString(data.location?.city),
      state: sanitizeString(data.location?.state),
      label: sanitizeString(data.location?.label),
      isRemote: Boolean(data.location?.isRemote),
    },
    compensation: sanitizeString(data.compensation),
    minimumYearsExperience: sanitizeNumber(data.minimumYearsExperience),
    requiredLicenseStates: sanitizeStringArray(data.requiredLicenseStates),
    requiredProtocols: sanitizeStringArray(data.requiredProtocols),
    description: sanitizeString(data.description),
    urgency: sanitizeString(data.urgency) as RequestUrgency,
    openings: Math.max(1, sanitizeNumber(data.openings, 1)),
    status: sanitizeString(data.status) as WorkforceRequestStatus,
    applicationCount:
      overrides?.applicationCount ?? Math.max(0, sanitizeNumber(data.applicationCount)),
    matchCount:
      overrides?.matchCount ?? Math.max(0, sanitizeNumber(data.matchCount)),
    createdAt: toIso(data.createdAt),
    updatedAt: toIso(data.updatedAt),
  };
}

function serializeApplication(
  id: string,
  data: Record<string, any>,
): WorkforceApplication {
  return {
    id,
    requestId: sanitizeString(data.requestId),
    clinicId: sanitizeString(data.clinicId),
    clinicName: sanitizeString(data.clinicName),
    requestTitle: sanitizeString(data.requestTitle),
    practitionerId: sanitizeString(data.practitionerId),
    practitionerName: sanitizeString(data.practitionerName),
    practitionerRole: sanitizeString(data.practitionerRole) as PractitionerRole,
    practitionerLocation: sanitizeString(data.practitionerLocation),
    status: sanitizeString(data.status) as ApplicationStatus,
    coverNote: sanitizeString(data.coverNote),
    match: data.match as MatchResult,
    createdAt: toIso(data.createdAt),
    updatedAt: toIso(data.updatedAt),
    latestInterviewId: sanitizeString(data.latestInterviewId) || undefined,
    latestOfferId: sanitizeString(data.latestOfferId) || undefined,
  };
}

function serializeInterview(
  id: string,
  data: Record<string, any>,
): WorkforceInterview {
  return {
    id,
    applicationId: sanitizeString(data.applicationId),
    requestId: sanitizeString(data.requestId),
    clinicId: sanitizeString(data.clinicId),
    practitionerId: sanitizeString(data.practitionerId),
    scheduledAt: sanitizeString(data.scheduledAt),
    durationMinutes: sanitizeNumber(data.durationMinutes, 30),
    mode: sanitizeString(data.mode) as WorkforceInterview['mode'],
    location: sanitizeString(data.location),
    meetingLink: sanitizeString(data.meetingLink) || undefined,
    notes: sanitizeString(data.notes) || undefined,
    status: sanitizeString(data.status) as WorkforceInterview['status'],
    createdAt: toIso(data.createdAt),
    updatedAt: toIso(data.updatedAt),
  };
}

function serializeOffer(
  id: string,
  data: Record<string, any>,
): WorkforceOffer {
  return {
    id,
    applicationId: sanitizeString(data.applicationId),
    requestId: sanitizeString(data.requestId),
    clinicId: sanitizeString(data.clinicId),
    practitionerId: sanitizeString(data.practitionerId),
    compensation: sanitizeString(data.compensation),
    startDate: sanitizeString(data.startDate),
    expiresAt: sanitizeString(data.expiresAt),
    notes: sanitizeString(data.notes) || undefined,
    status: sanitizeString(data.status) as WorkforceOffer['status'],
    createdAt: toIso(data.createdAt),
    updatedAt: toIso(data.updatedAt),
  };
}

function serializeNotification(
  id: string,
  data: Record<string, any>,
): WorkforceNotification {
  return {
    id,
    userId: sanitizeString(data.userId),
    title: sanitizeString(data.title),
    body: sanitizeString(data.body),
    type: sanitizeString(data.type) as WorkforceNotification['type'],
    status: sanitizeString(data.status) as WorkforceNotification['status'],
    link: sanitizeString(data.link) || undefined,
    entityId: sanitizeString(data.entityId) || undefined,
    entityType: sanitizeString(data.entityType) as WorkforceNotification['entityType'] | undefined,
    createdAt: toIso(data.createdAt),
  };
}

async function fetchPractitionerProfile(userId: string) {
  const docSnapshot = await adminDb.collection(COLLECTIONS.profiles).doc(userId).get();
  if (!docSnapshot.exists) {
    return null;
  }

  return serializePractitionerProfile(docSnapshot.id, docSnapshot.data() ?? {});
}

async function fetchRequestById(requestId: string) {
  const docSnapshot = await adminDb.collection(COLLECTIONS.requests).doc(requestId).get();
  if (!docSnapshot.exists) {
    return null;
  }

  return serializeStaffingRequest(docSnapshot.id, docSnapshot.data() ?? {});
}

async function fetchApplicationById(applicationId: string) {
  const docSnapshot = await adminDb.collection(COLLECTIONS.applications).doc(applicationId).get();
  if (!docSnapshot.exists) {
    return null;
  }

  return serializeApplication(docSnapshot.id, docSnapshot.data() ?? {});
}

async function fetchInterviewById(interviewId: string) {
  const docSnapshot = await adminDb.collection(COLLECTIONS.interviews).doc(interviewId).get();
  if (!docSnapshot.exists) {
    return null;
  }

  return serializeInterview(docSnapshot.id, docSnapshot.data() ?? {});
}

async function fetchOfferById(offerId: string) {
  const docSnapshot = await adminDb.collection(COLLECTIONS.offers).doc(offerId).get();
  if (!docSnapshot.exists) {
    return null;
  }

  return serializeOffer(docSnapshot.id, docSnapshot.data() ?? {});
}

async function fetchNotificationsForUser(userId: string) {
  const snapshot = await adminDb
    .collection(COLLECTIONS.notifications)
    .where('userId', '==', userId)
    .get();

  return sortByIsoDesc(
    snapshot.docs.map((docSnapshot) =>
      serializeNotification(docSnapshot.id, docSnapshot.data() ?? {}),
    ),
  );
}

async function createNotification(
  userId: string,
  notification: Omit<WorkforceNotification, 'id' | 'userId' | 'createdAt' | 'status'> & {
    status?: WorkforceNotification['status'];
  },
) {
  await adminDb.collection(COLLECTIONS.notifications).add({
    userId,
    title: notification.title,
    body: notification.body,
    type: notification.type,
    link: notification.link,
    entityId: notification.entityId,
    entityType: notification.entityType,
    status: notification.status || 'unread',
    createdAt: FieldValue.serverTimestamp(),
  });
}

async function notifySubmission(input: Parameters<typeof deliverSubmissionAlert>[0]) {
  try {
    await deliverSubmissionAlert(input);
  } catch (error) {
    console.error('Workforce submission alert failed:', error);
  }
}

async function countPotentialMatches(request: StaffingRequest) {
  const snapshot = await adminDb
    .collection(COLLECTIONS.profiles)
    .where('searchable', '==', true)
    .get();

  const profiles = snapshot.docs.map((docSnapshot) =>
    serializePractitionerProfile(docSnapshot.id, docSnapshot.data() ?? {}),
  );

  return profiles
    .filter((profile) => isCandidateMarketplaceProfile(profile))
    .filter((profile) => scorePractitionerForRequest(profile, request).score >= 70)
    .length;
}

async function syncPractitionerAvailability(practitionerId: string) {
  const profile = await fetchPractitionerProfile(practitionerId);
  if (!profile) {
    return;
  }

  const applicationsSnapshot = await adminDb
    .collection(COLLECTIONS.applications)
    .where('practitionerId', '==', practitionerId)
    .get();
  const offersSnapshot = await adminDb
    .collection(COLLECTIONS.offers)
    .where('practitionerId', '==', practitionerId)
    .get();

  const applications = applicationsSnapshot.docs.map((docSnapshot) =>
    serializeApplication(docSnapshot.id, docSnapshot.data() ?? {}),
  );
  const offers = offersSnapshot.docs.map((docSnapshot) =>
    serializeOffer(docSnapshot.id, docSnapshot.data() ?? {}),
  );

  const hasAcceptedOffer =
    offers.some((offer) => offer.status === 'accepted') ||
    applications.some((application) => application.status === 'offer_accepted');
  const hasInterviewPipeline =
    offers.some((offer) => offer.status === 'extended') ||
    applications.some((application) =>
      ['interview_scheduled', 'interview_completed', 'offer_extended'].includes(application.status),
    );
  const hasOpenApplications = applications.some((application) =>
    ['applied', 'screening'].includes(application.status),
  );

  let nextStatus = profile.availabilityStatus;
  if (hasAcceptedOffer) {
    nextStatus = 'placed';
  } else if (hasInterviewPipeline) {
    nextStatus = 'interviewing';
  } else if (hasOpenApplications) {
    nextStatus = 'available';
  } else if (profile.availabilityStatus === 'interviewing' || profile.availabilityStatus === 'placed') {
    nextStatus = 'available';
  }

  const nextSearchable = nextStatus === 'placed' ? false : profile.searchable;

  if (nextStatus !== profile.availabilityStatus || nextSearchable !== profile.searchable) {
    await adminDb.collection(COLLECTIONS.profiles).doc(practitionerId).set(
      {
        availabilityStatus: nextStatus,
        searchable: nextSearchable,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
  }
}

async function synchronizeRequest(requestId: string) {
  const request = await fetchRequestById(requestId);
  if (!request) {
    return null;
  }

  const applicationsSnapshot = await adminDb
    .collection(COLLECTIONS.applications)
    .where('requestId', '==', requestId)
    .get();
  const offersSnapshot = await adminDb
    .collection(COLLECTIONS.offers)
    .where('requestId', '==', requestId)
    .get();

  const applications = applicationsSnapshot.docs.map((docSnapshot) =>
    serializeApplication(docSnapshot.id, docSnapshot.data() ?? {}),
  );
  const offers = offersSnapshot.docs.map((docSnapshot) =>
    serializeOffer(docSnapshot.id, docSnapshot.data() ?? {}),
  );

  const acceptedOffers = offers.filter((offer) => offer.status === 'accepted').length;
  const activeOffers = offers.filter((offer) => offer.status === 'extended').length;
  const interviewStageCount = applications.filter((application) =>
    ['interview_scheduled', 'interview_completed'].includes(application.status),
  ).length;

  let status: WorkforceRequestStatus = 'open';
  if (request.status === 'draft') {
    status = 'draft';
  } else if (acceptedOffers >= request.openings) {
    status = 'filled';
  } else if (activeOffers > 0) {
    status = 'offer_extended';
  } else if (interviewStageCount > 0) {
    status = 'interviewing';
  } else if (applications.length > 0) {
    status = 'screening';
  }

  await adminDb.collection(COLLECTIONS.requests).doc(requestId).set(
    {
      status,
      applicationCount: applications.length,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  return {
    ...request,
    status,
    applicationCount: applications.length,
  };
}

function buildProfilePayload(actor: Actor, input: PractitionerProfileInput) {
  const role = ensureEnumValue(input.role, PRACTITIONER_ROLES, 'practitioner role');
  const employmentPreferences = ensureEnumArray(
    input.employmentPreferences,
    EMPLOYMENT_TYPES,
    'employment preference',
  );
  const workModes = ensureEnumArray(input.workModes, WORK_MODES, 'work mode');
  const availabilityStatus = ensureEnumValue(
    input.availabilityStatus,
    AVAILABILITY_STATUSES,
    'availability status',
  );
  const location = buildLocation(
    sanitizeString(input.city),
    sanitizeString(input.state),
    workModes.includes('Remote'),
  );

  const profileStrength = calculateProfileStrength({
    firstName: ensureRequiredString(input.firstName, 'First name'),
    lastName: ensureRequiredString(input.lastName, 'Last name'),
    email: actor.email || sanitizeString(input.email),
    phone: sanitizeString(input.phone),
    location,
    role,
    licenseStates: sanitizeStringArray(input.licenseStates),
    licenseNumber: sanitizeString(input.licenseNumber),
    yearsExperience: sanitizeNumber(input.yearsExperience),
    protocols: sanitizeStringArray(input.protocols),
    employmentPreferences,
    workModes,
    summary: sanitizeString(input.summary),
    resumeUploaded: Boolean(input.resumeUploaded),
  });

  return {
    userId: actor.uid,
    firstName: ensureRequiredString(input.firstName, 'First name'),
    lastName: ensureRequiredString(input.lastName, 'Last name'),
    email: actor.email || sanitizeString(input.email),
    phone: sanitizeString(input.phone),
    location,
    role,
    yearsExperience: sanitizeNumber(input.yearsExperience),
    licenseStates: sanitizeStringArray(input.licenseStates),
    licenseNumber: sanitizeString(input.licenseNumber),
    npi: sanitizeString(input.npi),
    dea: sanitizeString(input.dea),
    specialties: sanitizeStringArray(input.specialties),
    protocols: sanitizeStringArray(input.protocols),
    employmentPreferences,
    workModes,
    availabilityStatus,
    targetCompensation: sanitizeString(input.targetCompensation),
    targetRateMin: sanitizeNumber(input.targetRateMin) || null,
    targetRateMax: sanitizeNumber(input.targetRateMax) || null,
    travelPreference: sanitizeString(input.travelPreference),
    summary: sanitizeString(input.summary),
    resumeFileName: sanitizeString(input.resumeFileName) || null,
    resumeUploaded: Boolean(input.resumeUploaded),
    profileStrength,
    searchable: Boolean(input.searchable),
    verified: Boolean(
      sanitizeString(input.licenseNumber) && sanitizeStringArray(input.licenseStates).length,
    ),
    updatedAt: FieldValue.serverTimestamp(),
  };
}

function buildRequestPayload(actor: Actor, input: StaffingRequestInput) {
  const title = ensureRequiredString(input.title, 'Title');
  const workMode = ensureEnumValue(input.workMode, WORK_MODES, 'work mode');
  const isRemote = workMode === 'Remote';
  const city = sanitizeString(input.city);
  const state = sanitizeString(input.state);

  if (!isRemote && (!city || !state)) {
    throw new WorkforceHttpError(400, 'City and state are required for onsite and hybrid requisitions.');
  }

  return {
    clinicId: actor.uid,
    clinicName: actor.name,
    title,
    role: ensureEnumValue(input.role, PRACTITIONER_ROLES, 'practitioner role'),
    employmentType: ensureEnumValue(input.employmentType, EMPLOYMENT_TYPES, 'employment type'),
    workMode,
    location: buildLocation(
      city,
      state,
      isRemote,
    ),
    compensation: ensureRequiredString(input.compensation, 'Compensation'),
    minimumYearsExperience: Math.max(0, sanitizeNumber(input.minimumYearsExperience)),
    requiredLicenseStates: sanitizeStringArray(input.requiredLicenseStates),
    requiredProtocols: sanitizeStringArray(input.requiredProtocols),
    description: ensureRequiredString(input.description, 'Description'),
    urgency: ensureEnumValue(input.urgency, REQUEST_URGENCIES, 'urgency'),
    openings: Math.max(1, sanitizeNumber(input.openings, 1)),
    status: ensureEnumValue(input.status || 'open', REQUEST_STATUSES, 'request status'),
    updatedAt: FieldValue.serverTimestamp(),
  };
}

router.get(
  '/practitioner-profile/me',
  asyncHandler(async (req, res) => {
    const actor = await requireAuthenticatedActor(req);
    const profile = await fetchPractitionerProfile(actor.uid);
    res.json({ profile });
  }),
);

router.put(
  '/practitioner-profile/me',
  asyncHandler(async (req, res) => {
    const actor = await requireAuthenticatedActor(req);
    const input = req.body as PractitionerProfileInput;
    const existingProfile = await fetchPractitionerProfile(actor.uid);
    const payload = buildProfilePayload(actor, input);

    await adminDb.collection(COLLECTIONS.profiles).doc(actor.uid).set(
      {
        ...payload,
        ...(existingProfile ? {} : { createdAt: FieldValue.serverTimestamp() }),
      },
      { merge: true },
    );

    await adminDb.collection(COLLECTIONS.users).doc(actor.uid).set(
      {
        uid: actor.uid,
        email: actor.email,
        name: `${payload.firstName} ${payload.lastName}`.trim() || actor.name,
        role: 'practitioner',
        updatedAt: FieldValue.serverTimestamp(),
        ...(existingProfile ? {} : { createdAt: FieldValue.serverTimestamp() }),
      },
      { merge: true },
    );

    const profile = await fetchPractitionerProfile(actor.uid);
    await createNotification(actor.uid, {
      title: 'Practitioner profile saved',
      body: 'Your profile is now active in the workforce exchange.',
      type: 'staffing_request_updated',
      entityId: actor.uid,
      entityType: 'profile',
      link: '/practitioners/profile',
    });

    await notifySubmission({
      category: 'practitioner_onboarding',
      title: existingProfile ? 'Practitioner profile updated' : 'New practitioner onboarding',
      entityType: 'practitionerProfile',
      entityId: actor.uid,
      summary: `${payload.firstName} ${payload.lastName}`.trim() || actor.name,
      route: '/api/workforce/practitioner-profile/me',
      replyTo: payload.email || actor.email,
      adminPath: '/admin/command-center',
      emailFields: [
        { label: 'Practitioner ID', value: actor.uid },
        { label: 'Name', value: `${payload.firstName} ${payload.lastName}`.trim() || actor.name },
        { label: 'Email', value: payload.email || actor.email || '' },
        { label: 'Role', value: payload.role },
        { label: 'Location', value: payload.location.label },
        { label: 'Protocols', value: payload.protocols.join(', ') || 'None listed' },
        { label: 'Profile Strength', value: `${payload.profileStrength}%` },
      ],
      slackFields: [
        { label: 'Practitioner', value: maskName(`${payload.firstName} ${payload.lastName}`.trim()) || actor.uid },
        { label: 'Email', value: maskEmail(payload.email || actor.email || '') },
        { label: 'Role', value: payload.role },
        { label: 'Profile', value: existingProfile ? 'updated' : 'new' },
      ],
      metadata: {
        practitionerId: actor.uid,
        profileStrength: payload.profileStrength,
        created: !existingProfile,
      },
    });

    res.json({ profile });
  }),
);

router.get(
  '/practitioners/:id',
  asyncHandler(async (req, res) => {
    const actor = await getActor(req, true);
    const profile = await fetchPractitionerProfile(req.params.id);

    if (!profile) {
      throw new WorkforceHttpError(404, 'Practitioner profile not found.');
    }

    if (
      actor &&
      actor.uid !== profile.userId &&
      !isClinicRole(actor.role)
    ) {
      throw new WorkforceHttpError(403, 'Not authorized to view this profile.');
    }

    const applicationsSnapshot = await adminDb
      .collection(COLLECTIONS.applications)
      .where('practitionerId', '==', profile.userId)
      .get();

    const applications = sortByIsoDesc(
      applicationsSnapshot.docs.map((docSnapshot) =>
        serializeApplication(docSnapshot.id, docSnapshot.data() ?? {}),
      ),
    ).slice(0, 5);

    res.json({ profile, applications });
  }),
);

router.get(
  '/opportunities',
  asyncHandler(async (req, res) => {
    const actor = await getActor(req, false);
    const requestsSnapshot = await adminDb.collection(COLLECTIONS.requests).get();
    const requests = requestsSnapshot.docs
      .map((docSnapshot) =>
        serializeStaffingRequest(docSnapshot.id, docSnapshot.data() ?? {}),
      )
      .filter((request) => ACTIVE_REQUEST_STATUSES.includes(request.status));

    let profile: PractitionerProfile | null = null;
    let applicationMap = new Map<string, WorkforceApplication>();
    if (actor) {
      profile = await fetchPractitionerProfile(actor.uid);
      if (profile) {
        const applicationsSnapshot = await adminDb
          .collection(COLLECTIONS.applications)
          .where('practitionerId', '==', actor.uid)
          .get();
        applicationMap = new Map(
          applicationsSnapshot.docs.map((docSnapshot) => {
            const application = serializeApplication(docSnapshot.id, docSnapshot.data() ?? {});
            return [application.requestId, application];
          }),
        );
      }
    }

    const opportunities: WorkforceOpportunity[] = requests.map((request) => {
      const application = applicationMap.get(request.id);
      return {
        ...request,
        match: profile ? scorePractitionerForRequest(profile, request) : undefined,
        hasApplied: Boolean(application),
        applicationId: application?.id,
        applicationStatus: application?.status,
      };
    });

    const sorted = opportunities.sort((left, right) => {
      const leftScore = left.match?.score ?? 0;
      const rightScore = right.match?.score ?? 0;
      if (leftScore !== rightScore) {
        return rightScore - leftScore;
      }
      return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
    });

    res.json({ opportunities: sorted });
  }),
);

router.get(
  '/opportunities/:id',
  asyncHandler(async (req, res) => {
    const actor = await getActor(req, false);
    const request = await fetchRequestById(req.params.id);

    if (!request) {
      throw new WorkforceHttpError(404, 'Staffing request not found.');
    }

    const profile = actor ? await fetchPractitionerProfile(actor.uid) : null;
    const opportunity: WorkforceOpportunity = {
      ...request,
      match: profile ? scorePractitionerForRequest(profile, request) : undefined,
    };

    res.json({ opportunity });
  }),
);

router.get(
  '/candidates',
  asyncHandler(async (req, res) => {
    const actor = await requireClinicActor(req);
    const requestId = sanitizeString(req.query.requestId);
    const request = requestId ? await fetchRequestById(requestId) : null;

    if (request && request.clinicId !== actor.uid && !isAdminRole(actor.role)) {
      throw new WorkforceHttpError(403, 'Not authorized to view candidates for this requisition.');
    }

    const profilesSnapshot = await adminDb
      .collection(COLLECTIONS.profiles)
      .where('searchable', '==', true)
      .get();

    const candidates: WorkforceCandidateCard[] = profilesSnapshot.docs
      .map((docSnapshot) => serializePractitionerProfile(docSnapshot.id, docSnapshot.data() ?? {}))
      .filter((profile) => isCandidateMarketplaceProfile(profile))
      .map((profile) => ({
        id: profile.id,
        name: `${profile.firstName} ${profile.lastName}`.trim(),
        role: profile.role,
        location: profile.location.label,
        employmentPreferences: profile.employmentPreferences,
        protocols: profile.protocols,
        yearsExperience: profile.yearsExperience,
        verified: profile.verified,
        availabilityStatus: profile.availabilityStatus,
        targetCompensation: profile.targetCompensation,
        match: request ? scorePractitionerForRequest(profile, request) : undefined,
      }));

    const sorted = candidates.sort((left, right) => {
      const leftScore = left.match?.score ?? 0;
      const rightScore = right.match?.score ?? 0;
      return rightScore - leftScore;
    });

    res.json({ candidates: sorted });
  }),
);

router.post(
  '/staffing-requests',
  asyncHandler(async (req, res) => {
    const actor = await requireClinicActor(req);
    const input = req.body as StaffingRequestInput;
    const payload = buildRequestPayload(actor, input);
    const requestRef = await adminDb.collection(COLLECTIONS.requests).add({
      ...payload,
      applicationCount: 0,
      matchCount: 0,
      createdAt: FieldValue.serverTimestamp(),
    });

    const request = await fetchRequestById(requestRef.id);
    if (!request) {
      throw new WorkforceHttpError(500, 'Failed to create staffing request.');
    }

    const matchCount = await countPotentialMatches(request);
    await adminDb.collection(COLLECTIONS.requests).doc(request.id).set(
      { matchCount, updatedAt: FieldValue.serverTimestamp() },
      { merge: true },
    );

    await createNotification(actor.uid, {
      title: 'Staffing request opened',
      body: `Your requisition for ${request.title} is now live in the exchange.`,
      type: 'staffing_request_created',
      entityId: request.id,
      entityType: 'request',
      link: '/dashboard/workforce?tab=requisitions',
    });

    await notifySubmission({
      category: 'staffing_request',
      title: 'New staffing request opened',
      entityType: 'staffingRequest',
      entityId: request.id,
      summary: `${request.clinicName} opened a ${request.role} requisition for the workforce exchange.`,
      route: '/api/workforce/staffing-requests',
      replyTo: actor.email,
      adminPath: '/admin/command-center',
      emailFields: [
        { label: 'Request ID', value: request.id },
        { label: 'Clinic', value: request.clinicName },
        { label: 'Title', value: request.title },
        { label: 'Role', value: request.role },
        { label: 'Work Mode', value: request.workMode },
        { label: 'Urgency', value: request.urgency },
        { label: 'Compensation', value: request.compensation },
        { label: 'Description', value: truncateText(request.description, 800) },
      ],
      slackFields: [
        { label: 'Request ID', value: request.id },
        { label: 'Clinic', value: request.clinicName },
        { label: 'Role', value: request.role },
        { label: 'Urgency', value: request.urgency },
      ],
      metadata: {
        clinicId: request.clinicId,
        requestId: request.id,
        matchCount,
      },
    });

    res.status(201).json({
      request: {
        ...request,
        matchCount,
      },
    });
  }),
);

router.patch(
  '/staffing-requests/:id',
  asyncHandler(async (req, res) => {
    const actor = await requireClinicActor(req);
    const request = await fetchRequestById(req.params.id);

    if (!request) {
      throw new WorkforceHttpError(404, 'Staffing request not found.');
    }

    if (request.clinicId !== actor.uid && !isAdminRole(actor.role)) {
      throw new WorkforceHttpError(403, 'Not authorized to update this staffing request.');
    }

    const payload = buildRequestPayload(actor, req.body as StaffingRequestInput);
    await adminDb.collection(COLLECTIONS.requests).doc(request.id).set(payload, { merge: true });
    const updatedRequest = await fetchRequestById(request.id);
    if (!updatedRequest) {
      throw new WorkforceHttpError(500, 'Failed to update staffing request.');
    }

    const matchCount = await countPotentialMatches(updatedRequest);
    await adminDb.collection(COLLECTIONS.requests).doc(updatedRequest.id).set(
      { matchCount, updatedAt: FieldValue.serverTimestamp() },
      { merge: true },
    );

    res.json({
      request: {
        ...updatedRequest,
        matchCount,
      },
    });
  }),
);

router.post(
  '/applications',
  asyncHandler(async (req, res) => {
    const actor = await requireAuthenticatedActor(req);
    const input = req.body as WorkforceApplicationInput;
    const profile = await fetchPractitionerProfile(actor.uid);

    if (!profile) {
      throw new WorkforceHttpError(400, 'Create your practitioner profile before applying.');
    }

    if (profile.availabilityStatus === 'inactive' || profile.availabilityStatus === 'placed') {
      throw new WorkforceHttpError(409, 'Update your availability before submitting new applications.');
    }

    const request = await fetchRequestById(input.requestId);
    if (!request) {
      throw new WorkforceHttpError(404, 'Staffing request not found.');
    }

    if (!ACTIVE_REQUEST_STATUSES.includes(request.status)) {
      throw new WorkforceHttpError(400, 'This requisition is not accepting applications.');
    }

    const existingApplicationsSnapshot = await adminDb
      .collection(COLLECTIONS.applications)
      .where('requestId', '==', request.id)
      .where('practitionerId', '==', actor.uid)
      .get();

    const existingApplication = existingApplicationsSnapshot.docs
      .map((docSnapshot) => serializeApplication(docSnapshot.id, docSnapshot.data() ?? {}))
      .find((application) =>
        !['rejected', 'offer_declined', 'withdrawn'].includes(application.status),
      );

    if (existingApplication) {
      throw new WorkforceHttpError(409, 'You already have an active application for this requisition.');
    }

    const match = scorePractitionerForRequest(profile, request);
    const applicationRef = await adminDb.collection(COLLECTIONS.applications).add({
      requestId: request.id,
      clinicId: request.clinicId,
      clinicName: request.clinicName,
      requestTitle: request.title,
      practitionerId: actor.uid,
      practitionerName: `${profile.firstName} ${profile.lastName}`.trim(),
      practitionerRole: profile.role,
      practitionerLocation: profile.location.label,
      status: 'applied',
      coverNote: sanitizeString(input.coverNote),
      match,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    const application = await fetchApplicationById(applicationRef.id);
    if (!application) {
      throw new WorkforceHttpError(500, 'Failed to create application.');
    }

    await synchronizeRequest(request.id);
    await syncPractitionerAvailability(actor.uid);

    await createNotification(actor.uid, {
      title: 'Application submitted',
      body: `Your application to ${request.clinicName} for ${request.title} is now under review.`,
      type: 'application_submitted',
      entityId: application.id,
      entityType: 'application',
      link: '/workforce/dashboard?tab=applications',
    });

    await createNotification(request.clinicId, {
      title: 'New candidate application',
      body: `${application.practitionerName} applied to ${request.title}.`,
      type: 'application_submitted',
      entityId: application.id,
      entityType: 'application',
      link: `/dashboard/workforce?tab=pipeline&requestId=${request.id}`,
    });

    await notifySubmission({
      category: 'workforce_application',
      title: 'New workforce application',
      entityType: 'workforceApplication',
      entityId: application.id,
      summary: `${application.practitionerName} applied to ${request.title} at ${request.clinicName}.`,
      route: '/api/workforce/applications',
      replyTo: actor.email,
      adminPath: '/admin/command-center',
      emailFields: [
        { label: 'Application ID', value: application.id },
        { label: 'Practitioner', value: application.practitionerName },
        { label: 'Practitioner Email', value: actor.email || '' },
        { label: 'Clinic', value: request.clinicName },
        { label: 'Request', value: request.title },
        { label: 'Match Score', value: `${application.match.score}%` },
        { label: 'Cover Note', value: truncateText(application.coverNote, 600) || 'None provided' },
      ],
      slackFields: [
        { label: 'Application ID', value: application.id },
        { label: 'Practitioner', value: maskName(application.practitionerName) },
        { label: 'Practitioner Email', value: maskEmail(actor.email || '') },
        { label: 'Clinic', value: request.clinicName },
        { label: 'Match', value: `${application.match.score}%` },
      ],
      metadata: {
        requestId: request.id,
        clinicId: request.clinicId,
        practitionerId: actor.uid,
      },
    });

    res.status(201).json({ application });
  }),
);

router.patch(
  '/applications/:id/status',
  asyncHandler(async (req, res) => {
    const actor = await requireAuthenticatedActor(req);
    const application = await fetchApplicationById(req.params.id);

    if (!application) {
      throw new WorkforceHttpError(404, 'Application not found.');
    }

    const nextStatus = ensureEnumValue(
      req.body?.status,
      APPLICATION_STATUSES,
      'application status',
    );

    const actorOwnsApplication = application.practitionerId === actor.uid;
    const actorOwnsClinic = application.clinicId === actor.uid;
    if (!actorOwnsApplication && !actorOwnsClinic && !isAdminRole(actor.role)) {
      throw new WorkforceHttpError(403, 'Not authorized to update this application.');
    }

    if (actorOwnsApplication && nextStatus !== 'withdrawn' && !isAdminRole(actor.role)) {
      throw new WorkforceHttpError(403, 'Practitioners can only withdraw their application directly.');
    }

    if (actorOwnsClinic && !isAdminRole(actor.role) && !CLINIC_APPLICATION_MANUAL_STATUSES.includes(nextStatus)) {
      throw new WorkforceHttpError(403, 'Clinics can only move applications to screening or rejection from this endpoint.');
    }

    if (
      !isAdminRole(actor.role) &&
      ['offer_accepted', 'rejected', 'withdrawn'].includes(application.status) &&
      application.status !== nextStatus
    ) {
      throw new WorkforceHttpError(409, 'This application is already closed.');
    }

    await adminDb.collection(COLLECTIONS.applications).doc(application.id).set(
      {
        status: nextStatus,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    await synchronizeRequest(application.requestId);
    await syncPractitionerAvailability(application.practitionerId);
    const updatedApplication = await fetchApplicationById(application.id);
    if (!updatedApplication) {
      throw new WorkforceHttpError(500, 'Failed to update application.');
    }

    await createNotification(application.practitionerId, {
      title: 'Application stage updated',
      body: `${application.requestTitle} moved to ${nextStatus.replace(/_/g, ' ')}.`,
      type: 'application_status_changed',
      entityId: application.id,
      entityType: 'application',
      link: '/workforce/dashboard?tab=applications',
    });

    res.json({ application: updatedApplication });
  }),
);

router.post(
  '/interviews',
  asyncHandler(async (req, res) => {
    const actor = await requireClinicActor(req);
    const input = req.body as WorkforceInterviewInput;
    const application = await fetchApplicationById(input.applicationId);

    if (!application) {
      throw new WorkforceHttpError(404, 'Application not found.');
    }

    if (application.clinicId !== actor.uid && !isAdminRole(actor.role)) {
      throw new WorkforceHttpError(403, 'Not authorized to schedule this interview.');
    }

    if (['rejected', 'withdrawn', 'offer_extended', 'offer_accepted', 'offer_declined'].includes(application.status)) {
      throw new WorkforceHttpError(409, 'This application is not eligible for a new interview.');
    }

    const scheduledAt = ensureIsoLikeDateString(input.scheduledAt, 'Interview date');
    const durationMinutes = Math.max(15, sanitizeNumber(input.durationMinutes, 30));
    const mode = ensureEnumValue(input.mode, INTERVIEW_MODES, 'interview mode');
    const location = ensureRequiredString(input.location, 'Interview location');
    const existingScheduledInterviewSnapshot = await adminDb
      .collection(COLLECTIONS.interviews)
      .where('applicationId', '==', application.id)
      .where('status', '==', 'scheduled')
      .get();

    if (!existingScheduledInterviewSnapshot.empty) {
      throw new WorkforceHttpError(409, 'This application already has a scheduled interview. Update it instead.');
    }

    const interviewRef = await adminDb.collection(COLLECTIONS.interviews).add({
      applicationId: application.id,
      requestId: application.requestId,
      clinicId: application.clinicId,
      practitionerId: application.practitionerId,
      scheduledAt,
      durationMinutes,
      mode,
      location,
      meetingLink: sanitizeString(input.meetingLink) || null,
      notes: sanitizeString(input.notes) || null,
      status: 'scheduled',
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    await adminDb.collection(COLLECTIONS.applications).doc(application.id).set(
      {
        status: 'interview_scheduled',
        latestInterviewId: interviewRef.id,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    await synchronizeRequest(application.requestId);
    await syncPractitionerAvailability(application.practitionerId);

    const interview = await fetchInterviewById(interviewRef.id);
    if (!interview) {
      throw new WorkforceHttpError(500, 'Failed to schedule interview.');
    }

    await createNotification(application.practitionerId, {
      title: 'Interview scheduled',
      body: `${application.clinicName} scheduled an interview for ${application.requestTitle}.`,
      type: 'interview_scheduled',
      entityId: interview.id,
      entityType: 'interview',
      link: '/workforce/dashboard?tab=applications',
    });

    await createNotification(application.clinicId, {
      title: 'Interview confirmed',
      body: `Interview scheduled with ${application.practitionerName} for ${application.requestTitle}.`,
      type: 'interview_scheduled',
      entityId: interview.id,
      entityType: 'interview',
      link: `/dashboard/workforce?tab=pipeline&requestId=${application.requestId}`,
    });

    res.status(201).json({ interview });
  }),
);

router.patch(
  '/interviews/:id',
  asyncHandler(async (req, res) => {
    const actor = await requireAuthenticatedActor(req);
    const interview = await fetchInterviewById(req.params.id);

    if (!interview) {
      throw new WorkforceHttpError(404, 'Interview not found.');
    }

    if (
      interview.practitionerId !== actor.uid &&
      interview.clinicId !== actor.uid &&
      !isAdminRole(actor.role)
    ) {
      throw new WorkforceHttpError(403, 'Not authorized to update this interview.');
    }

    const status = req.body?.status === undefined
      ? interview.status
      : ensureEnumValue(req.body?.status, INTERVIEW_STATUSES, 'interview status');
    const scheduledAt = req.body?.scheduledAt === undefined
      ? interview.scheduledAt
      : ensureIsoLikeDateString(req.body?.scheduledAt, 'Interview date');
    const durationMinutes = req.body?.durationMinutes === undefined
      ? interview.durationMinutes
      : Math.max(15, sanitizeNumber(req.body?.durationMinutes, interview.durationMinutes));
    const mode = req.body?.mode === undefined
      ? interview.mode
      : ensureEnumValue(req.body?.mode, INTERVIEW_MODES, 'interview mode');
    const location = req.body?.location === undefined
      ? interview.location
      : ensureRequiredString(req.body?.location, 'Interview location');
    await adminDb.collection(COLLECTIONS.interviews).doc(interview.id).set(
      {
        status,
        scheduledAt,
        durationMinutes,
        mode,
        location,
        meetingLink: sanitizeString(req.body?.meetingLink) || interview.meetingLink || null,
        notes: sanitizeString(req.body?.notes) || interview.notes || null,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    if (status === 'completed') {
      await adminDb.collection(COLLECTIONS.applications).doc(interview.applicationId).set(
        {
          status: 'interview_completed',
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
    } else if (status === 'cancelled') {
      await adminDb.collection(COLLECTIONS.applications).doc(interview.applicationId).set(
        {
          status: 'screening',
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
    }

    await synchronizeRequest(interview.requestId);
    await syncPractitionerAvailability(interview.practitionerId);
    const updatedInterview = await fetchInterviewById(interview.id);
    if (!updatedInterview) {
      throw new WorkforceHttpError(500, 'Failed to update interview.');
    }

    await createNotification(interview.practitionerId, {
      title: 'Interview updated',
      body: `Your interview status is now ${status.replace(/_/g, ' ')}.`,
      type: 'interview_updated',
      entityId: interview.id,
      entityType: 'interview',
      link: '/workforce/dashboard?tab=applications',
    });

    res.json({ interview: updatedInterview });
  }),
);

router.post(
  '/offers',
  asyncHandler(async (req, res) => {
    const actor = await requireClinicActor(req);
    const input = req.body as WorkforceOfferInput;
    const application = await fetchApplicationById(input.applicationId);

    if (!application) {
      throw new WorkforceHttpError(404, 'Application not found.');
    }

    if (application.clinicId !== actor.uid && !isAdminRole(actor.role)) {
      throw new WorkforceHttpError(403, 'Not authorized to extend this offer.');
    }

    if (application.status !== 'interview_completed' && !isAdminRole(actor.role)) {
      throw new WorkforceHttpError(409, 'Complete the interview before extending an offer.');
    }

    const compensation = ensureRequiredString(input.compensation, 'Offer compensation');
    const startDate = ensureIsoLikeDateString(input.startDate, 'Offer start date');
    const expiresAt = ensureIsoLikeDateString(input.expiresAt, 'Offer expiration date');
    if (new Date(expiresAt).getTime() < new Date(startDate).getTime()) {
      throw new WorkforceHttpError(400, 'Offer expiration date must be on or after the start date.');
    }

    const existingOfferSnapshot = await adminDb
      .collection(COLLECTIONS.offers)
      .where('applicationId', '==', application.id)
      .where('status', '==', 'extended')
      .get();

    if (!existingOfferSnapshot.empty) {
      throw new WorkforceHttpError(409, 'This application already has an active offer.');
    }

    const offerRef = await adminDb.collection(COLLECTIONS.offers).add({
      applicationId: application.id,
      requestId: application.requestId,
      clinicId: application.clinicId,
      practitionerId: application.practitionerId,
      compensation,
      startDate,
      expiresAt,
      notes: sanitizeString(input.notes) || null,
      status: 'extended',
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    await adminDb.collection(COLLECTIONS.applications).doc(application.id).set(
      {
        status: 'offer_extended',
        latestOfferId: offerRef.id,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    await synchronizeRequest(application.requestId);
    await syncPractitionerAvailability(application.practitionerId);

    const offer = await fetchOfferById(offerRef.id);
    if (!offer) {
      throw new WorkforceHttpError(500, 'Failed to create offer.');
    }

    await createNotification(application.practitionerId, {
      title: 'Offer extended',
      body: `${application.clinicName} sent an offer for ${application.requestTitle}.`,
      type: 'offer_extended',
      entityId: offer.id,
      entityType: 'offer',
      link: '/workforce/dashboard?tab=applications',
    });

    res.status(201).json({ offer });
  }),
);

router.patch(
  '/offers/:id',
  asyncHandler(async (req, res) => {
    const actor = await requireAuthenticatedActor(req);
    const offer = await fetchOfferById(req.params.id);

    if (!offer) {
      throw new WorkforceHttpError(404, 'Offer not found.');
    }

    if (
      offer.practitionerId !== actor.uid &&
      offer.clinicId !== actor.uid &&
      !isAdminRole(actor.role)
    ) {
      throw new WorkforceHttpError(403, 'Not authorized to update this offer.');
    }

    const nextStatus = ensureEnumValue(req.body?.status, OFFER_STATUSES, 'offer status');

    if (
      offer.practitionerId === actor.uid &&
      !['accepted', 'declined'].includes(nextStatus) &&
      !isAdminRole(actor.role)
    ) {
      throw new WorkforceHttpError(403, 'Practitioners can only accept or decline offers.');
    }

    if (!isAdminRole(actor.role) && offer.status !== 'extended' && offer.status !== nextStatus) {
      throw new WorkforceHttpError(409, 'This offer has already been resolved.');
    }

    await adminDb.collection(COLLECTIONS.offers).doc(offer.id).set(
      {
        status: nextStatus,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    const applicationStatus: ApplicationStatus =
      nextStatus === 'accepted'
        ? 'offer_accepted'
        : nextStatus === 'declined'
          ? 'offer_declined'
          : 'offer_extended';

    await adminDb.collection(COLLECTIONS.applications).doc(offer.applicationId).set(
      {
        status: applicationStatus,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    await synchronizeRequest(offer.requestId);
    await syncPractitionerAvailability(offer.practitionerId);
    const updatedOffer = await fetchOfferById(offer.id);
    if (!updatedOffer) {
      throw new WorkforceHttpError(500, 'Failed to update offer.');
    }

    await createNotification(offer.clinicId, {
      title: 'Offer response received',
      body: `A practitioner has ${nextStatus} the offer.`,
      type: 'offer_status_changed',
      entityId: offer.id,
      entityType: 'offer',
      link: '/dashboard/workforce?tab=notifications',
    });

    await createNotification(offer.practitionerId, {
      title: 'Offer updated',
      body: `Your offer is now ${nextStatus}.`,
      type: 'offer_status_changed',
      entityId: offer.id,
      entityType: 'offer',
      link: '/workforce/dashboard?tab=applications',
    });

    res.json({ offer: updatedOffer });
  }),
);

router.get(
  '/dashboard/practitioner',
  asyncHandler(async (req, res) => {
    const actor = await requireAuthenticatedActor(req);
    const profile = await fetchPractitionerProfile(actor.uid);
    const applicationsSnapshot = await adminDb
      .collection(COLLECTIONS.applications)
      .where('practitionerId', '==', actor.uid)
      .get();
    const interviewsSnapshot = await adminDb
      .collection(COLLECTIONS.interviews)
      .where('practitionerId', '==', actor.uid)
      .get();
    const offersSnapshot = await adminDb
      .collection(COLLECTIONS.offers)
      .where('practitionerId', '==', actor.uid)
      .get();

    const applications = sortByIsoDesc(
      applicationsSnapshot.docs.map((docSnapshot) =>
        serializeApplication(docSnapshot.id, docSnapshot.data() ?? {}),
      ),
    );
    const interviews = sortByIsoDesc(
      interviewsSnapshot.docs.map((docSnapshot) =>
        serializeInterview(docSnapshot.id, docSnapshot.data() ?? {}),
      ),
    );
    const offers = sortByIsoDesc(
      offersSnapshot.docs.map((docSnapshot) =>
        serializeOffer(docSnapshot.id, docSnapshot.data() ?? {}),
      ),
    );
    const notifications = await fetchNotificationsForUser(actor.uid);

    let opportunities: WorkforceOpportunity[] = [];
    if (profile && profile.availabilityStatus !== 'inactive' && profile.availabilityStatus !== 'placed') {
      const requestsSnapshot = await adminDb.collection(COLLECTIONS.requests).get();
      const appliedRequestIds = new Set(applications.map((application) => application.requestId));
      opportunities = requestsSnapshot.docs
        .map((docSnapshot) =>
          serializeStaffingRequest(docSnapshot.id, docSnapshot.data() ?? {}),
        )
        .filter((request) => ACTIVE_REQUEST_STATUSES.includes(request.status))
        .filter((request) => !appliedRequestIds.has(request.id))
        .map((request) => ({
          ...request,
          match: scorePractitionerForRequest(profile, request),
        }))
        .sort((left, right) => (right.match?.score ?? 0) - (left.match?.score ?? 0))
        .slice(0, 6);
    }

    const payload: PractitionerDashboardData = {
      profile,
      applications,
      opportunities,
      interviews,
      offers,
      notifications: notifications.slice(0, 20),
    };

    res.json(payload);
  }),
);

router.get(
  '/dashboard/clinic',
  asyncHandler(async (req, res) => {
    const actor = await requireClinicActor(req);
    const requestsSnapshot = await adminDb
      .collection(COLLECTIONS.requests)
      .where('clinicId', '==', actor.uid)
      .get();
    const applicationsSnapshot = await adminDb
      .collection(COLLECTIONS.applications)
      .where('clinicId', '==', actor.uid)
      .get();
    const interviewsSnapshot = await adminDb
      .collection(COLLECTIONS.interviews)
      .where('clinicId', '==', actor.uid)
      .get();
    const offersSnapshot = await adminDb
      .collection(COLLECTIONS.offers)
      .where('clinicId', '==', actor.uid)
      .get();

    const applications = sortByIsoDesc(
      applicationsSnapshot.docs.map((docSnapshot) =>
        serializeApplication(docSnapshot.id, docSnapshot.data() ?? {}),
      ),
    );
    const requests = await Promise.all(
      requestsSnapshot.docs.map(async (docSnapshot) => {
        const request = serializeStaffingRequest(docSnapshot.id, docSnapshot.data() ?? {});
        const matchCount = await countPotentialMatches(request);
        return {
          ...request,
          applicationCount: applications.filter(
            (application) => application.requestId === request.id,
          ).length,
          matchCount,
        };
      }),
    );
    const interviews = sortByIsoDesc(
      interviewsSnapshot.docs.map((docSnapshot) =>
        serializeInterview(docSnapshot.id, docSnapshot.data() ?? {}),
      ),
    );
    const offers = sortByIsoDesc(
      offersSnapshot.docs.map((docSnapshot) =>
        serializeOffer(docSnapshot.id, docSnapshot.data() ?? {}),
      ),
    );
    const notifications = await fetchNotificationsForUser(actor.uid);

    const payload: ClinicDashboardData = {
      requests: sortByIsoDesc(requests),
      applications,
      interviews,
      offers,
      notifications: notifications.slice(0, 20),
    };

    res.json(payload);
  }),
);

router.get(
  '/notifications',
  asyncHandler(async (req, res) => {
    const actor = await requireAuthenticatedActor(req);
    const notifications = await fetchNotificationsForUser(actor.uid);
    res.json({ notifications });
  }),
);

router.patch(
  '/notifications/:id/read',
  asyncHandler(async (req, res) => {
    const actor = await requireAuthenticatedActor(req);
    const notificationRef = adminDb.collection(COLLECTIONS.notifications).doc(req.params.id);
    const notificationSnapshot = await notificationRef.get();

    if (!notificationSnapshot.exists) {
      throw new WorkforceHttpError(404, 'Notification not found.');
    }

    const notification = serializeNotification(
      notificationSnapshot.id,
      notificationSnapshot.data() ?? {},
    );

    if (notification.userId !== actor.uid && !isAdminRole(actor.role)) {
      throw new WorkforceHttpError(403, 'Not authorized to update this notification.');
    }

    await notificationRef.set(
      {
        status: 'read',
      },
      { merge: true },
    );

    res.json({ success: true });
  }),
);

export default router;
