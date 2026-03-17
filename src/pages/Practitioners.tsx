import React from 'react';
import { motion } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Stethoscope, ShieldCheck, Zap, ArrowRight, 
  MapPin, Clock, DollarSign, Star, CheckCircle2,
  Building2, Users, Activity, Lock, Brain, LineChart, Database,
  ActivitySquare, Syringe, HeartPulse
} from 'lucide-react';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';

export function Practitioners() {
  const navigate = useNavigate();

  const clinicalTools = [
    {
      icon: Brain,
      title: "AI-Assisted Testosterone Titration",
      description: "Dynamically adjust dosing based on real-time free T, SHBG, and estradiol feedback loops. Reduce trial-and-error and dial in optimal ranges faster."
    },
    {
      icon: Syringe,
      title: "Peptide Half-Life Calculators",
      description: "Precision dosing schedules for complex peptide stacks. Automatically calculate decay rates and optimal administration windows for maximum efficacy."
    },
    {
      icon: LineChart,
      title: "Comprehensive Endocrine Trajectory Modeling",
      description: "Predictive analytics for long-term hormone optimization. Visualize patient trajectories and anticipate metabolic shifts before they occur."
    },
    {
      icon: HeartPulse,
      title: "HRV / Metabolic Data Sync",
      description: "Integrate wearable data directly into the clinical dashboard. Correlate subjective symptoms with objective biometric markers in real-time."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-6">
              <Activity className="w-4 h-4" /> Clinical Decision Support
            </div>
            <h1 className="text-5xl lg:text-6xl font-display font-bold leading-tight mb-6">
              Precision Medicine at <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Your Fingertips.</span>
            </h1>
            <p className="text-xl text-text-secondary mb-8 leading-relaxed">
              Advanced AI-assisted dosing protocols, real-time lab integrations, and comprehensive longevity tracking. Built specifically for providers managing hormones, peptides, and performance medicine.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => navigate('/practitioners/onboarding')}
                className="bg-primary hover:bg-primary/90 text-black font-bold text-lg px-8 py-4 h-auto flex items-center justify-center gap-2"
              >
                Request Access <ArrowRight className="w-5 h-5" />
              </Button>
              <Link to="/platform">
                <Button 
                  variant="outline"
                  className="border-surface-3 text-white hover:bg-surface-2 text-lg px-8 py-4 h-auto"
                >
                  Explore Platform
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-text-secondary font-medium">
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> Reduces Burnout</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> Improves Outcomes</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> HIPAA Compliant</span>
            </div>
          </motion.div>

          {/* Hero Visual - Mock Practitioner Dashboard */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 blur-3xl rounded-full" />
            <Card className="relative p-6 bg-[#0B0F14]/90 backdrop-blur-xl border-surface-3 overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />
              
              {/* Dashboard Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-surface-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-2 flex items-center justify-center border border-surface-3">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Patient: Marcus R.</h3>
                    <p className="text-xs text-text-secondary">ID: #8492 • Male • 42 yrs</p>
                  </div>
                </div>
                <div className="px-3 py-1 rounded bg-success/10 border border-success/20 text-success text-xs font-bold uppercase tracking-wider">
                  Optimized
                </div>
              </div>

              {/* Patient Profile Area */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-surface-1 border border-surface-3">
                  <div className="flex items-center gap-2 mb-3">
                    <ActivitySquare className="w-4 h-4 text-primary" />
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">Active Protocol</h4>
                  </div>
                  <div className="p-3 rounded-lg bg-[#05070A] border border-surface-2 mb-3">
                    <p className="text-sm font-mono text-primary">
                      Current Stack: Kyzatrex 200mg, Semaglutide 1mg, Ipamorelin
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-surface-2 border border-surface-3">
                      <p className="text-xs text-text-secondary mb-1">Total T</p>
                      <p className="text-lg font-bold text-white">940 <span className="text-xs text-text-secondary font-normal">ng/dL</span></p>
                    </div>
                    <div className="p-3 rounded-lg bg-surface-2 border border-surface-3">
                      <p className="text-xs text-text-secondary mb-1">Free T</p>
                      <p className="text-lg font-bold text-white">24.5 <span className="text-xs text-text-secondary font-normal">pg/mL</span></p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-surface-1 border border-surface-3 opacity-80">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-secondary" />
                      <h4 className="text-sm font-bold text-white">AI Insight</h4>
                    </div>
                    <span className="text-xs font-bold text-text-secondary">Just now</span>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Patient's HRV has increased by 15% since initiating Ipamorelin. Estradiol remains stable. Recommend maintaining current dosing protocol for next 6 weeks.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Clinical Tools Section */}
      <div className="bg-surface-1 border-y border-surface-3 py-24 mb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Clinical Tools Built for Specialists</h2>
            <p className="text-lg text-text-secondary">Replace fragmented spreadsheets and guesswork with an authoritative, unified clinical operating system designed to scale your expertise.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {clinicalTools.map((tool, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="p-8 h-full bg-[#0B0F14] border-surface-3 hover:border-primary/50 transition-colors group">
                  <div className="w-14 h-14 rounded-xl bg-surface-2 flex items-center justify-center text-primary mb-6 border border-surface-3 group-hover:scale-110 transition-transform">
                    <tool.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">{tool.title}</h3>
                  <p className="text-text-secondary leading-relaxed text-lg">{tool.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <Card className="p-12 bg-gradient-to-b from-surface-1 to-[#0B0F14] border-surface-3 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-32 bg-primary/20 blur-[100px]" />
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 relative z-10 text-white">Elevate your standard of care.</h2>
          <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto relative z-10">
            Join the network of elite practitioners using Novalyte to deliver precision medicine, reduce administrative burden, and drive superior patient outcomes.
          </p>
          <Button 
            onClick={() => navigate('/practitioners/onboarding')}
            className="bg-primary hover:bg-primary/90 text-black font-bold text-lg px-8 py-4 h-auto relative z-10"
          >
            Request Platform Access
          </Button>
        </Card>
      </div>
    </div>
  );
}
