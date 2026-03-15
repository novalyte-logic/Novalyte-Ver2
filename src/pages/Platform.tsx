import React from 'react';
import { motion } from 'motion/react';
import { Network, Activity, ShieldCheck, Database, ArrowRight, Zap, Users, Stethoscope, Building2, Cpu, CheckCircle2 } from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Link } from 'react-router-dom';

export function Platform() {
  return (
    <div className="min-h-screen bg-[#05070A] pt-24 pb-16 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-primary/5 to-transparent blur-3xl rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-6 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <Network className="w-4 h-4" /> The Novalyte Architecture
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 tracking-tight">
              One Intelligence Layer.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Four Ecosystems.
              </span>
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed mb-10 max-w-3xl mx-auto">
              Novalyte AI is not a single application. It is a unified operating system that connects patients, clinics, vendors, and practitioners through a shared intelligence layer.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/clinics">
                <Button variant="primary" className="w-full sm:w-auto px-8 py-4 text-lg font-bold">
                  Explore Clinic OS
                </Button>
              </Link>
              <Link to="/patient">
                <Button variant="outline" className="w-full sm:w-auto px-8 py-4 text-lg font-bold border-surface-3 hover:border-white hover:text-white">
                  Explore Patient OS
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Architecture Diagram */}
        <div className="mb-32 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent blur-3xl" />
          
          <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Left Side: Inputs */}
            <div className="space-y-6">
              <Card className="bg-[#0B0F14] border-surface-3 p-6 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-surface-2 border border-surface-3 flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Patient OS</h3>
                    <p className="text-sm text-text-secondary">Intake, triage, and routing</p>
                  </div>
                </div>
              </Card>
              
              <Card className="bg-[#0B0F14] border-surface-3 p-6 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-surface-2 border border-surface-3 flex items-center justify-center">
                    <Stethoscope className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Workforce OS</h3>
                    <p className="text-sm text-text-secondary">Talent matching and deployment</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Center: Intelligence Core */}
            <div className="relative flex justify-center py-12 lg:py-0">
              {/* Connecting Lines (Desktop) */}
              <div className="hidden lg:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-surface-3 via-primary to-surface-3 -translate-y-1/2" />
              <div className="hidden lg:block absolute left-1/2 top-0 w-px h-full bg-gradient-to-b from-surface-3 via-primary to-surface-3 -translate-x-1/2" />
              
              <motion.div 
                className="relative z-10"
                animate={{ 
                  boxShadow: ['0 0 40px rgba(6,182,212,0.2)', '0 0 80px rgba(6,182,212,0.4)', '0 0 40px rgba(6,182,212,0.2)'] 
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="w-48 h-48 rounded-full bg-[#0B0F14] border border-primary/30 flex flex-col items-center justify-center p-6 text-center shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
                  <Cpu className="w-12 h-12 text-primary mb-3" />
                  <h3 className="font-display font-bold text-white text-lg leading-tight">Novalyte<br/>Intelligence</h3>
                </div>
              </motion.div>
            </div>

            {/* Right Side: Outputs */}
            <div className="space-y-6">
              <Card className="bg-[#0B0F14] border-surface-3 p-6 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-l from-[#2EE6A6]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-surface-2 border border-surface-3 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-[#2EE6A6]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Clinic OS</h3>
                    <p className="text-sm text-text-secondary">Pipeline, revenue, and operations</p>
                  </div>
                </div>
              </Card>
              
              <Card className="bg-[#0B0F14] border-surface-3 p-6 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-l from-[#FFB84D]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-surface-2 border border-surface-3 flex items-center justify-center">
                    <Database className="w-6 h-6 text-[#FFB84D]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Vendor OS</h3>
                    <p className="text-sm text-text-secondary">Marketplace and distribution</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Deep Dive Sections */}
        <div className="space-y-32">
          
          {/* 1. Patient Pipeline */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Activity className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-3xl font-display font-bold text-white mb-6">The Patient Pipeline</h2>
              <p className="text-lg text-text-secondary leading-relaxed mb-6">
                We don't just generate leads; we qualify intent. The Patient OS uses adaptive clinical assessments to evaluate medical fit, financial readiness, and urgency before routing a patient to a clinic.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-text-secondary">Dynamic symptom and diagnostic triage</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-text-secondary">Financial qualification and LTV estimation</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-text-secondary">Automated routing to the highest-converting clinic</span>
                </li>
              </ul>
              <Link to="/patient" className="inline-flex items-center text-primary font-bold hover:text-primary-hover transition-colors">
                Explore Patient Acquisition <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent blur-2xl rounded-3xl" />
              <Card className="bg-[#0B0F14] border-surface-3 p-8 relative z-10">
                <div className="space-y-4">
                  <div className="h-2 w-1/3 bg-surface-3 rounded-full mb-8" />
                  <div className="p-4 rounded-lg bg-surface-2 border border-surface-3 flex justify-between items-center">
                    <span className="text-sm font-medium text-white">Clinical Score</span>
                    <span className="text-sm font-bold text-success">92/100</span>
                  </div>
                  <div className="p-4 rounded-lg bg-surface-2 border border-surface-3 flex justify-between items-center">
                    <span className="text-sm font-medium text-white">Financial Readiness</span>
                    <span className="text-sm font-bold text-success">High Intent</span>
                  </div>
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 flex justify-between items-center">
                    <span className="text-sm font-medium text-primary">Routing Decision</span>
                    <span className="text-sm font-bold text-primary">Match: Clinic A</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* 2. Clinic Operations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#2EE6A6]/20 to-transparent blur-2xl rounded-3xl" />
              <Card className="bg-[#0B0F14] border-surface-3 p-8 relative z-10">
                <div className="space-y-4">
                  <div className="flex gap-2 mb-6">
                    <div className="w-3 h-3 rounded-full bg-danger" />
                    <div className="w-3 h-3 rounded-full bg-warning" />
                    <div className="w-3 h-3 rounded-full bg-success" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-4 rounded-lg bg-surface-2 border border-surface-3">
                      <div className="text-xs text-text-secondary mb-1">Active Pipeline</div>
                      <div className="text-xl font-bold text-white">$142,500</div>
                    </div>
                    <div className="p-4 rounded-lg bg-surface-2 border border-surface-3">
                      <div className="text-xs text-text-secondary mb-1">Show Rate</div>
                      <div className="text-xl font-bold text-[#2EE6A6]">84%</div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-[#2EE6A6]/10 border border-[#2EE6A6]/20">
                    <div className="text-sm font-medium text-[#2EE6A6] mb-2">AI Insight</div>
                    <div className="text-xs text-[#2EE6A6]/80">Follow up with 3 leads in "Triage" stage to recover $12k in potential revenue.</div>
                  </div>
                </div>
              </Card>
            </div>
            <div className="order-1 lg:order-2">
              <div className="w-12 h-12 rounded-xl bg-[#2EE6A6]/10 flex items-center justify-center mb-6">
                <Building2 className="w-6 h-6 text-[#2EE6A6]" />
              </div>
              <h2 className="text-3xl font-display font-bold text-white mb-6">Clinic Operating System</h2>
              <p className="text-lg text-text-secondary leading-relaxed mb-6">
                Clinics receive fully qualified patients directly into a purpose-built CRM. The Clinic OS provides total visibility into pipeline velocity, revenue recovery, and operational bottlenecks.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#2EE6A6] shrink-0 mt-0.5" />
                  <span className="text-text-secondary">Real-time patient pipeline management</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#2EE6A6] shrink-0 mt-0.5" />
                  <span className="text-text-secondary">Predictive revenue and show-rate analytics</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#2EE6A6] shrink-0 mt-0.5" />
                  <span className="text-text-secondary">Direct access to the equipment and staffing marketplace</span>
                </li>
              </ul>
              <Link to="/clinics" className="inline-flex items-center text-[#2EE6A6] font-bold hover:text-[#2EE6A6]/80 transition-colors">
                Explore Clinic OS <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>

          {/* 3. Marketplace & Infrastructure */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-6">
                <Network className="w-6 h-6 text-secondary" />
              </div>
              <h2 className="text-3xl font-display font-bold text-white mb-6">Marketplace & Infrastructure</h2>
              <p className="text-lg text-text-secondary leading-relaxed mb-6">
                The platform acts as a central exchange. Clinics procure equipment and hire specialized talent, while vendors gain direct distribution to pre-vetted, high-volume medical practices.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <span className="text-text-secondary">Capital equipment procurement with ROI calculators</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <span className="text-text-secondary">Algorithmic matching for specialized medical talent</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <span className="text-text-secondary">Direct API integrations for diagnostic and pharmacy partners</span>
                </li>
              </ul>
              <Link to="/marketplace" className="inline-flex items-center text-secondary font-bold hover:text-secondary/80 transition-colors">
                Explore the Marketplace <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-secondary/20 to-transparent blur-2xl rounded-3xl" />
              <Card className="bg-[#0B0F14] border-surface-3 p-8 relative z-10">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-surface-2 border border-surface-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-surface-3 flex items-center justify-center">
                        <Zap className="w-4 h-4 text-text-secondary" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">Shockwave Therapy Device</div>
                        <div className="text-xs text-text-secondary">Capital Equipment</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-white">Est. ROI: 3.2mo</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-surface-2 border border-surface-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-surface-3 flex items-center justify-center">
                        <Stethoscope className="w-4 h-4 text-text-secondary" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">TRT Specialist (NP)</div>
                        <div className="text-xs text-text-secondary">Workforce Match</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-success">98% Match</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

        </div>

        {/* Final CTA */}
        <div className="mt-32 text-center">
          <Card className="bg-gradient-to-br from-[#0B0F14] to-surface-1 border-surface-3 p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
            <div className="relative z-10 max-w-2xl mx-auto">
              <ShieldCheck className="w-12 h-12 text-primary mx-auto mb-6" />
              <h2 className="text-3xl font-display font-bold text-white mb-4">Ready to integrate?</h2>
              <p className="text-lg text-text-secondary mb-8">
                Whether you are a patient seeking optimization, a clinic looking to scale, or a vendor seeking distribution, Novalyte is your infrastructure.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/clinics/apply">
                  <Button variant="primary" className="w-full sm:w-auto px-8 py-4">
                    Apply as a Clinic
                  </Button>
                </Link>
                <Link to="/vendors/apply">
                  <Button variant="outline" className="w-full sm:w-auto px-8 py-4 border-surface-3 hover:border-white hover:text-white">
                    Apply as a Vendor
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
