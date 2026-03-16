import { auth } from '@/src/firebase';

export class ClinicApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

type RequestOptions = {
  method?: string;
  body?: unknown;
};

async function requestJson<T>(path: string, options: RequestOptions = {}) {
  const { method = 'GET', body } = options;
  const token = await auth.currentUser?.getIdToken();
  if (!token) {
    throw new ClinicApiError(401, 'Authentication required.');
  }

  const headers = new Headers({
    Authorization: `Bearer ${token}`,
  });
  if (body !== undefined) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(path, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const payload = (await response.json()) as { error?: string };
      if (payload.error) {
        message = payload.error;
      }
    } catch {
      // Ignore malformed error payloads.
    }

    throw new ClinicApiError(response.status, message);
  }

  return (await response.json()) as T;
}

export type ClinicOverviewResponse = {
  clinic: {
    id: string;
    name: string;
    status: string;
    specialties: string[];
  };
  metrics: {
    activePipeline: number;
    consultsToday: number;
    showRate: number | null;
    estimatedRevenue: number;
    estimatedRevenueLabel: string;
  };
  funnel: {
    intake: number;
    triage: number;
    consult: number;
    treating: number;
  };
  priorityLeads: ClinicLead[];
  schedule: Array<{
    id: string;
    title: string;
    patientName: string;
    startTime: string;
    status: string;
    meetingLink: string;
  }>;
  activity: Array<{
    id: string;
    event: string;
    entity: string;
    type: string;
    createdAt: string;
    timeLabel: string;
  }>;
  insights: Array<{
    id: string;
    type: 'growth' | 'efficiency' | 'retention';
    title: string;
    description: string;
    action: string;
    impact: string;
    createdAt: string;
  }>;
};

export type ClinicLead = {
  id: string;
  patientId?: string;
  assessmentId?: string;
  name: string;
  intent: string;
  score: number;
  status: string;
  stage: 'intake' | 'triage' | 'consult' | 'treating';
  risk: 'high' | 'medium' | 'low';
  riskReason: string;
  intentSignal: string;
  budget: string;
  urgency: string;
  aiSummary: string;
  notes: Array<{
    id: string;
    text: string;
    createdAt: string;
    createdBy: string;
  }>;
  email: string;
  phone: string;
  nextAppointment: string;
  source: string;
  estimatedValue: number;
  createdAt: string;
  updatedAt: string;
  timeLabel: string;
};

export type ClinicProfileResponse = {
  clinic: {
    id: string;
    clinicName: string;
    npiNumber: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    specialties: string[];
    isPublic: boolean;
    acceptsNewPatients: boolean;
    notifyNewLeads: boolean;
    notifyMessages: boolean;
    notifySystem: boolean;
    status: string;
    icpDefined: boolean;
    billingSetup: boolean;
    medicalDirectorVerified: boolean;
    createdAt: string;
  };
};

export type ClinicSupportResponse = {
  tickets: Array<{
    id: string;
    subject: string;
    description: string;
    status: string;
    priority: string;
    createdAt: string;
    updatedAt: string;
  }>;
  systemHealth: Array<{
    id: string;
    label: string;
    status: string;
  }>;
};

export type ClinicBillingResponse = {
  clinic: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    npiNumber: string;
  };
  plan: {
    name: string;
    priceLabel: string;
    interval: string;
    nextBillingDate: string;
    status: string;
    features: string[];
  };
  paymentMethod: {
    brand: string;
    last4: string;
    expMonth: string;
    expYear: string;
  } | null;
  summary: {
    totalInvoiced: number;
    totalInvoicedLabel: string;
    outstandingBalance: number;
    outstandingBalanceLabel: string;
    procurementSpend: number;
    procurementSpendLabel: string;
  };
  invoices: Array<{
    id: string;
    amount: number;
    status: string;
    dueDate: string;
    createdAt: string;
    description: string;
  }>;
};

export type ClinicIntelligenceResponse = {
  summary: string;
  metrics: {
    activePatients: number;
    qualifiedLeads: number;
    scheduledLeads: number;
    bookedConsults: number;
    recognizedRevenue: number;
    recognizedRevenueLabel: string;
  };
  sourceAnalysis: Array<{
    source: string;
    volume: number;
    conversion: number;
  }>;
  treatmentMix: Array<{
    label: string;
    value: number;
  }>;
  insights: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    action: string;
    impact: string;
    createdAt: string;
  }>;
};

export const ClinicService = {
  getOverview() {
    return requestJson<ClinicOverviewResponse>('/api/clinic/overview');
  },

  getLeads() {
    return requestJson<{ leads: ClinicLead[] }>('/api/clinic/leads');
  },

  updateLead(id: string, payload: { status?: string; nextAppointment?: string | null }) {
    return requestJson<{ success: boolean }>(`/api/clinic/leads/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: payload,
    });
  },

  addLeadNote(id: string, text: string) {
    return requestJson<{ note: ClinicLead['notes'][number] }>(
      `/api/clinic/leads/${encodeURIComponent(id)}/notes`,
      {
        method: 'POST',
        body: { text },
      },
    );
  },

  cancelLeadAppointment(id: string) {
    return requestJson<{ success: boolean }>(
      `/api/clinic/leads/${encodeURIComponent(id)}/cancel-appointment`,
      {
        method: 'POST',
      },
    );
  },

  scoreLead(id: string) {
    return requestJson<{ score: number; summary: string; nextBestAction: string }>(
      `/api/clinic/leads/${encodeURIComponent(id)}/score`,
      {
        method: 'POST',
      },
    );
  },

  getProfile() {
    return requestJson<ClinicProfileResponse>('/api/clinic/profile');
  },

  saveProfile(payload: Record<string, unknown>) {
    return requestJson<{ success: boolean }>('/api/clinic/profile', {
      method: 'PUT',
      body: payload,
    });
  },

  getSupport() {
    return requestJson<ClinicSupportResponse>('/api/clinic/support');
  },

  createSupportTicket(payload: {
    subject: string;
    description: string;
    priority: string;
  }) {
    return requestJson<{ ticket: ClinicSupportResponse['tickets'][number] }>(
      '/api/clinic/support/tickets',
      {
        method: 'POST',
        body: payload,
      },
    );
  },

  getBilling() {
    return requestJson<ClinicBillingResponse>('/api/clinic/billing');
  },

  getIntelligence() {
    return requestJson<ClinicIntelligenceResponse>('/api/clinic/intelligence');
  },

  createMarketplaceOrder(productId: string) {
    return requestJson<{
      order: {
        id: string;
        productId: string;
        productName: string;
        vendor: string;
        status: string;
        createdAt: string;
      };
    }>('/api/clinic/marketplace/orders', {
      method: 'POST',
      body: { productId },
    });
  },
};
