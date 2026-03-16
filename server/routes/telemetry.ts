import { Router } from 'express';
import { adminDb } from '../lib/supabaseAdmin';
import { serverEnv } from '../lib/env';

const telemetryRouter = Router();

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function normalizePayload(payload: Record<string, unknown>) {
  return JSON.parse(JSON.stringify(payload));
}

telemetryRouter.post('/events', async (req, res) => {
  if (!serverEnv.analyticsEndpointEnabled) {
    return res.status(202).json({ accepted: false, disabled: true });
  }

  if (!isPlainObject(req.body)) {
    return res.status(400).json({ error: 'Invalid event payload.' });
  }

  try {
    await adminDb.collection('analyticsEvents').add({
      ...normalizePayload(req.body),
      releaseVersion: serverEnv.releaseVersion || 'development',
      ingestedAt: new Date().toISOString(),
      requestContext: {
        ip: req.headers['x-forwarded-for'] || req.ip || '',
        origin: req.get('origin') || '',
        userAgent: req.get('user-agent') || '',
      },
    });

    return res.status(202).json({ accepted: true });
  } catch (error) {
    console.error('Analytics ingest failed:', error);
    return res.status(202).json({ accepted: false, buffered: false });
  }
});

telemetryRouter.post('/client-errors', async (req, res) => {
  if (!serverEnv.clientErrorEndpointEnabled) {
    return res.status(202).json({ accepted: false, disabled: true });
  }

  if (!isPlainObject(req.body)) {
    return res.status(400).json({ error: 'Invalid error payload.' });
  }

  try {
    await adminDb.collection('clientErrors').add({
      ...normalizePayload(req.body),
      releaseVersion: serverEnv.releaseVersion || 'development',
      ingestedAt: new Date().toISOString(),
      requestContext: {
        ip: req.headers['x-forwarded-for'] || req.ip || '',
        origin: req.get('origin') || '',
        userAgent: req.get('user-agent') || '',
      },
    });

    return res.status(202).json({ accepted: true });
  } catch (error) {
    console.error('Client error ingest failed:', error);
    return res.status(202).json({ accepted: false, buffered: false });
  }
});

export default telemetryRouter;
