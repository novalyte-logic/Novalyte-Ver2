import express from 'express';
import { AIIntegrationError, aiService } from '../lib/aiService';

const router = express.Router();
type RouteOperation =
  | 'triage'
  | 'recommendations'
  | 'clinic-insights'
  | 'outreach'
  | 'chat'
  | 'research'
  | 'workflow-suggestions';

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function getRequestId(res: express.Response) {
  return typeof res.locals.requestId === 'string' ? res.locals.requestId : undefined;
}

function getRequiredString(
  payload: Record<string, unknown>,
  field: string,
  operation: RouteOperation,
  maxLength = 4000,
) {
  const raw = payload[field];
  if (typeof raw !== 'string') {
    throw new AIIntegrationError(400, 'invalid_request', normalizeOperation(operation), `${field} is required.`);
  }

  const value = raw.trim().slice(0, maxLength);
  if (!value) {
    throw new AIIntegrationError(400, 'invalid_request', normalizeOperation(operation), `${field} is required.`);
  }

  return value;
}

function getOptionalString(payload: Record<string, unknown>, field: string, maxLength = 4000) {
  const raw = payload[field];
  if (typeof raw !== 'string') {
    return '';
  }
  return raw.trim().slice(0, maxLength);
}

function getHistory(payload: Record<string, unknown>) {
  const raw = payload.history;
  if (!Array.isArray(raw)) {
    return [] as Array<{ role: string; content: string }>;
  }

  return raw
    .filter((entry): entry is Record<string, unknown> => isPlainObject(entry))
    .map((entry) => ({
      role: typeof entry.role === 'string' ? entry.role : 'user',
      content: typeof entry.content === 'string' ? entry.content.trim().slice(0, 1200) : '',
    }))
    .filter((entry) => entry.content)
    .slice(-10);
}

function normalizeOperation(operation: RouteOperation) {
  switch (operation) {
    case 'clinic-insights':
      return 'clinic_insights' as const;
    case 'workflow-suggestions':
      return 'workflow_suggestions' as const;
    default:
      return operation.replace(/-/g, '_') as
        | 'triage'
        | 'recommendations'
        | 'outreach'
        | 'chat'
        | 'research';
  }
}

function getJsonObject(
  payload: Record<string, unknown>,
  field: string,
  operation: RouteOperation,
) {
  const value = payload[field];
  if (!isPlainObject(value)) {
    throw new AIIntegrationError(
      400,
      'invalid_request',
      normalizeOperation(operation),
      `${field} must be an object.`,
    );
  }
  return value;
}

function handleAiError(res: express.Response, operation: RouteOperation, error: unknown) {
  if (error instanceof AIIntegrationError) {
    return res.status(error.status).json({
      error: error.message,
      code: error.code,
      operation,
      requestId: getRequestId(res) || null,
    });
  }

  console.error(
    JSON.stringify({
      level: 'error',
      source: 'ai_routes',
      message: 'unhandled_ai_route_error',
      operation,
      requestId: getRequestId(res) || null,
      error: error instanceof Error ? error.message : 'Unknown error',
    }),
  );

  return res.status(500).json({
    error: 'AI service is unavailable right now. Please try again later.',
    code: 'ai_route_failure',
    operation,
    requestId: getRequestId(res) || null,
  });
}

router.post('/triage', async (req, res) => {
  const operation = 'triage';

  try {
    if (!isPlainObject(req.body)) {
      throw new AIIntegrationError(400, 'invalid_request', 'triage', 'Invalid request payload.');
    }

    const patientData = getJsonObject(req.body, 'patientData', operation);
    const result = await aiService.generateTriage(patientData, getRequestId(res));
    return res.json(result);
  } catch (error) {
    return handleAiError(res, operation, error);
  }
});

router.post('/recommendations', async (req, res) => {
  const operation = 'recommendations';

  try {
    if (!isPlainObject(req.body)) {
      throw new AIIntegrationError(400, 'invalid_request', 'recommendations', 'Invalid request payload.');
    }

    const profile = getJsonObject(req.body, 'profile', operation);
    const context = getOptionalString(req.body, 'context', 1500);
    const result = await aiService.generateRecommendations(profile, context, getRequestId(res));
    return res.json(result);
  } catch (error) {
    return handleAiError(res, operation, error);
  }
});

router.post('/clinic-insights', async (req, res) => {
  const operation = 'clinic-insights';

  try {
    if (!isPlainObject(req.body)) {
      throw new AIIntegrationError(400, 'invalid_request', 'clinic_insights', 'Invalid request payload.');
    }

    const clinicData = getJsonObject(req.body, 'clinicData', operation);
    const metrics = getJsonObject(req.body, 'metrics', operation);
    const result = await aiService.generateClinicInsights(clinicData, metrics, getRequestId(res));
    return res.json(result);
  } catch (error) {
    return handleAiError(res, operation, error);
  }
});

router.post('/outreach', async (req, res) => {
  const operation = 'outreach';

  try {
    if (!isPlainObject(req.body)) {
      throw new AIIntegrationError(400, 'invalid_request', 'outreach', 'Invalid request payload.');
    }

    const patientName = getRequiredString(req.body, 'patientName', operation, 120);
    const intent = getRequiredString(req.body, 'intent', operation, 250);
    const context = getOptionalString(req.body, 'context', 1500);
    const result = await aiService.generateOutreach(patientName, intent, context, getRequestId(res));
    return res.json(result);
  } catch (error) {
    return handleAiError(res, operation, error);
  }
});

router.post('/chat', async (req, res) => {
  const operation = 'chat';

  try {
    if (!isPlainObject(req.body)) {
      throw new AIIntegrationError(400, 'invalid_request', 'chat', 'Invalid request payload.');
    }

    const message = getRequiredString(req.body, 'message', operation, 2000);
    const history = getHistory(req.body);
    const result = await aiService.generateChatResponse(message, history, getRequestId(res));
    return res.json(result);
  } catch (error) {
    return handleAiError(res, operation, error);
  }
});

router.post('/research', async (req, res) => {
  const operation = 'research';

  try {
    if (!isPlainObject(req.body)) {
      throw new AIIntegrationError(400, 'invalid_request', 'research', 'Invalid request payload.');
    }

    const query = getRequiredString(req.body, 'query', operation, 3000);
    const result = await aiService.performResearch(query, getRequestId(res));
    return res.json(result);
  } catch (error) {
    return handleAiError(res, operation, error);
  }
});

router.post('/workflow-suggestions', async (req, res) => {
  const operation = 'workflow-suggestions';

  try {
    if (!isPlainObject(req.body)) {
      throw new AIIntegrationError(
        400,
        'invalid_request',
        'workflow_suggestions',
        'Invalid request payload.',
      );
    }

    const currentState = getJsonObject(req.body, 'currentState', operation);
    const role = getRequiredString(req.body, 'role', operation, 120);
    const result = await aiService.generateWorkflowSuggestions(currentState, role, getRequestId(res));
    return res.json(result);
  } catch (error) {
    return handleAiError(res, operation, error);
  }
});

export default router;
