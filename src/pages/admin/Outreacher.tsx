import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, Users, Activity, Play, Pause, Plus, Mail, MessageSquare, 
  ArrowUpRight, Clock, Target, CheckCircle2, AlertTriangle, Search, 
  Filter, MoreHorizontal, ChevronRight, Inbox, ShieldCheck, Zap,
  BarChart3, RefreshCw, Edit3, XCircle, CheckSquare, Square
} from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';

export function Outreacher() {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'queue' | 'accounts'>('campaigns');
  const [selectedQueueItems, setSelectedQueueItems] = useState<string[]>([]);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface-1/50 p-6 rounded-2xl border border-surface-3 backdrop-blur-xl">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">Outreach Operations</h1>
          <p className="text-text-secondary text-sm mt-1">Campaign orchestration, sender health, and automated dispatch.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button variant="outline" className="flex items-center gap-2 border-surface-3 bg-[#0B0F14] hover:bg-surface-2 text-white w-full sm:w-auto">
            <Inbox className="w-4 h-4" /> Connect Inbox
          </Button>
          <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-black font-bold w-full sm:w-auto group">
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" /> New Campaign
          </Button>
        </div>
      </div>

      {/* Top Level Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Daily Send Volume" 
          value="1,248" 
          subtext="of 2,500 limit" 
          progress={50}
          icon={Send} 
          color="text-primary" 
          bg="bg-primary/10" 
          border="border-primary/20" 
        />
        <MetricCard 
          title="Sender Health Score" 
          value="98.5%" 
          subtext="0.1% bounce rate" 
          progress={98.5}
          icon={ShieldCheck} 
          color="text-success" 
          bg="bg-success/10" 
          border="border-success/20" 
        />
        <MetricCard 
          title="Avg Open Rate" 
          value="42.8%" 
          subtext="+4.1% vs last week" 
          progress={42.8}
          icon={Activity} 
          color="text-secondary" 
          bg="bg-secondary/10" 
          border="border-secondary/20" 
        />
        <MetricCard 
          title="CRM Conversion" 
          value="12.4%" 
          subtext="Reply to Qualified" 
          progress={12.4}
          icon={Target} 
          color="text-warning" 
          bg="bg-warning/10" 
          border="border-warning/20" 
        />
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-1 bg-[#0B0F14] p-1 rounded-xl border border-surface-3 w-fit">
        {[
          { id: 'campaigns', label: 'Active Campaigns', icon: BarChart3 },
          { id: 'queue', label: 'Dispatch Queue', icon: Clock },
          { id: 'accounts', label: 'Sender Accounts', icon: Inbox },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === tab.id 
                  ? 'bg-primary/10 text-primary shadow-[0_0_15px_rgba(53,212,255,0.1)]' 
                  : 'text-text-secondary hover:text-white hover:bg-surface-2'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content: Campaigns */}
      {activeTab === 'campaigns' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {[
            { 
              name: "Clinic Onboarding Sequence", 
              audience: "New Clinics", 
              sent: 450, 
              opens: "48%", 
              replies: "12%", 
              bounces: "0.2%",
              status: "Active", 
              type: "Email", 
              crmFeedback: "14 Leads Qualified",
              nextSend: "In 2 hours" 
            },
            { 
              name: "Patient Re-engagement (TRT)", 
              audience: "Lost Leads", 
              sent: 1200, 
              opens: "35%", 
              replies: "8%", 
              bounces: "1.1%",
              status: "Paused", 
              type: "Email + SMS", 
              crmFeedback: "3 Reactivated",
              nextSend: "Paused" 
            },
            { 
              name: "Vendor Partnership Outreach", 
              audience: "Health Tech", 
              sent: 150, 
              opens: "62%", 
              replies: "24%", 
              bounces: "0.0%",
              status: "Active", 
              type: "Email", 
              crmFeedback: "8 Meetings Booked",
              nextSend: "Tomorrow 9AM" 
            },
            { 
              name: "Workforce Talent Activation", 
              audience: "Inactive RNs", 
              sent: 850, 
              opens: "41%", 
              replies: "15%", 
              bounces: "0.5%",
              status: "Active", 
              type: "SMS", 
              crmFeedback: "42 Profiles Updated",
              nextSend: "In 45 mins" 
            },
          ].map((campaign, i) => (
            <Card key={i} className="bg-surface-1 border-surface-3 p-0 flex flex-col group hover:border-surface-3/80 transition-colors shadow-xl">
              <div className="p-6 border-b border-surface-3 bg-gradient-to-r from-surface-2 to-surface-1">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl border ${campaign.status === 'Active' ? 'bg-success/10 text-success border-success/20' : 'bg-warning/10 text-warning border-warning/20'}`}>
                      {campaign.status === 'Active' ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white group-hover:text-primary transition-colors">{campaign.name}</h3>
                      <div className="flex items-center gap-3 text-xs text-text-secondary mt-1 font-mono">
                        <span className="flex items-center gap-1"><Target className="w-3.5 h-3.5" /> {campaign.audience}</span>
                        <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {campaign.type}</span>
                      </div>
                    </div>
                  </div>
                  <button className="p-1.5 text-text-secondary hover:text-white hover:bg-surface-3 rounded-md transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 flex-grow">
                <StatBlock label="Sent" value={campaign.sent} />
                <StatBlock label="Open Rate" value={campaign.opens} color="text-success" />
                <StatBlock label="Reply Rate" value={campaign.replies} color="text-primary" />
                <StatBlock label="Bounce Rate" value={campaign.bounces} color={parseFloat(campaign.bounces) > 1 ? 'text-danger' : 'text-text-secondary'} />
              </div>
              
              <div className="px-6 py-4 bg-[#0B0F14] border-t border-surface-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-xs text-text-secondary font-mono">
                    <Clock className="w-3.5 h-3.5" /> Next send: <strong className="text-white">{campaign.nextSend}</strong>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-primary font-mono">
                    <RefreshCw className="w-3.5 h-3.5" /> CRM Sync: <strong>{campaign.crmFeedback}</strong>
                  </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button variant="outline" size="sm" className="h-9 border-surface-3 bg-surface-1 text-white hover:bg-surface-2 w-full sm:w-auto">
                    Analytics
                  </Button>
                  <Button variant={campaign.status === 'Active' ? 'secondary' : 'primary'} size="sm" className="w-10 h-9 p-0 flex items-center justify-center shrink-0">
                    {campaign.status === 'Active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Tab Content: Dispatch Queue */}
      {activeTab === 'queue' && (
        <Card className="bg-surface-1 border-surface-3 p-0 overflow-hidden flex flex-col shadow-2xl">
          <div className="p-4 border-b border-surface-3 bg-gradient-to-r from-surface-2 to-surface-1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <input 
                  type="text" 
                  placeholder="Search queue..." 
                  className="w-full pl-9 pr-4 py-2 bg-[#0B0F14] border border-surface-3 rounded-lg text-sm text-white focus:outline-none focus:border-primary/50 transition-all"
                />
              </div>
              <Button variant="outline" size="sm" className="flex items-center gap-2 h-9 border-surface-3 bg-[#0B0F14] text-white">
                <Filter className="w-4 h-4" /> Filter
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-text-secondary font-mono"><strong className="text-white">342</strong> pending</span>
              <Button size="sm" variant="secondary" className="h-9"><Pause className="w-4 h-4 mr-2" /> Pause Queue</Button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="text-[10px] text-text-secondary uppercase tracking-wider bg-[#0B0F14] border-b border-surface-3">
                <tr>
                  <th className="px-6 py-3 w-10"><Square className="w-4 h-4" /></th>
                  <th className="px-6 py-3 font-medium">Recipient</th>
                  <th className="px-6 py-3 font-medium">Campaign</th>
                  <th className="px-6 py-3 font-medium">AI Personalization</th>
                  <th className="px-6 py-3 font-medium">Scheduled</th>
                  <th className="px-6 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-3 text-sm">
                {[
                  { name: "Dr. Sarah Jenkins", email: "sarah.j@example.com", campaign: "Clinic Onboarding", ai: "Drafted - Ready", aiStatus: "success", time: "10:45 AM" },
                  { name: "Marcus Thorne", email: "m.thorne@example.com", campaign: "Patient Re-engagement", ai: "Manual Review Required", aiStatus: "warning", time: "10:48 AM" },
                  { name: "Elena Rodriguez", email: "elena.r@example.com", campaign: "Vendor Partnership", ai: "Drafted - Ready", aiStatus: "success", time: "10:50 AM" },
                  { name: "Dr. James Wilson", email: "j.wilson@example.com", campaign: "Clinic Onboarding", ai: "Missing Variables", aiStatus: "danger", time: "11:00 AM" },
                ].map((item, i) => (
                  <tr key={i} className="hover:bg-surface-2/50 transition-colors">
                    <td className="px-6 py-4"><Square className="w-4 h-4 text-text-secondary" /></td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-white mb-0.5">{item.name}</div>
                      <div className="text-xs text-text-secondary font-mono">{item.email}</div>
                    </td>
                    <td className="px-6 py-4 text-text-secondary">{item.campaign}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1.5 w-fit ${
                        item.aiStatus === 'success' ? 'bg-success/10 text-success border-success/20' :
                        item.aiStatus === 'warning' ? 'bg-warning/10 text-warning border-warning/20' :
                        'bg-danger/10 text-danger border-danger/20'
                      }`}>
                        {item.aiStatus === 'success' && <Zap className="w-3 h-3" />}
                        {item.aiStatus === 'warning' && <AlertTriangle className="w-3 h-3" />}
                        {item.aiStatus === 'danger' && <XCircle className="w-3 h-3" />}
                        {item.ai}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-white">{item.time}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" className="h-8 px-2 border-surface-3 bg-[#0B0F14] text-white hover:bg-surface-2">
                          <Edit3 className="w-3.5 h-3.5" />
                        </Button>
                        <Button size="sm" className="h-8 bg-primary hover:bg-primary/90 text-black font-bold px-3">
                          Send Now
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Tab Content: Sender Accounts */}
      {activeTab === 'accounts' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[
            { email: "alex@novalyte.io", provider: "Google Workspace", health: 99.2, limit: "450/500", status: "Healthy", warmup: false },
            { email: "hello@novalyte.io", provider: "Google Workspace", health: 98.5, limit: "480/500", status: "Warning", warmup: false },
            { email: "partners@novalyte.io", provider: "Microsoft 365", health: 100, limit: "12/50", status: "Warming Up", warmup: true },
          ].map((acc, i) => (
            <Card key={i} className="bg-surface-1 border-surface-3 p-6 shadow-xl relative overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-surface-2 border border-surface-3 text-white">
                    <Inbox className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{acc.email}</h3>
                    <p className="text-xs text-text-secondary">{acc.provider}</p>
                  </div>
                </div>
                <button className="p-1.5 text-text-secondary hover:text-white hover:bg-surface-3 rounded-md transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-text-secondary uppercase tracking-wider font-bold">Sender Health</span>
                    <span className={acc.health > 95 ? 'text-success font-mono font-bold' : 'text-warning font-mono font-bold'}>{acc.health}%</span>
                  </div>
                  <div className="w-full bg-[#0B0F14] h-1.5 rounded-full overflow-hidden border border-surface-3">
                    <div className={`h-full ${acc.health > 95 ? 'bg-success' : 'bg-warning'}`} style={{ width: `${acc.health}%` }} />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-text-secondary uppercase tracking-wider font-bold">Daily Limit</span>
                    <span className="text-white font-mono font-bold">{acc.limit}</span>
                  </div>
                  <div className="w-full bg-[#0B0F14] h-1.5 rounded-full overflow-hidden border border-surface-3">
                    <div className="h-full bg-primary" style={{ width: `${(parseInt(acc.limit.split('/')[0]) / parseInt(acc.limit.split('/')[1])) * 100}%` }} />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-surface-3 flex items-center justify-between">
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1.5 ${
                  acc.status === 'Healthy' ? 'bg-success/10 text-success border-success/20' :
                  acc.status === 'Warming Up' ? 'bg-primary/10 text-primary border-primary/20' :
                  'bg-warning/10 text-warning border-warning/20'
                }`}>
                  {acc.status === 'Healthy' && <ShieldCheck className="w-3 h-3" />}
                  {acc.status === 'Warming Up' && <Zap className="w-3 h-3" />}
                  {acc.status === 'Warning' && <AlertTriangle className="w-3 h-3" />}
                  {acc.status}
                </span>
                <Button variant="outline" size="sm" className="h-8 text-xs border-surface-3 bg-[#0B0F14] text-white hover:bg-surface-2">
                  Settings
                </Button>
              </div>
            </Card>
          ))}
          
          <button className="bg-[#0B0F14] border border-dashed border-surface-3 rounded-2xl p-6 flex flex-col items-center justify-center text-text-secondary hover:text-white hover:border-surface-4 transition-colors min-h-[250px]">
            <Plus className="w-8 h-8 mb-3" />
            <span className="font-bold">Connect New Inbox</span>
            <span className="text-xs mt-1">Google Workspace or Microsoft 365</span>
          </button>
        </div>
      )}
    </div>
  );
}

// Helper Components

function MetricCard({ title, value, subtext, progress, icon: Icon, color, bg, border }: any) {
  return (
    <Card className="bg-surface-1 border-surface-3 p-5 relative overflow-hidden group shadow-2xl">
      <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity ${color}`}>
        <Icon className="w-24 h-24" />
      </div>
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-2 rounded-xl ${bg} ${color} border ${border}`}><Icon className="w-4 h-4" /></div>
        </div>
        <h3 className="text-text-secondary text-xs font-bold uppercase tracking-wider mb-1">{title}</h3>
        <div className="flex items-baseline gap-2 mb-4">
          <p className="text-3xl font-display font-bold text-white">{value}</p>
          <span className="text-[10px] text-text-secondary uppercase tracking-wider font-mono">{subtext}</span>
        </div>
        <div className="w-full bg-[#0B0F14] h-1.5 rounded-full overflow-hidden border border-surface-3">
          <div className={`h-full rounded-full ${bg.replace('/10', '')}`} style={{ width: `${progress}%` }} />
        </div>
      </div>
    </Card>
  );
}

function StatBlock({ label, value, color = "text-white" }: { label: string, value: string | number, color?: string }) {
  return (
    <div className="bg-[#0B0F14] p-4 rounded-xl border border-surface-3">
      <p className="text-[10px] text-text-secondary mb-1 uppercase tracking-wider font-bold">{label}</p>
      <p className={`font-mono text-xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
