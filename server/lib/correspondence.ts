import nodemailer from 'nodemailer';
import { adminDb } from './supabaseAdmin';
import { serverEnv } from './env';

type DeliveryStatus = 'queued' | 'sent' | 'failed' | 'skipped';

export type SubmissionAlertField = {
  label: string;
  value: string;
};

export type SubmissionAlertInput = {
  category: string;
  title: string;
  entityType: string;
  entityId: string;
  summary: string;
  route: string;
  requestId?: string | null;
  adminPath?: string;
  replyTo?: string | null;
  emailSubject?: string;
  emailFields?: SubmissionAlertField[];
  slackFields?: SubmissionAlertField[];
  metadata?: Record<string, unknown>;
};

type DeliveryResult = {
  status: DeliveryStatus;
  attempts: number;
  detail?: string;
  error?: string;
};

let transporter: ReturnType<typeof nodemailer.createTransport> | null | undefined;

function sanitizeString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function isEmailDeliveryConfigured() {
  return Boolean(
    serverEnv.adminEmail &&
      serverEnv.emailFromAddress &&
      serverEnv.emailSmtpHost &&
      serverEnv.emailSmtpUser &&
      serverEnv.emailSmtpPassword,
  );
}

function isSlackConfigured() {
  return Boolean(serverEnv.slackWebhookUrl);
}

function getTransporter() {
  if (transporter !== undefined) {
    return transporter;
  }

  if (!isEmailDeliveryConfigured()) {
    transporter = null;
    return transporter;
  }

  transporter = nodemailer.createTransport({
    host: serverEnv.emailSmtpHost,
    port: serverEnv.emailSmtpPort,
    secure: serverEnv.emailSmtpSecure,
    auth: {
      user: serverEnv.emailSmtpUser,
      pass: serverEnv.emailSmtpPassword,
    },
    connectionTimeout: serverEnv.emailConnectionTimeoutMs,
    greetingTimeout: serverEnv.emailConnectionTimeoutMs,
    socketTimeout: serverEnv.emailConnectionTimeoutMs,
  });

  return transporter;
}

function buildAbsoluteUrl(path: string | undefined) {
  const trimmedPath = sanitizeString(path);
  if (!trimmedPath) {
    return '';
  }

  if (/^https?:\/\//i.test(trimmedPath)) {
    return trimmedPath;
  }

  const baseUrl = sanitizeString(serverEnv.appUrl).replace(/\/+$/, '');
  if (!baseUrl) {
    return trimmedPath.startsWith('/') ? trimmedPath : `/${trimmedPath}`;
  }

  return `${baseUrl}${trimmedPath.startsWith('/') ? trimmedPath : `/${trimmedPath}`}`;
}

function formatFieldLines(fields: SubmissionAlertField[] = []) {
  return fields
    .map((field) => `${field.label}: ${field.value}`)
    .join('\n');
}

function toSlackFields(fields: SubmissionAlertField[] = []) {
  return fields
    .filter((field) => field.label && field.value)
    .slice(0, 10)
    .map((field) => ({
      type: 'mrkdwn',
      text: `*${field.label}*\n${field.value}`,
    }));
}

function maskLeft(value: string, visible = 2) {
  if (!value) {
    return '';
  }

  if (value.length <= visible) {
    return value;
  }

  return `${value.slice(0, visible)}${'*'.repeat(Math.max(1, value.length - visible))}`;
}

export function maskEmail(email: string) {
  const normalized = sanitizeString(email).toLowerCase();
  const [localPart, domain] = normalized.split('@');
  if (!localPart || !domain) {
    return '';
  }

  return `${maskLeft(localPart, 2)}@${domain}`;
}

export function maskPhone(phone: string) {
  const digits = phone.replace(/\D/g, '');
  if (digits.length <= 4) {
    return digits;
  }

  return `${'*'.repeat(Math.max(2, digits.length - 4))}${digits.slice(-4)}`;
}

export function maskName(name: string) {
  const trimmed = sanitizeString(name);
  if (!trimmed) {
    return '';
  }

  const [firstName, ...rest] = trimmed.split(/\s+/);
  if (rest.length === 0) {
    return firstName;
  }

  const lastName = rest.join(' ');
  return `${firstName} ${lastName.charAt(0)}.`;
}

export function truncateText(value: string, limit = 180) {
  const trimmed = sanitizeString(value);
  if (trimmed.length <= limit) {
    return trimmed;
  }

  return `${trimmed.slice(0, Math.max(0, limit - 1))}...`;
}

async function sleep(ms: number) {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function runWithRetries(
  operation: 'email' | 'slack',
  executor: (attempt: number) => Promise<string>,
): Promise<DeliveryResult> {
  const maxAttempts = Math.max(1, serverEnv.notificationMaxRetries + 1);
  let lastError = '';

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const detail = await executor(attempt);
      return {
        status: 'sent',
        attempts: attempt,
        detail,
      };
    } catch (error) {
      lastError = error instanceof Error ? error.message : `${operation} delivery failed`;
      if (attempt < maxAttempts) {
        await sleep(200 * attempt);
      }
    }
  }

  return {
    status: 'failed',
    attempts: maxAttempts,
    error: lastError,
  };
}

async function sendAdminEmail(input: SubmissionAlertInput): Promise<DeliveryResult> {
  const transport = getTransporter();
  if (!transport || !serverEnv.adminEmail) {
    return {
      status: 'skipped',
      attempts: 0,
      detail: 'email_not_configured',
    };
  }

  const adminUrl = buildAbsoluteUrl(input.adminPath);
  const fieldLines = formatFieldLines(input.emailFields);

  return runWithRetries('email', async () => {
    const result = await transport.sendMail({
      from: serverEnv.emailFromAddress,
      to: serverEnv.adminEmail,
      replyTo: sanitizeString(input.replyTo) || undefined,
      subject: input.emailSubject || `[Novalyte] ${input.title}`,
      text: [
        input.summary,
        '',
        `Category: ${input.category}`,
        `Entity: ${input.entityType} ${input.entityId}`,
        `Route: ${input.route}`,
        input.requestId ? `Request ID: ${input.requestId}` : '',
        adminUrl ? `Admin Path: ${adminUrl}` : '',
        fieldLines ? '' : '',
        fieldLines,
      ]
        .filter(Boolean)
        .join('\n'),
    });

    return sanitizeString(result.messageId) || 'smtp_message_accepted';
  });
}

async function sendSlackAlert(input: SubmissionAlertInput): Promise<DeliveryResult> {
  if (!isSlackConfigured()) {
    return {
      status: 'skipped',
      attempts: 0,
      detail: 'slack_not_configured',
    };
  }

  return runWithRetries('slack', async () => {
    const response = await fetch(serverEnv.slackWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: `${input.title}: ${input.summary}`,
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: input.title.slice(0, 150),
            },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: input.summary.slice(0, 3000),
            },
          },
          {
            type: 'section',
            fields: [
              {
                type: 'mrkdwn',
                text: `*Category*\n${input.category}`,
              },
              {
                type: 'mrkdwn',
                text: `*Entity*\n${input.entityType}:${input.entityId}`,
              },
              ...toSlackFields(input.slackFields),
            ].slice(0, 10),
          },
          ...(input.adminPath
            ? [
                {
                  type: 'section',
                  text: {
                    type: 'mrkdwn',
                    text: `*Admin Link*\n${buildAbsoluteUrl(input.adminPath)}`,
                  },
                },
              ]
            : []),
        ],
      }),
      signal: AbortSignal.timeout(serverEnv.notificationTimeoutMs),
    });

    if (!response.ok) {
      throw new Error(`Slack webhook responded with ${response.status}.`);
    }

    return `slack_${response.status}`;
  });
}

async function writeSubmissionAudit(input: SubmissionAlertInput) {
  await adminDb.collection('adminAuditLogs').add({
    action: input.title,
    entityType: input.entityType,
    entityId: input.entityId,
    actorId: 'system',
    actorEmail: serverEnv.adminEmail || null,
    actorName: 'System',
    reason: input.category,
    sensitive: false,
    metadata: {
      route: input.route,
      summary: input.summary,
      adminPath: input.adminPath || null,
      ...(input.metadata || {}),
    },
    createdAt: new Date().toISOString(),
  });
}

export async function deliverSubmissionAlert(input: SubmissionAlertInput) {
  const now = new Date().toISOString();
  const dispatchRef = await adminDb.collection('submissionDispatches').add({
    category: input.category,
    title: input.title,
    entityType: input.entityType,
    entityId: input.entityId,
    summary: input.summary,
    route: input.route,
    requestId: input.requestId || null,
    replyTo: sanitizeString(input.replyTo) || null,
    adminPath: input.adminPath || null,
    metadata: input.metadata || {},
    emailStatus: isEmailDeliveryConfigured() ? 'queued' : 'skipped',
    slackStatus: isSlackConfigured() ? 'queued' : 'skipped',
    createdAt: now,
    updatedAt: now,
  });

  try {
    await writeSubmissionAudit(input);
  } catch (error) {
    console.error('Failed to record submission audit log:', error);
  }

  const [emailResult, slackResult] = await Promise.all([
    sendAdminEmail(input),
    sendSlackAlert(input),
  ]);

  await adminDb.collection('submissionDispatches').doc(dispatchRef.id).set(
    {
      emailStatus: emailResult.status,
      emailAttempts: emailResult.attempts,
      emailDetail: emailResult.detail || null,
      emailError: emailResult.error || null,
      slackStatus: slackResult.status,
      slackAttempts: slackResult.attempts,
      slackDetail: slackResult.detail || null,
      slackError: slackResult.error || null,
      updatedAt: new Date().toISOString(),
    },
    { merge: true },
  );

  if (emailResult.status === 'failed' || slackResult.status === 'failed') {
    console.error(
      JSON.stringify({
        level: 'warn',
        source: 'correspondence',
        message: 'submission_alert_delivery_failed',
        category: input.category,
        entityType: input.entityType,
        entityId: input.entityId,
        emailStatus: emailResult.status,
        emailError: emailResult.error || null,
        slackStatus: slackResult.status,
        slackError: slackResult.error || null,
      }),
    );
  }

  return {
    id: dispatchRef.id,
    email: emailResult,
    slack: slackResult,
  };
}
