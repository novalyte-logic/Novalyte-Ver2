import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Activity,
  Cpu,
  Database,
  Loader2,
  Network,
  Pause,
  Play,
  RefreshCw,
  RotateCcw,
  Send,
  Server,
  Settings,
  Terminal,
  Zap,
} from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { SensitiveActionDialog } from '@/src/components/admin/SensitiveActionDialog';
import { AdminService } from '@/src/services/admin';
import type { McpResponse } from '@/src/lib/admin/types';

type Tab = 'topology' | 'queues' | 'events';

type PendingCommand =
  | { action: 'suspend' | 'resume' | 'restart_core' | 'flush_cache' | 'force_scaling' | 'halt_dispatch'; command?: string }
  | { action: 'command'; command: string }
  | null;

const TABS: Array<{ id: Tab; label: string; icon: React.ComponentType<any> }> = [
  { id: 'topology', label: 'Network Topology', icon: Network },
  { id: 'queues', label: 'Queue States', icon: Database },
  { id: 'events', label: 'Event Stream', icon: Activity },
];

export function MCPDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState<McpResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [commandInput, setCommandInput] = useState('');
  const [pendingCommand, setPendingCommand] = useState<PendingCommand>(null);
  const [submitting, setSubmitting] = useState(false);

  const tab = (searchParams.get('tab') as Tab) || 'topology';

  const loadData = async (silent = false) => {
    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError('');
    try {
      const response = await AdminService.getMcp();
      setData(response);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load MCP control center.');
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

  const terminalLines = useMemo(() => data?.logs.slice(0, 15) || [], [data]);

  const submitCommand = async (payload: { reason: string; confirmationCode: string }) => {
    if (!pendingCommand) {
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await AdminService.runMcpCommand({
        action: pendingCommand.action,
        command: pendingCommand.command,
        reason: payload.reason,
        confirmationCode: payload.confirmationCode,
      });
      setPendingCommand(null);
      setCommandInput('');
      await loadData(true);
    } catch (commandError) {
      setError(commandError instanceof Error ? commandError.message : 'Failed to execute operator command.');
    } finally {
      setSubmitting(false);
    }
  };

  const submitCustomCommand = () => {
    if (!commandInput.trim()) {
      setError('Enter an MCP command first.');
      return;
    }
    setPendingCommand({ action: 'command', command: commandInput.trim() });
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
        <p className="font-semibold text-white">MCP control center unavailable</p>
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
            <h1 className="text-3xl font-display font-bold text-white tracking-tight">MCP Control Center</h1>
            <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${
              data.isLive ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-warning/10 text-warning border border-warning/20'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${data.isLive ? 'bg-primary animate-pulse' : 'bg-warning'}`} />
              {data.isLive ? 'Orchestrator Online' : 'Orchestrator Paused'}
            </div>
          </div>
          <p className="text-text-secondary text-sm">Persisted orchestration state, live queue telemetry, and guarded intervention controls.</p>
          <p className="mt-3 text-xs uppercase tracking-[0.24em] text-text-secondary">{data.orchestratorVersion}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={() => setPendingCommand({ action: data.isLive ? 'suspend' : 'resume' })} className="border-surface-3 bg-[#0B0F14] text-white hover:bg-surface-2">
            {data.isLive ? (
              <>
                <Pause className="mr-2 h-4 w-4" />
                Suspend
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Resume
              </>
            )}
          </Button>
          <Button variant="outline" onClick={() => setPendingCommand({ action: 'restart_core' })} className="border-surface-3 bg-[#0B0F14] text-white hover:bg-surface-2">
            <RotateCcw className="mr-2 h-4 w-4" />
            Restart Core
          </Button>
          <Button variant="outline" onClick={() => void loadData(true)} className="border-surface-3 bg-[#0B0F14] text-white hover:bg-surface-2">
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-danger/25 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {data.services.map((service) => (
          <Card key={service.id} className="bg-surface-1 border-surface-3 p-5 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-text-secondary">{service.name}</p>
                <p className="mt-3 text-lg font-semibold text-white">{service.status}</p>
                <p className="mt-1 text-xs text-text-secondary">
                  {service.latencyMs ? `${service.latencyMs}ms latency` : 'Stateful service'}
                </p>
              </div>
              <div className={`rounded-2xl border p-3 ${
                service.tone === 'success'
                  ? 'border-success/20 bg-success/10 text-success'
                  : service.tone === 'warning'
                    ? 'border-warning/20 bg-warning/10 text-warning'
                    : service.tone === 'secondary'
                      ? 'border-secondary/20 bg-secondary/10 text-secondary'
                      : 'border-primary/20 bg-primary/10 text-primary'
              }`}>
                {service.id.includes('db') ? <Database className="h-5 w-5" /> : service.id.includes('worker') ? <Cpu className="h-5 w-5" /> : <Server className="h-5 w-5" />}
              </div>
            </div>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full border border-surface-3 bg-[#0B0F14]">
              <div
                className={`h-full ${
                  service.tone === 'success'
                    ? 'bg-success'
                    : service.tone === 'warning'
                      ? 'bg-warning'
                      : service.tone === 'secondary'
                        ? 'bg-secondary'
                        : 'bg-primary'
                }`}
                style={{ width: `${Math.max(6, Math.min(service.loadPercent, 100))}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-text-secondary">{service.loadPercent}% current load</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.65fr_1fr] gap-6">
        <Card className="bg-surface-1 border-surface-3 p-0 overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-surface-3 bg-gradient-to-r from-surface-2 to-surface-1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-1 bg-[#0B0F14] p-1 rounded-xl border border-surface-3">
              {TABS.map((entry) => {
                const Icon = entry.icon;
                const active = tab === entry.id;
                return (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => setSearchParams(new URLSearchParams({ tab: entry.id }))}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
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
          </div>

          <div className="min-h-[520px] bg-[#05070A] p-6">
            {tab === 'topology' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {data.services.map((service) => (
                  <div key={service.id} className="rounded-2xl border border-surface-3 bg-[#0B0F14] p-5">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-white">{service.name}</p>
                      <span className="rounded-full border border-surface-3 bg-surface-2 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-text-secondary">
                        {service.status}
                      </span>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-xs text-text-secondary">
                      <span>Latency</span>
                      <span>{service.latencyMs ? `${service.latencyMs}ms` : 'n/a'}</span>
                    </div>
                    <div className="mt-3 h-2 w-full overflow-hidden rounded-full border border-surface-3 bg-surface-1">
                      <div className="h-full bg-primary" style={{ width: `${Math.max(service.loadPercent, 5)}%` }} />
                    </div>
                    <p className="mt-2 text-xs text-text-secondary">{service.loadPercent}% utilization</p>
                  </div>
                ))}
              </div>
            ) : null}

            {tab === 'queues' ? (
              <div className="space-y-4">
                {data.queues.map((queue) => (
                  <div key={queue.id} className="rounded-2xl border border-surface-3 bg-[#0B0F14] p-5">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-white">{queue.name}</p>
                      <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
                        {queue.status}
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-3">
                      <QueueStat label="Pending" value={queue.pending} />
                      <QueueStat label="In Progress" value={queue.inProgress} />
                      <QueueStat label="Failed" value={queue.failed} />
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {tab === 'events' ? (
              <div className="space-y-3">
                {data.events.map((event) => (
                  <div key={event.id} className="rounded-xl border border-surface-3 bg-[#0B0F14] p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-white">{event.service}</p>
                        <p className="mt-1 text-xs text-text-secondary">{event.details}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-mono text-text-secondary">{new Date(event.timestamp).toLocaleString()}</p>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-primary">{event.type}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="bg-surface-1 border-surface-3 p-0 overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-surface-3 bg-gradient-to-r from-surface-2 to-surface-1 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-white">
                <Terminal className="h-4 w-4 text-secondary" />
                MCP Terminal
              </div>
              <div className="text-[10px] font-mono text-text-secondary">
                {refreshing ? 'Streaming…' : 'Live feed'}
              </div>
            </div>
            <div className="h-[360px] overflow-y-auto bg-[#05070A] p-4 font-mono text-[11px]">
              <div className="space-y-2">
                {terminalLines.map((line, index) => (
                  <div key={`${line}-${index}`} className="rounded-lg border border-surface-3 bg-[#0B0F14] px-3 py-2 text-text-secondary">
                    {line}
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-surface-3 bg-[#0B0F14] p-3 flex items-center gap-2">
              <span className="font-mono text-primary">❯</span>
              <input
                value={commandInput}
                onChange={(event) => setCommandInput(event.target.value)}
                placeholder="Enter MCP command..."
                className="h-10 w-full bg-transparent text-sm text-white outline-none placeholder:text-text-secondary"
              />
              <Button onClick={submitCustomCommand} className="font-semibold">
                Run
              </Button>
            </div>
          </Card>

          <Card className="bg-surface-1 border-surface-3 p-0 overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-surface-3 bg-gradient-to-r from-surface-2 to-surface-1 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-white">
              <Zap className="h-4 w-4 text-warning" />
              Intervention Controls
            </div>
            <div className="p-4 space-y-3">
              <InterventionButton label="Flush Redis Cache" onClick={() => setPendingCommand({ action: 'flush_cache' })} />
              <InterventionButton label="Force Worker Scaling" onClick={() => setPendingCommand({ action: 'force_scaling' })} />
              <InterventionButton label="Restart Routing Core" onClick={() => setPendingCommand({ action: 'restart_core' })} />
              <InterventionButton label="Halt Campaign Dispatch" tone="danger" onClick={() => setPendingCommand({ action: 'halt_dispatch' })} />
            </div>
          </Card>
        </div>
      </div>

      <SensitiveActionDialog
        open={pendingCommand !== null}
        title={
          pendingCommand?.action === 'command'
            ? 'Execute MCP Command'
            : pendingCommand?.action === 'halt_dispatch'
              ? 'Halt Campaign Dispatch'
              : pendingCommand?.action === 'restart_core'
                ? 'Restart MCP Core'
                : pendingCommand?.action === 'flush_cache'
                  ? 'Flush MCP Cache'
                  : pendingCommand?.action === 'force_scaling'
                    ? 'Force Worker Scaling'
                    : pendingCommand?.action === 'resume'
                      ? 'Resume Orchestrator'
                      : 'Suspend Orchestrator'
        }
        description={
          pendingCommand?.action === 'command'
            ? `This will record and execute the custom operator command "${pendingCommand.command}".`
            : 'This action mutates live orchestration state and writes a sensitive operator audit log.'
        }
        confirmLabel={pendingCommand?.action === 'command' ? 'Execute Command' : 'Confirm Action'}
        busy={submitting}
        onClose={() => setPendingCommand(null)}
        onConfirm={submitCommand}
      />
    </div>
  );
}

function QueueStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-surface-3 bg-surface-1 p-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-secondary">{label}</p>
      <p className="mt-2 text-xl font-semibold text-white">{value.toLocaleString()}</p>
    </div>
  );
}

function InterventionButton({
  label,
  onClick,
  tone = 'default',
}: {
  label: string;
  onClick: () => void;
  tone?: 'default' | 'danger';
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
        tone === 'danger'
          ? 'border-danger/20 bg-danger/10 text-danger hover:bg-danger/15'
          : 'border-surface-3 bg-[#0B0F14] text-white hover:border-primary/30'
      }`}
    >
      {label}
    </button>
  );
}
