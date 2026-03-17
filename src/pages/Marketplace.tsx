import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { ShoppingCart, Server, Activity, ArrowRight, Search, ShieldCheck, Zap, Database, CheckCircle2, Building2, TrendingUp, Cpu } from 'lucide-react';

export function Marketplace() {
  const [searchQuery, setSearchQuery] = useState('');

  const stats = [
    { label: "Vetted Vendors", value: "150+" },
    { label: "Clinical Products", value: "2,400+" },
    { label: "Avg. ROI (Months)", value: "4.2" },
    { label: "Procurement Volume", value: "$12M+" }
  ];

  const featuredVendors = [
    { name: "NeuroTech Systems", category: "Diagnostics", rating: "4.9", logo: Cpu },
    { name: "Apex Clinical", category: "Equipment", rating: "4.8", logo: Server },
    { name: "Vitality Labs", category: "Supplements", rating: "4.9", logo: Activity },
    { name: "Pulse Analytics", category: "Health Tech", rating: "4.7", logo: Database }
  ];

  return (
    <div className="flex flex-col bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden border-b border-surface-3/50">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/10 rounded-full blur-[120px] opacity-50 mix-blend-screen" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-2/80 backdrop-blur-md border border-surface-3 mb-8 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span className="text-sm font-mono text-text-primary uppercase tracking-widest">Verified Clinical Exchange</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6 text-white leading-tight">
              Clinical Optimization <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                Infrastructure
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
              Procure advanced clinical equipment, specialized diagnostics, and high-performance protocols. Vetted for quality, optimized for ROI, and integrated directly into your Clinic OS.
            </p>
            
            <div className="max-w-3xl mx-auto relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 to-blue-600/30 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
              <div className="relative flex flex-col sm:flex-row items-center bg-surface-1/80 backdrop-blur-xl border border-surface-3 rounded-2xl p-2 shadow-2xl gap-2 sm:gap-0">
                <div className="flex items-center w-full">
                  <Search className="w-6 h-6 text-slate-400 ml-4 shrink-0" />
                  <input 
                    type="text" 
                    placeholder="Search TRT protocols, peptides, Dexa scanners, or diagnostics..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-14 bg-transparent border-none text-base sm:text-lg text-white placeholder-slate-500 focus:outline-none focus:ring-0 px-4"
                  />
                </div>
                <Link to="/marketplace/equipment" className="w-full sm:w-auto">
                  <Button 
                    className="w-full sm:w-auto h-12 px-8 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded-xl transition-colors"
                  >
                    Search
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="py-12 bg-surface-1/30 border-b border-surface-3/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-surface-3/50">
            {stats.map((stat, i) => (
              <div key={i} className="text-center px-4">
                <div className="text-3xl md:text-4xl font-display font-bold text-white mb-2">{stat.value}</div>
                <div className="text-xs md:text-sm font-mono text-text-secondary uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-display font-bold text-white mb-2">Procurement Categories</h2>
              <p className="text-text-secondary">Browse vetted infrastructure and protocols.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link to="/marketplace/equipment" className="group">
              <Card glow="cyan" className="h-full flex flex-col justify-between p-8 bg-surface-1/50 backdrop-blur-xl border-surface-3/50 hover:border-cyan-500/50 transition-all duration-500">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
                      <Server className="w-7 h-7 text-cyan-400" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-surface-2 border border-surface-3 text-xs font-mono text-slate-400 uppercase tracking-wider">High ROI</span>
                  </div>
                  <h3 className="text-2xl font-display font-bold mb-3 text-white group-hover:text-cyan-400 transition-colors">Capital Equipment & Devices</h3>
                  <p className="text-slate-400 mb-8 leading-relaxed">
                    Dexa scanners, InBody analyzers, shockwave therapy (GAINSWave), and operational hardware for modern clinics. Includes AI-driven ROI calculators.
                  </p>
                </div>
                <div className="flex items-center text-cyan-400 font-semibold uppercase tracking-wider text-sm group-hover:gap-2 transition-all">
                  Browse Equipment <ArrowRight className="ml-2 w-4 h-4" />
                </div>
              </Card>
            </Link>

            <Link to="/marketplace/diagnostics" className="group">
              <Card glow="blue" className="h-full flex flex-col justify-between p-8 bg-surface-1/50 backdrop-blur-xl border-surface-3/50 hover:border-blue-500/50 transition-all duration-500">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
                      <Activity className="w-7 h-7 text-blue-400" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-surface-2 border border-surface-3 text-xs font-mono text-slate-400 uppercase tracking-wider">Essential</span>
                  </div>
                  <h3 className="text-2xl font-display font-bold mb-3 text-white group-hover:text-blue-400 transition-colors">Specialized Diagnostics</h3>
                  <p className="text-slate-400 mb-8 leading-relaxed">
                    Comprehensive hormone panels, biological age testing, and advanced diagnostic kits to expand your clinic's precision medicine capabilities.
                  </p>
                </div>
                <div className="flex items-center text-blue-400 font-semibold uppercase tracking-wider text-sm group-hover:gap-2 transition-all">
                  Browse Diagnostics <ArrowRight className="ml-2 w-4 h-4" />
                </div>
              </Card>
            </Link>

            <Link to="/marketplace/health-tech" className="group">
              <Card glow="cyan" className="h-full flex flex-col justify-between p-8 bg-surface-1/50 backdrop-blur-xl border-surface-3/50 hover:border-cyan-500/50 transition-all duration-500">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
                      <Database className="w-7 h-7 text-cyan-400" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-display font-bold mb-3 text-white group-hover:text-cyan-400 transition-colors">Wearables & Biomarkers</h3>
                  <p className="text-slate-400 mb-8 leading-relaxed">
                    CGMs, Oura rings, HRV monitors, and digital health software for continuous patient tracking, engagement, and remote monitoring.
                  </p>
                </div>
                <div className="flex items-center text-cyan-400 font-semibold uppercase tracking-wider text-sm group-hover:gap-2 transition-all">
                  Browse Health Tech <ArrowRight className="ml-2 w-4 h-4" />
                </div>
              </Card>
            </Link>

            <Link to="/marketplace/supplements" className="group">
              <Card glow="blue" className="h-full flex flex-col justify-between p-8 bg-surface-1/50 backdrop-blur-xl border-surface-3/50 hover:border-blue-500/50 transition-all duration-500">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
                      <ShoppingCart className="w-7 h-7 text-blue-400" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-display font-bold mb-3 text-white group-hover:text-blue-400 transition-colors">Peptides & Protocols</h3>
                  <p className="text-slate-400 mb-8 leading-relaxed">
                    Clinical-grade NAD+, BPC-157, GLP-1, TRT supplies, and specialized formulations for optimized patient outcomes and recurring revenue.
                  </p>
                </div>
                <div className="flex items-center text-blue-400 font-semibold uppercase tracking-wider text-sm group-hover:gap-2 transition-all">
                  Browse Protocols <ArrowRight className="ml-2 w-4 h-4" />
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Vendors & AI Recommendations */}
      <section className="py-24 bg-[#101720] border-t border-surface-3/50 relative overflow-hidden">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/2 h-full bg-gradient-to-r from-blue-500/5 to-transparent blur-[100px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Featured Vendors */}
            <div className="lg:w-2/3">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
                  <Building2 className="w-6 h-6 text-cyan-400" /> Featured Partners
                </h2>
                <Link to="/vendors/apply" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Become a Vendor &rarr;
                </Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {featuredVendors.map((vendor, i) => (
                  <Card key={i} className="bg-surface-1/80 border-surface-3 p-6 flex items-center gap-4 hover:bg-surface-2 transition-colors cursor-pointer">
                    <div className="w-12 h-12 rounded-xl bg-surface-3 flex items-center justify-center text-slate-400">
                      <vendor.logo className="w-6 h-6" />
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-white font-bold">{vendor.name}</h4>
                      <p className="text-sm text-slate-400">{vendor.category}</p>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md">
                      ★ {vendor.rating}
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* AI Recommendation Hook */}
            <div className="lg:w-1/3">
              <Card className="bg-gradient-to-br from-surface-1 to-surface-2 border-surface-3 p-8 h-full relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-[32px]" />
                <div className="relative z-10 flex flex-col h-full">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-6 w-fit">
                    <Zap className="w-3 h-3" /> AI Procurement Advisor
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Optimize Your Clinic Stack</h3>
                  <p className="text-slate-400 text-sm mb-8 flex-grow leading-relaxed">
                    Connect your Clinic OS to receive personalized equipment and protocol recommendations based on your patient demographics, capacity, and revenue goals.
                  </p>
                  <Link to="/clinics/icp">
                    <Button className="w-full bg-surface-3 hover:bg-surface-3/80 text-white border border-surface-3">
                      Run Clinic Analysis
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

