export type EventType = 
  | 'page_view' 
  | 'cta_click' 
  | 'assessment_start' 
  | 'assessment_complete' 
  | 'lead_routed' 
  | 'clinic_login' 
  | 'ai_query';

export interface TrackingEvent {
  id: string;
  type: EventType;
  userId?: string;
  sessionId: string;
  timestamp: string;
  properties: Record<string, unknown>;
}

const SESSION_STORAGE_KEY = 'novalyte_session_id';

function getSessionId() {
  const existing = sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (existing) {
    return existing;
  }

  const sessionId = crypto.randomUUID();
  sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  return sessionId;
}

function dispatchEvent(event: TrackingEvent) {
  const body = JSON.stringify(event);

  if (navigator.sendBeacon) {
    const sent = navigator.sendBeacon(
      '/api/telemetry/events',
      new Blob([body], { type: 'application/json' }),
    );
    if (sent) {
      return;
    }
  }

  void fetch('/api/telemetry/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => {
    // Swallow analytics failures on the client.
  });
}

export const AnalyticsEngine = {
  track: (type: EventType, properties: Record<string, unknown> = {}) => {
    const event: TrackingEvent = {
      id: crypto.randomUUID(),
      type,
      sessionId: getSessionId(),
      timestamp: new Date().toISOString(),
      properties
    };

    if (import.meta.env.DEV) {
      console.debug('[Analytics]', event);
    }

    dispatchEvent(event);
  }
};
