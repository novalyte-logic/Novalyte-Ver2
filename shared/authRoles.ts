export type AppRole =
  | 'patient'
  | 'clinic'
  | 'clinic_admin'
  | 'practitioner'
  | 'vendor'
  | 'admin'
  | 'system_admin';

const ROLE_ALIASES: Record<string, AppRole> = {
  patient: 'patient',
  clinic: 'clinic',
  clinic_admin: 'clinic_admin',
  'clinic-admin': 'clinic_admin',
  practitioner: 'practitioner',
  vendor: 'vendor',
  admin: 'admin',
  system_admin: 'system_admin',
  'system-admin': 'system_admin',
};

export function normalizeAppRole(value: unknown): AppRole | null {
  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.trim().toLowerCase();
  if (!normalized) {
    return null;
  }

  return ROLE_ALIASES[normalized] ?? null;
}

export function isAdminRole(value: unknown) {
  const role = normalizeAppRole(value);
  return role === 'admin' || role === 'system_admin';
}

export function isClinicRole(value: unknown) {
  const role = normalizeAppRole(value);
  return role === 'clinic' || role === 'clinic_admin';
}

export function canAccessClinicWorkspace(value: unknown) {
  return isClinicRole(value);
}

export function canAccessClinicScopedApis(value: unknown) {
  return isClinicRole(value) || isAdminRole(value);
}
