import type { AppRole } from '../../../shared/authRoles';

type Permission = 
  | 'view_patient_pii'
  | 'manage_clinic_settings'
  | 'view_system_analytics'
  | 'route_leads'
  | 'manage_directory';

const RolePermissions: Record<AppRole, Permission[]> = {
  admin: ['view_patient_pii', 'manage_clinic_settings', 'view_system_analytics', 'route_leads', 'manage_directory'],
  system_admin: ['view_patient_pii', 'manage_clinic_settings', 'view_system_analytics', 'route_leads', 'manage_directory'],
  clinic: ['view_patient_pii', 'manage_clinic_settings'],
  clinic_admin: ['view_patient_pii', 'manage_clinic_settings'],
  practitioner: ['view_patient_pii'],
  vendor: [],
  patient: []
};

export const PermissionEngine = {
  hasPermission: (role: AppRole, permission: Permission): boolean => {
    return RolePermissions[role]?.includes(permission) || false;
  }
};
