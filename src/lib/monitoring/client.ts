const CLIENT_ERROR_ENDPOINT = '/api/telemetry/client-errors';
const MONITORING_FLAG = '__novalyteClientMonitoringInstalled';

declare global {
  interface Window {
    [MONITORING_FLAG]?: boolean;
  }
}

function sendPayload(payload: Record<string, unknown>) {
  const body = JSON.stringify(payload);

  if (navigator.sendBeacon) {
    const sent = navigator.sendBeacon(
      CLIENT_ERROR_ENDPOINT,
      new Blob([body], { type: 'application/json' }),
    );
    if (sent) {
      return;
    }
  }

  void fetch(CLIENT_ERROR_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => {
    // Swallow client-monitoring network failures.
  });
}

function serializeError(error: unknown) {
  if (error instanceof Error) {
    return {
      message: error.message,
      stack: error.stack || '',
      name: error.name,
    };
  }

  return {
    message: typeof error === 'string' ? error : 'Unknown client error',
    stack: '',
    name: 'UnknownError',
  };
}

export function reportClientError(payload: {
  source: 'window.error' | 'window.unhandledrejection' | 'manual';
  error: unknown;
  metadata?: Record<string, unknown>;
}) {
  const serializedError = serializeError(payload.error);

  sendPayload({
    source: payload.source,
    error: serializedError,
    metadata: payload.metadata || {},
    location: window.location.href,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
  });
}

export function initClientMonitoring() {
  if (typeof window === 'undefined' || window[MONITORING_FLAG]) {
    return;
  }

  window[MONITORING_FLAG] = true;

  window.addEventListener('error', (event) => {
    reportClientError({
      source: 'window.error',
      error: event.error || new Error(event.message),
      metadata: {
        filename: event.filename,
        line: event.lineno,
        column: event.colno,
      },
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    reportClientError({
      source: 'window.unhandledrejection',
      error: event.reason,
    });
  });
}
