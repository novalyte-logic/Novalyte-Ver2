import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Briefcase,
  Building2,
  CircleAlert,
  Cpu,
  DollarSign,
  Globe,
  Loader2,
  Network,
  Search,
  Stethoscope,
  TrendingUp,
  Users,
} from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { AdminApiError, AdminService } from '@/src/services/admin';
import type { CommandCenterResponse } from '@/src/lib/admin/types';

type Mode = 'global' | 'revenue' | 'clinical' | 'growth';

const MODES: Array<{ id: Mode; label: string; icon: React.ComponentType<any> }> = [
  { id: 'global', label: 'Global Overview', icon: Globe },
  { id: 'revenue', label: 'Revenue Ops', icon: DollarSign },
  { id: 'clinical', label: 'Clinical Ops', icon: Stethoscope },
  { id: 'growth', label: 'Growth & Routing', icon: Network },
];

export function CommandCenter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState<CommandCenterResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const mode = (searchParams.get('mode') as Mode) || 'global';

  const loadData = async (silent = false) => {
    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError('');
    try {
      const response = await AdminService.getCommandCenter();
      setData(response);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load command center.');
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

  const filteredFeed = useMemo(() => {
    if (!data) {
      return [];
    }

    if (mode === 'revenue') {
      return data.feed.filter((event) =>
        ['order', 'campaign', 'audit'].includes(event.entityType) ||
        event.source.toLowerCase().includes('marketplace') ||
        event.source.toLowerCase().includes('outreach'),
      );
    }

    if (mode === 'clinical') {
      return data.feed.filter((event) =>
        ['staffingRequest', 'clinic', 'lead'].includes(event.entityType) ||
        event.source.toLowerCase().includes('workforce'),
      );
    }

    if (mode === 'growth') {
      return data.feed.filter((event) =>
        ['lead', 'campaign', 'clinic'].includes(event.entityType) ||
        event.source.toLowerCase().includes('assessment'),
      );
    }

    return data.feed;
  }, [data, mode]);

  const headerCopy = {
    global: 'One operator view across patients, clinics, vendors, workforce, and revenue.',
    revenue: 'Track subscriptions, marketplace demand, and operator-side monetization.',
    clinical: 'Monitor clinic verification, clinical demand, and staffing execution in one place.',
    growth: 'See intake pressure, campaign movement, and routing bottlenecks in real time.',
  }[mode];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card className="border-danger/20 bg-danger/10 p-6">
        <div className="flex items-start gap-3">
          <CircleAlert className="mt-0.5 h-5 w-5 text-danger" />
          <div className="space-y-3">
            <div>
              <h1 className="text-lg font-semibold text-white">Command Center unavailable</h1>
              <p className="mt-1 text-sm text-text-secondary">{error || 'No command center data returned.'}</p>
            </div>
            <Button onClick={() => void loadData()} className="font-semibold">
              Retry
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12 font-sans">
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 bg-surface-1/50 p-6 rounded-2xl border border-surface-3 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-display font-bold text-white tracking-tight">Command Center</h1>
            <div className="px-3 py-1 rounded-full border border-success/20 bg-success/10 text-success text-[10px] font-bold uppercase tracking-[0.24em]">
              {refreshing ? 'Refreshing' : 'Live Backend'}
            </div>
          </div>
          <p className="mt-2 text-sm text-text-secondary">{headerCopy}</p>
          <p className="mt-3 text-xs uppercase tracking-[0.24em] text-text-secondary">
            Signed in as {data.session.email}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
          <div className="flex p-1 bg-[#0B0F14] rounded-xl border border-surface-3 w-full sm:w-auto overflow-x-auto">
            {MODES.map((entry) => {
              const Icon = entry.icon;
              const active = entry.id === mode;
              return (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => setSearchParams({ mode: entry.id })}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
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

          <Button
            variant="outline"
            onClick={() => void loadData(true)}
            className="border-surface-3 bg-[#0B0F14] text-white hover:bg-surface-2"
          >
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {data.metrics.map((metric) => (
          <Card key={metric.id} className="bg-surface-1 border-surface-3 p-5 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-5 opacity-5">
              {metric.id === 'patients' ? <Users className="h-16 w-16" /> : null}
              {metric.id === 'clinics' ? <Building2 className="h-16 w-16" /> : null}
              {metric.id === 'revenue' ? <TrendingUp className="h-16 w-16" /> : null}
              {metric.id === 'triage' ? <Cpu className="h-16 w-16" /> : null}
              {metric.id === 'vendors' ? <Search className="h-16 w-16" /> : null}
              {metric.id === 'campaigns' ? <Activity className="h-16 w-16" /> : null}
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-text-secondary">{metric.label}</p>
                <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                  {metric.trend}
                </span>
              </div>
              <div className="mt-3 flex items-end justify-between gap-4">
                <div>
                  <p className="text-3xl font-display font-bold text-white">{metric.formattedValue}</p>
                </div>
                {metric.href ? (
                  <Link to={metric.href} className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover">
                    Open
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                ) : null}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_1.85fr] gap-6">
        <div className="space-y-6">
          <Card className="bg-surface-1 border-surface-3 p-0 overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-surface-3 bg-gradient-to-r from-surface-2 to-surface-1 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-[0.2em]">
                <AlertTriangle className="h-4 w-4 text-warning" />
                Operator Alerts
              </div>
              <span className="text-xs text-text-secondary">{data.alerts.length} active</span>
            </div>
            <div className="p-4 space-y-3">
              {data.alerts.length === 0 ? (
                <div className="rounded-xl border border-surface-3 bg-[#0B0F14] px-4 py-5 text-sm text-text-secondary">
                  No active operator alerts.
                </div>
              ) : (
                data.alerts.map((alert) => (
                  <div key={alert.id} className="rounded-xl border border-surface-3 bg-[#0B0F14] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-white">{alert.title}</p>
                      <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] ${
                        alert.severity === 'critical'
                          ? 'bg-danger/10 text-danger'
                          : alert.severity === 'warning'
                            ? 'bg-warning/10 text-warning'
                            : alert.severity === 'success'
                              ? 'bg-success/10 text-success'
                              : 'bg-primary/10 text-primary'
                      }`}>
                        {alert.severity}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-text-secondary">{alert.description}</p>
                    {alert.actionPath && alert.actionLabel ? (
                      <Link to={alert.actionPath} className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover">
                        {alert.actionLabel}
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    ) : null}
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card className="bg-surface-1 border-surface-3 p-0 overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-surface-3 bg-gradient-to-r from-surface-2 to-surface-1 flex items-center gap-2 text-sm font-bold text-white uppercase tracking-[0.2em]">
              <Cpu className="h-4 w-4 text-primary" />
              Pipeline Health
            </div>
            <div className="p-5 space-y-5">
              {data.pipelineHealth.map((metric) => (
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
                              : 'bg-primary'
                      }`}
                      style={{ width: `${Math.max(8, Math.min(metric.value, 100))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="bg-surface-1 border-surface-3 p-0 overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-surface-3 bg-gradient-to-r from-surface-2 to-surface-1 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-[0.2em]">
              <Network className="h-4 w-4 text-primary" />
              Operator Feed
            </div>
            <span className="text-xs text-text-secondary">{filteredFeed.length} events</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#0B0F14] text-[10px] uppercase tracking-[0.2em] text-text-secondary">
                <tr>
                  <th className="px-6 py-3">Event</th>
                  <th className="px-6 py-3">Source</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Open</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-3 text-sm">
                {filteredFeed.map((event) => (
                  <tr key={event.id} className="hover:bg-surface-2/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-white">{event.title}</p>
                      <p className="mt-1 text-xs text-text-secondary">{new Date(event.timestamp).toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4 text-text-secondary">{event.source}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-full border border-surface-3 bg-surface-2 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white">
                        {event.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {event.path ? (
                        <Link to={event.path} className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover">
                          Inspect
                          <ArrowUpRight className="h-4 w-4" />
                        </Link>
                      ) : (
                        <span className="text-text-secondary">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.25fr_1.25fr_1fr] gap-6">
        <Card className="bg-surface-1 border-surface-3 p-6 shadow-2xl">
          <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-[0.2em]">
            <DollarSign className="h-4 w-4 text-success" />
            Revenue Mix
          </div>
          <div className="mt-6 space-y-5">
            {data.revenueChannels.map((channel) => (
              <div key={channel.id}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-white">{channel.label}</p>
                    <p className="text-xs text-text-secondary">{channel.sharePercent}% of operator revenue</p>
                  </div>
                  <p className="text-sm font-mono font-bold text-success">{channel.formattedAmount}</p>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full border border-surface-3 bg-[#0B0F14]">
                  <div className="h-full bg-success" style={{ width: `${Math.max(channel.sharePercent, 6)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-surface-1 border-surface-3 p-6 shadow-2xl">
          <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-[0.2em]">
            <Briefcase className="h-4 w-4 text-secondary" />
            Workforce Watch
          </div>
          <div className="mt-6 space-y-4">
            {data.workforce.length === 0 ? (
              <p className="text-sm text-text-secondary">No active staffing workflows are currently open.</p>
            ) : (
              data.workforce.map((item) => (
                <Link key={item.id} to={item.path} className="block rounded-xl border border-surface-3 bg-[#0B0F14] p-4 hover:border-primary/30 transition-colors">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{item.clinicName}</p>
                      <p className="mt-1 text-xs text-text-secondary">{item.role}</p>
                    </div>
                    <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-3 text-xs text-text-secondary">{item.candidates} candidates attached</p>
                </Link>
              ))
            )}
          </div>
        </Card>

        <Card className="bg-surface-1 border-surface-3 p-6 shadow-2xl">
          <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-[0.2em]">
            <Users className="h-4 w-4 text-primary" />
            Control Surfaces
          </div>
          <div className="mt-6 space-y-4">
            {data.entities.map((entity) => (
              <Link key={entity.id} to={entity.path} className="block rounded-xl border border-surface-3 bg-[#0B0F14] p-4 hover:border-primary/30 transition-colors">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-white">{entity.label}</p>
                  <span className="text-sm font-mono font-bold text-primary">{entity.formattedCount}</span>
                </div>
                <p className="mt-2 text-xs text-text-secondary">{entity.description}</p>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
