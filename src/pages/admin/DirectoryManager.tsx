import React, { useState } from 'react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Search, MapPin, Star, MoreVertical, Plus, Building2, Activity, Users, ArrowUpRight, Filter, Download, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export function DirectoryManager() {
  const [activeTab, setActiveTab] = useState<'all' | 'verified' | 'pending' | 'suspended'>('all');

  const clinics = [
    { id: 1, name: "Apex Longevity Institute", location: "Miami, FL", status: "Verified", rating: 4.9, leads: 142, revenue: "$12,400", joined: "2023-01-15" },
    { id: 2, name: "Vitality Men's Clinic", location: "Austin, TX", status: "Verified", rating: 4.8, leads: 89, revenue: "$8,200", joined: "2023-03-22" },
    { id: 3, name: "NeuroHealth Partners", location: "New York, NY", status: "Pending Review", rating: 0, leads: 0, revenue: "$0", joined: "2023-10-20" },
    { id: 4, name: "Peak Performance TRT", location: "Chicago, IL", status: "Verified", rating: 4.7, leads: 210, revenue: "$18,500", joined: "2022-11-05" },
    { id: 5, name: "Elite Wellness Center", location: "Los Angeles, CA", status: "Suspended", rating: 3.2, leads: 45, revenue: "$3,100", joined: "2023-05-10" },
    { id: 6, name: "Precision Health Clinic", location: "Denver, CO", status: "Verified", rating: 4.9, leads: 175, revenue: "$15,800", joined: "2023-02-28" },
  ];

  const filteredClinics = clinics.filter(clinic => {
    if (activeTab === 'all') return true;
    if (activeTab === 'verified') return clinic.status === 'Verified';
    if (activeTab === 'pending') return clinic.status === 'Pending Review';
    if (activeTab === 'suspended') return clinic.status === 'Suspended';
    return true;
  });

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary">Directory Management</h1>
          <p className="text-text-secondary mt-1">Manage clinic profiles, verification, and network status.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
          <Button className="flex items-center gap-2 group">
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" /> Add Clinic
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-surface-1 border-surface-3 p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Building2 className="w-24 h-24 text-primary" />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20"><Building2 className="w-5 h-5" /></div>
              <span className="flex items-center text-success text-sm font-mono bg-success/10 px-2 py-1 rounded-md border border-success/20">
                <ArrowUpRight className="w-3 h-3 mr-1" /> 12 this month
              </span>
            </div>
            <h3 className="text-text-secondary text-sm font-medium mb-1">Total Network Clinics</h3>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-display font-bold text-text-primary">248</p>
            </div>
          </div>
        </Card>

        <Card className="bg-surface-1 border-surface-3 p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ShieldCheck className="w-24 h-24 text-success" />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 rounded-xl bg-success/10 text-success border border-success/20"><ShieldCheck className="w-5 h-5" /></div>
              <span className="flex items-center text-warning text-sm font-mono bg-warning/10 px-2 py-1 rounded-md border border-warning/20">
                14 pending
              </span>
            </div>
            <h3 className="text-text-secondary text-sm font-medium mb-1">Verified Partners</h3>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-display font-bold text-text-primary">215</p>
            </div>
          </div>
        </Card>

        <Card className="bg-surface-1 border-surface-3 p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users className="w-24 h-24 text-secondary" />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 rounded-xl bg-secondary/10 text-secondary border border-secondary/20"><Users className="w-5 h-5" /></div>
              <span className="flex items-center text-success text-sm font-mono bg-success/10 px-2 py-1 rounded-md border border-success/20">
                <ArrowUpRight className="w-3 h-3 mr-1" /> 8.4%
              </span>
            </div>
            <h3 className="text-text-secondary text-sm font-medium mb-1">Total Leads Routed</h3>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-display font-bold text-text-primary">14.2k</p>
            </div>
          </div>
        </Card>

        <Card className="bg-surface-1 border-surface-3 p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity className="w-24 h-24 text-warning" />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 rounded-xl bg-warning/10 text-warning border border-warning/20"><Activity className="w-5 h-5" /></div>
              <span className="flex items-center text-success text-sm font-mono bg-success/10 px-2 py-1 rounded-md border border-success/20">
                <ArrowUpRight className="w-3 h-3 mr-1" /> 15.2%
              </span>
            </div>
            <h3 className="text-text-secondary text-sm font-medium mb-1">Network Revenue</h3>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-display font-bold text-text-primary">$1.2M</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="bg-surface-1 border-surface-3 p-0 overflow-hidden flex flex-col">
        <div className="p-5 border-b border-surface-3 bg-surface-2/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-1 bg-surface-2 p-1 rounded-lg border border-surface-3">
              {[
                { id: 'all', label: 'All Clinics' },
                { id: 'verified', label: 'Verified' },
                { id: 'pending', label: 'Pending Review' },
                { id: 'suspended', label: 'Suspended' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab.id ? 'bg-surface-3 text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'
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
                placeholder="Search clinics by name or location..." 
                className="w-full pl-9 pr-4 py-2 bg-surface-2 border border-surface-3 rounded-lg text-sm focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-2 h-9">
              <Filter className="w-4 h-4" /> Filter
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto flex-grow">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-text-secondary uppercase bg-surface-2/30 border-b border-surface-3">
              <tr>
                <th className="px-6 py-4 font-medium tracking-wider">Clinic Name</th>
                <th className="px-6 py-4 font-medium tracking-wider">Location</th>
                <th className="px-6 py-4 font-medium tracking-wider">Status</th>
                <th className="px-6 py-4 font-medium tracking-wider">Rating</th>
                <th className="px-6 py-4 font-medium tracking-wider">Leads Routed</th>
                <th className="px-6 py-4 font-medium tracking-wider">Revenue</th>
                <th className="px-6 py-4 text-right font-medium tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-3">
              {filteredClinics.map((clinic) => (
                <tr key={clinic.id} className="hover:bg-surface-2 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-text-primary mb-1 group-hover:text-primary transition-colors">{clinic.name}</div>
                    <div className="text-xs text-text-secondary">Joined {new Date(clinic.joined).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 text-text-secondary">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {clinic.location}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-medium border flex items-center gap-1 w-fit ${
                      clinic.status === 'Verified' ? 'bg-success/10 text-success border-success/20' : 
                      clinic.status === 'Pending Review' ? 'bg-warning/10 text-warning border-warning/20' :
                      'bg-danger/10 text-danger border-danger/20'
                    }`}>
                      {clinic.status === 'Verified' && <CheckCircle2 className="w-3 h-3" />}
                      {clinic.status === 'Pending Review' && <Clock className="w-3 h-3" />}
                      {clinic.status === 'Suspended' && <AlertTriangle className="w-3 h-3" />}
                      {clinic.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {clinic.rating > 0 ? (
                      <div className="flex items-center gap-1 text-warning bg-warning/10 px-2.5 py-1 rounded-md border border-warning/20 w-fit">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="font-mono font-bold">{clinic.rating}</span>
                      </div>
                    ) : (
                      <span className="text-text-secondary px-2.5 py-1">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-mono font-medium text-text-primary">{clinic.leads}</td>
                  <td className="px-6 py-4 font-mono font-medium text-text-primary">{clinic.revenue}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="outline" size="sm" className="h-8 px-2">
                        Inspect
                      </Button>
                      <button className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-surface-3 rounded-md transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredClinics.length === 0 && (
            <div className="p-12 text-center">
              <Building2 className="w-12 h-12 text-surface-3 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-text-primary mb-2">No clinics found</h3>
              <p className="text-text-secondary">Try adjusting your filters or search query.</p>
            </div>
          )}
        </div>
        
        {/* Pagination */}
        <div className="p-5 border-t border-surface-3 bg-surface-2/50 flex items-center justify-between text-sm text-text-secondary">
          <span>Showing {filteredClinics.length} of 248 entries</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Dummy Clock icon for this file scope
function Clock(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
}
