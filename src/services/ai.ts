import { Patient, Clinic } from '../types/models';

export class AIServiceError extends Error {
  status: number;
  code?: string;

  constructor(status: number, message: string, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

const AI_API_TIMEOUT_MS = 20000;

async function requestJson<T>(path: string, body: Record<string, unknown>) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), AI_API_TIMEOUT_MS);

  let response: Response;

  try {
    response = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (error) {
    window.clearTimeout(timeoutId);
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new AIServiceError(504, 'AI request timed out. Please try again.', 'timeout');
    }

    throw new AIServiceError(502, 'Unable to reach the AI service right now.', 'network_error');
  }

  window.clearTimeout(timeoutId);

  if (!response.ok) {
    let message = `AI request failed with status ${response.status}`;
    let code: string | undefined;

    try {
      const payload = (await response.json()) as { error?: string; code?: string };
      if (payload.error) {
        message = payload.error;
      }
      if (payload.code) {
        code = payload.code;
      }
    } catch {
      // Ignore malformed error payloads.
    }

    throw new AIServiceError(response.status, message, code);
  }

  return (await response.json()) as T;
}

export const AIService = {
  async generatePatientInsights(patient: Patient) {
    const data = await requestJson<{
      rationale: string;
      riskLevel: string;
      nextBestAction: string;
      confidenceScore?: number;
      score?: number;
    }>('/api/ai/triage', { patientData: patient as unknown as Record<string, unknown> });

    return {
      summary:
        data.rationale ||
        `Patient is a ${patient.demographics.age || 'unknown'} year old seeking ${patient.healthProfile.primaryGoals.join(', ')}.`,
      riskFactors: [data.riskLevel],
      recommendedProtocols: [data.nextBestAction],
      confidenceScore: data.confidenceScore,
      score: data.score,
    };
  },

  async generateRoutingExplanation(patient: Patient, clinic: Clinic, score: number) {
    const data = await requestJson<{ rationale: string }>('/api/ai/recommendations', {
      profile: patient as unknown as Record<string, unknown>,
      context: `Routing to clinic ${clinic.clinicDetails.name} with score ${score}`,
    });

    return data.rationale;
  },

  async draftOutreachMessage(patientName: string, intent: string) {
    const data = await requestJson<{ message: string }>('/api/ai/outreach', {
      patientName,
      intent,
      context: 'Initial outreach',
    });

    return data.message;
  },

  async chat(message: string, history: Array<{ role: string; content: string }>) {
    return requestJson<{
      response: string;
      rationale?: string;
      confidenceScore?: number;
      nextBestAction?: string;
      suggestedActions?: Array<{ label: string; path: string }>;
    }>('/api/ai/chat', {
      message: message.trim().slice(0, 2000),
      history: history.slice(-10).map((entry) => ({
        role: entry.role,
        content: entry.content.trim().slice(0, 1200),
      })),
    });
  },

  async generateClinicInsights(clinicData: Record<string, unknown>, metrics: Record<string, unknown>) {
    return requestJson<{
      insights: string[];
      rationale: string;
      confidenceScore?: number;
      nextBestAction?: string;
    }>('/api/ai/clinic-insights', { clinicData, metrics });
  },

  async performResearch(query: string) {
    return requestJson<{
      findings: string;
      rationale: string;
      confidenceScore?: number;
      nextBestAction?: string;
    }>('/api/ai/research', { query });
  },

  async getWorkflowSuggestions(currentState: Record<string, unknown>, role: string) {
    return requestJson<{
      suggestions: string[];
      rationale: string;
      confidenceScore?: number;
      nextBestAction?: string;
    }>('/api/ai/workflow-suggestions', { currentState, role });
  },
};
