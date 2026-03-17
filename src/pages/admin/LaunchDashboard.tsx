import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Rocket, Activity, Users, Server, CheckCircle2, AlertTriangle, 
  RefreshCw, Terminal, Zap, ShieldCheck, Database, Globe, 
  Play, Pause, Mail, MessageSquare, ArrowUpRight, Clock,
  BarChart3, CheckCircle, CircleDashed
} from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';

export function LaunchDashboard() {
  const [isLive, setIsLive] = useState(true);
  const [elapsedTime, setElapsedTime] = useState('04:12:45');
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
    if (!isLive) return;
    const interval = setInterval(() => {
      const newLogs = [
        `[INFO] ${new Date().toLocaleTimeString()} - Heartbeat check passed.`,
        `[OK] ${new Date().toLocaleTimeString()} - Cache hit ratio: 94.2%.`,
        `[INFO] ${new Date().toLocaleTimeString()} - Active WebSocket connections: ${Math.floor(Math.random() * 100) + 1400}.`,
        `[WARN] ${new Date().toLocaleTimeString()} - Minor latency spike in US-East routing.`,
        `[OK] ${new Date().toLocaleTimeString()} - Campaign batch #442 dispatched.`
      ];
      setLogs(prev => [...prev, newLogs[Math.floor(Math.random() * newLogs.length)]].slice(-15));
    }, 3000);
    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 bg-surface-1/50 p-6 rounded-2xl border border-surface-3 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-display font-bold text-white tracking-tight">Launch Operations</h1>
            <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${isLive ? 'bg-success/10 text-success border border-success/20' : 'bg-warning/10 text-warning border border-warning/20'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-success animate-pulse' : 'bg-warning'}`} />
              {isLive ? 'Phase 3: National Rollout' : 'Rollout Paused'}
            </div>
          </div>
          <p className="text-text-secondary text-sm">Operational readiness, rollout metrics, and campaign tracking.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
          <div className="flex items-center gap-3 px-4 py-2 bg-[#0B0F14] rounded-xl border border-surface-3">
            <Clock className="w-4 h-4 text-primary" />
            <div className="flex flex-col">
              <span className="text-[10px] text-text-secondary uppercase tracking-wider font-bold">Elapsed Time</span>
              <span className="font-mono text-white font-bold">{elapsedTime}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => setIsLive(!isLive)}
              variant="outline" 
              className={`flex items-center gap-2 border-surface-3 ${isLive ? 'bg-warning/10 text-warning hover:bg-warning/20 border-warning/20' : 'bg-success/10 text-success hover:bg-success/20 border-success/20'}`}
            >
              {isLive ? <><Pause className="w-4 h-4" /> Pause Rollout</> : <><Play className="w-4 h-4" /> Resume Rollout</>}
            </Button>
            <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-black font-bold">
              <Zap className="w-4 h-4" /> Trigger Blast
            </Button>
          </div>
        </div>
      </div>

      {/* Rollout Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="User Registrations" value="4,205" target="5,000" progress={84} icon={Users} color="text-primary" bg="bg-primary/10" border="border-primary/20" />
        <MetricCard title="Clinic Activations" value="142" target="150" progress={94} icon={Activity} color="text-secondary" bg="bg-secondary/10" border="border-secondary/20" />
        <MetricCard title="GMV Processed" value="$124k" target="$100k" progress={100} icon={BarChart3} color="text-success" bg="bg-success/10" border="border-success/20" />
        <MetricCard title="Lead Volume" value="1,840" target="2,000" progress={92} icon={Zap} color="text-warning" bg="bg-warning/10" border="border-warning/20" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Milestones & Campaigns */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Milestone Tracker */}
          <Card className="bg-surface-1 border-surface-3 p-0 overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-surface-3 bg-gradient-to-r from-surface-2 to-surface-1 flex items-center gap-3">
              <Rocket className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Rollout Milestones</h2>
            </div>
            <div className="p-6">
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-surface-3" />
                <div className="space-y-6">
                  {[
                    { phase: "Phase 1: Pre-Launch Prep", desc: "Database migrations, cache warming, edge node activation.", status: "completed", date: "08:00 AM" },
                    { phase: "Phase 2: Soft Launch", desc: "Open access to waitlist cohort A (1,000 users).", status: "completed", date: "09:30 AM" },
                    { phase: "Phase 3: National Rollout", desc: "General availability, full marketing blast, clinic activation.", status: "active", date: "10:00 AM" },
                    { phase: "Phase 4: Post-Launch Audit", desc: "Performance review, anomaly detection, scaling adjustments.", status: "pending", date: "02:00 PM" },
                  ].map((milestone, i) => (
                    <div key={i} className="relative pl-10">
                      <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center border-2 bg-surface-1 ${
                        milestone.status === 'completed' ? 'border-success text-success' :
                        milestone.status === 'active' ? 'border-primary text-primary shadow-[0_0_10px_rgba(53,212,255,0.3)]' :
                        'border-surface-3 text-surface-4'
                      }`}>
                        {milestone.status === 'completed' ? <CheckCircle className="w-4 h-4" /> : 
                         milestone.status === 'active' ? <Activity className="w-4 h-4 animate-pulse" /> : 
                         <CircleDashed className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={`font-bold ${milestone.status === 'active' ? 'text-primary' : 'text-white'}`}>{milestone.phase}</h3>
                          <span className="text-xs font-mono text-text-secondary">{milestone.date}</span>
                        </div>
                        <p className="text-sm text-text-secondary">{milestone.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Campaign Status */}
          <Card className="bg-surface-1 border-surface-3 p-0 overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-surface-3 bg-gradient-to-r from-surface-2 to-surface-1 flex items-center gap-3">
              <Mail className="w-4 h-4 text-secondary" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Active Campaigns</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="text-[10px] text-text-secondary uppercase tracking-wider bg-[#0B0F14] border-b border-surface-3">
                  <tr>
                    <th className="px-6 py-3 font-medium">Campaign Name</th>
                    <th className="px-6 py-3 font-medium">Channel</th>
                    <th className="px-6 py-3 font-medium">Sent</th>
                    <th className="px-6 py-3 font-medium">Open Rate</th>
                    <th className="px-6 py-3 font-medium">Click Rate</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-3 text-sm">
                  {[
                    { name: "Launch Announcement - Waitlist A", channel: "Email", sent: "1,000", open: "68%", click: "42%", status: "Completed" },
                    { name: "National Rollout Blast", channel: "Email", sent: "45,200", open: "24%", click: "8%", status: "Sending" },
                    { name: "Clinic Activation SMS", channel: "SMS", sent: "342", open: "98%", click: "65%", status: "Completed" },
                    { name: "Marketplace Promo - Equipment", channel: "Email", sent: "0", open: "-", click: "-", status: "Queued" },
                  ].map((camp, i) => (
                    <tr key={i} className="hover:bg-surface-2/50 transition-colors">
                      <td className="px-6 py-3.5 font-medium text-white">{camp.name}</td>
                      <td className="px-6 py-3.5 text-text-secondary">
                        <div className="flex items-center gap-1.5 text-xs">
                          {camp.channel === 'Email' ? <Mail className="w-3 h-3" /> : <MessageSquare className="w-3 h-3" />}
                          {camp.channel}
                        </div>
                      </td>
                      <td className="px-6 py-3.5 font-mono text-white">{camp.sent}</td>
                      <td className="px-6 py-3.5 font-mono text-white">{camp.open}</td>
                      <td className="px-6 py-3.5 font-mono text-white">{camp.click}</td>
                      <td className="px-6 py-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                          camp.status === 'Completed' ? 'bg-success/10 text-success border-success/20' :
                          camp.status === 'Sending' ? 'bg-primary/10 text-primary border-primary/20 animate-pulse' : 
                          'bg-surface-2 text-text-secondary border-surface-3'
                        }`}>
                          {camp.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

        </div>

        {/* Right Column: System Health & Alerts */}
        <div className="space-y-6">
          
          {/* System Health */}
          <Card className="bg-surface-1 border-surface-3 p-0 overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-surface-3 bg-gradient-to-r from-surface-2 to-surface-1 flex items-center gap-3">
              <Server className="w-4 h-4 text-success" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">System Health</h2>
            </div>
            <div className="p-5 font-mono text-xs space-y-5">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-text-secondary uppercase tracking-wider">API Latency</span> 
                  <span className="text-success font-bold">42ms</span>
                </div>
                <div className="w-full bg-[#0B0F14] h-1.5 rounded-full overflow-hidden border border-surface-3"><div className="bg-success h-full w-[15%] shadow-[0_0_10px_rgba(46,230,166,0.5)]" /></div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-text-secondary uppercase tracking-wider">Database Load</span> 
                  <span className="text-warning font-bold">68%</span>
                </div>
                <div className="w-full bg-[#0B0F14] h-1.5 rounded-full overflow-hidden border border-surface-3"><div className="bg-warning h-full w-[68%] shadow-[0_0_10px_rgba(255,184,77,0.5)]" /></div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-text-secondary uppercase tracking-wider">Active Connections</span> 
                  <span className="text-primary font-bold">1,402</span>
                </div>
                <div className="w-full bg-[#0B0F14] h-1.5 rounded-full overflow-hidden border border-surface-3"><div className="bg-primary h-full w-[45%] shadow-[0_0_10px_rgba(53,212,255,0.5)]" /></div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-text-secondary uppercase tracking-wider">Error Rate</span> 
                  <span className="text-success font-bold">0.01%</span>
                </div>
                <div className="w-full bg-[#0B0F14] h-1.5 rounded-full overflow-hidden border border-surface-3"><div className="bg-success h-full w-[2%] shadow-[0_0_10px_rgba(46,230,166,0.5)]" /></div>
              </div>
            </div>
          </Card>

          {/* Operational Alerts (Terminal) */}
          <Card className="bg-surface-1 border-surface-3 p-0 overflow-hidden flex flex-col h-[400px] shadow-2xl">
            <div className="p-4 border-b border-surface-3 bg-gradient-to-r from-surface-2 to-surface-1 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Terminal className="w-4 h-4 text-warning" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">Live Alerts</h2>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-text-secondary bg-[#0B0F14] px-2 py-1 rounded border border-surface-3">
                <RefreshCw className={`w-3 h-3 ${isLive ? 'animate-spin' : ''}`} /> {isLive ? 'Streaming' : 'Paused'}
              </div>
            </div>
            <div className="bg-[#05070A] p-4 font-mono text-[11px] overflow-y-auto flex-grow flex flex-col justify-end custom-scrollbar">
              <div className="space-y-2">
                {logs.map((log, i) => {
                  const isWarn = log.includes('[WARN]');
                  const isOk = log.includes('[OK]');
                  return (
                    <div key={i} className="flex items-start gap-2 animate-in fade-in slide-in-from-bottom-2">
                      <span className="text-surface-4 select-none mt-0.5">›</span>
                      <p className={`leading-relaxed break-all ${
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
    </div>
  );
}

// Helper Components

function MetricCard({ title, value, target, progress, icon: Icon, color, bg, border }: any) {
  return (
    <Card className="bg-surface-1 border-surface-3 p-5 relative overflow-hidden group shadow-2xl">
      <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity ${color}`}>
        <Icon className="w-24 h-24" />
      </div>
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-2 rounded-xl ${bg} ${color} border ${border}`}><Icon className="w-4 h-4" /></div>
          <span className="text-[10px] font-bold font-mono text-text-secondary uppercase tracking-wider">
            Target: {target}
          </span>
        </div>
        <h3 className="text-text-secondary text-xs font-bold uppercase tracking-wider mb-1">{title}</h3>
        <p className="text-3xl font-display font-bold text-white mb-4">{value}</p>
        
        <div className="w-full bg-[#0B0F14] h-1.5 rounded-full overflow-hidden border border-surface-3">
          <div className={`h-full rounded-full ${bg.replace('/10', '')}`} style={{ width: `${progress}%` }} />
        </div>
      </div>
    </Card>
  );
}
