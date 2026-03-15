import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  BarChart3,
  Inbox,
  Loader2,
  Mail,
  MessageSquare,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Send,
  ShieldCheck,
  Target,
  Zap,
} from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { AdminService } from '@/src/services/admin';
import type { OutreachChannel, OutreachResponse } from '@/src/lib/admin/types';

type Tab = 'campaigns' | 'queue' | 'accounts';

const TABS: Array<{ id: Tab; label: string; icon: React.ComponentType<any> }> = [
  { id: 'campaigns', label: 'Active Campaigns', icon: BarChart3 },
  { id: 'queue', label: 'Dispatch Queue', icon: Send },
  { id: 'accounts', label: 'Sender Accounts', icon: Inbox },
];

export function Outreacher() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState<OutreachResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [showCampaignForm, setShowCampaignForm] = useState(false);
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [campaignName, setCampaignName] = useState('');
  const [campaignAudience, setCampaignAudience] = useState('');
  const [campaignChannel, setCampaignChannel] = useState<OutreachChannel>('Email');
  const [campaignObjective, setCampaignObjective] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [senderProvider, setSenderProvider] = useState('Google Workspace');
  const [queueBusyId, setQueueBusyId] = useState<string | null>(null);
  const [campaignBusyId, setCampaignBusyId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const tab = (searchParams.get('tab') as Tab) || 'campaigns';
  const campaignFilterId = searchParams.get('campaignId') || '';

  const loadData = async (silent = false) => {
    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError('');
    try {
      const response = await AdminService.getOutreach();
      setData(response);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load outreacher.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    void loadData();
    const interval = window.setInterval(() => {
      void loadData(true);
    }, 30000);

    return () => window.clearInterval(interval);
  }, []);

  const setTab = (nextTab: Tab) => {
    const next = new URLSearchParams(searchParams);
    next.set('tab', nextTab);
    setSearchParams(next);
  };

  const filteredQueue = useMemo(() => {
    if (!data) {
      return [];
    }
    if (!campaignFilterId) {
      return data.queue;
    }
    return data.queue.filter((item) => item.campaignId === campaignFilterId);
  }, [campaignFilterId, data]);

  const handleCreateCampaign = async () => {
    if (!campaignName.trim() || !campaignAudience.trim()) {
      setError('Campaign name and audience are required.');
      return;
    }
    setCreating(true);
    setError('');
    try {
      const response = await AdminService.createCampaign({
        name: campaignName.trim(),
        audience: campaignAudience.trim(),
        channel: campaignChannel,
        objective: campaignObjective.trim() || undefined,
      });
      setCampaignName('');
      setCampaignAudience('');
      setCampaignObjective('');
      setCampaignChannel('Email');
      setShowCampaignForm(false);
      setSearchParams(new URLSearchParams({ tab: 'campaigns', campaignId: response.campaign.id }));
      await loadData(true);
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'Failed to create campaign.');
    } finally {
      setCreating(false);
    }
  };

  const handleCreateAccount = async () => {
    if (!senderEmail.trim()) {
      setError('Sender email is required.');
      return;
    }
    setCreating(true);
    setError('');
    try {
      await AdminService.createSenderAccount({
        email: senderEmail.trim(),
        provider: senderProvider.trim(),
      });
      setSenderEmail('');
      setSenderProvider('Google Workspace');
      setShowAccountForm(false);
      await loadData(true);
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'Failed to create sender account.');
    } finally {
      setCreating(false);
    }
  };

  const handleCampaignToggle = async (id: string, status: OutreachResponse['campaigns'][number]['status']) => {
    setCampaignBusyId(id);
    setError('');
    try {
      await AdminService.updateCampaign(id, {
        status: status === 'Active' ? 'Paused' : status === 'Paused' ? 'Active' : 'Active',
      });
      await loadData(true);
    } catch (toggleError) {
      setError(toggleError instanceof Error ? toggleError.message : 'Failed to update campaign.');
    } finally {
      setCampaignBusyId(null);
    }
  };

  const handlePersonalize = async (id: string) => {
    setQueueBusyId(id);
    setError('');
    try {
      await AdminService.personalizeQueueItem(id);
      await loadData(true);
    } catch (queueError) {
      setError(queueError instanceof Error ? queueError.message : 'Failed to personalize queue item.');
    } finally {
      setQueueBusyId(null);
    }
  };

  const handleSend = async (id: string) => {
    setQueueBusyId(id);
    setError('');
    try {
      await AdminService.sendQueueItem(id);
      await loadData(true);
    } catch (queueError) {
      setError(queueError instanceof Error ? queueError.message : 'Failed to send queue item.');
    } finally {
      setQueueBusyId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error && !data) {
    return (
      <Card className="border-danger/20 bg-danger/10 p-6 text-danger">
        <p className="font-semibold text-white">Outreacher unavailable</p>
        <p className="mt-2 text-sm">{error}</p>
        <Button onClick={() => void loadData()} className="mt-4 font-semibold">
          Retry
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12 font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface-1/50 p-6 rounded-2xl border border-surface-3 backdrop-blur-xl">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">Outreach Operations</h1>
          <p className="text-text-secondary text-sm mt-1">
            Persisted campaigns, real dispatch queue, AI personalization, and sender health from the admin backend.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            className="border-surface-3 bg-[#0B0F14] text-white hover:bg-surface-2"
            onClick={() => setShowAccountForm((current) => !current)}
          >
            <Inbox className="mr-2 h-4 w-4" />
            Connect Inbox
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-black font-bold" onClick={() => setShowCampaignForm((current) => !current)}>
            <Plus className="mr-2 h-4 w-4" />
            New Campaign
          </Button>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-danger/25 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      ) : null}

      {showCampaignForm ? (
        <Card className="bg-surface-1 border-surface-3 p-6 shadow-2xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-display font-semibold text-white">Create Campaign</h2>
              <p className="mt-1 text-sm text-text-secondary">Campaigns persist to Supabase and immediately show up in CRM handoffs and queue filters.</p>
            </div>
            <Button variant="outline" onClick={() => setShowCampaignForm(false)} className="border-surface-3 bg-[#0B0F14] text-white hover:bg-surface-2">
              Close
            </Button>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <input
              value={campaignName}
              onChange={(event) => setCampaignName(event.target.value)}
              placeholder="Campaign name"
              className="h-12 rounded-xl border border-surface-3 bg-[#0B0F14] px-4 text-sm text-white outline-none"
            />
            <input
              value={campaignAudience}
              onChange={(event) => setCampaignAudience(event.target.value)}
              placeholder="Audience"
              className="h-12 rounded-xl border border-surface-3 bg-[#0B0F14] px-4 text-sm text-white outline-none"
            />
            <select
              value={campaignChannel}
              onChange={(event) => setCampaignChannel(event.target.value as OutreachChannel)}
              className="h-12 rounded-xl border border-surface-3 bg-[#0B0F14] px-4 text-sm text-white outline-none"
            >
              <option value="Email">Email</option>
              <option value="SMS">SMS</option>
              <option value="Email + SMS">Email + SMS</option>
            </select>
            <input
              value={campaignObjective}
              onChange={(event) => setCampaignObjective(event.target.value)}
              placeholder="Objective"
              className="h-12 rounded-xl border border-surface-3 bg-[#0B0F14] px-4 text-sm text-white outline-none"
            />
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => void handleCreateCampaign()} disabled={creating} className="font-semibold">
              {creating ? 'Creating...' : 'Create Campaign'}
            </Button>
          </div>
        </Card>
      ) : null}

      {showAccountForm ? (
        <Card className="bg-surface-1 border-surface-3 p-6 shadow-2xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-display font-semibold text-white">Connect Sender Account</h2>
              <p className="mt-1 text-sm text-text-secondary">Sender accounts persist as operator resources and feed delivery capacity calculations.</p>
            </div>
            <Button variant="outline" onClick={() => setShowAccountForm(false)} className="border-surface-3 bg-[#0B0F14] text-white hover:bg-surface-2">
              Close
            </Button>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              value={senderEmail}
              onChange={(event) => setSenderEmail(event.target.value)}
              placeholder="ops@novalyte.io"
              className="h-12 rounded-xl border border-surface-3 bg-[#0B0F14] px-4 text-sm text-white outline-none"
            />
            <input
              value={senderProvider}
              onChange={(event) => setSenderProvider(event.target.value)}
              placeholder="Google Workspace"
              className="h-12 rounded-xl border border-surface-3 bg-[#0B0F14] px-4 text-sm text-white outline-none"
            />
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => void handleCreateAccount()} disabled={creating} className="font-semibold">
              {creating ? 'Connecting...' : 'Connect Account'}
            </Button>
          </div>
        </Card>
      ) : null}

      {data ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard title="Daily Send Volume" value={`${data.summary.dailySendVolume.toLocaleString()} / ${data.summary.sendLimit.toLocaleString()}`} icon={Send} />
          <MetricCard title="Sender Health Score" value={`${data.summary.senderHealthScore}%`} icon={ShieldCheck} />
          <MetricCard title="Avg Open Rate" value={`${data.summary.avgOpenRate}%`} icon={RefreshCw} />
          <MetricCard title="CRM Conversion" value={`${data.summary.crmConversionRate}%`} icon={Target} />
        </div>
      ) : null}

      <div className="flex items-center gap-1 bg-[#0B0F14] p-1 rounded-xl border border-surface-3 w-full sm:w-fit overflow-x-auto">
        {TABS.map((entry) => {
          const Icon = entry.icon;
          const active = tab === entry.id;
          return (
            <button
              key={entry.id}
              type="button"
              onClick={() => setTab(entry.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                active
                  ? 'bg-primary/10 text-primary shadow-[0_0_15px_rgba(53,212,255,0.1)]'
                  : 'text-text-secondary hover:text-white hover:bg-surface-2'
              }`}
            >
              <Icon className="h-4 w-4" />
              {entry.label}
            </button>
          );
        })}
      </div>

      {tab === 'campaigns' && (
        <div className="grid grid-cols-1 xl:grid-cols-[1.75fr_1fr] gap-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {data?.campaigns.map((campaign) => (
              <Card
                key={campaign.id}
                className={`bg-surface-1 border-surface-3 p-0 shadow-xl ${campaignFilterId === campaign.id ? 'ring-1 ring-primary/30' : ''}`}
              >
                <div className="p-6 border-b border-surface-3 bg-gradient-to-r from-surface-2 to-surface-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <button
                        type="button"
                        onClick={() => setSearchParams(new URLSearchParams({ tab: 'campaigns', campaignId: campaign.id }))}
                        className="text-left"
                      >
                        <h3 className="text-lg font-bold text-white hover:text-primary transition-colors">{campaign.name}</h3>
                      </button>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-text-secondary">
                        <span className="flex items-center gap-1">
                          <Target className="h-3.5 w-3.5" />
                          {campaign.audience}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="h-3.5 w-3.5" />
                          {campaign.channel}
                        </span>
                      </div>
                    </div>
                    <span className={`rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] ${
                      campaign.status === 'Active'
                        ? 'border-success/20 bg-success/10 text-success'
                        : campaign.status === 'Paused'
                          ? 'border-warning/20 bg-warning/10 text-warning'
                          : 'border-primary/20 bg-primary/10 text-primary'
                    }`}>
                      {campaign.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6">
                  <StatBlock label="Sent" value={campaign.sentCount.toLocaleString()} />
                  <StatBlock label="Open Rate" value={`${campaign.openRate.toFixed(1)}%`} />
                  <StatBlock label="Reply Rate" value={`${campaign.replyRate.toFixed(1)}%`} />
                  <StatBlock label="Qualified" value={campaign.qualifiedCount.toLocaleString()} />
                </div>

                <div className="px-6 py-4 border-t border-surface-3 bg-[#0B0F14] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-text-secondary">
                      {campaign.nextSendAt ? `Next send: ${new Date(campaign.nextSendAt).toLocaleString()}` : 'No dispatch scheduled'}
                    </p>
                    <p className="mt-1 text-xs text-primary">{campaign.crmFeedback}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="border-surface-3 bg-surface-1 text-white hover:bg-surface-2"
                      onClick={() => setSearchParams(new URLSearchParams({ tab: 'queue', campaignId: campaign.id }))}
                    >
                      Queue
                    </Button>
                    <Button
                      onClick={() => void handleCampaignToggle(campaign.id, campaign.status)}
                      disabled={campaignBusyId === campaign.id}
                      className="font-semibold"
                    >
                      {campaign.status === 'Active' ? (
                        <>
                          <Pause className="mr-2 h-4 w-4" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-4 w-4" />
                          Activate
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Card className="bg-surface-1 border-surface-3 p-6 shadow-2xl">
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-white">
              <BarChart3 className="h-4 w-4 text-primary" />
              7-Day Reporting
            </div>
            <div className="mt-6 space-y-4">
              {data?.reports.map((point) => (
                <div key={point.label} className="rounded-xl border border-surface-3 bg-[#0B0F14] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-white">{point.label}</p>
                    <p className="text-xs text-text-secondary">{point.sent} sent</p>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
                    <ReportStat label="Opened" value={point.opened} />
                    <ReportStat label="Replied" value={point.replied} />
                    <ReportStat label="Qualified" value={point.qualified} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {tab === 'queue' && (
        <Card className="bg-surface-1 border-surface-3 p-0 overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-surface-3 bg-gradient-to-r from-surface-2 to-surface-1 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <p className="text-sm font-semibold text-white">Dispatch Queue</p>
              <p className="mt-1 text-xs text-text-secondary">
                {campaignFilterId
                  ? `Filtered to campaign ${campaignFilterId}`
                  : `${data?.summary.pendingQueueCount || 0} recipients pending admin dispatch`}
              </p>
            </div>
            <Button variant="outline" onClick={() => void loadData(true)} className="border-surface-3 bg-[#0B0F14] text-white hover:bg-surface-2">
              {refreshing ? 'Refreshing...' : 'Refresh Queue'}
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#0B0F14] text-[10px] uppercase tracking-[0.2em] text-text-secondary">
                <tr>
                  <th className="px-6 py-3">Recipient</th>
                  <th className="px-6 py-3">Campaign</th>
                  <th className="px-6 py-3">AI Personalization</th>
                  <th className="px-6 py-3">Scheduled</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-3 text-sm">
                {filteredQueue.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-2/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-white">{item.recipientName}</p>
                      <p className="mt-1 text-xs text-text-secondary">
                        {item.recipientEmail || item.recipientPhone || item.recipientId}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-text-secondary">{item.campaignName}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] ${
                        item.personalizationStatus === 'drafted' || item.personalizationStatus === 'sent'
                          ? 'border-success/20 bg-success/10 text-success'
                          : item.personalizationStatus === 'missing_data'
                            ? 'border-danger/20 bg-danger/10 text-danger'
                            : 'border-warning/20 bg-warning/10 text-warning'
                      }`}>
                        {item.personalizationStatus.replace('_', ' ')}
                      </span>
                      <p className="mt-2 max-w-sm text-xs text-text-secondary">{item.draftPreview}</p>
                    </td>
                    <td className="px-6 py-4 text-white">{new Date(item.scheduledFor).toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          className="border-surface-3 bg-[#0B0F14] text-white hover:bg-surface-2"
                          onClick={() => void handlePersonalize(item.id)}
                          disabled={queueBusyId === item.id}
                        >
                          <Zap className="mr-2 h-4 w-4" />
                          Personalize
                        </Button>
                        <Button
                          onClick={() => void handleSend(item.id)}
                          disabled={queueBusyId === item.id || item.state === 'sent'}
                          className="font-semibold"
                        >
                          <Send className="mr-2 h-4 w-4" />
                          {item.state === 'sent' ? 'Sent' : 'Send Now'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === 'accounts' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {data?.accounts.map((account) => (
            <Card key={account.id} className="bg-surface-1 border-surface-3 p-6 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-surface-3 bg-surface-2 p-3 text-white">
                  <Inbox className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{account.email}</h3>
                  <p className="text-xs text-text-secondary">{account.provider}</p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <AccountMeter label="Sender Health" current={account.healthScore} max={100} suffix="%" tone="success" />
                <AccountMeter label="Daily Volume" current={account.dailySent} max={account.dailyLimit} suffix="" tone="primary" />
              </div>

              <div className="mt-6 flex items-center justify-between">
                <span className={`rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] ${
                  account.status === 'Healthy'
                    ? 'border-success/20 bg-success/10 text-success'
                    : account.status === 'Warning'
                      ? 'border-warning/20 bg-warning/10 text-warning'
                      : account.status === 'Paused'
                        ? 'border-danger/20 bg-danger/10 text-danger'
                        : 'border-primary/20 bg-primary/10 text-primary'
                }`}>
                  {account.status}
                </span>
                <p className="text-xs text-text-secondary">
                  {account.dailySent} / {account.dailyLimit}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function MetricCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: React.ComponentType<any>;
}) {
  return (
    <Card className="bg-surface-1 border-surface-3 p-5 shadow-2xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-text-secondary">{title}</p>
          <p className="mt-3 text-3xl font-display font-bold text-white">{value}</p>
        </div>
        <div className="rounded-2xl border border-primary/20 bg-primary/10 p-3 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-surface-3 bg-[#0B0F14] p-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-secondary">{label}</p>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

function ReportStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-surface-3 bg-surface-1 px-3 py-2">
      <p className="text-[10px] uppercase tracking-[0.16em] text-text-secondary">{label}</p>
      <p className="mt-1 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

function AccountMeter({
  label,
  current,
  max,
  suffix,
  tone,
}: {
  label: string;
  current: number;
  max: number;
  suffix: string;
  tone: 'primary' | 'success';
}) {
  const width = max > 0 ? Math.min(100, (current / max) * 100) : 0;

  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="uppercase tracking-[0.16em] text-text-secondary">{label}</span>
        <span className="font-mono font-bold text-white">
          {current}
          {suffix}
          {suffix === '' ? ` / ${max}` : ''}
        </span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full border border-surface-3 bg-[#0B0F14]">
        <div className={`h-full ${tone === 'success' ? 'bg-success' : 'bg-primary'}`} style={{ width: `${Math.max(width, 4)}%` }} />
      </div>
    </div>
  );
}
