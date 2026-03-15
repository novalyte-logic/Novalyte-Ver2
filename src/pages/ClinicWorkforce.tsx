import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Briefcase, UserPlus, Search, Star, MapPin, 
  CheckCircle2, XCircle, Clock, Users, TrendingUp,
  AlertTriangle, ChevronRight, Filter, Plus, Sparkles,
  Activity, DollarSign, Calendar, MessageSquare, ShieldCheck
} from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';

export function ClinicWorkforce() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'demand' | 'requisitions' | 'pipeline'>('demand');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab && ['demand', 'requisitions', 'pipeline'].includes(tab)) {
      setActiveTab(tab as any);
    }
  }, [location]);

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col animate-in fade-in duration-500">
      
      {/* Header & Actions */}
      <div className="flex-none flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Staffing Operations</h1>
          <p className="text-text-secondary mt-1">Manage role demand, requisitions, and candidate pipeline.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/workforce/jobs">
            <Button variant="outline" className="border-surface-3 text-white hover:bg-surface-2">
              <Search className="w-4 h-4 mr-2" /> Browse Network
            </Button>
          </Link>
          <Button className="bg-primary hover:bg-primary/90 text-black font-bold">
            <Plus className="w-4 h-4 mr-2" /> Open Requisition
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-none flex gap-6 border-b border-surface-3 mb-6">
        {[
          { id: 'demand', label: 'Demand & Insights', icon: Activity },
          { id: 'requisitions', label: 'Active Requisitions', count: 3, icon: Briefcase },
          { id: 'pipeline', label: 'Candidate Pipeline', count: 12, icon: Users },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-4 text-sm font-bold transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === tab.id 
                ? 'border-primary text-primary' 
                : 'border-transparent text-text-secondary hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.count && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                activeTab === tab.id ? 'bg-primary/20 text-primary' : 'bg-surface-2 text-text-secondary'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-grow overflow-y-auto hide-scrollbar pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            
            {/* DEMAND & INSIGHTS TAB */}
            {activeTab === 'demand' && (
              <div className="space-y-6">
                {/* AI Forecast Hero */}
                <Card className="p-8 bg-[#0B0F14] border-primary/30 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Sparkles className="w-32 h-32 text-primary" />
                  </div>
                  <div className="relative z-10 max-w-3xl">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-5 h-5 text-primary" />
                      <h2 className="text-lg font-bold text-white uppercase tracking-wider">AI Staffing Forecast</h2>
                    </div>
                    <p className="text-2xl font-display font-bold text-white leading-tight mb-6">
                      Based on a <span className="text-success">24% increase</span> in Peptide Therapy leads this month, your current clinical staff will hit capacity in <span className="text-warning">12 days</span>.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <Button className="bg-primary hover:bg-primary/90 text-black font-bold">
                        Open NP Requisition
                      </Button>
                      <Link to="/dashboard/intelligence">
                        <Button variant="outline" className="border-surface-3 text-white hover:bg-surface-2">
                          View Capacity Model
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="p-6 bg-surface-1 border-surface-3">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center text-warning">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider">Blocked Revenue</h3>
                        <p className="text-2xl font-display font-bold text-white">$18.5k<span className="text-sm text-text-secondary font-sans font-medium">/mo</span></p>
                      </div>
                    </div>
                    <p className="text-sm text-text-secondary">Estimated revenue lost due to staffing bottlenecks (IV Therapy).</p>
                  </Card>
                  
                  <Card className="p-6 bg-surface-1 border-surface-3">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center text-success">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider">Service Mix Shift</h3>
                        <p className="text-2xl font-display font-bold text-white">+40%</p>
                      </div>
                    </div>
                    <p className="text-sm text-text-secondary">Increase in longevity consults requiring specialized NP coverage.</p>
                  </Card>

                  <Card className="p-6 bg-surface-1 border-surface-3">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider">Time to Hire</h3>
                        <p className="text-2xl font-display font-bold text-white">12 Days</p>
                      </div>
                    </div>
                    <p className="text-sm text-text-secondary">Average time to fill clinical roles using Novalyte AI matching.</p>
                  </Card>
                </div>
              </div>
            )}

            {/* REQUISITIONS TAB */}
            {activeTab === 'requisitions' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {[
                  { 
                    title: 'Registered Nurse (RN)', type: 'Full-time', location: 'Austin, TX', 
                    status: 'Sourcing', urgency: 'Critical', impact: 'Blocking 15 consults/wk',
                    matches: 5, daysOpen: 4, color: 'text-danger', bg: 'bg-danger/10', border: 'border-danger/20'
                  },
                  { 
                    title: 'Medical Assistant', type: 'Part-time', location: 'Austin, TX', 
                    status: 'Interviewing', urgency: 'Medium', impact: 'Front desk bottleneck',
                    matches: 3, daysOpen: 12, color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/20'
                  },
                  { 
                    title: 'Nurse Practitioner (NP)', type: 'Contract', location: 'Remote', 
                    status: 'Draft', urgency: 'Low', impact: 'Future capacity planning',
                    matches: 0, daysOpen: 0, color: 'text-text-secondary', bg: 'bg-surface-3', border: 'border-surface-3'
                  },
                ].map((req, i) => (
                  <Card key={i} className="p-6 bg-[#0B0F14] border-surface-3 hover:border-surface-4 transition-colors flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 rounded-lg bg-surface-2 border border-surface-3 flex items-center justify-center text-primary">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border ${
                        req.status === 'Sourcing' ? 'bg-primary/10 text-primary border-primary/20' :
                        req.status === 'Interviewing' ? 'bg-success/10 text-success border-success/20' :
                        'bg-surface-3 text-text-secondary border-surface-3'
                      }`}>
                        {req.status}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-2">{req.title}</h3>
                    
                    <div className="flex flex-wrap items-center gap-3 text-sm text-text-secondary mb-4">
                      <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" /> {req.type}</span>
                      <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {req.location}</span>
                    </div>

                    <div className={`mb-6 p-3 rounded-lg border flex items-start gap-3 ${req.bg} ${req.border}`}>
                      <AlertTriangle className={`w-5 h-5 shrink-0 ${req.color}`} />
                      <div>
                        <span className={`text-xs font-bold uppercase tracking-wider block mb-0.5 ${req.color}`}>{req.urgency} Urgency</span>
                        <span className={`text-sm ${req.color} opacity-90`}>{req.impact}</span>
                      </div>
                    </div>
                    
                    <div className="mt-auto pt-4 border-t border-surface-3">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex -space-x-2">
                          {Array.from({ length: Math.min(req.matches, 3) }).map((_, j) => (
                            <div key={j} className="w-8 h-8 rounded-full bg-surface-3 border-2 border-[#0B0F14] flex items-center justify-center text-xs font-bold text-white">
                              {String.fromCharCode(65 + j)}
                            </div>
                          ))}
                          {req.matches > 3 && (
                            <div className="w-8 h-8 rounded-full bg-surface-2 border-2 border-[#0B0F14] flex items-center justify-center text-xs font-bold text-text-secondary">
                              +{req.matches - 3}
                            </div>
                          )}
                          {req.matches === 0 && (
                            <span className="text-sm text-text-secondary">No matches yet</span>
                          )}
                        </div>
                        {req.daysOpen > 0 && (
                          <span className="text-xs text-text-secondary font-mono">Open {req.daysOpen}d</span>
                        )}
                      </div>
                      <Button variant="outline" className="w-full border-surface-3 text-white hover:bg-surface-2">
                        Manage Requisition
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* PIPELINE TAB */}
            {activeTab === 'pipeline' && (
              <div className="flex gap-6 h-full min-w-max pb-4 overflow-x-auto hide-scrollbar">
                {[
                  { 
                    id: 'sourced', label: 'AI Sourced', color: 'bg-primary',
                    candidates: [
                      { name: 'Sarah Jenkins, RN', role: 'Registered Nurse', score: 95, exp: '8 yrs', matchReason: 'Matches high volume of IV Therapy patients.' },
                      { name: 'Dr. Emily Chen', role: 'Nurse Practitioner', score: 88, exp: '5 yrs', matchReason: 'Strong background in longevity protocols.' }
                    ]
                  },
                  { 
                    id: 'screening', label: 'Screening', color: 'bg-warning',
                    candidates: [
                      { name: 'Marcus Johnson', role: 'Medical Assistant', score: 82, exp: '3 yrs', matchReason: 'Local to Austin, available immediately.' }
                    ]
                  },
                  { 
                    id: 'interviewing', label: 'Interviewing', color: 'bg-secondary',
                    candidates: [
                      { name: 'Jessica Alba, RN', role: 'Registered Nurse', score: 91, exp: '6 yrs', matchReason: 'Completed technical screen. Scheduled for clinical interview.' }
                    ]
                  },
                  { 
                    id: 'offer', label: 'Offer Extended', color: 'bg-success',
                    candidates: []
                  }
                ].map(stage => (
                  <div key={stage.id} className="w-80 flex-shrink-0 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-white flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${stage.color} shadow-[0_0_8px_currentColor]`} /> 
                        {stage.label}
                      </h3>
                      <span className="text-xs font-mono font-bold text-text-secondary bg-surface-2 border border-surface-3 px-2 py-1 rounded-md">
                        {stage.candidates.length}
                      </span>
                    </div>
                    
                    <div className="space-y-3 flex-grow overflow-y-auto hide-scrollbar pr-1">
                      {stage.candidates.map((candidate, i) => (
                        <Card key={i} className="p-4 bg-[#0B0F14] border-surface-3 hover:border-surface-4 cursor-pointer transition-colors group">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-white">{candidate.name}</h4>
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border bg-success/10 text-success border-success/20 flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3" /> {candidate.score}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-xs font-medium text-text-secondary mb-3">
                            <span>{candidate.role}</span>
                            <span>•</span>
                            <span>{candidate.exp}</span>
                          </div>
                          
                          <div className="mb-3 px-2 py-1.5 rounded bg-primary/5 border border-primary/10 flex items-start gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                            <span className="text-[10px] font-bold text-primary uppercase tracking-wider leading-tight">
                              {candidate.matchReason}
                            </span>
                          </div>

                          <div className="flex justify-between items-center text-xs text-text-secondary pt-2 border-t border-surface-3">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> Austin, TX
                            </span>
                            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                          </div>
                        </Card>
                      ))}
                      
                      {stage.candidates.length === 0 && (
                        <div className="p-6 text-center border-2 border-dashed border-surface-3 rounded-xl bg-surface-1/30">
                          <p className="text-sm text-text-secondary">No candidates in this stage</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
