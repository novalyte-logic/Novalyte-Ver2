import type { PublicClinicCard, PublicClinicProfile } from '@/src/services/public';

export type PatientEntryPoint =
  | 'patient_landing'
  | 'symptom_checker'
  | 'directory'
  | 'clinic_profile'
  | 'ask_ai'
  | 'direct';

export type PatientAssessmentHandoff = {
  entryPoint?: PatientEntryPoint;
  goal?: string;
  symptoms?: string[];
  urgency?: string;
  preferredClinicId?: string;
  preferredClinicName?: string;
  preferredClinicLocation?: string;
  preferredClinicRating?: number;
  preferredClinicPricingTier?: string;
};

const ROUTE_ALIASES: Record<string, string> = {
  '/health-dashboard': '/patient',
  '/symptom-tracker': '/symptom-checker',
  '/clinic-directory': '/directory',
  '/assessment': '/patient/assessment',
  '/patient-intake': '/patient/assessment',
  '/clinics/directory': '/directory',
};

function sanitizeValue(value: string | undefined) {
  return value?.trim() || '';
}

function uniqueStrings(values: string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function inferGoalFromSymptoms(symptoms: string[]) {
  const joined = symptoms.join(' ').toLowerCase();

  if (
    joined.includes('libido') ||
    joined.includes('muscle') ||
    joined.includes('trt') ||
    joined.includes('hormone') ||
    joined.includes('testosterone') ||
    joined.includes('fatigue')
  ) {
    return 'Hormone Optimization';
  }

  if (
    joined.includes('brain fog') ||
    joined.includes('focus') ||
    joined.includes('memory') ||
    joined.includes('cognitive')
  ) {
    return 'Cognitive Performance';
  }

  if (
    joined.includes('weight') ||
    joined.includes('metabolic') ||
    joined.includes('glucose') ||
    joined.includes('craving')
  ) {
    return 'Weight Management';
  }

  if (
    joined.includes('joint') ||
    joined.includes('longevity') ||
    joined.includes('peptide') ||
    joined.includes('recovery') ||
    joined.includes('sleep') ||
    joined.includes('aging')
  ) {
    return 'Longevity & Aging';
  }

  return 'General Wellness';
}

export function buildPatientAssessmentPath(handoff: PatientAssessmentHandoff) {
  const params = new URLSearchParams();
  const symptoms = uniqueStrings((handoff.symptoms || []).slice(0, 8));
  const goal = sanitizeValue(handoff.goal) || inferGoalFromSymptoms(symptoms);

  if (goal) {
    params.set('goal', goal);
  }
  if (sanitizeValue(handoff.urgency)) {
    params.set('urgency', sanitizeValue(handoff.urgency));
  }
  if (sanitizeValue(handoff.entryPoint)) {
    params.set('entryPoint', sanitizeValue(handoff.entryPoint));
  }
  if (sanitizeValue(handoff.preferredClinicId)) {
    params.set('preferredClinicId', sanitizeValue(handoff.preferredClinicId));
  }
  if (sanitizeValue(handoff.preferredClinicName)) {
    params.set('preferredClinicName', sanitizeValue(handoff.preferredClinicName));
  }
  if (sanitizeValue(handoff.preferredClinicLocation)) {
    params.set('preferredClinicLocation', sanitizeValue(handoff.preferredClinicLocation));
  }
  if (typeof handoff.preferredClinicRating === 'number' && Number.isFinite(handoff.preferredClinicRating)) {
    params.set('preferredClinicRating', String(handoff.preferredClinicRating));
  }
  if (sanitizeValue(handoff.preferredClinicPricingTier)) {
    params.set('preferredClinicPricingTier', sanitizeValue(handoff.preferredClinicPricingTier));
  }

  symptoms.forEach((symptom) => {
    params.append('symptom', symptom);
  });

  const suffix = params.toString();
  return suffix ? `/patient/assessment?${suffix}` : '/patient/assessment';
}

export function buildClinicAssessmentPath(
  clinic: Pick<
    PublicClinicCard | PublicClinicProfile,
    'id' | 'name' | 'location' | 'rating' | 'pricingTier' | 'specialties'
  >,
  entryPoint: PatientEntryPoint,
) {
  const inferredGoal = inferGoalFromSymptoms(clinic.specialties || []);

  return buildPatientAssessmentPath({
    entryPoint,
    goal: inferredGoal,
    preferredClinicId: clinic.id,
    preferredClinicName: clinic.name,
    preferredClinicLocation: clinic.location,
    preferredClinicRating: clinic.rating,
    preferredClinicPricingTier: clinic.pricingTier,
  });
}

export function parsePatientAssessmentHandoff(searchParams: URLSearchParams): PatientAssessmentHandoff {
  const symptoms = uniqueStrings(searchParams.getAll('symptom')).slice(0, 8);
  const goal = sanitizeValue(searchParams.get('goal') || undefined);

  return {
    entryPoint: (sanitizeValue(searchParams.get('entryPoint') || undefined) as PatientEntryPoint) || undefined,
    goal: goal || (symptoms.length > 0 ? inferGoalFromSymptoms(symptoms) : undefined),
    symptoms,
    urgency: sanitizeValue(searchParams.get('urgency') || undefined),
    preferredClinicId: sanitizeValue(searchParams.get('preferredClinicId') || undefined),
    preferredClinicName: sanitizeValue(searchParams.get('preferredClinicName') || undefined),
    preferredClinicLocation: sanitizeValue(searchParams.get('preferredClinicLocation') || undefined),
    preferredClinicPricingTier: sanitizeValue(searchParams.get('preferredClinicPricingTier') || undefined),
    preferredClinicRating: searchParams.get('preferredClinicRating')
      ? Number.parseFloat(searchParams.get('preferredClinicRating') || '')
      : undefined,
  };
}

export function normalizePatientRoutePath(path: string) {
  const trimmed = sanitizeValue(path);
  if (!trimmed) {
    return '/ask-ai';
  }

  const normalized = ROUTE_ALIASES[trimmed] || trimmed;

  if (
    normalized === '/patient' ||
    normalized === '/patient/assessment' ||
    normalized === '/symptom-checker' ||
    normalized === '/ask-ai' ||
    normalized === '/directory' ||
    normalized === '/support/patient' ||
    normalized === '/contact' ||
    normalized.startsWith('/clinics/') ||
    normalized.startsWith('/blog/') ||
    normalized.startsWith('/marketplace/')
  ) {
    return normalized;
  }

  return '/ask-ai';
}
