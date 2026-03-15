import type {
  MatchBreakdown,
  MatchResult,
  PractitionerProfile,
  StaffingRequest,
} from './types';

const MATCH_WEIGHTS: Record<keyof MatchBreakdown, number> = {
  role: 0.24,
  protocols: 0.24,
  location: 0.16,
  employment: 0.12,
  experience: 0.14,
  licensure: 0.1,
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function uniqueNormalized(values: string[]) {
  return Array.from(new Set(values.map(normalize).filter(Boolean)));
}

function percentage(matchCount: number, total: number) {
  if (total <= 0) {
    return 0;
  }

  return Math.round((matchCount / total) * 100);
}

function scoreRole(profile: PractitionerProfile, request: StaffingRequest) {
  return normalize(profile.role) === normalize(request.role) ? 100 : 25;
}

function scoreProtocols(profile: PractitionerProfile, request: StaffingRequest) {
  const profileProtocols = uniqueNormalized(profile.protocols);
  const requestProtocols = uniqueNormalized(request.requiredProtocols);

  if (requestProtocols.length === 0) {
    return 100;
  }

  const matches = requestProtocols.filter((protocol) => profileProtocols.includes(protocol));
  return Math.max(percentage(matches.length, requestProtocols.length), matches.length > 0 ? 45 : 0);
}

function scoreLocation(profile: PractitionerProfile, request: StaffingRequest) {
  if (request.workMode === 'Remote' || request.location.isRemote) {
    return 100;
  }

  const sameState = normalize(profile.location.state) === normalize(request.location.state);
  const sameCity = normalize(profile.location.city) === normalize(request.location.city);

  if (sameCity && sameState) {
    return 100;
  }

  if (sameState || profile.workModes.includes('Remote') || profile.workModes.includes('Hybrid')) {
    return 70;
  }

  return 20;
}

function scoreEmployment(profile: PractitionerProfile, request: StaffingRequest) {
  return profile.employmentPreferences.includes(request.employmentType) ? 100 : 30;
}

function scoreExperience(profile: PractitionerProfile, request: StaffingRequest) {
  if (profile.yearsExperience >= request.minimumYearsExperience) {
    return 100;
  }

  if (request.minimumYearsExperience <= 0) {
    return 100;
  }

  return Math.max(
    0,
    Math.round((profile.yearsExperience / request.minimumYearsExperience) * 100),
  );
}

function scoreLicensure(profile: PractitionerProfile, request: StaffingRequest) {
  const requestStates = uniqueNormalized(request.requiredLicenseStates);
  const profileStates = uniqueNormalized(profile.licenseStates);

  if (requestStates.length === 0) {
    return 100;
  }

  const matches = requestStates.filter((state) => profileStates.includes(state));
  return matches.length > 0 ? percentage(matches.length, requestStates.length) : 0;
}

export function calculateProfileStrength(
  input: Pick<
    PractitionerProfile,
    | 'firstName'
    | 'lastName'
    | 'email'
    | 'phone'
    | 'location'
    | 'role'
    | 'licenseStates'
    | 'licenseNumber'
    | 'yearsExperience'
    | 'protocols'
    | 'employmentPreferences'
    | 'workModes'
    | 'summary'
    | 'resumeUploaded'
  >,
) {
  let score = 0;

  if (input.firstName && input.lastName) score += 12;
  if (input.email && input.phone) score += 12;
  if (input.location.city && input.location.state) score += 8;
  if (input.role) score += 10;
  if (input.licenseStates.length > 0 && input.licenseNumber) score += 16;
  if (input.yearsExperience > 0) score += 10;
  if (input.protocols.length > 0) score += 10;
  if (input.employmentPreferences.length > 0) score += 8;
  if (input.workModes.length > 0) score += 4;
  if (input.summary) score += 5;
  if (input.resumeUploaded) score += 5;

  return Math.min(score, 100);
}

export function scorePractitionerForRequest(
  profile: PractitionerProfile,
  request: StaffingRequest,
): MatchResult {
  const breakdown: MatchBreakdown = {
    role: scoreRole(profile, request),
    protocols: scoreProtocols(profile, request),
    location: scoreLocation(profile, request),
    employment: scoreEmployment(profile, request),
    experience: scoreExperience(profile, request),
    licensure: scoreLicensure(profile, request),
  };

  const weightedScore = Object.entries(breakdown).reduce((total, [key, value]) => {
    return total + value * MATCH_WEIGHTS[key as keyof MatchBreakdown];
  }, 0);

  const reasons: string[] = [];
  const gaps: string[] = [];

  if (breakdown.role >= 90) reasons.push(`Role alignment is strong for ${request.role}.`);
  else gaps.push(`Role alignment is weaker than the requested ${request.role}.`);

  if (breakdown.protocols >= 70) {
    reasons.push('Protocol experience overlaps with the requisition requirements.');
  } else if (request.requiredProtocols.length > 0) {
    gaps.push('Protocol overlap is limited for this requisition.');
  }

  if (breakdown.location >= 70) reasons.push('Location and work mode align with the clinic need.');
  else gaps.push('Location fit may require travel or remote flexibility.');

  if (breakdown.experience >= 90) reasons.push('Experience level satisfies the clinic threshold.');
  else gaps.push('Experience is below the clinic target.');

  if (breakdown.licensure === 0 && request.requiredLicenseStates.length > 0) {
    gaps.push('No matching required license state was found.');
  } else if (breakdown.licensure >= 90) {
    reasons.push('Licensure coverage matches the required states.');
  }

  return {
    score: Math.round(weightedScore),
    breakdown,
    reasons: reasons.slice(0, 3),
    gaps: gaps.slice(0, 3),
  };
}
