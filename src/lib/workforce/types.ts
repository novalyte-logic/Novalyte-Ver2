export type PractitionerRole =
  | 'Medical Director (MD/DO)'
  | 'Nurse Practitioner (NP)'
  | 'Physician Assistant (PA)'
  | 'Registered Nurse (RN)'
  | 'Medical Assistant'
  | 'Other';

export type EmploymentType =
  | 'Full-time'
  | 'Part-time'
  | 'Contract'
  | 'Per Diem'
  | 'Telehealth Only';

export type WorkMode = 'Onsite' | 'Hybrid' | 'Remote';

export type AvailabilityStatus = 'available' | 'interviewing' | 'placed' | 'inactive';

export type WorkforceRequestStatus =
  | 'draft'
  | 'open'
  | 'screening'
  | 'interviewing'
  | 'offer_extended'
  | 'filled'
  | 'closed';

export type RequestUrgency = 'Low' | 'Medium' | 'High' | 'Critical';

export type ApplicationStatus =
  | 'applied'
  | 'screening'
  | 'interview_scheduled'
  | 'interview_completed'
  | 'offer_extended'
  | 'offer_accepted'
  | 'offer_declined'
  | 'rejected'
  | 'withdrawn';

export type InterviewStatus = 'scheduled' | 'completed' | 'cancelled';

export type OfferStatus = 'extended' | 'accepted' | 'declined' | 'expired';

export type NotificationStatus = 'unread' | 'read';

export type NotificationType =
  | 'application_submitted'
  | 'application_status_changed'
  | 'interview_scheduled'
  | 'interview_updated'
  | 'offer_extended'
  | 'offer_status_changed'
  | 'staffing_request_created'
  | 'staffing_request_updated'
  | 'match_alert';

export interface WorkforceLocation {
  city: string;
  state: string;
  label: string;
  isRemote?: boolean;
}

export interface MatchBreakdown {
  role: number;
  protocols: number;
  location: number;
  employment: number;
  experience: number;
  licensure: number;
}

export interface MatchResult {
  score: number;
  breakdown: MatchBreakdown;
  reasons: string[];
  gaps: string[];
}

export interface PractitionerProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: WorkforceLocation;
  role: PractitionerRole;
  yearsExperience: number;
  licenseStates: string[];
  licenseNumber?: string;
  npi?: string;
  dea?: string;
  specialties: string[];
  protocols: string[];
  employmentPreferences: EmploymentType[];
  workModes: WorkMode[];
  availabilityStatus: AvailabilityStatus;
  targetCompensation: string;
  targetRateMin?: number;
  targetRateMax?: number;
  travelPreference: string;
  summary: string;
  resumeFileName?: string;
  resumeUploaded: boolean;
  profileStrength: number;
  searchable: boolean;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PractitionerProfileInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  role: PractitionerRole;
  yearsExperience: number;
  licenseStates: string[];
  licenseNumber?: string;
  npi?: string;
  dea?: string;
  specialties: string[];
  protocols: string[];
  employmentPreferences: EmploymentType[];
  workModes: WorkMode[];
  availabilityStatus: AvailabilityStatus;
  targetCompensation: string;
  targetRateMin?: number;
  targetRateMax?: number;
  travelPreference: string;
  summary: string;
  resumeFileName?: string;
  resumeUploaded: boolean;
  searchable: boolean;
}

export interface StaffingRequest {
  id: string;
  clinicId: string;
  clinicName: string;
  title: string;
  role: PractitionerRole;
  employmentType: EmploymentType;
  workMode: WorkMode;
  location: WorkforceLocation;
  compensation: string;
  minimumYearsExperience: number;
  requiredLicenseStates: string[];
  requiredProtocols: string[];
  description: string;
  urgency: RequestUrgency;
  openings: number;
  status: WorkforceRequestStatus;
  applicationCount: number;
  matchCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface StaffingRequestInput {
  title: string;
  role: PractitionerRole;
  employmentType: EmploymentType;
  workMode: WorkMode;
  city: string;
  state: string;
  compensation: string;
  minimumYearsExperience: number;
  requiredLicenseStates: string[];
  requiredProtocols: string[];
  description: string;
  urgency: RequestUrgency;
  openings: number;
  status?: WorkforceRequestStatus;
}

export interface WorkforceApplication {
  id: string;
  requestId: string;
  clinicId: string;
  clinicName: string;
  requestTitle: string;
  practitionerId: string;
  practitionerName: string;
  practitionerRole: PractitionerRole;
  practitionerLocation: string;
  status: ApplicationStatus;
  coverNote: string;
  match: MatchResult;
  createdAt: string;
  updatedAt: string;
  latestInterviewId?: string;
  latestOfferId?: string;
}

export interface WorkforceApplicationInput {
  requestId: string;
  coverNote: string;
}

export interface WorkforceInterview {
  id: string;
  applicationId: string;
  requestId: string;
  clinicId: string;
  practitionerId: string;
  scheduledAt: string;
  durationMinutes: number;
  mode: 'video' | 'phone' | 'onsite';
  location: string;
  meetingLink?: string;
  notes?: string;
  status: InterviewStatus;
  createdAt: string;
  updatedAt: string;
}

export interface WorkforceInterviewInput {
  applicationId: string;
  scheduledAt: string;
  durationMinutes: number;
  mode: 'video' | 'phone' | 'onsite';
  location: string;
  meetingLink?: string;
  notes?: string;
}

export interface WorkforceOffer {
  id: string;
  applicationId: string;
  requestId: string;
  clinicId: string;
  practitionerId: string;
  compensation: string;
  startDate: string;
  expiresAt: string;
  notes?: string;
  status: OfferStatus;
  createdAt: string;
  updatedAt: string;
}

export interface WorkforceOfferInput {
  applicationId: string;
  compensation: string;
  startDate: string;
  expiresAt: string;
  notes?: string;
}

export interface WorkforceNotification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: NotificationType;
  status: NotificationStatus;
  link?: string;
  entityId?: string;
  entityType?: 'request' | 'application' | 'interview' | 'offer' | 'profile';
  createdAt: string;
}

export interface WorkforceOpportunity extends StaffingRequest {
  match?: MatchResult;
  hasApplied?: boolean;
  applicationId?: string;
  applicationStatus?: ApplicationStatus;
}

export interface WorkforceCandidateCard {
  id: string;
  name: string;
  role: PractitionerRole;
  location: string;
  employmentPreferences: EmploymentType[];
  protocols: string[];
  yearsExperience: number;
  verified: boolean;
  availabilityStatus: AvailabilityStatus;
  targetCompensation: string;
  match?: MatchResult;
}

export interface PractitionerDashboardData {
  profile: PractitionerProfile | null;
  applications: WorkforceApplication[];
  opportunities: WorkforceOpportunity[];
  interviews: WorkforceInterview[];
  offers: WorkforceOffer[];
  notifications: WorkforceNotification[];
}

export interface ClinicDashboardData {
  requests: StaffingRequest[];
  applications: WorkforceApplication[];
  interviews: WorkforceInterview[];
  offers: WorkforceOffer[];
  notifications: WorkforceNotification[];
}
