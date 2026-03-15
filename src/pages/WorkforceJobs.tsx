import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { 
  Search, MapPin, Briefcase, Clock, DollarSign, Filter, 
  ArrowRight, Star, Building2, Stethoscope, Map as MapIcon, 
  List, SlidersHorizontal, CheckSquare, Square, X, Shield,
  Zap, ChevronDown
} from 'lucide-react';

// Mock Data: Opportunities (For Talent)
const MOCK_JOBS = [
  { 
    id: 'j1', 
    title: 'Medical Director (MD/DO)', 
    entity: 'Apex Longevity', 
    location: 'Miami, FL (Hybrid)', 
    type: 'Contract', 
    compensation: '$150k - $200k / yr', 
    match: 98, 
    posted: '2h ago', 
    protocols: ['TRT', 'Peptides', 'Longevity'],
    requirements: ['Active FL License', 'DEA Registration', 'Board Certified'],
    urgency: 'High'
  },
  { 
    id: 'j2', 
    title: 'Nurse Practitioner (NP)', 
    entity: 'Vitality Men\'s Health', 
    location: 'Remote (Telehealth)', 
    type: 'Full-time', 
    compensation: '$120k - $140k / yr', 
    match: 94, 
    posted: '5h ago', 
    protocols: ['Hormone Optimization', 'Weight Loss'],
    requirements: ['Multi-state licensure preferred', '2+ yrs HRT experience'],
    urgency: 'Medium'
  },
  { 
    id: 'j3', 
    title: 'IV Therapy RN', 
    entity: 'Prime Performance Clinic', 
    location: 'Austin, TX', 
    type: 'Per Diem', 
    compensation: '$55 - $70 / hr', 
    match: 88, 
    posted: '1d ago', 
    protocols: ['IV Nutrition', 'NAD+', 'Ozone'],
    requirements: ['Active TX RN License', 'IV Certification'],
    urgency: 'High'
  },
  { 
    id: 'j4', 
    title: 'Physician Assistant (PA)', 
    entity: 'Elite Wellness', 
    location: 'New York, NY', 
    type: 'Part-time', 
    compensation: '$85 - $105 / hr', 
    match: 82, 
    posted: '2d ago', 
    protocols: ['Aesthetics', 'Peptide Therapy'],
    requirements: ['Active NY License', '1+ yrs Aesthetics'],
    urgency: 'Low'
  },
];

// Mock Data: Candidates (For Clinics)
const MOCK_CANDIDATES = [
  {
    id: 'c1',
    title: 'Dr. Sarah Jenkins, MD',
    entity: 'Board Certified Endocrinologist',
    location: 'Austin, TX',
    type: 'Seeking Full-time',
    compensation: '$180k+ / yr',
    match: 96,
    posted: 'Active Now',
    protocols: ['HRT', 'Longevity', 'Metabolic Health'],
    requirements: ['Active TX License', 'DEA', '10+ yrs exp'],
    urgency: 'Ready to Deploy'
  },
  {
    id: 'c2',
    title: 'Michael Chang, FNP-C',
    entity: 'Family Nurse Practitioner',
    location: 'Remote (Licensed in FL, TX, NY)',
    type: 'Seeking Contract',
    compensation: '$80 - $100 / hr',
    match: 91,
    posted: 'Active Today',
    protocols: ['Men\'s Health', 'TRT', 'Telehealth'],
    requirements: ['Multi-state', 'Autonomous Practice'],
    urgency: 'Ready to Deploy'
  },
  {
    id: 'c3',
    title: 'Jessica Ramirez, RN',
    entity: 'IV & Aesthetics Specialist',
    location: 'Miami, FL',
    type: 'Seeking Per Diem',
    compensation: '$60 / hr',
    match: 85,
    posted: 'Active 2d ago',
    protocols: ['IV Therapy', 'Phlebotomy', 'NAD+'],
    requirements: ['Active FL License', 'BLS/ACLS'],
    urgency: 'Available Next Week'
  }
];

export function WorkforceJobs() {
  const [role, setRole] = useState<'talent' | 'clinic'>('talent');
  const [view, setView] = useState<'list' | 'map'>('list');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const currentData = role === 'talent' ? MOCK_JOBS : MOCK_CANDIDATES;
  const activeColor = role === 'talent' ? 'secondary' : 'primary';
  const activeHex = role === 'talent' ? '#8B5CF6' : '#06B6D4';

  const toggleSelection = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const clearSelection = () => setSelectedItems([]);

  return (
    <div className="min-h-screen bg-[#05070A] flex flex-col selection:bg-surface-3 selection:text-white">
      {/* Header & Controls */}
      <section className="pt-24 pb-8 border-b border-surface-3 bg-[#0B0F14] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Row: Title & Role Toggle */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold text-white mb-2">
                {role === 'talent' ? 'Clinical Opportunities' : 'Talent Directory'}
              </h1>
              <p className="text-text-secondary">
                {role === 'talent' 
                  ? 'Find high-growth roles matched to your credentials and protocols.' 
                  : 'Discover verified practitioners ready to deploy into your clinic.'}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="bg-surface-2 p-1 rounded-xl border border-surface-3 flex">
                <button 
                  onClick={() => { setRole('talent'); setSelectedItems([]); }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    role === 'talent' ? 'bg-secondary text-white shadow-[0_0_10px_rgba(139,92,246,0.3)]' : 'text-text-secondary hover:text-white'
                  }`}
                >
                  <Stethoscope className="w-4 h-4" /> Talent Mode
                </button>
                <button 
                  onClick={() => { setRole('clinic'); setSelectedItems([]); }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    role === 'clinic' ? 'bg-primary text-black shadow-[0_0_10px_rgba(6,182,212,0.3)]' : 'text-text-secondary hover:text-white'
                  }`}
                >
                  <Building2 className="w-4 h-4" /> Clinic Mode
                </button>
              </div>
            </div>
          </div>

          {/* Search & View Row */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-grow flex gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input 
                  type="text" 
                  placeholder={role === 'talent' ? "Search roles, clinics, or protocols..." : "Search practitioners, specialties, or licenses..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full h-12 pl-12 pr-4 bg-surface-1 border border-surface-3 rounded-xl text-white focus:outline-none focus:border-${activeColor}/50 focus:ring-1 focus:ring-${activeColor}/50 transition-all`}
                />
              </div>
              <div className="relative hidden sm:block w-64">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input 
                  type="text" 
                  placeholder="Location or Remote" 
                  className={`w-full h-12 pl-12 pr-4 bg-surface-1 border border-surface-3 rounded-xl text-white focus:outline-none focus:border-${activeColor}/50 focus:ring-1 focus:ring-${activeColor}/50 transition-all`}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="outline" className="h-12 border-surface-3 bg-surface-1 hover:bg-surface-2">
                <SlidersHorizontal className="w-4 h-4 mr-2" /> Filters
              </Button>
              <div className="bg-surface-1 p-1 rounded-xl border border-surface-3 flex h-12 items-center">
                <button 
                  onClick={() => setView('list')}
                  className={`p-2 rounded-lg transition-colors ${view === 'list' ? 'bg-surface-3 text-white' : 'text-text-secondary hover:text-white'}`}
                  title="List View"
                >
                  <List className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setView('map')}
                  className={`p-2 rounded-lg transition-colors ${view === 'map' ? 'bg-surface-3 text-white' : 'text-text-secondary hover:text-white'}`}
                  title="Map View"
                >
                  <MapIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 flex-grow relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8">
          
          {/* Filters Sidebar (Hidden on mobile, accessible via button) */}
          <div className="hidden lg:block w-64 flex-shrink-0 space-y-6">
            <div className="sticky top-64 space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Filter className="w-4 h-4 text-text-secondary" /> Operational Filters
                </h3>
                <button className="text-xs text-text-secondary hover:text-white">Clear All</button>
              </div>
              
              <div className="space-y-8">
                {/* Role Type */}
                <div>
                  <h4 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Role Type</h4>
                  <div className="space-y-3">
                    {['MD / DO', 'Nurse Practitioner (NP)', 'Physician Assistant (PA)', 'Registered Nurse (RN)', 'Medical Assistant'].map((r) => (
                      <label key={r} className="flex items-center gap-3 text-sm text-text-secondary hover:text-white cursor-pointer group">
                        <div className={`w-4 h-4 rounded border border-surface-3 flex items-center justify-center group-hover:border-${activeColor}/50 transition-colors`}></div>
                        {r}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Protocols */}
                <div>
                  <h4 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Protocols</h4>
                  <div className="space-y-3">
                    {['TRT / HRT', 'Peptide Therapy', 'IV Nutrition', 'Weight Loss (GLP-1)', 'Longevity / Anti-aging'].map((p) => (
                      <label key={p} className="flex items-center gap-3 text-sm text-text-secondary hover:text-white cursor-pointer group">
                        <div className={`w-4 h-4 rounded border border-surface-3 flex items-center justify-center group-hover:border-${activeColor}/50 transition-colors`}></div>
                        {p}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Modality */}
                <div>
                  <h4 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Modality</h4>
                  <div className="space-y-3">
                    {['Telehealth (Remote)', 'On-site (In-person)', 'Hybrid'].map((m) => (
                      <label key={m} className="flex items-center gap-3 text-sm text-text-secondary hover:text-white cursor-pointer group">
                        <div className={`w-4 h-4 rounded border border-surface-3 flex items-center justify-center group-hover:border-${activeColor}/50 transition-colors`}></div>
                        {m}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Area */}
          <div className={`flex-grow ${view === 'map' ? 'flex gap-6 h-[800px]' : ''}`}>
            
            {/* List View Container */}
            <div className={`space-y-4 ${view === 'map' ? 'w-1/2 overflow-y-auto pr-2 custom-scrollbar' : 'w-full'}`}>
              <div className="flex items-center justify-between text-sm text-text-secondary mb-4 px-1">
                <span>Showing <strong className="text-white">{currentData.length}</strong> {role === 'talent' ? 'opportunities' : 'candidates'}</span>
                <div className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                  Sort by: <strong className="text-white">Highest Match</strong> <ChevronDown className="w-4 h-4" />
                </div>
              </div>

              <AnimatePresence mode="popLayout">
                {currentData.map((item) => {
                  const isSelected = selectedItems.includes(item.id);
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={item.id}
                    >
                      <Card 
                        className={`p-6 bg-surface-1 border transition-all duration-200 cursor-pointer ${
                          isSelected 
                            ? `border-${activeColor} shadow-[0_0_15px_rgba(${role==='talent'?'139,92,246':'6,182,212'},0.15)]` 
                            : 'border-surface-3 hover:border-surface-3/80 hover:bg-surface-2'
                        }`}
                        onClick={() => toggleSelection(item.id)}
                      >
                        <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-6">
                          
                          {/* Main Info */}
                          <div className="flex-grow flex gap-4">
                            <div className="mt-1 shrink-0">
                              <button 
                                className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${
                                  isSelected ? `bg-${activeColor} border-${activeColor} text-${role==='talent'?'white':'black'}` : 'border-surface-3 text-transparent hover:border-text-secondary'
                                }`}
                              >
                                <CheckSquare className="w-4 h-4" />
                              </button>
                            </div>
                            
                            <div className="flex-grow">
                              <div className="flex flex-wrap items-center gap-3 mb-2">
                                <h3 className="text-xl font-bold text-white">{item.title}</h3>
                                {item.match >= 90 && (
                                  <span className={`px-2.5 py-1 rounded-md bg-${activeColor}/10 text-${activeColor} border border-${activeColor}/20 text-xs font-bold flex items-center gap-1`}>
                                    <Zap className="w-3 h-3 fill-current" /> {item.match}% AI Match
                                  </span>
                                )}
                                {item.urgency === 'High' && (
                                  <span className="px-2.5 py-1 rounded-md bg-error/10 text-error border border-error/20 text-xs font-bold">
                                    Urgent Need
                                  </span>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-2 text-lg text-text-secondary mb-4">
                                {role === 'talent' ? <Building2 className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                                {item.entity}
                              </div>
                              
                              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-text-secondary mb-5">
                                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {item.location}</span>
                                <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> {item.type}</span>
                                <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4" /> {item.compensation}</span>
                                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {item.posted}</span>
                              </div>

                              <div className="space-y-3">
                                <div>
                                  <span className="text-xs font-bold text-text-secondary uppercase tracking-wider mr-3">Protocols:</span>
                                  <div className="inline-flex flex-wrap gap-2">
                                    {item.protocols.map((tag, i) => (
                                      <span key={i} className="px-2 py-1 rounded bg-surface-2 border border-surface-3 text-xs text-white">
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <span className="text-xs font-bold text-text-secondary uppercase tracking-wider mr-3">Reqs:</span>
                                  <div className="inline-flex flex-wrap gap-2">
                                    {item.requirements.map((req, i) => (
                                      <span key={i} className="px-2 py-1 rounded bg-[#0B0F14] border border-surface-3 text-xs text-text-secondary">
                                        {req}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Actions */}
                          <div className="flex flex-row xl:flex-col gap-3 xl:items-end flex-shrink-0 ml-10 xl:ml-0">
                            <Link to={`/workforce/${role === 'talent' ? 'apply' : 'candidate'}/${item.id}`} onClick={(e) => e.stopPropagation()} className="w-full xl:w-auto">
                              <Button variant={role === 'talent' ? 'secondary' : 'primary'} className="w-full xl:w-auto">
                                {role === 'talent' ? 'Apply Now' : 'Request Interview'}
                              </Button>
                            </Link>
                            <Button variant="outline" className="w-full xl:w-auto border-surface-3 hover:bg-surface-2" onClick={(e) => e.stopPropagation()}>
                              View Details
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Map View Placeholder */}
            {view === 'map' && (
              <div className="w-1/2 rounded-2xl border border-surface-3 bg-surface-1 overflow-hidden relative flex items-center justify-center">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.05]" />
                <div className="text-center relative z-10">
                  <MapIcon className="w-12 h-12 text-surface-3 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2">Interactive Map View</h3>
                  <p className="text-text-secondary text-sm max-w-xs mx-auto">
                    Geospatial visualization of {role === 'talent' ? 'opportunities' : 'candidates'} is currently in simulation mode.
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* Floating Compare Bar */}
      <AnimatePresence>
        {selectedItems.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-3xl px-4"
          >
            <div className={`bg-surface-1 border border-${activeColor}/30 shadow-[0_10px_40px_rgba(0,0,0,0.5)] rounded-2xl p-4 flex items-center justify-between backdrop-blur-xl`}>
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full bg-${activeColor}/10 flex items-center justify-center text-${activeColor} font-bold`}>
                  {selectedItems.length}
                </div>
                <div>
                  <h4 className="text-white font-bold">Items Selected</h4>
                  <p className="text-sm text-text-secondary">Select up to 3 to compare</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={clearSelection} className="p-2 text-text-secondary hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
                <Button 
                  variant={role === 'talent' ? 'secondary' : 'primary'} 
                  disabled={selectedItems.length < 2 || selectedItems.length > 3}
                >
                  Compare {role === 'talent' ? 'Roles' : 'Candidates'}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
