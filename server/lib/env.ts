type LogLevel = 'debug' | 'info' | 'warn' | 'error';

function parseBoolean(value: string | undefined, fallback = false) {
  if (value === undefined) {
    return fallback;
  }

  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
}

function parseList(value: string | undefined) {
  return (value || '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function parseLogLevel(value: string | undefined): LogLevel {
  if (value === 'debug' || value === 'info' || value === 'warn' || value === 'error') {
    return value;
  }
  return 'info';
}

export const serverEnv = {
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV !== 'production',
  port: Number(process.env.PORT || 3000),
  appUrl: process.env.APP_URL || '',
  allowedOrigins: parseList(process.env.ALLOWED_ORIGINS),
  logLevel: parseLogLevel(process.env.LOG_LEVEL),
  trustProxy: parseBoolean(process.env.TRUST_PROXY, process.env.NODE_ENV === 'production'),
  requestLoggingEnabled: parseBoolean(process.env.ENABLE_REQUEST_LOGGING, true),
  sentryDsn: process.env.SENTRY_DSN || '',
  clientErrorEndpointEnabled: parseBoolean(process.env.ENABLE_CLIENT_ERROR_INGEST, true),
  analyticsEndpointEnabled: parseBoolean(process.env.ENABLE_ANALYTICS_INGEST, true),
  releaseVersion: process.env.RELEASE_VERSION || process.env.RENDER_GIT_COMMIT || '',
  supabaseUrl: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '',
  supabasePublishableKey:
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    '',
  supabaseSecretKey: process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '',
};

export function getAllowedOrigins() {
  if (serverEnv.allowedOrigins.length > 0) {
    return serverEnv.allowedOrigins;
  }

  return serverEnv.appUrl ? [serverEnv.appUrl] : [];
}
