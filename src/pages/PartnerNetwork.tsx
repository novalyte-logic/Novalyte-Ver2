import React from 'react';
import { motion } from 'motion/react';
import { 
  Network, ShieldCheck, Zap, ArrowRight, Building2, 
  Box, Code2, CheckCircle2, Globe, Search, Filter, Activity
} from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Link } from 'react-router-dom';

export function PartnerNetwork() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [verifiedOnly, setVerifiedOnly] = React.useState(false);

  const categories = [
    { title: 'Clinical Equipment', icon: Box, count: 45, color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20', link: '/marketplace/equipment' },
    { title: 'Diagnostics & Labs', icon: Activity, count: 28, color: 'text-secondary', bg: 'bg-secondary/10', border: 'border-secondary/20', link: '/marketplace/diagnostics' },
    { title: 'Digital Health SaaS', icon: Code2, count: 52, color: 'text-success', bg: 'bg-success/10', border: 'border-success/20', link: '/marketplace/digital-health' },
    { title: 'Supplements', icon: ShieldCheck, count: 17, color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/20', link: '/marketplace/supplements' },
  ];

  const featuredPartners = [
    {
      name: "Apex Diagnostics",
      category: "Diagnostics & Labs",
      desc: "Next-generation hormone panels with direct API integration to the Novalyte CRM.",
      tags: ["HL7 Ready", "SOC 2", "API"],
      status: "Verified"
    },
    {
      name: "Titan Medical Systems",
      category: "Clinical Equipment",
      desc: "Acoustic wave therapy devices with pre-negotiated leasing rates for network clinics.",
      tags: ["Hardware", "Financing", "Training"],
      status: "Verified"
    },
    {
      name: "NeuroSync Health",
      category: "Digital Health SaaS",
      desc: "Cognitive assessment platform that feeds directly into the patient qualification engine.",
      tags: ["SaaS", "HIPAA", "API"],
      status: "Verified"
    }
  ];

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredCategories = categories.filter((category) =>
    !normalizedQuery || category.title.toLowerCase().includes(normalizedQuery),
  );
  const filteredPartners = featuredPartners.filter((partner) => {
    const matchesQuery =
      !normalizedQuery ||
      partner.name.toLowerCase().includes(normalizedQuery) ||
      partner.category.toLowerCase().includes(normalizedQuery) ||
      partner.desc.toLowerCase().includes(normalizedQuery) ||
      partner.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));

    const matchesVerification = !verifiedOnly || partner.status === 'Verified';
    return matchesQuery && matchesVerification;
  });

  return (
    <div className="min-h-screen bg-[#05070A] pt-24 pb-20 font-sans">
      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6"
          >
            <Network className="w-4 h-4" /> Verified Ecosystem
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-display font-bold text-white tracking-tight mb-6"
          >
            The Novalyte <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Partner Network</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-text-secondary mb-10"
          >
            A curated procurement ecosystem of clinical equipment, diagnostics, and digital health tools—pre-vetted for compliance, API readiness, and operational ROI.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/marketplace" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-black font-bold h-12 px-8 text-lg">
                Browse Catalog
              </Button>
            </Link>
            <Link to="/vendors/apply" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full border-surface-3 bg-surface-1 text-white hover:bg-surface-2 h-12 px-8 text-lg">
                Apply as Vendor
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Network Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Verified Partners', value: '142' },
            { label: 'API Integrations', value: '85+' },
            { label: 'Avg Procurement Savings', value: '18%' },
            { label: 'Compliance Audits', value: '100%' },
          ].map((stat, i) => (
            <div key={i} className="bg-surface-1/50 border border-surface-3 rounded-2xl p-6 text-center backdrop-blur-sm">
              <div className="text-3xl font-display font-bold text-white mb-1">{stat.value}</div>
              <div className="text-xs text-text-secondary uppercase tracking-wider font-bold">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Procurement Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">Procurement Categories</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input 
                type="text" 
                placeholder="Search network..." 
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="pl-9 pr-4 py-2 bg-surface-1 border border-surface-3 rounded-lg text-sm text-white focus:outline-none focus:border-primary/50 w-64"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className={`h-9 border-surface-3 bg-surface-1 text-white ${verifiedOnly ? 'border-primary/40 text-primary' : ''}`}
              onClick={() => setVerifiedOnly((current) => !current)}
            >
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCategories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <Link key={i} to={cat.link}>
                <Card className="bg-surface-1 border-surface-3 p-6 hover:border-surface-4 transition-all group cursor-pointer h-full flex flex-col">
                  <div className={`w-12 h-12 rounded-xl ${cat.bg} ${cat.border} border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${cat.color}`} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">{cat.title}</h3>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-sm text-text-secondary font-mono">{cat.count} Partners</span>
                    <ArrowRight className="w-4 h-4 text-text-secondary group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </Card>
              </Link>
            );
          })}
          {!filteredCategories.length ? (
            <div className="md:col-span-2 lg:col-span-4 rounded-2xl border border-dashed border-surface-3 bg-surface-1/30 p-8 text-center text-text-secondary">
              No procurement categories matched that search.
            </div>
          ) : null}
        </div>
      </div>

      {/* Featured Partners */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <h2 className="text-2xl font-bold text-white mb-8">Featured Ecosystem Partners</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredPartners.map((partner, i) => (
            <Card key={i} className="bg-surface-1 border-surface-3 p-6 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-surface-2 rounded-lg border border-surface-3 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-text-secondary" />
                </div>
                <span className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-success/10 text-success border border-success/20">
                  <CheckCircle2 className="w-3 h-3" /> {partner.status}
                </span>
              </div>
              <div className="text-xs text-primary font-bold uppercase tracking-wider mb-1">{partner.category}</div>
              <h3 className="text-xl font-bold text-white mb-2">{partner.name}</h3>
              <p className="text-sm text-text-secondary mb-6 flex-grow">{partner.desc}</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {partner.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-surface-2 border border-surface-3 rounded text-xs text-text-secondary font-mono">
                    {tag}
                  </span>
                ))}
              </div>
              
              <Link to={`/contact?role=vendor&topic=partner_profile&product=${encodeURIComponent(partner.name)}`}>
                <Button variant="outline" className="w-full border-surface-3 bg-[#0B0F14] text-white hover:bg-surface-2">
                  View Profile
                </Button>
              </Link>
            </Card>
          ))}
          {!filteredPartners.length ? (
            <div className="md:col-span-3 rounded-2xl border border-dashed border-surface-3 bg-surface-1/30 p-8 text-center text-text-secondary">
              No featured partners matched your current search.
            </div>
          ) : null}
        </div>
      </div>

      {/* Why Join */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-surface-1 to-[#0B0F14] border border-surface-3 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-display font-bold text-white mb-4">Become a Network Partner</h2>
              <p className="text-text-secondary text-lg mb-8">
                Get your product or service in front of hundreds of high-growth men's health clinics. We integrate approved vendors directly into the clinic operating system.
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  "Direct distribution to verified clinics",
                  "API integration into the Novalyte CRM",
                  "Co-marketing and procurement placement",
                  "Automated lead routing for your services"
                ].map((benefit, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-white">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <Link to="/vendors/apply">
                <Button className="bg-white text-black hover:bg-gray-200 font-bold h-12 px-8">
                  Start Application <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-2xl blur-xl" />
              <div className="relative bg-[#05070A] border border-surface-3 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-surface-3">
                  <Globe className="w-6 h-6 text-text-secondary" />
                  <div className="text-sm font-mono text-text-secondary">API Integration Status</div>
                </div>
                <div className="space-y-4 font-mono text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary">Endpoint:</span>
                    <span className="text-success">/api/v1/vendors/sync</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary">Status:</span>
                    <span className="text-white">Active</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary">Last Sync:</span>
                    <span className="text-white">2 mins ago</span>
                  </div>
                  <div className="p-4 bg-surface-2 rounded-lg mt-4 border border-surface-3 text-text-secondary">
                    <span className="text-primary">POST</span> /vendors/apply<br/>
                    {`{`}<br/>
                    &nbsp;&nbsp;"company": "...",<br/>
                    &nbsp;&nbsp;"category": "...",<br/>
                    &nbsp;&nbsp;"api_ready": true<br/>
                    {`}`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
