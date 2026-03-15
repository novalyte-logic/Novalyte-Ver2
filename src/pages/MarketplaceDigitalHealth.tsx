import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Search, Filter, ShieldCheck, Clock, CheckCircle2, Zap, Smartphone, Laptop, Database, Code, Cloud, Lock, Activity, ArrowRight } from 'lucide-react';

// Mock data for digital health
const digitalHealth = [
  { id: 'dh1', name: 'Novalyte RPM Suite', category: 'Remote Monitoring', price: '$299/mo', implementation: '24 Hours', compatibility: 'Agnostic API', description: 'Continuous remote patient monitoring platform with automated clinical alerts and device integrations.', image: 'https://picsum.photos/seed/rpm/400/300', vendor: 'Novalyte', rating: '4.9', compliance: 'HIPAA & SOC2' },
  { id: 'dh2', name: 'Clinical AI Scribe', category: 'Clinical Workflow', price: '$149/mo/provider', implementation: 'Immediate', compatibility: 'Athena, Epic', description: 'Ambient listening and automated charting to reduce provider burnout and increase patient face-time.', image: 'https://picsum.photos/seed/scribe/400/300', vendor: 'ScribeTech', rating: '4.8', compliance: 'HIPAA' },
  { id: 'dh3', name: 'Patient Engagement CRM', category: 'Patient Experience', price: '$499/mo', implementation: '1 Week', compatibility: 'All Major EMRs', description: 'Automated follow-ups, protocol adherence tracking, and secure messaging for optimization clinics.', image: 'https://picsum.photos/seed/crm/400/300', vendor: 'HealthConnect', rating: '4.7', compliance: 'HIPAA & GDPR' },
  { id: 'dh4', name: 'Metabolic Analytics Engine', category: 'Analytics', price: 'Custom', implementation: '2 Weeks', compatibility: 'API Only', description: 'Advanced population health analytics and predictive modeling for longevity and optimization clinics.', image: 'https://picsum.photos/seed/analytics/400/300', vendor: 'DataMed', rating: '4.9', compliance: 'SOC2 Type II' },
];

export function MarketplaceDigitalHealth() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = digitalHealth.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.compatibility.toLowerCase().includes(searchQuery.toLowerCase())
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
                <Laptop className="w-8 h-8" />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2/50 border border-surface-3 mb-3">
                  <ShieldCheck className="w-3 h-3 text-success" />
                  <span className="text-xs font-mono text-text-secondary uppercase tracking-wider">Digital Care Infrastructure</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">Digital Health & Software</h1>
                <p className="text-lg text-text-secondary max-w-2xl font-light">Procure vetted clinical software, remote monitoring tools, and digital infrastructure to scale your clinic's operations.</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" className="border-surface-3 hover:bg-surface-2 text-white">
                <Code className="w-4 h-4 mr-2" /> API Documentation
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
                <h3 className="font-bold text-white text-lg">Software Filters</h3>
              </div>
              
              <div className="space-y-8">
                <div>
                  <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Category</h4>
                  <div className="space-y-3">
                    {['Remote Monitoring', 'Clinical Workflow', 'Patient Experience', 'Analytics'].map((label, i) => (
                      <label key={i} className="flex items-center gap-3 text-sm text-text-secondary hover:text-white cursor-pointer transition-colors">
                        <input type="checkbox" className="rounded border-surface-3 bg-surface-2 text-primary focus:ring-primary/50 w-4 h-4" />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">EMR Compatibility</h4>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 text-sm text-text-secondary hover:text-white cursor-pointer transition-colors">
                      <input type="checkbox" className="rounded border-surface-3 bg-surface-2 text-primary focus:ring-primary/50 w-4 h-4" defaultChecked />
                      Agnostic API
                    </label>
                    <label className="flex items-center gap-3 text-sm text-text-secondary hover:text-white cursor-pointer transition-colors">
                      <input type="checkbox" className="rounded border-surface-3 bg-surface-2 text-primary focus:ring-primary/50 w-4 h-4" />
                      Athenahealth
                    </label>
                    <label className="flex items-center gap-3 text-sm text-text-secondary hover:text-white cursor-pointer transition-colors">
                      <input type="checkbox" className="rounded border-surface-3 bg-surface-2 text-primary focus:ring-primary/50 w-4 h-4" />
                      Epic / Cerner
                    </label>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Deployment</h4>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 text-sm text-text-secondary hover:text-white cursor-pointer transition-colors">
                      <input type="checkbox" className="rounded border-surface-3 bg-surface-2 text-primary focus:ring-primary/50 w-4 h-4" defaultChecked />
                      Cloud / SaaS
                    </label>
                    <label className="flex items-center gap-3 text-sm text-text-secondary hover:text-white cursor-pointer transition-colors">
                      <input type="checkbox" className="rounded border-surface-3 bg-surface-2 text-primary focus:ring-primary/50 w-4 h-4" />
                      Mobile App Included
                    </label>
                  </div>
                </div>
              </div>
            </Card>

            {/* AI Tech Stack Advisor Hook */}
            <Card className="p-6 bg-gradient-to-br from-surface-1 to-surface-2 border-surface-3 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-[24px]" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-mono uppercase tracking-wider mb-4">
                  <Zap className="w-3 h-3" /> Tech Stack AI
                </div>
                <h4 className="text-white font-bold mb-2">Stack Optimization</h4>
                <p className="text-sm text-text-secondary mb-4 leading-relaxed">
                  Let our AI analyze your current clinic workflows and EMR to recommend the highest ROI software integrations.
                </p>
                <Button className="w-full bg-surface-3 hover:bg-surface-3/80 text-white text-sm">
                  Run Stack Analysis
                </Button>
              </div>
            </Card>
          </div>

          {/* Software Grid & Search */}
          <div className="flex-grow space-y-6">
            <div className="relative w-full group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
              <div className="relative flex items-center bg-surface-1/80 backdrop-blur-xl border border-surface-3 rounded-xl p-1">
                <Search className="w-5 h-5 text-text-secondary ml-4" />
                <input 
                  type="text" 
                  placeholder="Search software, integrations, or capabilities..." 
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
                    <Card className="p-0 bg-surface-1/80 backdrop-blur-sm border-surface-3 flex flex-col h-full overflow-hidden hover:border-primary/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)] transition-all duration-300 group">
                      <div className="h-48 bg-surface-2 relative overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                        <div className="absolute top-3 left-3 bg-background/80 backdrop-blur-md border border-surface-3 px-2 py-1 rounded-md flex items-center gap-1 text-xs font-medium text-white">
                          <Lock className="w-3 h-3 text-primary" /> {item.compliance}
                        </div>
                      </div>
                      <div className="p-6 flex-grow flex flex-col">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-xs font-mono text-text-secondary uppercase tracking-wider">{item.vendor}</div>
                          <span className="text-xs font-medium bg-surface-2 text-text-secondary px-2 py-1 rounded-md border border-surface-3">
                            {item.category}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors mb-2 leading-tight">{item.name}</h3>
                        <p className="text-sm text-text-secondary mb-6 flex-grow leading-relaxed">{item.description}</p>
                        
                        <div className="flex flex-col gap-3 mt-auto pt-4 border-t border-surface-3/50">
                          <div className="flex justify-between items-center">
                            <span className="font-mono font-medium text-white text-lg">{item.price}</span>
                            <span className="flex items-center gap-1 text-sm font-medium text-success bg-success/10 px-2 py-1 rounded-md">
                              ★ {item.rating}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <div className="flex flex-col bg-surface-2/50 p-2 rounded-lg border border-surface-3">
                              <span className="text-[10px] text-text-secondary uppercase tracking-wider mb-1 flex items-center gap-1"><Database className="w-3 h-3" /> Integrates</span>
                              <span className="text-sm font-bold text-white truncate" title={item.compatibility}>{item.compatibility}</span>
                            </div>
                            <div className="flex flex-col bg-surface-2/50 p-2 rounded-lg border border-surface-3">
                              <span className="text-[10px] text-text-secondary uppercase tracking-wider mb-1 flex items-center gap-1"><Clock className="w-3 h-3" /> Impl. Time</span>
                              <span className="text-sm font-bold text-white">{item.implementation}</span>
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
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/5 rounded-full blur-[64px]" />
                <div className="relative z-10 max-w-lg mx-auto">
                  <div className="w-20 h-20 rounded-2xl bg-surface-2 border border-surface-3 flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <Cloud className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white mb-4">Digital Ecosystem Expanding</h3>
                  <p className="text-text-secondary mb-8 leading-relaxed">
                    We are currently vetting enterprise-grade software partners to ensure they meet our strict standards for security, uptime, and clinical workflow integration.
                  </p>
                  
                  <div className="bg-surface-2/50 border border-surface-3 rounded-xl p-6 text-left mb-8">
                    <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success" /> Software Vetting Standards
                    </h4>
                    <ul className="space-y-2 text-sm text-text-secondary">
                      <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-primary" /> SOC2 Type II & HIPAA Compliance</li>
                      <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-primary" /> Proven EMR Interoperability (HL7/FHIR)</li>
                      <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-primary" /> 99.99% Uptime SLA Guarantee</li>
                      <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-primary" /> Seamless Clinical Workflow Integration</li>
                    </ul>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button className="bg-primary hover:bg-primary-hover text-background font-semibold">
                      Request Custom Integration
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
