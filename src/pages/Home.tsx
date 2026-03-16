import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Activity, Shield, Zap, Users, ArrowRight, Stethoscope, Briefcase, ShoppingCart, Database, Lock, Server, CheckCircle2 } from 'lucide-react';

const MODALITIES = [
  'trt', 'bpc-157', 'glp-1', 'gainswave', 'nad+', 'kyzatrex', 'vo2 max', 'exosomes', 'dexa scan', 'hrv', 'prp', 'cellular regeneration'
];

export function Home() {
  return (
    <div className="flex flex-col bg-background min-h-screen">
      {/* Cinematic Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Deep layered background */}
        <div className="absolute inset-0 bg-[#05070A]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(53,212,255,0.12),_transparent_40%),radial-gradient(circle_at_80%_20%,_rgba(139,92,246,0.12),_transparent_35%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]" />
        
        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] opacity-40 mix-blend-screen animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[150px] opacity-30 mix-blend-screen" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-2/80 backdrop-blur-md border border-primary/20 mb-8 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-mono text-primary tracking-[0.3em]">Clinical Optimization Infrastructure</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6 text-white leading-[1.1]">
              The Operating System for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary">Peak Human Optimization.</span>
            </h1>
            
            <p className="text-xl text-text-secondary mb-10 leading-relaxed max-w-4xl mx-auto">
              Connecting patients, elite clinics, and breakthrough treatments, from advanced TRT and Peptide Therapy to Metabolic Health and Cellular Regeneration.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/patient" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto group px-10 py-7 text-lg bg-primary hover:bg-primary-hover text-background font-bold shadow-[0_0_40px_rgba(6,182,212,0.25)] transition-all">
                  For Patients
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/clinics" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto px-10 py-7 text-lg border-surface-3 hover:bg-surface-2 text-white font-bold backdrop-blur-sm">
                  For Clinics
                </Button>
              </Link>
            </div>

            <div className="mt-8 flex items-center justify-center gap-4">
              <Link to="/platform">
                <Button variant="ghost" size="sm" className="text-xs tracking-[0.3em] text-text-secondary hover:text-primary transition-all uppercase border border-surface-3/30 hover:border-primary/30 px-6 py-4 rounded-full bg-surface-2/30">
                  Explore the platform
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Treatment Ticker */}
      <div className="relative py-6 bg-[#05070A] border-y border-surface-3/30 overflow-hidden whitespace-nowrap">
        <div className="flex animate-marquee hover:pause gap-12 items-center">
          {[...MODALITIES, ...MODALITIES].map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="text-sm font-mono font-bold tracking-[0.3em] text-text-secondary/50">{item}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary/30" />
            </div>
          ))}
        </div>
      </div>

      {/* Platform Pillars */}
      <section className="py-20 bg-[#05070A] relative border-b border-surface-3/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-8 group-hover:bg-primary/20 transition-all duration-500">
                <Stethoscope className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-4 text-white tracking-tight">Patient Portal</h3>
              <p className="text-text-secondary mb-8 leading-relaxed font-light">
                Secure, biometric-driven access to personalized protocols, progress tracking, and direct provider communication.
              </p>
              <ul className="space-y-3 mb-8">
                {['Biomarker Dashboard', 'Protocol Management', 'Secure Messaging'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-text-secondary">
                    <CheckCircle2 className="w-4 h-4 text-primary" /> {item}
                  </li>
                ))}
              </ul>
              <Link to="/patient" className="text-primary hover:text-primary-hover font-bold inline-flex items-center text-xs tracking-widest">
                Access Portal <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="group"
            >
              <div className="w-16 h-16 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center mb-8 group-hover:bg-secondary/20 transition-all duration-500">
                <Activity className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-4 text-white tracking-tight">Clinic Management</h3>
              <p className="text-text-secondary mb-8 leading-relaxed font-light">
                Clinical-grade infrastructure to automate triage, manage high-performance pipelines, and orchestrate patient care.
              </p>
              <ul className="space-y-3 mb-8">
                {['AI Triage Engine', 'Revenue Orchestration', 'HIPAA Compliance'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-text-secondary">
                    <CheckCircle2 className="w-4 h-4 text-secondary" /> {item}
                  </li>
                ))}
              </ul>
              <Link to="/clinics" className="text-secondary hover:text-secondary-hover font-bold inline-flex items-center text-xs tracking-widest">
                Deploy Clinic OS <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="group"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-8 group-hover:bg-primary/20 transition-all duration-500">
                <ShoppingCart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-4 text-white tracking-tight">B2B Marketplace</h3>
              <p className="text-text-secondary mb-8 leading-relaxed font-light">
                A unified procurement layer for clinical equipment, high-performance diagnostics, and vetted health tech vendors.
              </p>
              <ul className="space-y-3 mb-8">
                {['Vetted Vendors', 'Inventory Control', 'Compliance Verification'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-text-secondary">
                    <CheckCircle2 className="w-4 h-4 text-primary" /> {item}
                  </li>
                ))}
              </ul>
              <Link to="/marketplace" className="text-primary hover:text-primary-hover font-bold inline-flex items-center text-xs tracking-widest">
                Browse Marketplace <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="group"
            >
              <div className="w-16 h-16 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center mb-8 group-hover:bg-secondary/20 transition-all duration-500">
                <Briefcase className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-4 text-white tracking-tight">Workforce</h3>
              <p className="text-text-secondary mb-8 leading-relaxed font-light">
                An elite network of medical practitioners and specialized workforce members optimized for men's health protocols.
              </p>
              <ul className="space-y-3 mb-8">
                {['Practitioner Network', 'Credentialing Layer', 'Dynamic Placement'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-text-secondary">
                    <CheckCircle2 className="w-4 h-4 text-secondary" /> {item}
                  </li>
                ))}
              </ul>
              <Link to="/workforce" className="text-secondary hover:text-secondary-hover font-bold inline-flex items-center text-xs tracking-widest">
                Explore Workforce <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Revenue & Infrastructure Messaging */}
      <section className="py-20 bg-[#101720] relative overflow-hidden">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent blur-[100px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Database className="w-4 h-4" /> Infrastructure as a Service
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-white leading-tight">
                Turn Intelligence into <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Recovered Revenue</span>
              </h2>
              <p className="text-xl text-text-secondary mb-8 font-light leading-relaxed">
                Stop losing patients to fragmented systems. Novalyte AI orchestrates the entire patient journey—from initial assessment to clinical routing and billing—ensuring zero drop-off and maximum LTV.
              </p>
              
              <div className="grid grid-cols-2 gap-8 mb-10">
                <div>
                  <div className="text-4xl font-display font-bold text-white mb-2">3.4x</div>
                  <div className="text-sm text-text-secondary tracking-wider">Increase in conversion</div>
                </div>
                <div>
                  <div className="text-4xl font-display font-bold text-white mb-2">85%</div>
                  <div className="text-sm text-text-secondary tracking-wider">Reduction in triage time</div>
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
                        <div className="text-xs text-text-secondary">System status: Optimal</div>
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
                      <span className="text-primary font-bold animate-pulse">Routing to clinic a...</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Security */}
      <section className="pt-20 pb-12 bg-[#05070A] relative overflow-hidden border-t border-surface-3/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 text-white">
              Enterprise-grade Security & Compliance
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
              <p className="text-text-secondary text-sm">Strict adherence to HIPAA security and privacy rules with executed BAAs for all clinic partners.</p>
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
