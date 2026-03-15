import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, Search, Filter, Download, Plus, MapPin, Star, 
  MoreVertical, CheckCircle2, AlertTriangle, ShieldCheck, 
  Activity, Users, ArrowUpRight, ArrowDownRight, Clock, Edit3, MessageSquare,
  FileText, Zap, X
} from 'lucide-react';
import { collection, query, onSnapshot, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/src/firebase';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';

type ClinicStatus = 'Verified' | 'Pending Review' | 'Suspended';
type OutreachStatus = 'Active' | 'Nurture' | 'Churn Risk' | 'Onboarding';

interface Clinic {
  id: string;
  name: string;
  location: string;
  status: ClinicStatus;
  outreachStatus: OutreachStatus;
  rating: number;
  leads: number;
  revenue: string;
  joined: string;
  lastContact: string;
  tags: string[];
}

export function DirectoryManager() {
  const [activeTab, setActiveTab] = useState<'all' | 'verified' | 'pending' | 'suspended'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const q = query(collection(db, 'clinics'));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const clinicsData = await Promise.all(snapshot.docs.map(async (clinicDoc) => {
        const clinic = clinicDoc.data();
        
        return {
          id: clinicDoc.id,
          name: clinic.name || 'Unknown Clinic',
          location: clinic.city && clinic.state ? `${clinic.city}, ${clinic.state}` : 'Unknown Location',
          status: clinic.status || 'Pending Review',
          outreachStatus: clinic.outreachStatus || 'Onboarding',
          rating: clinic.rating || 0,
          leads: clinic.leadsCount || 0,
          revenue: clinic.revenue || '$0',
          joined: clinic.createdAt?.toDate().toISOString() || new Date().toISOString(),
          lastContact: clinic.lastContact || 'Never',
          tags: clinic.tags || []
        } as Clinic;
      }));
      
      setClinics(clinicsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching clinics:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredClinics = clinics.filter(clinic => {
    const matchesTab = 
      activeTab === 'all' ? true :
      activeTab === 'verified' ? clinic.status === 'Verified' :
      activeTab === 'pending' ? clinic.status === 'Pending Review' :
      clinic.status === 'Suspended';
      
    const matchesSearch = clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          clinic.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          clinic.id.toLowerCase().includes(searchQuery.toLowerCase());
                          
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface-1/50 p-6 rounded-2xl border border-surface-3 backdrop-blur-xl">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">Directory Management</h1>
          <p className="text-text-secondary text-sm mt-1">Clinic inventory, verification, and relationship oversight.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button variant="outline" className="flex items-center gap-2 border-surface-3 bg-[#0B0F14] hover:bg-surface-2 text-white w-full sm:w-auto">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
          <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-black font-bold w-full sm:w-auto group">
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" /> Add Node
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Network Nodes" value="248" trend="+12" trendLabel="this month" icon={Building2} color="text-primary" bg="bg-primary/10" border="border-primary/20" />
        <MetricCard title="Verified Partners" value="215" trend="14" trendLabel="pending" trendType="warning" icon={ShieldCheck} color="text-success" bg="bg-success/10" border="border-success/20" />
        <MetricCard title="Total Leads Routed" value="14.2k" trend="+8.4%" trendLabel="vs last month" icon={Users} color="text-secondary" bg="bg-secondary/10" border="border-secondary/20" />
        <MetricCard title="Network Revenue" value="$1.2M" trend="+15.2%" trendLabel="vs last month" icon={Activity} color="text-warning" bg="bg-warning/10" border="border-warning/20" />
      </div>

      {/* Main Data Table */}
      <Card className="bg-surface-1 border-surface-3 p-0 overflow-hidden flex flex-col shadow-2xl">
        {/* Toolbar */}
        <div className="p-4 border-b border-surface-3 bg-gradient-to-r from-surface-2 to-surface-1 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-1 bg-[#0B0F14] p-1 rounded-xl border border-surface-3 w-full lg:w-auto overflow-x-auto">
            {[
              { id: 'all', label: 'All Clinics' },
              { id: 'verified', label: 'Verified' },
              { id: 'pending', label: 'Pending Review' },
              { id: 'suspended', label: 'Suspended' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                  activeTab === tab.id 
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
                placeholder="Search ID, name, or location..." 
                className="w-full pl-9 pr-4 py-2 bg-[#0B0F14] border border-surface-3 rounded-lg text-sm text-white focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2 border-surface-3 bg-[#0B0F14] hover:bg-surface-2 text-white shrink-0">
              <Filter className="w-4 h-4" /> Filter
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto flex-grow">
          <table className="w-full text-left border-collapse">
            <thead className="text-[10px] text-text-secondary uppercase tracking-wider bg-[#0B0F14] border-b border-surface-3">
              <tr>
                <th className="px-6 py-4 font-medium">Clinic & ID</th>
                <th className="px-6 py-4 font-medium">Location</th>
                <th className="px-6 py-4 font-medium">Status & Outreach</th>
                <th className="px-6 py-4 font-medium">Performance</th>
                <th className="px-6 py-4 font-medium">Tags</th>
                <th className="px-6 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-3 text-sm">
              {filteredClinics.map((clinic) => (
                <tr key={clinic.id} className="hover:bg-surface-2/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-white mb-1 group-hover:text-primary transition-colors cursor-pointer" onClick={() => setSelectedClinic(clinic)}>
                      {clinic.name}
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono text-text-secondary">{clinic.id}</span>
                      <span className="text-surface-3">•</span>
                      <span className="text-text-secondary">Joined {new Date(clinic.joined).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-text-secondary text-xs">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" /> {clinic.location}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2 items-start">
                      <StatusBadge status={clinic.status} />
                      <div className="flex items-center gap-1.5 text-[10px] text-text-secondary uppercase tracking-wider font-bold">
                        <MessageSquare className="w-3 h-3" /> {clinic.outreachStatus}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5">
                      {clinic.rating > 0 ? (
                        <div className="flex items-center gap-1 text-warning text-xs font-bold">
                          <Star className="w-3.5 h-3.5 fill-current" /> {clinic.rating}
                        </div>
                      ) : (
                        <span className="text-text-secondary text-xs">-</span>
                      )}
                      <div className="flex items-center gap-3 text-xs font-mono text-text-secondary">
                        <span title="Leads Routed"><Users className="w-3 h-3 inline mr-1" />{clinic.leads}</span>
                        <span title="Revenue Generated"><Zap className="w-3 h-3 inline mr-1" />{clinic.revenue}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                      {clinic.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-surface-2 border border-surface-3 rounded text-[10px] text-text-secondary whitespace-nowrap">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        onClick={() => setSelectedClinic(clinic)}
                        variant="ghost" 
                        size="sm" 
                        className="h-8 text-xs text-text-secondary hover:text-white"
                      >
                        Inspect
                      </Button>
                      <button className="p-1.5 text-text-secondary hover:text-white hover:bg-surface-3 rounded-md transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredClinics.length === 0 && (
            <div className="p-16 text-center">
              <Building2 className="w-12 h-12 text-surface-4 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">No clinics found</h3>
              <p className="text-text-secondary text-sm">Try adjusting your filters or search query.</p>
            </div>
          )}
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-surface-3 bg-[#0B0F14] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-secondary">
          <span>Showing {filteredClinics.length} of {clinics.length} entries</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled className="h-8 border-surface-3 bg-surface-1">Previous</Button>
            <Button variant="outline" size="sm" className="h-8 border-surface-3 bg-surface-1 text-white hover:bg-surface-2">Next</Button>
          </div>
        </div>
      </Card>

      {/* Inspection Drawer (Simulated with AnimatePresence) */}
      <AnimatePresence>
        {selectedClinic && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setSelectedClinic(null)}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-surface-1 border-l border-surface-3 z-50 shadow-2xl overflow-y-auto"
            >
              <div className="p-6 border-b border-surface-3 flex justify-between items-start sticky top-0 bg-surface-1/90 backdrop-blur-md z-10">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">{selectedClinic.id}</span>
                    <StatusBadge status={selectedClinic.status} />
                  </div>
                  <h2 className="text-xl font-display font-bold text-white">{selectedClinic.name}</h2>
                  <p className="text-sm text-text-secondary flex items-center gap-1 mt-1"><MapPin className="w-3.5 h-3.5" /> {selectedClinic.location}</p>
                </div>
                <button onClick={() => setSelectedClinic(null)} className="p-2 text-text-secondary hover:text-white bg-surface-2 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-8">
                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-black font-bold text-sm h-10">
                    <MessageSquare className="w-4 h-4 mr-2" /> Message
                  </Button>
                  <Button variant="outline" className="w-full border-surface-3 text-white hover:bg-surface-2 text-sm h-10">
                    <Edit3 className="w-4 h-4 mr-2" /> Edit Profile
                  </Button>
                </div>

                {/* Performance Snapshot */}
                <div>
                  <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Activity className="w-4 h-4" /> Performance Snapshot
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-[#0B0F14] rounded-xl border border-surface-3">
                      <p className="text-xs text-text-secondary mb-1">Leads Routed</p>
                      <p className="text-xl font-mono font-bold text-white">{selectedClinic.leads}</p>
                    </div>
                    <div className="p-4 bg-[#0B0F14] rounded-xl border border-surface-3">
                      <p className="text-xs text-text-secondary mb-1">Revenue Gen</p>
                      <p className="text-xl font-mono font-bold text-success">{selectedClinic.revenue}</p>
                    </div>
                    <div className="p-4 bg-[#0B0F14] rounded-xl border border-surface-3">
                      <p className="text-xs text-text-secondary mb-1">Rating</p>
                      <div className="flex items-center gap-1 text-warning">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-xl font-mono font-bold text-white">{selectedClinic.rating || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="p-4 bg-[#0B0F14] rounded-xl border border-surface-3">
                      <p className="text-xs text-text-secondary mb-1">Last Contact</p>
                      <p className="text-sm font-medium text-white mt-1">{selectedClinic.lastContact}</p>
                    </div>
                  </div>
                </div>

                {/* Relationship Management */}
                <div>
                  <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Users className="w-4 h-4" /> Relationship Management
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-text-secondary mb-1.5 block">Outreach Status</label>
                      <select className="w-full bg-[#0B0F14] border border-surface-3 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary/50 appearance-none">
                        <option value="Active" selected={selectedClinic.outreachStatus === 'Active'}>Active</option>
                        <option value="Nurture" selected={selectedClinic.outreachStatus === 'Nurture'}>Nurture</option>
                        <option value="Churn Risk" selected={selectedClinic.outreachStatus === 'Churn Risk'}>Churn Risk</option>
                        <option value="Onboarding" selected={selectedClinic.outreachStatus === 'Onboarding'}>Onboarding</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-text-secondary mb-1.5 block flex justify-between">
                        <span>Internal Notes</span>
                        <span className="text-primary cursor-pointer hover:underline">Add Note</span>
                      </label>
                      <div className="p-3 bg-[#0B0F14] border border-surface-3 rounded-lg text-sm text-text-secondary italic">
                        No recent notes. Clinic is performing well with current lead volume.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quality Controls */}
                <div>
                  <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> Quality Controls
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-[#0B0F14] rounded-xl border border-surface-3">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-text-secondary" />
                        <span className="text-sm text-white">Compliance Documents</span>
                      </div>
                      <span className="text-xs text-success font-bold">Verified</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-[#0B0F14] rounded-xl border border-surface-3">
                      <div className="flex items-center gap-3">
                        <Building2 className="w-4 h-4 text-text-secondary" />
                        <span className="text-sm text-white">Facility Audit</span>
                      </div>
                      <span className="text-xs text-warning font-bold">Pending</span>
                    </div>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="pt-6 border-t border-surface-3">
                  <Button variant="outline" className="w-full border-danger/20 text-danger hover:bg-danger/10 hover:text-danger text-sm h-10">
                    Suspend Clinic Access
                  </Button>
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

function StatusBadge({ status }: { status: ClinicStatus }) {
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1 w-fit ${
      status === 'Verified' ? 'bg-success/10 text-success border-success/20' : 
      status === 'Pending Review' ? 'bg-warning/10 text-warning border-warning/20' :
      'bg-danger/10 text-danger border-danger/20'
    }`}>
      {status === 'Verified' && <CheckCircle2 className="w-3 h-3" />}
      {status === 'Pending Review' && <Clock className="w-3 h-3" />}
      {status === 'Suspended' && <AlertTriangle className="w-3 h-3" />}
      {status}
    </span>
  );
}
