import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { useShell } from '../components/shell/ShellContext';

export function ClinicPipeline() {
  const { openEntity } = useShell();

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold">Patient Pipeline</h1>
          <p className="text-text-secondary mt-1">Manage your incoming leads and patient flow.</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 rounded-lg bg-primary text-background font-medium text-sm hover:bg-primary-hover transition-colors">
            New Patient
          </button>
        </div>
      </div>

      <div className="flex-grow overflow-x-auto hide-scrollbar">
        {/* Kanban Board */}
        <div className="flex gap-6 h-full min-w-max pb-4">
          {/* Column 1 */}
          <div className="w-80 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-text-primary flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" /> New Leads
              </h3>
              <span className="text-xs font-mono text-text-secondary bg-surface-2 px-2 py-1 rounded">3</span>
            </div>
            <div className="space-y-4 flex-grow">
              {[
                { id: '1', name: "Michael T.", intent: "Hormone Optimization", score: 92, time: "10m ago" },
                { id: '2', name: "David R.", intent: "Peptide Therapy", score: 85, time: "1h ago" },
                { id: '3', name: "James L.", intent: "Longevity", score: 78, time: "3h ago" },
              ].map((lead, i) => (
                <Card 
                  key={i} 
                  onClick={() => openEntity('patient', lead.id)}
                  className="p-4 bg-surface-2 border-surface-3 hover:border-primary/30 cursor-pointer transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-text-primary">{lead.name}</h4>
                    <span className="text-xs font-mono text-success bg-success/10 px-1.5 py-0.5 rounded border border-success/20">Score: {lead.score}</span>
                  </div>
                  <p className="text-sm text-text-secondary mb-3">{lead.intent}</p>
                  <div className="flex justify-between items-center text-xs text-text-secondary">
                    <span>{lead.time}</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Column 2 */}
          <div className="w-80 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-text-primary flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-warning" /> Triage / Review
              </h3>
              <span className="text-xs font-mono text-text-secondary bg-surface-2 px-2 py-1 rounded">2</span>
            </div>
            <div className="space-y-4 flex-grow">
              {[
                { id: '4', name: "Robert K.", intent: "Cognitive Enhancement", score: 88, time: "1d ago" },
                { id: '5', name: "William S.", intent: "Hormone Optimization", score: 81, time: "1d ago" },
              ].map((lead, i) => (
                <Card 
                  key={i} 
                  onClick={() => openEntity('patient', lead.id)}
                  className="p-4 bg-surface-2 border-surface-3 hover:border-warning/30 cursor-pointer transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-text-primary">{lead.name}</h4>
                    <span className="text-xs font-mono text-success bg-success/10 px-1.5 py-0.5 rounded border border-success/20">Score: {lead.score}</span>
                  </div>
                  <p className="text-sm text-text-secondary mb-3">{lead.intent}</p>
                  <div className="flex justify-between items-center text-xs text-text-secondary">
                    <span>{lead.time}</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Column 3 */}
          <div className="w-80 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-text-primary flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary" /> Consult Scheduled
              </h3>
              <span className="text-xs font-mono text-text-secondary bg-surface-2 px-2 py-1 rounded">1</span>
            </div>
            <div className="space-y-4 flex-grow">
              {[
                { id: '6', name: "Thomas B.", intent: "Peptide Therapy", score: 95, time: "Tomorrow, 10:00 AM" },
              ].map((lead, i) => (
                <Card 
                  key={i} 
                  onClick={() => openEntity('patient', lead.id)}
                  className="p-4 bg-surface-2 border-surface-3 hover:border-secondary/30 cursor-pointer transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-text-primary">{lead.name}</h4>
                    <span className="text-xs font-mono text-success bg-success/10 px-1.5 py-0.5 rounded border border-success/20">Score: {lead.score}</span>
                  </div>
                  <p className="text-sm text-text-secondary mb-3">{lead.intent}</p>
                  <div className="flex justify-between items-center text-xs text-text-secondary">
                    <span className="text-secondary">{lead.time}</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </Card>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

