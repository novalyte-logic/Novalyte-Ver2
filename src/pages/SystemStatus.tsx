import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle2, Server, Database, Zap, Globe, ShieldCheck, AlertTriangle, Clock, ArrowRight, RefreshCw, MessageSquare } from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

const SYSTEMS = [
  { id: 'api', name: 'API Gateway', status: 'operational', uptime: '99.99%', icon: Server, latency: '42ms' },
  { id: 'assessment', name: 'Patient Assessment Engine', status: 'operational', uptime: '100%', icon: Activity, latency: '115ms' },
  { id: 'routing', name: 'Clinic Routing Logic', status: 'operational', uptime: '99.98%', icon: Zap, latency: '85ms' },
  { id: 'marketplace', name: 'Marketplace Sync', status: 'operational', uptime: '99.95%', icon: Database, latency: '210ms' },
  { id: 'inference', name: 'AI Inference Nodes', status: 'operational', uptime: '99.99%', icon: ShieldCheck, latency: '350ms' },
  { id: 'web', name: 'Web Application', status: 'operational', uptime: '100%', icon: Globe, latency: '24ms' }
];

const INCIDENTS = [
  {
    id: 'inc-001',
    date: 'March 10, 2026',
    title: 'Elevated latency in AI Inference Nodes',
    status: 'Resolved',
    type: 'incident',
    updates: [
      { time: '14:30 UTC', message: 'We observed elevated latency in our AI inference nodes. The issue was identified as a sudden spike in traffic and was automatically mitigated by our auto-scaling infrastructure. No data was lost, and all assessments were processed successfully.' },
      { time: '14:15 UTC', message: 'We are investigating reports of slow response times from the AI inference engine.' }
    ]
  },
  {
    id: 'inc-002',
    date: 'February 28, 2026',
    title: 'Scheduled Maintenance: Database Upgrade',
    status: 'Completed',
    type: 'maintenance',
    updates: [
      { time: '02:45 UTC', message: 'Maintenance completed successfully. All systems are fully operational.' },
      { time: '02:00 UTC', message: 'Scheduled maintenance has begun. The application is currently in read-only mode.' }
    ]
  }
];

export function SystemStatus() {
  const navigate = useNavigate();
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 800);
  };

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#05070A] pt-24 pb-16 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2EE6A6]/20 via-[#2EE6A6]/5 to-transparent blur-3xl rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2EE6A6]/10 border border-[#2EE6A6]/20 text-[#2EE6A6] text-sm font-bold mb-6 shadow-[0_0_15px_rgba(46,230,166,0.15)]">
              <CheckCircle2 className="w-4 h-4" /> All Systems Operational
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4 tracking-tight">
              System Status
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl">
              Real-time operational health, uptime metrics, and incident history for Novalyte AI infrastructure.
            </p>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-text-secondary bg-[#0B0F14] px-4 py-2 rounded-lg border border-surface-3">
            <Clock className="w-4 h-4" />
            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            <button 
              onClick={handleRefresh}
              className={`p-1 hover:text-white transition-colors ${isRefreshing ? 'animate-spin text-[#2EE6A6]' : ''}`}
              disabled={isRefreshing}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Current Status Grid */}
        <div className="mb-20">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#2EE6A6]" />
            Active Components
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SYSTEMS.map((sys, index) => (
              <motion.div
                key={sys.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-[#0B0F14] border-surface-3 p-5 flex items-center justify-between hover:border-surface-3/80 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      sys.status === 'operational' 
                        ? 'bg-[#2EE6A6]/10 text-[#2EE6A6] group-hover:bg-[#2EE6A6]/20' 
                        : 'bg-[#FFB84D]/10 text-[#FFB84D]'
                    }`}>
                      <sys.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{sys.name}</h3>
                      <div className="flex items-center gap-3 mt-1 text-xs text-text-secondary font-mono">
                        <span>Uptime: {sys.uptime}</span>
                        <span className="w-1 h-1 rounded-full bg-surface-3" />
                        <span>{sys.latency}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${sys.status === 'operational' ? 'bg-[#2EE6A6] shadow-[0_0_8px_rgba(46,230,166,0.6)]' : 'bg-[#FFB84D] animate-pulse'}`} />
                    <span className={`text-sm font-bold ${sys.status === 'operational' ? 'text-[#2EE6A6]' : 'text-[#FFB84D]'}`}>
                      {sys.status === 'operational' ? 'Operational' : 'Degraded'}
                    </span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Incident History */}
        <div className="mb-20">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-text-secondary" />
            Incident History
          </h2>
          <div className="space-y-6">
            {INCIDENTS.map((incident, index) => (
              <Card key={incident.id} className="bg-[#0B0F14] border-surface-3 p-0 overflow-hidden">
                <div className="p-6 border-b border-surface-3/50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-1/30">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                        incident.type === 'maintenance' 
                          ? 'bg-surface-2 text-text-secondary' 
                          : 'bg-[#FFB84D]/10 text-[#FFB84D]'
                      }`}>
                        {incident.type}
                      </span>
                      <span className="text-sm text-text-secondary font-mono">{incident.date}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white">{incident.title}</h3>
                  </div>
                  <span className={`px-3 py-1.5 rounded-full text-sm font-bold border ${
                    incident.status === 'Resolved' || incident.status === 'Completed' 
                      ? 'bg-[#2EE6A6]/10 text-[#2EE6A6] border-[#2EE6A6]/20' 
                      : 'bg-[#FFB84D]/10 text-[#FFB84D] border-[#FFB84D]/20'
                  }`}>
                    {incident.status}
                  </span>
                </div>
                <div className="p-6 space-y-6">
                  {incident.updates.map((update, i) => (
                    <div key={i} className="relative pl-6 border-l-2 border-surface-3 last:border-transparent pb-6 last:pb-0">
                      <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-surface-3 ring-4 ring-[#0B0F14]" />
                      <div className="text-sm font-mono text-text-secondary mb-1">{update.time}</div>
                      <p className="text-text-secondary leading-relaxed">{update.message}</p>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Report an Issue */}
        <Card className="bg-gradient-to-br from-[#0B0F14] to-surface-1 border-surface-3 p-8 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 rounded-xl bg-surface-2 flex items-center justify-center text-text-secondary shrink-0 border border-surface-3">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Experiencing an issue?</h3>
                <p className="text-text-secondary text-sm leading-relaxed max-w-xl">
                  If you are seeing degraded performance or encountering an error not listed on this page, please report it to our engineering team immediately.
                </p>
              </div>
            </div>
            <Button 
              onClick={() => navigate('/contact')}
              variant="outline"
              className="w-full md:w-auto shrink-0 border-surface-3 hover:border-white hover:text-white"
            >
              Report an Issue <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>

      </div>
    </div>
  );
}
