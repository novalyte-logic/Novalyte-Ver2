import { GoogleGenAI, Schema, Type } from '@google/genai';
import { serverEnv } from './env';

type JsonObject = Record<string, unknown>;
type AiOperation =
  | 'triage'
  | 'recommendations'
  | 'clinic_insights'
  | 'outreach'
  | 'chat'
  | 'research'
  | 'workflow_suggestions';

type GenerateOptions<T> = {
  operation: AiOperation;
  model: string;
  prompt: string;
  schema: Schema;
  validate: (value: unknown) => value is T;
  requestId?: string;
};

export type TriageResult = {
  score: number;
  riskLevel: 'low' | 'medium' | 'high';
  rationale: string;
  confidenceScore: number;
  nextBestAction: string;
  keySignals: string[];
};

export type RecommendationResult = {
  recommendations: string[];
  rationale: string;
  confidenceScore: number;
  nextBestAction: string;
};

export type ClinicInsightsResult = {
  insights: string[];
  rationale: string;
  confidenceScore: number;
  nextBestAction: string;
};

export type OutreachResult = {
  message: string;
  rationale: string;
  confidenceScore: number;
  nextBestAction: string;
};

export type ChatResult = {
  response: string;
  rationale: string;
  confidenceScore: number;
  nextBestAction: string;
  suggestedActions: Array<{ label: string; path: string }>;
};

export type ResearchResult = {
  findings: string;
  rationale: string;
  confidenceScore: number;
  nextBestAction: string;
};

export type WorkflowSuggestionsResult = {
  suggestions: string[];
  rationale: string;
  confidenceScore: number;
  nextBestAction: string;
};

export class AIIntegrationError extends Error {
  status: number;
  code: string;
  operation: AiOperation;

  constructor(status: number, code: string, operation: AiOperation, message: string) {
    super(message);
    this.status = status;
    this.code = code;
    this.operation = operation;
  }
}

const CHAT_ROUTE_ALIASES: Record<string, string> = {
  '/health-dashboard': '/patient',
  '/symptom-tracker': '/symptom-checker',
  '/patient-intake': '/patient/assessment',
  '/clinic-directory': '/directory',
  '/assessment': '/patient/assessment',
};

let aiClient: GoogleGenAI | null = null;

try {
  aiClient = serverEnv.geminiApiKey ? new GoogleGenAI({ apiKey: serverEnv.geminiApiKey }) : null;
} catch (error) {
  console.error(
    JSON.stringify({
      level: 'error',
      source: 'ai_service',
      message: 'provider_client_init_failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    }),
  );
  aiClient = null;
}

function logAiEvent(level: 'info' | 'warn' | 'error', payload: JsonObject) {
  console[level](
    JSON.stringify({
      level,
      source: 'ai_service',
      ...payload,
    }),
  );
}

function isPlainObject(value: unknown): value is JsonObject {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function sanitizeString(value: unknown, maxLength = 5000) {
  if (typeof value !== 'string') {
    return '';
  }
  return value.trim().slice(0, maxLength);
}

function sanitizeStringArray(value: unknown, maxItems = 12, maxItemLength = 160) {
  if (!Array.isArray(value)) {
    return [] as string[];
  }

  return value
    .filter((entry): entry is string => typeof entry === 'string')
    .map((entry) => entry.trim().slice(0, maxItemLength))
    .filter(Boolean)
    .slice(0, maxItems);
}

function sanitizeNumber(value: unknown, fallback = 0) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number.parseFloat(value.trim());
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

function normalizeConfidence(value: unknown) {
  const numeric = sanitizeNumber(value, 0);
  return Math.max(0, Math.min(1, numeric));
}

function normalizeChatPath(value: unknown) {
  const rawPath = sanitizeString(value, 240);
  if (!rawPath) {
    return '';
  }

  const normalized = CHAT_ROUTE_ALIASES[rawPath] || rawPath;
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

  return '';
}

function getFallbackChatActions(message: string) {
  const normalized = message.toLowerCase();
  if (normalized.includes('symptom') || normalized.includes('fatigue') || normalized.includes('testosterone')) {
    return [
      { label: 'Run Symptom Checker', path: '/symptom-checker' },
      { label: 'Start Assessment', path: '/patient/assessment' },
    ];
  }

  if (normalized.includes('clinic') || normalized.includes('provider') || normalized.includes('doctor')) {
    return [
      { label: 'Browse Clinics', path: '/directory' },
      { label: 'Start Assessment', path: '/patient/assessment' },
    ];
  }

  return [
    { label: 'Start Assessment', path: '/patient/assessment' },
    { label: 'Browse Clinics', path: '/directory' },
  ];
}

function hasRequiredStrings(value: JsonObject, fields: string[]) {
  return fields.every((field) => sanitizeString(value[field]).length > 0);
}

function isTriageResult(value: unknown): value is TriageResult {
  if (!isPlainObject(value) || !hasRequiredStrings(value, ['riskLevel', 'rationale', 'nextBestAction'])) {
    return false;
  }

  const riskLevel = sanitizeString(value.riskLevel).toLowerCase();
  return ['low', 'medium', 'high'].includes(riskLevel);
}

function isRecommendationResult(value: unknown): value is RecommendationResult {
  return (
    isPlainObject(value) &&
    Array.isArray(value.recommendations) &&
    hasRequiredStrings(value, ['rationale', 'nextBestAction'])
  );
}

function isClinicInsightsResult(value: unknown): value is ClinicInsightsResult {
  return (
    isPlainObject(value) &&
    Array.isArray(value.insights) &&
    hasRequiredStrings(value, ['rationale', 'nextBestAction'])
  );
}

function isOutreachResult(value: unknown): value is OutreachResult {
  return isPlainObject(value) && hasRequiredStrings(value, ['message', 'rationale', 'nextBestAction']);
}

function isChatResult(value: unknown): value is ChatResult {
  return (
    isPlainObject(value) &&
    hasRequiredStrings(value, ['response', 'rationale', 'nextBestAction']) &&
    Array.isArray(value.suggestedActions)
  );
}

function isResearchResult(value: unknown): value is ResearchResult {
  return isPlainObject(value) && hasRequiredStrings(value, ['findings', 'rationale', 'nextBestAction']);
}

function isWorkflowSuggestionsResult(value: unknown): value is WorkflowSuggestionsResult {
  return (
    isPlainObject(value) &&
    Array.isArray(value.suggestions) &&
    hasRequiredStrings(value, ['rationale', 'nextBestAction'])
  );
}

function normalizeTriageResult(value: TriageResult): TriageResult {
  return {
    score: Math.max(0, Math.min(100, Math.round(sanitizeNumber(value.score, 0)))),
    riskLevel: sanitizeString(value.riskLevel).toLowerCase() as TriageResult['riskLevel'],
    rationale: sanitizeString(value.rationale, 2000),
    confidenceScore: normalizeConfidence(value.confidenceScore),
    nextBestAction: sanitizeString(value.nextBestAction, 500),
    keySignals: sanitizeStringArray(value.keySignals, 8, 120),
  };
}

function normalizeRecommendationResult(value: RecommendationResult): RecommendationResult {
  return {
    recommendations: sanitizeStringArray(value.recommendations, 8, 180),
    rationale: sanitizeString(value.rationale, 2000),
    confidenceScore: normalizeConfidence(value.confidenceScore),
    nextBestAction: sanitizeString(value.nextBestAction, 500),
  };
}

function normalizeClinicInsightsResult(value: ClinicInsightsResult): ClinicInsightsResult {
  return {
    insights: sanitizeStringArray(value.insights, 8, 220),
    rationale: sanitizeString(value.rationale, 2000),
    confidenceScore: normalizeConfidence(value.confidenceScore),
    nextBestAction: sanitizeString(value.nextBestAction, 500),
  };
}

function normalizeOutreachResult(value: OutreachResult): OutreachResult {
  return {
    message: sanitizeString(value.message, 1500),
    rationale: sanitizeString(value.rationale, 1200),
    confidenceScore: normalizeConfidence(value.confidenceScore),
    nextBestAction: sanitizeString(value.nextBestAction, 300),
  };
}

function normalizeChatResult(value: ChatResult, sourceMessage = ''): ChatResult {
  const suggestedActions = Array.isArray(value.suggestedActions)
    ? (value.suggestedActions as unknown[])
        .filter((entry): entry is Record<string, unknown> => isPlainObject(entry))
        .map((entry) => ({
          label: sanitizeString(entry.label, 80),
          path: normalizeChatPath(entry.path),
        }))
        .filter((entry) => entry.label && entry.path.startsWith('/'))
        .slice(0, 4)
    : [];

  return {
    response: sanitizeString(value.response, 2500),
    rationale: sanitizeString(value.rationale, 1200),
    confidenceScore: normalizeConfidence(value.confidenceScore),
    nextBestAction: sanitizeString(value.nextBestAction, 300),
    suggestedActions: suggestedActions.length > 0 ? suggestedActions : getFallbackChatActions(sourceMessage),
  };
}

function normalizeResearchResult(value: ResearchResult): ResearchResult {
  return {
    findings: sanitizeString(value.findings, 4000),
    rationale: sanitizeString(value.rationale, 1500),
    confidenceScore: normalizeConfidence(value.confidenceScore),
    nextBestAction: sanitizeString(value.nextBestAction, 300),
  };
}

function normalizeWorkflowSuggestionsResult(
  value: WorkflowSuggestionsResult,
): WorkflowSuggestionsResult {
  return {
    suggestions: sanitizeStringArray(value.suggestions, 8, 220),
    rationale: sanitizeString(value.rationale, 1500),
    confidenceScore: normalizeConfidence(value.confidenceScore),
    nextBestAction: sanitizeString(value.nextBestAction, 300),
  };
}

async function delay(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateStructured<T>({
  operation,
  model,
  prompt,
  schema,
  validate,
  requestId,
}: GenerateOptions<T>) {
  if (!aiClient) {
    throw new AIIntegrationError(
      503,
      'ai_not_configured',
      operation,
      'AI service is unavailable right now. Please try again later.',
    );
  }

  const trimmedPrompt = sanitizeString(prompt, 16000);
  if (!trimmedPrompt) {
    throw new AIIntegrationError(400, 'invalid_prompt', operation, 'AI prompt cannot be empty.');
  }

  for (let attempt = 1; attempt <= serverEnv.aiMaxRetries; attempt += 1) {
    const startedAt = Date.now();
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    try {
      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(new AIIntegrationError(504, 'provider_timeout', operation, 'AI request timed out.'));
        }, serverEnv.aiRequestTimeoutMs);
      });

      const response = (await Promise.race([
        aiClient.models.generateContent({
          model,
          contents: trimmedPrompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: schema,
          },
        }),
        timeoutPromise,
      ])) as { text?: string };

      const rawText = sanitizeString(response.text, 12000);
      if (!rawText) {
        throw new AIIntegrationError(502, 'empty_response', operation, 'AI provider returned an empty response.');
      }

      let parsed: unknown;
      try {
        parsed = JSON.parse(rawText);
      } catch {
        throw new AIIntegrationError(502, 'invalid_json', operation, 'AI provider returned invalid JSON.');
      }

      if (!validate(parsed)) {
        throw new AIIntegrationError(
          502,
          'invalid_shape',
          operation,
          'AI provider returned a response that did not match the expected schema.',
        );
      }

      logAiEvent('info', {
        message: 'provider_request_succeeded',
        requestId,
        operation,
        model,
        attempt,
        durationMs: Date.now() - startedAt,
      });

      return parsed;
    } catch (error) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      const integrationError =
        error instanceof AIIntegrationError
          ? error
          : new AIIntegrationError(
              502,
              'provider_failure',
              operation,
              'AI service is unavailable right now. Please try again later.',
            );

      logAiEvent(attempt < serverEnv.aiMaxRetries ? 'warn' : 'error', {
        message: 'provider_request_failed',
        requestId,
        operation,
        model,
        attempt,
        durationMs: Date.now() - startedAt,
        code: integrationError.code,
        error: integrationError.message,
      });

      if (attempt >= serverEnv.aiMaxRetries || integrationError.status === 400 || integrationError.status === 503) {
        throw integrationError;
      }

      await delay(500 * attempt);
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  }

  throw new AIIntegrationError(502, 'provider_failure', operation, 'AI service is unavailable right now. Please try again later.');
}

export const aiService = {
  isConfigured() {
    return Boolean(aiClient);
  },

  getHealthStatus() {
    return {
      configured: Boolean(aiClient),
      fastModel: serverEnv.geminiFastModel,
      researchModel: serverEnv.geminiResearchModel,
      timeoutMs: serverEnv.aiRequestTimeoutMs,
      retries: serverEnv.aiMaxRetries,
    };
  },

  async generateTriage(patientData: JsonObject, requestId?: string) {
    const result = await generateStructured<TriageResult>({
      operation: 'triage',
      model: serverEnv.geminiFastModel,
      requestId,
      prompt: [
        'You are a medical-intake triage assistant for a clinic routing platform.',
        'Return only JSON.',
        'Score the patient from 0 to 100 for likely need and urgency of clinical follow-up.',
        'Use conservative, medically safe language. Do not diagnose.',
        `Patient data: ${JSON.stringify(patientData)}`,
      ].join('\n'),
      schema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          riskLevel: { type: Type.STRING },
          rationale: { type: Type.STRING },
          confidenceScore: { type: Type.NUMBER },
          nextBestAction: { type: Type.STRING },
          keySignals: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['score', 'riskLevel', 'rationale', 'confidenceScore', 'nextBestAction', 'keySignals'],
      },
      validate: isTriageResult,
    });

    return normalizeTriageResult(result);
  },

  async generateRecommendations(profile: JsonObject, context: string, requestId?: string) {
    const result = await generateStructured<RecommendationResult>({
      operation: 'recommendations',
      model: serverEnv.geminiFastModel,
      requestId,
      prompt: [
        'You generate structured clinical or marketplace recommendations for internal routing.',
        'Return only JSON.',
        'Keep the rationale concise and explainable.',
        `Profile: ${JSON.stringify(profile)}`,
        `Context: ${sanitizeString(context, 1500)}`,
      ].join('\n'),
      schema: {
        type: Type.OBJECT,
        properties: {
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
          rationale: { type: Type.STRING },
          confidenceScore: { type: Type.NUMBER },
          nextBestAction: { type: Type.STRING },
        },
        required: ['recommendations', 'rationale', 'confidenceScore', 'nextBestAction'],
      },
      validate: isRecommendationResult,
    });

    return normalizeRecommendationResult(result);
  },

  async generateClinicInsights(clinicData: JsonObject, metrics: JsonObject, requestId?: string) {
    const result = await generateStructured<ClinicInsightsResult>({
      operation: 'clinic_insights',
      model: serverEnv.geminiFastModel,
      requestId,
      prompt: [
        'You summarize clinic performance for operators.',
        'Return only JSON.',
        'Prioritize operationally actionable insights.',
        `Clinic data: ${JSON.stringify(clinicData)}`,
        `Metrics: ${JSON.stringify(metrics)}`,
      ].join('\n'),
      schema: {
        type: Type.OBJECT,
        properties: {
          insights: { type: Type.ARRAY, items: { type: Type.STRING } },
          rationale: { type: Type.STRING },
          confidenceScore: { type: Type.NUMBER },
          nextBestAction: { type: Type.STRING },
        },
        required: ['insights', 'rationale', 'confidenceScore', 'nextBestAction'],
      },
      validate: isClinicInsightsResult,
    });

    return normalizeClinicInsightsResult(result);
  },

  async generateOutreach(patientName: string, intent: string, context: string, requestId?: string) {
    const result = await generateStructured<OutreachResult>({
      operation: 'outreach',
      model: serverEnv.geminiFastModel,
      requestId,
      prompt: [
        'You draft professional outreach for a healthcare operations team.',
        'Return only JSON.',
        'Do not make promises or diagnoses.',
        `Recipient: ${sanitizeString(patientName, 120)}`,
        `Intent: ${sanitizeString(intent, 250)}`,
        `Context: ${sanitizeString(context, 1500)}`,
      ].join('\n'),
      schema: {
        type: Type.OBJECT,
        properties: {
          message: { type: Type.STRING },
          rationale: { type: Type.STRING },
          confidenceScore: { type: Type.NUMBER },
          nextBestAction: { type: Type.STRING },
        },
        required: ['message', 'rationale', 'confidenceScore', 'nextBestAction'],
      },
      validate: isOutreachResult,
    });

    return normalizeOutreachResult(result);
  },

  async generateChatResponse(
    message: string,
    history: Array<{ role: string; content: string }>,
    requestId?: string,
  ) {
    const safeHistory = history
      .slice(-10)
      .map((entry) => ({
        role: entry.role === 'assistant' ? 'assistant' : entry.role === 'ai' ? 'assistant' : 'user',
        content: sanitizeString(entry.content, 1200),
      }))
      .filter((entry) => entry.content);

    const result = await generateStructured<ChatResult>({
      operation: 'chat',
      model: serverEnv.geminiFastModel,
      requestId,
      prompt: [
        'You are the Novalyte Health Intelligence Assistant.',
        'Return only JSON.',
        'Be medically safe, educational, concise, and avoid diagnosing or prescribing.',
        'Where possible, route the user to product flows already available in the app.',
        `Chat history: ${JSON.stringify(safeHistory)}`,
        `Latest user message: ${sanitizeString(message, 2000)}`,
      ].join('\n'),
      schema: {
        type: Type.OBJECT,
        properties: {
          response: { type: Type.STRING },
          rationale: { type: Type.STRING },
          confidenceScore: { type: Type.NUMBER },
          nextBestAction: { type: Type.STRING },
          suggestedActions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                path: { type: Type.STRING },
              },
              required: ['label', 'path'],
            },
          },
        },
        required: ['response', 'rationale', 'confidenceScore', 'nextBestAction', 'suggestedActions'],
      },
      validate: isChatResult,
    });

    return normalizeChatResult(result, message);
  },

  async performResearch(query: string, requestId?: string) {
    const result = await generateStructured<ResearchResult>({
      operation: 'research',
      model: serverEnv.geminiResearchModel,
      requestId,
      prompt: [
        'You perform concise clinical research summaries for operators.',
        'Return only JSON.',
        'Call out uncertainty where appropriate.',
        `Research question: ${sanitizeString(query, 3000)}`,
      ].join('\n'),
      schema: {
        type: Type.OBJECT,
        properties: {
          findings: { type: Type.STRING },
          rationale: { type: Type.STRING },
          confidenceScore: { type: Type.NUMBER },
          nextBestAction: { type: Type.STRING },
        },
        required: ['findings', 'rationale', 'confidenceScore', 'nextBestAction'],
      },
      validate: isResearchResult,
    });

    return normalizeResearchResult(result);
  },

  async generateWorkflowSuggestions(currentState: JsonObject, role: string, requestId?: string) {
    const result = await generateStructured<WorkflowSuggestionsResult>({
      operation: 'workflow_suggestions',
      model: serverEnv.geminiFastModel,
      requestId,
      prompt: [
        'You recommend the next operational steps for a clinic workflow.',
        'Return only JSON.',
        `Role: ${sanitizeString(role, 120)}`,
        `Current state: ${JSON.stringify(currentState)}`,
      ].join('\n'),
      schema: {
        type: Type.OBJECT,
        properties: {
          suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          rationale: { type: Type.STRING },
          confidenceScore: { type: Type.NUMBER },
          nextBestAction: { type: Type.STRING },
        },
        required: ['suggestions', 'rationale', 'confidenceScore', 'nextBestAction'],
      },
      validate: isWorkflowSuggestionsResult,
    });

    return normalizeWorkflowSuggestionsResult(result);
  },
};
