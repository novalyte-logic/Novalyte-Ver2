import express from 'express';
import { canAccessClinicScopedApis, isAdminRole, isClinicRole } from '../../shared/authRoles';
import { aiService } from '../lib/aiService';
import { getAuthenticatedActor, type AuthenticatedActor } from '../lib/authSession';
import { deliverSubmissionAlert } from '../lib/correspondence';
import { adminDb } from '../lib/supabaseAdmin';

const router = express.Router();

type AuthenticatedRequest = express.Request & {
  actor?: AuthenticatedActor | null;
};

type DocRecord = {
  id: string;
  [key: string]: unknown;
};

class ClinicHttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
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
    const normalized = value.replace(/[^0-9.-]/g, '');
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
}

function sanitizeBoolean(value: unknown, fallback = false) {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['true', '1', 'yes', 'on'].includes(normalized)) {
      return true;
    }
    if (['false', '0', 'no', 'off'].includes(normalized)) {
      return false;
    }
  }

  return fallback;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: value >= 1000 ? 0 : 2,
  }).format(value);
}

function formatCompactCurrency(value: number) {
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}k`;
  }
  return formatCurrency(value);
}

function formatDate(value: unknown) {
  const date = toDateValue(value);
  if (!date) {
    return '';
  }
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function toDateValue(value: unknown) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  if (typeof value === 'object' && value && 'toDate' in value && typeof value.toDate === 'function') {
    const converted = value.toDate();
    return converted instanceof Date ? converted : null;
  }

  return null;
}

function toIso(value: unknown) {
  return toDateValue(value)?.toISOString() || new Date().toISOString();
}

function sortByDateDesc<T>(items: T[], selector: (item: T) => unknown) {
  return [...items].sort((left, right) => {
    const leftTime = toDateValue(selector(left))?.getTime() || 0;
    const rightTime = toDateValue(selector(right))?.getTime() || 0;
    return rightTime - leftTime;
  });
}

function uniqueStrings(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
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

function deriveLeadScore(lead: DocRecord, assessment: DocRecord | undefined) {
  const explicitScore =
    sanitizeNumber(lead.score) ||
    sanitizeNumber((lead.scores as Record<string, unknown> | undefined)?.overall);
  if (explicitScore > 0) {
    return explicitScore;
  }

  const urgency = sanitizeString(lead.urgency || assessment?.urgency).toLowerCase();
  const budget = sanitizeString(lead.budget || assessment?.budget).toLowerCase();
  let score = 72;
  if (urgency.includes('asap') || urgency.includes('urgent') || urgency.includes('high')) {
    score += 12;
  }
  if (budget.includes('$500') || budget.includes('$1,000')) {
    score += 8;
  }

  return Math.min(99, score);
}

function mapLeadStatus(value: unknown) {
  const normalized = sanitizeString(value).toLowerCase();
  if (!normalized) {
    return 'new';
  }
  if (['contacted', 'qualified', 'scheduled', 'treating', 'disqualified', 'nurture'].includes(normalized)) {
    return normalized;
  }
  if (normalized === 'consult_scheduled' || normalized === 'enrolled') {
    return normalized === 'consult_scheduled' ? 'scheduled' : 'treating';
  }
  return 'new';
}

function leadStageFromStatus(status: string) {
  if (status === 'contacted' || status === 'qualified' || status === 'nurture') {
    return 'triage';
  }
  if (status === 'scheduled') {
    return 'consult';
  }
  if (status === 'treating') {
    return 'treating';
  }
  return 'intake';
}

function riskFromScore(score: number) {
  if (score < 70) {
    return {
      level: 'high',
      reason: 'Low qualification score or financial readiness risk.',
    };
  }
  if (score < 85) {
    return {
      level: 'medium',
      reason: '',
    };
  }
  return {
    level: 'low',
    reason: '',
  };
}

function relativeTime(value: unknown) {
  const date = toDateValue(value);
  if (!date) {
    return 'Just now';
  }

  const diffMinutes = Math.floor((Date.now() - date.getTime()) / 60000);
  if (diffMinutes <= 0) {
    return 'Just now';
  }
  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  return `${Math.floor(diffHours / 24)}d ago`;
}

async function readCollection(collectionName: string) {
  const snapshot = await adminDb.collection(collectionName).get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() ?? {}),
  })) as DocRecord[];
}

async function getActor(req: AuthenticatedRequest, required = true) {
  if (req.actor !== undefined) {
    return req.actor;
  }

  try {
    const actor = await getAuthenticatedActor(req, required);
    req.actor = actor;
    return actor;
  } catch (error) {
    if (!required) {
      req.actor = null;
      return null;
    }

    if (error instanceof Error && error.message === 'Authentication required.') {
      throw new ClinicHttpError(401, error.message);
    }

    throw error;
  }
}

async function requireClinicActor(req: AuthenticatedRequest) {
  const actor = await getActor(req, true);
  if (!actor || !canAccessClinicScopedApis(actor.role)) {
    throw new ClinicHttpError(403, 'Clinic access required.');
  }

  return actor;
}

function resolveClinicId(actor: AuthenticatedActor, requestedClinicId: string) {
  if (isClinicRole(actor.role)) {
    return actor.uid;
  }

  if (isAdminRole(actor.role) && requestedClinicId) {
    return requestedClinicId;
  }

  throw new ClinicHttpError(403, 'Clinic workspace access is not available for this account.');
}

async function readClinicDocument(clinicId: string) {
  const snapshot = await adminDb.collection('clinics').doc(clinicId).get();
  if (!snapshot.exists) {
    throw new ClinicHttpError(404, 'Clinic record not found.');
  }

  return {
    id: snapshot.id,
    ...(snapshot.data() ?? {}),
  } as DocRecord;
}

async function createClinicAuditEvent(input: {
  clinicId: string;
  action: string;
  entityId: string;
  entityName: string;
  type?: 'info' | 'warning' | 'success';
  actorId?: string;
}) {
  await adminDb.collection('auditEvents').add({
    clinicId: input.clinicId,
    action: input.action,
    entityId: input.entityId,
    entityName: input.entityName,
    type: input.type || 'info',
    actorId: input.actorId || '',
    timestamp: new Date().toISOString(),
  });
}

async function notifySubmission(input: Parameters<typeof deliverSubmissionAlert>[0]) {
  try {
    await deliverSubmissionAlert(input);
  } catch (error) {
    console.error('Clinic submission alert failed:', error);
  }
}

function getLeadDisplayName(lead: DocRecord, patient?: DocRecord) {
  const patientName = [sanitizeString(patient?.firstName), sanitizeString(patient?.lastName)]
    .filter(Boolean)
    .join(' ')
    .trim();
  return patientName || sanitizeString(lead.patientName) || 'Unknown Patient';
}

function getLeadIntent(lead: DocRecord, assessment?: DocRecord) {
  return (
    sanitizeString(lead.treatmentInterest) ||
    sanitizeString(lead.goal) ||
    sanitizeString(assessment?.goal) ||
    sanitizeString(assessment?.treatmentInterest) ||
    'General Optimization'
  );
}

function getLeadBudget(lead: DocRecord, assessment?: DocRecord) {
  return sanitizeString(lead.budget) || sanitizeString(assessment?.budget) || 'Unknown';
}

function getLeadUrgency(lead: DocRecord, assessment?: DocRecord) {
  return sanitizeString(lead.urgency) || sanitizeString(assessment?.urgency) || 'Unknown';
}

function buildLeadSummary(lead: DocRecord, assessment?: DocRecord) {
  return (
    sanitizeString(lead.aiReasoning) ||
    sanitizeString(lead.aiSummary) ||
    sanitizeString(assessment?.aiSummary) ||
    `Routed via ${sanitizeString(lead.source) || 'Novalyte intake'} for ${getLeadIntent(lead, assessment)}.`
  );
}

function mapLeadNotes(value: unknown) {
  if (!Array.isArray(value)) {
    return [] as Array<{ id: string; text: string; createdAt: string; createdBy: string }>;
  }

  return value
    .map((entry) => {
      if (!entry || typeof entry !== 'object') {
        return null;
      }

      const note = entry as Record<string, unknown>;
      const text = sanitizeString(note.text);
      if (!text) {
        return null;
      }

      return {
        id: sanitizeString(note.id) || crypto.randomUUID(),
        text,
        createdAt: sanitizeString(note.createdAt) || sanitizeString(note.date) || new Date().toISOString(),
        createdBy: sanitizeString(note.createdBy) || 'Clinic Operator',
      };
    })
    .filter((entry): entry is { id: string; text: string; createdAt: string; createdBy: string } => Boolean(entry));
}

function findNextAppointment(leadId: string, patientId: string, bookings: DocRecord[]) {
  const now = Date.now();
  const next = bookings
    .filter((booking) => sanitizeString(booking.leadId) === leadId || sanitizeString(booking.patientId) === patientId)
    .map((booking) => ({
      booking,
      startTime: toDateValue(booking.startTime),
    }))
    .filter((entry) => entry.startTime && entry.startTime.getTime() >= now)
    .sort((left, right) => (left.startTime?.getTime() || 0) - (right.startTime?.getTime() || 0))
    .at(0);

  return next?.startTime ? next.startTime.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }) : sanitizeString(next?.booking.requestedSlotLabel) || '';
}

function serializeLead(lead: DocRecord, patient?: DocRecord, assessment?: DocRecord, bookings: DocRecord[] = []) {
  const score = deriveLeadScore(lead, assessment);
  const risk = riskFromScore(score);
  const status = mapLeadStatus(lead.status);
  const patientId = sanitizeString(lead.patientId);

  return {
    id: lead.id,
    patientId,
    assessmentId: sanitizeString(lead.assessmentId) || undefined,
    name: getLeadDisplayName(lead, patient),
    intent: getLeadIntent(lead, assessment),
    score,
    status,
    stage: leadStageFromStatus(status),
    risk: risk.level,
    riskReason: risk.reason,
    intentSignal:
      sanitizeString(lead.intentSignal) ||
      (sanitizeString(lead.urgency).toLowerCase().includes('high') ? 'High urgency intake' : ''),
    budget: getLeadBudget(lead, assessment),
    urgency: getLeadUrgency(lead, assessment),
    aiSummary: buildLeadSummary(lead, assessment),
    notes: mapLeadNotes(lead.notes),
    email: sanitizeString(patient?.email) || sanitizeString(lead.email),
    phone: sanitizeString(patient?.phone) || sanitizeString(lead.phone),
    nextAppointment: findNextAppointment(lead.id, patientId, bookings) || sanitizeString(lead.nextAppointment),
    source: sanitizeString(lead.source) || 'Patient Assessment',
    estimatedValue: estimateLeadValue(getLeadBudget(lead, assessment), lead),
    createdAt: toIso(lead.createdAt),
    updatedAt: toIso(lead.updatedAt || lead.createdAt),
    timeLabel: relativeTime(lead.updatedAt || lead.createdAt),
  };
}

function buildOverviewFallbackInsights(input: {
  activePipeline: number;
  consultsToday: number;
  priorityLeads: number;
  openSupportTickets: number;
}) {
  const insights: Array<{
    id: string;
    type: 'growth' | 'efficiency' | 'retention';
    title: string;
    description: string;
    action: string;
    impact: string;
    createdAt: string;
  }> = [];
  const now = new Date().toISOString();

  if (input.priorityLeads > 0) {
    insights.push({
      id: 'priority-leads',
      type: 'growth',
      title: 'High-intent leads awaiting follow-up',
      description: `${input.priorityLeads} routed leads currently score 85+ and should be reviewed before the next consult block.`,
      action: 'Review leads',
      impact: 'Protect conversion on qualified demand',
      createdAt: now,
    });
  }

  if (input.consultsToday === 0 && input.activePipeline > 0) {
    insights.push({
      id: 'schedule-gap',
      type: 'efficiency',
      title: 'No consults are booked today',
      description: `You still have ${input.activePipeline} active leads in pipeline. Pull forward follow-up scheduling to avoid idle capacity.`,
      action: 'Open pipeline',
      impact: 'Recover same-week booking volume',
      createdAt: now,
    });
  }

  if (input.openSupportTickets > 0) {
    insights.push({
      id: 'support-follow-up',
      type: 'retention',
      title: 'Operational support items are open',
      description: `${input.openSupportTickets} support ticket${input.openSupportTickets === 1 ? '' : 's'} remain unresolved and may affect clinic operations.`,
      action: 'Review support',
      impact: 'Reduce operator friction',
      createdAt: now,
    });
  }

  return insights;
}

function isOrderableProduct(product: DocRecord) {
  const status = sanitizeString(product.status).toLowerCase();
  return status !== 'draft' && status !== 'archived' && product.isPublic !== false;
}

function asyncHandler(handler: (req: AuthenticatedRequest, res: express.Response) => Promise<unknown>) {
  return async (req: AuthenticatedRequest, res: express.Response) => {
    try {
      await handler(req, res);
    } catch (error) {
      const status = error instanceof ClinicHttpError ? error.status : 500;
      const message = error instanceof Error ? error.message : 'Unable to complete clinic request.';
      if (status >= 500) {
        console.error('Clinic route failed:', error);
      }
      res.status(status).json({ error: message });
    }
  };
}

router.get(
  '/overview',
  asyncHandler(async (req, res) => {
    const actor = await requireClinicActor(req);
    const clinicId = resolveClinicId(actor, sanitizeString(req.query.clinicId));
    const [clinic, leads, patients, assessments, bookings, audits, insights, supportTickets] = await Promise.all([
      readClinicDocument(clinicId),
      readCollection('leads').then((items) => items.filter((item) => sanitizeString(item.clinicId) === clinicId)),
      readCollection('patients'),
      readCollection('assessments'),
      readCollection('bookings').then((items) => items.filter((item) => sanitizeString(item.clinicId) === clinicId)),
      readCollection('auditEvents').then((items) => items.filter((item) => sanitizeString(item.clinicId) === clinicId)),
      readCollection('intelligenceInsights').then((items) => items.filter((item) => sanitizeString(item.clinicId) === clinicId)),
      readCollection('supportTickets').then((items) => items.filter((item) => sanitizeString(item.clinicId) === clinicId)),
    ]);

    const patientMap = new Map(patients.map((patient) => [patient.id, patient]));
    const assessmentMap = new Map(assessments.map((assessment) => [assessment.id, assessment]));
    const serializedLeads = leads.map((lead) =>
      serializeLead(lead, patientMap.get(sanitizeString(lead.patientId)), assessmentMap.get(sanitizeString(lead.assessmentId)), bookings),
    );

    const activePipeline = serializedLeads.filter((lead) => !['disqualified', 'treating'].includes(lead.status)).length;
    const funnel = {
      intake: serializedLeads.filter((lead) => lead.stage === 'intake').length,
      triage: serializedLeads.filter((lead) => lead.stage === 'triage').length,
      consult: serializedLeads.filter((lead) => lead.stage === 'consult').length,
      treating: serializedLeads.filter((lead) => lead.stage === 'treating').length,
    };

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const tomorrow = new Date(todayStart);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const todaysBookings = bookings
      .filter((booking) => {
        const startTime = toDateValue(booking.startTime);
        return Boolean(startTime && startTime >= todayStart && startTime < tomorrow);
      })
      .sort((left, right) => (toDateValue(left.startTime)?.getTime() || 0) - (toDateValue(right.startTime)?.getTime() || 0));

    const recentBookings = bookings.filter((booking) => {
      const createdAt = toDateValue(booking.createdAt || booking.startTime);
      return Boolean(createdAt && Date.now() - createdAt.getTime() <= 30 * 24 * 60 * 60 * 1000);
    });
    const measuredBookings = recentBookings.filter((booking) =>
      ['completed', 'confirmed', 'cancelled', 'no_show'].includes(sanitizeString(booking.status).toLowerCase()),
    );
    const attendedBookings = measuredBookings.filter((booking) =>
      ['completed', 'confirmed'].includes(sanitizeString(booking.status).toLowerCase()),
    );
    const showRate = measuredBookings.length > 0 ? Math.round((attendedBookings.length / measuredBookings.length) * 100) : null;
    const estimatedRevenue = serializedLeads
      .filter((lead) => !['disqualified'].includes(lead.status))
      .reduce((sum, lead) => sum + lead.estimatedValue, 0);
    const priorityLeads = sortByDateDesc(
      serializedLeads.filter((lead) => lead.score >= 85 && ['new', 'contacted', 'qualified'].includes(lead.status)),
      (lead) => lead.updatedAt,
    ).slice(0, 3);

    const activity = sortByDateDesc(
      audits.map((audit) => ({
        id: audit.id,
        event: sanitizeString(audit.action) || 'System event',
        entity: sanitizeString(audit.entityName) || 'Unknown',
        type: sanitizeString(audit.type) || 'info',
        createdAt: toIso(audit.timestamp || audit.createdAt),
        timeLabel: relativeTime(audit.timestamp || audit.createdAt),
      })),
      (entry) => entry.createdAt,
    ).slice(0, 10);

    const openSupportTickets = supportTickets.filter(
      (ticket) => !['resolved', 'closed'].includes(sanitizeString(ticket.status).toLowerCase()),
    ).length;

    const liveInsights = sortByDateDesc(
      insights.map((insight) => ({
        id: insight.id,
        type: (sanitizeString(insight.type) || 'efficiency') as 'growth' | 'efficiency' | 'retention',
        title: sanitizeString(insight.title) || 'Operational insight',
        description: sanitizeString(insight.description) || sanitizeString(insight.summary),
        action: sanitizeString(insight.action) || 'Open intelligence',
        impact: sanitizeString(insight.impact) || '',
        createdAt: toIso(insight.createdAt || insight.updatedAt),
      })),
      (entry) => entry.createdAt,
    ).slice(0, 4);

    const fallbackInsights = buildOverviewFallbackInsights({
      activePipeline,
      consultsToday: todaysBookings.length,
      priorityLeads: priorityLeads.length,
      openSupportTickets,
    });

    return res.json({
      clinic: {
        id: clinic.id,
        name: sanitizeString(clinic.name) || 'Clinic',
        status: sanitizeString(clinic.status) || 'pending',
        specialties: sanitizeStringArray(clinic.specialties),
      },
      metrics: {
        activePipeline,
        consultsToday: todaysBookings.length,
        showRate,
        estimatedRevenue,
        estimatedRevenueLabel: formatCompactCurrency(estimatedRevenue),
      },
      funnel,
      priorityLeads,
      schedule: todaysBookings.map((booking) => ({
        id: booking.id,
        title: sanitizeString(booking.title) || 'Consultation',
        patientName: sanitizeString(booking.patientName) || 'Patient',
        startTime: toIso(booking.startTime),
        status: sanitizeString(booking.status) || 'pending_confirmation',
        meetingLink: sanitizeString(booking.meetingLink),
      })),
      activity,
      insights: liveInsights.length > 0 ? liveInsights : fallbackInsights,
    });
  }),
);

router.get(
  '/leads',
  asyncHandler(async (req, res) => {
    const actor = await requireClinicActor(req);
    const clinicId = resolveClinicId(actor, sanitizeString(req.query.clinicId));
    const [leads, patients, assessments, bookings] = await Promise.all([
      readCollection('leads').then((items) => items.filter((item) => sanitizeString(item.clinicId) === clinicId)),
      readCollection('patients'),
      readCollection('assessments'),
      readCollection('bookings').then((items) => items.filter((item) => sanitizeString(item.clinicId) === clinicId)),
    ]);

    const patientMap = new Map(patients.map((patient) => [patient.id, patient]));
    const assessmentMap = new Map(assessments.map((assessment) => [assessment.id, assessment]));
    const serialized = sortByDateDesc(
      leads.map((lead) =>
        serializeLead(lead, patientMap.get(sanitizeString(lead.patientId)), assessmentMap.get(sanitizeString(lead.assessmentId)), bookings),
      ),
      (lead) => lead.updatedAt,
    );

    return res.json({ leads: serialized });
  }),
);

router.patch(
  '/leads/:id',
  asyncHandler(async (req, res) => {
    const actor = await requireClinicActor(req);
    const clinicId = resolveClinicId(actor, sanitizeString(req.query.clinicId));
    const leadId = sanitizeString(req.params.id);
    if (!leadId) {
      throw new ClinicHttpError(400, 'Lead id is required.');
    }

    const leadRef = adminDb.collection('leads').doc(leadId);
    const leadSnapshot = await leadRef.get();
    if (!leadSnapshot.exists) {
      throw new ClinicHttpError(404, 'Lead not found.');
    }

    const lead = {
      id: leadSnapshot.id,
      ...(leadSnapshot.data() ?? {}),
    } as DocRecord;
    if (sanitizeString(lead.clinicId) !== clinicId) {
      throw new ClinicHttpError(403, 'You do not have access to this lead.');
    }

    const body = req.body && typeof req.body === 'object' ? (req.body as Record<string, unknown>) : {};
    const updates: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };
    const nextStatus = sanitizeString(body.status);
    if (nextStatus) {
      const normalizedStatus = mapLeadStatus(nextStatus);
      updates.status = normalizedStatus;
    }
    if (Object.prototype.hasOwnProperty.call(body, 'nextAppointment')) {
      updates.nextAppointment = body.nextAppointment === null ? null : sanitizeString(body.nextAppointment);
    }

    await leadRef.set(updates, { merge: true });
    await createClinicAuditEvent({
      clinicId,
      action: nextStatus ? `Lead status updated to ${mapLeadStatus(nextStatus)}` : 'Lead updated',
      entityId: leadId,
      entityName: sanitizeString(lead.patientName) || leadId,
      type: 'info',
      actorId: actor.uid,
    });

    return res.json({ success: true });
  }),
);

router.post(
  '/leads/:id/notes',
  asyncHandler(async (req, res) => {
    const actor = await requireClinicActor(req);
    const clinicId = resolveClinicId(actor, sanitizeString(req.query.clinicId));
    const leadId = sanitizeString(req.params.id);
    const body = req.body && typeof req.body === 'object' ? (req.body as Record<string, unknown>) : {};
    const text = sanitizeString(body.text);

    if (!leadId) {
      throw new ClinicHttpError(400, 'Lead id is required.');
    }
    if (text.length < 3) {
      throw new ClinicHttpError(400, 'Note text is required.');
    }

    const leadRef = adminDb.collection('leads').doc(leadId);
    const leadSnapshot = await leadRef.get();
    if (!leadSnapshot.exists) {
      throw new ClinicHttpError(404, 'Lead not found.');
    }

    const lead = {
      id: leadSnapshot.id,
      ...(leadSnapshot.data() ?? {}),
    } as DocRecord;
    if (sanitizeString(lead.clinicId) !== clinicId) {
      throw new ClinicHttpError(403, 'You do not have access to this lead.');
    }

    const notes = mapLeadNotes(lead.notes);
    const nextNote = {
      id: crypto.randomUUID(),
      text,
      createdAt: new Date().toISOString(),
      createdBy: actor.name,
    };

    await leadRef.set(
      {
        notes: [nextNote, ...notes],
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    );

    await createClinicAuditEvent({
      clinicId,
      action: 'Lead note added',
      entityId: leadId,
      entityName: sanitizeString(lead.patientName) || leadId,
      type: 'info',
      actorId: actor.uid,
    });

    return res.status(201).json({ note: nextNote });
  }),
);

router.post(
  '/leads/:id/cancel-appointment',
  asyncHandler(async (req, res) => {
    const actor = await requireClinicActor(req);
    const clinicId = resolveClinicId(actor, sanitizeString(req.query.clinicId));
    const leadId = sanitizeString(req.params.id);
    if (!leadId) {
      throw new ClinicHttpError(400, 'Lead id is required.');
    }

    const leadRef = adminDb.collection('leads').doc(leadId);
    const leadSnapshot = await leadRef.get();
    if (!leadSnapshot.exists) {
      throw new ClinicHttpError(404, 'Lead not found.');
    }

    const lead = {
      id: leadSnapshot.id,
      ...(leadSnapshot.data() ?? {}),
    } as DocRecord;
    if (sanitizeString(lead.clinicId) !== clinicId) {
      throw new ClinicHttpError(403, 'You do not have access to this lead.');
    }

    const bookings = await readCollection('bookings');
    const nextBooking = bookings
      .filter((booking) => sanitizeString(booking.clinicId) === clinicId)
      .filter((booking) => sanitizeString(booking.leadId) === leadId || sanitizeString(booking.patientId) === sanitizeString(lead.patientId))
      .map((booking) => ({
        booking,
        startTime: toDateValue(booking.startTime),
      }))
      .filter((entry) => entry.startTime && entry.startTime.getTime() >= Date.now())
      .sort((left, right) => (left.startTime?.getTime() || 0) - (right.startTime?.getTime() || 0))
      .at(0);

    if (nextBooking) {
      await adminDb.collection('bookings').doc(nextBooking.booking.id).set(
        {
          status: 'cancelled',
          updatedAt: new Date().toISOString(),
        },
        { merge: true },
      );
    }

    await leadRef.set(
      {
        nextAppointment: null,
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    );

    await createClinicAuditEvent({
      clinicId,
      action: 'Consultation cancelled',
      entityId: leadId,
      entityName: sanitizeString(lead.patientName) || leadId,
      type: 'warning',
      actorId: actor.uid,
    });

    return res.json({ success: true });
  }),
);

router.post(
  '/leads/:id/score',
  asyncHandler(async (req, res) => {
    const actor = await requireClinicActor(req);
    const clinicId = resolveClinicId(actor, sanitizeString(req.query.clinicId));
    const leadId = sanitizeString(req.params.id);
    if (!leadId) {
      throw new ClinicHttpError(400, 'Lead id is required.');
    }

    const [leadSnapshot, patients, assessments] = await Promise.all([
      adminDb.collection('leads').doc(leadId).get(),
      readCollection('patients'),
      readCollection('assessments'),
    ]);
    if (!leadSnapshot.exists) {
      throw new ClinicHttpError(404, 'Lead not found.');
    }

    const lead = {
      id: leadSnapshot.id,
      ...(leadSnapshot.data() ?? {}),
    } as DocRecord;
    if (sanitizeString(lead.clinicId) !== clinicId) {
      throw new ClinicHttpError(403, 'You do not have access to this lead.');
    }

    const patient = patients.find((item) => item.id === sanitizeString(lead.patientId));
    const assessment = assessments.find((item) => item.id === sanitizeString(lead.assessmentId));
    const patientPayload = {
      demographics: {
        age: sanitizeNumber(patient?.age) || sanitizeNumber(assessment?.age) || undefined,
        gender: sanitizeString(patient?.gender) || undefined,
        location: {
          city: sanitizeString(patient?.city),
          state: sanitizeString(patient?.state),
          zipCode: sanitizeString(patient?.zip),
        },
      },
      healthProfile: {
        primaryGoals: uniqueStrings([getLeadIntent(lead, assessment)]),
        symptoms: sanitizeStringArray(assessment?.symptoms),
        currentTreatments: sanitizeStringArray(patient?.currentTreatments),
      },
      financialProfile: {
        willingToPayOOP: true,
        monthlyBudget: sanitizeNumber(getLeadBudget(lead, assessment)),
      },
    };

    const result = await aiService.generateTriage(patientPayload, typeof res.locals.requestId === 'string' ? res.locals.requestId : undefined);

    await adminDb.collection('leads').doc(leadId).set(
      {
        score: sanitizeNumber(result.score, Math.round((result.confidenceScore || 0.8) * 100)),
        aiReasoning: sanitizeString(result.rationale) || buildLeadSummary(lead, assessment),
        intentSignal: sanitizeString(result.nextBestAction),
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    );

    await createClinicAuditEvent({
      clinicId,
      action: 'Lead AI scoring refreshed',
      entityId: leadId,
      entityName: getLeadDisplayName(lead, patient),
      type: 'success',
      actorId: actor.uid,
    });

    return res.json({
      score: sanitizeNumber(result.score, Math.round((result.confidenceScore || 0.8) * 100)),
      summary: sanitizeString(result.rationale) || buildLeadSummary(lead, assessment),
      nextBestAction: sanitizeString(result.nextBestAction),
    });
  }),
);

router.get(
  '/profile',
  asyncHandler(async (req, res) => {
    const actor = await requireClinicActor(req);
    const clinicId = resolveClinicId(actor, sanitizeString(req.query.clinicId));
    const clinic = await readClinicDocument(clinicId);
    const invoices = await readCollection('invoices').then((items) => items.filter((item) => sanitizeString(item.clinicId) === clinicId));

    const paymentMethodConfigured = Boolean(
      sanitizeString(clinic.paymentMethodLast4) ||
      sanitizeString(clinic.cardLast4) ||
      sanitizeString(clinic.paymentMethodBrand),
    );

    return res.json({
      clinic: {
        id: clinic.id,
        clinicName: sanitizeString(clinic.name),
        npiNumber: sanitizeString(clinic.npiNumber),
        email: sanitizeString(clinic.email),
        phone: sanitizeString(clinic.phone),
        address: sanitizeString(clinic.address),
        city: sanitizeString(clinic.city),
        state: sanitizeString(clinic.state),
        zip: sanitizeString(clinic.zip),
        specialties: sanitizeStringArray(clinic.specialties),
        isPublic: sanitizeBoolean(clinic.isPublic, true),
        acceptsNewPatients: sanitizeBoolean(clinic.acceptsNewPatients, true),
        notifyNewLeads: sanitizeBoolean(clinic.notifyNewLeads, true),
        notifyMessages: sanitizeBoolean(clinic.notifyMessages, true),
        notifySystem: sanitizeBoolean(clinic.notifySystem, false),
        status: sanitizeString(clinic.status) || 'pending',
        icpDefined: Boolean(clinic.icpDefined || sanitizeStringArray(clinic.specialties).length > 0),
        billingSetup: sanitizeBoolean(clinic.billingSetup, paymentMethodConfigured || invoices.length > 0),
        medicalDirectorVerified: sanitizeBoolean(clinic.medicalDirectorVerified, false),
        createdAt: toIso(clinic.createdAt),
      },
    });
  }),
);

router.put(
  '/profile',
  asyncHandler(async (req, res) => {
    const actor = await requireClinicActor(req);
    const clinicId = resolveClinicId(actor, sanitizeString(req.query.clinicId));
    const clinicRef = adminDb.collection('clinics').doc(clinicId);
    const clinicSnapshot = await clinicRef.get();
    if (!clinicSnapshot.exists) {
      throw new ClinicHttpError(404, 'Clinic record not found.');
    }

    const body = req.body && typeof req.body === 'object' ? (req.body as Record<string, unknown>) : {};
    const clinicName = sanitizeString(body.clinicName);
    const email = sanitizeString(body.email);
    const phone = sanitizeString(body.phone);
    const specialties = sanitizeStringArray(body.specialties).slice(0, 24);

    if (clinicName.length < 2) {
      throw new ClinicHttpError(400, 'Clinic name is required.');
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new ClinicHttpError(400, 'Email address is invalid.');
    }
    if (phone && phone.replace(/\D/g, '').length < 10) {
      throw new ClinicHttpError(400, 'Phone number is invalid.');
    }

    await clinicRef.set(
      {
        name: clinicName,
        npiNumber: sanitizeString(body.npiNumber),
        email,
        phone,
        address: sanitizeString(body.address),
        city: sanitizeString(body.city),
        state: sanitizeString(body.state),
        zip: sanitizeString(body.zip),
        specialties,
        isPublic: sanitizeBoolean(body.isPublic, true),
        acceptsNewPatients: sanitizeBoolean(body.acceptsNewPatients, true),
        notifyNewLeads: sanitizeBoolean(body.notifyNewLeads, true),
        notifyMessages: sanitizeBoolean(body.notifyMessages, true),
        notifySystem: sanitizeBoolean(body.notifySystem, false),
        icpDefined: specialties.length > 0,
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    );

    await createClinicAuditEvent({
      clinicId,
      action: 'Clinic profile updated',
      entityId: clinicId,
      entityName: clinicName,
      type: 'success',
      actorId: actor.uid,
    });

    return res.json({ success: true });
  }),
);

router.get(
  '/support',
  asyncHandler(async (req, res) => {
    const actor = await requireClinicActor(req);
    const clinicId = resolveClinicId(actor, sanitizeString(req.query.clinicId));
    const tickets = sortByDateDesc(
      await readCollection('supportTickets').then((items) => items.filter((item) => sanitizeString(item.clinicId) === clinicId)),
      (ticket) => ticket.updatedAt || ticket.createdAt,
    );

    return res.json({
      tickets: tickets.map((ticket) => ({
        id: ticket.id,
        subject: sanitizeString(ticket.subject) || 'Support request',
        description: sanitizeString(ticket.description),
        status: sanitizeString(ticket.status) || 'Open',
        priority: sanitizeString(ticket.priority) || 'Medium',
        createdAt: toIso(ticket.createdAt),
        updatedAt: toIso(ticket.updatedAt || ticket.createdAt),
      })),
      systemHealth: [
        { id: 'lead-routing', label: 'Lead Routing Engine', status: 'operational' },
        { id: 'clinic-api', label: 'Clinic API', status: 'operational' },
        { id: 'workforce-exchange', label: 'Workforce Exchange', status: 'operational' },
      ],
    });
  }),
);

router.post(
  '/support/tickets',
  asyncHandler(async (req, res) => {
    const actor = await requireClinicActor(req);
    const clinicId = resolveClinicId(actor, sanitizeString(req.query.clinicId));
    const body = req.body && typeof req.body === 'object' ? (req.body as Record<string, unknown>) : {};
    const subject = sanitizeString(body.subject);
    const description = sanitizeString(body.description);
    const priority = sanitizeString(body.priority) || 'Medium';

    if (subject.length < 4) {
      throw new ClinicHttpError(400, 'Ticket subject is required.');
    }
    if (description.length < 20) {
      throw new ClinicHttpError(400, 'Ticket description must be at least 20 characters.');
    }

    const now = new Date().toISOString();
    const ticketRef = await adminDb.collection('supportTickets').add({
      clinicId,
      subject,
      description,
      priority,
      status: 'Open',
      createdAt: now,
      updatedAt: now,
      createdBy: actor.uid,
    });

    await createClinicAuditEvent({
      clinicId,
      action: 'Support ticket submitted',
      entityId: ticketRef.id,
      entityName: subject,
      type: 'info',
      actorId: actor.uid,
    });

    await notifySubmission({
      category: 'support_request',
      title: 'Clinic support request submitted',
      entityType: 'supportTicket',
      entityId: ticketRef.id,
      summary: `${subject} was submitted from clinic ${clinicId} with ${priority} priority.`,
      route: '/api/clinic/support/tickets',
      adminPath: '/admin/command-center',
      emailFields: [
        { label: 'Ticket ID', value: ticketRef.id },
        { label: 'Clinic ID', value: clinicId },
        { label: 'Subject', value: subject },
        { label: 'Priority', value: priority },
        { label: 'Submitted By', value: actor.email || actor.name },
        { label: 'Description', value: description },
      ],
      slackFields: [
        { label: 'Ticket ID', value: ticketRef.id },
        { label: 'Clinic ID', value: clinicId },
        { label: 'Priority', value: priority },
        { label: 'Subject', value: subject },
      ],
      metadata: {
        clinicId,
        createdBy: actor.uid,
      },
    });

    return res.status(201).json({
      ticket: {
        id: ticketRef.id,
        subject,
        description,
        priority,
        status: 'Open',
        createdAt: now,
        updatedAt: now,
      },
    });
  }),
);

router.get(
  '/billing',
  asyncHandler(async (req, res) => {
    const actor = await requireClinicActor(req);
    const clinicId = resolveClinicId(actor, sanitizeString(req.query.clinicId));
    const [clinic, invoices, orders] = await Promise.all([
      readClinicDocument(clinicId),
      readCollection('invoices').then((items) => items.filter((item) => sanitizeString(item.clinicId) === clinicId)),
      readCollection('marketplaceOrders').then((items) => items.filter((item) => sanitizeString(item.clinicId) === clinicId)),
    ]);

    const totalInvoiced = invoices.reduce((sum, invoice) => sum + sanitizeNumber(invoice.amount), 0);
    const outstandingBalance = invoices
      .filter((invoice) => ['pending', 'overdue'].includes(sanitizeString(invoice.status).toLowerCase()))
      .reduce((sum, invoice) => sum + sanitizeNumber(invoice.amount), 0);
    const procurementSpend = orders.reduce((sum, order) => sum + sanitizeNumber(order.amount), 0);

    return res.json({
      clinic: {
        name: sanitizeString(clinic.name),
        address: sanitizeString(clinic.address),
        city: sanitizeString(clinic.city),
        state: sanitizeString(clinic.state),
        zip: sanitizeString(clinic.zip),
        npiNumber: sanitizeString(clinic.npiNumber),
      },
      plan: {
        name: sanitizeString(clinic.subscriptionPlanName),
        priceLabel: sanitizeString(clinic.subscriptionPrice),
        interval: sanitizeString(clinic.subscriptionPeriod),
        nextBillingDate: sanitizeString(clinic.nextBillingDate),
        status: sanitizeString(clinic.billingStatus) || (outstandingBalance > 0 ? 'Action required' : 'Active'),
        features: sanitizeStringArray(clinic.subscriptionFeatures),
      },
      paymentMethod: sanitizeString(clinic.paymentMethodLast4) || sanitizeString(clinic.cardLast4)
        ? {
            brand: sanitizeString(clinic.paymentMethodBrand) || sanitizeString(clinic.cardBrand),
            last4: sanitizeString(clinic.paymentMethodLast4) || sanitizeString(clinic.cardLast4),
            expMonth: sanitizeString(clinic.paymentMethodExpMonth),
            expYear: sanitizeString(clinic.paymentMethodExpYear),
          }
        : null,
      summary: {
        totalInvoiced,
        totalInvoicedLabel: formatCurrency(totalInvoiced),
        outstandingBalance,
        outstandingBalanceLabel: formatCurrency(outstandingBalance),
        procurementSpend,
        procurementSpendLabel: formatCurrency(procurementSpend),
      },
      invoices: sortByDateDesc(
        invoices.map((invoice) => ({
          id: invoice.id,
          amount: sanitizeNumber(invoice.amount),
          status: sanitizeString(invoice.status) || 'pending',
          dueDate: toIso(invoice.dueDate || invoice.createdAt),
          createdAt: toIso(invoice.createdAt),
          description: sanitizeString(invoice.description) || 'Novalyte subscription',
        })),
        (invoice) => invoice.createdAt,
      ),
    });
  }),
);

router.get(
  '/intelligence',
  asyncHandler(async (req, res) => {
    const actor = await requireClinicActor(req);
    const clinicId = resolveClinicId(actor, sanitizeString(req.query.clinicId));
    const [clinic, leads, bookings, invoices, insights] = await Promise.all([
      readClinicDocument(clinicId),
      readCollection('leads').then((items) => items.filter((item) => sanitizeString(item.clinicId) === clinicId)),
      readCollection('bookings').then((items) => items.filter((item) => sanitizeString(item.clinicId) === clinicId)),
      readCollection('invoices').then((items) => items.filter((item) => sanitizeString(item.clinicId) === clinicId)),
      readCollection('intelligenceInsights').then((items) => items.filter((item) => sanitizeString(item.clinicId) === clinicId)),
    ]);

    const qualifiedLeads = leads.filter((lead) => ['qualified', 'scheduled', 'treating'].includes(mapLeadStatus(lead.status))).length;
    const scheduledLeads = leads.filter((lead) => mapLeadStatus(lead.status) === 'scheduled').length;
    const activePatients = leads.filter((lead) => mapLeadStatus(lead.status) === 'treating').length;
    const bookedConsults = bookings.filter((booking) => sanitizeString(booking.status).toLowerCase() !== 'cancelled').length;
    const recognizedRevenue = invoices
      .filter((invoice) => sanitizeString(invoice.status).toLowerCase() === 'paid')
      .reduce((sum, invoice) => sum + sanitizeNumber(invoice.amount), 0);

    const sourceAnalysis = Array.from(
      leads.reduce((map, lead) => {
        const source = sanitizeString(lead.source) || 'Assessment';
        const current = map.get(source) || { source, volume: 0, converted: 0 };
        current.volume += 1;
        if (['qualified', 'scheduled', 'treating'].includes(mapLeadStatus(lead.status))) {
          current.converted += 1;
        }
        map.set(source, current);
        return map;
      }, new Map<string, { source: string; volume: number; converted: number }>()),
    ).map(([, value]) => ({
      source: value.source,
      volume: value.volume,
      conversion: value.volume > 0 ? Math.round((value.converted / value.volume) * 100) : 0,
    }));

    const treatmentMix = Array.from(
      leads.reduce((map, lead) => {
        const treatment = sanitizeString(lead.treatmentInterest) || 'General Optimization';
        map.set(treatment, (map.get(treatment) || 0) + 1);
        return map;
      }, new Map<string, number>()),
    ).map(([label, value]) => ({
      label,
      value,
    }));

    const metrics = {
      activePatients,
      qualifiedLeads,
      bookedConsults,
      recognizedRevenue,
      sourceCount: sourceAnalysis.length,
    };

    let summary =
      qualifiedLeads > 0
        ? `${qualifiedLeads} leads are currently qualified or beyond, and ${bookedConsults} consult bookings are on the clinic calendar.`
        : 'Live intelligence will improve as routed leads, bookings, and invoices accumulate.';

    try {
      const generated = await aiService.generateClinicInsights(
        {
          clinicName: sanitizeString(clinic.name),
          specialties: sanitizeStringArray(clinic.specialties),
        },
        metrics,
        typeof res.locals.requestId === 'string' ? res.locals.requestId : undefined,
      );
      summary = sanitizeString(generated.rationale) || summary;
    } catch (error) {
      console.error('Clinic intelligence summary fallback used:', error);
    }

    return res.json({
      summary,
      metrics: {
        activePatients,
        qualifiedLeads,
        scheduledLeads,
        bookedConsults,
        recognizedRevenue,
        recognizedRevenueLabel: formatCurrency(recognizedRevenue),
      },
      sourceAnalysis: sourceAnalysis.sort((left, right) => right.volume - left.volume),
      treatmentMix: treatmentMix.sort((left, right) => right.value - left.value),
      insights: sortByDateDesc(
        insights.map((insight) => ({
          id: insight.id,
          type: sanitizeString(insight.type) || 'efficiency',
          title: sanitizeString(insight.title) || 'Operational insight',
          description: sanitizeString(insight.description) || sanitizeString(insight.summary),
          action: sanitizeString(insight.action) || 'Open intelligence',
          impact: sanitizeString(insight.impact),
          createdAt: toIso(insight.createdAt || insight.updatedAt),
        })),
        (insight) => insight.createdAt,
      ),
    });
  }),
);

router.post(
  '/marketplace/orders',
  asyncHandler(async (req, res) => {
    const actor = await requireClinicActor(req);
    const clinicId = resolveClinicId(actor, sanitizeString(req.query.clinicId));
    const body = req.body && typeof req.body === 'object' ? (req.body as Record<string, unknown>) : {};
    const productId = sanitizeString(body.productId);

    if (!productId) {
      throw new ClinicHttpError(400, 'Product id is required.');
    }

    const [clinic, productSnapshot] = await Promise.all([
      readClinicDocument(clinicId),
      adminDb.collection('products').doc(productId).get(),
    ]);
    if (!productSnapshot.exists) {
      throw new ClinicHttpError(404, 'Marketplace product not found.');
    }

    const product = {
      id: productSnapshot.id,
      ...(productSnapshot.data() ?? {}),
    } as DocRecord;
    if (!isOrderableProduct(product)) {
      throw new ClinicHttpError(400, 'This marketplace product is not available for procurement.');
    }

    const now = new Date().toISOString();
    const orderRef = await adminDb.collection('marketplaceOrders').add({
      clinicId,
      clinicName: sanitizeString(clinic.name),
      productId,
      productName: sanitizeString(product.name) || 'Marketplace item',
      vendor: sanitizeString(product.vendor) || sanitizeString(product.brand) || 'Verified partner',
      category: sanitizeString(product.category) || sanitizeString(product.marketplaceCategory),
      amount: sanitizeNumber(product.price),
      priceLabel: sanitizeString(product.price),
      status: 'pending_review',
      createdAt: now,
      updatedAt: now,
      requestedBy: actor.uid,
    });

    await createClinicAuditEvent({
      clinicId,
      action: 'Marketplace procurement requested',
      entityId: orderRef.id,
      entityName: sanitizeString(product.name) || productId,
      type: 'success',
      actorId: actor.uid,
    });

    return res.status(201).json({
      order: {
        id: orderRef.id,
        productId,
        productName: sanitizeString(product.name) || 'Marketplace item',
        vendor: sanitizeString(product.vendor) || sanitizeString(product.brand) || 'Verified partner',
        status: 'pending_review',
        createdAt: now,
      },
    });
  }),
);

export default router;
