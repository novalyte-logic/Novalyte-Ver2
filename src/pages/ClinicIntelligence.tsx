import React from 'react';
import { motion } from 'motion/react';
import { BrainCircuit, TrendingUp, Activity, BarChart2, ArrowRight } from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';

export function ClinicIntelligence() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Intelligence</h1>
          <p className="text-text-secondary mt-1">AI-driven insights on your clinic's performance and patient outcomes.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">Generate Report</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-surface-1 border-surface-3">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-text-primary">Revenue Growth</h3>
          </div>
          <p className="text-text-secondary text-sm mb-4">Your TRT protocol revenue is up 18% this month, driven by higher retention rates.</p>
          <Button variant="outline" size="sm" className="w-full">View Details</Button>
        </Card>

        <Card className="p-6 bg-surface-1 border-surface-3">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-text-primary">Patient Outcomes</h3>
          </div>
          <p className="text-text-secondary text-sm mb-4">Patients on the longevity protocol show a 22% improvement in biological age markers.</p>
          <Button variant="outline" size="sm" className="w-full">View Details</Button>
        </Card>

        <Card className="p-6 bg-surface-1 border-surface-3">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center text-warning">
              <BarChart2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-text-primary">Lead Quality</h3>
          </div>
          <p className="text-text-secondary text-sm mb-4">Leads from the 'Executive Health' campaign have a 45% higher conversion rate.</p>
          <Button variant="outline" size="sm" className="w-full">View Details</Button>
        </Card>
      </div>

      <Card className="p-6 bg-surface-1 border-surface-3 min-h-[400px] flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Treatment Mix & ROI</h2>
          <select className="bg-surface-2 border border-surface-3 rounded-lg px-3 py-1.5 text-sm">
            <option>Last 30 Days</option>
            <option>This Quarter</option>
            <option>This Year</option>
          </select>
        </div>
        <div className="flex-grow flex items-center justify-center border border-dashed border-surface-3 rounded-xl bg-surface-2/50">
          <p className="text-text-secondary font-mono text-sm">[ Treatment Mix Visualization Chart ]</p>
        </div>
      </Card>
    </div>
  );
}
