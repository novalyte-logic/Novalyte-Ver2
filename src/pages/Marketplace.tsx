import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { 
  ShoppingCart, Server, Activity, ArrowRight, Search, ShieldCheck, 
  Zap, Database, CheckCircle2, Building2, TrendingUp, Cpu, Sparkles, Filter, MessageSquare
} from 'lucide-react';

export function Marketplace() {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    {
      title: "Supplements",
      description: "Clinical-grade peptides, TRT supplies, and specialized formulations.",
      image: "https://images.unsplash.com/photo-1579722820308-d74e571900a9?auto=format&fit=crop&q=80&w=800",
      link: "/marketplace/supplements",
      icon: Activity
    },
    {
      title: "Home Gym",
      description: "High-end training systems designed for measurable results at home.",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800",
      link: "/marketplace/home-gym",
      icon: Server
    },
    {
      title: "Clinic Equipment",
      description: "Commercial multi-stations, diagnostic tools, and operational hardware.",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
      link: "/marketplace/clinic-equipment",
      icon: Building2
    },
    {
      title: "Health Tech Devices",
      description: "Wearables, metabolic scanners, and AI-powered diagnostic tools.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
      link: "/marketplace/health-tech",
      icon: Cpu
    }
  ];

  const includedItems = [
    {
      title: "IV Therapy Stations",
      brands: "Multi-line infusion pods",
      price: "Clinical Grade",
      features: ["Automated fluid delivery with digital monitoring", "Designed for hormone, regenerative, and vitamin therapy clinics"],
      image: "https://images.unsplash.com/photo-1583324113626-70df0f4deaab?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Cryotherapy Chambers",
      brands: "Single and multi-person cryo units",
      price: "Clinical Grade",
      features: ["Electric and nitrogen-free systems", "For recovery and inflammation reduction"],
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Hyperbaric Oxygen Chambers",
      brands: "Soft & hard-shell medical oxygen chambers",
      price: "Clinical Grade",
      features: ["Accelerate healing", "Cellular oxygenation"],
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Laser & Ultrasound Therapy",
      brands: "FDA-cleared regenerative lasers",
      price: "Clinical Grade",
      features: ["Ultrasound systems for tissue repair", "Pain management and aesthetics"],
      image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "PEMF & Shockwave Systems",
      brands: "Electromagnetic and shockwave platforms",
      price: "Clinical Grade",
      features: ["Rehab and pain management", "Recovery and performance clinics"],
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Red-Light Therapy Beds & Panels",
      brands: "Full-body therapy beds + modular panels",
      price: "Clinical Grade",
      features: ["Hormone support and recovery", "Skin rejuvenation"],
      image: "https://images.unsplash.com/photo-1550537687-c91072c4792d?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Regenerative Medicine Tools",
      brands: "PRP centrifuges, ozone therapy units",
      price: "Clinical Grade",
      features: ["Stem-cell processing equipment", "Clinical-grade precision"],
      image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Clinic-Grade Smart Diagnostics",
      brands: "AI-powered comp analyzers",
      price: "Clinical Grade",
      features: ["Metabolic scanners", "IoT wearable hubs integrated with Novalyte"],
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800"
    }
  ];

  return (
    <div className="flex flex-col bg-[#05070A] min-h-screen font-sans text-text-primary">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden border-b border-surface-3/50 min-h-[60vh] flex flex-col justify-center">
        {/* Deep layered background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        
        {/* Abstract Data Grid Motif */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
        
        {/* Glowing Orbs */}
        <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-primary/10 rounded-full blur-[120px] opacity-50 mix-blend-screen pointer-events-none" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-2/80 backdrop-blur-md border border-surface-3 mb-8 shadow-[0_0_30px_rgba(139,92,246,0.15)]">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-mono text-white uppercase tracking-widest">AI Powered Infrastructure</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6 text-white leading-tight uppercase">
              Equip Your Clinic for the <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Future of Optimization.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto mb-12 leading-relaxed font-light">
              Direct access to top-tier medical devices, compounding pharmacies, and diagnostic equipment.
            </p>
            
            <div className="max-w-4xl mx-auto relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
              <div className="relative flex flex-col sm:flex-row items-center bg-surface-1/80 backdrop-blur-xl border border-surface-3 rounded-2xl p-2 shadow-2xl gap-2">
                <div className="flex items-center w-full">
                  <Search className="w-6 h-6 text-text-secondary ml-4 shrink-0" />
                  <input 
                    type="text" 
                    placeholder="Search equipment, supplements, or clinics..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-14 bg-transparent border-none text-base sm:text-lg text-white placeholder-text-secondary focus:outline-none focus:ring-0 px-4"
                  />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button variant="outline" className="h-12 px-4 border-surface-3 text-text-secondary hover:text-white">
                    <Filter className="w-5 h-5" />
                  </Button>
                  <Button className="w-full sm:w-auto h-12 px-6 bg-primary hover:bg-primary-hover text-black font-bold rounded-xl transition-colors flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" /> Ask AI
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-display font-bold text-white mb-4">Marketplace Categories</h2>
              <p className="text-xl text-text-secondary">Explore our curated selection of high-end products and services.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categories.map((category, i) => (
              <Link key={i} to={category.link} className="group">
                <Card className="overflow-hidden bg-[#0B0F14] border-surface-3 hover:border-primary/50 transition-all duration-500 h-full flex flex-col">
                  <div className="h-64 relative overflow-hidden">
                    <img src={category.image} alt={category.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F14] via-[#0B0F14]/40 to-transparent" />
                    <div className="absolute top-4 left-4 w-12 h-12 rounded-xl bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center">
                      <category.icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div className="p-8 flex-grow flex flex-col justify-between relative -mt-12 z-10">
                    <div>
                      <h3 className="text-2xl font-display font-bold mb-3 text-white group-hover:text-primary transition-colors">{category.title}</h3>
                      <p className="text-text-secondary text-lg leading-relaxed mb-6">
                        {category.description}
                      </p>
                    </div>
                    <div className="flex items-center text-primary font-bold uppercase tracking-wider text-sm group-hover:gap-2 transition-all">
                      Explore Category <ArrowRight className="ml-2 w-4 h-4" />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-24 bg-[#0B0F14] border-t border-surface-3/50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-white mb-4">What's Included</h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Our curated collection features only the highest quality systems for home and clinical use.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {includedItems.slice(0, 4).map((item, i) => (
              <Card key={i} className="bg-surface-1/50 border-surface-3 overflow-hidden flex flex-col">
                <div className="h-48 relative">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-1 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <h3 className="text-xl font-bold text-white">{item.title}</h3>
                  </div>
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <div className="mb-4">
                    <p className="text-primary font-semibold text-sm mb-1">{item.brands}</p>
                    <p className="text-text-secondary text-sm">{item.price}</p>
                  </div>
                  <ul className="space-y-2 mt-auto">
                    {item.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {includedItems.slice(4).map((item, i) => (
              <Card key={i} className="bg-surface-1/50 border-surface-3 overflow-hidden flex flex-col sm:flex-row">
                <div className="sm:w-2/5 h-48 sm:h-auto relative">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-surface-1 hidden sm:block" />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-1 to-transparent sm:hidden" />
                </div>
                <div className="p-6 sm:w-3/5 flex flex-col justify-center">
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <div className="mb-4">
                    <p className="text-primary font-semibold text-sm mb-1">{item.brands}</p>
                    <p className="text-text-secondary text-sm">{item.price}</p>
                  </div>
                  <ul className="space-y-2">
                    {item.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

