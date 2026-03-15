import React from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Activity,
  Bell,
  Briefcase,
  Calendar,
  ChevronRight,
  FileText,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  User,
} from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { WorkforceAuthGate } from '@/src/components/workforce/WorkforceAuthGate';
import { activeOfferForApplication, applicationStatusClasses, formatApplicationStatus, formatRelativeDate, nextInterviewForApplication } from '@/src/lib/workforce/ui';
import type { PractitionerDashboardData } from '@/src/lib/workforce/types';
import { WorkforceApiError, WorkforceService } from '@/src/services/workforce';

const TABS = [
  { id: 'applications', label: 'Applications', icon: Briefcase },
  { id: 'matches', label: 'Matches', icon: Star },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'messages', label: 'Notifications', icon: MessageCircle },
] as const;

type DashboardTab = (typeof TABS)[number]['id'];

function parseDashboardTab(value: string | null): DashboardTab {
  return TABS.some((tab) => tab.id === value) ? (value as DashboardTab) : 'applications';
}

export function WorkforceDashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = React.useState<DashboardTab>(() => parseDashboardTab(searchParams.get('tab')));
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [data, setData] = React.useState<PractitionerDashboardData | null>(null);
  const [actionTargetId, setActionTargetId] = React.useState<string | null>(null);

  const loadDashboard = React.useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const dashboard = await WorkforceService.getPractitionerDashboard();
      setData(dashboard);
    } catch (loadError) {
      console.error('Failed to load practitioner dashboard:', loadError);
      setError(
        loadError instanceof WorkforceApiError
          ? loadError.message
          : 'Failed to load your workforce dashboard.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  React.useEffect(() => {
    const urlTab = parseDashboardTab(searchParams.get('tab'));
    if (urlTab !== activeTab) {
      setActiveTab(urlTab);
    }
  }, [activeTab, searchParams]);

  React.useEffect(() => {
    if (parseDashboardTab(searchParams.get('tab')) === activeTab) {
      return;
    }

    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('tab', activeTab);
    setSearchParams(nextParams, { replace: true });
  }, [activeTab, searchParams, setSearchParams]);

  const handleApplicationWithdraw = async (applicationId: string) => {
    try {
      setActionTargetId(applicationId);
      setError('');
      await WorkforceService.updateApplicationStatus(applicationId, 'withdrawn');
      await loadDashboard();
    } catch (actionError) {
      console.error('Failed to withdraw application:', actionError);
      setError(
        actionError instanceof WorkforceApiError
          ? actionError.message
          : 'Failed to withdraw application.',
      );
    } finally {
      setActionTargetId(null);
    }
  };

  const handleOfferDecision = async (offerId: string, status: 'accepted' | 'declined') => {
    try {
      setActionTargetId(offerId);
      setError('');
      await WorkforceService.updateOffer(offerId, status);
      await loadDashboard();
    } catch (actionError) {
      console.error('Failed to update offer:', actionError);
      setError(
        actionError instanceof WorkforceApiError
          ? actionError.message
          : 'Failed to update offer.',
      );
    } finally {
      setActionTargetId(null);
    }
  };

  const handleNotificationRead = async (notificationId: string) => {
    try {
      setActionTargetId(notificationId);
      await WorkforceService.markNotificationRead(notificationId);
      await loadDashboard();
    } catch (actionError) {
      console.error('Failed to mark notification as read:', actionError);
      setError(
        actionError instanceof WorkforceApiError
          ? actionError.message
          : 'Failed to update notification.',
      );
    } finally {
      setActionTargetId(null);
    }
  };

  const handleOpenNotification = async (
    notificationId: string,
    link?: string,
    status?: 'unread' | 'read',
  ) => {
    try {
      setActionTargetId(notificationId);
      if (status === 'unread') {
        await WorkforceService.markNotificationRead(notificationId);
      }
      await loadDashboard();
      navigate(link || '/workforce/dashboard');
    } catch (actionError) {
      console.error('Failed to open notification workflow:', actionError);
      setError(
        actionError instanceof WorkforceApiError
          ? actionError.message
          : 'Failed to open notification workflow.',
      );
    } finally {
      setActionTargetId(null);
    }
  };

  const unreadNotifications =
    data?.notifications.filter((notification) => notification.status === 'unread').length || 0;

  return (
    <WorkforceAuthGate
      title="Practitioner Workforce Dashboard"
      description="Track live applications, interviews, offers, and staffing notifications from the backend exchange."
    >
      <div className="min-h-screen bg-[#05070A] flex flex-col md:flex-row selection:bg-secondary/30 selection:text-white font-sans">
        <aside className="w-full md:w-72 bg-[#0B0F14] border-r border-surface-3 flex-shrink-0 flex flex-col h-screen sticky top-0 z-20">
          <div className="h-20 flex items-center px-6 border-b border-surface-3">
            <Link to="/" className="flex items-center gap-2">
              <Activity className="w-6 h-6 text-secondary" />
              <span className="font-display font-bold text-xl tracking-tight text-white">
                Novalyte <span className="text-secondary">AI</span>
              </span>
            </Link>
          </div>

          <div className="p-6 flex-grow flex flex-col">
            <div className="rounded-2xl bg-surface-2 border border-surface-3 p-4 mb-8">
              <p className="text-xs uppercase tracking-[0.24em] text-text-secondary">Practitioner</p>
              <h3 className="mt-3 font-bold text-white">
                {data?.profile ? `${data.profile.firstName} ${data.profile.lastName}` : 'Loading profile'}
              </h3>
              <p className="mt-1 text-xs text-text-secondary">{data?.profile?.role || 'Set up your live profile'}</p>
            </div>

            <nav className="space-y-2 flex-grow">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                const badge = tab.id === 'messages' ? unreadNotifications : 0;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                      isActive
                        ? 'bg-secondary/10 text-secondary border border-secondary/20'
                        : 'text-text-secondary hover:bg-surface-2 hover:text-white border border-transparent'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-secondary' : 'text-text-secondary'}`} />
                    {tab.label}
                    {badge ? (
                      <span className="ml-auto bg-secondary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {badge}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </nav>

            <div className="pt-6 border-t border-surface-3 mt-auto space-y-3">
              <Link to="/workforce/profile">
                <Button variant="outline" className="w-full border-surface-3 text-white hover:bg-surface-2">
                  Edit Profile
                </Button>
              </Link>
              <Link to="/workforce/jobs">
                <Button className="w-full bg-white text-black hover:bg-white/90 font-semibold">
                  Browse Opportunities
                  <Search className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </aside>

        <main className="flex-grow p-6 md:p-10 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
              <div>
                <h1 className="text-3xl font-display font-bold text-white capitalize">{activeTab}</h1>
                <p className="text-text-secondary mt-1">
                  Real workflow state across applications, interviews, offers, and notifications.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Card className="bg-[#0B0F14] border-surface-3 p-4">
                  <p className="text-xs uppercase tracking-wider text-text-secondary">Applications</p>
                  <p className="mt-2 text-2xl font-display font-bold text-white">{data?.applications.length || 0}</p>
                </Card>
                <Card className="bg-[#0B0F14] border-surface-3 p-4">
                  <p className="text-xs uppercase tracking-wider text-text-secondary">Interviews</p>
                  <p className="mt-2 text-2xl font-display font-bold text-white">
                    {data?.interviews.filter((interview) => interview.status === 'scheduled').length || 0}
                  </p>
                </Card>
                <Card className="bg-[#0B0F14] border-surface-3 p-4">
                  <p className="text-xs uppercase tracking-wider text-text-secondary">Offers</p>
                  <p className="mt-2 text-2xl font-display font-bold text-white">
                    {data?.offers.filter((offer) => offer.status === 'extended').length || 0}
                  </p>
                </Card>
                <Card className="bg-[#0B0F14] border-surface-3 p-4">
                  <p className="text-xs uppercase tracking-wider text-text-secondary">Profile</p>
                  <p className="mt-2 text-2xl font-display font-bold text-white">
                    {data?.profile?.profileStrength || 0}%
                  </p>
                </Card>
              </div>
            </div>

            {loading ? (
              <Card className="p-10 bg-surface-1 border-surface-3 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
              </Card>
            ) : null}

            {!loading && error ? (
              <Card className="p-6 bg-danger/10 border-danger/20 text-danger">{error}</Card>
            ) : null}

            {!loading && data ? (
              <>
                {activeTab === 'applications' ? (
                  <div className="space-y-6">
                    <Card className="p-6 bg-secondary/5 border-secondary/20 flex flex-col md:flex-row gap-6 items-start">
                      <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                        <Sparkles className="w-6 h-6 text-secondary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white mb-2">Exchange insight</h3>
                        <p className="text-text-secondary leading-relaxed">
                          Application state is now synced to clinic staffing pipelines. When a clinic schedules an interview or extends an offer, the update appears here automatically.
                        </p>
                      </div>
                    </Card>

                    <div className="space-y-4">
                      {data.applications.length ? data.applications.map((application) => {
                        const interview = nextInterviewForApplication(application.id, data.interviews);
                        const offer = activeOfferForApplication(application.id, data.offers);

                        return (
                          <Card key={application.id} className="p-6 bg-[#0B0F14] border-surface-3 hover:border-surface-4 transition-all group">
                            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                              <div className="flex-grow">
                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                  <h3 className="text-xl font-bold text-white group-hover:text-secondary transition-colors">
                                    {application.requestTitle}
                                  </h3>
                                  <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border ${applicationStatusClasses(application.status)}`}>
                                    {formatApplicationStatus(application.status)}
                                  </span>
                                </div>
                                <p className="text-lg text-text-secondary mb-4">{application.clinicName}</p>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
                                  <span className="flex items-center gap-1.5">
                                    <ShieldCheck className="w-4 h-4" />
                                    Match {application.match.score}%
                                  </span>
                                  <span className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4" />
                                    Updated {formatRelativeDate(application.updatedAt)}
                                  </span>
                                  {interview ? (
                                    <span className="flex items-center gap-1.5">
                                      <Calendar className="w-4 h-4" />
                                      Interview {new Date(interview.scheduledAt).toLocaleString()}
                                    </span>
                                  ) : null}
                                  {offer ? (
                                    <span className="flex items-center gap-1.5">
                                      <Briefcase className="w-4 h-4" />
                                      Offer expires {new Date(offer.expiresAt).toLocaleDateString()}
                                    </span>
                                  ) : null}
                                </div>
                                {interview?.meetingLink ? (
                                  <div className="mt-3">
                                    <a
                                      href={interview.meetingLink}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-sm font-semibold text-secondary hover:text-white transition-colors"
                                    >
                                      Open Interview Link
                                    </a>
                                  </div>
                                ) : null}
                              </div>
                              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                                <Link to={`/workforce/apply/${application.requestId}`}>
                                  <Button variant="outline" className="border-surface-3 text-white hover:bg-surface-2">
                                    View Request
                                  </Button>
                                </Link>
                                <Link to="/ask-ai">
                                  <Button className="bg-secondary hover:bg-secondary/90 text-white font-semibold">
                                    Prepare
                                    <ChevronRight className="w-4 h-4 ml-2" />
                                  </Button>
                                </Link>
                                {offer ? (
                                  <>
                                    <Button
                                      className="bg-success hover:bg-success/90 text-black font-semibold"
                                      onClick={() => handleOfferDecision(offer.id, 'accepted')}
                                      disabled={actionTargetId === offer.id}
                                    >
                                      Accept Offer
                                    </Button>
                                    <Button
                                      variant="outline"
                                      className="border-danger/20 text-danger hover:bg-danger/10"
                                      onClick={() => handleOfferDecision(offer.id, 'declined')}
                                      disabled={actionTargetId === offer.id}
                                    >
                                      Decline
                                    </Button>
                                  </>
                                ) : ['applied', 'screening', 'interview_scheduled', 'interview_completed'].includes(application.status) ? (
                                  <Button
                                    variant="outline"
                                    className="border-danger/20 text-danger hover:bg-danger/10"
                                    onClick={() => handleApplicationWithdraw(application.id)}
                                    disabled={actionTargetId === application.id}
                                  >
                                    Withdraw
                                  </Button>
                                ) : null}
                              </div>
                            </div>
                          </Card>
                        );
                      }) : (
                        <Card className="p-10 bg-[#0B0F14] border-surface-3 text-center">
                          <h3 className="text-xl font-bold text-white">No applications yet</h3>
                          <p className="mt-3 text-text-secondary">
                            Your submitted staffing applications will appear here once you start applying.
                          </p>
                          <div className="mt-6">
                            <Link to="/workforce/jobs">
                              <Button className="bg-white text-black hover:bg-white/90 font-semibold">
                                Browse Opportunities
                              </Button>
                            </Link>
                          </div>
                        </Card>
                      )}
                    </div>
                  </div>
                ) : null}

                {activeTab === 'matches' ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {data.opportunities.length ? data.opportunities.map((match) => (
                      <Card key={match.id} className="p-6 bg-[#0B0F14] border-surface-3 hover:border-secondary/30 transition-all flex flex-col h-full group">
                        <div className="flex justify-between items-start gap-4 mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-white group-hover:text-secondary transition-colors">
                              {match.title}
                            </h3>
                            <p className="text-text-secondary mt-1">{match.clinicName}</p>
                          </div>
                          <span className="px-2 py-1 rounded bg-success/10 text-success border border-success/20 text-xs font-mono font-bold flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current" />
                            {match.match?.score ?? 0}% Match
                          </span>
                        </div>

                        <div className="space-y-3 text-sm text-text-secondary flex-grow">
                          <div>{match.location.label}</div>
                          <div>{match.compensation}</div>
                          <div className="flex flex-wrap gap-2">
                            {match.requiredProtocols.map((protocol) => (
                              <span key={protocol} className="px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs">
                                {protocol}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="mt-6">
                          <Link to={`/workforce/apply/${match.id}`}>
                            <Button className="w-full bg-secondary hover:bg-secondary/90 text-white font-semibold">
                              Review and Apply
                            </Button>
                          </Link>
                        </div>
                      </Card>
                    )) : (
                      <Card className="p-10 bg-[#0B0F14] border-surface-3 text-center lg:col-span-2">
                        <h3 className="text-xl font-bold text-white">No live matches yet</h3>
                        <p className="mt-3 text-text-secondary">
                          Complete your practitioner profile so the exchange can calculate candidate-to-clinic fit.
                        </p>
                        <div className="mt-6">
                          <Link to="/workforce/profile">
                            <Button className="bg-white text-black hover:bg-white/90 font-semibold">
                              Complete Profile
                            </Button>
                          </Link>
                        </div>
                      </Card>
                    )}
                  </div>
                ) : null}

                {activeTab === 'profile' ? (
                  <div className="space-y-6">
                    <Card className="p-8 bg-[#0B0F14] border-surface-3">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                          <p className="text-xs uppercase tracking-[0.24em] text-text-secondary">Live practitioner record</p>
                          <h2 className="mt-3 text-3xl font-display font-bold text-white">
                            {data.profile ? `${data.profile.firstName} ${data.profile.lastName}` : 'No profile yet'}
                          </h2>
                          <p className="mt-2 text-text-secondary">
                            {data.profile?.summary || 'Create your production practitioner profile to activate matching and application workflows.'}
                          </p>
                        </div>
                        <div className="min-w-[220px] rounded-2xl border border-surface-3 bg-surface-2/60 p-5">
                          <p className="text-xs uppercase tracking-wider text-text-secondary">Profile strength</p>
                          <p className="mt-3 text-4xl font-display font-bold text-success">
                            {data.profile?.profileStrength || 0}%
                          </p>
                        </div>
                      </div>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="p-6 bg-[#0B0F14] border-surface-3">
                        <h3 className="text-lg font-bold text-white mb-4">Credentials</h3>
                        <div className="space-y-3 text-sm text-text-secondary">
                          <div>Role: <span className="text-white">{data.profile?.role || 'Not set'}</span></div>
                          <div>License states: <span className="text-white">{data.profile?.licenseStates.join(', ') || 'Not set'}</span></div>
                          <div>Resume: <span className="text-white">{data.profile?.resumeUploaded ? data.profile.resumeFileName || 'Uploaded' : 'Missing'}</span></div>
                        </div>
                      </Card>

                      <Card className="p-6 bg-[#0B0F14] border-surface-3">
                        <h3 className="text-lg font-bold text-white mb-4">Availability</h3>
                        <div className="space-y-3 text-sm text-text-secondary">
                          <div>Status: <span className="text-white capitalize">{data.profile?.availabilityStatus || 'inactive'}</span></div>
                          <div>Modes: <span className="text-white">{data.profile?.workModes.join(', ') || 'Not set'}</span></div>
                          <div>Compensation: <span className="text-white">{data.profile?.targetCompensation || 'Not set'}</span></div>
                        </div>
                      </Card>
                    </div>

                    <Link to="/workforce/profile">
                      <Button className="bg-secondary hover:bg-secondary/90 text-white font-semibold">
                        Update Profile
                      </Button>
                    </Link>
                  </div>
                ) : null}

                {activeTab === 'messages' ? (
                  <div className="space-y-4">
                    {data.notifications.length ? data.notifications.map((notification) => (
                      <Card key={notification.id} className="p-5 bg-[#0B0F14] border-surface-3">
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            notification.status === 'unread' ? 'bg-secondary/10 text-secondary' : 'bg-surface-2 text-text-secondary'
                          }`}>
                            <Bell className="w-5 h-5" />
                          </div>
                          <div className="flex-grow">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
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
                                  disabled={actionTargetId === notification.id}
                                >
                                  Open Workflow
                                </Button>
                              ) : null}
                              {notification.status === 'unread' ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-secondary/20 text-secondary hover:bg-secondary/10"
                                  onClick={() => handleNotificationRead(notification.id)}
                                  disabled={actionTargetId === notification.id}
                                >
                                  Mark as Read
                                </Button>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </Card>
                    )) : (
                      <Card className="p-16 bg-[#0B0F14] border-surface-3 text-center flex flex-col items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-surface-2 flex items-center justify-center mb-6">
                          <MessageCircle className="w-10 h-10 text-text-secondary" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">No notifications yet</h3>
                        <p className="text-text-secondary max-w-md mx-auto leading-relaxed">
                          Clinic actions, interview invites, and offer updates will appear here as they happen.
                        </p>
                      </Card>
                    )}
                  </div>
                ) : null}
              </>
            ) : null}
          </div>
        </main>
      </div>
    </WorkforceAuthGate>
  );
}
