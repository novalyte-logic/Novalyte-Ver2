import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, Circle, ArrowRight, ShieldCheck, 
  FileText, Users, CreditCard, Activity, 
  AlertCircle, ChevronRight, Lock
} from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Link } from 'react-router-dom';

export function ClinicActivate() {
  const [progress] = useState(40);

  const steps = [
    {
      id: 'profile',
      title: 'Complete Clinic Profile',
      description: 'Add your clinic details, specialties, and public directory information.',
      icon: FileText,
      status: 'completed',
      action: 'Edit Profile',
      link: '/dashboard/settings'
    },
    {
      id: 'icp',
      title: 'Define Ideal Patient Profile (ICP)',
      description: 'Tell our AI what kind of patients you want so we can route the right leads to you.',
      icon: Users,
      status: 'current',
      action: 'Define ICP',
      link: '/clinics/icp'
    },
    {
      id: 'billing',
      title: 'Set Up Billing & Lead Budget',
      description: 'Add a payment method and set your monthly lead acquisition budget.',
      icon: CreditCard,
      status: 'pending',
      action: 'Setup Billing',
      link: '/dashboard/billing'
    },
    {
      id: 'verification',
      title: 'Medical Director Verification',
      description: 'Verify your medical director\'s NPI and state licenses for compliance.',
      icon: ShieldCheck,
      status: 'pending',
      action: 'Verify Now',
      link: '/dashboard/settings'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Clinic Activation</h1>
          <p className="text-text-secondary mt-1">Complete these steps to activate your lead flow and directory listing.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-text-secondary">Status:</span>
          <span className="px-3 py-1 rounded-full bg-warning/10 text-warning text-xs font-bold uppercase tracking-wider border border-warning/20 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" /> Pending Activation
          </span>
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="p-8 bg-[#0B0F14] border-surface-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Activity className="w-48 h-48 text-primary" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Activation Progress</h2>
              <p className="text-text-secondary text-sm">You are 2 steps away from receiving your first patient lead.</p>
            </div>
            <span className="text-4xl font-display font-bold text-primary">{progress}%</span>
          </div>
          
          <div className="w-full h-3 bg-surface-2 rounded-full overflow-hidden mb-8">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-primary rounded-full relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-surface-3 bg-surface-2 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
              <div>
                <p className="text-sm font-bold text-white">Account Created</p>
                <p className="text-xs text-text-secondary mt-0.5">Basic info verified.</p>
              </div>
            </div>
            <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 flex items-start gap-3 shadow-[0_0_15px_rgba(53,212,255,0.1)]">
              <Activity className="w-5 h-5 text-primary shrink-0" />
              <div>
                <p className="text-sm font-bold text-white">Lead Engine Setup</p>
                <p className="text-xs text-text-secondary mt-0.5">Define your ICP to start.</p>
              </div>
            </div>
            <div className="p-4 rounded-xl border border-surface-3 bg-surface-2/50 flex items-start gap-3 opacity-60">
              <Lock className="w-5 h-5 text-text-secondary shrink-0" />
              <div>
                <p className="text-sm font-bold text-white">Go Live</p>
                <p className="text-xs text-text-secondary mt-0.5">Requires billing & verification.</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Checklist */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white mb-4">Onboarding Checklist</h3>
        
        {steps.map((step, index) => (
          <Card 
            key={step.id} 
            className={`p-6 transition-all duration-300 ${
              step.status === 'current' 
                ? 'bg-surface-1 border-primary/50 shadow-[0_0_20px_rgba(53,212,255,0.05)]' 
                : 'bg-[#0B0F14] border-surface-3 hover:border-surface-4'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex items-center gap-4 flex-grow">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  step.status === 'completed' ? 'bg-success/10 text-success' :
                  step.status === 'current' ? 'bg-primary/10 text-primary' :
                  'bg-surface-2 text-text-secondary'
                }`}>
                  {step.status === 'completed' ? <CheckCircle2 className="w-6 h-6" /> :
                   step.status === 'current' ? <step.icon className="w-6 h-6" /> :
                   <Circle className="w-6 h-6" />}
                </div>
                <div>
                  <h4 className={`text-lg font-bold mb-1 ${
                    step.status === 'completed' ? 'text-white' :
                    step.status === 'current' ? 'text-primary' :
                    'text-text-secondary'
                  }`}>
                    {index + 1}. {step.title}
                  </h4>
                  <p className="text-sm text-text-secondary leading-relaxed max-w-2xl">
                    {step.description}
                  </p>
                </div>
              </div>
              
              <div className="flex-shrink-0">
                {step.status === 'completed' ? (
                  <Link to={step.link}>
                    <Button variant="outline" className="w-full md:w-auto border-surface-3 text-white hover:bg-surface-2">
                      {step.action}
                    </Button>
                  </Link>
                ) : step.status === 'current' ? (
                  <Link to={step.link}>
                    <Button className="w-full md:w-auto bg-primary hover:bg-primary/90 text-black font-bold group">
                      {step.action} <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                ) : (
                  <Button variant="outline" disabled className="w-full md:w-auto border-surface-3 text-text-secondary opacity-50 cursor-not-allowed">
                    <Lock className="w-4 h-4 mr-2" /> {step.action}
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* AI Assistance Banner */}
      <Card className="p-6 bg-secondary/5 border-secondary/20 flex flex-col sm:flex-row items-center justify-between gap-6 mt-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <h4 className="font-bold text-white">Need help with activation?</h4>
            <p className="text-sm text-text-secondary mt-1">Our onboarding team and AI copilot are ready to assist.</p>
          </div>
        </div>
        <Button variant="outline" className="w-full sm:w-auto border-secondary/30 text-secondary hover:bg-secondary/10 whitespace-nowrap">
          Chat with Support
        </Button>
      </Card>

    </div>
  );
}
