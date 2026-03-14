import React, { useState } from 'react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Search, Filter, MoreHorizontal, CheckSquare, Square, Download, Plus, Users, Activity, Target, ArrowUpRight, ArrowDownRight, Clock, MapPin, Phone, Mail, ChevronRight } from 'lucide-react';

export function CRM() {
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);
  const [view, setView] = useState<'all' | 'new' | 'qualified' | 'lost'>('all');

  const leads = [
    { id: 1, name: "Michael T.", email: "michael.t@example.com", phone: "+1 (555) 123-4567", location: "Miami, FL", intent: "Hormone Optimization", score: 92, status: "New", date: "2023-10-24T14:30:00Z", source: "Assessment", ltv: "$4,200" },
    { id: 2, name: "David R.", email: "david.r@example.com", phone: "+1 (555) 234-5678", location: "Austin, TX", intent: "Peptide Therapy", score: 85, status: "Contacted", date: "2023-10-24T10:15:00Z", source: "Directory", ltv: "$2,800" },
    { id: 3, name: "James L.", email: "james.l@example.com", phone: "+1 (555) 345-6789", location: "New York, NY", intent: "Longevity", score: 78, status: "Qualified", date: "2023-10-23T16:45:00Z", source: "Symptom Checker", ltv: "$5,500" },
    { id: 4, name: "Robert K.", email: "robert.k@example.com", phone: "+1 (555) 456-7890", location: "Chicago, IL", intent: "Cognitive Enhancement", score: 88, status: "New", date: "2023-10-23T09:20:00Z", source: "Assessment", ltv: "$3,100" },
    { id: 5, name: "William S.", email: "william.s@example.com", phone: "+1 (555) 567-8901", location: "Los Angeles, CA", intent: "Hormone Optimization", score: 81, status: "Lost", date: "2023-10-22T11:10:00Z", source: "Direct", ltv: "$0" },
    { id: 6, name: "Thomas B.", email: "thomas.b@example.com", phone: "+1 (555) 678-9012", location: "Denver, CO", intent: "Weight Management", score: 95, status: "Qualified", date: "2023-10-22T08:05:00Z", source: "Assessment", ltv: "$6,200" },
  ];

  const filteredLeads = leads.filter(lead => {
    if (view === 'all') return true;
    if (view === 'new') return lead.status === 'New';
    if (view === 'qualified') return lead.status === 'Qualified';
    if (view === 'lost') return lead.status === 'Lost';
    return true;
  });

  const toggleSelect = (id: number) => {
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
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary">Patient CRM</h1>
          <p className="text-text-secondary mt-1">Manage leads, accounts, and routing intelligence.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
          <Button className="flex items-center gap-2 group">
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" /> Add Lead
          </Button>
        </div>
      </div>

      {/* CRM Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-surface-1 border-surface-3 p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users className="w-24 h-24 text-primary" />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20"><Users className="w-5 h-5" /></div>
              <span className="flex items-center text-success text-sm font-mono bg-success/10 px-2 py-1 rounded-md border border-success/20">
                <ArrowUpRight className="w-3 h-3 mr-1" /> 142 this week
              </span>
            </div>
            <h3 className="text-text-secondary text-sm font-medium mb-1">Total Leads (30d)</h3>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-display font-bold text-text-primary">1,248</p>
            </div>
          </div>
        </Card>

        <Card className="bg-surface-1 border-surface-3 p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Target className="w-24 h-24 text-success" />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 rounded-xl bg-success/10 text-success border border-success/20"><Target className="w-5 h-5" /></div>
              <span className="flex items-center text-success text-sm font-mono bg-success/10 px-2 py-1 rounded-md border border-success/20">
                <ArrowUpRight className="w-3 h-3 mr-1" /> 4.2%
              </span>
            </div>
            <h3 className="text-text-secondary text-sm font-medium mb-1">Qualification Rate</h3>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-display font-bold text-text-primary">68.4%</p>
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
              <span className="flex items-center text-warning text-sm font-mono bg-warning/10 px-2 py-1 rounded-md border border-warning/20">
                <ArrowDownRight className="w-3 h-3 mr-1" /> 2m
              </span>
            </div>
            <h3 className="text-text-secondary text-sm font-medium mb-1">Avg Routing Time</h3>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-display font-bold text-text-primary">14m</p>
            </div>
          </div>
        </Card>

        <Card className="bg-surface-1 border-surface-3 p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <DollarSign className="w-24 h-24 text-warning" />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 rounded-xl bg-warning/10 text-warning border border-warning/20"><DollarSign className="w-5 h-5" /></div>
              <span className="flex items-center text-success text-sm font-mono bg-success/10 px-2 py-1 rounded-md border border-success/20">
                <ArrowUpRight className="w-3 h-3 mr-1" /> 12.1%
              </span>
            </div>
            <h3 className="text-text-secondary text-sm font-medium mb-1">Est. Pipeline Value</h3>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-display font-bold text-text-primary">$4.8M</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="bg-surface-1 border-surface-3 p-0 overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-5 border-b border-surface-3 bg-surface-2/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-1 bg-surface-2 p-1 rounded-lg border border-surface-3">
              {[
                { id: 'all', label: 'All Leads' },
                { id: 'new', label: 'New' },
                { id: 'qualified', label: 'Qualified' },
                { id: 'lost', label: 'Lost' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setView(tab.id as any)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    view === tab.id ? 'bg-surface-3 text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input 
                type="text" 
                placeholder="Search leads..." 
                className="w-full pl-9 pr-4 py-2 bg-surface-2 border border-surface-3 rounded-lg text-sm focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-2 h-9">
              <Filter className="w-4 h-4" /> Filter
            </Button>
          </div>
          
          {selectedLeads.length > 0 && (
            <div className="flex items-center gap-3 w-full sm:w-auto bg-primary/10 px-4 py-2 rounded-lg border border-primary/20 animate-in fade-in slide-in-from-top-2">
              <span className="text-sm font-medium text-primary">{selectedLeads.length} selected</span>
              <Button size="sm" variant="secondary" className="h-8">Push to Outreach</Button>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto flex-grow">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-text-secondary uppercase bg-surface-2/30 border-b border-surface-3">
              <tr>
                <th className="px-6 py-4 w-10">
                  <button onClick={toggleSelectAll} className="text-text-secondary hover:text-text-primary transition-colors">
                    {selectedLeads.length === filteredLeads.length && filteredLeads.length > 0 ? <CheckSquare className="w-4 h-4 text-primary" /> : <Square className="w-4 h-4" />}
                  </button>
                </th>
                <th className="px-6 py-4 font-medium tracking-wider">Patient Info</th>
                <th className="px-6 py-4 font-medium tracking-wider">Intent & Score</th>
                <th className="px-6 py-4 font-medium tracking-wider">Status</th>
                <th className="px-6 py-4 font-medium tracking-wider">Source</th>
                <th className="px-6 py-4 font-medium tracking-wider">Est. LTV</th>
                <th className="px-6 py-4 text-right font-medium tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-3">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className={`hover:bg-surface-2 transition-colors group ${selectedLeads.includes(lead.id) ? 'bg-primary/5' : ''}`}>
                  <td className="px-6 py-4">
                    <button onClick={() => toggleSelect(lead.id)} className="text-text-secondary hover:text-text-primary transition-colors">
                      {selectedLeads.includes(lead.id) ? <CheckSquare className="w-4 h-4 text-primary" /> : <Square className="w-4 h-4" />}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-text-primary mb-1 group-hover:text-primary transition-colors">{lead.name}</div>
                    <div className="flex flex-col gap-1 text-xs text-text-secondary">
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {lead.email}</span>
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {lead.phone}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {lead.location}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-text-primary mb-2">{lead.intent}</div>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-surface-3 h-1.5 rounded-full overflow-hidden max-w-[100px]">
                        <div className={`h-full ${lead.score >= 90 ? 'bg-success' : lead.score >= 80 ? 'bg-primary' : 'bg-warning'}`} style={{ width: `${lead.score}%` }} />
                      </div>
                      <span className={`font-mono text-xs font-bold ${lead.score >= 90 ? 'text-success' : lead.score >= 80 ? 'text-primary' : 'text-warning'}`}>
                        {lead.score}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${
                      lead.status === 'New' ? 'bg-primary/10 text-primary border-primary/20' :
                      lead.status === 'Qualified' ? 'bg-success/10 text-success border-success/20' :
                      lead.status === 'Lost' ? 'bg-danger/10 text-danger border-danger/20' :
                      'bg-surface-3 text-text-secondary border-surface-3'
                    }`}>
                      {lead.status}
                    </span>
                    <div className="text-xs text-text-secondary mt-2 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {new Date(lead.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-text-secondary text-sm">{lead.source}</td>
                  <td className="px-6 py-4 font-mono font-medium text-text-primary">{lead.ltv}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="outline" size="sm" className="h-8 px-2">
                        Inspect
                      </Button>
                      <button className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-surface-3 rounded-md transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredLeads.length === 0 && (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-surface-3 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-text-primary mb-2">No leads found</h3>
              <p className="text-text-secondary">Try adjusting your filters or search query.</p>
            </div>
          )}
        </div>
        
        {/* Pagination */}
        <div className="p-5 border-t border-surface-3 bg-surface-2/50 flex items-center justify-between text-sm text-text-secondary">
          <span>Showing {filteredLeads.length} of 1,248 entries</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Dummy DollarSign icon for this file scope
function DollarSign(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
}
