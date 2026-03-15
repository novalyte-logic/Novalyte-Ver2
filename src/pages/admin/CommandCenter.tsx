import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, Users, TrendingUp, Zap, ShieldAlert, Database, Server, 
  ChevronRight, Search, Filter, ArrowUpRight, ArrowDownRight, Clock, 
  AlertTriangle, CheckCircle2, Globe, DollarSign, Target, MessageSquare,
  BarChart3, Network, Cpu, Radio, ActivitySquare, Stethoscope, Briefcase
} from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';

type Mode = 'global' | 'revenue' | 'clinical' | 'growth';

export function CommandCenter() {
  const [mode, setMode] = useState<Mode>('global');
  const [timeframe, setTimeframe] = useState('24h');
  const [isLive, setIsLive] = useState(true);

  const modes = [
    { id: 'global', label: 'Global Overview', icon: Globe },
    { id: 'revenue', label: 'Revenue Ops', icon: DollarSign },
    { id: 'clinical', label: 'Clinical Ops', icon: Stethoscope },
    { id: 'growth', label: 'Growth & Routing', icon: Network },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12 font-sans">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 bg-surface-1/50 p-6 rounded-2xl border border-surface-3 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-display font-bold text-white tracking-tight">Command Center</h1>
            <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${isLive ? 'bg-success/10 text-success border border-success/20' : 'bg-warning/10 text-warning border border-warning/20'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-success animate-pulse' : 'bg-warning'}`} />
              {isLive ? 'Live Sync' : 'Paused'}
            </div>
          </div>
          <p className="text-text-secondary text-sm">Ecosystem orchestration and intelligence overlay.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
          <div className="flex p-1 bg-[#0B0F14] rounded-xl border border-surface-3 w-full sm:w-auto overflow-x-auto">
            {modes.map((m) => {
              const Icon = m.icon;
              const isActive = mode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id as Mode)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    isActive 
                      ? 'bg-primary/10 text-primary shadow-[0_0_15px_rgba(53,212,255,0.1)]' 
                      : 'text-text-secondary hover:text-white hover:bg-surface-2'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {m.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 bg-[#0B0F14] p-1 rounded-xl border border-surface-3 shrink-0">
            {['1h', '24h', '7d', '30d'].map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  timeframe === t ? 'bg-surface-3 text-white' : 'text-text-secondary hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          {mode === 'global' && <GlobalOverview />}
          {mode === 'revenue' && <RevenueOps />}
          {mode === 'clinical' && <ClinicalOps />}
          {mode === 'growth' && <GrowthOps />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function GlobalOverview() {
  return (
    <>
      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <MetricCard title="Active Patients" value="14,205" trend="+12.4%" trendUp icon={Users} color="text-primary" bg="bg-primary/10" border="border-primary/20" />
        <MetricCard title="Active Clinics" value="342" trend="+8.1%" trendUp icon={ActivitySquare} color="text-secondary" bg="bg-secondary/10" border="border-secondary/20" />
        <MetricCard title="Monthly GMV" value="$2.4M" trend="+24.8%" trendUp icon={TrendingUp} color="text-success" bg="bg-success/10" border="border-success/20" />
        <MetricCard title="AI Triage Volume" value="8,402" trend="-1.2%" trendUp={false} icon={Cpu} color="text-warning" bg="bg-warning/10" border="border-warning/20" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: System Health & Alerts */}
        <div className="space-y-6">
          <Card className="bg-surface-1 border-surface-3 p-0 overflow-hidden flex flex-col h-[400px] shadow-2xl">
            <div className="p-4 border-b border-surface-3 bg-gradient-to-r from-surface-2 to-surface-1 flex justify-between items-center">
              <h3 className="font-bold text-white flex items-center gap-2 text-sm">
                <ShieldAlert className="w-4 h-4 text-warning" /> System Alerts
              </h3>
              <span className="px-2 py-0.5 rounded bg-warning/10 text-warning text-[10px] font-bold uppercase tracking-wider border border-warning/20">3 Active</span>
            </div>
            <div className="p-4 space-y-3 overflow-y-auto flex-grow custom-scrollbar">
              {[
                { msg: "High latency detected in US-East routing", time: "2m ago", type: "warning", icon: AlertTriangle },
                { msg: "New clinic onboarding pending review", time: "15m ago", type: "info", icon: Clock },
                { msg: "Marketplace sync completed successfully", time: "1h ago", type: "success", icon: CheckCircle2 },
                { msg: "API rate limit approaching for Vendor ID 492", time: "2h ago", type: "warning", icon: AlertTriangle },
                { msg: "Unusual spike in patient assessments", time: "3h ago", type: "info", icon: Activity },
              ].map((alert, i) => {
                const Icon = alert.icon;
                return (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-[#0B0F14] border border-surface-3 hover:border-surface-4 transition-colors group">
                    <div className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${
                      alert.type === 'warning' ? 'bg-warning/10 text-warning' : 
                      alert.type === 'success' ? 'bg-success/10 text-success' : 
                      'bg-primary/10 text-primary'
                    }`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-white group-hover:text-primary transition-colors">{alert.msg}</p>
                      <p className="text-text-secondary font-mono text-[10px] mt-1">{alert.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="bg-surface-1 border-surface-3 p-0 overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-surface-3 bg-gradient-to-r from-surface-2 to-surface-1">
              <h3 className="font-bold text-white flex items-center gap-2 text-sm">
                <Database className="w-4 h-4 text-secondary" /> Pipeline Health
              </h3>
            </div>
            <div className="p-5 font-mono text-xs space-y-5">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-text-secondary uppercase tracking-wider">Ingestion Rate</span> 
                  <span className="text-primary font-bold">4.2k/sec</span>
                </div>
                <div className="w-full bg-[#0B0F14] h-1.5 rounded-full overflow-hidden border border-surface-3"><div className="bg-primary h-full w-[75%] shadow-[0_0_10px_rgba(53,212,255,0.5)]" /></div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-text-secondary uppercase tracking-wider">Processing Queue</span> 
                  <span className="text-warning font-bold">124 items</span>
                </div>
                <div className="w-full bg-[#0B0F14] h-1.5 rounded-full overflow-hidden border border-surface-3"><div className="bg-warning h-full w-[15%] shadow-[0_0_10px_rgba(255,184,77,0.5)]" /></div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-text-secondary uppercase tracking-wider">Model Latency</span> 
                  <span className="text-success font-bold">120ms</span>
                </div>
                <div className="w-full bg-[#0B0F14] h-1.5 rounded-full overflow-hidden border border-surface-3"><div className="bg-success h-full w-[30%] shadow-[0_0_10px_rgba(46,230,166,0.5)]" /></div>
              </div>
            </div>
          </Card>
        </div>

        {/* Middle & Right: Live Orchestration */}
        <div className="xl:col-span-2 space-y-6">
          <Card className="bg-surface-1 border-surface-3 p-0 overflow-hidden h-full flex flex-col shadow-2xl">
            <div className="p-4 border-b border-surface-3 bg-gradient-to-r from-surface-2 to-surface-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-white flex items-center gap-2 text-sm">
                  <Radio className="w-4 h-4 text-primary" /> Live Orchestration Feed
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                  <input type="text" placeholder="Filter events..." className="pl-9 pr-3 py-1.5 bg-[#0B0F14] border border-surface-3 rounded-lg text-xs text-white focus:outline-none focus:border-primary/50 w-full sm:w-48 transition-colors" />
                </div>
                <Button variant="outline" size="sm" className="px-2 h-8 border-surface-3 bg-[#0B0F14]"><Filter className="w-3.5 h-3.5" /></Button>
              </div>
            </div>
            <div className="p-0 overflow-x-auto flex-grow">
              <table className="w-full text-left border-collapse">
                <thead className="text-[10px] text-text-secondary uppercase tracking-wider bg-[#0B0F14] border-b border-surface-3">
                  <tr>
                    <th className="px-6 py-3 font-medium">Event ID / Time</th>
                    <th className="px-6 py-3 font-medium">Type</th>
                    <th className="px-6 py-3 font-medium">Source</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-3 text-sm">
                  {[
                    { id: "EVT-9921", type: "Patient Triage", source: "Web Assessment", status: "Routed", time: "Just now" },
                    { id: "EVT-9920", type: "Clinic Lead", source: "Directory", status: "Pending", time: "2m ago" },
                    { id: "EVT-9919", type: "Marketplace Order", source: "Clinic OS", status: "Processing", time: "5m ago" },
                    { id: "EVT-9918", type: "Workforce Match", source: "Exchange", status: "Matched", time: "12m ago" },
                    { id: "EVT-9917", type: "Patient Triage", source: "Symptom Checker", status: "Routed", time: "15m ago" },
                    { id: "EVT-9916", type: "Vendor Application", source: "Partnerships", status: "Review", time: "22m ago" },
                    { id: "EVT-9915", type: "Clinic Lead", source: "Sales Page", status: "Routed", time: "31m ago" },
                    { id: "EVT-9914", type: "AI Consult", source: "Ask AI", status: "Completed", time: "45m ago" },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-surface-2/50 transition-colors group">
                      <td className="px-6 py-3.5">
                        <div className="font-mono text-xs text-white group-hover:text-primary transition-colors">{row.id}</div>
                        <div className="text-[10px] text-text-secondary mt-0.5">{row.time}</div>
                      </td>
                      <td className="px-6 py-3.5 font-medium text-white text-xs">{row.type}</td>
                      <td className="px-6 py-3.5 text-text-secondary text-xs">{row.source}</td>
                      <td className="px-6 py-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                          row.status === 'Routed' || row.status === 'Matched' || row.status === 'Completed' ? 'bg-success/10 text-success border-success/20' :
                          row.status === 'Pending' || row.status === 'Review' ? 'bg-warning/10 text-warning border-warning/20' : 
                          'bg-primary/10 text-primary border-primary/20'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <Button variant="ghost" size="sm" className="h-7 text-xs opacity-0 group-hover:opacity-100 transition-opacity text-text-secondary hover:text-white">
                          Inspect
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

function RevenueOps() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard title="Total Recovered Revenue" value="$4.2M" trend="+15%" trendUp icon={DollarSign} color="text-success" bg="bg-success/10" border="border-success/20" />
        <MetricCard title="Marketplace GMV" value="$1.8M" trend="+8%" trendUp icon={BarChart3} color="text-primary" bg="bg-primary/10" border="border-primary/20" />
        <MetricCard title="Clinic Subscriptions" value="$640k" trend="+2%" trendUp icon={ActivitySquare} color="text-secondary" bg="bg-secondary/10" border="border-secondary/20" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-surface-1 border-surface-3 shadow-2xl">
          <h3 className="font-bold text-white mb-6 flex items-center gap-2 text-sm"><Target className="w-4 h-4 text-primary" /> Revenue by Channel</h3>
          <div className="space-y-6">
            <ProgressBar label="Patient Lead Gen" value={45} amount="$1.1M" color="bg-primary" />
            <ProgressBar label="Equipment Marketplace" value={30} amount="$720k" color="bg-secondary" />
            <ProgressBar label="Clinic OS Subscriptions" value={15} amount="$360k" color="bg-success" />
            <ProgressBar label="Workforce Placements" value={10} amount="$240k" color="bg-warning" />
          </div>
        </Card>
        <Card className="p-6 bg-surface-1 border-surface-3 shadow-2xl flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-surface-4 mx-auto mb-4" />
            <p className="text-text-secondary text-sm">Detailed revenue charting visualization would render here.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

function ClinicalOps() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard title="Active Practitioners" value="1,204" trend="+45" trendUp icon={Stethoscope} color="text-primary" bg="bg-primary/10" border="border-primary/20" />
        <MetricCard title="Open Requisitions" value="84" trend="-12" trendUp={false} icon={Briefcase} color="text-warning" bg="bg-warning/10" border="border-warning/20" />
        <MetricCard title="Match Rate" value="94%" trend="+2%" trendUp icon={CheckCircle2} color="text-success" bg="bg-success/10" border="border-success/20" />
      </div>
      <Card className="p-6 bg-surface-1 border-surface-3 shadow-2xl">
        <h3 className="font-bold text-white mb-6 flex items-center gap-2 text-sm"><Network className="w-4 h-4 text-secondary" /> Workforce Exchange Status</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-[10px] text-text-secondary uppercase tracking-wider border-b border-surface-3">
              <tr>
                <th className="pb-3 font-medium">Clinic</th>
                <th className="pb-3 font-medium">Role Needed</th>
                <th className="pb-3 font-medium">Candidates</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-3">
              {[
                { clinic: "Apex Longevity", role: "Medical Director", candidates: 3, status: "Interviewing" },
                { clinic: "Vitality Men's", role: "Nurse Practitioner", candidates: 8, status: "Sourcing" },
                { clinic: "Prime Health", role: "RN - IV Therapy", candidates: 1, status: "Offer Extended" },
              ].map((row, i) => (
                <tr key={i}>
                  <td className="py-4 text-white font-medium">{row.clinic}</td>
                  <td className="py-4 text-text-secondary">{row.role}</td>
                  <td className="py-4 text-white">{row.candidates}</td>
                  <td className="py-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border bg-surface-2 border-surface-3 text-text-secondary">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function GrowthOps() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard title="Patient Leads (24h)" value="482" trend="+18%" trendUp icon={Users} color="text-primary" bg="bg-primary/10" border="border-primary/20" />
        <MetricCard title="Avg Routing Time" value="4.2s" trend="-0.5s" trendUp icon={Clock} color="text-success" bg="bg-success/10" border="border-success/20" />
        <MetricCard title="Active Campaigns" value="12" trend="0" trendUp icon={MessageSquare} color="text-secondary" bg="bg-secondary/10" border="border-secondary/20" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-surface-1 border-surface-3 shadow-2xl">
          <h3 className="font-bold text-white mb-6 flex items-center gap-2 text-sm"><Target className="w-4 h-4 text-primary" /> Lead Routing Pipeline</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-[#0B0F14] rounded-xl border border-surface-3">
              <span className="text-sm text-text-secondary">Intake Completed</span>
              <span className="font-bold text-white">482</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-[#0B0F14] rounded-xl border border-surface-3">
              <span className="text-sm text-text-secondary">Medically Qualified</span>
              <span className="font-bold text-white">390</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-[#0B0F14] rounded-xl border border-surface-3">
              <span className="text-sm text-text-secondary">Financially Qualified</span>
              <span className="font-bold text-white">315</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-primary/10 rounded-xl border border-primary/20">
              <span className="text-sm text-primary font-bold">Successfully Routed</span>
              <span className="font-bold text-primary">298</span>
            </div>
          </div>
        </Card>
        <Card className="p-6 bg-surface-1 border-surface-3 shadow-2xl">
          <h3 className="font-bold text-white mb-6 flex items-center gap-2 text-sm"><MessageSquare className="w-4 h-4 text-secondary" /> Active Campaigns</h3>
          <div className="space-y-4">
            {[
              { name: "TRT Reactivation", sent: "4.2k", open: "42%", click: "12%" },
              { name: "New Clinic Welcome", sent: "128", open: "68%", click: "45%" },
              { name: "Marketplace Promo", sent: "1.8k", open: "31%", click: "8%" },
            ].map((camp, i) => (
              <div key={i} className="p-4 bg-[#0B0F14] rounded-xl border border-surface-3">
                <p className="font-bold text-white text-sm mb-3">{camp.name}</p>
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div><p className="text-text-secondary mb-1">Sent</p><p className="font-mono text-white">{camp.sent}</p></div>
                  <div><p className="text-text-secondary mb-1">Open Rate</p><p className="font-mono text-white">{camp.open}</p></div>
                  <div><p className="text-text-secondary mb-1">Click Rate</p><p className="font-mono text-white">{camp.click}</p></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// Helper Components

function MetricCard({ title, value, trend, trendUp, icon: Icon, color, bg, border }: any) {
  return (
    <Card className="bg-surface-1 border-surface-3 p-5 relative overflow-hidden group shadow-2xl">
      <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity ${color}`}>
        <Icon className="w-24 h-24" />
      </div>
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-2 rounded-xl ${bg} ${color} border ${border}`}><Icon className="w-4 h-4" /></div>
          <span className={`flex items-center text-[10px] font-bold font-mono px-2 py-0.5 rounded border uppercase tracking-wider ${
            trendUp ? 'bg-success/10 text-success border-success/20' : 'bg-warning/10 text-warning border-warning/20'
          }`}>
            {trendUp ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />} {trend}
          </span>
        </div>
        <h3 className="text-text-secondary text-xs font-bold uppercase tracking-wider mb-1">{title}</h3>
        <p className="text-3xl font-display font-bold text-white">{value}</p>
      </div>
    </Card>
  );
}

function ProgressBar({ label, value, amount, color }: { label: string, value: number, amount: string, color: string }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2 text-sm">
        <span className="text-white font-medium">{label}</span>
        <span className="text-text-secondary font-mono">{amount}</span>
      </div>
      <div className="w-full bg-[#0B0F14] h-2 rounded-full overflow-hidden border border-surface-3">
        <div className={`${color} h-full rounded-full`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
