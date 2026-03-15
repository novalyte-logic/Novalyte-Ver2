import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, User, Bell, Shield, Globe, Database, Save, 
  Building2, MapPin, Phone, Mail, CheckCircle2, AlertCircle,
  Plus, X, Users, Activity, Lock, CreditCard
} from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';

type TabId = 'profile' | 'specialties' | 'directory' | 'notifications' | 'integrations' | 'permissions';

export function ClinicSettings() {
  const [activeTab, setActiveTab] = useState<TabId>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    clinicName: "Apex Men's Health",
    npiNumber: "1928374650",
    email: "admin@apexmenshealth.com",
    phone: "(512) 555-0199",
    address: "123 Medical Plaza, Suite 400",
    city: "Austin",
    state: "TX",
    zip: "78701",
    specialties: ['Hormone Optimization', 'Longevity', 'Peptide Therapy', 'Weight Management'],
    isPublic: true,
    acceptsNewPatients: true,
    notifyNewLeads: true,
    notifyMessages: true,
    notifySystem: false
  });

  const [newSpecialty, setNewSpecialty] = useState('');

  // Simulate unsaved changes detection
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
    setShowSuccess(false);
  };

  const handleAddSpecialty = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ((e.type === 'keydown' && (e as React.KeyboardEvent).key !== 'Enter') || !newSpecialty.trim()) return;
    
    if (!formData.specialties.includes(newSpecialty.trim())) {
      handleInputChange('specialties', [...formData.specialties, newSpecialty.trim()]);
    }
    setNewSpecialty('');
  };

  const handleRemoveSpecialty = (specToRemove: string) => {
    handleInputChange('specialties', formData.specialties.filter(s => s !== specToRemove));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setHasUnsavedChanges(false);
    setShowSuccess(true);
    
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const tabs: { id: TabId; label: string; icon: any }[] = [
    { id: 'profile', label: 'Organization Profile', icon: Building2 },
    { id: 'specialties', label: 'Specialties & Services', icon: Activity },
    { id: 'directory', label: 'Directory Visibility', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'integrations', label: 'Integrations', icon: Database },
    { id: 'permissions', label: 'User Permissions', icon: Users },
  ];

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col animate-in fade-in duration-500">
      
      {/* Header & Actions */}
      <div className="flex-none flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Settings</h1>
          <p className="text-text-secondary mt-1">Configure your clinic profile, preferences, and system integrations.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <AnimatePresence>
            {showSuccess && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-2 text-success text-sm font-bold mr-2 w-full sm:w-auto"
              >
                <CheckCircle2 className="w-4 h-4" /> Saved Successfully
              </motion.div>
            )}
          </AnimatePresence>
          
          <Button 
            variant="outline" 
            className="border-surface-3 text-white hover:bg-surface-2 flex-grow sm:flex-grow-0"
            disabled={!hasUnsavedChanges || isSaving}
            onClick={() => {
              // Reset logic would go here
              setHasUnsavedChanges(false);
            }}
          >
            Discard
          </Button>
          <Button 
            className="bg-primary hover:bg-primary/90 text-black font-bold min-w-[140px] flex-grow sm:flex-grow-0"
            disabled={!hasUnsavedChanges || isSaving}
            onClick={handleSave}
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="w-4 h-4" /> Save Changes
              </span>
            )}
          </Button>
        </div>
      </div>

      <div className="flex-grow flex flex-col md:flex-row gap-8 overflow-hidden">
        
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 flex-none overflow-y-auto hide-scrollbar">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${
                  activeTab === tab.id 
                    ? 'bg-primary/10 text-primary border border-primary/20' 
                    : 'text-text-secondary hover:bg-surface-2 hover:text-white border border-transparent'
                }`}
              >
                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-primary' : 'text-text-secondary'}`} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-grow overflow-y-auto hide-scrollbar pb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-3xl space-y-6"
            >
              
              {/* --- Organization Profile Tab --- */}
              {activeTab === 'profile' && (
                <>
                  <Card className="p-6 bg-surface-1 border-surface-3">
                    <h2 className="text-xl font-bold text-white mb-6">Basic Information</h2>
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-bold text-text-secondary mb-1.5">Clinic Name</label>
                          <input 
                            type="text" 
                            value={formData.clinicName}
                            onChange={(e) => handleInputChange('clinicName', e.target.value)}
                            className="w-full px-4 py-2.5 bg-[#0B0F14] border border-surface-3 rounded-lg text-white focus:outline-none focus:border-primary/50 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-text-secondary mb-1.5">NPI Number</label>
                          <input 
                            type="text" 
                            value={formData.npiNumber}
                            onChange={(e) => handleInputChange('npiNumber', e.target.value)}
                            className="w-full px-4 py-2.5 bg-[#0B0F14] border border-surface-3 rounded-lg text-white focus:outline-none focus:border-primary/50 transition-colors font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 bg-surface-1 border-surface-3">
                    <h2 className="text-xl font-bold text-white mb-6">Contact & Location</h2>
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-bold text-text-secondary mb-1.5 flex items-center gap-2"><Mail className="w-4 h-4"/> Primary Email</label>
                          <input 
                            type="email" 
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="w-full px-4 py-2.5 bg-[#0B0F14] border border-surface-3 rounded-lg text-white focus:outline-none focus:border-primary/50 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-text-secondary mb-1.5 flex items-center gap-2"><Phone className="w-4 h-4"/> Phone Number</label>
                          <input 
                            type="tel" 
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className="w-full px-4 py-2.5 bg-[#0B0F14] border border-surface-3 rounded-lg text-white focus:outline-none focus:border-primary/50 transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-text-secondary mb-1.5 flex items-center gap-2"><MapPin className="w-4 h-4"/> Street Address</label>
                        <input 
                          type="text" 
                          value={formData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          className="w-full px-4 py-2.5 bg-[#0B0F14] border border-surface-3 rounded-lg text-white focus:outline-none focus:border-primary/50 transition-colors"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-5">
                        <div className="col-span-2 sm:col-span-1">
                          <label className="block text-sm font-bold text-text-secondary mb-1.5">City</label>
                          <input 
                            type="text" 
                            value={formData.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                            className="w-full px-4 py-2.5 bg-[#0B0F14] border border-surface-3 rounded-lg text-white focus:outline-none focus:border-primary/50 transition-colors"
                          />
                        </div>
                        <div className="col-span-1">
                          <label className="block text-sm font-bold text-text-secondary mb-1.5">State</label>
                          <input 
                            type="text" 
                            value={formData.state}
                            onChange={(e) => handleInputChange('state', e.target.value)}
                            className="w-full px-4 py-2.5 bg-[#0B0F14] border border-surface-3 rounded-lg text-white focus:outline-none focus:border-primary/50 transition-colors"
                          />
                        </div>
                        <div className="col-span-3 sm:col-span-1">
                          <label className="block text-sm font-bold text-text-secondary mb-1.5">ZIP Code</label>
                          <input 
                            type="text" 
                            value={formData.zip}
                            onChange={(e) => handleInputChange('zip', e.target.value)}
                            className="w-full px-4 py-2.5 bg-[#0B0F14] border border-surface-3 rounded-lg text-white focus:outline-none focus:border-primary/50 transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                </>
              )}

              {/* --- Specialties Tab --- */}
              {activeTab === 'specialties' && (
                <Card className="p-6 bg-surface-1 border-surface-3">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-white">Clinical Specialties</h2>
                    <p className="text-sm text-text-secondary mt-1">These specialties are used to match you with patient leads and workforce candidates.</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex flex-wrap gap-2">
                      {formData.specialties.map((spec, i) => (
                        <span key={i} className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-sm font-bold text-primary flex items-center gap-2 group">
                          {spec}
                          <button 
                            onClick={() => handleRemoveSpecialty(spec)}
                            className="text-primary/50 hover:text-primary transition-colors focus:outline-none"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 max-w-md">
                      <input 
                        type="text" 
                        placeholder="Add a specialty (e.g., Hair Restoration)"
                        value={newSpecialty}
                        onChange={(e) => setNewSpecialty(e.target.value)}
                        onKeyDown={handleAddSpecialty}
                        className="flex-grow px-4 py-2.5 bg-[#0B0F14] border border-surface-3 rounded-lg text-white focus:outline-none focus:border-primary/50 transition-colors"
                      />
                      <Button 
                        variant="outline" 
                        onClick={handleAddSpecialty}
                        className="border-surface-3 text-white hover:bg-surface-2 shrink-0"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              {/* --- Directory Visibility Tab --- */}
              {activeTab === 'directory' && (
                <Card className="p-6 bg-surface-1 border-surface-3">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-white">Directory & Intake</h2>
                    <p className="text-sm text-text-secondary mt-1">Control how patients discover and interact with your clinic.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-surface-3 rounded-xl bg-[#0B0F14]">
                      <div>
                        <h3 className="font-bold text-white">Public Directory Listing</h3>
                        <p className="text-sm text-text-secondary mt-1">Allow patients to find your clinic in the Novalyte directory.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={formData.isPublic}
                          onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-surface-3 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-surface-3 rounded-xl bg-[#0B0F14]">
                      <div>
                        <h3 className="font-bold text-white">Accepting New Patients</h3>
                        <p className="text-sm text-text-secondary mt-1">Show your clinic as available for new consultations.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={formData.acceptsNewPatients}
                          onChange={(e) => handleInputChange('acceptsNewPatients', e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-surface-3 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>
                </Card>
              )}

              {/* --- Notifications Tab --- */}
              {activeTab === 'notifications' && (
                <Card className="p-6 bg-surface-1 border-surface-3">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-white">Notification Preferences</h2>
                    <p className="text-sm text-text-secondary mt-1">Manage how and when you receive alerts.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-surface-3 rounded-xl bg-[#0B0F14]">
                      <div>
                        <h3 className="font-bold text-white">New Patient Leads</h3>
                        <p className="text-sm text-text-secondary mt-1">Receive email alerts when a new qualified lead arrives.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={formData.notifyNewLeads}
                          onChange={(e) => handleInputChange('notifyNewLeads', e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-surface-3 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-surface-3 rounded-xl bg-[#0B0F14]">
                      <div>
                        <h3 className="font-bold text-white">Patient Messages</h3>
                        <p className="text-sm text-text-secondary mt-1">Receive notifications for new secure messages.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={formData.notifyMessages}
                          onChange={(e) => handleInputChange('notifyMessages', e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-surface-3 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-surface-3 rounded-xl bg-[#0B0F14]">
                      <div>
                        <h3 className="font-bold text-white">System & Billing Updates</h3>
                        <p className="text-sm text-text-secondary mt-1">Receive non-critical platform updates.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={formData.notifySystem}
                          onChange={(e) => handleInputChange('notifySystem', e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-surface-3 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>
                </Card>
              )}

              {/* --- Integrations Tab --- */}
              {activeTab === 'integrations' && (
                <Card className="p-6 bg-surface-1 border-surface-3">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-white">Connected Systems</h2>
                    <p className="text-sm text-text-secondary mt-1">Manage connections to your EMR and other tools.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-5 border border-surface-3 rounded-xl bg-[#0B0F14] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-surface-2 flex items-center justify-center border border-surface-3">
                          <Database className="w-6 h-6 text-text-secondary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white">AthenaHealth EMR</h3>
                          <p className="text-sm text-success flex items-center gap-1 mt-0.5">
                            <CheckCircle2 className="w-3 h-3" /> Connected & Syncing
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="border-surface-3 text-white hover:bg-surface-2">
                        Configure
                      </Button>
                    </div>

                    <div className="p-5 border border-surface-3 rounded-xl bg-[#0B0F14] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-surface-2 flex items-center justify-center border border-surface-3">
                          <CreditCard className="w-6 h-6 text-text-secondary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white">Stripe Payments</h3>
                          <p className="text-sm text-text-secondary mt-0.5">Not connected</p>
                        </div>
                      </div>
                      <Button className="bg-white text-black hover:bg-white/90 font-bold">
                        Connect
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              {/* --- Permissions Tab --- */}
              {activeTab === 'permissions' && (
                <Card className="p-6 bg-surface-1 border-surface-3">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-white">User Access</h2>
                      <p className="text-sm text-text-secondary mt-1">Manage team members and their roles.</p>
                    </div>
                    <Button className="bg-white text-black hover:bg-white/90 font-bold text-sm">
                      <Plus className="w-4 h-4 mr-2" /> Invite User
                    </Button>
                  </div>

                  <div className="border border-surface-3 rounded-xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-surface-2/50 text-xs uppercase tracking-wider text-text-secondary border-b border-surface-3">
                          <th className="px-5 py-3 font-medium">User</th>
                          <th className="px-5 py-3 font-medium">Role</th>
                          <th className="px-5 py-3 font-medium text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm divide-y divide-surface-3 bg-[#0B0F14]">
                        <tr>
                          <td className="px-5 py-4">
                            <p className="font-bold text-white">Dr. Sarah Jenkins</p>
                            <p className="text-xs text-text-secondary mt-0.5">sarah@apexmenshealth.com</p>
                          </td>
                          <td className="px-5 py-4">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-primary/10 text-primary uppercase tracking-wider border border-primary/20">
                              Owner
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <Lock className="w-4 h-4 text-text-secondary inline-block" />
                          </td>
                        </tr>
                        <tr>
                          <td className="px-5 py-4">
                            <p className="font-bold text-white">Michael Chang</p>
                            <p className="text-xs text-text-secondary mt-0.5">michael@apexmenshealth.com</p>
                          </td>
                          <td className="px-5 py-4">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-surface-3 text-white uppercase tracking-wider border border-surface-4">
                              Admin
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <button className="text-sm font-bold text-primary hover:text-primary/80 transition-colors">Edit</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
