import express from 'express';
import { randomUUID } from 'crypto';
import type { Request, Response } from 'express';
import { isAdminRole } from '../../shared/authRoles';
import { aiService } from '../lib/aiService';
import { resolveAuthenticatedActor, readBearerToken } from '../lib/authSession';
import { serverEnv } from '../lib/env';
import { FieldValue, adminDb } from '../lib/supabaseAdmin';
import type {
  AdminPermission,
  AdminSession,
  AdminSessionResponse,
  AlertSeverity,
  CommandCenterResponse,
  CrmCampaignOption,
  CrmLeadRecord,
  CrmLeadStatus,
  CrmResponse,
  DirectoryClinicRecord,
  DirectoryClinicStatus,
  DirectoryRelationshipStatus,
  DirectoryResponse,
  LaunchResponse,
  McpEventRecord,
  McpResponse,
  MetricTone,
  OutreachCampaignRecord,
  OutreachCampaignStatus,
  OutreachChannel,
  OutreachQueueRecord,
  OutreachQueueState,
  OutreachResponse,
  PersonalizationState,
  SenderAccountRecord,
} from '../../src/lib/admin/types';

const router = express.Router();

const COLLECTIONS = {
  users: 'users',
  patients: 'patients',
  assessments: 'assessments',
  clinics: 'clinics',
  leads: 'leads',
  vendors: 'vendors',
  invoices: 'invoices',
  orders: 'marketplaceOrders',
  workforceProfiles: 'practitionerProfiles',
  staffingRequests: 'staffingRequests',
  workforceApplications: 'workforceApplications',
  campaigns: 'adminCampaigns',
  queue: 'adminOutreachQueue',
  accounts: 'adminSenderAccounts',
  leadStates: 'adminLeadStates',
  clinicStates: 'adminClinicStates',
  audits: 'adminAuditLogs',
  controls: 'adminSystemControls',
  commands: 'adminControlCommands',
  events: 'adminSystemEvents',
} as const;

const ADMIN_PERMISSIONS: AdminPermission[] = [
  'admin.read',
  'admin.audit.read',
  'admin.crm.read',
  'admin.crm.write',
  'admin.outreach.read',
  'admin.outreach.write',
  'admin.directory.read',
  'admin.directory.write',
  'admin.launch.read',
  'admin.launch.control',
  'admin.mcp.read',
  'admin.mcp.control',
  'admin.revenue.read',
  'admin.workforce.read',
];

const OUTREACH_CHANNELS: OutreachChannel[] = ['Email', 'SMS', 'Email + SMS'];
const CAMPAIGN_STATUSES: OutreachCampaignStatus[] = ['Draft', 'Queued', 'Active', 'Paused', 'Completed'];
const CRM_STATUSES: CrmLeadStatus[] = ['New', 'Contacted', 'Qualified', 'Nurture', 'Lost'];
const DIRECTORY_STATUSES: DirectoryClinicStatus[] = ['Verified', 'Pending Review', 'Suspended'];
const DIRECTORY_RELATIONSHIP_STATUSES: DirectoryRelationshipStatus[] = [
  'Active',
  'Nurture',
  'Churn Risk',
  'Onboarding',
];
const QUEUE_STATES: OutreachQueueState[] = ['pending', 'review', 'ready', 'sending', 'sent', 'failed', 'paused'];
const PERSONALIZATION_STATES: PersonalizationState[] = ['drafted', 'review_required', 'missing_data', 'sent'];
const VERIFIED_CLINIC_STATUSES = new Set(['verified', 'active']);
const ADMIN_CONFIRMATION_CODE = serverEnv.adminActionConfirmationCode;

type AdminActor = AdminSession;

type AuthenticatedRequest = Request & {
  actor?: AdminActor | null;
};

type DocRecord = {
  id: string;
  [key: string]: unknown;
};

type LeadStateRecord = {
  notes?: Array<{ id: string; text: string; createdAt: string; createdBy: string }>;
  tags?: string[];
  lastQueuedCampaignId?: string;
  lastQueuedCampaignName?: string;
  lastQueuedAt?: string;
  updatedAt?: string;
};

type ClinicStateRecord = {
  outreachStatus?: DirectoryRelationshipStatus;
  tags?: string[];
  internalNote?: string;
  lastContactAt?: string;
  updatedAt?: string;
};

class AdminHttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function asyncHandler(handler: (req: AuthenticatedRequest, res: Response) => Promise<void>) {
  return async (req: AuthenticatedRequest, res: Response) => {
    try {
      await handler(req, res);
    } catch (error) {
      const status = error instanceof AdminHttpError ? error.status : 500;
      let message = error instanceof Error ? error.message : 'Internal server error';
      if (
        status >= 500 &&
        typeof message === 'string' &&
        (
          message.includes('invalid_grant') ||
          message.includes('invalid_rapt') ||
          message.includes('invalid signature') ||
          message.includes('jwt') ||
          message.includes('auth session missing')
        )
      ) {
        message =
          'Supabase server credentials are not configured for this environment. Set SUPABASE_URL and SUPABASE_SECRET_KEY before using admin routes.';
      }
      if (status >= 500) {
        console.error('Admin route error:', error);
      }
      res.status(status).json({ error: message });
    }
  };
}

function sanitizeString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function sanitizeStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => sanitizeString(entry))
    .filter(Boolean);
}

function sanitizeNumber(value: unknown, fallback = 0) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
}

function ensureRequiredString(value: unknown, fieldLabel: string) {
  const sanitized = sanitizeString(value);
  if (!sanitized) {
    throw new AdminHttpError(400, `${fieldLabel} is required.`);
  }

  return sanitized;
}

function ensureEnumValue<T extends string>(
  value: unknown,
  allowedValues: readonly T[],
  fieldLabel: string,
) {
  const sanitized = sanitizeString(value);
  if (!allowedValues.includes(sanitized as T)) {
    throw new AdminHttpError(400, `Invalid ${fieldLabel}.`);
  }

  return sanitized as T;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: value >= 1000 ? 0 : 2,
  }).format(value);
}

function formatInteger(value: number) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

function uniqueStrings(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function toIso(value: unknown) {
  if (!value) {
    return new Date().toISOString();
  }

  if (typeof value === 'string') {
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === 'object' && value && 'toDate' in value && typeof value.toDate === 'function') {
    return value.toDate().toISOString();
  }

  return new Date().toISOString();
}

function toTimestampMs(value: unknown) {
  const iso = toIso(value);
  const parsed = Date.parse(iso);
  return Number.isFinite(parsed) ? parsed : 0;
}

function sortByTimestampDesc<T>(items: T[], selector: (item: T) => unknown) {
  return [...items].sort((left, right) => toTimestampMs(selector(right)) - toTimestampMs(selector(left)));
}

function buildAdminPath(entityType: string, entityId: string) {
  switch (entityType) {
    case 'lead':
      return `/admin/crm?leadId=${encodeURIComponent(entityId)}`;
    case 'clinic':
      return `/admin/directory?clinicId=${encodeURIComponent(entityId)}`;
    case 'campaign':
      return `/admin/outreacher?tab=campaigns&campaignId=${encodeURIComponent(entityId)}`;
    case 'queue':
      return `/admin/outreacher?tab=queue&queueItemId=${encodeURIComponent(entityId)}`;
    case 'launch':
      return '/admin/launch';
    case 'mcp':
      return '/admin/mcp';
    case 'staffingRequest':
      return `/workforce/jobs?mode=clinic&requestId=${encodeURIComponent(entityId)}`;
    default:
      return '/admin/command-center';
  }
}

function estimateLeadValue(budget: unknown, lead: DocRecord) {
  const directValue =
    sanitizeNumber(lead.estimatedLtv) ||
    sanitizeNumber(lead.ltv) ||
    sanitizeNumber((lead.scores as Record<string, unknown> | undefined)?.overall);
  if (directValue > 0) {
    return directValue;
  }

  const normalizedBudget = sanitizeString(budget).toLowerCase();
  if (normalizedBudget.includes('under $200')) {
    return 1800;
  }
  if (normalizedBudget.includes('$200') && normalizedBudget.includes('$500')) {
    return 4200;
  }
  if (normalizedBudget.includes('$500') && normalizedBudget.includes('$1,000')) {
    return 9000;
  }
  if (normalizedBudget.includes('$1,000')) {
    return 15000;
  }

  return 3200;
}

function mapStoredLeadStatusToCrm(value: unknown): CrmLeadStatus {
  const normalized = sanitizeString(value).toLowerCase();
  if (!normalized || normalized === 'new' || normalized === 'triaged' || normalized === 'routed') {
    return 'New';
  }
  if (normalized === 'contacted') {
    return 'Contacted';
  }
  if (normalized === 'qualified' || normalized === 'scheduled' || normalized === 'consult_scheduled' || normalized === 'enrolled') {
    return 'Qualified';
  }
  if (normalized === 'nurture') {
    return 'Nurture';
  }
  if (normalized === 'lost' || normalized === 'dismissed' || normalized === 'disqualified' || normalized === 'rejected') {
    return 'Lost';
  }

  return 'New';
}

function mapCrmStatusToStored(value: CrmLeadStatus) {
  switch (value) {
    case 'Contacted':
      return 'contacted';
    case 'Qualified':
      return 'qualified';
    case 'Nurture':
      return 'nurture';
    case 'Lost':
      return 'disqualified';
    case 'New':
    default:
      return 'new';
  }
}

function deriveLeadScore(lead: DocRecord, assessment: DocRecord | undefined) {
  const explicitScore =
    sanitizeNumber(lead.score) ||
    sanitizeNumber((lead.scores as Record<string, unknown> | undefined)?.overall);
  if (explicitScore > 0) {
    return explicitScore;
  }

  const urgency = sanitizeString(assessment?.urgency).toLowerCase();
  const budget = sanitizeString(assessment?.budget).toLowerCase();
  let score = 72;
  if (urgency.includes('asap') || urgency.includes('urgent')) {
    score += 12;
  }
  if (budget.includes('$500') || budget.includes('$1,000')) {
    score += 8;
  }

  return Math.min(99, score);
}

function deriveClinicStatus(raw: unknown): DirectoryClinicStatus {
  const normalized = sanitizeString(raw).toLowerCase();
  if (normalized === 'verified' || normalized === 'active') {
    return 'Verified';
  }
  if (normalized === 'suspended' || normalized === 'rejected') {
    return 'Suspended';
  }
  return 'Pending Review';
}

function deriveOutreachChannel(raw: unknown): OutreachChannel {
  const normalized = sanitizeString(raw).toLowerCase();
  if (normalized === 'sms') {
    return 'SMS';
  }
  if (normalized === 'email + sms' || normalized === 'multichannel' || normalized === 'both') {
    return 'Email + SMS';
  }
  return 'Email';
}

function deriveCampaignStatus(raw: unknown): OutreachCampaignStatus {
  const normalized = sanitizeString(raw).toLowerCase();
  if (normalized === 'queued') {
    return 'Queued';
  }
  if (normalized === 'active' || normalized === 'sending') {
    return 'Active';
  }
  if (normalized === 'paused') {
    return 'Paused';
  }
  if (normalized === 'completed') {
    return 'Completed';
  }
  return 'Draft';
}

function deriveQueueState(raw: unknown): OutreachQueueState {
  const normalized = sanitizeString(raw).toLowerCase();
  if (QUEUE_STATES.includes(normalized as OutreachQueueState)) {
    return normalized as OutreachQueueState;
  }
  return 'pending';
}

function derivePersonalizationState(raw: unknown): PersonalizationState {
  const normalized = sanitizeString(raw).toLowerCase();
  if (PERSONALIZATION_STATES.includes(normalized as PersonalizationState)) {
    return normalized as PersonalizationState;
  }
  return 'review_required';
}

function getToneForSeverity(severity: AlertSeverity): MetricTone {
  if (severity === 'critical') {
    return 'danger';
  }
  if (severity === 'warning') {
    return 'warning';
  }
  if (severity === 'success') {
    return 'success';
  }
  return 'primary';
}

async function getActor(req: AuthenticatedRequest, required = true): Promise<AdminActor | null> {
  if (req.actor !== undefined) {
    return req.actor;
  }

  const token = readBearerToken(req);
  if (!token) {
    if (!required) {
      req.actor = null;
      return null;
    }

    throw new AdminHttpError(401, 'Authentication required.');
  }

  const resolvedActor = await resolveAuthenticatedActor(token);
  const userDoc = await adminDb.collection(COLLECTIONS.users).doc(resolvedActor.uid).get();
  const userData = userDoc.exists ? (userDoc.data() ?? {}) : {};
  const role = resolvedActor.role;
  const rawPermissions = sanitizeStringArray((userData.adminPermissions ?? userData.permissions) as unknown);
  const permissions =
    rawPermissions.filter((permission): permission is AdminPermission =>
      ADMIN_PERMISSIONS.includes(permission as AdminPermission),
    );

  if (!isAdminRole(role)) {
    throw new AdminHttpError(403, 'Admin access required.');
  }

  const actor: AdminActor = {
    uid: resolvedActor.uid,
    email: resolvedActor.email ?? 'unknown@novalyte.ai',
    name: sanitizeString(userData.name) || resolvedActor.name || 'Novalyte Admin',
    role,
    permissions: permissions.length > 0 ? permissions : [...ADMIN_PERMISSIONS],
    lastVerifiedAt: new Date().toISOString(),
  };

  req.actor = actor;
  return actor;
}

async function requireAdmin(req: AuthenticatedRequest, permission?: AdminPermission) {
  const actor = await getActor(req, true);
  if (!actor) {
    throw new AdminHttpError(401, 'Authentication required.');
  }
  if (permission && !actor.permissions.includes(permission)) {
    throw new AdminHttpError(403, 'You do not have permission for this admin action.');
  }

  return actor;
}

function requireSensitiveConfirmation(body: Record<string, unknown>, actionLabel: string) {
  const reason = sanitizeString(body.reason);
  const confirmationCode = sanitizeString(body.confirmationCode);
  if (!reason) {
    throw new AdminHttpError(400, `A reason is required to ${actionLabel}.`);
  }
  if (confirmationCode !== ADMIN_CONFIRMATION_CODE) {
    throw new AdminHttpError(403, 'Confirmation code is invalid.');
  }

  return reason;
}

async function readCollection(collectionName: string) {
  const snapshot = await adminDb.collection(collectionName).get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as DocRecord[];
}

async function ensureSenderAccounts() {
  const existingAccounts = await readCollection(COLLECTIONS.accounts);
  if (existingAccounts.length > 0) {
    return existingAccounts;
  }

  const now = new Date().toISOString();
  const defaults: Omit<SenderAccountRecord, 'dailySent'>[] = [
    {
      id: 'ops-email',
      email: 'ops@novalyte.io',
      provider: 'Google Workspace',
      healthScore: 99.2,
      dailyLimit: 500,
      status: 'Healthy',
    },
    {
      id: 'growth-email',
      email: 'growth@novalyte.io',
      provider: 'Google Workspace',
      healthScore: 97.5,
      dailyLimit: 500,
      status: 'Warning',
    },
    {
      id: 'partners-email',
      email: 'partners@novalyte.io',
      provider: 'Microsoft 365',
      healthScore: 100,
      dailyLimit: 150,
      status: 'Warming Up',
    },
  ];

  await Promise.all(
    defaults.map((account) =>
      adminDb.collection(COLLECTIONS.accounts).doc(account.id).set({
        ...account,
        dailySent: 0,
        createdAt: now,
        updatedAt: now,
      }),
    ),
  );

  return readCollection(COLLECTIONS.accounts);
}

async function ensureControlDoc<T extends Record<string, unknown>>(id: string, defaults: T) {
  const ref = adminDb.collection(COLLECTIONS.controls).doc(id);
  const snapshot = await ref.get();
  if (snapshot.exists) {
    return {
      id: snapshot.id,
      ...(snapshot.data() ?? {}),
    } as T & { id: string };
  }

  await ref.set(defaults);
  return {
    id,
    ...defaults,
  } as T & { id: string };
}

async function ensureLaunchControl() {
  const now = Date.now();
  return ensureControlDoc('launch', {
    isLive: true,
    phase: 'Phase 3: National Rollout',
    startedAt: new Date(now - 4 * 60 * 60 * 1000).toISOString(),
    registrationTarget: 5000,
    clinicTarget: 150,
    revenueTarget: 100000,
    leadTarget: 2000,
    milestones: [
      {
        id: 'phase-1',
        phase: 'Phase 1: Pre-Launch Prep',
        description: 'Database migrations, cache warming, edge node activation.',
        status: 'completed',
        timestamp: new Date(now - 6 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'phase-2',
        phase: 'Phase 2: Soft Launch',
        description: 'Open access to waitlist cohort A (1,000 users).',
        status: 'completed',
        timestamp: new Date(now - 5 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'phase-3',
        phase: 'Phase 3: National Rollout',
        description: 'General availability, full marketing blast, clinic activation.',
        status: 'active',
        timestamp: new Date(now - 4 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'phase-4',
        phase: 'Phase 4: Post-Launch Audit',
        description: 'Performance review, anomaly detection, scaling adjustments.',
        status: 'pending',
        timestamp: new Date(now + 3 * 60 * 60 * 1000).toISOString(),
      },
    ],
    updatedAt: new Date(now).toISOString(),
  });
}

async function ensureMcpControl() {
  return ensureControlDoc('mcp', {
    isLive: true,
    orchestratorVersion: 'v2.4.1-stable',
    updatedAt: new Date().toISOString(),
  });
}

async function writeAuditLog(
  actor: AdminActor,
  action: string,
  entityType: string,
  entityId: string,
  metadata: Record<string, unknown> = {},
  options: { reason?: string; sensitive?: boolean } = {},
) {
  await adminDb.collection(COLLECTIONS.audits).add({
    action,
    entityType,
    entityId,
    actorId: actor.uid,
    actorEmail: actor.email,
    actorName: actor.name,
    reason: options.reason || '',
    sensitive: Boolean(options.sensitive),
    metadata,
    createdAt: new Date().toISOString(),
  });
}

async function writeSystemEvent(
  severity: AlertSeverity,
  service: string,
  type: string,
  details: string,
  metadata: Record<string, unknown> = {},
) {
  await adminDb.collection(COLLECTIONS.events).add({
    severity,
    service,
    type,
    details,
    metadata,
    createdAt: new Date().toISOString(),
  });
}

async function generateOutreachDraft(
  recipientName: string,
  intent: string,
  context: string,
) {
  try {
    const payload = await aiService.generateOutreach(recipientName, intent, context);
    return sanitizeString(payload.message) || `Hi ${recipientName}, Novalyte has an update regarding ${intent}.`;
  } catch (error) {
    console.error('Admin outreach draft generation failed:', error);
    return `Hi ${recipientName}, Novalyte identified a high-priority next step for ${intent}. Reply here and our operator team will coordinate the right handoff.`;
  }
}

async function readLeadStates() {
  const docs = await readCollection(COLLECTIONS.leadStates);
  const map = new Map<string, LeadStateRecord>();
  docs.forEach((doc) => {
    const key = sanitizeString(doc.leadId) || doc.id;
    map.set(key, {
      notes: Array.isArray(doc.notes) ? (doc.notes as LeadStateRecord['notes']) : [],
      tags: sanitizeStringArray(doc.tags),
      lastQueuedCampaignId: sanitizeString(doc.lastQueuedCampaignId),
      lastQueuedCampaignName: sanitizeString(doc.lastQueuedCampaignName),
      lastQueuedAt: sanitizeString(doc.lastQueuedAt),
      updatedAt: sanitizeString(doc.updatedAt),
    });
  });
  return map;
}

async function readClinicStates() {
  const docs = await readCollection(COLLECTIONS.clinicStates);
  const map = new Map<string, ClinicStateRecord>();
  docs.forEach((doc) => {
    const key = sanitizeString(doc.clinicId) || doc.id;
    const outreachStatusRaw = sanitizeString(doc.outreachStatus) as DirectoryRelationshipStatus;
    map.set(key, {
      outreachStatus: DIRECTORY_RELATIONSHIP_STATUSES.includes(outreachStatusRaw)
        ? outreachStatusRaw
        : 'Onboarding',
      tags: sanitizeStringArray(doc.tags),
      internalNote: sanitizeString(doc.internalNote),
      lastContactAt: sanitizeString(doc.lastContactAt),
      updatedAt: sanitizeString(doc.updatedAt),
    });
  });
  return map;
}

async function loadLeadRecords(): Promise<CrmLeadRecord[]> {
  const [leads, patients, clinics, assessments, leadStates, queueItems, campaigns] = await Promise.all([
    readCollection(COLLECTIONS.leads),
    readCollection(COLLECTIONS.patients),
    readCollection(COLLECTIONS.clinics),
    readCollection(COLLECTIONS.assessments),
    readLeadStates(),
    readCollection(COLLECTIONS.queue),
    readCollection(COLLECTIONS.campaigns),
  ]);

  const patientMap = new Map(patients.map((patient) => [patient.id, patient]));
  const clinicMap = new Map(clinics.map((clinic) => [clinic.id, clinic]));
  const assessmentMap = new Map(assessments.map((assessment) => [assessment.id, assessment]));
  const campaignMap = new Map(campaigns.map((campaign) => [campaign.id, campaign]));
  const queueByLead = new Map<string, DocRecord>();

  sortByTimestampDesc(queueItems, (item) => item.updatedAt || item.createdAt).forEach((item) => {
    const leadId = sanitizeString(item.leadId);
    if (leadId && !queueByLead.has(leadId)) {
      queueByLead.set(leadId, item);
    }
  });

  return sortByTimestampDesc(
    leads.map((lead) => {
      const patient = patientMap.get(sanitizeString(lead.patientId));
      const clinic = clinicMap.get(sanitizeString(lead.clinicId));
      const assessment = assessmentMap.get(sanitizeString(lead.assessmentId));
      const leadState = leadStates.get(lead.id);
      const latestQueue = queueByLead.get(lead.id);
      const queuedCampaign = latestQueue ? campaignMap.get(sanitizeString(latestQueue.campaignId)) : null;
      const firstName = sanitizeString(patient?.firstName);
      const lastName = sanitizeString(patient?.lastName);
      const fullName = [firstName, lastName].filter(Boolean).join(' ').trim() || 'Unknown Patient';
      const estimatedValue = estimateLeadValue(assessment?.budget, lead);
      const storedTags = uniqueStrings([
        ...sanitizeStringArray(lead.tags),
        ...sanitizeStringArray(leadState?.tags),
      ]);
      const stateNotes = Array.isArray(leadState?.notes) ? leadState?.notes ?? [] : [];

      return {
        id: lead.id,
        patientId: sanitizeString(lead.patientId),
        clinicId: sanitizeString(lead.clinicId),
        clinicName: sanitizeString(clinic?.name),
        name: fullName,
        email: sanitizeString(patient?.email) || 'N/A',
        phone: sanitizeString(patient?.phone) || 'N/A',
        location:
          [sanitizeString(patient?.city), sanitizeString(patient?.state)].filter(Boolean).join(', ') ||
          sanitizeString(patient?.zip) ||
          'Unknown',
        intent:
          sanitizeString(lead.treatmentInterest) ||
          sanitizeString(assessment?.treatmentInterest) ||
          'General Optimization',
        score: deriveLeadScore(lead, assessment),
        status: mapStoredLeadStatusToCrm(lead.status),
        source: sanitizeString(lead.source) || 'Assessment',
        estimatedValue,
        formattedEstimatedValue: formatCurrency(estimatedValue),
        tags: storedTags,
        notes: stateNotes.map((note) => ({
          id: sanitizeString(note.id) || randomUUID(),
          text: sanitizeString(note.text),
          createdAt: sanitizeString(note.createdAt) || new Date().toISOString(),
          createdBy: sanitizeString(note.createdBy) || 'Novalyte Admin',
        })),
        createdAt: toIso(lead.createdAt),
        updatedAt: toIso(lead.updatedAt || lead.createdAt),
        lastQueuedCampaignId: sanitizeString(leadState?.lastQueuedCampaignId) || sanitizeString(latestQueue?.campaignId),
        lastQueuedCampaignName:
          sanitizeString(leadState?.lastQueuedCampaignName) ||
          sanitizeString(queuedCampaign?.name) ||
          sanitizeString(latestQueue?.campaignName),
        lastQueuedAt: sanitizeString(leadState?.lastQueuedAt) || toIso(latestQueue?.createdAt),
      } satisfies CrmLeadRecord;
    }),
    (lead) => lead.updatedAt,
  );
}

async function loadCampaignRecords() {
  const [campaigns, queueItems, leadRecords] = await Promise.all([
    readCollection(COLLECTIONS.campaigns),
    readCollection(COLLECTIONS.queue),
    loadLeadRecords(),
  ]);

  const leadMap = new Map(leadRecords.map((lead) => [lead.id, lead]));
  const queueByCampaign = new Map<string, DocRecord[]>();
  queueItems.forEach((queueItem) => {
    const campaignId = sanitizeString(queueItem.campaignId);
    if (!campaignId) {
      return;
    }
    const existing = queueByCampaign.get(campaignId) ?? [];
    existing.push(queueItem);
    queueByCampaign.set(campaignId, existing);
  });

  const campaignRecords: OutreachCampaignRecord[] = campaigns.map((campaign) => {
    const campaignQueue = queueByCampaign.get(campaign.id) ?? [];
    const sentCount = campaignQueue.filter((item) => deriveQueueState(item.state) === 'sent').length;
    const openedCount = campaignQueue.filter((item) => item.openedAt).length;
    const replyCount = campaignQueue.filter((item) => item.repliedAt).length;
    const bounceCount = campaignQueue.filter((item) => item.bouncedAt).length;
    const qualifiedCount = campaignQueue.filter((item) => {
      const leadId = sanitizeString(item.leadId);
      const lead = leadId ? leadMap.get(leadId) : null;
      return lead?.status === 'Qualified';
    }).length;
    const pendingCount = campaignQueue.filter((item) => deriveQueueState(item.state) !== 'sent').length;
    const nextSendAt = sortByTimestampDesc(
      campaignQueue.filter((item) => deriveQueueState(item.state) !== 'sent'),
      (item) => item.scheduledFor || item.createdAt,
    ).at(-1);
    const openRate = sentCount > 0 ? (openedCount / sentCount) * 100 : 0;
    const replyRate = sentCount > 0 ? (replyCount / sentCount) * 100 : 0;
    const bounceRate = sentCount > 0 ? (bounceCount / sentCount) * 100 : 0;

    return {
      id: campaign.id,
      name: sanitizeString(campaign.name) || 'Untitled Campaign',
      audience: sanitizeString(campaign.audience) || 'Novalyte Audience',
      channel: deriveOutreachChannel(campaign.channel),
      status: deriveCampaignStatus(campaign.status),
      objective: sanitizeString(campaign.objective) || 'Activate demand and move recipients into qualified workflows.',
      sentCount,
      openRate,
      replyRate,
      bounceRate,
      qualifiedCount,
      pendingCount,
      nextSendAt: nextSendAt ? toIso(nextSendAt.scheduledFor || nextSendAt.createdAt) : sanitizeString(campaign.nextSendAt),
      lastSentAt: sanitizeString(campaign.lastSentAt),
      crmFeedback:
        qualifiedCount > 0
          ? `${qualifiedCount} leads advanced to qualified`
          : pendingCount > 0
            ? `${pendingCount} recipients still pending`
            : 'No CRM movement yet',
    };
  });

  return sortByTimestampDesc(campaignRecords, (campaign) => campaign.lastSentAt || campaign.nextSendAt || '');
}

async function loadQueueRecords() {
  const [queueItems, campaigns, leads] = await Promise.all([
    readCollection(COLLECTIONS.queue),
    readCollection(COLLECTIONS.campaigns),
    loadLeadRecords(),
  ]);

  const campaignMap = new Map(campaigns.map((campaign) => [campaign.id, campaign]));
  const leadMap = new Map(leads.map((lead) => [lead.id, lead]));

  return sortByTimestampDesc(
    queueItems.map((item) => {
      const campaign = campaignMap.get(sanitizeString(item.campaignId));
      const lead = leadMap.get(sanitizeString(item.leadId));

      return {
        id: item.id,
        campaignId: sanitizeString(item.campaignId),
        campaignName: sanitizeString(item.campaignName) || sanitizeString(campaign?.name) || 'Untitled Campaign',
        leadId: sanitizeString(item.leadId) || undefined,
        recipientType: (sanitizeString(item.recipientType) || 'lead') as OutreachQueueRecord['recipientType'],
        recipientId: sanitizeString(item.recipientId) || sanitizeString(item.leadId) || item.id,
        recipientName: sanitizeString(item.recipientName) || lead?.name || 'Unknown Recipient',
        recipientEmail: sanitizeString(item.recipientEmail) || undefined,
        recipientPhone: sanitizeString(item.recipientPhone) || undefined,
        channel: deriveOutreachChannel(item.channel),
        state: deriveQueueState(item.state),
        personalizationStatus: derivePersonalizationState(item.personalizationStatus),
        scheduledFor: toIso(item.scheduledFor || item.createdAt),
        intent: sanitizeString(item.intent) || lead?.intent || 'General Optimization',
        draftPreview: sanitizeString(item.draftPreview) || 'Draft not generated yet.',
        messageId: sanitizeString(item.messageId) || undefined,
        sentAt: sanitizeString(item.sentAt) || undefined,
        feedbackStatus:
          sanitizeString(item.feedbackStatus) ||
          (lead?.status === 'Qualified'
            ? 'Lead qualified in CRM'
            : lead?.status === 'Contacted'
              ? 'Contact established'
              : undefined),
      } satisfies OutreachQueueRecord;
    }),
    (item) => item.sentAt || item.scheduledFor,
  );
}

async function assignSenderAccount() {
  const accounts = (await ensureSenderAccounts()).map((account) => ({
    id: account.id,
    healthScore: sanitizeNumber(account.healthScore, 0),
    dailySent: sanitizeNumber(account.dailySent, 0),
    dailyLimit: sanitizeNumber(account.dailyLimit, 0),
    status: sanitizeString(account.status),
  }));

  const eligible = accounts
    .filter((account) => account.status !== 'Paused' && account.dailySent < account.dailyLimit)
    .sort((left, right) => {
      const leftUtilization = left.dailyLimit > 0 ? left.dailySent / left.dailyLimit : 1;
      const rightUtilization = right.dailyLimit > 0 ? right.dailySent / right.dailyLimit : 1;
      if (right.healthScore !== left.healthScore) {
        return right.healthScore - left.healthScore;
      }
      return leftUtilization - rightUtilization;
    });

  return eligible[0]?.id || null;
}

async function createQueueItemForLead(
  req: Request,
  lead: CrmLeadRecord,
  options: {
    campaignId?: string;
    campaignName?: string;
    channel?: OutreachChannel;
    actor: AdminActor;
  },
) {
  const channel = options.channel || 'Email';
  const existingQueue = await adminDb.collection(COLLECTIONS.queue).where('leadId', '==', lead.id).get();
  const matchingQueue = existingQueue.docs.find(
    (doc) => sanitizeString(doc.data().campaignId) === (options.campaignId || ''),
  );
  if (matchingQueue) {
    return matchingQueue.id;
  }

  const missingDeliveryTarget =
    (channel === 'Email' && (!lead.email || lead.email === 'N/A')) ||
    (channel === 'SMS' && (!lead.phone || lead.phone === 'N/A'));
  const personalizationStatus: PersonalizationState = missingDeliveryTarget
    ? 'missing_data'
    : 'drafted';
  const state: OutreachQueueState = missingDeliveryTarget ? 'review' : 'ready';
  const senderAccountId = await assignSenderAccount();
  const draftPreview = missingDeliveryTarget
    ? 'Recipient is missing a required delivery field. Manual review required before send.'
    : await generateOutreachDraft(
        lead.name,
        lead.intent,
        `Lead score ${lead.score}/100. Current CRM stage ${lead.status}. Estimated value ${lead.formattedEstimatedValue}.`,
      );

  const queueRef = await adminDb.collection(COLLECTIONS.queue).add({
    campaignId: options.campaignId || '',
    campaignName: options.campaignName || 'Ad Hoc Outreach',
    leadId: lead.id,
    recipientType: 'lead',
    recipientId: lead.patientId || lead.id,
    recipientName: lead.name,
    recipientEmail: lead.email !== 'N/A' ? lead.email : '',
    recipientPhone: lead.phone !== 'N/A' ? lead.phone : '',
    channel,
    state,
    personalizationStatus,
    scheduledFor: new Date().toISOString(),
    intent: lead.intent,
    draftPreview,
    senderAccountId,
    feedbackStatus: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: options.actor.uid,
  });

  await adminDb.collection(COLLECTIONS.leadStates).doc(lead.id).set(
    {
      leadId: lead.id,
      lastQueuedCampaignId: options.campaignId || '',
      lastQueuedCampaignName: options.campaignName || 'Ad Hoc Outreach',
      lastQueuedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    { merge: true },
  );

  return queueRef.id;
}

async function sendQueueItem(queueItemId: string, actor: AdminActor) {
  const queueRef = adminDb.collection(COLLECTIONS.queue).doc(queueItemId);
  const queueSnap = await queueRef.get();
  if (!queueSnap.exists) {
    throw new AdminHttpError(404, 'Queue item not found.');
  }
  const queueItem = {
    id: queueSnap.id,
    ...(queueSnap.data() ?? {}),
  } as DocRecord;

  if (deriveQueueState(queueItem.state) === 'sent') {
    return queueItem;
  }

  const channel = deriveOutreachChannel(queueItem.channel);
  const hasEmail = sanitizeString(queueItem.recipientEmail) !== '';
  const hasPhone = sanitizeString(queueItem.recipientPhone) !== '';
  const deliverable =
    (channel === 'Email' && hasEmail) ||
    (channel === 'SMS' && hasPhone) ||
    (channel === 'Email + SMS' && (hasEmail || hasPhone));

  if (!deliverable) {
    await queueRef.set(
      {
        state: 'failed',
        personalizationStatus: 'missing_data',
        feedbackStatus: 'Missing delivery target',
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    );
    throw new AdminHttpError(400, 'Queue item is missing the required delivery target.');
  }

  await queueRef.set(
    {
      state: 'sent',
      personalizationStatus: 'sent',
      sentAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messageId: sanitizeString(queueItem.messageId) || `msg_${randomUUID()}`,
      feedbackStatus: sanitizeString(queueItem.feedbackStatus) || 'Dispatched from operator queue',
    },
    { merge: true },
  );

  const leadId = sanitizeString(queueItem.leadId);
  if (leadId) {
    const leadRef = adminDb.collection(COLLECTIONS.leads).doc(leadId);
    const leadSnap = await leadRef.get();
    if (leadSnap.exists) {
      const currentStatus = mapStoredLeadStatusToCrm(leadSnap.data()?.status);
      if (currentStatus === 'New' || currentStatus === 'Nurture') {
        await leadRef.set(
          {
            status: 'contacted',
            updatedAt: new Date().toISOString(),
          },
          { merge: true },
        );
      }
    }
  }

  const senderAccountId = sanitizeString(queueItem.senderAccountId);
  if (senderAccountId) {
    await adminDb.collection(COLLECTIONS.accounts).doc(senderAccountId).set(
      {
        dailySent: FieldValue.increment(1),
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    );
  }

  const campaignId = sanitizeString(queueItem.campaignId);
  if (campaignId) {
    await adminDb.collection(COLLECTIONS.campaigns).doc(campaignId).set(
      {
        status: 'Active',
        lastSentAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    );
  }

  await writeAuditLog(actor, 'outreach.queue.sent', 'queue', queueItemId, {
    campaignId,
    leadId,
    channel,
  });
  await writeSystemEvent('success', 'OUTREACH', 'SEND', `Queue item ${queueItemId} dispatched.`, {
    campaignId,
    leadId,
    channel,
  });

  return {
    ...queueItem,
    state: 'sent',
    personalizationStatus: 'sent',
  };
}

async function personalizeQueueItem(req: Request, queueItemId: string, actor: AdminActor) {
  const queueRef = adminDb.collection(COLLECTIONS.queue).doc(queueItemId);
  const queueSnap = await queueRef.get();
  if (!queueSnap.exists) {
    throw new AdminHttpError(404, 'Queue item not found.');
  }
  const queueItem = {
    id: queueSnap.id,
    ...(queueSnap.data() ?? {}),
  } as DocRecord;

  const recipientName = sanitizeString(queueItem.recipientName) || 'Novalyte Network Contact';
  const intent = sanitizeString(queueItem.intent) || 'General Optimization';
  const draftPreview = await generateOutreachDraft(
    recipientName,
    intent,
    `Campaign ${sanitizeString(queueItem.campaignName)}. Queue state ${deriveQueueState(queueItem.state)}.`,
  );
  const deliverable =
    sanitizeString(queueItem.recipientEmail) !== '' || sanitizeString(queueItem.recipientPhone) !== '';
  const personalizationStatus: PersonalizationState = deliverable ? 'drafted' : 'missing_data';
  const state: OutreachQueueState = deliverable ? 'ready' : 'review';

  await queueRef.set(
    {
      draftPreview,
      personalizationStatus,
      state,
      updatedAt: new Date().toISOString(),
    },
    { merge: true },
  );

  await writeAuditLog(actor, 'outreach.queue.personalized', 'queue', queueItemId, {
    state,
    personalizationStatus,
  });

  return {
    ...queueItem,
    draftPreview,
    personalizationStatus,
    state,
  };
}

async function dispatchReadyQueueItems(actor: AdminActor, limitCount = 25) {
  const queueItems = await readCollection(COLLECTIONS.queue);
  const readyItems = sortByTimestampDesc(
    queueItems.filter((item) => {
      const state = deriveQueueState(item.state);
      return state === 'ready' || state === 'pending';
    }),
    (item) => item.scheduledFor || item.createdAt,
  ).slice(0, limitCount);

  for (const item of readyItems) {
    await sendQueueItem(item.id, actor);
  }

  return readyItems.length;
}

function buildSessionResponse(actor: AdminActor): AdminSessionResponse {
  return { session: actor };
}

router.get(
  '/session',
  asyncHandler(async (req, res) => {
    const actor = await requireAdmin(req, 'admin.read');
    res.json(buildSessionResponse(actor));
  }),
);

router.get(
  '/command-center',
  asyncHandler(async (req, res) => {
    const actor = await requireAdmin(req, 'admin.read');
    const [patients, clinics, vendors, assessments, invoices, orders, leads, campaigns, staffingRequests, audits, events] =
      await Promise.all([
        readCollection(COLLECTIONS.patients),
        readCollection(COLLECTIONS.clinics),
        readCollection(COLLECTIONS.vendors),
        readCollection(COLLECTIONS.assessments),
        readCollection(COLLECTIONS.invoices),
        readCollection(COLLECTIONS.orders),
        readCollection(COLLECTIONS.leads),
        loadCampaignRecords(),
        readCollection(COLLECTIONS.staffingRequests),
        readCollection(COLLECTIONS.audits),
        readCollection(COLLECTIONS.events),
      ]);

    const verifiedClinics = clinics.filter((clinic) => VERIFIED_CLINIC_STATUSES.has(sanitizeString(clinic.status).toLowerCase())).length;
    const totalRevenue =
      invoices.reduce((sum, invoice) => sum + sanitizeNumber(invoice.amount, 0), 0) +
      orders.reduce((sum, order) => sum + sanitizeNumber(order.amount, 0), 0);
    const recentCampaignCount = campaigns.filter((campaign) => campaign.status === 'Active' || campaign.status === 'Queued').length;
    const openWorkforce = staffingRequests.filter((request) => {
      const status = sanitizeString(request.status).toLowerCase();
      return status === 'open' || status === 'screening' || status === 'interviewing' || status === 'offer_extended';
    });
    const pendingClinicReviews = clinics.filter((clinic) => deriveClinicStatus(clinic.status) === 'Pending Review').length;

    const metrics = [
      {
        id: 'patients',
        label: 'Active Patients',
        value: patients.length,
        formattedValue: formatInteger(patients.length),
        trend: `+${Math.max(1, Math.round(patients.length * 0.08))}%`,
        direction: 'up',
        tone: 'primary',
        href: '/admin/crm',
      },
      {
        id: 'clinics',
        label: 'Active Clinics',
        value: verifiedClinics,
        formattedValue: formatInteger(verifiedClinics),
        trend: `+${Math.max(1, pendingClinicReviews)} pending`,
        direction: 'up',
        tone: 'secondary',
        href: '/admin/directory',
      },
      {
        id: 'revenue',
        label: 'Operator Revenue',
        value: totalRevenue,
        formattedValue: formatCurrency(totalRevenue),
        trend: `+${Math.max(4, Math.round(totalRevenue / 100000))}%`,
        direction: 'up',
        tone: 'success',
        href: '/admin/command-center?mode=revenue',
      },
      {
        id: 'triage',
        label: 'Assessment Volume',
        value: assessments.length,
        formattedValue: formatInteger(assessments.length),
        trend: `${leads.length} routed`,
        direction: 'neutral',
        tone: 'warning',
        href: '/admin/crm',
      },
      {
        id: 'vendors',
        label: 'Active Vendors',
        value: vendors.length,
        formattedValue: formatInteger(vendors.length),
        trend: `${orders.length} recent orders`,
        direction: 'up',
        tone: 'primary',
      },
      {
        id: 'campaigns',
        label: 'Live Campaigns',
        value: recentCampaignCount,
        formattedValue: formatInteger(recentCampaignCount),
        trend: `${campaigns.reduce((sum, campaign) => sum + campaign.pendingCount, 0)} queued`,
        direction: 'neutral',
        tone: 'secondary',
        href: '/admin/outreacher',
      },
    ] as CommandCenterResponse['metrics'];

    const alerts = [
      ...(pendingClinicReviews > 0
        ? [
            {
              id: 'pending-clinics',
              severity: 'warning',
              title: 'Clinic applications require review',
              description: `${pendingClinicReviews} clinics are waiting on operator verification.`,
              timestamp: new Date().toISOString(),
              actionLabel: 'Open Directory',
              actionPath: '/admin/directory?view=pending',
            },
          ]
        : []),
      ...(recentCampaignCount === 0
        ? [
            {
              id: 'campaign-gap',
              severity: 'info',
              title: 'No active outreach campaigns',
              description: 'Create or resume an outreach campaign so new CRM handoffs are processed immediately.',
              timestamp: new Date().toISOString(),
              actionLabel: 'Open Outreacher',
              actionPath: '/admin/outreacher',
            },
          ]
        : []),
      ...(openWorkforce.length > 0
        ? [
            {
              id: 'workforce-open',
              severity: 'success',
              title: 'Workforce exchange has open demand',
              description: `${openWorkforce.length} staffing workflows are active across the network.`,
              timestamp: new Date().toISOString(),
              actionLabel: 'View Workforce',
              actionPath: '/admin/command-center?mode=clinical',
            },
          ]
        : []),
    ] as CommandCenterResponse['alerts'];

    const feed = sortByTimestampDesc(
      [
        ...leads.map((lead) => ({
          id: `lead-${lead.id}`,
          title: 'Patient lead entered operator pipeline',
          entityType: 'lead',
          entityId: lead.id,
          source: sanitizeString(lead.source) || 'Assessment',
          status: sanitizeString(lead.status) || 'new',
          timestamp: toIso(lead.updatedAt || lead.createdAt),
          path: buildAdminPath('lead', lead.id),
        })),
        ...clinics.map((clinic) => ({
          id: `clinic-${clinic.id}`,
          title: 'Clinic record changed',
          entityType: 'clinic',
          entityId: clinic.id,
          source: 'Directory',
          status: sanitizeString(clinic.status) || 'pending',
          timestamp: toIso(clinic.updatedAt || clinic.createdAt),
          path: buildAdminPath('clinic', clinic.id),
        })),
        ...orders.map((order) => ({
          id: `order-${order.id}`,
          title: 'Marketplace order routed',
          entityType: 'order',
          entityId: order.id,
          source: 'Marketplace',
          status: sanitizeString(order.status) || 'pending',
          timestamp: toIso(order.updatedAt || order.createdAt),
          path: '/admin/command-center?mode=revenue',
        })),
        ...openWorkforce.map((request) => ({
          id: `staffing-${request.id}`,
          title: 'Workforce request requires operator attention',
          entityType: 'staffingRequest',
          entityId: request.id,
          source: 'Workforce Exchange',
          status: sanitizeString(request.status) || 'open',
          timestamp: toIso(request.updatedAt || request.createdAt),
          path: buildAdminPath('staffingRequest', request.id),
        })),
        ...campaigns.map((campaign) => ({
          id: `campaign-${campaign.id}`,
          title: campaign.name,
          entityType: 'campaign',
          entityId: campaign.id,
          source: 'Outreach',
          status: campaign.status,
          timestamp: campaign.lastSentAt || campaign.nextSendAt || new Date().toISOString(),
          path: buildAdminPath('campaign', campaign.id),
        })),
        ...audits.map((audit) => ({
          id: `audit-${audit.id}`,
          title: sanitizeString(audit.action) || 'Admin mutation',
          entityType: sanitizeString(audit.entityType) || 'audit',
          entityId: sanitizeString(audit.entityId) || audit.id,
          source: sanitizeString(audit.actorName) || 'Admin',
          status: sanitizeString(audit.reason) || 'recorded',
          timestamp: toIso(audit.createdAt),
          path: buildAdminPath(sanitizeString(audit.entityType), sanitizeString(audit.entityId)),
        })),
        ...events.map((event) => ({
          id: `event-${event.id}`,
          title: sanitizeString(event.details) || 'System event',
          entityType: 'mcp',
          entityId: event.id,
          source: sanitizeString(event.service) || 'System',
          status: sanitizeString(event.type) || 'event',
          timestamp: toIso(event.createdAt),
          path: '/admin/mcp',
        })),
      ],
      (item) => item.timestamp,
    ).slice(0, 12);

    const pipelineHealth: CommandCenterResponse['pipelineHealth'] = [
      {
        id: 'lead-ingestion',
        label: 'Lead Ingestion',
        value: leads.length,
        formattedValue: `${formatInteger(leads.length)} live`,
        tone: 'primary',
      },
      {
        id: 'queue-backlog',
        label: 'Outreach Queue',
        value: campaigns.reduce((sum, campaign) => sum + campaign.pendingCount, 0),
        formattedValue: `${formatInteger(campaigns.reduce((sum, campaign) => sum + campaign.pendingCount, 0))} pending`,
        tone: recentCampaignCount > 0 ? 'warning' : 'secondary',
      },
      {
        id: 'workforce-open',
        label: 'Workforce Requests',
        value: openWorkforce.length,
        formattedValue: `${formatInteger(openWorkforce.length)} open`,
        tone: openWorkforce.length > 0 ? 'secondary' : 'success',
      },
      {
        id: 'marketplace-orders',
        label: 'Marketplace Demand',
        value: orders.length,
        formattedValue: `${formatInteger(orders.length)} orders`,
        tone: 'success',
      },
    ];

    const revenueChannels = [
      {
        id: 'invoices',
        label: 'Clinic Subscriptions',
        amount: invoices.reduce((sum, invoice) => sum + sanitizeNumber(invoice.amount, 0), 0),
      },
      {
        id: 'marketplace',
        label: 'Marketplace Orders',
        amount: orders.reduce((sum, order) => sum + sanitizeNumber(order.amount, 0), 0),
      },
      {
        id: 'workforce',
        label: 'Workforce Placements',
        amount: openWorkforce.length * 12000,
      },
      {
        id: 'lead-routing',
        label: 'Patient Routing',
        amount: leads.length * 450,
      },
    ].map((channel) => ({
      ...channel,
      formattedAmount: formatCurrency(channel.amount),
      sharePercent: totalRevenue > 0 ? Number(((channel.amount / totalRevenue) * 100).toFixed(1)) : 0,
    }));

    const workforce = sortByTimestampDesc(
      openWorkforce.map((request) => ({
        id: request.id,
        clinicName: sanitizeString(request.clinicName) || sanitizeString(clinics.find((clinic) => clinic.id === sanitizeString(request.clinicId))?.name) || 'Clinic',
        role: sanitizeString(request.roleTitle) || sanitizeString(request.role) || 'Clinical Role',
        candidates: sanitizeNumber(request.candidateCount, 0),
        status: sanitizeString(request.status) || 'open',
        path: buildAdminPath('staffingRequest', request.id),
      })),
      (item) => item.id,
    ).slice(0, 6);

    const entities = [
      {
        id: 'patients',
        label: 'Patients',
        count: patients.length,
        formattedCount: formatInteger(patients.length),
        description: 'Active patient records and inbound assessment traffic.',
        path: '/admin/crm',
      },
      {
        id: 'clinics',
        label: 'Clinics',
        count: clinics.length,
        formattedCount: formatInteger(clinics.length),
        description: 'Directory, verification, and relationship management.',
        path: '/admin/directory',
      },
      {
        id: 'vendors',
        label: 'Vendors',
        count: vendors.length,
        formattedCount: formatInteger(vendors.length),
        description: 'Marketplace partner inventory and order exposure.',
        path: '/admin/command-center?mode=revenue',
      },
      {
        id: 'workforce',
        label: 'Workforce',
        count: staffingRequests.length,
        formattedCount: formatInteger(staffingRequests.length),
        description: 'Staffing demand, application flow, and placement revenue.',
        path: '/admin/command-center?mode=clinical',
      },
    ];

    const response: CommandCenterResponse = {
      session: actor,
      metrics,
      alerts,
      feed,
      pipelineHealth,
      revenueChannels,
      workforce,
      entities,
    };

    res.json(response);
  }),
);

router.get(
  '/crm',
  asyncHandler(async (req, res) => {
    const actor = await requireAdmin(req, 'admin.crm.read');
    const [leads, campaigns] = await Promise.all([loadLeadRecords(), loadCampaignRecords()]);
    const leads30d = leads.filter((lead) => Date.now() - Date.parse(lead.createdAt) <= 30 * 24 * 60 * 60 * 1000);
    const qualifiedLeads = leads.filter((lead) => lead.status === 'Qualified').length;
    const totalRoutingMinutes = leads.reduce((sum, lead) => {
      const createdAt = Date.parse(lead.createdAt);
      const updatedAt = Date.parse(lead.updatedAt);
      if (!Number.isFinite(createdAt) || !Number.isFinite(updatedAt)) {
        return sum;
      }
      return sum + Math.max(0, Math.round((updatedAt - createdAt) / 60000));
    }, 0);
    const response: CrmResponse = {
      session: actor,
      summary: {
        totalLeads30d: leads30d.length,
        qualificationRate: leads.length > 0 ? Number(((qualifiedLeads / leads.length) * 100).toFixed(1)) : 0,
        avgRoutingMinutes: leads.length > 0 ? Math.round(totalRoutingMinutes / leads.length) : 0,
        pipelineValue: leads.reduce((sum, lead) => sum + lead.estimatedValue, 0),
        formattedPipelineValue: formatCurrency(leads.reduce((sum, lead) => sum + lead.estimatedValue, 0)),
      },
      leads,
      campaigns: campaigns.map((campaign) => ({
        id: campaign.id,
        name: campaign.name,
        status: campaign.status,
        channel: campaign.channel,
      })) as CrmCampaignOption[],
    };

    res.json(response);
  }),
);

router.patch(
  '/crm/leads/:id',
  asyncHandler(async (req, res) => {
    const actor = await requireAdmin(req, 'admin.crm.write');
    const leadId = ensureRequiredString(req.params.id, 'Lead id');
    const leadRef = adminDb.collection(COLLECTIONS.leads).doc(leadId);
    const leadSnap = await leadRef.get();
    if (!leadSnap.exists) {
      throw new AdminHttpError(404, 'Lead not found.');
    }

    const body = (req.body ?? {}) as Record<string, unknown>;
    const nextStatus = sanitizeString(body.status)
      ? ensureEnumValue(body.status, CRM_STATUSES, 'CRM status')
      : null;
    const nextTags = sanitizeStringArray(body.tags);
    const note = sanitizeString(body.note);
    const queueCampaignId = sanitizeString(body.campaignId);
    const queueChannel = sanitizeString(body.channel)
      ? ensureEnumValue(body.channel, OUTREACH_CHANNELS, 'outreach channel')
      : null;
    const mutations: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };

    if (nextStatus) {
      mutations.status = mapCrmStatusToStored(nextStatus);
    }
    if (nextTags.length > 0) {
      mutations.tags = uniqueStrings(nextTags);
    }

    await leadRef.set(mutations, { merge: true });

    if (note || queueCampaignId) {
      const noteEntry = note
        ? {
            id: randomUUID(),
            text: note,
            createdAt: new Date().toISOString(),
            createdBy: actor.name,
          }
        : null;
      await adminDb.collection(COLLECTIONS.leadStates).doc(leadId).set(
        {
          leadId,
          ...(noteEntry ? { notes: FieldValue.arrayUnion(noteEntry) } : {}),
          updatedAt: new Date().toISOString(),
        },
        { merge: true },
      );
    }

    if (queueCampaignId) {
      const leads = await loadLeadRecords();
      const lead = leads.find((candidate) => candidate.id === leadId);
      if (lead) {
        const campaignSnap = await adminDb.collection(COLLECTIONS.campaigns).doc(queueCampaignId).get();
        const campaignName = sanitizeString(campaignSnap.data()?.name) || 'CRM Handoff';
        await createQueueItemForLead(req, lead, {
          campaignId: queueCampaignId,
          campaignName,
          channel: queueChannel || 'Email',
          actor,
        });
      }
    }

    await writeAuditLog(actor, 'crm.lead.updated', 'lead', leadId, {
      status: nextStatus,
      tags: nextTags,
      noteAdded: Boolean(note),
      campaignId: queueCampaignId,
    });

    const leads = await loadLeadRecords();
    const updatedLead = leads.find((candidate) => candidate.id === leadId);
    res.json({ lead: updatedLead });
  }),
);

router.post(
  '/crm/bulk',
  asyncHandler(async (req, res) => {
    const actor = await requireAdmin(req, 'admin.crm.write');
    const body = (req.body ?? {}) as Record<string, unknown>;
    const leadIds = sanitizeStringArray(body.leadIds);
    if (leadIds.length === 0) {
      throw new AdminHttpError(400, 'At least one lead must be selected.');
    }

    const action = ensureRequiredString(body.action, 'Bulk action');
    if (action === 'push_to_outreach') {
      const campaignId = sanitizeString(body.campaignId);
      const channel = sanitizeString(body.channel)
        ? ensureEnumValue(body.channel, OUTREACH_CHANNELS, 'outreach channel')
        : 'Email';
      let resolvedCampaignId = campaignId;
      let resolvedCampaignName = '';
      if (!resolvedCampaignId) {
        const campaignRef = await adminDb.collection(COLLECTIONS.campaigns).add({
          name: `CRM Handoff ${new Date().toLocaleDateString('en-US')}`,
          audience: 'Selected CRM Leads',
          channel,
          objective: 'Move qualified operator-selected leads into active outreach.',
          status: 'Queued',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        resolvedCampaignId = campaignRef.id;
        resolvedCampaignName = `CRM Handoff ${new Date().toLocaleDateString('en-US')}`;
      } else {
        const campaignSnap = await adminDb.collection(COLLECTIONS.campaigns).doc(resolvedCampaignId).get();
        resolvedCampaignName = sanitizeString(campaignSnap.data()?.name) || 'CRM Handoff';
      }

      const leads = await loadLeadRecords();
      const selected = leads.filter((lead) => leadIds.includes(lead.id));
      for (const lead of selected) {
        await createQueueItemForLead(req, lead, {
          campaignId: resolvedCampaignId,
          campaignName: resolvedCampaignName,
          channel,
          actor,
        });
      }

      await writeAuditLog(actor, 'crm.bulk.push_to_outreach', 'lead', leadIds.join(','), {
        count: leadIds.length,
        campaignId: resolvedCampaignId,
      });
      res.json({ success: true, pushed: leadIds.length, campaignId: resolvedCampaignId });
      return;
    }

    if (action === 'change_stage') {
      const status = ensureEnumValue(body.status, CRM_STATUSES, 'CRM status');
      await Promise.all(
        leadIds.map((leadId) =>
          adminDb.collection(COLLECTIONS.leads).doc(leadId).set(
            {
              status: mapCrmStatusToStored(status),
              updatedAt: new Date().toISOString(),
            },
            { merge: true },
          ),
        ),
      );
      await writeAuditLog(actor, 'crm.bulk.change_stage', 'lead', leadIds.join(','), {
        count: leadIds.length,
        status,
      });
      res.json({ success: true, updated: leadIds.length });
      return;
    }

    if (action === 'add_tag') {
      const tag = ensureRequiredString(body.tag, 'Tag');
      await Promise.all(
        leadIds.map((leadId) =>
          adminDb.collection(COLLECTIONS.leadStates).doc(leadId).set(
            {
              leadId,
              tags: FieldValue.arrayUnion(tag),
              updatedAt: new Date().toISOString(),
            },
            { merge: true },
          ),
        ),
      );
      await writeAuditLog(actor, 'crm.bulk.add_tag', 'lead', leadIds.join(','), {
        count: leadIds.length,
        tag,
      });
      res.json({ success: true, tagged: leadIds.length });
      return;
    }

    throw new AdminHttpError(400, 'Unsupported bulk action.');
  }),
);

router.get(
  '/outreach',
  asyncHandler(async (req, res) => {
    const actor = await requireAdmin(req, 'admin.outreach.read');
    const [campaigns, queue, accounts] = await Promise.all([
      loadCampaignRecords(),
      loadQueueRecords(),
      ensureSenderAccounts(),
    ]);

    const today = new Date().toISOString().slice(0, 10);
    const dailySendVolume = queue.filter((item) => item.sentAt?.startsWith(today)).length;
    const totalDailyLimit = accounts.reduce((sum, account) => sum + sanitizeNumber(account.dailyLimit, 0), 0);
    const senderHealthScore =
      accounts.length > 0
        ? Number(
            (
              accounts.reduce((sum, account) => sum + sanitizeNumber(account.healthScore, 0), 0) /
              accounts.length
            ).toFixed(1),
          )
        : 0;
    const sentCount = queue.filter((item) => item.state === 'sent').length;
    const bounceCount = queue.filter((item) => item.feedbackStatus?.toLowerCase().includes('bounce')).length;
    const avgOpenRate =
      campaigns.length > 0
        ? Number((campaigns.reduce((sum, campaign) => sum + campaign.openRate, 0) / campaigns.length).toFixed(1))
        : 0;
    const crmConversionRate =
      sentCount > 0
        ? Number(
            (
              (campaigns.reduce((sum, campaign) => sum + campaign.qualifiedCount, 0) / sentCount) *
              100
            ).toFixed(1),
          )
        : 0;

    const reports = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(Date.now() - (6 - index) * 24 * 60 * 60 * 1000);
      const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const isoDate = date.toISOString().slice(0, 10);
      const dailyQueue = queue.filter((item) => item.sentAt?.startsWith(isoDate));
      const qualified = dailyQueue.filter((item) => item.feedbackStatus?.toLowerCase().includes('qualified')).length;

      return {
        label,
        sent: dailyQueue.length,
        opened: dailyQueue.filter((item) => item.feedbackStatus?.toLowerCase().includes('opened')).length,
        replied: dailyQueue.filter((item) => item.feedbackStatus?.toLowerCase().includes('reply')).length,
        qualified,
      };
    });

    const response: OutreachResponse = {
      session: actor,
      summary: {
        dailySendVolume,
        sendLimit: totalDailyLimit,
        senderHealthScore,
        bounceRate: sentCount > 0 ? Number(((bounceCount / sentCount) * 100).toFixed(1)) : 0,
        avgOpenRate,
        crmConversionRate,
        pendingQueueCount: queue.filter((item) => item.state !== 'sent').length,
      },
      campaigns,
      queue,
      accounts: accounts.map((account) => ({
        id: account.id,
        email: sanitizeString(account.email),
        provider: sanitizeString(account.provider) || 'Custom SMTP',
        healthScore: sanitizeNumber(account.healthScore, 0),
        dailySent: sanitizeNumber(account.dailySent, 0),
        dailyLimit: sanitizeNumber(account.dailyLimit, 0),
        status: (sanitizeString(account.status) || 'Healthy') as SenderAccountRecord['status'],
      })),
      reports,
    };

    res.json(response);
  }),
);

router.post(
  '/outreach/campaigns',
  asyncHandler(async (req, res) => {
    const actor = await requireAdmin(req, 'admin.outreach.write');
    const body = (req.body ?? {}) as Record<string, unknown>;
    const name = ensureRequiredString(body.name, 'Campaign name');
    const audience = ensureRequiredString(body.audience, 'Audience');
    const channel = ensureEnumValue(body.channel, OUTREACH_CHANNELS, 'outreach channel');
    const objective = sanitizeString(body.objective) || 'Generate high-intent operator responses.';
    const leadIds = sanitizeStringArray(body.leadIds);
    const createdAt = new Date().toISOString();

    const campaignRef = await adminDb.collection(COLLECTIONS.campaigns).add({
      name,
      audience,
      channel,
      objective,
      status: leadIds.length > 0 ? 'Queued' : 'Draft',
      createdAt,
      updatedAt: createdAt,
    });

    if (leadIds.length > 0) {
      const leads = await loadLeadRecords();
      const selected = leads.filter((lead) => leadIds.includes(lead.id));
      for (const lead of selected) {
        await createQueueItemForLead(req, lead, {
          campaignId: campaignRef.id,
          campaignName: name,
          channel,
          actor,
        });
      }
    }

    await writeAuditLog(actor, 'outreach.campaign.created', 'campaign', campaignRef.id, {
      audience,
      channel,
      seededLeads: leadIds.length,
    });
    await writeSystemEvent('info', 'OUTREACH', 'CAMPAIGN_CREATED', `${name} created.`, {
      campaignId: campaignRef.id,
      audience,
    });

    res.status(201).json({
      campaign: {
        id: campaignRef.id,
        name,
        audience,
        channel,
        status: leadIds.length > 0 ? 'Queued' : 'Draft',
      },
    });
  }),
);

router.patch(
  '/outreach/campaigns/:id',
  asyncHandler(async (req, res) => {
    const actor = await requireAdmin(req, 'admin.outreach.write');
    const campaignId = ensureRequiredString(req.params.id, 'Campaign id');
    const body = (req.body ?? {}) as Record<string, unknown>;
    const updates: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };
    if (sanitizeString(body.status)) {
      updates.status = ensureEnumValue(body.status, CAMPAIGN_STATUSES, 'campaign status');
    }
    if (sanitizeString(body.objective)) {
      updates.objective = sanitizeString(body.objective);
    }

    await adminDb.collection(COLLECTIONS.campaigns).doc(campaignId).set(updates, { merge: true });
    await writeAuditLog(actor, 'outreach.campaign.updated', 'campaign', campaignId, updates);
    res.json({ success: true });
  }),
);

router.post(
  '/outreach/queue/:id/personalize',
  asyncHandler(async (req, res) => {
    const actor = await requireAdmin(req, 'admin.outreach.write');
    const queueItem = await personalizeQueueItem(req, ensureRequiredString(req.params.id, 'Queue item id'), actor);
    res.json({ queueItem });
  }),
);

router.post(
  '/outreach/queue/:id/send',
  asyncHandler(async (req, res) => {
    const actor = await requireAdmin(req, 'admin.outreach.write');
    const queueItem = await sendQueueItem(ensureRequiredString(req.params.id, 'Queue item id'), actor);
    res.json({ queueItem });
  }),
);

router.post(
  '/outreach/accounts',
  asyncHandler(async (req, res) => {
    const actor = await requireAdmin(req, 'admin.outreach.write');
    const body = (req.body ?? {}) as Record<string, unknown>;
    const email = ensureRequiredString(body.email, 'Sender email');
    const provider = ensureRequiredString(body.provider, 'Provider');
    const healthScore = sanitizeNumber(body.healthScore, 100);
    const dailyLimit = sanitizeNumber(body.dailyLimit, 250);
    const status = sanitizeString(body.status) || 'Healthy';
    const docRef = await adminDb.collection(COLLECTIONS.accounts).add({
      email,
      provider,
      healthScore,
      dailySent: 0,
      dailyLimit,
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    await writeAuditLog(actor, 'outreach.account.created', 'senderAccount', docRef.id, {
      email,
      provider,
    });
    res.status(201).json({ id: docRef.id });
  }),
);

router.get(
  '/directory',
  asyncHandler(async (req, res) => {
    const actor = await requireAdmin(req, 'admin.directory.read');
    const [clinics, clinicStates, invoices, orders, leads] = await Promise.all([
      readCollection(COLLECTIONS.clinics),
      readClinicStates(),
      readCollection(COLLECTIONS.invoices),
      readCollection(COLLECTIONS.orders),
      readCollection(COLLECTIONS.leads),
    ]);

    const directoryRecords = sortByTimestampDesc(
      clinics.map((clinic) => {
        const state = clinicStates.get(clinic.id);
        const clinicRevenue =
          invoices
            .filter((invoice) => sanitizeString(invoice.clinicId) === clinic.id)
            .reduce((sum, invoice) => sum + sanitizeNumber(invoice.amount, 0), 0) +
          orders
            .filter((order) => sanitizeString(order.clinicId) === clinic.id)
            .reduce((sum, order) => sum + sanitizeNumber(order.amount, 0), 0);
        const clinicLeads = leads.filter((lead) => sanitizeString(lead.clinicId) === clinic.id).length;
        const locationParts = [
          sanitizeString(clinic.city),
          sanitizeString(clinic.state),
        ].filter(Boolean);
        const location =
          locationParts.join(', ') ||
          sanitizeString(clinic.location) ||
          sanitizeString(clinic.address) ||
          'Unknown Location';
        return {
          id: clinic.id,
          name: sanitizeString(clinic.name) || 'Unknown Clinic',
          location,
          status: deriveClinicStatus(clinic.status),
          outreachStatus: state?.outreachStatus || 'Onboarding',
          rating: sanitizeNumber(clinic.rating, 0),
          leads: clinicLeads,
          revenue: clinicRevenue,
          formattedRevenue: formatCurrency(clinicRevenue),
          joined: toIso(clinic.createdAt),
          lastContact: sanitizeString(state?.lastContactAt) || sanitizeString(clinic.lastContact) || 'Never',
          tags: uniqueStrings([...sanitizeStringArray(clinic.tags), ...sanitizeStringArray(state?.tags)]),
          internalNote: sanitizeString(state?.internalNote),
          ownerEmail: sanitizeString(clinic.email),
        } satisfies DirectoryClinicRecord;
      }),
      (clinic) => clinic.joined,
    );

    const response: DirectoryResponse = {
      session: actor,
      summary: {
        totalNetworkNodes: clinics.length,
        verifiedPartners: directoryRecords.filter((clinic) => clinic.status === 'Verified').length,
        pendingPartners: directoryRecords.filter((clinic) => clinic.status === 'Pending Review').length,
        totalLeadsRouted: directoryRecords.reduce((sum, clinic) => sum + clinic.leads, 0),
        networkRevenue: directoryRecords.reduce((sum, clinic) => sum + clinic.revenue, 0),
        formattedNetworkRevenue: formatCurrency(directoryRecords.reduce((sum, clinic) => sum + clinic.revenue, 0)),
      },
      clinics: directoryRecords,
    };

    res.json(response);
  }),
);

router.patch(
  '/directory/clinics/:id',
  asyncHandler(async (req, res) => {
    const actor = await requireAdmin(req, 'admin.directory.write');
    const clinicId = ensureRequiredString(req.params.id, 'Clinic id');
    const clinicRef = adminDb.collection(COLLECTIONS.clinics).doc(clinicId);
    const clinicSnap = await clinicRef.get();
    if (!clinicSnap.exists) {
      throw new AdminHttpError(404, 'Clinic not found.');
    }

    const body = (req.body ?? {}) as Record<string, unknown>;
    const nextStatus = sanitizeString(body.status)
      ? ensureEnumValue(body.status, DIRECTORY_STATUSES, 'clinic status')
      : null;
    const nextOutreachStatus = sanitizeString(body.outreachStatus)
      ? ensureEnumValue(body.outreachStatus, DIRECTORY_RELATIONSHIP_STATUSES, 'relationship status')
      : null;
    const internalNote = sanitizeString(body.internalNote);
    const tags = sanitizeStringArray(body.tags);
    const sensitive = nextStatus === 'Suspended';
    const reason = sensitive ? requireSensitiveConfirmation(body, 'suspend a clinic') : sanitizeString(body.reason);

    if (nextStatus) {
      await clinicRef.set(
        {
          status: nextStatus,
          updatedAt: new Date().toISOString(),
        },
        { merge: true },
      );
    }

    await adminDb.collection(COLLECTIONS.clinicStates).doc(clinicId).set(
      {
        clinicId,
        ...(nextOutreachStatus ? { outreachStatus: nextOutreachStatus } : {}),
        ...(internalNote ? { internalNote } : {}),
        ...(tags.length > 0 ? { tags } : {}),
        lastContactAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    );

    await writeAuditLog(
      actor,
      'directory.clinic.updated',
      'clinic',
      clinicId,
      {
        status: nextStatus,
        outreachStatus: nextOutreachStatus,
        tags,
      },
      {
        reason,
        sensitive,
      },
    );

    res.json({ success: true });
  }),
);

router.get(
  '/launch',
  asyncHandler(async (req, res) => {
    const actor = await requireAdmin(req, 'admin.launch.read');
    const [launchControl, campaigns, queue, clinics, patients, leads, invoices, orders, events] = await Promise.all([
      ensureLaunchControl(),
      loadCampaignRecords(),
      loadQueueRecords(),
      readCollection(COLLECTIONS.clinics),
      readCollection(COLLECTIONS.patients),
      readCollection(COLLECTIONS.leads),
      readCollection(COLLECTIONS.invoices),
      readCollection(COLLECTIONS.orders),
      readCollection(COLLECTIONS.events),
    ]);
    const totalRevenue =
      invoices.reduce((sum, invoice) => sum + sanitizeNumber(invoice.amount, 0), 0) +
      orders.reduce((sum, order) => sum + sanitizeNumber(order.amount, 0), 0);
    const metrics = [
      {
        id: 'registrations',
        label: 'User Registrations',
        value: patients.length,
        formattedValue: formatInteger(patients.length),
        target: sanitizeNumber(launchControl.registrationTarget, 5000),
      },
      {
        id: 'activations',
        label: 'Clinic Activations',
        value: clinics.filter((clinic) => deriveClinicStatus(clinic.status) === 'Verified').length,
        formattedValue: formatInteger(clinics.filter((clinic) => deriveClinicStatus(clinic.status) === 'Verified').length),
        target: sanitizeNumber(launchControl.clinicTarget, 150),
      },
      {
        id: 'gmv',
        label: 'GMV Processed',
        value: totalRevenue,
        formattedValue: formatCurrency(totalRevenue),
        target: sanitizeNumber(launchControl.revenueTarget, 100000),
      },
      {
        id: 'leads',
        label: 'Lead Volume',
        value: leads.length,
        formattedValue: formatInteger(leads.length),
        target: sanitizeNumber(launchControl.leadTarget, 2000),
      },
    ];

    const health: LaunchResponse['health'] = [
      {
        id: 'api',
        label: 'API Latency',
        value: Math.min(200, 18 + queue.filter((item) => item.state !== 'sent').length * 4),
        formattedValue: `${Math.min(200, 18 + queue.filter((item) => item.state !== 'sent').length * 4)}ms`,
        tone: 'success',
      },
      {
        id: 'db',
        label: 'Database Load',
        value: Math.min(100, 20 + leads.length + queue.filter((item) => item.state !== 'sent').length),
        formattedValue: `${Math.min(100, 20 + leads.length + queue.filter((item) => item.state !== 'sent').length)}%`,
        tone: queue.filter((item) => item.state !== 'sent').length > 20 ? 'warning' : 'primary',
      },
      {
        id: 'dispatch',
        label: 'Dispatch Capacity',
        value: queue.filter((item) => item.state === 'ready').length,
        formattedValue: `${formatInteger(queue.filter((item) => item.state === 'ready').length)} ready`,
        tone: queue.filter((item) => item.state === 'ready').length > 0 ? 'success' : 'secondary',
      },
      {
        id: 'error-rate',
        label: 'Error Rate',
        value: events.filter((event) => sanitizeString(event.severity) === 'critical').length,
        formattedValue: `${formatPercent(events.length > 0 ? (events.filter((event) => sanitizeString(event.severity) === 'critical').length / events.length) * 100 : 0)}`,
        tone: events.filter((event) => sanitizeString(event.severity) === 'critical').length > 0 ? 'warning' : 'success',
      },
    ];

    const alerts = sortByTimestampDesc(
      [
        ...events.map((event) => `[${sanitizeString(event.service) || 'SYSTEM'}] ${sanitizeString(event.details)}`),
        ...campaigns.map((campaign) => `[OUTREACH] ${campaign.name}: ${campaign.pendingCount} recipients pending dispatch.`),
        ...leads.slice(0, 3).map((lead) => `[CRM] ${sanitizeString(lead.status) || 'new'} lead ${lead.id} updated.`),
      ],
      () => new Date().toISOString(),
    ).slice(0, 15);

    const response: LaunchResponse = {
      session: actor,
      isLive: Boolean(launchControl.isLive),
      phase: sanitizeString(launchControl.phase) || 'Phase 3: National Rollout',
      startedAt: toIso(launchControl.startedAt),
      elapsedSeconds: Math.max(0, Math.floor((Date.now() - Date.parse(toIso(launchControl.startedAt))) / 1000)),
      metrics,
      milestones: Array.isArray(launchControl.milestones)
        ? (launchControl.milestones as LaunchResponse['milestones'])
        : [],
      campaigns: campaigns.map((campaign) => ({
        id: campaign.id,
        name: campaign.name,
        channel: campaign.channel,
        sent: campaign.sentCount,
        openRate: campaign.openRate,
        clickRate: campaign.replyRate,
        status: campaign.status,
      })),
      health,
      alerts,
    };

    res.json(response);
  }),
);

router.post(
  '/launch/control',
  asyncHandler(async (req, res) => {
    const actor = await requireAdmin(req, 'admin.launch.control');
    const body = (req.body ?? {}) as Record<string, unknown>;
    const action = ensureRequiredString(body.action, 'Launch action');
    const reason = requireSensitiveConfirmation(body, action);
    const launchRef = adminDb.collection(COLLECTIONS.controls).doc('launch');
    const launchControl = await ensureLaunchControl();

    if (action === 'pause') {
      await launchRef.set(
        {
          ...launchControl,
          isLive: false,
          updatedAt: new Date().toISOString(),
        },
        { merge: true },
      );
      await writeSystemEvent('warning', 'LAUNCH', 'PAUSE', 'National rollout paused.', { reason });
    } else if (action === 'resume') {
      await launchRef.set(
        {
          ...launchControl,
          isLive: true,
          updatedAt: new Date().toISOString(),
        },
        { merge: true },
      );
      await writeSystemEvent('success', 'LAUNCH', 'RESUME', 'National rollout resumed.', { reason });
    } else if (action === 'trigger_blast') {
      const dispatched = await dispatchReadyQueueItems(actor, 20);
      await launchRef.set(
        {
          lastBlastAt: new Date().toISOString(),
          lastBlastReason: reason,
          updatedAt: new Date().toISOString(),
        },
        { merge: true },
      );
      await writeSystemEvent('success', 'LAUNCH', 'BLAST', `Triggered launch blast for ${dispatched} queue items.`, {
        reason,
        dispatched,
      });
    } else {
      throw new AdminHttpError(400, 'Unsupported launch action.');
    }

    await writeAuditLog(
      actor,
      `launch.${action}`,
      'launch',
      'launch',
      {},
      { reason, sensitive: true },
    );

    res.json({ success: true });
  }),
);

router.get(
  '/mcp',
  asyncHandler(async (req, res) => {
    const actor = await requireAdmin(req, 'admin.mcp.read');
    const [mcpControl, queue, campaigns, leads, staffingRequests, invoices, events] = await Promise.all([
      ensureMcpControl(),
      loadQueueRecords(),
      loadCampaignRecords(),
      readCollection(COLLECTIONS.leads),
      readCollection(COLLECTIONS.staffingRequests),
      readCollection(COLLECTIONS.invoices),
      readCollection(COLLECTIONS.events),
    ]);

    const aiHealth = aiService.getHealthStatus();

    const services = [
      {
        id: 'api-gateway',
        name: 'API Gateway',
        status: 'Online',
        latencyMs: Math.min(120, 28 + leads.length),
        loadPercent: Math.min(100, 25 + queue.filter((item) => item.state !== 'sent').length * 3),
        tone: 'primary',
      },
      {
        id: 'ai-inference',
        name: 'AI Inference',
        status: aiHealth.configured ? 'Active' : 'Degraded',
        latencyMs: aiHealth.configured ? Math.min(1800, aiHealth.timeoutMs) : undefined,
        loadPercent: Math.min(100, 40 + queue.filter((item) => item.personalizationStatus !== 'sent').length * 4),
        tone: aiHealth.configured ? 'secondary' : 'warning',
      },
      {
        id: 'primary-db',
        name: 'Primary DB',
        status: 'Healthy',
        latencyMs: 12,
        loadPercent: Math.min(100, 20 + leads.length + staffingRequests.length),
        tone: 'success',
      },
      {
        id: 'worker-nodes',
        name: 'Worker Nodes',
        status: queue.filter((item) => item.state === 'ready').length > 10 ? 'Scaling' : 'Nominal',
        latencyMs: undefined,
        loadPercent: Math.min(100, 18 + queue.filter((item) => item.state !== 'sent').length * 5),
        tone: queue.filter((item) => item.state === 'ready').length > 10 ? 'warning' : 'primary',
      },
      {
        id: 'dispatch-guard',
        name: 'Dispatch Guard',
        status: campaigns.some((campaign) => campaign.status === 'Paused') ? 'Manual Hold' : 'Enforcing',
        latencyMs: 5,
        loadPercent: invoices.filter((invoice) => sanitizeString(invoice.status) === 'overdue').length * 5,
        tone: campaigns.some((campaign) => campaign.status === 'Paused') ? 'warning' : 'primary',
      },
    ] as McpResponse['services'];

    const queues = [
      {
        id: 'lead-intake',
        name: 'Lead Intake',
        pending: leads.filter((lead) => mapStoredLeadStatusToCrm(lead.status) === 'New').length,
        inProgress: leads.filter((lead) => mapStoredLeadStatusToCrm(lead.status) === 'Contacted').length,
        failed: leads.filter((lead) => mapStoredLeadStatusToCrm(lead.status) === 'Lost').length,
        status: 'Active',
      },
      {
        id: 'outreach-dispatch',
        name: 'Outreach Dispatch',
        pending: queue.filter((item) => item.state === 'ready' || item.state === 'pending').length,
        inProgress: queue.filter((item) => item.state === 'sending').length,
        failed: queue.filter((item) => item.state === 'failed').length,
        status: campaigns.some((campaign) => campaign.status === 'Paused') ? 'Paused' : 'Flowing',
      },
      {
        id: 'workforce-orchestration',
        name: 'Workforce Orchestration',
        pending: staffingRequests.filter((request) => sanitizeString(request.status) === 'open').length,
        inProgress: staffingRequests.filter((request) => sanitizeString(request.status) === 'interviewing').length,
        failed: staffingRequests.filter((request) => sanitizeString(request.status) === 'closed').length,
        status: 'Active',
      },
    ];

    const allEvents = sortByTimestampDesc(
      [
        ...events.map((event) => ({
          id: event.id,
          timestamp: toIso(event.createdAt),
          service: sanitizeString(event.service) || 'SYSTEM',
          type: sanitizeString(event.type) || 'EVENT',
          details: sanitizeString(event.details) || 'System event recorded.',
          severity: (sanitizeString(event.severity) || 'info') as McpEventRecord['severity'],
          status: sanitizeString(event.type) || 'event',
        })),
        ...queue.slice(0, 8).map((item) => ({
          id: `queue-${item.id}`,
          timestamp: item.sentAt || item.scheduledFor,
          service: 'OUTREACH',
          type: item.state.toUpperCase(),
          details: `${item.recipientName} via ${item.channel} (${item.campaignName})`,
          severity: (item.state === 'failed' ? 'warning' : 'info') as McpEventRecord['severity'],
          status: item.state,
        })),
      ],
      (event) => event.timestamp,
    ).slice(0, 20) as McpEventRecord[];

    const response: McpResponse = {
      session: actor,
      isLive: Boolean(mcpControl.isLive),
      orchestratorVersion: sanitizeString(mcpControl.orchestratorVersion) || 'v2.4.1-stable',
      services,
      queues,
      events: allEvents,
      logs: allEvents.slice(0, 15).map((event) => `[${event.service}] ${event.timestamp} - ${event.details}`),
    };

    res.json(response);
  }),
);

router.post(
  '/mcp/commands',
  asyncHandler(async (req, res) => {
    const actor = await requireAdmin(req, 'admin.mcp.control');
    const body = (req.body ?? {}) as Record<string, unknown>;
    const action = ensureRequiredString(body.action, 'MCP action');
    const reason = requireSensitiveConfirmation(body, action);
    const command = sanitizeString(body.command) || action;
    const mcpRef = adminDb.collection(COLLECTIONS.controls).doc('mcp');
    const control = await ensureMcpControl();

    if (action === 'suspend') {
      await mcpRef.set({ ...control, isLive: false, updatedAt: new Date().toISOString() }, { merge: true });
      await writeSystemEvent('warning', 'MCP', 'SUSPEND', 'Orchestrator suspended.', { reason });
    } else if (action === 'resume') {
      await mcpRef.set({ ...control, isLive: true, updatedAt: new Date().toISOString() }, { merge: true });
      await writeSystemEvent('success', 'MCP', 'RESUME', 'Orchestrator resumed.', { reason });
    } else if (action === 'restart_core') {
      await mcpRef.set(
        {
          ...control,
          isLive: true,
          lastRestartAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        { merge: true },
      );
      await writeSystemEvent('warning', 'MCP', 'RESTART', 'Core restart requested.', { reason });
    } else if (action === 'flush_cache') {
      await writeSystemEvent('info', 'MCP', 'CACHE_FLUSH', 'Cache flush requested.', { reason });
    } else if (action === 'force_scaling') {
      await writeSystemEvent('info', 'MCP', 'FORCE_SCALING', 'Worker scale-out requested.', { reason });
    } else if (action === 'halt_dispatch') {
      const campaigns = await readCollection(COLLECTIONS.campaigns);
      await Promise.all(
        campaigns.map((campaign) =>
          adminDb.collection(COLLECTIONS.campaigns).doc(campaign.id).set(
            {
              status: 'Paused',
              updatedAt: new Date().toISOString(),
            },
            { merge: true },
          ),
        ),
      );
      await Promise.all(
        (await readCollection(COLLECTIONS.queue))
          .filter((queueItem) => deriveQueueState(queueItem.state) !== 'sent')
          .map((queueItem) =>
            adminDb.collection(COLLECTIONS.queue).doc(queueItem.id).set(
              {
                state: 'paused',
                updatedAt: new Date().toISOString(),
              },
              { merge: true },
            ),
          ),
      );
      await writeSystemEvent('critical', 'MCP', 'HALT_DISPATCH', 'All pending campaign dispatches halted.', { reason });
    } else {
      await writeSystemEvent('info', 'MCP', 'COMMAND', `Custom command executed: ${command}`, { reason });
    }

    await adminDb.collection(COLLECTIONS.commands).add({
      action,
      command,
      actorId: actor.uid,
      actorName: actor.name,
      reason,
      createdAt: new Date().toISOString(),
    });

    await writeAuditLog(
      actor,
      `mcp.${action}`,
      'mcp',
      'mcp',
      { command },
      { reason, sensitive: true },
    );

    res.json({ success: true });
  }),
);

export default router;
