import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { 
  Briefcase, Users, Activity, ArrowRight, CheckCircle2, 
  Zap, Shield, Clock, MapPin, Star, ChevronRight,
  Stethoscope, Building2, Network
} from 'lucide-react';

// Mock live activity data
const LIVE_ACTIVITIES = [
  { id: 1, type: 'match', text: 'TRT Specialist matched with clinic in Austin, TX', time: '2m ago' },
  { id: 2, type: 'request', text: 'Urgent: NP needed for telehealth consults (FL)', time: '5m ago' },
  { id: 3, type: 'onboard', text: 'New Medical Director verified in Chicago, IL', time: '12m ago' },
  { id: 4, type: 'match', text: 'Peptide Specialist placed in Scottsdale, AZ', time: '18m ago' },
  { id: 5, type: 'request', text: 'IV Therapy RN requested in Los Angeles, CA', time: '22m ago' },
];

export function Workforce() {
  const [role, setRole] = useState<'talent' | 'clinic'>('talent');
  const [activityIndex, setActivityIndex] = useState(0);

  // Rotate live activities
  useEffect(() => {
    const interval = setInterval(() => {
      setActivityIndex((prev) => (prev + 1) % LIVE_ACTIVITIES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#05070A] selection:bg-secondary/30 selection:text-secondary-content">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-[800px] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 transition-colors duration-700 ${role === 'talent' ? 'bg-gradient-to-b from-secondary/30 via-secondary/5' : 'bg-gradient-to-b from-primary/30 via-primary/5'} to-transparent blur-3xl rounded-full`} />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Role Toggle */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex items-center p-1 rounded-xl bg-surface-2 border border-surface-3">
              <button
                onClick={() => setRole('talent')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  role === 'talent' 
                    ? 'bg-secondary text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]' 
                    : 'text-text-secondary hover:text-white'
                }`}
              >
                <Stethoscope className="w-4 h-4" />
                I'm Healthcare Talent
              </button>
              <button
                onClick={() => setRole('clinic')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  role === 'clinic' 
                    ? 'bg-primary text-black shadow-[0_0_15px_rgba(6,182,212,0.3)]' 
                    : 'text-text-secondary hover:text-white'
                }`}
              >
                <Building2 className="w-4 h-4" />
                I'm a Clinic Operator
              </button>
            </div>
          </div>

          {/* Dynamic Hero Content */}
          <div className="text-center max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={role}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-2 border border-surface-3 text-xs font-bold uppercase tracking-wider mb-6 ${role === 'talent' ? 'text-secondary' : 'text-primary'}`}>
                  <Network className="w-4 h-4" />
                  Live Staffing Exchange
                </div>
                
                <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 tracking-tight leading-tight">
                  {role === 'talent' ? (
                    <>The Intelligent Network for <span className="text-secondary text-glow-secondary">Clinical Talent.</span></>
                  ) : (
                    <>Scale Your Clinical Team <span className="text-primary text-glow-primary">On Demand.</span></>
                  )}
                </h1>
                
                <p className="text-xl text-text-secondary mb-10 leading-relaxed max-w-2xl mx-auto">
                  {role === 'talent' 
                    ? "Bypass the traditional job board. Our AI matches your specific credentials, specialty, and availability directly with high-growth clinics seeking your exact profile."
                    : "Stop waiting weeks for recruiters. Our algorithmic exchange matches your patient volume and protocol needs with verified, ready-to-deploy practitioners instantly."}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  {role === 'talent' ? (
                    <>
                      <Link to="/workforce/jobs" className="w-full sm:w-auto">
                        <Button variant="secondary" size="lg" className="w-full group text-base px-8 h-14">
                          Browse Opportunities
                          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                      <Link to="/workforce/profile" className="w-full sm:w-auto">
                        <Button variant="outline" size="lg" className="w-full text-base px-8 h-14 border-surface-3 hover:bg-surface-2">
                          Create Talent Profile
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/auth/register-clinic" className="w-full sm:w-auto">
                        <Button variant="primary" size="lg" className="w-full group text-base px-8 h-14">
                          Request Staffing
                          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                      <Link to="/clinics" className="w-full sm:w-auto">
                        <Button variant="outline" size="lg" className="w-full text-base px-8 h-14 border-surface-3 hover:bg-surface-2">
                          Explore Clinic OS
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Live Activity Ticker */}
          <div className="mt-20 max-w-2xl mx-auto">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface-1/50 border border-surface-3 backdrop-blur-md">
              <div className="flex items-center gap-2 shrink-0">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
                </div>
                <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Live Network</span>
              </div>
              <div className="h-6 w-px bg-surface-3 shrink-0" />
              <div className="flex-1 overflow-hidden relative h-6">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={activityIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 flex items-center justify-between"
                  >
                    <span className="text-sm text-white truncate pr-4">{LIVE_ACTIVITIES[activityIndex].text}</span>
                    <span className="text-xs text-text-secondary shrink-0">{LIVE_ACTIVITIES[activityIndex].time}</span>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Trust & Stats */}
      <section className="py-12 border-y border-surface-3 bg-[#0B0F14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-surface-3">
            <div className="text-center px-4">
              <div className="text-3xl font-display font-bold text-white mb-1">2,400+</div>
              <div className="text-sm text-text-secondary font-medium">Verified Practitioners</div>
            </div>
            <div className="text-center px-4">
              <div className="text-3xl font-display font-bold text-white mb-1">850+</div>
              <div className="text-sm text-text-secondary font-medium">Active Clinics</div>
            </div>
            <div className="text-center px-4">
              <div className="text-3xl font-display font-bold text-white mb-1">&lt; 48h</div>
              <div className="text-sm text-text-secondary font-medium">Average Match Time</div>
            </div>
            <div className="text-center px-4">
              <div className="text-3xl font-display font-bold text-white mb-1">98%</div>
              <div className="text-sm text-text-secondary font-medium">Placement Success</div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Matching Explanation */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
              Algorithmic Precision. <br />
              <span className="text-text-secondary">Zero Recruiting Friction.</span>
            </h2>
            <p className="text-lg text-text-secondary">
              We replaced the traditional recruiting agency with a deterministic matching engine that evaluates clinical protocols, licensing, availability, and compensation in real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-surface-1 border-surface-3 p-8 hover:border-secondary/30 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Automated Credentialing</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                NPI verification, state license checking, and DEA registration validation happen instantly before any match is made.
              </p>
            </Card>

            <Card className="bg-surface-1 border-surface-3 p-8 hover:border-primary/30 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Protocol Matching</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Our engine matches practitioners based on specific clinical experience (e.g., TRT, Peptides, IV Therapy) to ensure immediate operational readiness.
              </p>
            </Card>

            <Card className="bg-surface-1 border-surface-3 p-8 hover:border-white/30 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-surface-2 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Dynamic Deployment</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Whether you need a Medical Director for compliance oversight or a full-time NP to handle patient volume, matches happen in hours, not weeks.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Dual Pathways */}
      <section className="py-24 bg-[#0B0F14] border-t border-surface-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Talent Pathway */}
            <div className="relative rounded-3xl overflow-hidden border border-surface-3 bg-surface-1 p-10 group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-secondary/20 transition-colors" />
              
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mb-8">
                  <Stethoscope className="w-7 h-7 text-secondary" />
                </div>
                
                <h3 className="text-3xl font-display font-bold text-white mb-4">For Practitioners</h3>
                <p className="text-text-secondary mb-8 text-lg">
                  Take control of your clinical career. Set your rates, define your availability, and let high-growth clinics compete for your expertise.
                </p>
                
                <ul className="space-y-4 mb-10">
                  <li className="flex items-center gap-3 text-white">
                    <CheckCircle2 className="w-5 h-5 text-secondary" />
                    <span>Telehealth & In-person opportunities</span>
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <CheckCircle2 className="w-5 h-5 text-secondary" />
                    <span>Transparent compensation upfront</span>
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <CheckCircle2 className="w-5 h-5 text-secondary" />
                    <span>Medical Director & Prescribing roles</span>
                  </li>
                </ul>
                
                <Link to="/workforce/profile">
                  <Button variant="secondary" className="w-full sm:w-auto">
                    Create Talent Profile <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Clinic Pathway */}
            <div className="relative rounded-3xl overflow-hidden border border-surface-3 bg-surface-1 p-10 group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-colors" />
              
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-8">
                  <Building2 className="w-7 h-7 text-primary" />
                </div>
                
                <h3 className="text-3xl font-display font-bold text-white mb-4">For Clinics</h3>
                <p className="text-text-secondary mb-8 text-lg">
                  Never let staffing bottleneck your growth. Access a vetted pool of specialized practitioners ready to deploy into your protocols.
                </p>
                
                <ul className="space-y-4 mb-10">
                  <li className="flex items-center gap-3 text-white">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span>Pre-verified credentials & licensing</span>
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span>Match by specific treatment protocols</span>
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span>Seamless integration with Clinic OS</span>
                  </li>
                </ul>
                
                <Link to="/auth/register-clinic">
                  <Button variant="primary" className="w-full sm:w-auto">
                    Request Staffing Access <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
