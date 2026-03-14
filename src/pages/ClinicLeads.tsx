import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, MoreVertical, CheckCircle2, XCircle, Clock, ArrowRight } from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { useShell } from '../components/shell/ShellContext';

export function ClinicLeads() {
  const { openEntity } = useShell();
  const [filter, setFilter] = useState('all');

  const leads = [
    { id: '1', name: "Michael T.", intent: "Hormone Optimization", score: 92, status: "new", time: "10m ago", email: "m.t@example.com", phone: "(555) 123-4567" },
    { id: '2', name: "David R.", intent: "Peptide Therapy", score: 85, status: "new", time: "1h ago", email: "david.r@example.com", phone: "(555) 987-6543" },
    { id: '3', name: "James L.", intent: "Longevity", score: 78, status: "contacted", time: "3h ago", email: "j.l@example.com", phone: "(555) 456-7890" },
    { id: '4', name: "Robert K.", intent: "Cognitive Enhancement", score: 88, status: "qualified", time: "1d ago", email: "rob.k@example.com", phone: "(555) 234-5678" },
    { id: '5', name: "William S.", intent: "Hormone Optimization", score: 81, status: "disqualified", time: "1d ago", email: "will.s@example.com", phone: "(555) 876-5432" },
  ];

  const filteredLeads = filter === 'all' ? leads : leads.filter(l => l.status === filter);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Lead Management</h1>
          <p className="text-text-secondary mt-1">Review, qualify, and route incoming patient leads.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">Export CSV</Button>
          <Button>Request Leads</Button>
        </div>
      </div>

      <Card className="p-6 bg-surface-1 border-surface-3">
        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {['all', 'new', 'contacted', 'qualified', 'disqualified'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === f 
                    ? 'bg-primary text-background' 
                    : 'bg-surface-2 text-text-secondary hover:bg-surface-3 hover:text-text-primary'
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
              className="w-full pl-9 pr-4 py-2 bg-surface-2 border border-surface-3 rounded-lg text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
            />
          </div>
        </div>

        {/* Leads Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-3 text-text-secondary text-sm">
                <th className="pb-3 font-medium">Patient Name</th>
                <th className="pb-3 font-medium">Primary Intent</th>
                <th className="pb-3 font-medium">AI Score</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Received</th>
                <th className="pb-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredLeads.map((lead, i) => (
                <tr key={i} className="border-b border-surface-3 hover:bg-surface-2/50 transition-colors group cursor-pointer" onClick={() => openEntity('patient', lead.id)}>
                  <td className="py-4">
                    <div className="font-medium text-text-primary">{lead.name}</div>
                    <div className="text-xs text-text-secondary mt-1">{lead.email}</div>
                  </td>
                  <td className="py-4 text-text-secondary">{lead.intent}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded text-xs font-mono font-medium border ${
                      lead.score >= 90 ? 'bg-success/10 text-success border-success/20' :
                      lead.score >= 80 ? 'bg-warning/10 text-warning border-warning/20' :
                      'bg-surface-3 text-text-secondary border-surface-3'
                    }`}>
                      {lead.score}/100
                    </span>
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                      lead.status === 'new' ? 'bg-primary/10 text-primary' :
                      lead.status === 'qualified' ? 'bg-success/10 text-success' :
                      lead.status === 'disqualified' ? 'bg-danger/10 text-danger' :
                      'bg-surface-3 text-text-secondary'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="py-4 text-text-secondary flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {lead.time}
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 rounded hover:bg-surface-3 text-success transition-colors" title="Qualify">
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded hover:bg-surface-3 text-danger transition-colors" title="Disqualify">
                        <XCircle className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded hover:bg-surface-3 text-text-secondary transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredLeads.length === 0 && (
            <div className="py-12 text-center text-text-secondary">
              No leads found matching the current filters.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
