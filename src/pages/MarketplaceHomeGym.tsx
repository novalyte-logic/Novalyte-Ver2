import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Search, Filter, ShieldCheck, Zap, Activity, Dumbbell, ArrowRight, Flame, Heart, Thermometer, CheckCircle2 } from 'lucide-react';

export const homeGymProducts = [
  {
    id: 'hg1',
    name: 'Oura Ring Gen3',
    category: 'Wearables',
    price: '$299',
    description: 'Clinical-grade sleep and recovery tracking in a titanium ring. Syncs directly with your clinic profile.',
    image: 'https://picsum.photos/seed/oura/400/300',
    vendor: 'Oura Health',
    rating: 4.8,
    reviews: 1245,
    features: ['Sleep Staging', 'HRV Tracking', 'Temperature Trends', 'Clinic Sync API'],
    specs: [{label: 'Material', value: 'Titanium'}, {label: 'Battery', value: 'Up to 7 days'}],
    requirements: ['No Prescription Required'],
    useCases: ['Daily Recovery Monitoring', 'Sleep Optimization']
  },
  {
    id: 'hg2',
    name: 'Plunge All-In',
    category: 'Recovery',
    price: '$4,990',
    description: 'Professional cold plunge system for home use. Accelerates recovery, reduces inflammation, and boosts dopamine.',
    image: 'https://picsum.photos/seed/plunge/400/300',
    vendor: 'Plunge',
    rating: 4.9,
    reviews: 312,
    features: ['Ozone Sanitation', 'Chills to 39°F', 'Indoor/Outdoor Use'],
    specs: [{label: 'Dimensions', value: '67" x 31.5" x 28"'}, {label: 'Power', value: 'Standard 110V'}],
    requirements: ['Dedicated Space'],
    useCases: ['Inflammation Reduction', 'CNS Recovery']
  },
  {
    id: 'hg3',
    name: 'Clearlight Sanctuary 2',
    category: 'Recovery',
    price: '$6,499',
    description: 'Full spectrum infrared sauna for deep tissue detoxification and cardiovascular conditioning.',
    image: 'https://picsum.photos/seed/sauna/400/300',
    vendor: 'Clearlight',
    rating: 4.9,
    reviews: 189,
    features: ['Near, Mid & Far Infrared', 'Medical Grade Chromotherapy', 'Low EMF'],
    specs: [{label: 'Capacity', value: '2 Person'}, {label: 'Power', value: '120V / 20A'}],
    requirements: ['Dedicated 20A Circuit'],
    useCases: ['Detoxification', 'Cardiovascular Health']
  },
  {
    id: 'hg4',
    name: 'Eight Sleep Pod 4',
    category: 'Sleep Optimization',
    price: '$2,295',
    description: 'Intelligent sleep system with dynamic cooling and biometric tracking. Clinically proven to increase deep sleep.',
    image: 'https://picsum.photos/seed/eightsleep/400/300',
    vendor: 'Eight Sleep',
    rating: 4.7,
    reviews: 843,
    features: ['Dynamic Temperature Control', 'Snore Mitigation', 'Clinical Sleep Reports'],
    specs: [{label: 'Sizes', value: 'Full to Cali King'}, {label: 'Connectivity', value: 'Wi-Fi'}],
    requirements: ['Wi-Fi Connection'],
    useCases: ['Sleep Architecture Optimization', 'Night Sweats']
  }
];

export function MarketplaceHomeGym() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = homeGymProducts.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Premium Header - Orange Accent */}
      <section className="relative pt-32 pb-16 border-b border-surface-3/50 overflow-hidden">
        <div className="absolute inset-0 bg-[#0A0604]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#F97316]/10 rounded-full blur-[100px] opacity-40 mix-blend-screen" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-surface-2/80 backdrop-blur-xl border border-surface-3 flex items-center justify-center text-[#F97316] shadow-2xl">
                <Dumbbell className="w-8 h-8" />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2/50 border border-surface-3 mb-3">
                  <ShieldCheck className="w-3 h-3 text-success" />
                  <span className="text-xs font-mono text-text-secondary uppercase tracking-wider">Clinical-Grade Performance</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">Home Gym & Recovery</h1>
                <p className="text-lg text-text-secondary max-w-2xl font-light">Elevate your baseline with medical-grade recovery tools, biometrics, and performance hardware curated by our clinical network.</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" className="border-surface-3 hover:bg-surface-2 text-white">
                <Activity className="w-4 h-4 mr-2 text-[#F97316]" /> Sync with Clinic
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 flex-grow bg-[#0F0A08] relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8 relative z-10">
          {/* Sidebar Filters */}
          <div className="w-full lg:w-72 space-y-6 flex-shrink-0">
            <Card className="p-6 bg-surface-1/80 backdrop-blur-xl border-surface-3 shadow-xl">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-surface-3/50">
                <Filter className="w-5 h-5 text-text-secondary" />
                <h3 className="font-bold text-white text-lg">Performance Filters</h3>
              </div>
              
              <div className="space-y-8">
                <div>
                  <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Modality</h4>
                  <div className="space-y-3">
                    {['Wearables', 'Recovery', 'Sleep Optimization', 'Strength'].map((label, i) => (
                      <label key={i} className="flex items-center gap-3 text-sm text-text-secondary hover:text-white cursor-pointer transition-colors">
                        <input type="checkbox" className="rounded border-surface-3 bg-surface-2 text-[#F97316] focus:ring-[#F97316]/50 w-4 h-4" />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Clinical Integration</h4>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 text-sm text-text-secondary hover:text-white cursor-pointer transition-colors">
                      <input type="checkbox" className="rounded border-surface-3 bg-surface-2 text-[#F97316] focus:ring-[#F97316]/50 w-4 h-4" defaultChecked />
                      API Sync Available
                    </label>
                    <label className="flex items-center gap-3 text-sm text-text-secondary hover:text-white cursor-pointer transition-colors">
                      <input type="checkbox" className="rounded border-surface-3 bg-surface-2 text-[#F97316] focus:ring-[#F97316]/50 w-4 h-4" />
                      Physician Recommended
                    </label>
                  </div>
                </div>
              </div>
            </Card>

            {/* AI Performance Advisor Hook */}
            <Card className="p-6 bg-gradient-to-br from-surface-1 to-[#1A0F0A] border-surface-3 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#F97316]/10 rounded-full blur-[24px]" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-[#F97316]/10 text-[#F97316] text-xs font-mono uppercase tracking-wider mb-4">
                  <Zap className="w-3 h-3" /> Performance AI
                </div>
                <h4 className="text-white font-bold mb-2">Personalized Stack</h4>
                <p className="text-sm text-text-secondary mb-4 leading-relaxed">
                  Let our AI analyze your recent lab results and fitness goals to recommend the optimal recovery and tracking hardware.
                </p>
                <Button className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-semibold border-none">
                  Build My Stack
                </Button>
              </div>
            </Card>
          </div>

          {/* Product Grid & Search */}
          <div className="flex-grow space-y-6">
            {/* Recommendation Strip */}
            <div className="bg-surface-1/50 border border-[#F97316]/20 rounded-xl p-4 flex items-center justify-between backdrop-blur-sm">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-[#F97316]/10 flex items-center justify-center">
                   <Flame className="w-5 h-5 text-[#F97316]" />
                 </div>
                 <div>
                   <p className="text-sm font-medium text-white">Based on your recent assessment</p>
                   <p className="text-xs text-text-secondary">We recommend focusing on CNS recovery and sleep architecture.</p>
                 </div>
               </div>
               <Button variant="outline" size="sm" className="border-[#F97316]/30 text-[#F97316] hover:bg-[#F97316]/10">
                 View Protocol
               </Button>
            </div>

            <div className="relative w-full group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#F97316]/20 to-secondary/20 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
              <div className="relative flex items-center bg-surface-1/80 backdrop-blur-xl border border-surface-3 rounded-xl p-1">
                <Search className="w-5 h-5 text-text-secondary ml-4" />
                <input 
                  type="text" 
                  placeholder="Search recovery tools, wearables, or brands..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 bg-transparent border-none text-white placeholder-text-secondary focus:outline-none focus:ring-0 px-4"
                />
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((item) => (
                  <Link key={item.id} to={`/marketplace/product/${item.id}`}>
                    <Card className="p-0 bg-surface-1/80 backdrop-blur-sm border-surface-3 flex flex-col h-full overflow-hidden hover:border-[#F97316]/50 hover:shadow-[0_0_30px_rgba(249,115,22,0.1)] transition-all duration-300 group">
                      <div className="h-48 bg-surface-2 relative overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                        <div className="absolute top-3 left-3 bg-background/80 backdrop-blur-md border border-surface-3 px-2 py-1 rounded-md flex items-center gap-1 text-xs font-medium text-white">
                          <CheckCircle2 className="w-3 h-3 text-[#F97316]" /> Vetted Partner
                        </div>
                      </div>
                      <div className="p-6 flex-grow flex flex-col">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-xs font-mono text-text-secondary uppercase tracking-wider">{item.vendor}</div>
                          <span className="text-xs font-medium bg-surface-2 text-text-secondary px-2 py-1 rounded-md border border-surface-3">
                            {item.category}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-white group-hover:text-[#F97316] transition-colors mb-2 leading-tight">{item.name}</h3>
                        <p className="text-sm text-text-secondary mb-6 flex-grow leading-relaxed">{item.description}</p>
                        
                        <div className="flex flex-col gap-3 mt-auto pt-4 border-t border-surface-3/50">
                          <div className="flex justify-between items-center">
                            <span className="font-mono font-medium text-white text-lg">{item.price}</span>
                            <span className="flex items-center gap-1 text-sm font-medium text-[#F97316] bg-[#F97316]/10 px-2 py-1 rounded-md">
                              ★ {item.rating}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <div className="flex flex-col bg-surface-2/50 p-2 rounded-lg border border-surface-3">
                              <span className="text-[10px] text-text-secondary uppercase tracking-wider mb-1 flex items-center gap-1"><Heart className="w-3 h-3" /> Reviews</span>
                              <span className="text-sm font-bold text-white">{item.reviews.toLocaleString()}</span>
                            </div>
                            <div className="flex flex-col bg-surface-2/50 p-2 rounded-lg border border-surface-3">
                              <span className="text-[10px] text-text-secondary uppercase tracking-wider mb-1 flex items-center gap-1"><Thermometer className="w-3 h-3" /> Impact</span>
                              <span className="text-sm font-bold text-white truncate" title={item.useCases[0]}>{item.useCases[0]}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-16 px-8 text-center border border-surface-3 rounded-2xl bg-surface-1/50 backdrop-blur-xl relative overflow-hidden"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#F97316]/5 rounded-full blur-[64px]" />
                <div className="relative z-10 max-w-lg mx-auto">
                  <div className="w-20 h-20 rounded-2xl bg-surface-2 border border-surface-3 flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <Dumbbell className="w-10 h-10 text-[#F97316]" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white mb-4">No Products Found</h3>
                  <p className="text-text-secondary mb-8 leading-relaxed">
                    We couldn't find any performance hardware matching your search criteria.
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
