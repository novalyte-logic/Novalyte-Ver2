import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Search, Filter, ShieldCheck, Zap, Activity, Brain, Cpu, Fingerprint, CheckCircle2, ArrowRight, GitMerge, Database } from 'lucide-react';

export const healthTechProducts = [
  {
    id: 'ht1',
    name: 'NeuroSync Pro Headband',
    category: 'Cognitive Tools',
    price: '$399',
    description: 'Clinical-grade EEG headband for neurofeedback, meditation tracking, and cognitive state optimization.',
    image: 'https://picsum.photos/seed/neuro/400/300',
    vendor: 'CortexBio',
    rating: 4.8,
    reviews: 412,
    features: ['Real-time EEG', 'Neuroplasticity Protocols', 'Focus & Flow State Tracking', 'Raw Data Export'],
    specs: [{label: 'Sensors', value: '7-Channel EEG'}, {label: 'Battery', value: '12 Hours'}],
    requirements: ['No Prescription Required'],
    useCases: ['ADHD Management', 'Peak Performance', 'Stress Reduction'],
    validation: 'IRB-Backed Studies'
  },
  {
    id: 'ht2',
    name: 'Metabolic CGM System',
    category: 'Biometrics',
    price: '$199/mo',
    description: 'Continuous glucose monitor with AI-driven metabolic insights. Syncs directly with your optimization clinic.',
    image: 'https://picsum.photos/seed/cgm/400/300',
    vendor: 'NutriSense',
    rating: 4.9,
    reviews: 2105,
    features: ['14-Day Sensor', 'Real-time Glucose', 'Meal Response AI', 'Clinic Dashboard Sync'],
    specs: [{label: 'Application', value: 'Painless Micro-needle'}, {label: 'Waterproof', value: 'IP68'}],
    requirements: ['Physician Prescription (Included)'],
    useCases: ['Metabolic Flexibility', 'Weight Optimization', 'Pre-diabetes Reversal'],
    validation: 'FDA Cleared'
  },
  {
    id: 'ht3',
    name: 'Lumina Red Light Panel',
    category: 'Recovery Hardware',
    price: '$1,295',
    description: 'Targeted red and near-infrared light therapy for cellular energy production and collagen synthesis.',
    image: 'https://picsum.photos/seed/redlight/400/300',
    vendor: 'LuminaTech',
    rating: 4.7,
    reviews: 89,
    features: ['660nm & 850nm Wavelengths', 'Zero EMF', 'Medical Grade LEDs'],
    specs: [{label: 'Irradiance', value: '>130 mw/cm2'}, {label: 'Dimensions', value: '36" x 12"'}],
    requirements: ['Dedicated Wall Space'],
    useCases: ['Mitochondrial Health', 'Skin Rejuvenation', 'Muscle Recovery'],
    validation: 'Class II Medical Device'
  },
  {
    id: 'ht4',
    name: 'Vagus Nerve Stimulator',
    category: 'Optimization Hardware',
    price: '$349',
    description: 'Non-invasive transcutaneous vagus nerve stimulation (tVNS) to rapidly shift the nervous system into parasympathetic state.',
    image: 'https://picsum.photos/seed/vagus/400/300',
    vendor: 'NeuroShift',
    rating: 4.6,
    reviews: 320,
    features: ['HRV Biofeedback', 'Custom Stimulation Patterns', 'App Integration'],
    specs: [{label: 'Placement', value: 'Tragus/Ear'}, {label: 'Connectivity', value: 'Bluetooth 5.0'}],
    requirements: ['No Prescription Required'],
    useCases: ['Anxiety Reduction', 'HRV Optimization', 'Sleep Latency'],
    validation: 'Clinically Validated'
  }
];

export function MarketplaceHealthTech() {
  const [searchQuery, setSearchQuery] = useState('');
  const [compareList, setCompareList] = useState<string[]>([]);

  const filteredProducts = healthTechProducts.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleCompare = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCompareList(prev => 
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id].slice(0, 3)
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Premium Header - Green Accent */}
      <section className="relative pt-32 pb-16 border-b border-surface-3/50 overflow-hidden">
        <div className="absolute inset-0 bg-[#020A06]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#10B981]/10 rounded-full blur-[100px] opacity-40 mix-blend-screen" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-surface-2/80 backdrop-blur-xl border border-surface-3 flex items-center justify-center text-[#10B981] shadow-2xl">
                <Cpu className="w-8 h-8" />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2/50 border border-surface-3 mb-3">
                  <Fingerprint className="w-3 h-3 text-[#10B981]" />
                  <span className="text-xs font-mono text-text-secondary uppercase tracking-wider">Bio-Intelligence</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">Health Tech & Biometrics</h1>
                <p className="text-lg text-text-secondary max-w-2xl font-light">Advanced telemetry, cognitive tools, and optimization hardware. Clinically validated devices to quantify and upgrade human performance.</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" className="border-surface-3 hover:bg-surface-2 text-white">
                <Database className="w-4 h-4 mr-2 text-[#10B981]" /> Raw Data Export
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 flex-grow bg-[#050F0A] relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8 relative z-10">
          {/* Sidebar Filters */}
          <div className="w-full lg:w-72 space-y-6 flex-shrink-0">
            <Card className="p-6 bg-surface-1/80 backdrop-blur-xl border-surface-3 shadow-xl">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-surface-3/50">
                <Filter className="w-5 h-5 text-text-secondary" />
                <h3 className="font-bold text-white text-lg">Telemetry Filters</h3>
              </div>
              
              <div className="space-y-8">
                <div>
                  <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Modality</h4>
                  <div className="space-y-3">
                    {['Biometrics', 'Cognitive Tools', 'Recovery Hardware', 'Optimization'].map((label, i) => (
                      <label key={i} className="flex items-center gap-3 text-sm text-text-secondary hover:text-white cursor-pointer transition-colors">
                        <input type="checkbox" className="rounded border-surface-3 bg-surface-2 text-[#10B981] focus:ring-[#10B981]/50 w-4 h-4" />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Clinical Validation</h4>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 text-sm text-text-secondary hover:text-white cursor-pointer transition-colors">
                      <input type="checkbox" className="rounded border-surface-3 bg-surface-2 text-[#10B981] focus:ring-[#10B981]/50 w-4 h-4" defaultChecked />
                      FDA Cleared / Class II
                    </label>
                    <label className="flex items-center gap-3 text-sm text-text-secondary hover:text-white cursor-pointer transition-colors">
                      <input type="checkbox" className="rounded border-surface-3 bg-surface-2 text-[#10B981] focus:ring-[#10B981]/50 w-4 h-4" />
                      IRB-Backed Studies
                    </label>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Data Access</h4>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 text-sm text-text-secondary hover:text-white cursor-pointer transition-colors">
                      <input type="checkbox" className="rounded border-surface-3 bg-surface-2 text-[#10B981] focus:ring-[#10B981]/50 w-4 h-4" defaultChecked />
                      Raw Data Export (CSV/JSON)
                    </label>
                    <label className="flex items-center gap-3 text-sm text-text-secondary hover:text-white cursor-pointer transition-colors">
                      <input type="checkbox" className="rounded border-surface-3 bg-surface-2 text-[#10B981] focus:ring-[#10B981]/50 w-4 h-4" />
                      Clinic Dashboard Sync
                    </label>
                  </div>
                </div>
              </div>
            </Card>

            {/* AI Bio-Stack Advisor Hook */}
            <Card className="p-6 bg-gradient-to-br from-surface-1 to-[#0A1A12] border-surface-3 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#10B981]/10 rounded-full blur-[24px]" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-[#10B981]/10 text-[#10B981] text-xs font-mono uppercase tracking-wider mb-4">
                  <Brain className="w-3 h-3" /> Bio-Stack AI
                </div>
                <h4 className="text-white font-bold mb-2">Biomarker Matching</h4>
                <p className="text-sm text-text-secondary mb-4 leading-relaxed">
                  Let our AI analyze your clinical goals and current telemetry to recommend the highest-impact hardware additions.
                </p>
                <Button className="w-full bg-[#10B981] hover:bg-[#059669] text-white text-sm font-semibold border-none">
                  Run Stack Analysis
                </Button>
              </div>
            </Card>
          </div>

          {/* Product Grid & Search */}
          <div className="flex-grow space-y-6">
            {/* Compare Strip (Visible if items selected) */}
            {compareList.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-surface-1/80 border border-[#10B981]/30 rounded-xl p-4 flex items-center justify-between backdrop-blur-md sticky top-24 z-20 shadow-2xl"
              >
                 <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-[#10B981]/10 flex items-center justify-center">
                     <GitMerge className="w-5 h-5 text-[#10B981]" />
                   </div>
                   <div>
                     <p className="text-sm font-medium text-white">{compareList.length} Devices Selected</p>
                     <p className="text-xs text-text-secondary">Compare specs, clinical validity, and data access.</p>
                   </div>
                 </div>
                 <div className="flex items-center gap-3">
                   <Button variant="ghost" size="sm" onClick={() => setCompareList([])} className="text-text-secondary hover:text-white">
                     Clear
                   </Button>
                   <Button size="sm" className="bg-[#10B981] hover:bg-[#059669] text-white border-none">
                     Compare Now
                   </Button>
                 </div>
              </motion.div>
            )}

            <div className="relative w-full group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#10B981]/20 to-secondary/20 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
              <div className="relative flex items-center bg-surface-1/80 backdrop-blur-xl border border-surface-3 rounded-xl p-1">
                <Search className="w-5 h-5 text-text-secondary ml-4" />
                <input 
                  type="text" 
                  placeholder="Search biometrics, neuro-tech, or optimization hardware..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 bg-transparent border-none text-white placeholder-text-secondary focus:outline-none focus:ring-0 px-4"
                />
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((item) => {
                  const isSelected = compareList.includes(item.id);
                  return (
                    <Link key={item.id} to={`/marketplace/product/${item.id}`}>
                      <Card className={`p-0 bg-surface-1/80 backdrop-blur-sm border flex flex-col h-full overflow-hidden transition-all duration-300 group ${isSelected ? 'border-[#10B981] shadow-[0_0_20px_rgba(16,185,129,0.15)]' : 'border-surface-3 hover:border-[#10B981]/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)]'}`}>
                        <div className="h-48 bg-surface-2 relative overflow-hidden">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                          <div className="absolute top-3 left-3 bg-background/80 backdrop-blur-md border border-surface-3 px-2 py-1 rounded-md flex items-center gap-1 text-xs font-medium text-white">
                            <ShieldCheck className="w-3 h-3 text-[#10B981]" /> {item.validation}
                          </div>
                          <button 
                            onClick={(e) => toggleCompare(item.id, e)}
                            className={`absolute top-3 right-3 w-8 h-8 rounded-md flex items-center justify-center backdrop-blur-md border transition-colors ${isSelected ? 'bg-[#10B981] border-[#10B981] text-white' : 'bg-background/50 border-surface-3 text-text-secondary hover:text-white hover:bg-background/80'}`}
                            title="Add to Compare"
                          >
                            <GitMerge className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="p-6 flex-grow flex flex-col">
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-xs font-mono text-text-secondary uppercase tracking-wider">{item.vendor}</div>
                            <span className="text-xs font-medium bg-surface-2 text-text-secondary px-2 py-1 rounded-md border border-surface-3">
                              {item.category}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-white group-hover:text-[#10B981] transition-colors mb-2 leading-tight">{item.name}</h3>
                          <p className="text-sm text-text-secondary mb-6 flex-grow leading-relaxed">{item.description}</p>
                          
                          <div className="flex flex-col gap-3 mt-auto pt-4 border-t border-surface-3/50">
                            <div className="flex justify-between items-center">
                              <span className="font-mono font-medium text-white text-lg">{item.price}</span>
                              <span className="flex items-center gap-1 text-sm font-medium text-[#10B981] bg-[#10B981]/10 px-2 py-1 rounded-md">
                                ★ {item.rating}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              <div className="flex flex-col bg-surface-2/50 p-2 rounded-lg border border-surface-3">
                                <span className="text-[10px] text-text-secondary uppercase tracking-wider mb-1 flex items-center gap-1"><Activity className="w-3 h-3" /> Impact</span>
                                <span className="text-sm font-bold text-white truncate" title={item.useCases[0]}>{item.useCases[0]}</span>
                              </div>
                              <div className="flex flex-col bg-surface-2/50 p-2 rounded-lg border border-surface-3">
                                <span className="text-[10px] text-text-secondary uppercase tracking-wider mb-1 flex items-center gap-1"><Database className="w-3 h-3" /> Data</span>
                                <span className="text-sm font-bold text-white truncate">{item.features[3] || 'App Sync'}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-16 px-8 text-center border border-surface-3 rounded-2xl bg-surface-1/50 backdrop-blur-xl relative overflow-hidden"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#10B981]/5 rounded-full blur-[64px]" />
                <div className="relative z-10 max-w-lg mx-auto">
                  <div className="w-20 h-20 rounded-2xl bg-surface-2 border border-surface-3 flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <Cpu className="w-10 h-10 text-[#10B981]" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white mb-4">No Devices Found</h3>
                  <p className="text-text-secondary mb-8 leading-relaxed">
                    We couldn't find any health tech or biometrics matching your search criteria.
                  </p>
                  <Button variant="outline" className="border-surface-3 hover:bg-surface-2 text-white" onClick={() => setSearchQuery('')}>
                    Clear Filters
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
