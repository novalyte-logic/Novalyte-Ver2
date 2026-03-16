type LogLevel = 'debug' | 'info' | 'warn' | 'error';

function parseNumber(value: string | undefined, fallback: number) {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

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
  adminActionConfirmationCode: process.env.ADMIN_ACTION_CONFIRMATION_CODE || '1750',
  adminAllowedEmails: parseList(process.env.ADMIN_ALLOWED_EMAILS),
  adminEmail: process.env.ADMIN_EMAIL || '',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  geminiFastModel: process.env.GEMINI_FAST_MODEL || 'gemini-3-flash-preview',
  geminiResearchModel: process.env.GEMINI_RESEARCH_MODEL || 'gemini-3.1-pro-preview',
  aiRequestTimeoutMs: parseNumber(process.env.AI_REQUEST_TIMEOUT_MS, 15000),
  aiMaxRetries: parseNumber(process.env.AI_MAX_RETRIES, 2),
  slackWebhookUrl: process.env.SLACK_WEBHOOK_URL || '',
  notificationTimeoutMs: parseNumber(process.env.NOTIFICATION_TIMEOUT_MS, 4000),
  notificationMaxRetries: parseNumber(process.env.NOTIFICATION_MAX_RETRIES, 2),
  emailFromAddress: process.env.EMAIL_FROM_ADDRESS || '',
  emailSmtpHost: process.env.EMAIL_SMTP_HOST || '',
  emailSmtpPort: parseNumber(process.env.EMAIL_SMTP_PORT, 587),
  emailSmtpSecure: parseBoolean(process.env.EMAIL_SMTP_SECURE, false),
  emailSmtpUser: process.env.EMAIL_SMTP_USER || '',
  emailSmtpPassword: process.env.EMAIL_SMTP_PASSWORD || '',
  emailConnectionTimeoutMs: parseNumber(process.env.EMAIL_CONNECTION_TIMEOUT_MS, 5000),
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
