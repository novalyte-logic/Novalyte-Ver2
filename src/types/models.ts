export type Role = 'patient' | 'clinic_admin' | 'practitioner' | 'vendor' | 'system_admin';

export interface User {
  id: string;
  role: Role;
  email: string;
  name: string;
  createdAt: string;
  lastActiveAt: string;
}

export interface Patient extends User {
  role: 'patient';
  demographics: {
    age?: number;
    gender?: string;
    location?: {
      city: string;
      state: string;
      zipCode: string;
      coordinates?: [number, number];
    };
  };
  healthProfile: {
    primaryGoals: string[];
    symptoms: string[];
    currentTreatments: string[];
  };
  financialProfile: {
    willingToPayOOP: boolean;
    monthlyBudget: number;
  };
}

export interface Clinic extends User {
  role: 'clinic_admin';
  clinicDetails: {
    name: string;
    npi: string;
    specialties: string[];
    services: string[];
    location: {
      address: string;
      city: string;
      state: string;
      zipCode: string;
      coordinates?: [number, number];
    };
    capacity: {
      monthlyNewPatients: number;
      currentActivePatients: number;
    };
  };
  icp: {
    targetDemographics: string[];
    preferredTreatments: string[];
    minimumBudget: number;
  };
  status: 'pending' | 'verified' | 'suspended';
}

export interface Lead {
  id: string;
  patientId: string;
  clinicId?: string;
  status: 'new' | 'triaged' | 'routed' | 'contacted' | 'consult_scheduled' | 'enrolled' | 'dismissed';
  scores: {
    clinicalFit: number;
    financialFit: number;
    urgency: number;
    overall: number;
  };
  estimatedLtv: number;
  source: string;
  createdAt: string;
  updatedAt: string;
  auditTrail: AuditEvent[];
}

export interface AuditEvent {
  id: string;
  entityId: string;
  entityType: 'lead' | 'clinic' | 'patient' | 'system';
  action: string;
  actorId: string;
  actorRole: Role | 'system';
  timestamp: string;
  metadata: Record<string, any>;
  explanation?: string; // AI explanation for the action
}
