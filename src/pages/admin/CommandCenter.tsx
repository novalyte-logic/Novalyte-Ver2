import React, { useState } from 'react';
import { Users, TrendingUp, Zap, ShieldAlert, Database, Server, ChevronRight, Activity, Search, Filter, ArrowUpRight, ArrowDownRight, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';

export function CommandCenter() {
  const [timeframe, setTimeframe] = useState('24h');

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary">Command Center</h1>
          <p className="text-text-secondary mt-1">Global ecosystem overview and orchestration.</p>
        </div>
        <div className="flex items-center gap-2 bg-surface-2 p-1 rounded-lg border border-surface-3">
          {['1h', '24h', '7d', '30d'].map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                timeframe === t ? 'bg-surface-3 text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-surface-1 border-surface-3 p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users className="w-24 h-24 text-primary" />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20"><Users className="w-5 h-5" /></div>
              <span className="flex items-center text-success text-sm font-mono bg-success/10 px-2 py-1 rounded-md border border-success/20">
                <ArrowUpRight className="w-3 h-3 mr-1" /> 12.4%
              </span>
            </div>
            <h3 className="text-text-secondary text-sm font-medium mb-1">Active Patients</h3>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-display font-bold text-text-primary">14,205</p>
              <span className="text-sm text-text-secondary">total</span>
            </div>
          </div>
        </Card>

        <Card className="bg-surface-1 border-surface-3 p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity className="w-24 h-24 text-secondary" />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 rounded-xl bg-secondary/10 text-secondary border border-secondary/20"><Activity className="w-5 h-5" /></div>
              <span className="flex items-center text-success text-sm font-mono bg-success/10 px-2 py-1 rounded-md border border-success/20">
                <ArrowUpRight className="w-3 h-3 mr-1" /> 8.1%
              </span>
            </div>
            <h3 className="text-text-secondary text-sm font-medium mb-1">Active Clinics</h3>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-display font-bold text-text-primary">342</p>
              <span className="text-sm text-text-secondary">nodes</span>
            </div>
          </div>
        </Card>

        <Card className="bg-surface-1 border-surface-3 p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp className="w-24 h-24 text-success" />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 rounded-xl bg-success/10 text-success border border-success/20"><TrendingUp className="w-5 h-5" /></div>
              <span className="flex items-center text-success text-sm font-mono bg-success/10 px-2 py-1 rounded-md border border-success/20">
                <ArrowUpRight className="w-3 h-3 mr-1" /> 24.8%
              </span>
            </div>
            <h3 className="text-text-secondary text-sm font-medium mb-1">Monthly GMV</h3>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-display font-bold text-text-primary">$2.4M</p>
              <span className="text-sm text-text-secondary">USD</span>
            </div>
          </div>
        </Card>

        <Card className="bg-surface-1 border-surface-3 p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap className="w-24 h-24 text-warning" />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 rounded-xl bg-warning/10 text-warning border border-warning/20"><Zap className="w-5 h-5" /></div>
              <span className="flex items-center text-warning text-sm font-mono bg-warning/10 px-2 py-1 rounded-md border border-warning/20">
                <ArrowDownRight className="w-3 h-3 mr-1" /> 1.2%
              </span>
            </div>
            <h3 className="text-text-secondary text-sm font-medium mb-1">AI Triage Volume</h3>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-display font-bold text-text-primary">8,402</p>
              <span className="text-sm text-text-secondary">events</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: System Health & Alerts */}
        <div className="space-y-6">
          <Card className="bg-surface-1 border-surface-3 p-0 overflow-hidden flex flex-col h-[400px]">
            <div className="p-5 border-b border-surface-3 bg-surface-2/50 flex justify-between items-center">
              <h3 className="font-bold text-text-primary flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-warning" /> System Alerts
              </h3>
              <span className="px-2 py-1 rounded-full bg-warning/10 text-warning text-xs font-bold">3 Active</span>
            </div>
            <div className="p-5 space-y-4 overflow-y-auto flex-grow">
              {[
                { msg: "High latency detected in US-East routing", time: "2m ago", type: "warning", icon: AlertTriangle },
                { msg: "New clinic onboarding pending review", time: "15m ago", type: "info", icon: Clock },
                { msg: "Marketplace sync completed successfully", time: "1h ago", type: "success", icon: CheckCircle2 },
                { msg: "API rate limit approaching for Vendor ID 492", time: "2h ago", type: "warning", icon: AlertTriangle },
              ].map((alert, i) => {
                const Icon = alert.icon;
                return (
                  <div key={i} className="flex items-start gap-4 p-3 rounded-lg bg-surface-2 border border-surface-3 hover:border-surface-3/80 transition-colors">
                    <div className={`mt-0.5 p-1.5 rounded-md ${
                      alert.type === 'warning' ? 'bg-warning/10 text-warning' : 
                      alert.type === 'success' ? 'bg-success/10 text-success' : 
                      'bg-primary/10 text-primary'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">{alert.msg}</p>
                      <p className="text-text-secondary font-mono text-xs mt-1">{alert.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="bg-surface-1 border-surface-3 p-0 overflow-hidden">
            <div className="p-5 border-b border-surface-3 bg-surface-2/50">
              <h3 className="font-bold text-text-primary flex items-center gap-2">
                <Database className="w-5 h-5 text-secondary" /> Data Pipeline Health
              </h3>
            </div>
            <div className="p-5 font-mono text-sm space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Ingestion Rate</span> 
                <span className="text-primary font-bold bg-primary/10 px-2 py-1 rounded">4.2k/sec</span>
              </div>
              <div className="w-full bg-surface-3 h-1.5 rounded-full overflow-hidden"><div className="bg-primary h-full w-[75%]" /></div>
              
              <div className="flex justify-between items-center pt-2">
                <span className="text-text-secondary">Processing Queue</span> 
                <span className="text-text-primary font-bold">124 items</span>
              </div>
              <div className="w-full bg-surface-3 h-1.5 rounded-full overflow-hidden"><div className="bg-warning h-full w-[15%]" /></div>
              
              <div className="flex justify-between items-center pt-2">
                <span className="text-text-secondary">Model Latency</span> 
                <span className="text-success font-bold bg-success/10 px-2 py-1 rounded">120ms</span>
              </div>
              <div className="w-full bg-surface-3 h-1.5 rounded-full overflow-hidden"><div className="bg-success h-full w-[30%]" /></div>
            </div>
          </Card>
        </div>

        {/* Middle & Right: Live Activity & CRM */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-surface-1 border-surface-3 p-0 overflow-hidden h-full flex flex-col">
            <div className="p-5 border-b border-surface-3 bg-surface-2/50 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-text-primary flex items-center gap-2">
                  <Server className="w-5 h-5 text-primary" /> Live Orchestration Feed
                </h3>
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                </span>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                  <input type="text" placeholder="Filter events..." className="pl-9 pr-3 py-1.5 bg-surface-2 border border-surface-3 rounded-md text-sm focus:outline-none focus:border-primary/50 w-48" />
                </div>
                <Button variant="outline" size="sm" className="px-2"><Filter className="w-4 h-4" /></Button>
              </div>
            </div>
            <div className="p-0 overflow-x-auto flex-grow">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-text-secondary uppercase bg-surface-2/30 border-b border-surface-3">
                  <tr>
                    <th className="px-6 py-4 font-mono font-medium tracking-wider">Event ID</th>
                    <th className="px-6 py-4 font-medium tracking-wider">Type</th>
                    <th className="px-6 py-4 font-medium tracking-wider">Source</th>
                    <th className="px-6 py-4 font-medium tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right font-medium tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-3">
                  {[
                    { id: "EVT-9921", type: "Patient Triage", source: "Web Assessment", status: "Routed", time: "Just now" },
                    { id: "EVT-9920", type: "Clinic Lead", source: "Directory", status: "Pending", time: "2m ago" },
                    { id: "EVT-9919", type: "Marketplace Order", source: "Clinic OS", status: "Processing", time: "5m ago" },
                    { id: "EVT-9918", type: "Workforce Match", source: "Exchange", status: "Matched", time: "12m ago" },
                    { id: "EVT-9917", type: "Patient Triage", source: "Symptom Checker", status: "Routed", time: "15m ago" },
                    { id: "EVT-9916", type: "Vendor Application", source: "Partnerships", status: "Review", time: "22m ago" },
                    { id: "EVT-9915", type: "Clinic Lead", source: "Sales Page", status: "Routed", time: "31m ago" },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-surface-2 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-mono text-text-primary group-hover:text-primary transition-colors">{row.id}</div>
                        <div className="text-xs text-text-secondary mt-0.5">{row.time}</div>
                      </td>
                      <td className="px-6 py-4 font-medium text-text-primary">{row.type}</td>
                      <td className="px-6 py-4 text-text-secondary">{row.source}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${
                          row.status === 'Routed' || row.status === 'Matched' ? 'bg-success/10 text-success border-success/20' :
                          row.status === 'Pending' || row.status === 'Review' ? 'bg-warning/10 text-warning border-warning/20' : 
                          'bg-primary/10 text-primary border-primary/20'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
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
    </div>
  );
}
