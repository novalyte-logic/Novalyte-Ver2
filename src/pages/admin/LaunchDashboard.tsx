import React, { useState, useEffect } from 'react';
import { Card } from '@/src/components/ui/Card';
import { Rocket, Activity, Users, Server, CheckCircle2, AlertTriangle, RefreshCw, Terminal, Zap, ShieldCheck, Database, Globe } from 'lucide-react';

export function LaunchDashboard() {
  const [logs, setLogs] = useState<string[]>([
    "[INFO] 10:42:01 - Incoming webhook from Stripe processed.",
    "[INFO] 10:42:05 - New patient assessment completed (ID: 8821).",
    "[OK] 10:42:06 - Patient routed to Clinic ID: 42.",
    "[WARN] 10:42:15 - High memory usage on Worker Node 3.",
    "[INFO] 10:42:16 - Auto-scaling triggered. Adding 2 nodes.",
    "[OK] 10:42:45 - Worker nodes initialized successfully.",
    "[INFO] 10:43:01 - Daily sync with CMS provider started."
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newLogs = [
        `[INFO] ${new Date().toLocaleTimeString()} - Heartbeat check passed.`,
        `[OK] ${new Date().toLocaleTimeString()} - Cache hit ratio: 94.2%.`,
        `[INFO] ${new Date().toLocaleTimeString()} - Active WebSocket connections: ${Math.floor(Math.random() * 100) + 1400}.`
      ];
      setLogs(prev => [...prev, newLogs[Math.floor(Math.random() * newLogs.length)]].slice(-15));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary">Launch Dashboard</h1>
          <p className="text-text-secondary mt-1">Operational readiness and real-time deployment metrics.</p>
        </div>
        <div className="px-4 py-2 rounded-lg bg-success/10 border border-success/20 text-success font-mono text-sm flex items-center gap-2 shadow-[0_0_15px_rgba(46,230,166,0.2)]">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse shadow-[0_0_8px_rgba(46,230,166,0.8)]" />
          SYSTEM LIVE
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "API Uptime", value: "99.99%", icon: Server, color: "text-success", bg: "bg-success/10", border: "border-success/20" },
          { label: "Active Sessions", value: "1,402", icon: Users, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
          { label: "Triage Latency", value: "120ms", icon: Zap, color: "text-warning", bg: "bg-warning/10", border: "border-warning/20" },
          { label: "Deploy Status", value: "Stable", icon: Rocket, color: "text-secondary", bg: "bg-secondary/10", border: "border-secondary/20" },
        ].map((stat, i) => (
          <Card key={i} className="bg-surface-1 border-surface-3 p-6 flex flex-col items-center text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <stat.icon className={`w-32 h-32 ${stat.color}`} />
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} border ${stat.border} mb-4`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <h3 className="text-text-secondary text-sm font-medium mb-1 uppercase tracking-wider">{stat.label}</h3>
              <p className="text-4xl font-display font-bold text-text-primary">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-surface-1 border-surface-3 p-0 overflow-hidden flex flex-col lg:col-span-1">
          <div className="p-5 border-b border-surface-3 bg-surface-2/50 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-text-primary">Deployment Checklist</h2>
          </div>
          <div className="p-6 space-y-5 flex-grow">
            {[
              { label: "Database Migrations Completed", icon: Database },
              { label: "Redis Cache Warmed", icon: Server },
              { label: "CDN Edge Nodes Active", icon: Globe },
              { label: "Payment Gateways Verified", icon: ShieldCheck },
              { label: "Email Delivery Services Connected", icon: Activity },
              { label: "AI Models Loaded and Tested", icon: Zap }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="p-1.5 rounded-full bg-success/10 text-success border border-success/20 shadow-[0_0_10px_rgba(46,230,166,0.1)] group-hover:shadow-[0_0_15px_rgba(46,230,166,0.3)] transition-shadow">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-text-primary font-medium text-sm">{item.label}</span>
                  <span className="text-xs text-text-secondary flex items-center gap-1 mt-0.5">
                    <item.icon className="w-3 h-3" /> Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-surface-1 border-surface-3 p-0 overflow-hidden flex flex-col lg:col-span-2">
          <div className="p-5 border-b border-surface-3 bg-surface-2/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Terminal className="w-5 h-5 text-secondary" />
              <h2 className="text-lg font-bold text-text-primary">System Logs</h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-text-secondary bg-surface-2 px-3 py-1.5 rounded-md border border-surface-3">
              <RefreshCw className="w-3 h-3 animate-spin" /> Live Stream
            </div>
          </div>
          <div className="bg-[#0A0A0F] p-6 font-mono text-sm h-[400px] overflow-y-auto flex-grow flex flex-col justify-end">
            <div className="space-y-2">
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
