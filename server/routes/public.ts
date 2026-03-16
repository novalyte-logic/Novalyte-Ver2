import { Router, type Request, type Response } from 'express';
import { createDocumentId } from '../../shared/documentStore';
import { deliverSubmissionAlert, maskEmail, maskName, maskPhone, truncateText } from '../lib/correspondence';
import { adminDb, Timestamp } from '../lib/supabaseAdmin';

const publicRouter = Router();

type ContactRole = 'patient' | 'clinic' | 'vendor' | 'other';
type ContactIntent = 'support' | 'partnership' | 'billing' | 'technical' | 'general';
type ContactUrgency = 'low' | 'medium' | 'high';
type ClinicApplicationResult = 'approved' | 'manual_review' | 'rejected';
type PatientAssessmentPayload = {
  goal: string;
  symptoms: string[];
  urgency: string;
  paymentPreference: string;
  budget: string;
  labWork: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  zip: string;
  preferredClinicId?: string;
  entryPoint?: string;
};
type ClinicMatch = {
  clinic: Record<string, unknown>;
  score: number;
  matchedSignals: string[];
  routingMode: 'preferred_clinic' | 'network_match';
  routingReason: string;
};

class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function getRequiredString(
  payload: Record<string, unknown>,
  field: string,
  minLength = 1,
  maxLength = 500,
) {
  const raw = payload[field];
  if (typeof raw !== 'string') {
    throw new HttpError(400, `${field} is required.`);
  }

  const value = raw.trim();
  if (value.length < minLength) {
    throw new HttpError(400, `${field} must be at least ${minLength} characters.`);
  }
  if (value.length > maxLength) {
    throw new HttpError(400, `${field} must be at most ${maxLength} characters.`);
  }

  return value;
}

function getOptionalString(
  payload: Record<string, unknown>,
  field: string,
  maxLength = 1000,
) {
  const raw = payload[field];
  if (raw === undefined || raw === null || raw === '') {
    return '';
  }
  if (typeof raw !== 'string') {
    throw new HttpError(400, `${field} must be a string.`);
  }

  const value = raw.trim();
  if (value.length > maxLength) {
    throw new HttpError(400, `${field} must be at most ${maxLength} characters.`);
  }

  return value;
}

function getRequiredEnum<T extends string>(
  payload: Record<string, unknown>,
  field: string,
  values: readonly T[],
) {
  const value = getRequiredString(payload, field, 1, 120) as T;
  if (!values.includes(value)) {
    throw new HttpError(400, `${field} must be one of: ${values.join(', ')}.`);
  }
  return value;
}

function getStringArray(
  payload: Record<string, unknown>,
  field: string,
  maxItems = 12,
  maxItemLength = 120,
) {
  const raw = payload[field];
  if (raw === undefined || raw === null) {
    return [] as string[];
  }
  if (!Array.isArray(raw)) {
    throw new HttpError(400, `${field} must be an array.`);
  }

  const values = raw
    .filter((entry): entry is string => typeof entry === 'string')
    .map((entry) => entry.trim())
    .filter(Boolean);

  if (values.length > maxItems) {
    throw new HttpError(400, `${field} must contain at most ${maxItems} items.`);
  }
  if (values.some((entry) => entry.length > maxItemLength)) {
    throw new HttpError(400, `${field} contains an item that is too long.`);
  }

  return values;
}

function assertEmail(value: string, field: string) {
  const normalized = value.toLowerCase();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(normalized)) {
    throw new HttpError(400, `${field} must be a valid email address.`);
  }
  return normalized;
}

function assertUrl(value: string, field: string) {
  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new Error('unsupported protocol');
    }
    return url.toString();
  } catch {
    throw new HttpError(400, `${field} must be a valid URL.`);
  }
}

function createReferenceId(prefix: string) {
  return `${prefix}-${createDocumentId().replace(/-/g, '').slice(0, 10).toUpperCase()}`;
}

function buildRequestContext(req: Request) {
  return {
    ip: req.headers['x-forwarded-for'] || req.ip || '',
    origin: req.get('origin') || '',
    referer: req.get('referer') || '',
    userAgent: req.get('user-agent') || '',
  };
}

function normalizeEntryPoint(value: string) {
  const normalized = value.trim().toLowerCase();
  const allowedValues = new Set([
    'patient_landing',
    'symptom_checker',
    'directory',
    'clinic_profile',
    'ask_ai',
    'direct',
  ]);

  return allowedValues.has(normalized) ? normalized : 'direct';
}

function classifyContact(message: string) {
  const normalized = message.toLowerCase();

  let intent: ContactIntent = 'general';
  if (
    normalized.includes('help') ||
    normalized.includes('issue') ||
    normalized.includes('broken') ||
    normalized.includes('error') ||
    normalized.includes('login')
  ) {
    intent = 'technical';
  } else if (
    normalized.includes('partner') ||
    normalized.includes('join') ||
    normalized.includes('integrate') ||
    normalized.includes('marketplace')
  ) {
    intent = 'partnership';
  } else if (
    normalized.includes('charge') ||
    normalized.includes('invoice') ||
    normalized.includes('billing') ||
    normalized.includes('pay')
  ) {
    intent = 'billing';
  } else if (
    normalized.includes('treatment') ||
    normalized.includes('doctor') ||
    normalized.includes('protocol') ||
    normalized.includes('assessment')
  ) {
    intent = 'support';
  }

  let urgency: ContactUrgency = 'low';
  if (
    normalized.includes('urgent') ||
    normalized.includes('emergency') ||
    normalized.includes('immediately') ||
    normalized.includes('asap')
  ) {
    urgency = 'high';
  } else if (
    normalized.includes('soon') ||
    normalized.includes('issue') ||
    normalized.includes('error') ||
    normalized.includes('blocked')
  ) {
    urgency = 'medium';
  }

  return { intent, urgency };
}

function resolveRoutingDestination(role: ContactRole, intent: ContactIntent) {
  if (intent === 'technical') {
    return role === 'clinic' ? 'Clinical Operations' : 'Platform Support';
  }
  if (intent === 'billing') {
    return 'Revenue Operations';
  }
  if (intent === 'partnership') {
    return role === 'vendor' ? 'Marketplace Partnerships' : 'Strategic Partnerships';
  }
  if (role === 'patient') {
    return 'Patient Success Team';
  }
  if (role === 'clinic') {
    return 'Clinical Operations';
  }
  if (role === 'vendor') {
    return 'Marketplace Partnerships';
  }
  return 'General Triage';
}

function resolveExpectedResponseTime(urgency: ContactUrgency) {
  if (urgency === 'high') {
    return '< 2 Hours';
  }
  if (urgency === 'medium') {
    return '< 12 Hours';
  }
  return '24-48 Hours';
}

function evaluateClinicApplication(payload: {
  isFranchise: string;
  monthlyVolume: string;
  frontDeskStaff: string;
  emr: string;
  investment: string;
}): ClinicApplicationResult {
  if (
    payload.monthlyVolume === 'Under 50' ||
    payload.frontDeskStaff === '0' ||
    payload.emr === 'Paper / None' ||
    payload.investment === 'No'
  ) {
    return 'rejected';
  }

  if (
    payload.isFranchise === 'Yes' ||
    payload.monthlyVolume === '50 - 100' ||
    payload.emr === 'Other / Custom'
  ) {
    return 'manual_review';
  }

  return 'approved';
}

function isRoutableClinicStatus(value: unknown) {
  if (typeof value !== 'string') {
    return false;
  }
  const normalized = value.trim().toLowerCase();
  return normalized === 'active' || normalized === 'verified';
}

function getClinicSpecialties(clinic: Record<string, unknown>) {
  const direct = Array.isArray(clinic.specialties) ? clinic.specialties : [];
  const tags = Array.isArray(clinic.tags) ? clinic.tags : [];
  return [...direct, ...tags]
    .filter((entry): entry is string => typeof entry === 'string')
    .map((entry) => entry.trim().toLowerCase());
}

function tokenizeText(value: string) {
  return value
    .toLowerCase()
    .split(/[^a-z0-9]+/i)
    .map((entry) => entry.trim())
    .filter((entry) => entry.length >= 3);
}

function uniqueStrings(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function normalizeZip(value: string) {
  return value.replace(/\D/g, '').slice(0, 5);
}

function getBudgetTierRank(value: string) {
  const normalized = value.toLowerCase();
  if (normalized.includes('1000')) {
    return 4;
  }
  if (normalized.includes('500 - $1,000') || normalized.includes('500')) {
    return 3;
  }
  if (normalized.includes('200 - $500') || normalized.includes('200')) {
    return 2;
  }
  if (normalized.includes('under $200')) {
    return 1;
  }
  return 2;
}

function getPricingTierRank(value: unknown) {
  if (typeof value !== 'string') {
    return 2;
  }

  switch (value.trim().toLowerCase()) {
    case 'elite':
      return 4;
    case 'premium':
      return 3;
    case 'standard':
      return 2;
    case 'basic':
      return 1;
    default:
      return 2;
  }
}

function getUrgencyWeight(value: string) {
  const normalized = value.toLowerCase();
  if (normalized.includes('48 hours') || normalized.includes('immediately')) {
    return 3;
  }
  if (normalized.includes('this week')) {
    return 2;
  }
  if (normalized.includes('month')) {
    return 1;
  }
  return 0;
}

function getGoalKeywords(goal: string) {
  const normalized = goal.toLowerCase();

  if (normalized.includes('hormone')) {
    return ['hormone', 'testosterone', 'trt', 'metabolic', 'libido'];
  }
  if (normalized.includes('cognitive')) {
    return ['cognitive', 'brain', 'focus', 'memory', 'neuro'];
  }
  if (normalized.includes('longevity')) {
    return ['longevity', 'aging', 'recovery', 'performance', 'metabolic'];
  }
  if (normalized.includes('weight')) {
    return ['weight', 'metabolic', 'glucose', 'nutrition', 'body'];
  }

  return ['wellness', 'recovery', 'performance', 'health'];
}

function getClinicCoverageSignals(clinic: Record<string, unknown>) {
  const protocolSignals = getClinicProtocols(clinic).flatMap((protocol) =>
    tokenizeText(`${protocol.name} ${protocol.description}`),
  );
  const providerSignals = getClinicProviders(clinic).flatMap((provider) =>
    tokenizeText(`${provider.role} ${provider.credentials} ${provider.bio}`),
  );
  const descriptionSignals =
    typeof clinic.description === 'string' ? tokenizeText(clinic.description) : [];

  return uniqueStrings([
    ...getClinicSpecialties(clinic),
    ...protocolSignals,
    ...providerSignals,
    ...descriptionSignals,
  ]);
}

function getAssessmentSignals(payload: PatientAssessmentPayload) {
  return uniqueStrings([
    ...tokenizeText(payload.goal),
    ...payload.symptoms.flatMap((symptom) => tokenizeText(symptom)),
    ...getGoalKeywords(payload.goal),
  ]);
}

function scoreClinicMatch(payload: PatientAssessmentPayload, clinic: Record<string, unknown>): ClinicMatch {
  const coverageSignals = getClinicCoverageSignals(clinic);
  const requestedSignals = getAssessmentSignals(payload);
  const matchedSignals = coverageSignals.filter((entry) => requestedSignals.includes(entry));
  const acceptsInsurance = normalizeBoolean(clinic.acceptsInsurance);
  const acceptsNewPatients =
    normalizeBoolean(clinic.acceptsNewPatients) || clinic.acceptsNewPatients === undefined;
  const telehealth = normalizeBoolean(clinic.telehealth);
  const rating = normalizeNumber(clinic.rating, 4.5);
  const budgetRank = getBudgetTierRank(payload.budget);
  const pricingRank = getPricingTierRank(clinic.pricingTier);
  const urgencyWeight = getUrgencyWeight(payload.urgency);
  const locationBias = telehealth ? 6 : normalizeZip(payload.zip) ? 2 : 0;

  let score = Math.round(rating * 8);
  score += matchedSignals.length * 12;
  score += acceptsNewPatients ? 18 : -30;
  score += locationBias;

  if (payload.paymentPreference === 'Insurance Only') {
    score += acceptsInsurance ? 24 : -30;
  } else if (!acceptsInsurance) {
    score += 6;
  }

  if (budgetRank >= pricingRank) {
    score += 10;
  } else {
    score -= (pricingRank - budgetRank) * 8;
  }

  if (urgencyWeight >= 2 && !acceptsNewPatients) {
    score -= 12;
  }
  if (urgencyWeight >= 2 && telehealth) {
    score += 8;
  }

  const clinicId = typeof clinic.id === 'string' ? clinic.id : '';
  const isPreferredClinic = Boolean(payload.preferredClinicId && clinicId === payload.preferredClinicId);
  if (isPreferredClinic) {
    score += matchedSignals.length > 0 ? 14 : 4;
    if (acceptsNewPatients) {
      score += 8;
    }
  }

  const boundedScore = Math.max(0, Math.min(100, score));
  const matchedSignalsSummary = uniqueStrings(matchedSignals).slice(0, 4);
  const routingMode = isPreferredClinic ? 'preferred_clinic' : 'network_match';
  const routingReason =
    isPreferredClinic && acceptsNewPatients
      ? 'Prioritized your selected clinic because it is active, accepting new patients, and aligned with your intake.'
      : isPreferredClinic
        ? 'Reviewed your selected clinic first, then ranked it against live fit and availability signals.'
        : `Ranked against live specialty coverage, budget fit, urgency, and availability (${matchedSignalsSummary.join(', ') || 'network fit'}).`;

  return {
    clinic,
    score: boundedScore,
    matchedSignals: matchedSignalsSummary,
    routingMode,
    routingReason,
  };
}

async function findMatchedClinic(payload: PatientAssessmentPayload) {
  const snapshot = await adminDb.collection('clinics').get();

  const candidateDocs = snapshot.docs.map((doc) => {
    const data = (doc.data() ?? {}) as Record<string, unknown>;
    return {
      id: doc.id,
      ...data,
    } as Record<string, unknown>;
  });
  const candidates: Array<Record<string, unknown>> = candidateDocs.filter((clinic) =>
    isRoutableClinicStatus(clinic.status),
  );

  const scored = candidates
    .map((clinic) => scoreClinicMatch(payload, clinic))
    .sort((left, right) => right.score - left.score);

  const preferredClinicMatch = payload.preferredClinicId
    ? scored.find((entry) => typeof entry.clinic.id === 'string' && entry.clinic.id === payload.preferredClinicId)
    : null;

  if (preferredClinicMatch && preferredClinicMatch.score >= 60) {
    return preferredClinicMatch;
  }

  return scored[0] ?? null;
}

function serializeMatchedClinic(match: ClinicMatch | null) {
  if (!match) {
    return null;
  }

  const { clinic, score } = match;

  return {
    id: typeof clinic.id === 'string' ? clinic.id : '',
    name: typeof clinic.name === 'string' ? clinic.name : 'Clinic Match Pending',
    city: typeof clinic.city === 'string' ? clinic.city : '',
    state: typeof clinic.state === 'string' ? clinic.state : '',
    rating: typeof clinic.rating === 'number' ? clinic.rating : 4.5,
    pricingTier: typeof clinic.pricingTier === 'string' ? clinic.pricingTier : 'custom',
    matchScore: score,
    routingMode: match.routingMode,
    routingReason: match.routingReason,
    matchedSignals: match.matchedSignals,
  };
}

function normalizeStringArray(value: unknown, maxItems = 12) {
  if (!Array.isArray(value)) {
    return [] as string[];
  }

  return value
    .filter((entry): entry is string => typeof entry === 'string')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .slice(0, maxItems);
}

function normalizeBoolean(value: unknown) {
  return value === true || value === 'true' || value === 'Yes';
}

function normalizeNumber(value: unknown, fallback: number) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number.parseFloat(value.trim().replace(/,/g, ''));
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

function getClinicLocation(clinic: Record<string, unknown>) {
  const city = typeof clinic.city === 'string' ? clinic.city.trim() : '';
  const state = typeof clinic.state === 'string' ? clinic.state.trim() : '';

  if (city && state) {
    return `${city}, ${state}`;
  }

  return city || state || 'Location pending';
}

function formatPricingTierLabel(value: unknown) {
  if (typeof value !== 'string') {
    return 'Custom pricing';
  }

  switch (value.trim().toLowerCase()) {
    case 'elite':
      return '$$$$';
    case 'premium':
      return '$$$';
    case 'standard':
      return '$$';
    case 'basic':
      return '$';
    case 'custom':
      return 'Custom pricing';
    default:
      return value.trim();
  }
}

function getClinicDisplaySpecialties(clinic: Record<string, unknown>) {
  const specialties = normalizeStringArray(clinic.specialties, 8);
  const tags = normalizeStringArray(clinic.tags, 8);
  return [...new Set([...specialties, ...tags])].slice(0, 8);
}

function getClinicDescription(clinic: Record<string, unknown>) {
  if (typeof clinic.description === 'string' && clinic.description.trim()) {
    return clinic.description.trim();
  }

  const name = typeof clinic.name === 'string' ? clinic.name.trim() : 'This clinic';
  const location = getClinicLocation(clinic);
  const specialties = getClinicDisplaySpecialties(clinic);
  const telehealth = normalizeBoolean(clinic.telehealth);
  const insuranceCopy = normalizeBoolean(clinic.acceptsInsurance)
    ? 'Insurance-compatible intake may be available depending on the protocol.'
    : 'Most programs are structured as direct-pay optimization care.';

  if (specialties.length === 0) {
    return `${name} operates in ${location}. ${telehealth ? 'Telehealth intake is available. ' : ''}${insuranceCopy}`;
  }

  return `${name} operates in ${location} with a focus on ${specialties.slice(0, 3).join(', ')}. ${telehealth ? 'Telehealth intake is available. ' : ''}${insuranceCopy}`;
}

function getClinicFeatures(clinic: Record<string, unknown>) {
  const explicitFeatures = normalizeStringArray(clinic.features, 10);
  if (explicitFeatures.length > 0) {
    return explicitFeatures;
  }

  const derived = [
    normalizeBoolean(clinic.telehealth) ? 'Telehealth available' : null,
    normalizeBoolean(clinic.acceptsInsurance) ? 'Insurance-friendly intake' : 'Direct-pay optimization model',
    normalizeBoolean(clinic.acceptsNewPatients) || clinic.acceptsNewPatients === undefined
      ? 'Accepting new patients'
      : 'Waitlist only',
    normalizeBoolean(clinic.hl7Capable) ? 'Integration-ready' : null,
    normalizeBoolean(clinic.baaAccepted) ? 'BAA accepted' : null,
  ].filter((entry): entry is string => Boolean(entry));

  return [...new Set(derived)].slice(0, 8);
}

function getClinicProtocols(clinic: Record<string, unknown>) {
  const raw = clinic.protocols;
  if (!Array.isArray(raw)) {
    return [] as Array<{ name: string; description: string; duration: string; price: string }>;
  }

  return raw
    .map((entry) => {
      if (typeof entry === 'string') {
        const value = entry.trim();
        if (!value) {
          return null;
        }
        return {
          name: value,
          description: 'Protocol details are provided during clinical intake.',
          duration: 'Custom',
          price: 'Custom',
        };
      }

      if (!isPlainObject(entry)) {
        return null;
      }

      const name = typeof entry.name === 'string' ? entry.name.trim() : '';
      if (!name) {
        return null;
      }

      return {
        name,
        description:
          typeof entry.description === 'string' && entry.description.trim()
            ? entry.description.trim()
            : 'Protocol details are provided during clinical intake.',
        duration:
          typeof entry.duration === 'string' && entry.duration.trim() ? entry.duration.trim() : 'Custom',
        price: typeof entry.price === 'string' && entry.price.trim() ? entry.price.trim() : 'Custom',
      };
    })
    .filter((entry): entry is { name: string; description: string; duration: string; price: string } => Boolean(entry))
    .slice(0, 6);
}

function getClinicProviders(clinic: Record<string, unknown>) {
  const raw = clinic.providers;
  if (!Array.isArray(raw)) {
    return [] as Array<{ name: string; role: string; credentials: string; bio: string; image: string }>;
  }

  return raw
    .map((entry) => {
      if (!isPlainObject(entry)) {
        return null;
      }

      const name = typeof entry.name === 'string' ? entry.name.trim() : '';
      if (!name) {
        return null;
      }

      return {
        name,
        role: typeof entry.role === 'string' ? entry.role.trim() : 'Provider',
        credentials: typeof entry.credentials === 'string' ? entry.credentials.trim() : '',
        bio: typeof entry.bio === 'string' ? entry.bio.trim() : '',
        image: typeof entry.image === 'string' ? entry.image.trim() : '',
      };
    })
    .filter((entry): entry is { name: string; role: string; credentials: string; bio: string; image: string } => Boolean(entry))
    .slice(0, 8);
}

function getClinicOutcomes(clinic: Record<string, unknown>) {
  const raw = clinic.outcomes;
  if (!Array.isArray(raw)) {
    return [] as Array<{ metric: string; label: string; timeframe: string }>;
  }

  return raw
    .map((entry) => {
      if (!isPlainObject(entry)) {
        return null;
      }

      const metric = typeof entry.metric === 'string' ? entry.metric.trim() : '';
      const label = typeof entry.label === 'string' ? entry.label.trim() : '';
      if (!metric || !label) {
        return null;
      }

      return {
        metric,
        label,
        timeframe: typeof entry.timeframe === 'string' ? entry.timeframe.trim() : 'Recent',
      };
    })
    .filter((entry): entry is { metric: string; label: string; timeframe: string } => Boolean(entry))
    .slice(0, 6);
}

function getClinicGallery(clinic: Record<string, unknown>) {
  const gallery = normalizeStringArray(clinic.gallery, 6);
  if (gallery.length > 0) {
    return gallery;
  }

  if (typeof clinic.image === 'string' && clinic.image.trim()) {
    return [clinic.image.trim()];
  }

  return [] as string[];
}

function ensureHttpUrl(value: unknown) {
  if (typeof value !== 'string' || !value.trim()) {
    return '';
  }

  const trimmed = value.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

function isPublicClinic(clinic: Record<string, unknown>) {
  return isRoutableClinicStatus(clinic.status) && clinic.isPublic !== false;
}

async function loadPublicClinicRecords() {
  const snapshot = await adminDb.collection('clinics').get();
  return snapshot.docs
    .map((doc) => {
      const data = (doc.data() ?? {}) as Record<string, unknown>;
      return {
        id: doc.id,
        ...data,
      } as Record<string, unknown>;
    })
    .filter(isPublicClinic);
}

function serializePublicClinicCard(clinic: Record<string, unknown>) {
  const tags = getClinicDisplaySpecialties(clinic);
  return {
    id: typeof clinic.id === 'string' ? clinic.id : '',
    name: typeof clinic.name === 'string' ? clinic.name : 'Clinic Profile Pending',
    city: typeof clinic.city === 'string' ? clinic.city : '',
    state: typeof clinic.state === 'string' ? clinic.state : '',
    location: getClinicLocation(clinic),
    rating: normalizeNumber(clinic.rating, 4.5),
    reviewCount: normalizeNumber(clinic.reviewCount, 0),
    pricingTier: formatPricingTierLabel(clinic.pricingTier),
    tags,
    specialties: tags,
    image: typeof clinic.image === 'string' ? clinic.image.trim() : '',
    waitlist:
      typeof clinic.waitlist === 'string' && clinic.waitlist.trim()
        ? clinic.waitlist.trim()
        : normalizeBoolean(clinic.acceptsNewPatients) || clinic.acceptsNewPatients === undefined
          ? 'Accepting new patients'
          : 'Waitlist only',
    description: getClinicDescription(clinic),
    acceptsInsurance: normalizeBoolean(clinic.acceptsInsurance),
    acceptsNewPatients: normalizeBoolean(clinic.acceptsNewPatients) || clinic.acceptsNewPatients === undefined,
  };
}

function serializePublicClinicProfile(clinic: Record<string, unknown>) {
  return {
    ...serializePublicClinicCard(clinic),
    address:
      typeof clinic.address === 'string' && clinic.address.trim()
        ? clinic.address.trim()
        : getClinicLocation(clinic),
    phone: typeof clinic.phone === 'string' ? clinic.phone.trim() : '',
    email: typeof clinic.email === 'string' ? clinic.email.trim() : '',
    website: ensureHttpUrl(clinic.website),
    hours:
      typeof clinic.hours === 'string' && clinic.hours.trim()
        ? clinic.hours.trim()
        : 'Contact clinic for operating hours.',
    features: getClinicFeatures(clinic),
    protocols: getClinicProtocols(clinic),
    providers: getClinicProviders(clinic),
    outcomes: getClinicOutcomes(clinic),
    gallery: getClinicGallery(clinic),
  };
}

function getSimilarClinics(
  currentClinic: Record<string, unknown>,
  clinics: Record<string, unknown>[],
) {
  const currentId = typeof currentClinic.id === 'string' ? currentClinic.id : '';
  const currentSpecialties = new Set(getClinicDisplaySpecialties(currentClinic).map((entry) => entry.toLowerCase()));

  return clinics
    .filter((clinic) => clinic.id !== currentId)
    .map((clinic) => {
      const specialties = getClinicDisplaySpecialties(clinic).map((entry) => entry.toLowerCase());
      const overlap = specialties.filter((entry) => currentSpecialties.has(entry)).length;
      const rating = normalizeNumber(clinic.rating, 4.5);
      return {
        clinic,
        score: overlap * 100 + rating * 10,
      };
    })
    .sort((left, right) => right.score - left.score)
    .slice(0, 3)
    .map((entry) => serializePublicClinicCard(entry.clinic));
}

function getPatientFullName(payload: Pick<PatientAssessmentPayload, 'firstName' | 'lastName'>) {
  return `${payload.firstName} ${payload.lastName}`.trim();
}

function buildLeadSummary(
  payload: PatientAssessmentPayload,
  match: ClinicMatch,
  patientName: string,
) {
  const matchedSignals = match.matchedSignals.length > 0 ? match.matchedSignals.join(', ') : payload.goal;
  return {
    treatmentInterest: payload.goal,
    score: match.score,
    budget: payload.budget,
    urgency: payload.urgency,
    intentSignal: `${payload.symptoms.length} intake signals captured`,
    aiSummary: `${patientName} is seeking ${payload.goal.toLowerCase()} support and reported ${payload.symptoms.slice(0, 3).join(', ')}. Recommend ${
      payload.urgency.toLowerCase()
    } outreach.`,
    aiReasoning: `Matched on ${matchedSignals}. Payment preference: ${payload.paymentPreference}. Lab readiness: ${payload.labWork}.`,
  };
}

async function createClinicAuditEvent(input: {
  clinicId: string;
  action: string;
  entityId: string;
  entityName: string;
  type: string;
}) {
  try {
    await adminDb.collection('auditEvents').add({
      clinicId: input.clinicId,
      action: input.action,
      entityId: input.entityId,
      entityName: input.entityName,
      timestamp: Timestamp.now(),
      type: input.type,
    });
  } catch (error) {
    console.error('Failed to persist clinic audit event:', error);
  }
}

async function trackPublicAnalyticsEvent(
  event: string,
  payload: Record<string, unknown>,
  req: Request,
) {
  try {
    await adminDb.collection('analyticsEvents').add({
      event,
      source: 'public_api',
      payload,
      createdAt: new Date().toISOString(),
      context: buildRequestContext(req),
    });
  } catch (error) {
    console.error('Failed to persist public analytics event:', error);
  }
}

async function createClinicNotification(input: {
  clinicId: string;
  title: string;
  body: string;
  link: string;
  entityId: string;
  entityType: string;
}) {
  try {
    await adminDb.collection('clinicNotifications').add({
      clinicId: input.clinicId,
      title: input.title,
      body: input.body,
      link: input.link,
      entityId: input.entityId,
      entityType: input.entityType,
      status: 'unread',
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to persist clinic notification:', error);
  }
}

async function createPatientNotification(input: {
  patientId: string;
  title: string;
  body: string;
  link: string;
  entityId: string;
  entityType: string;
}) {
  try {
    await adminDb.collection('patientNotifications').add({
      patientId: input.patientId,
      title: input.title,
      body: input.body,
      link: input.link,
      entityId: input.entityId,
      entityType: input.entityType,
      status: 'unread',
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to persist patient notification:', error);
  }
}

async function notifySubmission(input: Parameters<typeof deliverSubmissionAlert>[0]) {
  try {
    await deliverSubmissionAlert(input);
  } catch (error) {
    console.error('Failed to deliver submission alert:', error);
  }
}

function getClinicBookingTimes(clinic: Record<string, unknown>) {
  const configured = normalizeStringArray(clinic.bookingSlots, 8)
    .map((entry) => entry.toUpperCase())
    .filter((entry) => /^\d{1,2}:\d{2}\s*(AM|PM)$/.test(entry));

  return configured.length > 0
    ? configured
    : ['09:00 AM', '10:30 AM', '01:00 PM', '03:30 PM'];
}

function getClinicBookingDays(clinic: Record<string, unknown>) {
  const configured = normalizeStringArray(clinic.bookingDays, 7)
    .map((entry) => entry.toLowerCase());

  return configured.length > 0
    ? configured
    : ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
}

function toDateValue(value: unknown) {
  if (value instanceof Timestamp) {
    return value.toDate();
  }
  if (isPlainObject(value) && typeof value.toDate === 'function') {
    return value.toDate() as Date;
  }
  if (typeof value === 'string') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  return null;
}

function getDayLabel(date: Date) {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const candidate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.round((candidate.getTime() - startOfToday.getTime()) / (24 * 60 * 60 * 1000));

  if (diffDays === 0) {
    return 'Today';
  }
  if (diffDays === 1) {
    return 'Tomorrow';
  }

  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

function getTimeLabel(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

function buildClinicAvailabilitySlots(
  clinic: Record<string, unknown>,
  bookings: Record<string, unknown>[],
  limit = 8,
) {
  const now = new Date();
  const bookingTimes = getClinicBookingTimes(clinic);
  const bookingDays = new Set(getClinicBookingDays(clinic));
  const bookedTimes = new Set(
    bookings
      .filter((booking) => typeof booking.status === 'string' ? booking.status !== 'cancelled' : true)
      .map((booking) => toDateValue(booking.startTime))
      .filter((value): value is Date => Boolean(value))
      .map((value) => value.toISOString()),
  );
  const slots: Array<{
    key: string;
    startsAt: string;
    dayLabel: string;
    timeLabel: string;
    label: string;
  }> = [];

  for (let dayOffset = 0; dayOffset < 21 && slots.length < limit; dayOffset += 1) {
    const baseDate = new Date(now);
    baseDate.setHours(0, 0, 0, 0);
    baseDate.setDate(baseDate.getDate() + dayOffset);
    const weekdayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' })
      .format(baseDate)
      .toLowerCase();

    if (!bookingDays.has(weekdayName)) {
      continue;
    }

    for (const time of bookingTimes) {
      const { hours, minutes } = parseRequestedTime(time);
      const slotDate = new Date(baseDate);
      slotDate.setHours(hours, minutes, 0, 0);

      if (slotDate.getTime() <= now.getTime() + 30 * 60 * 1000) {
        continue;
      }

      const slotIso = slotDate.toISOString();
      if (bookedTimes.has(slotIso)) {
        continue;
      }

      slots.push({
        key: slotIso,
        startsAt: slotIso,
        dayLabel: getDayLabel(slotDate),
        timeLabel: getTimeLabel(slotDate),
        label: formatAppointmentLabel(slotDate),
      });

      if (slots.length >= limit) {
        break;
      }
    }
  }

  return slots;
}

function parseRequestedDate(dayLabel: string) {
  const trimmed = dayLabel.trim();
  const now = new Date();
  const base = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const normalized = trimmed.toLowerCase();

  if (!trimmed || normalized === 'today') {
    return base;
  }
  if (normalized === 'tomorrow') {
    const next = new Date(base);
    next.setDate(base.getDate() + 1);
    return next;
  }

  const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const weekdayIndex = weekdays.indexOf(normalized);
  if (weekdayIndex >= 0) {
    const next = new Date(base);
    const delta = (weekdayIndex - base.getDay() + 7) % 7 || 7;
    next.setDate(base.getDate() + delta);
    return next;
  }

  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) {
    return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
  }

  return base;
}

function parseRequestedTime(timeLabel: string) {
  const match = timeLabel.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);
  if (!match) {
    return {
      hours: 10,
      minutes: 30,
    };
  }

  let hours = Number(match[1]);
  const minutes = Number(match[2] ?? '0');
  const meridiem = match[3].toUpperCase();

  if (meridiem === 'PM' && hours !== 12) {
    hours += 12;
  }
  if (meridiem === 'AM' && hours === 12) {
    hours = 0;
  }

  return { hours, minutes };
}

function parseRequestedStartTime(requestedDay: string, requestedTime: string) {
  const date = parseRequestedDate(requestedDay);
  const time = parseRequestedTime(requestedTime);
  date.setHours(time.hours, time.minutes, 0, 0);
  return date;
}

function formatAppointmentLabel(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

const MARKETPLACE_CATEGORY_LABELS: Record<string, string> = {
  equipment: 'Clinical Equipment',
  diagnostics: 'Diagnostics & Labs',
  'digital-health': 'Digital Health & Software',
  'health-tech': 'Health Tech & Biometrics',
  'home-gym': 'Home Gym & Recovery',
  supplements: 'Supplements & Protocols',
  clinics: 'Clinic Supplies',
  all: 'Marketplace',
};

const MARKETPLACE_CATEGORY_ALIASES: Record<string, string[]> = {
  equipment: ['equipment', 'clinical equipment'],
  diagnostics: ['diagnostics', 'diagnostics labs', 'diagnostics & labs', 'labs', 'lab'],
  'digital-health': [
    'digital health',
    'digital health software',
    'software',
    'clinical workflow',
    'patient experience',
    'analytics',
    'remote monitoring',
  ],
  'health-tech': [
    'health tech',
    'biometrics',
    'cognitive tools',
    'recovery hardware',
    'optimization hardware',
  ],
  'home-gym': ['home gym', 'recovery', 'wearables', 'sleep optimization', 'strength'],
  supplements: ['supplements', 'supplements protocols', 'supplements & protocols', 'protocols', 'peptides'],
  clinics: ['clinics', 'clinic supplies', 'clinic'],
};

function normalizeMarketplaceCategorySlug(value: unknown) {
  if (typeof value !== 'string' || !value.trim()) {
    return 'all';
  }

  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/&/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

  for (const [slug, aliases] of Object.entries(MARKETPLACE_CATEGORY_ALIASES)) {
    if (aliases.some((alias) => normalized === alias || normalized.includes(alias) || alias.includes(normalized))) {
      return slug;
    }
  }

  return normalized.replace(/\s+/g, '-');
}

function getProductString(product: Record<string, unknown>, field: string) {
  const value = product[field];
  return typeof value === 'string' ? value.trim() : '';
}

function getProductStringArray(product: Record<string, unknown>, field: string, maxItems = 12) {
  return normalizeStringArray(product[field], maxItems);
}

function getProductSpecs(product: Record<string, unknown>) {
  const raw = product.specs;
  if (Array.isArray(raw)) {
    return raw
      .map((entry) => {
        if (!isPlainObject(entry)) {
          return null;
        }
        const label = typeof entry.label === 'string' ? entry.label.trim() : '';
        const value = typeof entry.value === 'string' ? entry.value.trim() : '';
        return label && value ? { label, value } : null;
      })
      .filter((entry): entry is { label: string; value: string } => Boolean(entry))
      .slice(0, 12);
  }

  if (!isPlainObject(raw)) {
    return [] as Array<{ label: string; value: string }>;
  }

  return Object.entries(raw)
    .filter(([, value]) => typeof value === 'string' && value.trim())
    .map(([label, value]) => ({
      label,
      value: (value as string).trim(),
    }))
    .slice(0, 12);
}

function isPublicProduct(product: Record<string, unknown>) {
  const status = typeof product.status === 'string' ? product.status.trim().toLowerCase() : 'active';
  return status !== 'draft' && status !== 'archived' && product.isPublic !== false;
}

async function loadPublicProductRecords() {
  const snapshot = await adminDb.collection('products').get();
  return snapshot.docs
    .map((doc) => {
      const data = (doc.data() ?? {}) as Record<string, unknown>;
      return {
        id: doc.id,
        ...data,
      } as Record<string, unknown>;
    })
    .filter(isPublicProduct);
}

function serializePublicProduct(product: Record<string, unknown>) {
  const categorySource =
    getProductString(product, 'categorySlug') ||
    getProductString(product, 'marketplaceCategory') ||
    getProductString(product, 'category');
  const categorySlug = normalizeMarketplaceCategorySlug(categorySource);
  const category = MARKETPLACE_CATEGORY_LABELS[categorySlug] || getProductString(product, 'category') || 'Marketplace';
  const image = getProductString(product, 'image');
  const gallery = getProductStringArray(product, 'gallery', 8);

  return {
    id: typeof product.id === 'string' ? product.id : '',
    name: getProductString(product, 'name') || 'Marketplace Item',
    category,
    categorySlug,
    description: getProductString(product, 'description'),
    price: getProductString(product, 'price') || 'Contact for pricing',
    vendor: getProductString(product, 'vendor') || getProductString(product, 'brand') || 'Verified partner',
    rating: normalizeNumber(product.rating, 4.7),
    reviews: normalizeNumber(product.reviews ?? product.reviewCount, 0),
    image,
    gallery: gallery.length > 0 ? gallery : image ? [image] : [],
    compliance:
      getProductString(product, 'compliance') ||
      getProductString(product, 'validation') ||
      (product.verified === false ? 'Pending verification' : 'Verified partner'),
    implementation: getProductString(product, 'implementation'),
    compatibility: getProductString(product, 'compatibility'),
    turnaround: getProductString(product, 'turnaround'),
    sample: getProductString(product, 'sample'),
    payback: getProductString(product, 'payback'),
    revenuePerPatient: getProductString(product, 'revenuePerPatient'),
    roi: getProductString(product, 'roi'),
    location: getProductString(product, 'location'),
    patients: getProductString(product, 'patients'),
    features: getProductStringArray(product, 'features', 12),
    benefits: getProductStringArray(product, 'benefits', 12),
    requirements: getProductStringArray(product, 'requirements', 12),
    useCases: getProductStringArray(product, 'useCases', 12),
    specs: getProductSpecs(product),
    verified: product.verified !== false,
  };
}

function matchesProductQuery(product: ReturnType<typeof serializePublicProduct>, query: string) {
  if (!query.trim()) {
    return true;
  }

  const normalized = query.trim().toLowerCase();
  const searchSpace = [
    product.name,
    product.category,
    product.description,
    product.vendor,
    product.compatibility,
    product.compliance,
    ...product.features,
    ...product.useCases,
  ]
    .join(' ')
    .toLowerCase();

  return searchSpace.includes(normalized);
}

function handleError(res: Response, error: unknown) {
  if (error instanceof HttpError) {
    return res.status(error.status).json({ error: error.message });
  }

  console.error('Public route failed:', error);
  return res.status(500).json({ error: 'Unable to process request right now.' });
}

publicRouter.get('/clinics', async (_req, res) => {
  try {
    const clinics = await loadPublicClinicRecords();

    return res.json({
      clinics: clinics.map((clinic) => serializePublicClinicCard(clinic)),
    });
  } catch (error) {
    return handleError(res, error);
  }
});

publicRouter.get('/clinics/:id/availability', async (req, res) => {
  try {
    const clinicId = req.params.id?.trim();
    if (!clinicId) {
      throw new HttpError(400, 'Clinic id is required.');
    }

    const clinics = await loadPublicClinicRecords();
    const clinic = clinics.find((entry) => entry.id === clinicId);
    if (!clinic) {
      throw new HttpError(404, 'Clinic not found.');
    }

    const bookingsSnapshot = await adminDb
      .collection('bookings')
      .where('clinicId', '==', clinicId)
      .get();
    const existingBookings = bookingsSnapshot.docs.map(
      (docSnapshot) => (docSnapshot.data() ?? {}) as Record<string, unknown>,
    );
    const slots =
      normalizeBoolean(clinic.acceptsNewPatients) || clinic.acceptsNewPatients === undefined
        ? buildClinicAvailabilitySlots(clinic, existingBookings, 8)
        : [];

    return res.json({
      clinic: {
        id: clinicId,
        name: typeof clinic.name === 'string' ? clinic.name : 'Clinic',
        location: getClinicLocation(clinic),
        waitlist:
          typeof clinic.waitlist === 'string' && clinic.waitlist.trim()
            ? clinic.waitlist.trim()
            : normalizeBoolean(clinic.acceptsNewPatients) || clinic.acceptsNewPatients === undefined
              ? 'Accepting new patients'
              : 'Waitlist only',
        acceptsNewPatients:
          normalizeBoolean(clinic.acceptsNewPatients) || clinic.acceptsNewPatients === undefined,
      },
      slots,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    return handleError(res, error);
  }
});

publicRouter.get('/clinics/:id', async (req, res) => {
  try {
    const clinicId = req.params.id?.trim();
    if (!clinicId) {
      throw new HttpError(400, 'Clinic id is required.');
    }

    const clinics = await loadPublicClinicRecords();
    const clinic = clinics.find((entry) => entry.id === clinicId);

    if (!clinic) {
      throw new HttpError(404, 'Clinic not found.');
    }

    return res.json({
      clinic: serializePublicClinicProfile(clinic),
      relatedClinics: getSimilarClinics(clinic, clinics),
    });
  } catch (error) {
    return handleError(res, error);
  }
});

publicRouter.get('/products', async (req, res) => {
  try {
    const category = typeof req.query.category === 'string' ? req.query.category.trim() : '';
    const query = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    const limitValue =
      typeof req.query.limit === 'string' ? Number.parseInt(req.query.limit, 10) : undefined;

    const products = (await loadPublicProductRecords())
      .map((product) => serializePublicProduct(product))
      .filter((product) =>
        category && category !== 'all'
          ? product.categorySlug === normalizeMarketplaceCategorySlug(category)
          : true,
      )
      .filter((product) => matchesProductQuery(product, query))
      .sort((left, right) => {
        if (right.rating !== left.rating) {
          return right.rating - left.rating;
        }
        return right.reviews - left.reviews;
      });

    return res.json({
      products: typeof limitValue === 'number' && Number.isFinite(limitValue)
        ? products.slice(0, Math.max(1, Math.min(limitValue, 200)))
        : products,
    });
  } catch (error) {
    return handleError(res, error);
  }
});

publicRouter.get('/products/:id', async (req, res) => {
  try {
    const productId = req.params.id?.trim();
    if (!productId) {
      throw new HttpError(400, 'Product id is required.');
    }

    const products = await loadPublicProductRecords();
    const product = products.find((entry) => entry.id === productId);

    if (!product) {
      throw new HttpError(404, 'Product not found.');
    }

    return res.json({
      product: serializePublicProduct(product),
    });
  } catch (error) {
    return handleError(res, error);
  }
});

publicRouter.post('/contact', async (req, res) => {
  try {
    if (!isPlainObject(req.body)) {
      throw new HttpError(400, 'Invalid request payload.');
    }

    const role = getRequiredEnum(req.body, 'role', ['patient', 'clinic', 'vendor', 'other']);
    const name = getRequiredString(req.body, 'name', 2, 120);
    const email = assertEmail(getRequiredString(req.body, 'email', 5, 160), 'email');
    const message = getRequiredString(req.body, 'message', 20, 4000);
    const classification = classifyContact(message);
    const trackingId = createReferenceId('NVL');
    const routingDestination = resolveRoutingDestination(role, classification.intent);
    const expectedResponseTime = resolveExpectedResponseTime(classification.urgency);

    const submissionRef = await adminDb.collection('contactSubmissions').add({
      trackingId,
      name,
      email,
      role,
      message,
      intent: classification.intent,
      urgency: classification.urgency,
      routingDestination,
      expectedResponseTime,
      status: 'open',
      createdAt: new Date().toISOString(),
      context: buildRequestContext(req),
    });

    await notifySubmission({
      category: 'contact_submission',
      title: 'New contact submission',
      entityType: 'contactSubmission',
      entityId: submissionRef.id,
      summary: `${name} submitted a ${classification.intent} ${role} inquiry routed to ${routingDestination}.`,
      route: '/api/public/contact',
      replyTo: email,
      adminPath: '/admin/command-center',
      emailFields: [
        { label: 'Tracking ID', value: trackingId },
        { label: 'Name', value: name },
        { label: 'Email', value: email },
        { label: 'Role', value: role },
        { label: 'Intent', value: classification.intent },
        { label: 'Urgency', value: classification.urgency },
        { label: 'Routing', value: routingDestination },
        { label: 'Message', value: truncateText(message, 800) },
      ],
      slackFields: [
        { label: 'Tracking ID', value: trackingId },
        { label: 'Role', value: role },
        { label: 'Intent', value: classification.intent },
        { label: 'Urgency', value: classification.urgency },
        { label: 'Email', value: maskEmail(email) },
        { label: 'Message', value: truncateText(message, 120) },
      ],
      metadata: {
        trackingId,
        intent: classification.intent,
        urgency: classification.urgency,
        routingDestination,
        role,
      },
    });

    return res.status(201).json({
      trackingId,
      intent: classification.intent,
      urgency: classification.urgency,
      routingDestination,
      expectedResponseTime,
    });
  } catch (error) {
    return handleError(res, error);
  }
});

publicRouter.post('/clinic-applications', async (req, res) => {
  try {
    if (!isPlainObject(req.body)) {
      throw new HttpError(400, 'Invalid request payload.');
    }

    const payload = {
      clinicName: getRequiredString(req.body, 'clinicName', 2, 160),
      website: assertUrl(getRequiredString(req.body, 'website', 8, 240), 'website'),
      npi: getOptionalString(req.body, 'npi', 20),
      isFranchise: getRequiredEnum(req.body, 'isFranchise', ['Yes', 'No']),
      monthlyVolume: getRequiredString(req.body, 'monthlyVolume', 1, 40),
      frontDeskStaff: getRequiredString(req.body, 'frontDeskStaff', 1, 40),
      emr: getRequiredString(req.body, 'emr', 1, 120),
      telehealth: getRequiredEnum(req.body, 'telehealth', ['Yes', 'No']),
      avgLtv: getRequiredString(req.body, 'avgLtv', 1, 40),
      investment: getRequiredEnum(req.body, 'investment', ['Yes', 'No']),
    };

    const result = evaluateClinicApplication(payload);
    const applicationId = createReferenceId('CLINIC');
    const nextStepPath = result === 'approved' ? '/auth/register-clinic' : '/contact';

    const applicationRef = await adminDb.collection('clinicApplications').add({
      applicationId,
      ...payload,
      result,
      nextStepPath,
      status:
        result === 'approved'
          ? 'approved_pending_registration'
          : result === 'manual_review'
            ? 'manual_review'
            : 'rejected',
      createdAt: new Date().toISOString(),
      context: buildRequestContext(req),
    });

    await notifySubmission({
      category: 'clinic_application',
      title: 'New clinic application',
      entityType: 'clinicApplication',
      entityId: applicationRef.id,
      summary: `${payload.clinicName} submitted a clinic application with a ${result} disposition.`,
      route: '/api/public/clinic-applications',
      adminPath: '/admin/directory',
      emailFields: [
        { label: 'Application ID', value: applicationId },
        { label: 'Clinic', value: payload.clinicName },
        { label: 'Website', value: payload.website },
        { label: 'Monthly Volume', value: payload.monthlyVolume },
        { label: 'EMR', value: payload.emr },
        { label: 'Result', value: result },
        { label: 'Next Step', value: nextStepPath },
      ],
      slackFields: [
        { label: 'Application ID', value: applicationId },
        { label: 'Clinic', value: payload.clinicName },
        { label: 'Volume', value: payload.monthlyVolume },
        { label: 'Result', value: result },
      ],
      metadata: {
        applicationId,
        result,
        clinicName: payload.clinicName,
      },
    });

    return res.status(201).json({
      applicationId,
      result,
      nextStepPath,
    });
  } catch (error) {
    return handleError(res, error);
  }
});

publicRouter.post('/vendor-applications', async (req, res) => {
  try {
    if (!isPlainObject(req.body)) {
      throw new HttpError(400, 'Invalid request payload.');
    }

    const payload = {
      companyName: getRequiredString(req.body, 'companyName', 2, 160),
      website: assertUrl(getRequiredString(req.body, 'website', 8, 240), 'website'),
      contactName: getRequiredString(req.body, 'contactName', 2, 120),
      contactEmail: assertEmail(getRequiredString(req.body, 'contactEmail', 5, 160), 'contactEmail'),
      contactRole: getRequiredString(req.body, 'contactRole', 2, 120),
      category: getRequiredString(req.body, 'category', 2, 120),
      description: getRequiredString(req.body, 'description', 20, 3000),
      targetAudience: getRequiredString(req.body, 'targetAudience', 2, 160),
      pricingModel: getRequiredString(req.body, 'pricingModel', 2, 120),
      apiAvailability: getRequiredString(req.body, 'apiAvailability', 2, 120),
      emrCompatibility: getRequiredString(req.body, 'emrCompatibility', 2, 160),
      dataExport: getRequiredString(req.body, 'dataExport', 2, 160),
      hipaa: getRequiredString(req.body, 'hipaa', 2, 80),
      soc2: getRequiredString(req.body, 'soc2', 2, 80),
      supportSLA: getRequiredString(req.body, 'supportSLA', 2, 120),
      additionalNotes: getOptionalString(req.body, 'additionalNotes', 3000),
    };

    const applicationId = createReferenceId('VENDOR');
    const reviewEtaDays =
      payload.hipaa === 'compliant' && payload.soc2 === 'certified'
        ? 3
        : 5;

    const applicationRef = await adminDb.collection('vendorApplications').add({
      applicationId,
      ...payload,
      status: 'submitted',
      reviewEtaDays,
      createdAt: new Date().toISOString(),
      context: buildRequestContext(req),
    });

    await notifySubmission({
      category: 'vendor_application',
      title: 'New vendor application',
      entityType: 'vendorApplication',
      entityId: applicationRef.id,
      summary: `${payload.companyName} submitted a vendor application for ${payload.category}.`,
      route: '/api/public/vendor-applications',
      replyTo: payload.contactEmail,
      adminPath: '/admin/directory',
      emailFields: [
        { label: 'Application ID', value: applicationId },
        { label: 'Company', value: payload.companyName },
        { label: 'Contact', value: `${payload.contactName} (${payload.contactRole})` },
        { label: 'Email', value: payload.contactEmail },
        { label: 'Category', value: payload.category },
        { label: 'Review ETA', value: `${reviewEtaDays} business days` },
        { label: 'Description', value: truncateText(payload.description, 800) },
      ],
      slackFields: [
        { label: 'Application ID', value: applicationId },
        { label: 'Company', value: payload.companyName },
        { label: 'Category', value: payload.category },
        { label: 'Contact', value: maskEmail(payload.contactEmail) },
      ],
      metadata: {
        applicationId,
        companyName: payload.companyName,
        category: payload.category,
      },
    });

    return res.status(201).json({
      applicationId,
      reviewEtaDays,
    });
  } catch (error) {
    return handleError(res, error);
  }
});

publicRouter.post('/clinic-icp', async (req, res) => {
  try {
    if (!isPlainObject(req.body)) {
      throw new HttpError(400, 'Invalid request payload.');
    }

    const payload = {
      clinicName: getRequiredString(req.body, 'clinicName', 2, 160),
      website: assertUrl(getRequiredString(req.body, 'website', 8, 240), 'website'),
      contactName: getRequiredString(req.body, 'contactName', 2, 120),
      contactEmail: assertEmail(getRequiredString(req.body, 'contactEmail', 5, 160), 'contactEmail'),
      primaryService: getRequiredString(req.body, 'primaryService', 2, 160),
      secondaryServices: getStringArray(req.body, 'secondaryServices', 12, 120),
      targetAgeRange: getRequiredString(req.body, 'targetAgeRange', 2, 80),
      targetGender: getRequiredString(req.body, 'targetGender', 2, 40),
      geographyType: getRequiredString(req.body, 'geographyType', 2, 40),
      radius: getOptionalString(req.body, 'radius', 20),
      states: getOptionalString(req.body, 'states', 240),
      minBudget: getRequiredString(req.body, 'minBudget', 1, 80),
      urgencyLevel: getRequiredString(req.body, 'urgencyLevel', 1, 80),
      monthlyCapacity: getRequiredString(req.body, 'monthlyCapacity', 1, 40),
      targetCPA: getRequiredString(req.body, 'targetCPA', 1, 40),
      competitors: getOptionalString(req.body, 'competitors', 3000),
      additionalNotes: getOptionalString(req.body, 'additionalNotes', 3000),
    };

    const profileId = createReferenceId('ICP');

    const profileRef = await adminDb.collection('clinicICPSubmissions').add({
      profileId,
      ...payload,
      status: 'active',
      createdAt: new Date().toISOString(),
      context: buildRequestContext(req),
    });

    await notifySubmission({
      category: 'clinic_icp_submission',
      title: 'New clinic ICP submission',
      entityType: 'clinicICP',
      entityId: profileRef.id,
      summary: `${payload.clinicName} submitted an ICP profile for ${payload.primaryService}.`,
      route: '/api/public/clinic-icp',
      replyTo: payload.contactEmail,
      adminPath: '/admin/directory',
      emailFields: [
        { label: 'Profile ID', value: profileId },
        { label: 'Clinic', value: payload.clinicName },
        { label: 'Contact', value: payload.contactName },
        { label: 'Email', value: payload.contactEmail },
        { label: 'Primary Service', value: payload.primaryService },
        { label: 'Urgency', value: payload.urgencyLevel },
        { label: 'Monthly Capacity', value: payload.monthlyCapacity },
      ],
      slackFields: [
        { label: 'Profile ID', value: profileId },
        { label: 'Clinic', value: payload.clinicName },
        { label: 'Service', value: payload.primaryService },
        { label: 'Urgency', value: payload.urgencyLevel },
      ],
      metadata: {
        profileId,
        clinicName: payload.clinicName,
        primaryService: payload.primaryService,
      },
    });

    return res.status(201).json({
      profileId,
    });
  } catch (error) {
    return handleError(res, error);
  }
});

publicRouter.post('/patient-assessments', async (req, res) => {
  try {
    if (!isPlainObject(req.body)) {
      throw new HttpError(400, 'Invalid request payload.');
    }

    const payload: PatientAssessmentPayload = {
      goal: getRequiredString(req.body, 'goal', 2, 160),
      symptoms: getStringArray(req.body, 'symptoms', 16, 120),
      urgency: getRequiredString(req.body, 'urgency', 2, 80),
      paymentPreference: getRequiredString(req.body, 'paymentPreference', 2, 120),
      budget: getRequiredString(req.body, 'budget', 2, 120),
      labWork: getRequiredString(req.body, 'labWork', 2, 240),
      firstName: getRequiredString(req.body, 'firstName', 2, 80),
      lastName: getRequiredString(req.body, 'lastName', 2, 80),
      email: assertEmail(getRequiredString(req.body, 'email', 5, 160), 'email'),
      phone: getRequiredString(req.body, 'phone', 7, 40),
      zip: getRequiredString(req.body, 'zip', 3, 20),
      preferredClinicId: getOptionalString(req.body, 'preferredClinicId', 120) || undefined,
      entryPoint: getOptionalString(req.body, 'entryPoint', 80) || undefined,
    };

    if (payload.symptoms.length === 0) {
      throw new HttpError(400, 'symptoms must contain at least one item.');
    }

    const isDisqualified =
      payload.labWork === 'No, I am not willing to do lab work' ||
      (payload.paymentPreference === 'Insurance Only' && payload.budget === 'Under $200/mo');
    const status = isDisqualified ? 'disqualified' : 'qualified';
    const now = new Date().toISOString();
    const patientName = getPatientFullName(payload);

    const patientRef = await adminDb.collection('patients').add({
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phone: payload.phone,
      zip: payload.zip,
      preferredClinicId: payload.preferredClinicId || null,
      entryPoint: payload.entryPoint ? normalizeEntryPoint(payload.entryPoint) : 'direct',
      createdAt: now,
      updatedAt: now,
      source: 'patient_assessment',
      context: buildRequestContext(req),
    });

    const assessmentRef = await adminDb.collection('assessments').add({
      patientId: patientRef.id,
      treatmentInterest: payload.goal,
      symptoms: payload.symptoms,
      urgency: payload.urgency,
      budget: payload.budget,
      paymentPreference: payload.paymentPreference,
      labWork: payload.labWork,
      preferredClinicId: payload.preferredClinicId || null,
      entryPoint: payload.entryPoint ? normalizeEntryPoint(payload.entryPoint) : 'direct',
      status,
      createdAt: now,
      source: 'patient_assessment',
    });

    let matchedClinic = null as ClinicMatch | null;
    let leadId: string | null = null;

    if (!isDisqualified) {
      matchedClinic = await findMatchedClinic(payload);
      if (matchedClinic?.clinic?.id) {
        const leadSummary = buildLeadSummary(payload, matchedClinic, patientName);
        const leadRef = await adminDb.collection('leads').add({
          patientId: patientRef.id,
          clinicId: matchedClinic.clinic.id,
          assessmentId: assessmentRef.id,
          name: patientName,
          email: payload.email,
          phone: payload.phone,
          status: 'new',
          notes: [],
          createdAt: now,
          updatedAt: now,
          source: 'patient_assessment',
          preferredClinicId: payload.preferredClinicId || null,
          entryPoint: payload.entryPoint ? normalizeEntryPoint(payload.entryPoint) : 'direct',
          routingMode: matchedClinic.routingMode,
          ...leadSummary,
        });
        leadId = leadRef.id;

        await createClinicAuditEvent({
          clinicId: matchedClinic.clinic.id as string,
          action: 'New routed assessment',
          entityId: leadRef.id,
          entityName: patientName,
          type: 'info',
        });

        await createClinicNotification({
          clinicId: matchedClinic.clinic.id as string,
          title: 'New routed patient assessment',
          body: `${patientName} completed a routed intake for ${payload.goal}. Review the lead and confirm follow-up.`,
          link: '/dashboard/leads',
          entityId: leadRef.id,
          entityType: 'lead',
        });

        await createPatientNotification({
          patientId: patientRef.id,
          title: 'Clinic match ready',
          body: `We routed your intake to ${typeof matchedClinic.clinic.name === 'string' ? matchedClinic.clinic.name : 'a Novalyte clinic'} for consultation review.`,
          link: `/clinics/${matchedClinic.clinic.id}`,
          entityId: assessmentRef.id,
          entityType: 'assessment',
        });

        await trackPublicAnalyticsEvent(
          'patient_assessment_routed',
          {
            patientId: patientRef.id,
            assessmentId: assessmentRef.id,
            clinicId: matchedClinic.clinic.id,
            leadId,
            goal: payload.goal,
            score: matchedClinic.score,
            budget: payload.budget,
            urgency: payload.urgency,
            preferredClinicId: payload.preferredClinicId || null,
            entryPoint: payload.entryPoint ? normalizeEntryPoint(payload.entryPoint) : 'direct',
          },
          req,
        );
      } else {
        await trackPublicAnalyticsEvent(
          'patient_assessment_unmatched',
          {
            patientId: patientRef.id,
            assessmentId: assessmentRef.id,
            goal: payload.goal,
            budget: payload.budget,
            urgency: payload.urgency,
            preferredClinicId: payload.preferredClinicId || null,
            entryPoint: payload.entryPoint ? normalizeEntryPoint(payload.entryPoint) : 'direct',
          },
          req,
        );

        await createPatientNotification({
          patientId: patientRef.id,
          title: 'Concierge routing in progress',
          body: 'Your intake is complete. Our routing team is reviewing clinic availability and will follow up with the best next option.',
          link: '/contact?role=patient&topic=concierge_routing',
          entityId: assessmentRef.id,
          entityType: 'assessment',
        });
      }
    } else {
      await trackPublicAnalyticsEvent(
        'patient_assessment_disqualified',
          {
            patientId: patientRef.id,
            assessmentId: assessmentRef.id,
            goal: payload.goal,
            paymentPreference: payload.paymentPreference,
            budget: payload.budget,
            labWork: payload.labWork,
            preferredClinicId: payload.preferredClinicId || null,
            entryPoint: payload.entryPoint ? normalizeEntryPoint(payload.entryPoint) : 'direct',
          },
          req,
        );

      await createPatientNotification({
        patientId: patientRef.id,
        title: 'Assessment completed with alternative guidance',
        body: 'Your assessment was saved. Novalyte recommends follow-up education or concierge support before clinic routing.',
        link: '/support/patient',
        entityId: assessmentRef.id,
        entityType: 'assessment',
      });
    }

    await notifySubmission({
      category: 'patient_assessment',
      title: 'New patient assessment',
      entityType: 'assessment',
      entityId: assessmentRef.id,
      summary:
        status === 'qualified'
          ? `${patientName} completed a qualified patient assessment${matchedClinic?.clinic?.name ? ` routed to ${matchedClinic.clinic.name}` : ''}.`
          : `${patientName} completed a patient assessment that requires concierge follow-up.`,
      route: '/api/public/patient-assessments',
      replyTo: payload.email,
      adminPath: '/admin/crm',
      emailFields: [
        { label: 'Assessment ID', value: assessmentRef.id },
        { label: 'Patient', value: patientName },
        { label: 'Email', value: payload.email },
        { label: 'Phone', value: payload.phone },
        { label: 'Goal', value: payload.goal },
        { label: 'Urgency', value: payload.urgency },
        { label: 'Result', value: status },
        {
          label: 'Matched Clinic',
          value: typeof matchedClinic?.clinic?.name === 'string' ? matchedClinic.clinic.name : 'None',
        },
      ],
      slackFields: [
        { label: 'Assessment ID', value: assessmentRef.id },
        { label: 'Patient', value: maskName(patientName) },
        { label: 'Email', value: maskEmail(payload.email) },
        { label: 'Phone', value: maskPhone(payload.phone) },
        { label: 'Goal', value: payload.goal },
        { label: 'Urgency', value: payload.urgency },
        {
          label: 'Matched Clinic',
          value: typeof matchedClinic?.clinic?.name === 'string' ? matchedClinic.clinic.name : 'None',
        },
      ],
      metadata: {
        assessmentId: assessmentRef.id,
        patientId: patientRef.id,
        leadId,
        result: status,
      },
    });

    return res.status(201).json({
      result: status,
      patientId: patientRef.id,
      assessmentId: assessmentRef.id,
      leadId,
      matchedClinic: serializeMatchedClinic(matchedClinic),
    });
  } catch (error) {
    return handleError(res, error);
  }
});

publicRouter.post('/bookings', async (req, res) => {
  try {
    if (!isPlainObject(req.body)) {
      throw new HttpError(400, 'Invalid request payload.');
    }

    const patientId = getRequiredString(req.body, 'patientId', 8, 120);
    const clinicId = getRequiredString(req.body, 'clinicId', 8, 120);
    const assessmentId = getOptionalString(req.body, 'assessmentId', 120);
    const requestedSlotKey = getOptionalString(req.body, 'requestedSlotKey', 80);
    const requestedDay = getOptionalString(req.body, 'requestedDay', 40);
    const requestedTime = getOptionalString(req.body, 'requestedTime', 40);
    if (!requestedSlotKey && (!requestedDay || !requestedTime)) {
      throw new HttpError(400, 'A valid appointment slot is required.');
    }

    const patientSnapshot = await adminDb.collection('patients').doc(patientId).get();
    if (!patientSnapshot.exists) {
      throw new HttpError(404, 'Patient record not found.');
    }

    const clinicSnapshot = await adminDb.collection('clinics').doc(clinicId).get();
    if (!clinicSnapshot.exists) {
      throw new HttpError(404, 'Clinic record not found.');
    }

    const patient = (patientSnapshot.data() ?? {}) as Record<string, unknown>;
    const clinic = (clinicSnapshot.data() ?? {}) as Record<string, unknown>;
    const patientName =
      getPatientFullName({
        firstName: typeof patient.firstName === 'string' ? patient.firstName : '',
        lastName: typeof patient.lastName === 'string' ? patient.lastName : '',
      }) || 'Patient';
    const clinicName = typeof clinic.name === 'string' && clinic.name.trim() ? clinic.name.trim() : 'Clinic';
    const existingBookingsSnapshot = await adminDb
      .collection('bookings')
      .where('clinicId', '==', clinicId)
      .get();
    const existingBookings = existingBookingsSnapshot.docs.map(
      (docSnapshot) => (docSnapshot.data() ?? {}) as Record<string, unknown>,
    );
    const availableSlots = buildClinicAvailabilitySlots(clinic, existingBookings, 16);

    let startTime: Date;
    let bookingDayLabel: string;
    let bookingTimeLabel: string;
    let appointmentLabel: string;

    if (requestedSlotKey) {
      const selectedSlot = availableSlots.find((slot) => slot.key === requestedSlotKey);
      if (!selectedSlot) {
        throw new HttpError(409, 'That appointment slot is no longer available. Please select a new time.');
      }

      startTime = new Date(selectedSlot.startsAt);
      bookingDayLabel = selectedSlot.dayLabel;
      bookingTimeLabel = selectedSlot.timeLabel;
      appointmentLabel = selectedSlot.label;
    } else {
      startTime = parseRequestedStartTime(requestedDay, requestedTime);
      bookingDayLabel = requestedDay;
      bookingTimeLabel = requestedTime;
      appointmentLabel = formatAppointmentLabel(startTime);
    }

    const conflictingBooking = existingBookings.find((booking) => {
      const bookingStart = toDateValue(booking.startTime);
      return bookingStart ? bookingStart.toISOString() === startTime.toISOString() : false;
    });
    if (conflictingBooking) {
      throw new HttpError(409, 'That appointment slot was just taken. Please choose another available time.');
    }

    const endTime = new Date(startTime.getTime() + 30 * 60 * 1000);
    const now = new Date().toISOString();

    const leadSnapshot = await adminDb
      .collection('leads')
      .where('patientId', '==', patientId)
      .where('clinicId', '==', clinicId)
      .get();
    const relatedLead = leadSnapshot.docs.find((doc) => {
      const lead = (doc.data() ?? {}) as Record<string, unknown>;
      return assessmentId ? lead.assessmentId === assessmentId : true;
    });

    const bookingRef = await adminDb.collection('bookings').add({
      patientId,
      clinicId,
      clinicName,
      assessmentId: assessmentId || null,
      leadId: relatedLead?.id ?? null,
      requestedDay: bookingDayLabel,
      requestedTime: bookingTimeLabel,
      requestedSlotLabel: appointmentLabel,
      title: `Consultation: ${patientName}`,
      patientName,
      patientEmail: typeof patient.email === 'string' ? patient.email : '',
      patientPhone: typeof patient.phone === 'string' ? patient.phone : '',
      startTime: Timestamp.fromDate(startTime),
      endTime: Timestamp.fromDate(endTime),
      status: 'pending_confirmation',
      createdAt: now,
      updatedAt: now,
      source: 'patient_assessment',
      context: buildRequestContext(req),
    });

    if (relatedLead) {
      await adminDb.collection('leads').doc(relatedLead.id).set(
        {
          status: 'scheduled',
          nextAppointment: appointmentLabel,
          updatedAt: now,
        },
        { merge: true },
      );
    }

    await createClinicAuditEvent({
      clinicId,
      action: 'Consultation requested',
      entityId: bookingRef.id,
      entityName: patientName,
      type: 'success',
    });

    await createClinicNotification({
      clinicId,
      title: 'Consultation request received',
      body: `${patientName} requested ${appointmentLabel}. Confirm the consult and review the routed lead.`,
      link: '/dashboard/pipeline',
      entityId: bookingRef.id,
      entityType: 'booking',
    });

    await createPatientNotification({
      patientId,
      title: 'Consultation request submitted',
      body: `Your request with ${clinicName} for ${appointmentLabel} has been sent. The clinic will confirm next steps shortly.`,
      link: `/clinics/${clinicId}`,
      entityId: bookingRef.id,
      entityType: 'booking',
    });

    await trackPublicAnalyticsEvent(
      'consultation_requested',
      {
        bookingId: bookingRef.id,
        patientId,
        clinicId,
        leadId: relatedLead?.id ?? null,
        requestedDay,
        requestedTime,
      },
      req,
    );

    await notifySubmission({
      category: 'booking_request',
      title: 'New consultation booking request',
      entityType: 'booking',
      entityId: bookingRef.id,
      summary: `${patientName} requested a consultation with ${clinicName} for ${appointmentLabel}.`,
      route: '/api/public/bookings',
      replyTo: typeof patient.email === 'string' ? patient.email : null,
      adminPath: '/admin/crm',
      emailFields: [
        { label: 'Booking ID', value: bookingRef.id },
        { label: 'Patient', value: patientName },
        { label: 'Email', value: typeof patient.email === 'string' ? patient.email : '' },
        { label: 'Phone', value: typeof patient.phone === 'string' ? patient.phone : '' },
        { label: 'Clinic', value: clinicName },
        { label: 'Appointment', value: appointmentLabel },
      ],
      slackFields: [
        { label: 'Booking ID', value: bookingRef.id },
        { label: 'Patient', value: maskName(patientName) },
        { label: 'Email', value: maskEmail(typeof patient.email === 'string' ? patient.email : '') },
        { label: 'Phone', value: maskPhone(typeof patient.phone === 'string' ? patient.phone : '') },
        { label: 'Clinic', value: clinicName },
        { label: 'Appointment', value: appointmentLabel },
      ],
      metadata: {
        bookingId: bookingRef.id,
        clinicId,
        patientId,
        assessmentId: assessmentId || null,
      },
    });

    return res.status(201).json({
      bookingId: bookingRef.id,
      status: 'pending_confirmation',
      clinicName,
      slotLabel: appointmentLabel,
      followUpPath: `/clinics/${clinicId}`,
    });
  } catch (error) {
    return handleError(res, error);
  }
});

export default publicRouter;
