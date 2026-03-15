import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Server, Activity, Database, Zap, ArrowRight, ShieldCheck, Cpu, 
  Network, Lock, Terminal, RefreshCw, AlertTriangle, CheckCircle2,
  GitBranch, Play, Pause, RotateCcw, Settings, HardDrive, Wifi,
  Clock, ArrowUpRight, ArrowDownRight, Search, Filter, Box, Globe
} from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';

export function MCPDashboard() {
  const [isLive, setIsLive] = useState(true);
  const [activeTab, setActiveTab] = useState<'topology' | 'queues' | 'events'>('topology');
  const [logs, setLogs] = useState<string[]>([
    "[SYSTEM] MCP Core initialized. Awaiting commands.",
    "[ROUTER] Ingress traffic normalized. 1.2k req/s.",
    "[AI_NODE] Model weights loaded. Inference latency: 850ms.",
    "[DB_SYNC] Primary database replication synced.",
    "[SECURITY] WAF rules updated. 14 threats blocked."
  ]);

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      const newLogs = [
        `[ROUTER] ${new Date().toLocaleTimeString()} - Traffic spike detected and mitigated.`,
        `[AI_NODE] ${new Date().toLocaleTimeString()} - Batch inference completed. Queue: 0.`,
        `[SYSTEM] ${new Date().toLocaleTimeString()} - Resource utilization nominal.`,
        `[WORKER] ${new Date().toLocaleTimeString()} - Job #8821 processed successfully.`,
        `[WARN] ${new Date().toLocaleTimeString()} - Minor latency in DB replica sync.`
      ];
      setLogs(prev => [...prev, newLogs[Math.floor(Math.random() * newLogs.length)]].slice(-15));
    }, 2500);
    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 bg-surface-1/50 p-6 rounded-2xl border border-surface-3 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-display font-bold text-white tracking-tight">MCP Control Center</h1>
            <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${isLive ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-warning/10 text-warning border border-warning/20'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-primary animate-pulse' : 'bg-warning'}`} />
              {isLive ? 'Orchestrator Online' : 'Orchestrator Paused'}
            </div>
          </div>
          <p className="text-text-secondary text-sm">Master Control Program: Technical orchestration, pipelines, and service health.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
          <div className="flex items-center gap-2 bg-[#0B0F14] p-1 rounded-xl border border-surface-3">
            <Button 
              onClick={() => setIsLive(!isLive)}
              variant="ghost" 
              className={`h-9 px-3 flex items-center gap-2 text-xs font-bold ${isLive ? 'text-warning hover:text-warning hover:bg-warning/10' : 'text-success hover:text-success hover:bg-success/10'}`}
            >
              {isLive ? <><Pause className="w-3.5 h-3.5" /> Suspend</> : <><Play className="w-3.5 h-3.5" /> Resume</>}
            </Button>
            <div className="w-px h-4 bg-surface-3" />
            <Button variant="ghost" className="h-9 px-3 flex items-center gap-2 text-xs font-bold text-text-secondary hover:text-white">
              <RotateCcw className="w-3.5 h-3.5" /> Restart Core
            </Button>
            <div className="w-px h-4 bg-surface-3" />
            <Button variant="ghost" className="h-9 px-3 flex items-center gap-2 text-xs font-bold text-text-secondary hover:text-white">
              <Settings className="w-3.5 h-3.5" /> Config
            </Button>
          </div>
        </div>
      </div>

      {/* Service Health Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        <ServiceCard name="API Gateway" status="Online" latency="42ms" load="34%" icon={Server} color="text-primary" />
        <ServiceCard name="AI Inference" status="Active" latency="850ms" load="88%" icon={Cpu} color="text-secondary" />
        <ServiceCard name="Primary DB" status="Healthy" latency="12ms" load="45%" icon={Database} color="text-success" />
        <ServiceCard name="Worker Nodes" status="Scaling" latency="-" load="92%" icon={Box} color="text-warning" isWarning />
        <ServiceCard name="WAF Security" status="Enforcing" latency="5ms" load="12%" icon={ShieldCheck} color="text-primary" />
      </div>

      {/* Main Orchestration Area */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left/Center: Topology & Queues */}
        <div className="xl:col-span-2 space-y-6">
          <Card className="bg-surface-1 border-surface-3 p-0 overflow-hidden shadow-2xl flex flex-col h-[600px]">
            {/* Toolbar */}
            <div className="p-4 border-b border-surface-3 bg-gradient-to-r from-surface-2 to-surface-1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-1 bg-[#0B0F14] p-1 rounded-xl border border-surface-3">
                {[
                  { id: 'topology', label: 'Network Topology', icon: Network },
                  { id: 'queues', label: 'Queue States', icon: Database },
                  { id: 'events', label: 'Event Stream', icon: Activity },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                        activeTab === tab.id 
                          ? 'bg-primary/10 text-primary shadow-[0_0_15px_rgba(53,212,255,0.1)]' 
                          : 'text-text-secondary hover:text-white hover:bg-surface-2'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
              
              {activeTab === 'events' && (
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-secondary" />
                    <input type="text" placeholder="Filter events..." className="w-full pl-9 pr-3 py-1.5 bg-[#0B0F14] border border-surface-3 rounded-lg text-xs text-white focus:outline-none focus:border-primary/50 transition-colors" />
                  </div>
                  <Button variant="outline" size="sm" className="h-8 px-2 border-surface-3 bg-[#0B0F14]"><Filter className="w-3.5 h-3.5" /></Button>
                </div>
              )}
            </div>

            {/* Content Area */}
            <div className="flex-grow relative bg-[#05070A] overflow-hidden">
              <AnimatePresence mode="wait">
                {activeTab === 'topology' && (
                  <motion.div 
                    key="topology"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center p-8"
                  >
                    <TopologyView />
                  </motion.div>
                )}
                {activeTab === 'queues' && (
                  <motion.div 
                    key="queues"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 p-6 overflow-y-auto custom-scrollbar"
                  >
                    <QueueStatesView />
                  </motion.div>
                )}
                {activeTab === 'events' && (
                  <motion.div 
                    key="events"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 p-0 overflow-y-auto custom-scrollbar"
                  >
                    <EventStreamView />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>
        </div>

        {/* Right: Terminal & Interventions */}
        <div className="space-y-6">
          
          {/* Terminal */}
          <Card className="bg-surface-1 border-surface-3 p-0 overflow-hidden flex flex-col h-[400px] shadow-2xl">
            <div className="p-4 border-b border-surface-3 bg-gradient-to-r from-surface-2 to-surface-1 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Terminal className="w-4 h-4 text-secondary" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">MCP Terminal</h2>
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
            {/* Command Input */}
            <div className="p-3 bg-[#0B0F14] border-t border-surface-3 flex items-center gap-2">
              <span className="text-primary font-mono text-sm">❯</span>
              <input 
                type="text" 
                placeholder="Enter MCP command..." 
                className="w-full bg-transparent border-none text-white font-mono text-xs focus:outline-none placeholder:text-surface-4"
                disabled={!isLive}
              />
            </div>
          </Card>

          {/* Intervention Controls */}
          <Card className="bg-surface-1 border-surface-3 p-0 overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-surface-3 bg-gradient-to-r from-surface-2 to-surface-1 flex items-center gap-3">
              <Zap className="w-4 h-4 text-warning" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Intervention Controls</h2>
            </div>
            <div className="p-4 space-y-3">
              <InterventionButton label="Flush Redis Cache" desc="Clears all non-persistent cached data." icon={Database} />
              <InterventionButton label="Force Worker Scaling" desc="Manually adds 5 worker nodes to pool." icon={Box} />
              <InterventionButton label="Restart Routing Engine" desc="Graceful restart of ingress router." icon={Network} />
              <InterventionButton label="Halt Campaign Dispatch" desc="Emergency stop for all outbound comms." icon={AlertTriangle} isDanger />
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}

// Sub-Views

function TopologyView() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Background Grid/Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      
      <div className="flex items-center justify-between w-full max-w-4xl relative z-10">
        {/* Ingress */}
        <div className="flex flex-col items-center gap-3 group">
          <div className="w-20 h-20 rounded-2xl bg-[#0B0F14] border border-surface-3 flex items-center justify-center shadow-lg group-hover:border-primary transition-colors relative">
            <Globe className="w-8 h-8 text-text-secondary group-hover:text-primary transition-colors" />
            <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-success border-2 border-[#0B0F14]" />
          </div>
          <div className="text-center">
            <span className="text-xs font-mono text-white font-bold uppercase tracking-wider block">Ingress</span>
            <span className="text-[10px] text-text-secondary font-mono">1.2k req/s</span>
          </div>
        </div>
        
        {/* Connection 1 */}
        <div className="flex-grow flex items-center justify-center relative px-4">
          <div className="h-0.5 w-full bg-surface-3 absolute" />
          <div className="h-0.5 w-1/2 bg-primary absolute left-0 animate-[pulse_1.5s_ease-in-out_infinite]" />
          <ArrowRight className="w-5 h-5 text-primary absolute right-1/2 translate-x-1/2 bg-[#05070A] px-1" />
        </div>
        
        {/* MCP Core */}
        <div className="flex flex-col items-center gap-3 group">
          <div className="w-32 h-32 rounded-3xl bg-primary/5 border border-primary/30 flex items-center justify-center shadow-[0_0_30px_rgba(53,212,255,0.1)] group-hover:shadow-[0_0_50px_rgba(53,212,255,0.2)] transition-shadow relative">
            <Cpu className="w-12 h-12 text-primary" />
            <div className="absolute inset-0 rounded-3xl border border-primary/20 animate-ping opacity-20" />
          </div>
          <div className="text-center">
            <span className="text-sm font-mono text-primary font-bold uppercase tracking-wider block">MCP Core</span>
            <span className="text-[10px] text-text-secondary font-mono">v2.4.1-stable</span>
          </div>
        </div>
        
        {/* Connection 2 */}
        <div className="flex-grow flex items-center justify-center relative px-4">
          <div className="h-0.5 w-full bg-surface-3 absolute" />
          <div className="h-0.5 w-1/2 bg-secondary absolute left-0 animate-[pulse_1.5s_ease-in-out_infinite_0.5s]" />
          <ArrowRight className="w-5 h-5 text-secondary absolute right-1/2 translate-x-1/2 bg-[#05070A] px-1" />
        </div>
        
        {/* Services */}
        <div className="flex flex-col gap-6">
          <TopologyNode label="Database" icon={Database} color="text-success" border="border-success/30" value="12ms" />
          <TopologyNode label="AI Inference" icon={Zap} color="text-warning" border="border-warning/30" value="850ms" />
          <TopologyNode label="Worker Pool" icon={Box} color="text-secondary" border="border-secondary/30" value="42 nodes" />
        </div>
      </div>
    </div>
  );
}

function TopologyNode({ label, icon: Icon, color, border, value }: any) {
  return (
    <div className="flex items-center gap-4 group">
      <div className={`w-14 h-14 rounded-xl bg-[#0B0F14] border ${border} flex items-center justify-center shadow-lg relative`}>
        <Icon className={`w-6 h-6 ${color}`} />
        <div className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-success border-2 border-[#0B0F14]" />
      </div>
      <div>
        <span className="text-xs font-mono text-white font-bold uppercase tracking-wider block">{label}</span>
        <span className="text-[10px] text-text-secondary font-mono">{value}</span>
      </div>
    </div>
  );
}

function QueueStatesView() {
  return (
    <div className="space-y-6">
      <QueueCard 
        name="Patient Triage Queue" 
        status="Processing" 
        items={124} 
        rate="45/min" 
        latency="1.2s" 
        color="bg-primary" 
        textColor="text-primary" 
      />
      <QueueCard 
        name="Campaign Dispatch (Email)" 
        status="High Volume" 
        items={4520} 
        rate="1200/min" 
        latency="0.5s" 
        color="bg-warning" 
        textColor="text-warning" 
      />
      <QueueCard 
        name="AI Inference Batch" 
        status="Nominal" 
        items={12} 
        rate="120/min" 
        latency="850ms" 
        color="bg-secondary" 
        textColor="text-secondary" 
      />
      <QueueCard 
        name="Webhook Delivery" 
        status="Nominal" 
        items={0} 
        rate="300/min" 
        latency="45ms" 
        color="bg-success" 
        textColor="text-success" 
      />
    </div>
  );
}

function QueueCard({ name, status, items, rate, latency, color, textColor }: any) {
  const progress = Math.min((items / 5000) * 100, 100) || 2; // Ensure at least a sliver shows
  return (
    <div className="p-5 bg-[#0B0F14] rounded-xl border border-surface-3">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-sm font-bold text-white mb-1">{name}</h3>
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${textColor} border-current bg-current/10`}>
            {status}
          </span>
        </div>
        <div className="text-right">
          <p className="text-2xl font-mono font-bold text-white">{items}</p>
          <p className="text-[10px] text-text-secondary uppercase tracking-wider">Items in Queue</p>
        </div>
      </div>
      
      <div className="w-full bg-surface-2 h-2 rounded-full overflow-hidden border border-surface-3 mb-4">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${progress}%` }} />
      </div>
      
      <div className="grid grid-cols-2 gap-4 border-t border-surface-3 pt-4">
        <div>
          <p className="text-[10px] text-text-secondary uppercase tracking-wider mb-1">Processing Rate</p>
          <p className="text-sm font-mono text-white">{rate}</p>
        </div>
        <div>
          <p className="text-[10px] text-text-secondary uppercase tracking-wider mb-1">Avg Latency</p>
          <p className="text-sm font-mono text-white">{latency}</p>
        </div>
      </div>
    </div>
  );
}

function EventStreamView() {
  return (
    <table className="w-full text-left border-collapse">
      <thead className="text-[10px] text-text-secondary uppercase tracking-wider bg-[#0B0F14] border-b border-surface-3 sticky top-0 z-10">
        <tr>
          <th className="px-6 py-3 font-medium">Timestamp</th>
          <th className="px-6 py-3 font-medium">Service</th>
          <th className="px-6 py-3 font-medium">Event Type</th>
          <th className="px-6 py-3 font-medium">Payload / Details</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-surface-3 text-sm font-mono">
        {[
          { time: "10:42:01.245", service: "API_GATEWAY", type: "REQ_IN", details: "POST /api/triage/submit - 200 OK (45ms)" },
          { time: "10:42:01.302", service: "WORKER_POOL", type: "JOB_START", details: "Job ID: 8821 - Triage Processing" },
          { time: "10:42:02.150", service: "AI_NODE", type: "INFERENCE", details: "Model: gemini-pro - Latency: 845ms" },
          { time: "10:42:02.201", service: "DB_PRIMARY", type: "WRITE", details: "Table: patient_assessments - Rows: 1" },
          { time: "10:42:02.255", service: "ROUTER", type: "DISPATCH", details: "Lead routed to Clinic ID: 42" },
          { time: "10:42:05.001", service: "WAF", type: "BLOCK", details: "IP: 192.168.1.x - Reason: Rate Limit Exceeded" },
          { time: "10:42:15.420", service: "SYSTEM", type: "SCALE_UP", details: "Adding 2 nodes to WORKER_POOL" },
          { time: "10:42:45.100", service: "WORKER_POOL", type: "NODE_READY", details: "Nodes [W-42, W-43] online and accepting jobs" },
        ].map((event, i) => (
          <tr key={i} className="hover:bg-surface-2/50 transition-colors">
            <td className="px-6 py-3 text-text-secondary text-xs">{event.time}</td>
            <td className="px-6 py-3">
              <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                {event.service}
              </span>
            </td>
            <td className="px-6 py-3 text-white text-xs">{event.type}</td>
            <td className="px-6 py-3 text-text-secondary text-xs truncate max-w-md">{event.details}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Helper Components

function ServiceCard({ name, status, latency, load, icon: Icon, color, isWarning }: any) {
  return (
    <div className="bg-[#0B0F14] border border-surface-3 rounded-xl p-4 relative overflow-hidden group">
      <div className={`absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity ${color}`}>
        <Icon className="w-16 h-16" />
      </div>
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-3">
          <div className={`p-2 rounded-lg bg-surface-2 border border-surface-3 text-white`}><Icon className="w-4 h-4" /></div>
          <span className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${isWarning ? 'text-warning' : 'text-success'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isWarning ? 'bg-warning' : 'bg-success'}`} />
            {status}
          </span>
        </div>
        <h3 className="text-white text-sm font-bold mb-3">{name}</h3>
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div>
            <p className="text-text-secondary mb-0.5">Latency</p>
            <p className="text-white">{latency}</p>
          </div>
          <div>
            <p className="text-text-secondary mb-0.5">Load</p>
            <p className={isWarning ? 'text-warning' : 'text-white'}>{load}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InterventionButton({ label, desc, icon: Icon, isDanger }: any) {
  return (
    <button className={`w-full flex items-start gap-3 p-3 rounded-xl border transition-all text-left ${
      isDanger 
        ? 'bg-danger/5 border-danger/20 hover:bg-danger/10 hover:border-danger/40' 
        : 'bg-[#0B0F14] border-surface-3 hover:bg-surface-2 hover:border-surface-4'
    }`}>
      <div className={`p-2 rounded-lg shrink-0 ${isDanger ? 'bg-danger/10 text-danger' : 'bg-surface-2 text-white border border-surface-3'}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className={`text-sm font-bold mb-0.5 ${isDanger ? 'text-danger' : 'text-white'}`}>{label}</p>
        <p className="text-xs text-text-secondary">{desc}</p>
      </div>
    </button>
  );
}
