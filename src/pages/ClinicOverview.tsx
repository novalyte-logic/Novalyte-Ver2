import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, TrendingUp, Calendar, Activity, ArrowRight, 
  AlertCircle, Clock, CheckCircle2, Terminal, Sparkles, 
  DollarSign, Phone, ChevronRight, BarChart3, ShieldCheck
} from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { ClinicApiError, ClinicService, type ClinicOverviewResponse } from '@/src/services/clinic';

export function ClinicOverview() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [data, setData] = useState<ClinicOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let isActive = true;

    const loadOverview = async (silent = false) => {
      if (!silent) {
        setLoading(true);
      }

      try {
        const nextData = await ClinicService.getOverview();
        if (isActive) {
          setData(nextData);
          setError('');
        }
      } catch (loadError) {
        console.error('Failed to load clinic overview:', loadError);
        if (isActive) {
          setError(
            loadError instanceof ClinicApiError
              ? loadError.message
              : 'Unable to load clinic operations right now.',
          );
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void loadOverview();
    const interval = window.setInterval(() => {
      void loadOverview(true);
    }, 30000);

    return () => {
      isActive = false;
      window.clearInterval(interval);
    };
  }, []);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    }).format(date);
  };

  const handleScheduleJoin = (item: ClinicOverviewResponse['schedule'][number]) => {
    if (typeof item?.meetingLink === 'string' && item.meetingLink.trim()) {
      window.open(item.meetingLink, '_blank', 'noopener,noreferrer');
      return;
    }

    navigate('/dashboard/pipeline');
  };

  const handleInsightAction = (action: string | undefined) => {
    const normalized = action?.toLowerCase() || '';

    if (normalized.includes('marketplace')) {
      navigate('/dashboard/marketplace');
      return;
    }

    if (normalized.includes('requisition') || normalized.includes('capacity')) {
      navigate('/dashboard/workforce?tab=demand');
      return;
    }

    navigate('/dashboard/intelligence');
  };

  const metrics = data?.metrics;
  const priorityLeads = data?.priorityLeads || [];
  const schedule = data?.schedule || [];
  const liveActivity = data?.activity || [];
  const copilotInsights = data?.insights || [];
  const funnelData = [
    { stage: 'Intake', count: data?.funnel.intake || 0, color: 'border-surface-3 text-text-secondary' },
    { stage: 'Triage', count: data?.funnel.triage || 0, color: 'border-warning/50 text-warning' },
    { stage: 'Consult', count: data?.funnel.consult || 0, color: 'border-primary/50 text-primary' },
    { stage: 'Treating', count: data?.funnel.treating || 0, color: 'border-success/50 text-success' },
  ];

  if (loading && !data) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm font-mono text-success uppercase tracking-wider font-bold">System Online</span>
            <span className="text-sm font-mono text-text-secondary border-l border-surface-3 pl-3">
              {formatDate(currentTime)} • {formatTime(currentTime)}
            </span>
          </div>
          <h1 className="text-3xl font-display font-bold text-white">Command Overview</h1>
          <p className="text-text-secondary mt-1">Real-time pulse of your clinic operations and patient pipeline.</p>
          {error ? (
            <div className="mt-4 rounded-lg border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
              {error}
            </div>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <Link to="/dashboard/pipeline" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto border-surface-3 text-white hover:bg-surface-2">
              <Calendar className="w-4 h-4 mr-2" /> View Schedule
            </Button>
          </Link>
          <Link to="/dashboard/leads" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-black font-bold">
              <Users className="w-4 h-4 mr-2" /> Review Leads
            </Button>
          </Link>
        </div>
      </div>

      {/* Priority Alert Banner */}
      {priorityLeads.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-xl bg-warning/10 border border-warning/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5 text-warning" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Action Required: High-Value Leads Waiting</h3>
              <p className="text-xs text-warning/80 mt-0.5">
                {priorityLeads.length} patients with high AI scores requested consults recently.
              </p>
            </div>
          </div>
          <Link to="/dashboard/leads">
            <Button size="sm" className="w-full sm:w-auto bg-warning hover:bg-warning/90 text-black font-bold whitespace-nowrap">
              Review Leads <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      )}

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Pipeline", value: metrics?.activePipeline ?? 0, change: "Live routed leads", icon: Activity, color: "text-primary", bg: "bg-primary/10" },
          { label: "Consults Today", value: metrics?.consultsToday ?? 0, change: "Booked consult load", icon: Calendar, color: "text-secondary", bg: "bg-secondary/10" },
          { label: "Show Rate (30d)", value: metrics?.showRate != null ? `${metrics.showRate}%` : '--', change: "Finalized consult outcomes", icon: TrendingUp, color: "text-success", bg: "bg-success/10" },
          { label: "Est. Revenue", value: metrics?.estimatedRevenueLabel ?? '$0', change: "Derived from active lead value", icon: DollarSign, color: "text-white", bg: "bg-surface-3" },
        ].map((metric, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + (i * 0.05) }}
          >
            <Card className="p-5 bg-[#0B0F14] border-surface-3 hover:border-surface-4 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg ${metric.bg} flex items-center justify-center ${metric.color}`}>
                  <metric.icon className="w-5 h-5" />
                </div>
                <BarChart3 className="w-4 h-4 text-text-secondary opacity-50" />
              </div>
              <div>
                <h3 className="text-3xl font-display font-bold text-white mb-1">{metric.value}</h3>
                <p className="text-sm font-medium text-text-secondary mb-1">{metric.label}</p>
                <p className="text-xs text-text-secondary/70">{metric.change}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Live Patient Traffic / Funnel */}
          <Card className="p-6 bg-[#0B0F14] border-surface-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Live Patient Traffic</h2>
              <Link to="/dashboard/pipeline" className="text-sm font-bold text-primary hover:underline flex items-center">
                View Pipeline <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {funnelData.map((step, i) => (
                <div key={i} className="relative">
                  <div className={`p-4 rounded-xl border-2 bg-surface-1/50 ${step.color} flex flex-col items-center justify-center text-center h-full`}>
                    <span className="text-3xl font-display font-bold mb-1">{step.count}</span>
                    <span className="text-xs font-bold uppercase tracking-wider">{step.stage}</span>
                  </div>
                  {i < 3 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 -translate-y-1/2 z-10 text-surface-3">
                      <ChevronRight className="w-6 h-6" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Upcoming Tasks & Schedule */}
          <Card className="p-6 bg-[#0B0F14] border-surface-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Today's Schedule & Priority Tasks</h2>
              <Link to="/dashboard/pipeline">
                <Button variant="outline" size="sm" className="border-surface-3 text-white">
                  View All
                </Button>
              </Link>
            </div>
            
            <div className="space-y-3">
              {schedule.length > 0 ? schedule.map((item, i) => (
                <div key={i} className={`flex items-start gap-4 p-4 rounded-xl border transition-colors ${
                  item.status === 'completed' 
                    ? 'bg-surface-1/50 border-surface-2 opacity-60' 
                    : 'bg-surface-2 border-surface-3 hover:border-surface-4'
                }`}>
                  <div className="w-16 shrink-0 pt-0.5">
                    <span className="text-xs font-mono font-bold text-text-secondary">
                      {new Date(item.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  <div className="flex-grow">
                    <h4 className={`text-sm font-bold ${item.status === 'completed' ? 'text-text-secondary line-through' : 'text-white'}`}>
                      {item.title || 'Consultation'}
                    </h4>
                    <p className="text-xs text-text-secondary mt-1">{item.patientName || 'Patient'}</p>
                  </div>
                  
                  <div className="shrink-0">
                    {item.status === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    ) : (
                      <Button
                        size="sm"
                        className="bg-primary/10 text-primary hover:bg-primary/20 font-bold px-3 py-1 h-auto text-xs"
                        onClick={() => handleScheduleJoin(item)}
                      >
                        Join
                      </Button>
                    )}
                  </div>
                </div>
              )) : (
                <div className="p-8 text-center border border-dashed border-surface-3 rounded-xl">
                  <p className="text-text-secondary text-sm">No consults scheduled for today.</p>
                </div>
              )}
            </div>
          </Card>

        </div>

        {/* Right Column (1/3) */}
        <div className="space-y-6">
          
          {/* AI Copilot Insights */}
          <Card className="p-6 bg-secondary/5 border-secondary/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <Sparkles className="w-24 h-24 text-secondary" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-secondary" />
                <h2 className="text-lg font-bold text-white">Copilot Insights</h2>
              </div>
              
              <div className="space-y-4">
                {copilotInsights.length > 0 ? copilotInsights.map((insight, i) => (
                  <div key={i} className="p-3 rounded-lg bg-[#0B0F14]/80 border border-secondary/10 backdrop-blur-sm">
                    <p className="text-sm text-white font-medium mb-1">{insight.title}</p>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {insight.description}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleInsightAction(insight.action)}
                      className="text-xs font-bold text-secondary mt-2 hover:underline"
                    >
                      {insight.action || 'Open insight'}
                    </button>
                  </div>
                )) : (
                  <>
                    <div className="p-3 rounded-lg bg-[#0B0F14]/80 border border-secondary/10 backdrop-blur-sm">
                      <p className="text-sm text-white font-medium mb-1">High Drop-off Detected</p>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        24% of leads are stalling at the "Lab Work Required" stage. Consider offering an at-home testing kit via the marketplace to reduce friction.
                      </p>
                      <button
                        type="button"
                        onClick={() => handleInsightAction('View Marketplace Solutions')}
                        className="text-xs font-bold text-secondary mt-2 hover:underline"
                      >
                        View Marketplace Solutions
                      </button>
                    </div>
                    
                    <div className="p-3 rounded-lg bg-[#0B0F14]/80 border border-secondary/10 backdrop-blur-sm">
                      <p className="text-sm text-white font-medium mb-1">Capacity Warning</p>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        Consult volume is projected to exceed provider capacity by next Thursday. Consider opening a temporary staffing requisition.
                      </p>
                      <button
                        type="button"
                        onClick={() => handleInsightAction('Draft Requisition')}
                        className="text-xs font-bold text-secondary mt-2 hover:underline"
                      >
                        Draft Requisition
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </Card>

          {/* Live Event Log */}
          <Card className="p-0 bg-[#0B0F14] border-surface-3 overflow-hidden flex flex-col h-[400px]">
            <div className="p-4 border-b border-surface-3 bg-surface-1 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-text-secondary" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">Live Activity</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                </span>
                <span className="text-xs font-mono text-text-secondary">Syncing</span>
              </div>
            </div>
            
            <div className="flex-grow overflow-y-auto p-4 space-y-4 font-mono text-xs">
              {liveActivity.length > 0 ? liveActivity.map((log, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span className="text-text-secondary/50 shrink-0 w-12">{log.timeLabel}</span>
                  <div>
                    <span className={`
                      ${log.type === 'success' ? 'text-success' : ''}
                      ${log.type === 'warning' ? 'text-warning' : ''}
                      ${log.type === 'info' ? 'text-primary' : ''}
                    `}>
                      {log.event}
                    </span>
                    <span className="text-text-secondary ml-2">[{log.entity}]</span>
                  </div>
                </div>
              )) : (
                <div className="p-8 text-center text-text-secondary/50">
                  No recent activity.
                </div>
              )}
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}
