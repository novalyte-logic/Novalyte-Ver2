import React, { useState } from 'react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Send, Users, Activity, Play, Pause, Plus, Mail, MessageSquare, ArrowUpRight, Clock, Target, CheckCircle2, AlertTriangle, Search, Filter, MoreHorizontal, ChevronRight } from 'lucide-react';

export function Outreacher() {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'queue' | 'templates'>('campaigns');

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary">Outreach Manager</h1>
          <p className="text-text-secondary mt-1">Bulk campaigns, personalization, and sending queues.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Mail className="w-4 h-4" /> Connect Inbox
          </Button>
          <Button className="flex items-center gap-2 group">
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" /> New Campaign
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-surface-1 border-surface-3 p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Send className="w-24 h-24 text-primary" />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20"><Send className="w-5 h-5" /></div>
              <span className="flex items-center text-success text-sm font-mono bg-success/10 px-2 py-1 rounded-md border border-success/20">
                <ArrowUpRight className="w-3 h-3 mr-1" /> 12.4%
              </span>
            </div>
            <h3 className="text-text-secondary text-sm font-medium mb-1">Emails Sent (Today)</h3>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-display font-bold text-text-primary">1,248</p>
            </div>
          </div>
        </Card>

        <Card className="bg-surface-1 border-surface-3 p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity className="w-24 h-24 text-success" />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 rounded-xl bg-success/10 text-success border border-success/20"><Activity className="w-5 h-5" /></div>
              <span className="flex items-center text-success text-sm font-mono bg-success/10 px-2 py-1 rounded-md border border-success/20">
                <ArrowUpRight className="w-3 h-3 mr-1" /> 4.1%
              </span>
            </div>
            <h3 className="text-text-secondary text-sm font-medium mb-1">Avg Open Rate</h3>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-display font-bold text-text-primary">42.5%</p>
            </div>
          </div>
        </Card>

        <Card className="bg-surface-1 border-surface-3 p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <MessageSquare className="w-24 h-24 text-secondary" />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 rounded-xl bg-secondary/10 text-secondary border border-secondary/20"><MessageSquare className="w-5 h-5" /></div>
              <span className="flex items-center text-success text-sm font-mono bg-success/10 px-2 py-1 rounded-md border border-success/20">
                <ArrowUpRight className="w-3 h-3 mr-1" /> 2.8%
              </span>
            </div>
            <h3 className="text-text-secondary text-sm font-medium mb-1">Reply Rate</h3>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-display font-bold text-text-primary">12.4%</p>
            </div>
          </div>
        </Card>

        <Card className="bg-surface-1 border-surface-3 p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Clock className="w-24 h-24 text-warning" />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 rounded-xl bg-warning/10 text-warning border border-warning/20"><Clock className="w-5 h-5" /></div>
              <span className="flex items-center text-text-secondary text-sm font-mono bg-surface-3 px-2 py-1 rounded-md border border-surface-3">
                Processing
              </span>
            </div>
            <h3 className="text-text-secondary text-sm font-medium mb-1">In Queue</h3>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-display font-bold text-text-primary">342</p>
              <span className="text-sm text-text-secondary">messages</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex items-center gap-1 bg-surface-2 p-1 rounded-lg border border-surface-3 w-fit">
        {[
          { id: 'campaigns', label: 'Active Campaigns' },
          { id: 'queue', label: 'Sending Queue' },
          { id: 'templates', label: 'Templates' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab.id ? 'bg-surface-3 text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'campaigns' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[
            { name: "Clinic Onboarding Sequence", audience: "New Clinics", sent: 450, opens: "48%", replies: "12%", status: "Active", type: "Email", nextSend: "In 2 hours" },
            { name: "Patient Re-engagement (TRT)", audience: "Lost Leads", sent: 1200, opens: "35%", replies: "8%", status: "Paused", type: "Email + SMS", nextSend: "Paused" },
            { name: "Vendor Partnership Outreach", audience: "Health Tech", sent: 150, opens: "62%", replies: "24%", status: "Active", type: "Email", nextSend: "Tomorrow 9AM" },
            { name: "Workforce Talent Activation", audience: "Inactive RNs", sent: 850, opens: "41%", replies: "15%", status: "Active", type: "SMS", nextSend: "In 45 mins" },
          ].map((campaign, i) => (
            <Card key={i} className="bg-surface-1 border-surface-3 p-0 flex flex-col group hover:border-surface-3/80 transition-colors">
              <div className="p-6 border-b border-surface-3 bg-surface-2/30">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${campaign.status === 'Active' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                      {campaign.status === 'Active' ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-text-primary group-hover:text-primary transition-colors">{campaign.name}</h3>
                      <div className="flex items-center gap-3 text-sm text-text-secondary mt-1">
                        <span className="flex items-center gap-1"><Target className="w-3.5 h-3.5" /> {campaign.audience}</span>
                        <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {campaign.type}</span>
                      </div>
                    </div>
                  </div>
                  <button className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-surface-3 rounded-md transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 grid grid-cols-3 gap-4 flex-grow">
                <div className="bg-surface-2 p-4 rounded-xl border border-surface-3">
                  <p className="text-xs text-text-secondary mb-1 uppercase tracking-wider font-medium">Sent</p>
                  <p className="font-mono text-xl font-bold text-text-primary">{campaign.sent}</p>
                </div>
                <div className="bg-surface-2 p-4 rounded-xl border border-surface-3">
                  <p className="text-xs text-text-secondary mb-1 uppercase tracking-wider font-medium">Open Rate</p>
                  <p className="font-mono text-xl font-bold text-success">{campaign.opens}</p>
                </div>
                <div className="bg-surface-2 p-4 rounded-xl border border-surface-3">
                  <p className="text-xs text-text-secondary mb-1 uppercase tracking-wider font-medium">Reply Rate</p>
                  <p className="font-mono text-xl font-bold text-primary">{campaign.replies}</p>
                </div>
              </div>
              
              <div className="px-6 py-4 bg-surface-2/50 border-t border-surface-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <Clock className="w-4 h-4" />
                  <span>Next send: <strong className="text-text-primary font-medium">{campaign.nextSend}</strong></span>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" className="h-9">Edit Sequence</Button>
                  <Button variant={campaign.status === 'Active' ? 'secondary' : 'primary'} size="sm" className="w-10 h-9 p-0 flex items-center justify-center">
                    {campaign.status === 'Active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'queue' && (
        <Card className="bg-surface-1 border-surface-3 p-0 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-surface-3 bg-surface-2/50 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <input 
                  type="text" 
                  placeholder="Search queue..." 
                  className="w-full pl-9 pr-4 py-2 bg-surface-2 border border-surface-3 rounded-lg text-sm focus:outline-none focus:border-primary/50 transition-all"
                />
              </div>
              <Button variant="outline" size="sm" className="flex items-center gap-2 h-9">
                <Filter className="w-4 h-4" /> Filter
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-text-secondary"><strong className="text-text-primary">342</strong> messages pending</span>
              <Button size="sm" variant="secondary" className="h-9"><Pause className="w-4 h-4 mr-2" /> Pause Queue</Button>
            </div>
          </div>
          <div className="p-12 text-center">
            <Clock className="w-12 h-12 text-surface-3 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-text-primary mb-2">Queue Processing Normally</h3>
            <p className="text-text-secondary">Messages are being dispatched at 45/minute.</p>
          </div>
        </Card>
      )}
    </div>
  );
}
