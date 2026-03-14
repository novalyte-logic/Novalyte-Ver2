import React, { useState, useEffect } from 'react';
import { Card } from '@/src/components/ui/Card';
import { Server, Activity, Database, Zap, ArrowRight, ShieldCheck, Cpu, Network, Lock, Terminal, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';

export function MCPDashboard() {
  const [logs, setLogs] = useState<string[]>([
    "[SYSTEM] MCP Core initialized. Awaiting commands.",
    "[ROUTER] Ingress traffic normalized. 1.2k req/s.",
    "[AI_NODE] Model weights loaded. Inference latency: 850ms.",
    "[DB_SYNC] Primary database replication synced.",
    "[SECURITY] WAF rules updated. 14 threats blocked."
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newLogs = [
        `[ROUTER] ${new Date().toLocaleTimeString()} - Traffic spike detected and mitigated.`,
        `[AI_NODE] ${new Date().toLocaleTimeString()} - Batch inference completed. Queue: 0.`,
        `[SYSTEM] ${new Date().toLocaleTimeString()} - Resource utilization nominal.`
      ];
      setLogs(prev => [...prev, newLogs[Math.floor(Math.random() * newLogs.length)]].slice(-10));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary">MCP Control</h1>
          <p className="text-text-secondary mt-1">Master Control Program & Orchestration Infrastructure.</p>
        </div>
        <div className="px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary font-mono text-sm flex items-center gap-2 shadow-[0_0_15px_rgba(53,212,255,0.2)]">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(53,212,255,0.8)]" />
          ORCHESTRATOR ONLINE
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-surface-1 border-surface-3 p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Server className="w-24 h-24 text-primary" />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20"><Server className="w-5 h-5" /></div>
              <span className="flex items-center text-success text-sm font-mono bg-success/10 px-2 py-1 rounded-md border border-success/20">
                Online
              </span>
            </div>
            <h3 className="text-text-secondary text-sm font-medium mb-1 uppercase tracking-wider">API Gateway</h3>
            <div className="space-y-2 mt-4 font-mono text-sm">
              <div className="flex justify-between"><span className="text-text-secondary">Throughput:</span> <span className="text-text-primary">1.2k req/s</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Error Rate:</span> <span className="text-success">0.01%</span></div>
            </div>
          </div>
        </Card>

        <Card className="bg-surface-1 border-surface-3 p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Database className="w-24 h-24 text-secondary" />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 rounded-xl bg-secondary/10 text-secondary border border-secondary/20"><Database className="w-5 h-5" /></div>
              <span className="flex items-center text-success text-sm font-mono bg-success/10 px-2 py-1 rounded-md border border-success/20">
                Healthy
              </span>
            </div>
            <h3 className="text-text-secondary text-sm font-medium mb-1 uppercase tracking-wider">Primary DB</h3>
            <div className="space-y-2 mt-4 font-mono text-sm">
              <div className="flex justify-between"><span className="text-text-secondary">Connections:</span> <span className="text-text-primary">450/1000</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Replication:</span> <span className="text-success">Synced</span></div>
            </div>
          </div>
        </Card>

        <Card className="bg-surface-1 border-surface-3 p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Zap className="w-24 h-24 text-warning" />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 rounded-xl bg-warning/10 text-warning border border-warning/20"><Zap className="w-5 h-5" /></div>
              <span className="flex items-center text-success text-sm font-mono bg-success/10 px-2 py-1 rounded-md border border-success/20">
                Active
              </span>
            </div>
            <h3 className="text-text-secondary text-sm font-medium mb-1 uppercase tracking-wider">AI Inference</h3>
            <div className="space-y-2 mt-4 font-mono text-sm">
              <div className="flex justify-between"><span className="text-text-secondary">Avg Latency:</span> <span className="text-text-primary">850ms</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Queue:</span> <span className="text-warning">12 items</span></div>
            </div>
          </div>
        </Card>

        <Card className="bg-surface-1 border-surface-3 p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <ShieldCheck className="w-24 h-24 text-success" />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 rounded-xl bg-success/10 text-success border border-success/20"><ShieldCheck className="w-5 h-5" /></div>
              <span className="flex items-center text-success text-sm font-mono bg-success/10 px-2 py-1 rounded-md border border-success/20">
                Secure
              </span>
            </div>
            <h3 className="text-text-secondary text-sm font-medium mb-1 uppercase tracking-wider">Security</h3>
            <div className="space-y-2 mt-4 font-mono text-sm">
              <div className="flex justify-between"><span className="text-text-secondary">WAF Status:</span> <span className="text-success">Enforcing</span></div>
              <div className="flex justify-between"><span className="text-text-secondary">Threats Blocked:</span> <span className="text-text-primary">142</span></div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-surface-1 border-surface-3 p-0 overflow-hidden flex flex-col lg:col-span-2">
          <div className="p-5 border-b border-surface-3 bg-surface-2/50 flex items-center gap-3">
            <Network className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-text-primary">Routing Topology</h2>
          </div>
          <div className="relative h-80 bg-[#0A0A0F] flex items-center justify-center overflow-hidden flex-grow">
            {/* Abstract representation of routing */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
            
            <div className="flex items-center justify-between w-full max-w-4xl px-12 relative z-10">
              <div className="flex flex-col items-center gap-3 group">
                <div className="w-20 h-20 rounded-2xl bg-surface-2 border border-surface-3 flex items-center justify-center shadow-lg group-hover:border-text-secondary transition-colors">
                  <Activity className="w-10 h-10 text-text-secondary group-hover:text-text-primary transition-colors" />
                </div>
                <span className="text-sm font-mono text-text-secondary uppercase tracking-wider">Ingress</span>
              </div>
              
              <div className="flex-grow flex items-center justify-center relative">
                <div className="h-0.5 w-full bg-surface-3 absolute" />
                <div className="h-0.5 w-1/2 bg-primary absolute left-0 animate-[pulse_2s_ease-in-out_infinite]" />
                <ArrowRight className="w-6 h-6 text-primary absolute right-1/2 translate-x-1/2 bg-[#0A0A0F] px-1" />
              </div>
              
              <div className="flex flex-col items-center gap-3 group">
                <div className="w-28 h-28 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center shadow-[0_0_30px_rgba(53,212,255,0.1)] group-hover:shadow-[0_0_40px_rgba(53,212,255,0.2)] transition-shadow">
                  <Cpu className="w-14 h-14 text-primary" />
                </div>
                <span className="text-sm font-mono text-primary font-bold uppercase tracking-wider">MCP Core</span>
              </div>
              
              <div className="flex-grow flex items-center justify-center relative">
                <div className="h-0.5 w-full bg-surface-3 absolute" />
                <div className="h-0.5 w-1/2 bg-secondary absolute left-0 animate-[pulse_2s_ease-in-out_infinite_0.5s]" />
                <ArrowRight className="w-6 h-6 text-secondary absolute right-1/2 translate-x-1/2 bg-[#0A0A0F] px-1" />
              </div>
              
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4 group">
                  <div className="w-14 h-14 rounded-xl bg-surface-2 border border-surface-3 flex items-center justify-center group-hover:border-secondary transition-colors">
                    <span className="text-sm font-bold font-mono text-text-secondary group-hover:text-secondary">C1</span>
                  </div>
                  <span className="text-xs font-mono text-text-secondary uppercase">Clinic Node</span>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-14 h-14 rounded-xl bg-surface-2 border border-surface-3 flex items-center justify-center group-hover:border-secondary transition-colors">
                    <span className="text-sm font-bold font-mono text-text-secondary group-hover:text-secondary">C2</span>
                  </div>
                  <span className="text-xs font-mono text-text-secondary uppercase">Clinic Node</span>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-14 h-14 rounded-xl bg-surface-2 border border-surface-3 flex items-center justify-center group-hover:border-secondary transition-colors">
                    <span className="text-sm font-bold font-mono text-text-secondary group-hover:text-secondary">C3</span>
                  </div>
                  <span className="text-xs font-mono text-text-secondary uppercase">Clinic Node</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-surface-1 border-surface-3 p-0 overflow-hidden flex flex-col lg:col-span-1">
          <div className="p-5 border-b border-surface-3 bg-surface-2/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Terminal className="w-5 h-5 text-secondary" />
              <h2 className="text-lg font-bold text-text-primary">Orchestrator Logs</h2>
            </div>
          </div>
          <div className="bg-[#0A0A0F] p-6 font-mono text-sm h-80 overflow-y-auto flex-grow flex flex-col justify-end">
            <div className="space-y-3">
              {logs.map((log, i) => {
                const isWarn = log.includes('[WARN]');
                const isOk = log.includes('[OK]');
                return (
                  <div key={i} className="flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2">
                    <span className="text-surface-3 select-none">›</span>
                    <p className={`leading-relaxed ${
                      isWarn ? 'text-warning' : 
                      isOk ? 'text-success' : 
                      'text-text-secondary'
                    }`}>
                      {log.replace(/\[(.*?)\]/, (match) => {
                        const type = match.replace(/[\[\]]/g, '');
                        const colorClass = type === 'WARN' ? 'text-warning' : type === 'OK' ? 'text-success' : 'text-primary';
                        return `<span class="${colorClass} font-bold">[${type}]</span>`;
                      }).split('<span').map((part, index) => {
                        if (index === 0) return part;
                        const match = part.match(/class="(.*?)"(.*?)>(.*?)<\/span>(.*)/);
                        if (match) {
                          return (
                            <React.Fragment key={index}>
                              <span className={match[1]}>{match[3]}</span>
                              {match[4]}
                            </React.Fragment>
                          );
                        }
                        return part;
                      })}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
