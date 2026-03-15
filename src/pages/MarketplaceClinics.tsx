import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Search, Filter, ShieldCheck, Clock, CheckCircle2, Zap, TrendingUp, Users, Building2, MapPin, Stethoscope, ArrowRight } from 'lucide-react';

// Mock data for clinics
const clinics = [
  { id: 'c1', name: 'Apex Men\'s Health', location: 'Austin, TX', type: 'TRT & Optimization', price: 'From $199/mo', roi: 'High Patient LTV', description: 'Premier optimization clinic specializing in hormone therapy and peptide protocols.', image: 'https://picsum.photos/seed/clinic1/400/300', rating: '4.9', patients: '2.5k+' },
  { id: 'c2', name: 'Vitality Institute', location: 'Miami, FL', type: 'Longevity & Peptides', price: 'From $299/mo', roi: 'Premium Care', description: 'Advanced longevity protocols and comprehensive metabolic health.', image: 'https://picsum.photos/seed/clinic2/400/300', rating: '4.8', patients: '1.2k+' },
  { id: 'c3', name: 'Peak Performance Medical', location: 'Denver, CO', type: 'Sports Medicine', price: 'Custom', roi: 'Specialized', description: 'Sports medicine and recovery focused clinic with advanced diagnostics.', image: 'https://picsum.photos/seed/clinic3/400/300', rating: '4.9', patients: '3k+' },
];

export function MarketplaceClinics() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClinics = clinics.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Premium Header */}
      <section className="relative pt-32 pb-16 border-b border-surface-3/50 overflow-hidden">
        <div className="absolute inset-0 bg-[#05070A]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/10 rounded-full blur-[100px] opacity-40 mix-blend-screen" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-surface-2/80 backdrop-blur-xl border border-surface-3 flex items-center justify-center text-primary shadow-2xl">
                <Building2 className="w-8 h-8" />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2/50 border border-surface-3 mb-3">
                  <ShieldCheck className="w-3 h-3 text-success" />
                  <span className="text-xs font-mono text-text-secondary uppercase tracking-wider">Curated Provider Network</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">Clinic Partnerships</h1>
                <p className="text-lg text-text-secondary max-w-2xl font-light">Discover vetted clinics, access specialized care protocols, and establish referral partnerships.</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" className="border-surface-3 hover:bg-surface-2 text-white">
                <Users className="w-4 h-4 mr-2" /> Partner Network
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 flex-grow bg-[#0B0F14] relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8 relative z-10">
          {/* Sidebar Filters */}
          <div className="w-full lg:w-72 space-y-6 flex-shrink-0">
            <Card className="p-6 bg-surface-1/80 backdrop-blur-xl border-surface-3 shadow-xl">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-surface-3/50">
                <Filter className="w-5 h-5 text-text-secondary" />
                <h3 className="font-bold text-white text-lg">Filters</h3>
              </div>
              
              <div className="space-y-8">
                <div>
                  <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Specialty</h4>
                  <div className="space-y-3">
                    {['TRT & Optimization', 'Longevity & Peptides', 'Sports Medicine', 'Hair Restoration'].map((label, i) => (
                      <label key={i} className="flex items-center gap-3 text-sm text-text-secondary hover:text-white cursor-pointer transition-colors">
                        <input type="checkbox" className="rounded border-surface-3 bg-surface-2 text-primary focus:ring-primary/50 w-4 h-4" />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Care Delivery</h4>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 text-sm text-text-secondary hover:text-white cursor-pointer transition-colors">
                      <input type="checkbox" className="rounded border-surface-3 bg-surface-2 text-primary focus:ring-primary/50 w-4 h-4" defaultChecked />
                      Telehealth Available
                    </label>
                    <label className="flex items-center gap-3 text-sm text-text-secondary hover:text-white cursor-pointer transition-colors">
                      <input type="checkbox" className="rounded border-surface-3 bg-surface-2 text-primary focus:ring-primary/50 w-4 h-4" />
                      In-Person Only
                    </label>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Partnership Type</h4>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 text-sm text-text-secondary hover:text-white cursor-pointer transition-colors">
                      <input type="checkbox" className="rounded border-surface-3 bg-surface-2 text-primary focus:ring-primary/50 w-4 h-4" />
                      Accepts Referrals
                    </label>
                    <label className="flex items-center gap-3 text-sm text-text-secondary hover:text-white cursor-pointer transition-colors">
                      <input type="checkbox" className="rounded border-surface-3 bg-surface-2 text-primary focus:ring-primary/50 w-4 h-4" />
                      Protocol Licensing
                    </label>
                  </div>
                </div>
              </div>
            </Card>

            {/* AI Matchmaker Hook */}
            <Card className="p-6 bg-gradient-to-br from-surface-1 to-surface-2 border-surface-3 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-[24px]" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-mono uppercase tracking-wider mb-4">
                  <Zap className="w-3 h-3" /> AI Matchmaker
                </div>
                <h4 className="text-white font-bold mb-2">Find Your Ideal Partner</h4>
                <p className="text-sm text-text-secondary mb-4 leading-relaxed">
                  Let our AI analyze your patient demographics to recommend the best clinic partnerships for your overflow or specialized care needs.
                </p>
                <Button className="w-full bg-surface-3 hover:bg-surface-3/80 text-white text-sm">
                  Run Match Analysis
                </Button>
              </div>
            </Card>
          </div>

          {/* Clinic Grid & Search */}
          <div className="flex-grow space-y-6">
            <div className="relative w-full group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
              <div className="relative flex items-center bg-surface-1/80 backdrop-blur-xl border border-surface-3 rounded-xl p-1">
                <Search className="w-5 h-5 text-text-secondary ml-4" />
                <input 
                  type="text" 
                  placeholder="Search clinics, specialties, or locations..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 bg-transparent border-none text-white placeholder-text-secondary focus:outline-none focus:ring-0 px-4"
                />
              </div>
            </div>

            {filteredClinics.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredClinics.map((clinic) => (
                  <Link key={clinic.id} to={`/clinics/${clinic.id}`}>
                    <Card className="p-0 bg-surface-1/80 backdrop-blur-sm border-surface-3 flex flex-col h-full overflow-hidden hover:border-primary/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)] transition-all duration-300 group">
                      <div className="h-48 bg-surface-2 relative overflow-hidden">
                        <img src={clinic.image} alt={clinic.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                        <div className="absolute top-3 left-3 bg-background/80 backdrop-blur-md border border-surface-3 px-2 py-1 rounded-md flex items-center gap-1 text-xs font-medium text-white">
                          <ShieldCheck className="w-3 h-3 text-primary" /> Verified Partner
                        </div>
                      </div>
                      <div className="p-6 flex-grow flex flex-col">
                        <div className="flex items-center gap-2 text-xs font-mono text-text-secondary uppercase tracking-wider mb-2">
                          <MapPin className="w-3 h-3" /> {clinic.location}
                        </div>
                        <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors mb-2 leading-tight">{clinic.name}</h3>
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-xs font-medium bg-surface-2 text-text-secondary px-2 py-1 rounded-md border border-surface-3">
                            {clinic.type}
                          </span>
                        </div>
                        <p className="text-sm text-text-secondary mb-6 flex-grow leading-relaxed">{clinic.description}</p>
                        
                        <div className="flex flex-col gap-3 mt-auto pt-4 border-t border-surface-3/50">
                          <div className="flex justify-between items-center">
                            <span className="font-mono font-medium text-white">{clinic.price}</span>
                            <span className="flex items-center gap-1 text-sm font-medium text-success bg-success/10 px-2 py-1 rounded-md">
                              ★ {clinic.rating}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs font-medium text-text-secondary bg-surface-2/50 px-3 py-2 rounded-lg border border-surface-3">
                            <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {clinic.patients} Active</span>
                            <span className="flex items-center gap-1 text-primary"><TrendingUp className="w-3 h-3" /> {clinic.roi}</span>
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
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/5 rounded-full blur-[64px]" />
                <div className="relative z-10 max-w-lg mx-auto">
                  <div className="w-20 h-20 rounded-2xl bg-surface-2 border border-surface-3 flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <Building2 className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white mb-4">Network Expansion in Progress</h3>
                  <p className="text-text-secondary mb-8 leading-relaxed">
                    We are currently onboarding and vetting top-tier clinics in this region to ensure they meet our strict standards for care delivery and protocol adherence.
                  </p>
                  
                  <div className="bg-surface-2/50 border border-surface-3 rounded-xl p-6 text-left mb-8">
                    <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success" /> Clinic Vetting Standards
                    </h4>
                    <ul className="space-y-2 text-sm text-text-secondary">
                      <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-primary" /> Board-Certified Medical Directors</li>
                      <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-primary" /> Proven Patient Outcome Data</li>
                      <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-primary" /> High-Fidelity Protocol Adherence</li>
                      <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-primary" /> Seamless EMR & Referral Integration</li>
                    </ul>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button className="bg-primary hover:bg-primary-hover text-background font-semibold">
                      Apply to Join Network
                    </Button>
                    <Button variant="outline" className="border-surface-3 hover:bg-surface-2 text-white">
                      Get Notified When Live
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
