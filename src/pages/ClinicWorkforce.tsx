import React from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  Bell,
  Briefcase,
  Calendar,
  ChevronRight,
  Clock,
  DollarSign,
  MapPin,
  Plus,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { applicationStatusClasses, formatApplicationStatus, formatRelativeDate, nextInterviewForApplication, requestStatusClasses } from '@/src/lib/workforce/ui';
import type {
  ClinicDashboardData,
  EmploymentType,
  PractitionerRole,
  RequestUrgency,
  StaffingRequestInput,
  WorkMode,
  WorkforceApplication,
  WorkforceInterviewInput,
  WorkforceOfferInput,
} from '@/src/lib/workforce/types';
import { WorkforceApiError, WorkforceService } from '@/src/services/workforce';

type ClinicTab = 'demand' | 'requisitions' | 'pipeline' | 'notifications';

const ROLE_OPTIONS: PractitionerRole[] = [
  'Medical Director (MD/DO)',
  'Nurse Practitioner (NP)',
  'Physician Assistant (PA)',
  'Registered Nurse (RN)',
  'Medical Assistant',
  'Other',
];

const EMPLOYMENT_OPTIONS: EmploymentType[] = [
  'Full-time',
  'Part-time',
  'Contract',
  'Per Diem',
  'Telehealth Only',
];

const WORK_MODE_OPTIONS: WorkMode[] = ['Onsite', 'Hybrid', 'Remote'];
const URGENCY_OPTIONS: RequestUrgency[] = ['Low', 'Medium', 'High', 'Critical'];
const PROTOCOL_OPTIONS = [
  'TRT / HRT',
  'Peptide Therapy',
  'Weight Loss (GLP-1)',
  'IV Therapy',
  'Longevity Medicine',
  'Telehealth Intake',
  'Aesthetics',
  'Phlebotomy',
];

const DEFAULT_REQUEST_FORM: StaffingRequestInput = {
  title: '',
  role: 'Nurse Practitioner (NP)',
  employmentType: 'Full-time',
  workMode: 'Remote',
  city: '',
  state: '',
  compensation: '',
  minimumYearsExperience: 2,
  requiredLicenseStates: [],
  requiredProtocols: [],
  description: '',
  urgency: 'Medium',
  openings: 1,
  status: 'open',
};

const DEFAULT_INTERVIEW_FORM = {
  scheduledAt: '',
  durationMinutes: 45,
  mode: 'video' as const,
  location: 'Zoom',
  meetingLink: '',
  notes: '',
};

const DEFAULT_OFFER_FORM = {
  compensation: '',
  startDate: '',
  expiresAt: '',
  notes: '',
};

const ToggleChip: React.FC<{
  active: boolean;
  label: string;
  onClick: () => void;
}> = ({
  active,
  label,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
        active
          ? 'border-primary/30 bg-primary/10 text-primary'
          : 'border-surface-3 bg-surface-2 text-text-secondary hover:text-white'
      }`}
    >
      {label}
    </button>
  );
};

function pipelineGroup(status: WorkforceApplication['status']) {
  if (status === 'offer_accepted') return 'hired';
  if (status === 'offer_extended') return 'offers';
  if (status === 'interview_scheduled' || status === 'interview_completed') {
    return 'interviewing';
  }
  if (status === 'rejected' || status === 'withdrawn' || status === 'offer_declined') {
    return 'archived';
  }
  return 'screening';
}

function parseClinicTab(value: string | null): ClinicTab {
  return ['demand', 'requisitions', 'pipeline', 'notifications'].includes(value || '')
    ? (value as ClinicTab)
    : 'demand';
}

export function ClinicWorkforce() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = React.useState<ClinicTab>(
    parseClinicTab(searchParams.get('tab')),
  );
  const [dashboard, setDashboard] = React.useState<ClinicDashboardData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [requestForm, setRequestForm] = React.useState(DEFAULT_REQUEST_FORM);
  const [creatingRequest, setCreatingRequest] = React.useState(false);
  const [activeInterviewApplicationId, setActiveInterviewApplicationId] = React.useState<string | null>(null);
  const [interviewForm, setInterviewForm] = React.useState(DEFAULT_INTERVIEW_FORM);
  const [submittingInterview, setSubmittingInterview] = React.useState(false);
  const [activeOfferApplicationId, setActiveOfferApplicationId] = React.useState<string | null>(null);
  const [offerForm, setOfferForm] = React.useState(DEFAULT_OFFER_FORM);
  const [submittingOffer, setSubmittingOffer] = React.useState(false);
  const [updatingApplicationId, setUpdatingApplicationId] = React.useState<string | null>(null);
  const [updatingNotificationId, setUpdatingNotificationId] = React.useState<string | null>(null);
  const requestIdFilter = searchParams.get('requestId') || '';

  const loadDashboard = React.useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const liveDashboard = await WorkforceService.getClinicDashboard();
      setDashboard(liveDashboard);
    } catch (loadError) {
      console.error('Failed to load clinic workforce dashboard:', loadError);
      setError(
        loadError instanceof WorkforceApiError
          ? loadError.message
          : 'Failed to load clinic staffing operations.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  React.useEffect(() => {
    const urlTab = parseClinicTab(searchParams.get('tab'));
    if (urlTab !== activeTab) {
      setActiveTab(urlTab);
    }
  }, [activeTab, searchParams]);

  const handleTabChange = React.useCallback((tab: ClinicTab, requestId?: string | null) => {
    setActiveTab(tab);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('tab', tab);
    if (tab === 'pipeline' && requestId) {
      nextParams.set('requestId', requestId);
    } else if (requestId === null || tab !== 'pipeline') {
      nextParams.delete('requestId');
    }
    setSearchParams(nextParams, { replace: true });
  }, [searchParams, setSearchParams]);

  const handleRequestSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setCreatingRequest(true);
      setError('');
      await WorkforceService.createStaffingRequest(requestForm);
      setRequestForm(DEFAULT_REQUEST_FORM);
      handleTabChange('requisitions');
      await loadDashboard();
    } catch (requestError) {
      console.error('Failed to create staffing request:', requestError);
      setError(
        requestError instanceof WorkforceApiError
          ? requestError.message
          : 'Failed to create staffing request.',
      );
    } finally {
      setCreatingRequest(false);
    }
  };

  const handleApplicationStatus = async (
    applicationId: string,
    status: WorkforceApplication['status'],
  ) => {
    try {
      setUpdatingApplicationId(applicationId);
      setError('');
      await WorkforceService.updateApplicationStatus(applicationId, status);
      await loadDashboard();
    } catch (statusError) {
      console.error('Failed to update application status:', statusError);
      setError(
        statusError instanceof WorkforceApiError
          ? statusError.message
          : 'Failed to update application status.',
      );
    } finally {
      setUpdatingApplicationId(null);
    }
  };

  const handleInterviewSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activeInterviewApplicationId) {
      return;
    }

    try {
      setSubmittingInterview(true);
      const payload: WorkforceInterviewInput = {
        applicationId: activeInterviewApplicationId,
        scheduledAt: new Date(interviewForm.scheduledAt).toISOString(),
        durationMinutes: interviewForm.durationMinutes,
        mode: interviewForm.mode,
        location: interviewForm.location,
        meetingLink: interviewForm.meetingLink,
        notes: interviewForm.notes,
      };
      await WorkforceService.createInterview(payload);
      setActiveInterviewApplicationId(null);
      setInterviewForm(DEFAULT_INTERVIEW_FORM);
      await loadDashboard();
    } catch (interviewError) {
      console.error('Failed to schedule interview:', interviewError);
      setError(
        interviewError instanceof WorkforceApiError
          ? interviewError.message
          : 'Failed to schedule interview.',
      );
    } finally {
      setSubmittingInterview(false);
    }
  };

  const handleOfferSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activeOfferApplicationId) {
      return;
    }

    try {
      setSubmittingOffer(true);
      const payload: WorkforceOfferInput = {
        applicationId: activeOfferApplicationId,
        compensation: offerForm.compensation,
        startDate: offerForm.startDate,
        expiresAt: offerForm.expiresAt,
        notes: offerForm.notes,
      };
      await WorkforceService.createOffer(payload);
      setActiveOfferApplicationId(null);
      setOfferForm(DEFAULT_OFFER_FORM);
      await loadDashboard();
    } catch (offerError) {
      console.error('Failed to create offer:', offerError);
      setError(
        offerError instanceof WorkforceApiError
          ? offerError.message
          : 'Failed to create offer.',
      );
    } finally {
      setSubmittingOffer(false);
    }
  };

  const handleNotificationRead = async (notificationId: string) => {
    try {
      setUpdatingNotificationId(notificationId);
      await WorkforceService.markNotificationRead(notificationId);
      await loadDashboard();
    } catch (notificationError) {
      console.error('Failed to mark clinic notification as read:', notificationError);
      setError(
        notificationError instanceof WorkforceApiError
          ? notificationError.message
          : 'Failed to update notification.',
      );
    } finally {
      setUpdatingNotificationId(null);
    }
  };

  const handleOpenNotification = async (
    notificationId: string,
    link?: string,
    status?: 'unread' | 'read',
  ) => {
    try {
      setUpdatingNotificationId(notificationId);
      if (status === 'unread') {
        await WorkforceService.markNotificationRead(notificationId);
      }
      await loadDashboard();
      navigate(link || '/dashboard/workforce');
    } catch (notificationError) {
      console.error('Failed to open clinic notification workflow:', notificationError);
      setError(
        notificationError instanceof WorkforceApiError
          ? notificationError.message
          : 'Failed to open notification workflow.',
      );
    } finally {
      setUpdatingNotificationId(null);
    }
  };

  const pipelineApplications = dashboard?.applications.filter(
    (application) => !requestIdFilter || application.requestId === requestIdFilter,
  ) || [];
  const screeningApplications = pipelineApplications.filter(
    (application) => pipelineGroup(application.status) === 'screening',
  );
  const interviewingApplications = pipelineApplications.filter(
    (application) => pipelineGroup(application.status) === 'interviewing',
  );
  const offerApplications = pipelineApplications.filter(
    (application) => pipelineGroup(application.status) === 'offers',
  );
  const hiredApplications = pipelineApplications.filter(
    (application) => pipelineGroup(application.status) === 'hired',
  );
  const activeRequest = dashboard?.requests.find((request) => request.id === requestIdFilter) || null;
  const unreadNotifications = dashboard?.notifications.filter((notification) => notification.status === 'unread').length || 0;
  const candidateBrowseRequestId = requestIdFilter || dashboard?.requests[0]?.id || '';

  return (
    <div className="min-h-screen bg-[#05070A] pb-10">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-primary font-bold">
              <Sparkles className="w-4 h-4" />
              Workforce operations
            </div>
            <h1 className="mt-5 text-4xl font-display font-bold text-white">Clinic staffing exchange</h1>
            <p className="mt-3 text-text-secondary max-w-3xl leading-7">
              Manage live staffing demand, candidate pipeline state, interview scheduling, offers, and practitioner notifications from one workflow surface.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to={`/workforce/jobs?mode=clinic${candidateBrowseRequestId ? `&requestId=${candidateBrowseRequestId}` : ''}`}>
              <Button variant="outline" className="w-full border-surface-3 text-white hover:bg-surface-2">
                <Search className="w-4 h-4 mr-2" />
                Browse Candidates
              </Button>
            </Link>
            <Button onClick={() => handleTabChange('demand')} className="w-full bg-primary hover:bg-primary/90 text-black font-semibold">
              <Plus className="w-4 h-4 mr-2" />
              New Requisition
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
          <Card className="p-5 bg-[#0B0F14] border-surface-3">
            <p className="text-xs uppercase tracking-wider text-text-secondary">Open requests</p>
            <p className="mt-3 text-3xl font-display font-bold text-white">
              {dashboard?.requests.filter((request) => request.status !== 'filled' && request.status !== 'closed').length || 0}
            </p>
          </Card>
          <Card className="p-5 bg-[#0B0F14] border-surface-3">
            <p className="text-xs uppercase tracking-wider text-text-secondary">Candidates</p>
            <p className="mt-3 text-3xl font-display font-bold text-white">{dashboard?.applications.length || 0}</p>
          </Card>
          <Card className="p-5 bg-[#0B0F14] border-surface-3">
            <p className="text-xs uppercase tracking-wider text-text-secondary">Upcoming interviews</p>
            <p className="mt-3 text-3xl font-display font-bold text-white">
              {dashboard?.interviews.filter((interview) => interview.status === 'scheduled').length || 0}
            </p>
          </Card>
          <Card className="p-5 bg-[#0B0F14] border-surface-3">
            <p className="text-xs uppercase tracking-wider text-text-secondary">Active offers</p>
            <p className="mt-3 text-3xl font-display font-bold text-white">
              {dashboard?.offers.filter((offer) => offer.status === 'extended').length || 0}
            </p>
          </Card>
          <Card className="p-5 bg-[#0B0F14] border-surface-3">
            <p className="text-xs uppercase tracking-wider text-text-secondary">Unread alerts</p>
            <p className="mt-3 text-3xl font-display font-bold text-white">{unreadNotifications}</p>
          </Card>
        </div>

        <div className="flex gap-6 border-b border-surface-3">
          {[
            { id: 'demand', label: 'Demand & Requisition Builder', icon: Activity },
            { id: 'requisitions', label: 'Active Requisitions', icon: Briefcase },
            { id: 'pipeline', label: 'Candidate Pipeline', icon: Users },
            { id: 'notifications', label: 'Notifications', icon: Bell },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id as ClinicTab)}
              className={`pb-4 text-sm font-bold transition-colors border-b-2 flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-secondary hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <Card className="p-10 bg-surface-1 border-surface-3 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </Card>
        ) : null}

        {!loading && error ? (
          <Card className="p-6 bg-danger/10 border-danger/20 text-danger">{error}</Card>
        ) : null}

        {!loading && dashboard && activeTab === 'demand' ? (
          <div className="grid grid-cols-1 xl:grid-cols-[0.9fr_1.1fr] gap-8">
            <Card className="p-8 bg-[#0B0F14] border-primary/30">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-white uppercase tracking-wider">Operational forecast</h2>
              </div>
              <p className="text-2xl font-display font-bold text-white leading-tight">
                {dashboard.requests.length
                  ? `You have ${dashboard.requests.length} live requisition${dashboard.requests.length === 1 ? '' : 's'} with ${dashboard.applications.length} candidates currently moving through screening, interviews, and offers.`
                  : 'No live requisitions yet. Launch a staffing request to start building candidate flow.'}
              </p>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-surface-2/70 border border-surface-3 p-4">
                  <p className="text-xs uppercase tracking-wider text-text-secondary">Interview load</p>
                  <p className="mt-2 text-2xl font-display font-bold text-white">
                    {dashboard.interviews.filter((interview) => interview.status === 'scheduled').length}
                  </p>
                </div>
                <div className="rounded-2xl bg-surface-2/70 border border-surface-3 p-4">
                  <p className="text-xs uppercase tracking-wider text-text-secondary">Offer conversion</p>
                  <p className="mt-2 text-2xl font-display font-bold text-white">
                    {dashboard.offers.filter((offer) => offer.status === 'accepted').length}
                  </p>
                </div>
              </div>
              <div className="mt-6 rounded-2xl border border-warning/20 bg-warning/10 p-4 text-warning text-sm leading-7">
                Live notifications, candidate pipeline stages, and match scoring update automatically from the same backend documents powering practitioner dashboards.
              </div>
            </Card>

            <Card className="p-8 bg-surface-1 border-surface-3">
              <h2 className="text-2xl font-display font-bold text-white mb-6">Open a staffing request</h2>
              <form onSubmit={handleRequestSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="space-y-2 md:col-span-2">
                    <span className="text-sm font-medium text-text-secondary">Title</span>
                    <input
                      value={requestForm.title}
                      onChange={(event) => setRequestForm((current) => ({ ...current, title: event.target.value }))}
                      placeholder="Telehealth NP for TRT follow-up queue"
                      className="w-full rounded-xl border border-surface-3 bg-[#0B0F14] px-4 py-3 text-white outline-none focus:border-primary/40"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-text-secondary">Role</span>
                    <select
                      value={requestForm.role}
                      onChange={(event) => setRequestForm((current) => ({ ...current, role: event.target.value as PractitionerRole }))}
                      className="w-full rounded-xl border border-surface-3 bg-[#0B0F14] px-4 py-3 text-white outline-none focus:border-primary/40"
                    >
                      {ROLE_OPTIONS.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-text-secondary">Employment type</span>
                    <select
                      value={requestForm.employmentType}
                      onChange={(event) => setRequestForm((current) => ({ ...current, employmentType: event.target.value as EmploymentType }))}
                      className="w-full rounded-xl border border-surface-3 bg-[#0B0F14] px-4 py-3 text-white outline-none focus:border-primary/40"
                    >
                      {EMPLOYMENT_OPTIONS.map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-text-secondary">Work mode</span>
                    <select
                      value={requestForm.workMode}
                      onChange={(event) => setRequestForm((current) => ({ ...current, workMode: event.target.value as WorkMode }))}
                      className="w-full rounded-xl border border-surface-3 bg-[#0B0F14] px-4 py-3 text-white outline-none focus:border-primary/40"
                    >
                      {WORK_MODE_OPTIONS.map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-text-secondary">Urgency</span>
                    <select
                      value={requestForm.urgency}
                      onChange={(event) => setRequestForm((current) => ({ ...current, urgency: event.target.value as RequestUrgency }))}
                      className="w-full rounded-xl border border-surface-3 bg-[#0B0F14] px-4 py-3 text-white outline-none focus:border-primary/40"
                    >
                      {URGENCY_OPTIONS.map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-text-secondary">City</span>
                    <input
                      value={requestForm.city}
                      onChange={(event) => setRequestForm((current) => ({ ...current, city: event.target.value }))}
                      className="w-full rounded-xl border border-surface-3 bg-[#0B0F14] px-4 py-3 text-white outline-none focus:border-primary/40"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-text-secondary">State</span>
                    <input
                      value={requestForm.state}
                      onChange={(event) => setRequestForm((current) => ({ ...current, state: event.target.value }))}
                      className="w-full rounded-xl border border-surface-3 bg-[#0B0F14] px-4 py-3 text-white outline-none focus:border-primary/40"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-text-secondary">Compensation</span>
                    <input
                      value={requestForm.compensation}
                      onChange={(event) => setRequestForm((current) => ({ ...current, compensation: event.target.value }))}
                      placeholder="$130k - $155k / yr"
                      className="w-full rounded-xl border border-surface-3 bg-[#0B0F14] px-4 py-3 text-white outline-none focus:border-primary/40"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-text-secondary">Minimum years experience</span>
                    <input
                      type="number"
                      min={0}
                      value={requestForm.minimumYearsExperience}
                      onChange={(event) => setRequestForm((current) => ({ ...current, minimumYearsExperience: Number(event.target.value) }))}
                      className="w-full rounded-xl border border-surface-3 bg-[#0B0F14] px-4 py-3 text-white outline-none focus:border-primary/40"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-text-secondary">Openings</span>
                    <input
                      type="number"
                      min={1}
                      value={requestForm.openings}
                      onChange={(event) => setRequestForm((current) => ({ ...current, openings: Number(event.target.value) }))}
                      className="w-full rounded-xl border border-surface-3 bg-[#0B0F14] px-4 py-3 text-white outline-none focus:border-primary/40"
                    />
                  </label>
                </div>

                <div>
                  <span className="text-sm font-medium text-text-secondary">Required protocols</span>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {PROTOCOL_OPTIONS.map((protocol) => (
                      <ToggleChip
                        key={protocol}
                        active={requestForm.requiredProtocols.includes(protocol)}
                        label={protocol}
                        onClick={() =>
                          setRequestForm((current) => ({
                            ...current,
                            requiredProtocols: current.requiredProtocols.includes(protocol)
                              ? current.requiredProtocols.filter((entry) => entry !== protocol)
                              : [...current.requiredProtocols, protocol],
                          }))
                        }
                      />
                    ))}
                  </div>
                </div>

                <label className="space-y-2 block">
                  <span className="text-sm font-medium text-text-secondary">Required license states</span>
                  <input
                    value={requestForm.requiredLicenseStates.join(', ')}
                    onChange={(event) =>
                      setRequestForm((current) => ({
                        ...current,
                        requiredLicenseStates: event.target.value.split(',').map((entry) => entry.trim()).filter(Boolean),
                      }))
                    }
                    placeholder="TX, FL"
                    className="w-full rounded-xl border border-surface-3 bg-[#0B0F14] px-4 py-3 text-white outline-none focus:border-primary/40"
                  />
                </label>

                <label className="space-y-2 block">
                  <span className="text-sm font-medium text-text-secondary">Description</span>
                  <textarea
                    rows={5}
                    value={requestForm.description}
                    onChange={(event) => setRequestForm((current) => ({ ...current, description: event.target.value }))}
                    placeholder="Describe patient volume, protocols, shift structure, clinical expectations, and timeline."
                    className="w-full rounded-2xl border border-surface-3 bg-[#0B0F14] px-4 py-3 text-white outline-none focus:border-primary/40"
                  />
                </label>

                <Button type="submit" className="bg-primary hover:bg-primary/90 text-black font-semibold" disabled={creatingRequest}>
                  {creatingRequest ? 'Opening requisition...' : 'Create Staffing Request'}
                  <Plus className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </Card>
          </div>
        ) : null}

        {!loading && dashboard && activeTab === 'requisitions' ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {dashboard.requests.length ? dashboard.requests.map((request) => (
              <Card key={request.id} className="p-6 bg-[#0B0F14] border-surface-3 hover:border-surface-4 transition-colors flex flex-col h-full">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{request.title}</h3>
                    <p className="text-text-secondary mt-1">{request.role}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full border text-[10px] uppercase tracking-wider font-bold ${requestStatusClasses(request.status)}`}>
                    {request.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-text-secondary">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {request.location.label}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4" />
                    {request.compensation}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    {request.urgency}
                  </span>
                </div>

                <p className="mt-5 text-sm text-text-secondary leading-7 flex-grow">{request.description}</p>

                <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
                  <div className="rounded-2xl bg-surface-2/70 border border-surface-3 p-3">
                    <p className="text-text-secondary">Applications</p>
                    <p className="mt-2 font-semibold text-white">{request.applicationCount}</p>
                  </div>
                  <div className="rounded-2xl bg-surface-2/70 border border-surface-3 p-3">
                    <p className="text-text-secondary">Matches</p>
                    <p className="mt-2 font-semibold text-white">{request.matchCount}</p>
                  </div>
                  <div className="rounded-2xl bg-surface-2/70 border border-surface-3 p-3">
                    <p className="text-text-secondary">Updated</p>
                    <p className="mt-2 font-semibold text-white">{formatRelativeDate(request.updatedAt)}</p>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <Link to={`/workforce/jobs?mode=clinic&requestId=${request.id}`} className="flex-1">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-black font-semibold">
                      Browse Matches
                    </Button>
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleTabChange('pipeline', request.id)}
                    className="flex-1"
                  >
                    <Button variant="outline" className="w-full border-surface-3 text-white hover:bg-surface-2">
                      View Pipeline
                    </Button>
                  </button>
                </div>
              </Card>
            )) : (
              <Card className="p-10 bg-[#0B0F14] border-surface-3 text-center xl:col-span-2">
                <h3 className="text-xl font-bold text-white">No requisitions yet</h3>
                <p className="mt-3 text-text-secondary">
                  Open your first staffing request to activate candidate matching and clinic-side workflow tracking.
                </p>
                <div className="mt-6">
                  <Button onClick={() => handleTabChange('demand')} className="bg-primary hover:bg-primary/90 text-black font-semibold">
                    Build Requisition
                  </Button>
                </div>
              </Card>
            )}
          </div>
        ) : null}

        {!loading && dashboard && activeTab === 'pipeline' ? (
          <div className="space-y-8">
            {activeRequest ? (
              <Card className="p-5 bg-primary/5 border-primary/20">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-primary font-bold">Pipeline filtered to requisition</p>
                    <p className="mt-2 text-white font-semibold">{activeRequest.title}</p>
                    <p className="mt-1 text-sm text-text-secondary">
                      Candidate stages and notifications are scoped to this staffing request until you clear the filter.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Link to={`/workforce/jobs?mode=clinic&requestId=${activeRequest.id}`}>
                      <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary/10">
                        Browse Matches
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="border-surface-3 text-white hover:bg-surface-2"
                      onClick={() => handleTabChange('pipeline', null)}
                    >
                      Clear Filter
                    </Button>
                  </div>
                </div>
              </Card>
            ) : null}

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {[
                { label: 'Screening', items: screeningApplications, color: 'text-warning' },
                { label: 'Interviewing', items: interviewingApplications, color: 'text-secondary' },
                { label: 'Offers', items: offerApplications, color: 'text-primary' },
                { label: 'Hired', items: hiredApplications, color: 'text-success' },
              ].map((group) => (
                <Card key={group.label} className="p-5 bg-[#0B0F14] border-surface-3">
                  <p className={`text-xs uppercase tracking-[0.24em] font-bold ${group.color}`}>{group.label}</p>
                  <p className="mt-3 text-3xl font-display font-bold text-white">{group.items.length}</p>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {[screeningApplications, interviewingApplications, offerApplications].map((applications, index) => {
                const titles = ['Screening', 'Interviewing', 'Offer Stage'] as const;
                return (
                  <div key={titles[index]} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold text-white">{titles[index]}</h2>
                      <span className="text-xs font-mono text-text-secondary bg-surface-2 border border-surface-3 px-2 py-1 rounded">
                        {applications.length}
                      </span>
                    </div>

                    {applications.length ? applications.map((application) => {
                      const interview = nextInterviewForApplication(application.id, dashboard.interviews);
                      return (
                        <Card key={application.id} className="p-5 bg-[#0B0F14] border-surface-3">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="font-bold text-white">{application.practitionerName}</h3>
                              <p className="text-sm text-text-secondary mt-1">{application.practitionerRole}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full border text-[10px] uppercase tracking-wider font-bold ${applicationStatusClasses(application.status)}`}>
                              {formatApplicationStatus(application.status)}
                            </span>
                          </div>

                          <div className="mt-4 space-y-2 text-sm text-text-secondary">
                            <div className="flex items-center gap-2">
                              <ShieldCheck className="w-4 h-4" />
                              Match {application.match.score}%
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {application.practitionerLocation}
                            </div>
                            {interview ? (
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {new Date(interview.scheduledAt).toLocaleString()}
                              </div>
                            ) : null}
                          </div>

                          <div className="mt-5 flex flex-wrap gap-2">
                            <Link to={`/workforce/candidate/${application.practitionerId}`}>
                              <Button variant="outline" size="sm" className="border-surface-3 text-white hover:bg-surface-2">
                                View Profile
                              </Button>
                            </Link>

                            {pipelineGroup(application.status) === 'screening' ? (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-surface-3 text-white hover:bg-surface-2"
                                  onClick={() => handleApplicationStatus(application.id, 'screening')}
                                  disabled={updatingApplicationId === application.id}
                                >
                                  Move to Screening
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-secondary hover:bg-secondary/90 text-white"
                                  onClick={() => {
                                    setActiveInterviewApplicationId(application.id);
                                    setActiveOfferApplicationId(null);
                                  }}
                                >
                                  Schedule Interview
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-danger/20 text-danger hover:bg-danger/10"
                                  onClick={() => handleApplicationStatus(application.id, 'rejected')}
                                  disabled={updatingApplicationId === application.id}
                                >
                                  Reject
                                </Button>
                              </>
                            ) : null}

                            {pipelineGroup(application.status) === 'interviewing' ? (
                              <>
                                {interview?.status === 'scheduled' ? (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-surface-3 text-white hover:bg-surface-2"
                                    onClick={async () => {
                                      try {
                                        setUpdatingApplicationId(application.id);
                                        await WorkforceService.updateInterview(interview.id, { status: 'completed' });
                                        await loadDashboard();
                                      } catch (interviewError) {
                                        console.error('Failed to update interview:', interviewError);
                                        setError(
                                          interviewError instanceof WorkforceApiError
                                            ? interviewError.message
                                            : 'Failed to update interview.',
                                        );
                                      } finally {
                                        setUpdatingApplicationId(null);
                                      }
                                    }}
                                    disabled={updatingApplicationId === application.id}
                                  >
                                    Mark Interview Complete
                                  </Button>
                                ) : null}
                                <Button
                                  size="sm"
                                  className="bg-primary hover:bg-primary/90 text-black"
                                  onClick={() => {
                                    setActiveOfferApplicationId(application.id);
                                    setActiveInterviewApplicationId(null);
                                    setOfferForm((current) => ({
                                      ...current,
                                      compensation: current.compensation || dashboard.requests.find((request) => request.id === application.requestId)?.compensation || '',
                                    }));
                                  }}
                                >
                                  Extend Offer
                                </Button>
                              </>
                            ) : null}

                            {pipelineGroup(application.status) === 'offers' ? (
                              <div className="rounded-xl border border-primary/20 bg-primary/10 px-3 py-2 text-xs text-primary font-semibold">
                                Offer awaiting candidate response
                              </div>
                            ) : null}
                          </div>

                          {activeInterviewApplicationId === application.id ? (
                            <form onSubmit={handleInterviewSubmit} className="mt-5 rounded-2xl border border-secondary/20 bg-secondary/5 p-4 space-y-3">
                              <p className="text-sm font-semibold text-white">Schedule interview</p>
                              <input
                                type="datetime-local"
                                value={interviewForm.scheduledAt}
                                onChange={(event) => setInterviewForm((current) => ({ ...current, scheduledAt: event.target.value }))}
                                className="w-full rounded-xl border border-surface-3 bg-[#0B0F14] px-4 py-3 text-white outline-none"
                                required
                              />
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <select
                                  value={interviewForm.mode}
                                  onChange={(event) => setInterviewForm((current) => ({ ...current, mode: event.target.value as typeof current.mode }))}
                                  className="w-full rounded-xl border border-surface-3 bg-[#0B0F14] px-4 py-3 text-white outline-none"
                                >
                                  <option value="video">Video</option>
                                  <option value="phone">Phone</option>
                                  <option value="onsite">Onsite</option>
                                </select>
                                <input
                                  value={interviewForm.location}
                                  onChange={(event) => setInterviewForm((current) => ({ ...current, location: event.target.value }))}
                                  placeholder="Zoom / Clinic Address"
                                  className="w-full rounded-xl border border-surface-3 bg-[#0B0F14] px-4 py-3 text-white outline-none"
                                  required
                                />
                              </div>
                              <input
                                value={interviewForm.meetingLink}
                                onChange={(event) => setInterviewForm((current) => ({ ...current, meetingLink: event.target.value }))}
                                placeholder="Meeting link"
                                className="w-full rounded-xl border border-surface-3 bg-[#0B0F14] px-4 py-3 text-white outline-none"
                              />
                              <textarea
                                rows={3}
                                value={interviewForm.notes}
                                onChange={(event) => setInterviewForm((current) => ({ ...current, notes: event.target.value }))}
                                placeholder="Interview notes or prep instructions"
                                className="w-full rounded-2xl border border-surface-3 bg-[#0B0F14] px-4 py-3 text-white outline-none"
                              />
                              <div className="flex gap-3">
                                <Button type="submit" size="sm" className="bg-secondary hover:bg-secondary/90 text-white" disabled={submittingInterview}>
                                  {submittingInterview ? 'Scheduling...' : 'Confirm Interview'}
                                </Button>
                                <Button type="button" size="sm" variant="outline" className="border-surface-3 text-white hover:bg-surface-2" onClick={() => setActiveInterviewApplicationId(null)}>
                                  Cancel
                                </Button>
                              </div>
                            </form>
                          ) : null}

                          {activeOfferApplicationId === application.id ? (
                            <form onSubmit={handleOfferSubmit} className="mt-5 rounded-2xl border border-primary/20 bg-primary/5 p-4 space-y-3">
                              <p className="text-sm font-semibold text-white">Extend offer</p>
                              <input
                                value={offerForm.compensation}
                                onChange={(event) => setOfferForm((current) => ({ ...current, compensation: event.target.value }))}
                                placeholder="$145k / yr + bonus"
                                className="w-full rounded-xl border border-surface-3 bg-[#0B0F14] px-4 py-3 text-white outline-none"
                                required
                              />
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <input
                                  type="date"
                                  value={offerForm.startDate}
                                  onChange={(event) => setOfferForm((current) => ({ ...current, startDate: event.target.value }))}
                                  className="w-full rounded-xl border border-surface-3 bg-[#0B0F14] px-4 py-3 text-white outline-none"
                                  required
                                />
                                <input
                                  type="date"
                                  value={offerForm.expiresAt}
                                  onChange={(event) => setOfferForm((current) => ({ ...current, expiresAt: event.target.value }))}
                                  className="w-full rounded-xl border border-surface-3 bg-[#0B0F14] px-4 py-3 text-white outline-none"
                                  required
                                />
                              </div>
                              <textarea
                                rows={3}
                                value={offerForm.notes}
                                onChange={(event) => setOfferForm((current) => ({ ...current, notes: event.target.value }))}
                                placeholder="Notes, contingencies, or onboarding context"
                                className="w-full rounded-2xl border border-surface-3 bg-[#0B0F14] px-4 py-3 text-white outline-none"
                              />
                              <div className="flex gap-3">
                                <Button type="submit" size="sm" className="bg-primary hover:bg-primary/90 text-black" disabled={submittingOffer}>
                                  {submittingOffer ? 'Extending...' : 'Send Offer'}
                                  <Send className="w-4 h-4 ml-2" />
                                </Button>
                                <Button type="button" size="sm" variant="outline" className="border-surface-3 text-white hover:bg-surface-2" onClick={() => setActiveOfferApplicationId(null)}>
                                  Cancel
                                </Button>
                              </div>
                            </form>
                          ) : null}
                        </Card>
                      );
                    }) : (
                      <Card className="p-6 bg-[#0B0F14] border-surface-3 text-center">
                        <p className="text-text-secondary">No candidates in this stage.</p>
                      </Card>
                    )}
                  </div>
                );
              })}
            </div>

            {hiredApplications.length ? (
              <Card className="p-6 bg-success/5 border-success/20">
                <h2 className="text-lg font-bold text-white mb-4">Accepted placements</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hiredApplications.map((application) => (
                    <div key={application.id} className="rounded-2xl bg-[#0B0F14] border border-success/20 p-4">
                      <p className="font-semibold text-white">{application.practitionerName}</p>
                      <p className="mt-1 text-sm text-text-secondary">{application.requestTitle}</p>
                      <p className="mt-3 text-xs text-success uppercase tracking-wider font-bold">
                        Offer accepted {formatRelativeDate(application.updatedAt)}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            ) : null}
          </div>
        ) : null}

        {!loading && dashboard && activeTab === 'notifications' ? (
          <div className="space-y-6">
            <Card className="p-6 bg-[#0B0F14] border-surface-3">
              <h2 className="text-xl font-bold text-white">Clinic workforce notifications</h2>
              <p className="mt-2 text-sm text-text-secondary">
                Application submissions, interview confirmations, and offer responses arrive here with direct links back into the live staffing workflow.
              </p>
            </Card>

            {dashboard.notifications.length ? dashboard.notifications.map((notification) => (
              <Card key={notification.id} className="p-5 bg-[#0B0F14] border-surface-3">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    notification.status === 'unread' ? 'bg-primary/10 text-primary' : 'bg-surface-2 text-text-secondary'
                  }`}>
                    <Bell className="w-5 h-5" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2">
                      <h3 className="font-bold text-white">{notification.title}</h3>
                      <span className="text-xs text-text-secondary">{formatRelativeDate(notification.createdAt)}</span>
                    </div>
                    <p className="mt-2 text-sm text-text-secondary leading-7">{notification.body}</p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {notification.link ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-surface-3 text-white hover:bg-surface-2"
                          onClick={() =>
                            handleOpenNotification(
                              notification.id,
                              notification.link,
                              notification.status,
                            )
                          }
                          disabled={updatingNotificationId === notification.id}
                        >
                          Open Workflow
                        </Button>
                      ) : null}
                      {notification.status === 'unread' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-primary/20 text-primary hover:bg-primary/10"
                          onClick={() => handleNotificationRead(notification.id)}
                          disabled={updatingNotificationId === notification.id}
                        >
                          Mark as Read
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </div>
              </Card>
            )) : (
              <Card className="p-10 bg-[#0B0F14] border-surface-3 text-center">
                <h3 className="text-xl font-bold text-white">No notifications yet</h3>
                <p className="mt-3 text-text-secondary">
                  Workflow updates will appear here as candidates apply, interviews are confirmed, and offers are answered.
                </p>
              </Card>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
