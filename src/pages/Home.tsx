import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Activity, Shield, Zap, Users, ArrowRight, Stethoscope, Briefcase, ShoppingCart, Database, Lock, Server, CheckCircle2, ChevronRight } from 'lucide-react';

const TREATMENTS = [
  'TRT', 'BPC-157', 'GLP-1', 'GAINSWave', 'NAD+', 'Kyzatrex', 
  'VO2 Max', 'Exosomes', 'Dexa Scan', 'HRV', 'PRP', 'Cellular Regeneration'
];

export function Home() {
  return (
    <div className="flex flex-col bg-background min-h-screen text-white font-sans">
      {/* Cinematic Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-20">
        {/* Deep layered background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-500/20 via-background to-background" />
        
        {/* Abstract Data Grid Motif */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
        
        {/* Glowing Orbs - Cyan & Deep Blue */}
        <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] opacity-50 mix-blend-screen pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex-grow flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-2/80 backdrop-blur-md border border-surface-3 mb-8 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
              <span className="text-sm font-mono text-cyan-400 uppercase tracking-widest">Precision Medicine Infrastructure</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6 text-white leading-[1.1]">
              The Operating System for <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Peak Human Optimization.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-400 max-w-4xl mx-auto mb-12 leading-relaxed font-light">
              Connecting patients, elite clinics, and breakthrough treatments, from advanced TRT and Peptide Therapy to Metabolic Health and Cellular Regeneration.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/patient">
                <Button size="lg" className="w-full sm:w-auto group px-10 py-7 text-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold shadow-[0_0_40px_rgba(6,182,212,0.3)] hover:shadow-[0_0_60px_rgba(6,182,212,0.5)] transition-all duration-300">
                  For Patients
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/clinics">
                <Button variant="outline" size="lg" className="w-full sm:w-auto px-10 py-7 text-lg border-surface-3 hover:bg-surface-2 text-white backdrop-blur-sm font-semibold">
                  For Clinics
                </Button>
              </Link>
            </div>
            
            <div className="mt-8">
              <Link to="#platform" className="text-slate-400 hover:text-cyan-400 font-mono text-sm uppercase tracking-widest transition-colors inline-flex items-center gap-2">
                Explore the Platform <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Treatment Ticker */}
        <div className="relative z-20 w-full border-y border-surface-3/50 bg-background/80 backdrop-blur-md py-4 mt-auto overflow-hidden">
          <div className="flex whitespace-nowrap animate-marquee">
            {[...TREATMENTS, ...TREATMENTS, ...TREATMENTS].map((treatment, i) => (
              <div key={i} className="flex items-center mx-6">
                <span className="text-slate-400 font-mono text-sm uppercase tracking-wider">{treatment}</span>
                <span className="mx-6 text-cyan-500/50">•</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Overview */}
      <section id="platform" className="py-32 bg-[#0B0F14] relative border-b border-surface-3/50">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-white">One Platform. Four Ecosystems.</h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto font-light">
              Novalyte AI replaces fragmented tools with a single, intelligent infrastructure designed for clinical precision, scale, and operational leverage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Patient Portal */}
            <Card glow="cyan" className="flex flex-col h-full bg-surface-1/50 backdrop-blur-xl border-surface-3/50 hover:border-cyan-500/50 transition-all duration-500 group p-8">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
                <Users className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">Patient Portal</h3>
              <p className="text-slate-400 mb-6 text-sm leading-relaxed">
                Private, biomarker-driven assessments and direct routing to top-tier verified clinics for precision protocols.
              </p>
              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-start gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                  <span>Clinical-grade health assessments</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                  <span>Secure biomarker tracking</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                  <span>Direct specialist routing</span>
                </li>
              </ul>
              <Link to="/patient" className="text-cyan-400 hover:text-cyan-300 font-semibold inline-flex items-center text-sm uppercase tracking-wider group-hover:gap-2 transition-all mt-auto">
                Start Assessment <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </Card>

            {/* Clinic Management */}
            <Card glow="blue" className="flex flex-col h-full bg-surface-1/50 backdrop-blur-xl border-surface-3/50 hover:border-blue-500/50 transition-all duration-500 group p-8">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
                <Stethoscope className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">Clinic Management</h3>
              <p className="text-slate-400 mb-6 text-sm leading-relaxed">
                Automate patient acquisition, triage, and pipeline management. Recover lost revenue and scale operations.
              </p>
              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-start gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                  <span>Automated patient triage</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                  <span>Revenue recovery pipelines</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                  <span>Compliance & protocol tracking</span>
                </li>
              </ul>
              <Link to="/clinics" className="text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center text-sm uppercase tracking-wider group-hover:gap-2 transition-all mt-auto">
                Deploy Clinic OS <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </Card>

            {/* B2B Marketplace */}
            <Card glow="cyan" className="flex flex-col h-full bg-surface-1/50 backdrop-blur-xl border-surface-3/50 hover:border-cyan-500/50 transition-all duration-500 group p-8">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
                <ShoppingCart className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">B2B Marketplace</h3>
              <p className="text-slate-400 mb-6 text-sm leading-relaxed">
                Procure clinical equipment, diagnostics, and health tech with vetted vendors and integrated infrastructure.
              </p>
              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-start gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                  <span>Vetted clinical vendors</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                  <span>Streamlined procurement</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                  <span>ROI & operational insights</span>
                </li>
              </ul>
              <Link to="/marketplace" className="text-cyan-400 hover:text-cyan-300 font-semibold inline-flex items-center text-sm uppercase tracking-wider group-hover:gap-2 transition-all mt-auto">
                Browse Catalog <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </Card>

            {/* Workforce */}
            <Card glow="blue" className="flex flex-col h-full bg-surface-1/50 backdrop-blur-xl border-surface-3/50 hover:border-blue-500/50 transition-all duration-500 group p-8">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
                <Briefcase className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">Workforce</h3>
              <p className="text-slate-400 mb-6 text-sm leading-relaxed">
                Intelligent matching for certified healthcare talent and high-growth clinics, reducing burnout and improving precision.
              </p>
              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-start gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                  <span>Specialized talent matching</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                  <span>Clinical decision support</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                  <span>Credential verification</span>
                </li>
              </ul>
              <Link to="/workforce" className="text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center text-sm uppercase tracking-wider group-hover:gap-2 transition-all mt-auto">
                Find Opportunities <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust & Security */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 text-white">
              Clinical-Grade Security & Compliance
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light">
              Built from the ground up for precision healthcare. Novalyte AI ensures your data, patient records, and communications are protected by state-of-the-art encryption.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-surface-1/30 border-surface-3/50 p-8 text-center hover:bg-surface-1/50 transition-colors">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">HIPAA Aligned</h3>
              <p className="text-slate-400 text-sm">Strict adherence to HIPAA Security and Privacy Rules with executed BAAs for all clinic partners.</p>
            </Card>

            <Card className="bg-surface-1/30 border-surface-3/50 p-8 text-center hover:bg-surface-1/50 transition-colors">
              <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mx-auto mb-6">
                <Lock className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">E2E Encryption</h3>
              <p className="text-slate-400 text-sm">All data is encrypted at rest (AES-256) and in transit (TLS 1.3) using enterprise key management.</p>
            </Card>

            <Card className="bg-surface-1/30 border-surface-3/50 p-8 text-center hover:bg-surface-1/50 transition-colors">
              <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-6">
                <Server className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">SOC 2 Ready</h3>
              <p className="text-slate-400 text-sm">Infrastructure designed to meet SOC 2 Type II compliance with continuous monitoring and audit logging.</p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
