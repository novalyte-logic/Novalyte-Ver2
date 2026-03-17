import { Role } from '../../types/models';

type Permission = 
  | 'view_patient_pii'
  | 'manage_clinic_settings'
  | 'view_system_analytics'
  | 'route_leads'
  | 'manage_directory';

const RolePermissions: Record<Role, Permission[]> = {
  system_admin: ['view_patient_pii', 'manage_clinic_settings', 'view_system_analytics', 'route_leads', 'manage_directory'],
  clinic_admin: ['view_patient_pii', 'manage_clinic_settings'],
  practitioner: ['view_patient_pii'],
  vendor: [],
  patient: []
};

export const PermissionEngine = {
  hasPermission: (role: Role, permission: Permission): boolean => {
    return RolePermissions[role]?.includes(permission) || false;
  }
};
