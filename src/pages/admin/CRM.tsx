import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Filter, MoreHorizontal, CheckSquare, Square, Download, Plus, 
  Users, Activity, Target, ArrowUpRight, ArrowDownRight, Clock, MapPin, 
  Phone, Mail, ChevronRight, Upload, Send, Tag, Edit3, MessageSquare,
  FileText, X, CheckCircle2, AlertTriangle, Zap
} from 'lucide-react';
import { collection, query, onSnapshot, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/src/firebase';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';

type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Nurture' | 'Lost';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  intent: string;
  score: number;
  status: LeadStatus;
  date: string;
  source: string;
  ltv: string;
  tags: string[];
  notes: string;
}

export function CRM() {
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [view, setView] = useState<'all' | 'new' | 'qualified' | 'nurture' | 'lost'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const q = query(collection(db, 'leads'));
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
          name: patientData.firstName ? `${patientData.firstName} ${patientData.lastName?.charAt(0) || ''}.` : 'Unknown Patient',
          email: patientData.email || 'N/A',
          phone: patientData.phone || 'N/A',
          location: patientData.city ? `${patientData.city}, ${patientData.state}` : 'Unknown',
          intent: lead.treatmentInterest || 'General',
          score: lead.score || 85,
          status: lead.status === 'new' ? 'New' : lead.status === 'contacted' ? 'Contacted' : lead.status === 'scheduled' ? 'Qualified' : 'Nurture',
          date: lead.createdAt?.toDate().toISOString() || new Date().toISOString(),
          source: 'Assessment',
          ltv: lead.budget || 'Unknown',
          tags: lead.tags || [],
          notes: lead.notes?.[0]?.text || 'No notes'
        } as Lead;
      }));
      
      setLeads(leadsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching leads:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredLeads = leads.filter(lead => {
    const matchesTab = 
      view === 'all' ? true :
      view === 'new' ? lead.status === 'New' :
      view === 'qualified' ? lead.status === 'Qualified' :
      view === 'nurture' ? lead.status === 'Nurture' :
      lead.status === 'Lost';
      
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          lead.id.toLowerCase().includes(searchQuery.toLowerCase());
                          
    return matchesTab && matchesSearch;
  });

  const toggleSelect = (id: string) => {
    if (selectedLeads.includes(id)) {
      setSelectedLeads(selectedLeads.filter(lId => lId !== id));
    } else {
      setSelectedLeads([...selectedLeads, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map(l => l.id));
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface-1/50 p-6 rounded-2xl border border-surface-3 backdrop-blur-xl">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">Patient CRM</h1>
          <p className="text-text-secondary text-sm mt-1">Lead management, segmentation, and outreach handoff.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <Button variant="outline" className="flex items-center gap-2 border-surface-3 bg-[#0B0F14] hover:bg-surface-2 text-white flex-grow sm:flex-grow-0">
            <Upload className="w-4 h-4" /> Import CSV
          </Button>
          <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-black font-bold flex-grow sm:flex-grow-0 group">
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" /> Add Lead
          </Button>
        </div>
      </div>

      {/* CRM Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Leads (30d)" value="1,248" trend="+142" trendLabel="this week" icon={Users} color="text-primary" bg="bg-primary/10" border="border-primary/20" />
        <MetricCard title="Qualification Rate" value="68.4%" trend="+4.2%" trendLabel="vs last month" icon={Target} color="text-success" bg="bg-success/10" border="border-success/20" />
        <MetricCard title="Avg Routing Time" value="14m" trend="-2m" trendLabel="vs last month" trendType="success" icon={Activity} color="text-secondary" bg="bg-secondary/10" border="border-secondary/20" />
        <MetricCard title="Est. Pipeline Value" value="$4.8M" trend="+12.1%" trendLabel="vs last month" icon={DollarSign} color="text-warning" bg="bg-warning/10" border="border-warning/20" />
      </div>

      {/* Main Data Table */}
      <Card className="bg-surface-1 border-surface-3 p-0 overflow-hidden flex flex-col shadow-2xl">
        {/* Toolbar */}
        <div className="p-4 border-b border-surface-3 bg-gradient-to-r from-surface-2 to-surface-1 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-1 bg-[#0B0F14] p-1 rounded-xl border border-surface-3 w-full lg:w-auto overflow-x-auto">
            {[
              { id: 'all', label: 'All Leads' },
              { id: 'new', label: 'New' },
              { id: 'qualified', label: 'Qualified' },
              { id: 'nurture', label: 'Nurture' },
              { id: 'lost', label: 'Lost' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setView(tab.id as any)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                  view === tab.id 
                    ? 'bg-primary/10 text-primary shadow-[0_0_15px_rgba(53,212,255,0.1)]' 
                    : 'text-text-secondary hover:text-white hover:bg-surface-2'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="relative w-full lg:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, email, or ID..." 
                className="w-full pl-9 pr-4 py-2 bg-[#0B0F14] border border-surface-3 rounded-lg text-sm text-white focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2 border-surface-3 bg-[#0B0F14] hover:bg-surface-2 text-white shrink-0">
              <Filter className="w-4 h-4" /> Filter
            </Button>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        <AnimatePresence>
          {selectedLeads.length > 0 && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-primary/5 border-b border-primary/20 px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-primary bg-primary/10 px-2 py-1 rounded-md border border-primary/20">
                  {selectedLeads.length} selected
                </span>
                <span className="text-sm text-text-secondary">Bulk actions:</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <Button size="sm" variant="outline" className="h-8 border-surface-3 bg-[#0B0F14] text-white hover:bg-surface-2 flex-grow sm:flex-grow-0">
                  <Tag className="w-3.5 h-3.5 mr-1.5" /> Tag
                </Button>
                <Button size="sm" variant="outline" className="h-8 border-surface-3 bg-[#0B0F14] text-white hover:bg-surface-2 flex-grow sm:flex-grow-0">
                  <Edit3 className="w-3.5 h-3.5 mr-1.5" /> Change Stage
                </Button>
                <Button size="sm" className="h-8 bg-primary hover:bg-primary/90 text-black font-bold flex-grow sm:flex-grow-0 w-full sm:w-auto mt-2 sm:mt-0">
                  <Send className="w-3.5 h-3.5 mr-1.5" /> Push to Outreacher
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Table */}
        <div className="overflow-x-auto flex-grow">
          <table className="w-full text-left border-collapse">
            <thead className="text-[10px] text-text-secondary uppercase tracking-wider bg-[#0B0F14] border-b border-surface-3">
              <tr>
                <th className="px-6 py-4 w-10">
                  <button onClick={toggleSelectAll} className="text-text-secondary hover:text-white transition-colors">
                    {selectedLeads.length === filteredLeads.length && filteredLeads.length > 0 ? <CheckSquare className="w-4 h-4 text-primary" /> : <Square className="w-4 h-4" />}
                  </button>
                </th>
                <th className="px-6 py-4 font-medium">Patient Info</th>
                <th className="px-6 py-4 font-medium">Intent & Score</th>
                <th className="px-6 py-4 font-medium">Stage</th>
                <th className="px-6 py-4 font-medium">Source & Est. Value</th>
                <th className="px-6 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-3 text-sm">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className={`hover:bg-surface-2/50 transition-colors group ${selectedLeads.includes(lead.id) ? 'bg-primary/5' : ''}`}>
                  <td className="px-6 py-4">
                    <button onClick={() => toggleSelect(lead.id)} className="text-text-secondary hover:text-white transition-colors">
                      {selectedLeads.includes(lead.id) ? <CheckSquare className="w-4 h-4 text-primary" /> : <Square className="w-4 h-4" />}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-white mb-1 group-hover:text-primary transition-colors cursor-pointer" onClick={() => setSelectedLead(lead)}>
                      {lead.name}
                    </div>
                    <div className="flex flex-col gap-1 text-xs text-text-secondary">
                      <span className="flex items-center gap-1.5"><Mail className="w-3 h-3" /> {lead.email}</span>
                      <span className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> {lead.phone}</span>
                      <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> {lead.location}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-white mb-2">{lead.intent}</div>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-[#0B0F14] h-1.5 rounded-full overflow-hidden max-w-[100px] border border-surface-3">
                        <div className={`h-full ${lead.score >= 90 ? 'bg-success shadow-[0_0_10px_rgba(46,230,166,0.5)]' : lead.score >= 80 ? 'bg-primary shadow-[0_0_10px_rgba(53,212,255,0.5)]' : 'bg-warning shadow-[0_0_10px_rgba(255,184,77,0.5)]'}`} style={{ width: `${lead.score}%` }} />
                      </div>
                      <span className={`font-mono text-xs font-bold ${lead.score >= 90 ? 'text-success' : lead.score >= 80 ? 'text-primary' : 'text-warning'}`}>
                        {lead.score}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={lead.status} />
                    <div className="text-xs text-text-secondary mt-2 flex items-center gap-1.5">
                      <Clock className="w-3 h-3" /> {new Date(lead.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-text-secondary mb-1">{lead.source}</div>
                    <div className="font-mono font-bold text-success text-xs">{lead.ltv}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        onClick={() => setSelectedLead(lead)}
                        variant="ghost" 
                        size="sm" 
                        className="h-8 text-xs text-text-secondary hover:text-white"
                      >
                        Inspect
                      </Button>
                      <button className="p-1.5 text-text-secondary hover:text-white hover:bg-surface-3 rounded-md transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredLeads.length === 0 && (
            <div className="p-16 text-center">
              <Users className="w-12 h-12 text-surface-4 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">No leads found</h3>
              <p className="text-text-secondary text-sm">Try adjusting your filters or search query.</p>
            </div>
          )}
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-surface-3 bg-[#0B0F14] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-secondary">
          <span>Showing {filteredLeads.length} of {leads.length} entries</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled className="h-8 border-surface-3 bg-surface-1">Previous</Button>
            <Button variant="outline" size="sm" className="h-8 border-surface-3 bg-surface-1 text-white hover:bg-surface-2">Next</Button>
          </div>
        </div>
      </Card>

      {/* Inspection Drawer */}
      <AnimatePresence>
        {selectedLead && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setSelectedLead(null)}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-surface-1 border-l border-surface-3 z-50 shadow-2xl overflow-y-auto"
            >
              <div className="p-6 border-b border-surface-3 flex justify-between items-start sticky top-0 bg-surface-1/90 backdrop-blur-md z-10">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">{selectedLead.id}</span>
                    <StatusBadge status={selectedLead.status} />
                  </div>
                  <h2 className="text-xl font-display font-bold text-white">{selectedLead.name}</h2>
                  <p className="text-sm text-text-secondary flex items-center gap-1 mt-1"><MapPin className="w-3.5 h-3.5" /> {selectedLead.location}</p>
                </div>
                <button onClick={() => setSelectedLead(null)} className="p-2 text-text-secondary hover:text-white bg-surface-2 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-8">
                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-black font-bold text-sm h-10">
                    <Send className="w-4 h-4 mr-2" /> Push to Outreach
                  </Button>
                  <Button variant="outline" className="w-full border-surface-3 text-white hover:bg-surface-2 text-sm h-10">
                    <Edit3 className="w-4 h-4 mr-2" /> Edit Lead
                  </Button>
                </div>

                {/* Contact Info */}
                <div>
                  <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Users className="w-4 h-4" /> Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-[#0B0F14] rounded-xl border border-surface-3">
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-text-secondary" />
                        <span className="text-sm text-white">{selectedLead.email}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-[#0B0F14] rounded-xl border border-surface-3">
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-text-secondary" />
                        <span className="text-sm text-white">{selectedLead.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Intelligence Snapshot */}
                <div>
                  <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Activity className="w-4 h-4" /> Intelligence Snapshot
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-[#0B0F14] rounded-xl border border-surface-3">
                      <p className="text-xs text-text-secondary mb-1">Qualification Score</p>
                      <p className={`text-xl font-mono font-bold ${selectedLead.score >= 90 ? 'text-success' : selectedLead.score >= 80 ? 'text-primary' : 'text-warning'}`}>{selectedLead.score}/100</p>
                    </div>
                    <div className="p-4 bg-[#0B0F14] rounded-xl border border-surface-3">
                      <p className="text-xs text-text-secondary mb-1">Est. LTV</p>
                      <p className="text-xl font-mono font-bold text-success">{selectedLead.ltv}</p>
                    </div>
                    <div className="col-span-2 p-4 bg-[#0B0F14] rounded-xl border border-surface-3">
                      <p className="text-xs text-text-secondary mb-1">Primary Intent</p>
                      <p className="text-sm font-medium text-white mt-1">{selectedLead.intent}</p>
                    </div>
                  </div>
                </div>

                {/* Tags & Segmentation */}
                <div>
                  <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Tag className="w-4 h-4" /> Segmentation
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedLead.tags.map(tag => (
                      <span key={tag} className="px-2.5 py-1 bg-surface-2 border border-surface-3 rounded-md text-xs text-white">
                        {tag}
                      </span>
                    ))}
                    <button className="px-2.5 py-1 bg-[#0B0F14] border border-dashed border-surface-4 rounded-md text-xs text-text-secondary hover:text-white hover:border-surface-3 transition-colors flex items-center gap-1">
                      <Plus className="w-3 h-3" /> Add Tag
                    </button>
                  </div>
                </div>

                {/* CRM Notes */}
                <div>
                  <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-4 flex items-center gap-2 justify-between">
                    <span className="flex items-center gap-2"><FileText className="w-4 h-4" /> Internal Notes</span>
                    <span className="text-primary cursor-pointer hover:underline normal-case tracking-normal">Add Note</span>
                  </h3>
                  <div className="p-4 bg-[#0B0F14] border border-surface-3 rounded-xl text-sm text-text-secondary italic">
                    {selectedLead.notes}
                  </div>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper Components

function MetricCard({ title, value, trend, trendLabel, trendType = 'success', icon: Icon, color, bg, border }: any) {
  const isUp = trend.startsWith('+');
  return (
    <Card className="bg-surface-1 border-surface-3 p-5 relative overflow-hidden group shadow-2xl">
      <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity ${color}`}>
        <Icon className="w-24 h-24" />
      </div>
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-2 rounded-xl ${bg} ${color} border ${border}`}><Icon className="w-4 h-4" /></div>
          <span className={`flex items-center text-[10px] font-bold font-mono px-2 py-0.5 rounded border uppercase tracking-wider ${
            trendType === 'success' ? 'bg-success/10 text-success border-success/20' : 'bg-warning/10 text-warning border-warning/20'
          }`}>
            {isUp ? <ArrowUpRight className="w-3 h-3 mr-1" /> : trendType === 'warning' ? <AlertTriangle className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />} 
            {trend}
          </span>
        </div>
        <h3 className="text-text-secondary text-xs font-bold uppercase tracking-wider mb-1">{title}</h3>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-display font-bold text-white">{value}</p>
          {trendLabel && <span className="text-xs text-text-secondary">{trendLabel}</span>}
        </div>
      </div>
    </Card>
  );
}

function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1 w-fit ${
      status === 'New' ? 'bg-primary/10 text-primary border-primary/20' : 
      status === 'Qualified' ? 'bg-success/10 text-success border-success/20' :
      status === 'Contacted' ? 'bg-secondary/10 text-secondary border-secondary/20' :
      status === 'Nurture' ? 'bg-warning/10 text-warning border-warning/20' :
      'bg-danger/10 text-danger border-danger/20'
    }`}>
      {status === 'New' && <Zap className="w-3 h-3" />}
      {status === 'Qualified' && <CheckCircle2 className="w-3 h-3" />}
      {status === 'Contacted' && <MessageSquare className="w-3 h-3" />}
      {status === 'Nurture' && <Clock className="w-3 h-3" />}
      {status === 'Lost' && <AlertTriangle className="w-3 h-3" />}
      {status}
    </span>
  );
}

// Dummy DollarSign icon for this file scope
function DollarSign(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
}
