export class PublicApiError extends Error {
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

  const response = await fetch(path, {
    method,
    headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
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

    throw new PublicApiError(response.status, message);
  }

  return (await response.json()) as T;
}

export type ContactSubmissionResponse = {
  trackingId: string;
  intent: 'support' | 'partnership' | 'billing' | 'technical' | 'general';
  urgency: 'low' | 'medium' | 'high';
  routingDestination: string;
  expectedResponseTime: string;
};

export type PublicClinicCard = {
  id: string;
  name: string;
  city: string;
  state: string;
  location: string;
  rating: number;
  reviewCount: number;
  pricingTier: string;
  tags: string[];
  specialties: string[];
  image: string;
  waitlist: string;
  description: string;
  acceptsInsurance: boolean;
  acceptsNewPatients: boolean;
};

export type PublicClinicProfile = PublicClinicCard & {
  address: string;
  phone: string;
  email: string;
  website: string;
  hours: string;
  features: string[];
  protocols: Array<{
    name: string;
    description: string;
    duration: string;
    price: string;
  }>;
  providers: Array<{
    name: string;
    role: string;
    credentials: string;
    bio: string;
    image: string;
  }>;
  outcomes: Array<{
    metric: string;
    label: string;
    timeframe: string;
  }>;
  gallery: string[];
};

export type ClinicApplicationResponse = {
  applicationId: string;
  result: 'approved' | 'manual_review' | 'rejected';
  nextStepPath: string;
};

export type VendorApplicationResponse = {
  applicationId: string;
  reviewEtaDays: number;
};

export type ClinicIcpResponse = {
  profileId: string;
};

export type MatchedClinicSummary = {
  id: string;
  name: string;
  city: string;
  state: string;
  rating: number;
  pricingTier: string;
  matchScore: number;
  routingMode?: 'preferred_clinic' | 'network_match';
  routingReason?: string;
  matchedSignals?: string[];
} | null;

export type ClinicAvailabilitySlot = {
  key: string;
  startsAt: string;
  dayLabel: string;
  timeLabel: string;
  label: string;
};

export type ClinicAvailabilityResponse = {
  clinic: {
    id: string;
    name: string;
    location: string;
    waitlist: string;
    acceptsNewPatients: boolean;
  };
  slots: ClinicAvailabilitySlot[];
  generatedAt: string;
};

export type PublicMarketplaceProduct = {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  description: string;
  price: string;
  vendor: string;
  rating: number;
  reviews: number;
  image: string;
  gallery: string[];
  compliance: string;
  implementation: string;
  compatibility: string;
  turnaround: string;
  sample: string;
  payback: string;
  revenuePerPatient: string;
  roi: string;
  location: string;
  patients: string;
  features: string[];
  benefits: string[];
  requirements: string[];
  useCases: string[];
  specs: Array<{ label: string; value: string }>;
  verified: boolean;
};

export type PatientAssessmentResponse = {
  result: 'qualified' | 'disqualified';
  patientId: string;
  assessmentId: string;
  leadId: string | null;
  matchedClinic: MatchedClinicSummary;
};

export type BookingResponse = {
  bookingId: string;
  status: 'pending_confirmation';
  clinicName: string;
  slotLabel: string;
  followUpPath: string;
};

export const PublicService = {
  getClinics() {
    return requestJson<{ clinics: PublicClinicCard[] }>('/api/public/clinics');
  },

  getClinicProfile(clinicId: string) {
    return requestJson<{ clinic: PublicClinicProfile; relatedClinics: PublicClinicCard[] }>(
      `/api/public/clinics/${encodeURIComponent(clinicId)}`,
    );
  },

  getClinicAvailability(clinicId: string) {
    return requestJson<ClinicAvailabilityResponse>(
      `/api/public/clinics/${encodeURIComponent(clinicId)}/availability`,
    );
  },

  getMarketplaceProducts(params: {
    category?: string;
    query?: string;
    limit?: number;
  } = {}) {
    const search = new URLSearchParams();
    if (params.category) {
      search.set('category', params.category);
    }
    if (params.query) {
      search.set('q', params.query);
    }
    if (typeof params.limit === 'number') {
      search.set('limit', String(params.limit));
    }

    const suffix = search.toString() ? `?${search.toString()}` : '';
    return requestJson<{ products: PublicMarketplaceProduct[] }>(`/api/public/products${suffix}`);
  },

  getMarketplaceProduct(productId: string) {
    return requestJson<{ product: PublicMarketplaceProduct }>(
      `/api/public/products/${encodeURIComponent(productId)}`,
    );
  },

  submitContact(payload: {
    name: string;
    email: string;
    role: 'patient' | 'clinic' | 'vendor' | 'other';
    message: string;
  }) {
    return requestJson<ContactSubmissionResponse>('/api/public/contact', {
      method: 'POST',
      body: payload,
    });
  },

  submitClinicApplication(payload: Record<string, unknown>) {
    return requestJson<ClinicApplicationResponse>('/api/public/clinic-applications', {
      method: 'POST',
      body: payload,
    });
  },

  submitVendorApplication(payload: Record<string, unknown>) {
    return requestJson<VendorApplicationResponse>('/api/public/vendor-applications', {
      method: 'POST',
      body: payload,
    });
  },

  submitClinicIcp(payload: Record<string, unknown>) {
    return requestJson<ClinicIcpResponse>('/api/public/clinic-icp', {
      method: 'POST',
      body: payload,
    });
  },

  submitPatientAssessment(payload: Record<string, unknown>) {
    return requestJson<PatientAssessmentResponse>('/api/public/patient-assessments', {
      method: 'POST',
      body: payload,
    });
  },

  requestBooking(payload: {
    patientId: string;
    clinicId: string;
    assessmentId?: string | null;
    requestedDay?: string;
    requestedTime?: string;
    requestedSlotKey?: string;
  }) {
    return requestJson<BookingResponse>('/api/public/bookings', {
      method: 'POST',
      body: payload,
    });
  },
};
