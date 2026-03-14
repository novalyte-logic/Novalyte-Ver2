import React from 'react';
import { motion } from 'motion/react';
import { Users, TrendingUp, Calendar, Activity, ArrowRight } from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Link } from 'react-router-dom';

export function ClinicOverview() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Overview</h1>
          <p className="text-text-secondary mt-1">Welcome back. Here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">Download Report</Button>
          <Button>New Patient</Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "New Leads", value: "24", change: "+12%", icon: Users, color: "text-primary" },
          { label: "Consults Scheduled", value: "8", change: "+4%", icon: Calendar, color: "text-secondary" },
          { label: "Conversion Rate", value: "32%", change: "+2.4%", icon: TrendingUp, color: "text-success" },
          { label: "Active Patients", value: "156", change: "+18", icon: Activity, color: "text-warning" },
        ].map((metric, i) => (
          <Card key={i} className="p-6 bg-surface-1 border-surface-3">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg bg-surface-2 flex items-center justify-center ${metric.color}`}>
                <metric.icon className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-success bg-success/10 px-2 py-1 rounded">
                {metric.change}
              </span>
            </div>
            <h3 className="text-text-secondary text-sm font-medium">{metric.label}</h3>
            <p className="text-3xl font-display font-bold text-text-primary mt-1">{metric.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Area */}
        <Card className="lg:col-span-2 p-6 bg-surface-1 border-surface-3 min-h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Revenue & Pipeline Velocity</h2>
            <select className="bg-surface-2 border border-surface-3 rounded-lg px-3 py-1.5 text-sm">
              <option>Last 30 Days</option>
              <option>This Quarter</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="flex-grow flex items-center justify-center border border-dashed border-surface-3 rounded-xl bg-surface-2/50">
            <p className="text-text-secondary font-mono text-sm">[ Pipeline Visualization Chart ]</p>
          </div>
        </Card>

        {/* Action Items */}
        <Card className="p-6 bg-surface-1 border-surface-3">
          <h2 className="text-xl font-bold mb-6">Priority Actions</h2>
          <div className="space-y-4">
            {[
              { title: "Review 3 new high-intent leads", time: "10m ago", type: "lead" },
              { title: "Approve staffing request for RN", time: "1h ago", type: "workforce" },
              { title: "Follow up with David R. (TRT)", time: "2h ago", type: "patient" },
              { title: "Update clinic availability", time: "1d ago", type: "system" },
            ].map((action, i) => (
              <div key={i} className="flex items-start gap-4 p-3 rounded-lg hover:bg-surface-2 transition-colors cursor-pointer group">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors">{action.title}</p>
                  <p className="text-xs text-text-secondary mt-1">{action.time}</p>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-6">View All Tasks</Button>
        </Card>
      </div>
    </div>
  );
}
