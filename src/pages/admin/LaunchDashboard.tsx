import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  Clock,
  Loader2,
  Pause,
  Play,
  Rocket,
  Server,
  Zap,
} from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { SensitiveActionDialog } from '@/src/components/admin/SensitiveActionDialog';
import { AdminService } from '@/src/services/admin';
import type { LaunchResponse } from '@/src/lib/admin/types';

type LaunchAction = 'pause' | 'resume' | 'trigger_blast';

export function LaunchDashboard() {
  const [data, setData] = useState<LaunchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [pendingAction, setPendingAction] = useState<LaunchAction | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadData = async (silent = false) => {
    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError('');
    try {
      const response = await AdminService.getLaunch();
      setData(response);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load launch controls.');
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

  const elapsed = useMemo(() => {
    if (!data) {
      return '00:00:00';
    }

    const hours = Math.floor(data.elapsedSeconds / 3600);
    const minutes = Math.floor((data.elapsedSeconds % 3600) / 60);
    const seconds = data.elapsedSeconds % 60;
    return [hours, minutes, seconds].map((part) => String(part).padStart(2, '0')).join(':');
  }, [data]);

  const handleAction = async (payload: { reason: string; confirmationCode: string }) => {
    if (!pendingAction) {
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await AdminService.controlLaunch({
        action: pendingAction,
        reason: payload.reason,
        confirmationCode: payload.confirmationCode,
      });
      setPendingAction(null);
      await loadData(true);
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : 'Failed to update launch controls.');
    } finally {
      setSubmitting(false);
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
        <p className="font-semibold text-white">Launch dashboard unavailable</p>
        <p className="mt-2 text-sm">{error}</p>
        <Button onClick={() => void loadData()} className="mt-4 font-semibold">
          Retry
        </Button>
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12 font-sans">
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 bg-surface-1/50 p-6 rounded-2xl border border-surface-3 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-display font-bold text-white tracking-tight">Launch Operations</h1>
            <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${
              data.isLive ? 'bg-success/10 text-success border border-success/20' : 'bg-warning/10 text-warning border border-warning/20'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${data.isLive ? 'bg-success animate-pulse' : 'bg-warning'}`} />
              {data.phase}
            </div>
          </div>
          <p className="text-text-secondary text-sm">Real rollout controls, campaign pressure, and launch health backed by admin state.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
          <div className="flex items-center gap-3 px-4 py-2 bg-[#0B0F14] rounded-xl border border-surface-3">
            <Clock className="w-4 h-4 text-primary" />
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-text-secondary">Elapsed</p>
              <p className="font-mono font-bold text-white">{elapsed}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setPendingAction(data.isLive ? 'pause' : 'resume')}
              className={`border-surface-3 ${data.isLive ? 'bg-warning/10 text-warning hover:bg-warning/20' : 'bg-success/10 text-success hover:bg-success/20'}`}
            >
              {data.isLive ? (
                <>
                  <Pause className="mr-2 h-4 w-4" />
                  Pause Rollout
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Resume Rollout
                </>
              )}
            </Button>
            <Button onClick={() => setPendingAction('trigger_blast')} className="bg-primary hover:bg-primary/90 text-black font-bold">
              <Zap className="mr-2 h-4 w-4" />
              Trigger Blast
            </Button>
            <Button variant="outline" onClick={() => void loadData(true)} className="border-surface-3 bg-[#0B0F14] text-white hover:bg-surface-2">
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-danger/25 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.metrics.map((metric) => (
          <Card key={metric.id} className="bg-surface-1 border-surface-3 p-5 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-text-secondary">{metric.label}</p>
                <p className="mt-3 text-3xl font-display font-bold text-white">{metric.formattedValue}</p>
                <p className="mt-2 text-xs text-text-secondary">Target {metric.target.toLocaleString()}</p>
              </div>
              <div className="rounded-2xl border border-primary/20 bg-primary/10 p-3 text-primary">
                {metric.id === 'registrations' ? <Rocket className="h-5 w-5" /> : null}
                {metric.id === 'activations' ? <Activity className="h-5 w-5" /> : null}
                {metric.id === 'gmv' ? <Zap className="h-5 w-5" /> : null}
                {metric.id === 'leads' ? <Server className="h-5 w-5" /> : null}
              </div>
            </div>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full border border-surface-3 bg-[#0B0F14]">
              <div
                className={`h-full ${metric.value >= metric.target ? 'bg-success' : 'bg-primary'}`}
                style={{ width: `${Math.max(5, Math.min(100, (metric.value / Math.max(metric.target, 1)) * 100))}%` }}
              />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-6">
        <Card className="bg-surface-1 border-surface-3 p-0 overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-surface-3 bg-gradient-to-r from-surface-2 to-surface-1 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-white">
            <Rocket className="h-4 w-4 text-primary" />
            Rollout Milestones
          </div>
          <div className="p-6">
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-surface-3" />
              <div className="space-y-6">
                {data.milestones.map((milestone) => (
                  <div key={milestone.id} className="relative pl-10">
                    <div className={`absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                      milestone.status === 'completed'
                        ? 'border-success text-success'
                        : milestone.status === 'active'
                          ? 'border-primary text-primary shadow-[0_0_12px_rgba(53,212,255,0.25)]'
                          : 'border-surface-3 text-text-secondary'
                    }`}>
                      <Rocket className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between gap-3">
                        <p className={`font-semibold ${milestone.status === 'active' ? 'text-primary' : 'text-white'}`}>{milestone.phase}</p>
                        <span className="text-xs font-mono text-text-secondary">{new Date(milestone.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="mt-2 text-sm text-text-secondary">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-surface-1 border-surface-3 p-0 overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-surface-3 bg-gradient-to-r from-surface-2 to-surface-1 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-white">
            <Server className="h-4 w-4 text-success" />
            System Health
          </div>
          <div className="p-5 space-y-5">
            {data.health.map((metric) => (
              <div key={metric.id}>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs uppercase tracking-[0.18em] text-text-secondary">{metric.label}</span>
                  <span className="text-sm font-mono font-bold text-white">{metric.formattedValue}</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full border border-surface-3 bg-[#0B0F14]">
                  <div
                    className={`h-full ${
                      metric.tone === 'success'
                        ? 'bg-success'
                        : metric.tone === 'warning'
                          ? 'bg-warning'
                          : metric.tone === 'secondary'
                            ? 'bg-secondary'
                            : metric.tone === 'danger'
                              ? 'bg-danger'
                              : 'bg-primary'
                    }`}
                    style={{ width: `${Math.max(6, Math.min(metric.value, 100))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-6">
        <Card className="bg-surface-1 border-surface-3 p-0 overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-surface-3 bg-gradient-to-r from-surface-2 to-surface-1 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-white">
            <Zap className="h-4 w-4 text-secondary" />
            Campaign Dispatch Status
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#0B0F14] text-[10px] uppercase tracking-[0.2em] text-text-secondary">
                <tr>
                  <th className="px-6 py-3">Campaign</th>
                  <th className="px-6 py-3">Channel</th>
                  <th className="px-6 py-3">Sent</th>
                  <th className="px-6 py-3">Open Rate</th>
                  <th className="px-6 py-3">Reply Rate</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-3 text-sm">
                {data.campaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-surface-2/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-white">{campaign.name}</td>
                    <td className="px-6 py-4 text-text-secondary">{campaign.channel}</td>
                    <td className="px-6 py-4 text-white">{campaign.sent.toLocaleString()}</td>
                    <td className="px-6 py-4 text-white">{campaign.openRate.toFixed(1)}%</td>
                    <td className="px-6 py-4 text-white">{campaign.clickRate.toFixed(1)}%</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] ${
                        campaign.status === 'Active'
                          ? 'border-success/20 bg-success/10 text-success'
                          : campaign.status === 'Paused'
                            ? 'border-warning/20 bg-warning/10 text-warning'
                            : 'border-primary/20 bg-primary/10 text-primary'
                      }`}>
                        {campaign.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="bg-surface-1 border-surface-3 p-0 overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-surface-3 bg-gradient-to-r from-surface-2 to-surface-1 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-white">
            <Activity className="h-4 w-4 text-warning" />
            Live Alerts
          </div>
          <div className="bg-[#05070A] p-4 font-mono text-[11px] overflow-y-auto h-[420px]">
            <div className="space-y-2">
              {data.alerts.map((log, index) => (
                <div key={`${log}-${index}`} className="rounded-lg border border-surface-3 bg-[#0B0F14] px-3 py-2 text-text-secondary">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <SensitiveActionDialog
        open={pendingAction !== null}
        title={
          pendingAction === 'pause'
            ? 'Pause National Rollout'
            : pendingAction === 'resume'
              ? 'Resume National Rollout'
              : 'Trigger Launch Blast'
        }
        description={
          pendingAction === 'trigger_blast'
            ? 'This dispatches up to 20 ready queue items from the live outreach backlog and records a launch event.'
            : 'This updates the live launch control state for the operator system and writes a sensitive audit log.'
        }
        confirmLabel={
          pendingAction === 'pause'
            ? 'Pause Rollout'
            : pendingAction === 'resume'
              ? 'Resume Rollout'
              : 'Trigger Blast'
        }
        busy={submitting}
        onClose={() => setPendingAction(null)}
        onConfirm={handleAction}
      />
    </div>
  );
}
