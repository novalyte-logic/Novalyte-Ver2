export type AdminPermission =
  | 'admin.read'
  | 'admin.audit.read'
  | 'admin.crm.read'
  | 'admin.crm.write'
  | 'admin.outreach.read'
  | 'admin.outreach.write'
  | 'admin.directory.read'
  | 'admin.directory.write'
  | 'admin.launch.read'
  | 'admin.launch.control'
  | 'admin.mcp.read'
  | 'admin.mcp.control'
  | 'admin.revenue.read'
  | 'admin.workforce.read';

export type AlertSeverity = 'info' | 'success' | 'warning' | 'critical';
export type TrendDirection = 'up' | 'down' | 'neutral';
export type MetricTone = 'primary' | 'secondary' | 'success' | 'warning' | 'danger';

export interface AdminSession {
  uid: string;
  email: string;
  name: string;
  role: string;
  permissions: AdminPermission[];
  lastVerifiedAt: string;
}

export interface AdminMetricCard {
  id: string;
  label: string;
  value: number;
  formattedValue: string;
  trend: string;
  direction: TrendDirection;
  tone: MetricTone;
  href?: string;
}

export interface OperatorAlert {
  id: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  timestamp: string;
  actionLabel?: string;
  actionPath?: string;
}

export interface OperatorFeedEvent {
  id: string;
  title: string;
  entityType: string;
  entityId: string;
  source: string;
  status: string;
  timestamp: string;
  path?: string;
}

export interface CommandCenterPipelineMetric {
  id: string;
  label: string;
  value: number;
  formattedValue: string;
  tone: MetricTone;
}

export interface RevenueChannelMetric {
  id: string;
  label: string;
  amount: number;
  formattedAmount: string;
  sharePercent: number;
}

export interface WorkforceOverviewItem {
  id: string;
  clinicName: string;
  role: string;
  candidates: number;
  status: string;
  path: string;
}

export interface EntityOverviewCard {
  id: string;
  label: string;
  count: number;
  formattedCount: string;
  description: string;
  path: string;
}

export interface CommandCenterResponse {
  session: AdminSession;
  metrics: AdminMetricCard[];
  alerts: OperatorAlert[];
  feed: OperatorFeedEvent[];
  pipelineHealth: CommandCenterPipelineMetric[];
  revenueChannels: RevenueChannelMetric[];
  workforce: WorkforceOverviewItem[];
  entities: EntityOverviewCard[];
}

export type CrmLeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Nurture' | 'Lost';

export interface LeadNote {
  id: string;
  text: string;
  createdAt: string;
  createdBy: string;
}

export interface CrmLeadRecord {
  id: string;
  patientId?: string;
  clinicId?: string;
  clinicName?: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  intent: string;
  score: number;
  status: CrmLeadStatus;
  source: string;
  estimatedValue: number;
  formattedEstimatedValue: string;
  tags: string[];
  notes: LeadNote[];
  createdAt: string;
  updatedAt: string;
  lastQueuedCampaignId?: string;
  lastQueuedCampaignName?: string;
  lastQueuedAt?: string;
}

export interface CrmSummary {
  totalLeads30d: number;
  qualificationRate: number;
  avgRoutingMinutes: number;
  pipelineValue: number;
  formattedPipelineValue: string;
}

export interface CrmCampaignOption {
  id: string;
  name: string;
  status: string;
  channel: OutreachChannel;
}

export interface CrmResponse {
  session: AdminSession;
  summary: CrmSummary;
  leads: CrmLeadRecord[];
  campaigns: CrmCampaignOption[];
}

export type OutreachChannel = 'Email' | 'SMS' | 'Email + SMS';
export type OutreachCampaignStatus = 'Draft' | 'Queued' | 'Active' | 'Paused' | 'Completed';
export type OutreachQueueState = 'pending' | 'review' | 'ready' | 'sending' | 'sent' | 'failed' | 'paused';
export type PersonalizationState = 'drafted' | 'review_required' | 'missing_data' | 'sent';

export interface OutreachCampaignRecord {
  id: string;
  name: string;
  audience: string;
  channel: OutreachChannel;
  status: OutreachCampaignStatus;
  objective: string;
  sentCount: number;
  openRate: number;
  replyRate: number;
  bounceRate: number;
  qualifiedCount: number;
  pendingCount: number;
  nextSendAt?: string;
  lastSentAt?: string;
  crmFeedback: string;
}

export interface OutreachQueueRecord {
  id: string;
  campaignId: string;
  campaignName: string;
  leadId?: string;
  recipientType: 'lead' | 'clinic' | 'vendor' | 'practitioner';
  recipientId: string;
  recipientName: string;
  recipientEmail?: string;
  recipientPhone?: string;
  channel: OutreachChannel;
  state: OutreachQueueState;
  personalizationStatus: PersonalizationState;
  scheduledFor: string;
  intent: string;
  draftPreview: string;
  messageId?: string;
  sentAt?: string;
  feedbackStatus?: string;
}

export interface SenderAccountRecord {
  id: string;
  email: string;
  provider: string;
  healthScore: number;
  dailySent: number;
  dailyLimit: number;
  status: 'Healthy' | 'Warning' | 'Paused' | 'Warming Up';
}

export interface OutreachReportPoint {
  label: string;
  sent: number;
  opened: number;
  replied: number;
  qualified: number;
}

export interface OutreachSummary {
  dailySendVolume: number;
  sendLimit: number;
  senderHealthScore: number;
  bounceRate: number;
  avgOpenRate: number;
  crmConversionRate: number;
  pendingQueueCount: number;
}

export interface OutreachResponse {
  session: AdminSession;
  summary: OutreachSummary;
  campaigns: OutreachCampaignRecord[];
  queue: OutreachQueueRecord[];
  accounts: SenderAccountRecord[];
  reports: OutreachReportPoint[];
}

export type DirectoryClinicStatus = 'Verified' | 'Pending Review' | 'Suspended';
export type DirectoryRelationshipStatus = 'Active' | 'Nurture' | 'Churn Risk' | 'Onboarding';

export interface DirectoryClinicRecord {
  id: string;
  name: string;
  location: string;
  status: DirectoryClinicStatus;
  outreachStatus: DirectoryRelationshipStatus;
  rating: number;
  leads: number;
  revenue: number;
  formattedRevenue: string;
  joined: string;
  lastContact: string;
  tags: string[];
  internalNote: string;
  ownerEmail?: string;
}

export interface DirectorySummary {
  totalNetworkNodes: number;
  verifiedPartners: number;
  pendingPartners: number;
  totalLeadsRouted: number;
  networkRevenue: number;
  formattedNetworkRevenue: string;
}

export interface DirectoryResponse {
  session: AdminSession;
  summary: DirectorySummary;
  clinics: DirectoryClinicRecord[];
}

export interface LaunchMetric {
  id: string;
  label: string;
  value: number;
  formattedValue: string;
  target: number;
}

export interface LaunchMilestone {
  id: string;
  phase: string;
  description: string;
  status: 'completed' | 'active' | 'pending';
  timestamp: string;
}

export interface LaunchCampaignSnapshot {
  id: string;
  name: string;
  channel: OutreachChannel;
  sent: number;
  openRate: number;
  clickRate: number;
  status: OutreachCampaignStatus;
}

export interface LaunchHealthStat {
  id: string;
  label: string;
  value: number;
  formattedValue: string;
  tone: MetricTone;
}

export interface LaunchResponse {
  session: AdminSession;
  isLive: boolean;
  phase: string;
  startedAt: string;
  elapsedSeconds: number;
  metrics: LaunchMetric[];
  milestones: LaunchMilestone[];
  campaigns: LaunchCampaignSnapshot[];
  health: LaunchHealthStat[];
  alerts: string[];
}

export interface McpServiceRecord {
  id: string;
  name: string;
  status: string;
  latencyMs?: number;
  loadPercent: number;
  tone: MetricTone;
}

export interface McpQueueRecord {
  id: string;
  name: string;
  pending: number;
  inProgress: number;
  failed: number;
  status: string;
}

export interface McpEventRecord {
  id: string;
  timestamp: string;
  service: string;
  type: string;
  details: string;
  severity: AlertSeverity;
  status: string;
}

export interface McpResponse {
  session: AdminSession;
  isLive: boolean;
  orchestratorVersion: string;
  services: McpServiceRecord[];
  queues: McpQueueRecord[];
  events: McpEventRecord[];
  logs: string[];
}

export interface AdminSessionResponse {
  session: AdminSession;
}
