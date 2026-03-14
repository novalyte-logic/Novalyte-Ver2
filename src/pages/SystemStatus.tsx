import React from 'react';
import { Activity, CheckCircle2, Server, Database, Zap, Globe, ShieldCheck } from 'lucide-react';
import { Card } from '@/src/components/ui/Card';

export function SystemStatus() {
  const systems = [
    { name: 'API Gateway', status: 'operational', uptime: '99.99%', icon: Server },
    { name: 'Patient Assessment Engine', status: 'operational', uptime: '100%', icon: Activity },
    { name: 'Clinic Routing Logic', status: 'operational', uptime: '99.98%', icon: Zap },
    { name: 'Marketplace Sync', status: 'operational', uptime: '99.95%', icon: Database },
    { name: 'AI Inference Nodes', status: 'operational', uptime: '99.99%', icon: ShieldCheck },
    { name: 'Web Application', status: 'operational', uptime: '100%', icon: Globe }
  ];

  const incidents = [
    {
      date: 'March 10, 2026',
      title: 'Elevated latency in AI Inference Nodes',
      status: 'Resolved',
      description: 'We observed elevated latency in our AI inference nodes for approximately 15 minutes. The issue was identified as a sudden spike in traffic and was automatically mitigated by our auto-scaling infrastructure. No data was lost, and all assessments were processed successfully.'
    },
    {
      date: 'February 28, 2026',
      title: 'Scheduled Maintenance: Database Upgrade',
      status: 'Completed',
      description: 'We successfully completed a scheduled upgrade to our primary database cluster to improve read/write performance. The maintenance window lasted 45 minutes, during which the application was placed in read-only mode.'
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 text-success text-sm font-medium mb-6">
            <CheckCircle2 className="w-4 h-4" /> All Systems Operational
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-6">
            System Status
          </h1>
          <p className="text-xl text-text-secondary">
            Real-time status and uptime metrics for Novalyte AI infrastructure.
          </p>
        </div>

        {/* Current Status */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-text-primary mb-6">Current Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {systems.map((sys, index) => (
              <Card key={index} className="bg-surface-1 border-surface-3 p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${sys.status === 'operational' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                    <sys.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-text-primary">{sys.name}</h3>
                    <p className="text-sm text-text-secondary">Uptime: {sys.uptime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${sys.status === 'operational' ? 'bg-success' : 'bg-warning'}`} />
                  <span className={`text-sm font-medium ${sys.status === 'operational' ? 'text-success' : 'text-warning'}`}>
                    {sys.status === 'operational' ? 'Operational' : 'Degraded'}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Past Incidents */}
        <div>
          <h2 className="text-2xl font-bold text-text-primary mb-6">Past Incidents</h2>
          <div className="space-y-6">
            {incidents.map((incident, index) => (
              <Card key={index} className="bg-surface-1 border-surface-3 p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-text-primary">{incident.title}</h3>
                    <p className="text-sm text-text-secondary mt-1">{incident.date}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                    incident.status === 'Resolved' || incident.status === 'Completed' 
                      ? 'bg-success/10 text-success border-success/20' 
                      : 'bg-warning/10 text-warning border-warning/20'
                  }`}>
                    {incident.status}
                  </span>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  {incident.description}
                </p>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
