import { auth } from '@/src/firebase';
import type {
  ApplicationStatus,
  ClinicDashboardData,
  PractitionerDashboardData,
  PractitionerProfile,
  PractitionerProfileInput,
  StaffingRequest,
  StaffingRequestInput,
  WorkforceApplication,
  WorkforceApplicationInput,
  WorkforceCandidateCard,
  WorkforceInterview,
  WorkforceInterviewInput,
  WorkforceNotification,
  WorkforceOffer,
  WorkforceOfferInput,
  WorkforceOpportunity,
} from '@/src/lib/workforce/types';

export class WorkforceApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  authRequired?: boolean;
};

async function requestJson<T>(path: string, options: RequestOptions = {}) {
  const { method = 'GET', body, authRequired = true } = options;
  const headers = new Headers();
  let token: string | null = null;

  if (auth.currentUser) {
    token = await auth.currentUser.getIdToken();
    headers.set('Authorization', `Bearer ${token}`);
  } else if (authRequired) {
    throw new WorkforceApiError(401, 'Authentication required.');
  }

  if (body !== undefined) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(path, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    try {
      const errorPayload = (await response.json()) as { error?: string };
      if (errorPayload.error) {
        errorMessage = errorPayload.error;
      }
    } catch {
      // Ignore JSON parsing failures for error responses.
    }

    throw new WorkforceApiError(response.status, errorMessage);
  }

  return (await response.json()) as T;
}

export const WorkforceService = {
  async getPractitionerProfile() {
    const response = await requestJson<{ profile: PractitionerProfile | null }>(
      '/api/workforce/practitioner-profile/me',
    );
    return response.profile;
  },

  async savePractitionerProfile(input: PractitionerProfileInput) {
    const response = await requestJson<{ profile: PractitionerProfile }>(
      '/api/workforce/practitioner-profile/me',
      {
        method: 'PUT',
        body: input,
      },
    );
    return response.profile;
  },

  async getPractitionerProfileById(id: string) {
    const response = await requestJson<{
      profile: PractitionerProfile;
      applications: WorkforceApplication[];
    }>(`/api/workforce/practitioners/${id}`);
    return response;
  },

  async getOpportunities() {
    const response = await requestJson<{ opportunities: WorkforceOpportunity[] }>(
      '/api/workforce/opportunities',
      { authRequired: false },
    );
    return response.opportunities;
  },

  async getOpportunity(id: string) {
    const response = await requestJson<{ opportunity: WorkforceOpportunity }>(
      `/api/workforce/opportunities/${id}`,
      { authRequired: false },
    );
    return response.opportunity;
  },

  async getCandidates(requestId?: string) {
    const query = requestId ? `?requestId=${encodeURIComponent(requestId)}` : '';
    const response = await requestJson<{ candidates: WorkforceCandidateCard[] }>(
      `/api/workforce/candidates${query}`,
    );
    return response.candidates;
  },

  async createStaffingRequest(input: StaffingRequestInput) {
    const response = await requestJson<{ request: StaffingRequest }>(
      '/api/workforce/staffing-requests',
      {
        method: 'POST',
        body: input,
      },
    );
    return response.request;
  },

  async updateStaffingRequest(id: string, input: StaffingRequestInput) {
    const response = await requestJson<{ request: StaffingRequest }>(
      `/api/workforce/staffing-requests/${id}`,
      {
        method: 'PATCH',
        body: input,
      },
    );
    return response.request;
  },

  async applyToRequest(input: WorkforceApplicationInput) {
    const response = await requestJson<{ application: WorkforceApplication }>(
      '/api/workforce/applications',
      {
        method: 'POST',
        body: input,
      },
    );
    return response.application;
  },

  async updateApplicationStatus(id: string, status: ApplicationStatus) {
    const response = await requestJson<{ application: WorkforceApplication }>(
      `/api/workforce/applications/${id}/status`,
      {
        method: 'PATCH',
        body: { status },
      },
    );
    return response.application;
  },

  async createInterview(input: WorkforceInterviewInput) {
    const response = await requestJson<{ interview: WorkforceInterview }>(
      '/api/workforce/interviews',
      {
        method: 'POST',
        body: input,
      },
    );
    return response.interview;
  },

  async updateInterview(id: string, updates: Partial<WorkforceInterview>) {
    const response = await requestJson<{ interview: WorkforceInterview }>(
      `/api/workforce/interviews/${id}`,
      {
        method: 'PATCH',
        body: updates,
      },
    );
    return response.interview;
  },

  async createOffer(input: WorkforceOfferInput) {
    const response = await requestJson<{ offer: WorkforceOffer }>(
      '/api/workforce/offers',
      {
        method: 'POST',
        body: input,
      },
    );
    return response.offer;
  },

  async updateOffer(id: string, status: WorkforceOffer['status']) {
    const response = await requestJson<{ offer: WorkforceOffer }>(
      `/api/workforce/offers/${id}`,
      {
        method: 'PATCH',
        body: { status },
      },
    );
    return response.offer;
  },

  async getPractitionerDashboard() {
    return requestJson<PractitionerDashboardData>('/api/workforce/dashboard/practitioner');
  },

  async getClinicDashboard() {
    return requestJson<ClinicDashboardData>('/api/workforce/dashboard/clinic');
  },

  async getNotifications() {
    const response = await requestJson<{ notifications: WorkforceNotification[] }>(
      '/api/workforce/notifications',
    );
    return response.notifications;
  },

  async markNotificationRead(id: string) {
    await requestJson<{ success: boolean }>(`/api/workforce/notifications/${id}/read`, {
      method: 'PATCH',
    });
  },
};
