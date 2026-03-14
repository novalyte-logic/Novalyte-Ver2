import React from 'react';
import { motion } from 'motion/react';
import { Settings, User, Bell, Shield, Globe, Database, Save } from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';

export function ClinicSettings() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Settings</h1>
          <p className="text-text-secondary mt-1">Manage your clinic profile, preferences, and integrations.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">Cancel Changes</Button>
          <Button className="flex items-center gap-2"><Save className="w-4 h-4" /> Save Changes</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Navigation */}
        <div className="space-y-2">
          {[
            { id: 'profile', label: 'Clinic Profile', icon: User },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'security', label: 'Security & Access', icon: Shield },
            { id: 'directory', label: 'Directory Listing', icon: Globe },
            { id: 'integrations', label: 'Integrations', icon: Database },
          ].map((item, i) => (
            <button
              key={i}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                i === 0 ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-surface-2 hover:text-text-primary'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 space-y-6">
          <Card className="p-6 bg-surface-1 border-surface-3">
            <h2 className="text-xl font-bold mb-6">Clinic Profile</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Clinic Name</label>
                  <input 
                    type="text" 
                    defaultValue="Modern Clinic"
                    className="w-full px-4 py-2 bg-surface-2 border border-surface-3 rounded-lg text-text-primary focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">NPI Number</label>
                  <input 
                    type="text" 
                    defaultValue="1234567890"
                    className="w-full px-4 py-2 bg-surface-2 border border-surface-3 rounded-lg text-text-primary focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Primary Contact Email</label>
                <input 
                  type="email" 
                  defaultValue="admin@modernclinic.com"
                  className="w-full px-4 py-2 bg-surface-2 border border-surface-3 rounded-lg text-text-primary focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Specialties</label>
                <div className="flex flex-wrap gap-2">
                  {['Hormone Optimization', 'Longevity', 'Peptide Therapy'].map((spec, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-full bg-surface-2 border border-surface-3 text-sm text-text-primary flex items-center gap-2">
                      {spec}
                      <button className="text-text-secondary hover:text-danger"><span className="sr-only">Remove</span>&times;</button>
                    </span>
                  ))}
                  <button className="px-3 py-1.5 rounded-full border border-dashed border-surface-3 text-sm text-text-secondary hover:text-primary hover:border-primary/50 transition-colors">
                    + Add Specialty
                  </button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-surface-1 border-surface-3">
            <h2 className="text-xl font-bold mb-6">Directory Visibility</h2>
            <div className="flex items-center justify-between p-4 border border-surface-3 rounded-lg bg-surface-2">
              <div>
                <h3 className="font-medium text-text-primary">Public Directory Listing</h3>
                <p className="text-sm text-text-secondary mt-1">Allow patients to find your clinic in the Novalyte directory.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-surface-3 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
