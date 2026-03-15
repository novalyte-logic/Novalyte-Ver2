import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Search, Filter, MoreVertical, CheckCircle2, XCircle, 
  Clock, ArrowRight, TrendingUp, Users, DollarSign, 
  Target, ShieldCheck, Zap, BarChart3, ChevronDown, Activity
} from 'lucide-react';
import { collection, query, where, onSnapshot, doc, getDoc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/src/firebase';
import { useAuth } from '@/src/lib/auth/AuthContext';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { useShell } from '../components/shell/ShellContext';

import { AIService } from '../services/ai';

export function ClinicLeads() {
  const { user, role } = useAuth();
  const { openEntity } = useShell();
  const [filter, setFilter] = useState('all');
  const [expandedLead, setExpandedLead] = useState<string | null>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [scoringLeadId, setScoringLeadId] = useState<string | null>(null);

  React.useEffect(() => {
    if (!user) return;

    let q = query(collection(db, 'leads'));
    if (role === 'clinic') {
      q = query(collection(db, 'leads'), where('clinicId', '==', user.uid));
    }

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const leadsData = await Promise.all(snapshot.docs.map(async (leadDoc) => {
        const lead = leadDoc.data();
        let patientData: any = {};
        
        if (lead.patientId) {
          const patientSnap = await getDoc(doc(db, 'patients', lead.patientId));
          if (patientSnap.exists()) patientData = patientSnap.data();
        }

        return {
          id: leadDoc.id,
          patientId: lead.patientId,
          name: patientData.firstName ? `${patientData.firstName} ${patientData.lastName?.charAt(0) || ''}.` : 'Unknown Patient',
          intent: lead.treatmentInterest || 'General',
          score: lead.score || 0,
          status: lead.status || 'new',
          time: lead.createdAt ? 'Active' : 'New',
          email: patientData.email || 'N/A',
          phone: patientData.phone || 'N/A',
          source: lead.source || 'Organic Search',
          budget: lead.budget || 'Unknown',
          urgency: lead.urgency || 'Unknown',
          aiReasoning: lead.aiReasoning || 'Awaiting AI analysis...',
          patientRaw: patientData
        };
      }));
      
      setLeads(leadsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching leads:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, role]);

  const handleRunScoring = async (leadId: string) => {
    setScoringLeadId(leadId);
    try {
      const lead = leads.find(l => l.id === leadId);
      if (!lead || !lead.patientRaw) return;

      const insights = await AIService.generatePatientInsights(lead.patientRaw);
      
      const leadRef = doc(db, 'leads', leadId);
      await updateDoc(leadRef, {
        score: insights.score || insights.confidenceScore * 100 || 85,
        aiReasoning: insights.summary,
        updatedAt: serverTimestamp()
      });

      // Log audit event
      await addDoc(collection(db, 'auditEvents'), {
        clinicId: user?.uid,
        action: `AI Scoring Completed`,
        entityId: leadId,
        entityName: lead.name,
        timestamp: serverTimestamp(),
        type: 'info'
      });
    } catch (error) {
      console.error("Error running AI scoring:", error);
    } finally {
      setScoringLeadId(null);
    }
  };

  const handleStatusUpdate = async (leadId: string, newStatus: string) => {
    try {
      const leadRef = doc(db, 'leads', leadId);
      await updateDoc(leadRef, { 
        status: newStatus,
        updatedAt: serverTimestamp()
      });

      // Log audit event
      await addDoc(collection(db, 'auditEvents'), {
        clinicId: user?.uid,
        action: `Lead ${newStatus}`,
        entityId: leadId,
        entityName: leads.find(l => l.id === leadId)?.name || 'Lead',
        timestamp: serverTimestamp(),
        type: newStatus === 'qualified' ? 'success' : 'warning'
      });
    } catch (error) {
      console.error("Error updating lead status:", error);
    }
  };

  const filteredLeads = filter === 'all' ? leads : leads.filter(l => l.status === filter);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Lead Engine</h1>
          <p className="text-text-secondary mt-1">Acquisition metrics, quality control, and intake queue.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-2 border border-surface-3 flex-grow sm:flex-grow-0 justify-center">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
            </span>
            <span className="text-xs font-bold text-white whitespace-nowrap">Receiving Leads</span>
          </div>
          <Link to="/clinics/icp" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto border-surface-3 text-white hover:bg-surface-2">
              <Filter className="w-4 h-4 mr-2" /> Adjust Volume
            </Button>
          </Link>
          <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-black font-bold">
            <Zap className="w-4 h-4 mr-2" /> Buy Leads
          </Button>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Lead Velocity', value: `${leads.length}/mo`, trend: '+2 vs last week', icon: Activity, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Avg AI Score', value: '84', trend: 'Top 10% network', icon: Target, color: 'text-secondary', bg: 'bg-secondary/10' },
          { label: 'Cost Per Lead', value: '$45', trend: '-$5 vs target', icon: DollarSign, color: 'text-success', bg: 'bg-success/10' },
          { label: 'Conversion Rate', value: '28%', trend: '+2.1% this mo', icon: TrendingUp, color: 'text-warning', bg: 'bg-warning/10' },
        ].map((metric, i) => (
          <Card key={i} className="p-5 bg-[#0B0F14] border-surface-3">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg ${metric.bg} flex items-center justify-center ${metric.color}`}>
                <metric.icon className="w-5 h-5" />
              </div>
              <BarChart3 className="w-4 h-4 text-text-secondary opacity-50" />
            </div>
            <div>
              <h3 className="text-3xl font-display font-bold text-white mb-1">{metric.value}</h3>
              <p className="text-sm font-medium text-text-secondary mb-1">{metric.label}</p>
              <p className="text-xs text-text-secondary/70">{metric.trend}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Source Quality & Intake Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column: Source Quality (1/4) */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6 bg-[#0B0F14] border-surface-3 h-full">
            <h2 className="text-lg font-bold text-white mb-6">Source Quality</h2>
            <div className="space-y-6">
              {[
                { source: 'Organic Search', volume: '45%', score: 88, conv: '32%' },
                { source: 'Marketplace', volume: '30%', score: 92, conv: '38%' },
                { source: 'Paid Social', volume: '15%', score: 72, conv: '18%' },
                { source: 'Referral', volume: '10%', score: 85, conv: '45%' },
              ].map((s, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-bold text-white">{s.source}</span>
                    <span className="text-text-secondary">{s.volume}</span>
                  </div>
                  <div className="w-full h-2 bg-surface-2 rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-primary rounded-full" style={{ width: s.volume }} />
                  </div>
                  <div className="flex justify-between text-xs text-text-secondary">
                    <span>Avg Score: <span className="text-white">{s.score}</span></span>
                    <span>Conv: <span className="text-success">{s.conv}</span></span>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/dashboard/intelligence">
              <Button variant="outline" className="w-full mt-8 border-surface-3 text-white hover:bg-surface-2">
                View Attribution Report
              </Button>
            </Link>
          </Card>
        </div>

        {/* Right Column: Intake Queue (3/4) */}
        <div className="lg:col-span-3">
          <Card className="p-0 bg-[#0B0F14] border-surface-3 overflow-hidden">
            
            {/* Queue Controls */}
            <div className="p-4 border-b border-surface-3 bg-surface-1/50 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 hide-scrollbar">
                {['all', 'new', 'contacted', 'qualified', 'disqualified'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${
                      filter === f 
                        ? 'bg-primary/20 text-primary border border-primary/30' 
                        : 'bg-surface-2 text-text-secondary border border-transparent hover:text-white'
                    }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <input 
                  type="text" 
                  placeholder="Search leads..." 
                  className="w-full pl-9 pr-4 py-1.5 bg-surface-2 border border-surface-3 rounded-lg text-sm text-white focus:outline-none focus:border-primary/50 transition-all placeholder:text-text-secondary/50"
                />
              </div>
            </div>

            {/* Leads List */}
            <div className="divide-y divide-surface-3">
              {filteredLeads.map((lead) => (
                <div key={lead.id} className="group">
                  {/* Lead Row */}
                  <div 
                    className="p-4 hover:bg-surface-2/50 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    onClick={() => setExpandedLead(expandedLead === lead.id ? null : lead.id)}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-surface-2 border border-surface-3 flex items-center justify-center shrink-0">
                        <span className="font-bold text-text-secondary">{lead.name.charAt(0)}</span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-white truncate">{lead.name}</h4>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                            lead.status === 'new' ? 'bg-primary/10 text-primary border-primary/20' :
                            lead.status === 'qualified' ? 'bg-success/10 text-success border-success/20' :
                            lead.status === 'disqualified' ? 'bg-danger/10 text-danger border-danger/20' :
                            'bg-surface-3 text-text-secondary border-surface-3'
                          }`}>
                            {lead.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-text-secondary">
                          <span className="truncate">{lead.intent}</span>
                          <span className="hidden sm:inline">•</span>
                          <span className="hidden sm:flex items-center gap-1"><Clock className="w-3 h-3" /> {lead.time}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0">
                      <div className="text-right hidden md:block">
                        <div className="text-sm font-bold text-white">{lead.budget}</div>
                        <div className="text-xs text-text-secondary">{lead.urgency} Urgency</div>
                      </div>
                      
                      <div className="flex flex-col items-end">
                        <span className={`px-2 py-1 rounded text-xs font-mono font-bold border flex items-center gap-1 ${
                          lead.score >= 90 ? 'bg-success/10 text-success border-success/20' :
                          lead.score >= 80 ? 'bg-warning/10 text-warning border-warning/20' :
                          'bg-danger/10 text-danger border-danger/20'
                        }`}>
                          <ShieldCheck className="w-3 h-3" /> {lead.score}/100
                        </span>
                        <span className="text-[10px] text-text-secondary mt-1 uppercase tracking-wider">AI Score</span>
                      </div>

                      <ChevronDown className={`w-5 h-5 text-text-secondary transition-transform ${expandedLead === lead.id ? 'rotate-180' : ''}`} />
                    </div>
                  </div>

                  {/* Expanded AI Reasoning & Actions */}
                  <AnimatePresence>
                    {expandedLead === lead.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-surface-1/30 border-t border-surface-3"
                      >
                        <div className="p-4 sm:p-6 flex flex-col md:flex-row gap-6">
                          <div className="flex-grow space-y-4">
                            <div>
                              <h5 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">AI Qualification Reasoning</h5>
                              <p className="text-sm text-white leading-relaxed p-3 rounded-lg bg-surface-2 border border-surface-3">
                                {lead.aiReasoning}
                              </p>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                              <div>
                                <span className="text-xs text-text-secondary block mb-1">Source</span>
                                <span className="text-sm font-bold text-white">{lead.source}</span>
                              </div>
                              <div>
                                <span className="text-xs text-text-secondary block mb-1">Email</span>
                                <span className="text-sm font-bold text-white truncate block">{lead.email}</span>
                              </div>
                              <div>
                                <span className="text-xs text-text-secondary block mb-1">Phone</span>
                                <span className="text-sm font-bold text-white">{lead.phone}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="shrink-0 flex flex-row md:flex-col gap-2 justify-end">
                            <Button 
                              className="bg-secondary hover:bg-secondary/90 text-white font-bold w-full md:w-auto" 
                              onClick={(e) => { e.stopPropagation(); handleRunScoring(lead.id); }}
                              disabled={scoringLeadId === lead.id}
                            >
                              {scoringLeadId === lead.id ? (
                                <span className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 animate-spin" /> Scoring...
                                </span>
                              ) : (
                                <span className="flex items-center gap-2">
                                  <Zap className="w-4 h-4" /> Run AI Scoring
                                </span>
                              )}
                            </Button>
                            <Button className="bg-primary hover:bg-primary/90 text-black font-bold w-full md:w-auto" onClick={(e) => { e.stopPropagation(); openEntity('patient', lead.id); }}>
                              Open Dossier
                            </Button>
                            <Button 
                              variant="outline" 
                              className="border-success/30 text-success hover:bg-success/10 font-bold w-full md:w-auto"
                              onClick={(e) => { e.stopPropagation(); handleStatusUpdate(lead.id, 'qualified'); }}
                            >
                              <CheckCircle2 className="w-4 h-4 mr-2" /> Qualify
                            </Button>
                            <Button 
                              variant="outline" 
                              className="border-danger/30 text-danger hover:bg-danger/10 font-bold w-full md:w-auto"
                              onClick={(e) => { e.stopPropagation(); handleStatusUpdate(lead.id, 'disqualified'); }}
                            >
                              <XCircle className="w-4 h-4 mr-2" /> Disqualify
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
              
              {filteredLeads.length === 0 && (
                <div className="p-12 text-center flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-surface-2 flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-text-secondary" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">No leads found</h3>
                  <p className="text-text-secondary">Try adjusting your filters or search query.</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
