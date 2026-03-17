import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Activity, Shield, Zap, Users, ArrowRight, Stethoscope, Briefcase, ShoppingCart, Database, Lock, Server, CheckCircle2 } from 'lucide-react';

const HERO_MESSAGES = [
  "The Intelligence Layer for Modern Healthcare",
  "Orchestrating Patient Acquisition at Scale",
  "The Operating System for Men's Clinics",
  "Connecting Talent, Tech, and Treatment"
];

export function Home() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % HERO_MESSAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col bg-background min-h-screen">
      {/* Cinematic Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Deep layered background */}
        <div className="absolute inset-0 bg-[#05070A]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay" />
        
        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] opacity-60 mix-blend-screen animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-[150px] opacity-40 mix-blend-screen" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] opacity-30" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-2/80 backdrop-blur-md border border-surface-3 mb-8 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
              <span className="text-sm font-mono text-text-primary uppercase tracking-widest">Novalyte OS v2.0 Live</span>
            </div>
            
            <div className="h-[120px] md:h-[160px] flex items-center justify-center mb-6">
              <AnimatePresence mode="wait">
                <motion.h1
                  key={messageIndex}
                  initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="text-5xl md:text-7xl font-display font-bold tracking-tight leading-tight text-white"
                >
                  {HERO_MESSAGES[messageIndex].split(' ').map((word, i) => (
                    <span key={i} className={word.includes('Healthcare') || word.includes('Acquisition') || word.includes('Clinics') || word.includes('Treatment') ? 'text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary' : ''}>
                      {word}{' '}
                    </span>
                  ))}
                </motion.h1>
              </AnimatePresence>
            </div>
            
            <p className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto mb-12 leading-relaxed font-light">
              A unified operating system connecting patients, clinics, vendors, and practitioners. 
              Accelerate growth, automate triage, and orchestrate care with clinical-grade AI.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/clinics">
                <Button size="lg" className="w-full sm:w-auto group px-8 py-6 text-lg bg-primary hover:bg-primary-hover text-background shadow-[0_0_40px_rgba(6,182,212,0.3)] hover:shadow-[0_0_60px_rgba(6,182,212,0.5)] transition-all duration-300">
                  Deploy Clinic OS
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/patient">
                <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-6 text-lg border-surface-3 hover:bg-surface-2 text-text-primary backdrop-blur-sm">
                  Patient Assessment
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-xs font-mono uppercase tracking-widest text-text-secondary">Scroll to explore</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-text-secondary to-transparent" />
        </motion.div>
      </section>

      {/* Platform Pillars */}
      <section className="py-32 bg-[#0B0F14] relative border-y border-surface-3/50">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-white">One Platform. Four Ecosystems.</h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto font-light">
              Novalyte AI replaces fragmented tools with a single, intelligent infrastructure designed for scale and revenue recovery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card glow="cyan" className="flex flex-col h-full bg-surface-1/50 backdrop-blur-xl border-surface-3/50 hover:border-primary/50 transition-all duration-500 group p-8">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
                <Stethoscope className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">For Clinics</h3>
              <p className="text-text-secondary mb-8 flex-grow leading-relaxed">
                Automate patient acquisition, triage, and pipeline management with our Clinic OS. Recover lost revenue instantly.
              </p>
              <Link to="/clinics" className="text-primary hover:text-primary-hover font-semibold inline-flex items-center text-sm uppercase tracking-wider group-hover:gap-2 transition-all">
                Explore Clinic OS <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </Card>

            <Card glow="violet" className="flex flex-col h-full bg-surface-1/50 backdrop-blur-xl border-surface-3/50 hover:border-secondary/50 transition-all duration-500 group p-8">
              <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_30px_rgba(139,92,246,0.1)]">
                <Users className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">For Patients</h3>
              <p className="text-text-secondary mb-8 flex-grow leading-relaxed">
                Get intelligent medical guidance, private assessments, and direct routing to top-tier verified clinics.
              </p>
              <Link to="/patient" className="text-secondary hover:text-secondary-hover font-semibold inline-flex items-center text-sm uppercase tracking-wider group-hover:gap-2 transition-all">
                Start Assessment <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </Card>

            <Card glow="cyan" className="flex flex-col h-full bg-surface-1/50 backdrop-blur-xl border-surface-3/50 hover:border-primary/50 transition-all duration-500 group p-8">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
                <ShoppingCart className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Marketplace</h3>
              <p className="text-text-secondary mb-8 flex-grow leading-relaxed">
                Procure clinical equipment, diagnostics, and health tech with AI-driven ROI insights and direct vendor integration.
              </p>
              <Link to="/marketplace" className="text-primary hover:text-primary-hover font-semibold inline-flex items-center text-sm uppercase tracking-wider group-hover:gap-2 transition-all">
                Browse Catalog <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </Card>

            <Card glow="violet" className="flex flex-col h-full bg-surface-1/50 backdrop-blur-xl border-surface-3/50 hover:border-secondary/50 transition-all duration-500 group p-8">
              <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_30px_rgba(139,92,246,0.1)]">
                <Briefcase className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Workforce</h3>
              <p className="text-text-secondary mb-8 flex-grow leading-relaxed">
                An intelligent exchange matching certified healthcare talent with high-growth clinics based on real-time demand.
              </p>
              <Link to="/workforce" className="text-secondary hover:text-secondary-hover font-semibold inline-flex items-center text-sm uppercase tracking-wider group-hover:gap-2 transition-all">
                Find Opportunities <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Revenue & Infrastructure Messaging */}
      <section className="py-32 bg-[#101720] relative overflow-hidden">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent blur-[100px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Database className="w-4 h-4" /> Infrastructure as a Service
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-white leading-tight">
                Turn Intelligence Into <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Recovered Revenue</span>
              </h2>
              <p className="text-xl text-text-secondary mb-8 font-light leading-relaxed">
                Stop losing patients to fragmented systems. Novalyte AI orchestrates the entire patient journey—from initial assessment to clinical routing and billing—ensuring zero drop-off and maximum LTV.
              </p>
              
              <div className="grid grid-cols-2 gap-8 mb-10">
                <div>
                  <div className="text-4xl font-display font-bold text-white mb-2">3.4x</div>
                  <div className="text-sm text-text-secondary uppercase tracking-wider">Increase in conversion</div>
                </div>
                <div>
                  <div className="text-4xl font-display font-bold text-white mb-2">85%</div>
                  <div className="text-sm text-text-secondary uppercase tracking-wider">Reduction in triage time</div>
                </div>
              </div>
              
              <Link to="/clinics">
                <Button className="group bg-surface-2 hover:bg-surface-3 text-white border border-surface-3">
                  Calculate Your ROI <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            
            <div className="lg:w-1/2 w-full">
              <div className="relative">
                {/* Abstract Data Visualization */}
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-3xl blur-3xl opacity-50" />
                <Card className="relative bg-surface-1/80 backdrop-blur-xl border-surface-3 p-8 rounded-3xl shadow-2xl">
                  <div className="flex items-center justify-between mb-8 border-b border-surface-3 pb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <Activity className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-white font-semibold">Live Pipeline Orchestration</div>
                        <div className="text-xs text-text-secondary">System Status: Optimal</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-surface-3" />
                      <div className="w-3 h-3 rounded-full bg-surface-3" />
                      <div className="w-3 h-3 rounded-full bg-success" />
                    </div>
                  </div>
                  
                  <div className="space-y-4 font-mono text-sm">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-surface-2/50 border border-surface-3">
                      <span className="text-text-secondary">Patient Assessment</span>
                      <span className="text-success flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> Complete</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-surface-2/50 border border-surface-3">
                      <span className="text-text-secondary">Clinical Fit Score</span>
                      <span className="text-primary font-bold">94% Match</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-surface-2/50 border border-surface-3">
                      <span className="text-text-secondary">Financial Qualification</span>
                      <span className="text-success flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> Verified</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-primary/10 border border-primary/30">
                      <span className="text-white">Routing Decision</span>
                      <span className="text-primary font-bold animate-pulse">Routing to Clinic A...</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Security */}
      <section className="py-32 bg-[#05070A] relative overflow-hidden border-t border-surface-3/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 text-white">
              Enterprise-Grade Security & Compliance
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto font-light">
              Built from the ground up for healthcare. Novalyte AI ensures your data, patient records, and communications are protected by state-of-the-art encryption.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-surface-1/30 border-surface-3/50 p-8 text-center hover:bg-surface-1/50 transition-colors">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">HIPAA Aligned</h3>
              <p className="text-text-secondary text-sm">Strict adherence to HIPAA Security and Privacy Rules with executed BAAs for all clinic partners.</p>
            </Card>

            <Card className="bg-surface-1/30 border-surface-3/50 p-8 text-center hover:bg-surface-1/50 transition-colors">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">E2E Encryption</h3>
              <p className="text-text-secondary text-sm">All data is encrypted at rest (AES-256) and in transit (TLS 1.3) using enterprise key management.</p>
            </Card>

            <Card className="bg-surface-1/30 border-surface-3/50 p-8 text-center hover:bg-surface-1/50 transition-colors">
              <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-6">
                <Server className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">SOC 2 Ready</h3>
              <p className="text-text-secondary text-sm">Infrastructure designed to meet SOC 2 Type II compliance with continuous monitoring and audit logging.</p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
