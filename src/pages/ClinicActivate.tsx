import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, Circle, ArrowRight, ShieldCheck, 
  FileText, Users, CreditCard, Activity, 
  AlertCircle, ChevronRight, Lock
} from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Link } from 'react-router-dom';
import { ClinicApiError, ClinicService } from '@/src/services/clinic';

export function ClinicActivate() {
  const [clinicData, setClinicData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;

    const loadProfile = async () => {
      try {
        const response = await ClinicService.getProfile();
        if (isActive) {
          setClinicData(response.clinic);
        }
      } catch (loadError) {
        console.error('Failed to load clinic activation state:', loadError);
        if (isActive) {
          setError(
            loadError instanceof ClinicApiError
              ? loadError.message
              : 'Unable to load clinic activation progress right now.',
          );
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void loadProfile();

    return () => {
      isActive = false;
    };
  }, []);

  const getProgress = () => {
    if (!clinicData) return 0;
    let completed = 0;
    if (String(clinicData.status || '').toLowerCase() === 'verified') completed += 25;
    if (clinicData.icpDefined) completed += 25;
    if (clinicData.billingSetup) completed += 25;
    if (clinicData.medicalDirectorVerified) completed += 25;
    return completed;
  };

  const progress = getProgress();

  const steps = [
    {
      id: 'profile',
      title: 'Complete Clinic Profile',
      description: 'Add your clinic details, specialties, and public directory information.',
      icon: FileText,
      status: String(clinicData?.status || '').toLowerCase() === 'verified' ? 'completed' : 'current',
      action: String(clinicData?.status || '').toLowerCase() === 'verified' ? 'Edit Profile' : 'Complete Profile',
      link: '/dashboard/settings'
    },
    {
      id: 'icp',
      title: 'Define Ideal Patient Profile (ICP)',
      description: 'Tell our AI what kind of patients you want so we can route the right leads to you.',
      icon: Users,
      status: clinicData?.icpDefined ? 'completed' : (clinicData?.status === 'Verified' ? 'current' : 'pending'),
      action: 'Define ICP',
      link: '/clinics/icp'
    },
    {
      id: 'billing',
      title: 'Set Up Billing & Lead Budget',
      description: 'Add a payment method and set your monthly lead acquisition budget.',
      icon: CreditCard,
      status: clinicData?.billingSetup ? 'completed' : (clinicData?.icpDefined ? 'current' : 'pending'),
      action: 'Setup Billing',
      link: '/dashboard/billing'
    },
    {
      id: 'verification',
      title: 'Medical Director Verification',
      description: 'Verify your medical director\'s NPI and state licenses for compliance.',
      icon: ShieldCheck,
      status: clinicData?.medicalDirectorVerified ? 'completed' : (clinicData?.billingSetup ? 'current' : 'pending'),
      action: 'Verify Now',
      link: '/dashboard/settings'
    }
  ];

  const currentStep = steps.find((step) => step.status === 'current');

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Clinic Activation</h1>
          <p className="text-text-secondary mt-1">Complete these steps to activate your lead flow and directory listing.</p>
          {error ? (
            <div className="mt-4 rounded-lg border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
              {error}
            </div>
          ) : null}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-text-secondary">Status:</span>
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border flex items-center gap-1.5 ${
            progress === 100 ? 'bg-success/10 text-success border-success/20' : 'bg-warning/10 text-warning border-warning/20'
          }`}>
            {progress === 100 ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
            {progress === 100 ? 'Active' : 'Pending Activation'}
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
              <p className="text-text-secondary text-sm">
                {progress === 100 ? 'Your clinic is fully activated and receiving leads.' : `You are ${steps.filter(s => s.status !== 'completed').length} steps away from receiving your first patient lead.`}
              </p>
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
            <div className={`p-4 rounded-xl border flex items-start gap-3 ${progress >= 25 ? 'border-success/30 bg-success/5' : 'border-surface-3 bg-surface-2'}`}>
              <CheckCircle2 className={`w-5 h-5 shrink-0 ${progress >= 25 ? 'text-success' : 'text-text-secondary'}`} />
              <div>
                <p className="text-sm font-bold text-white">Account Created</p>
                <p className="text-xs text-text-secondary mt-0.5">Basic info verified.</p>
              </div>
            </div>
            <div className={`p-4 rounded-xl border flex items-start gap-3 ${progress >= 50 ? 'border-primary/30 bg-primary/5 shadow-[0_0_15px_rgba(53,212,255,0.1)]' : 'border-surface-3 bg-surface-2/50 opacity-60'}`}>
              <Activity className={`w-5 h-5 shrink-0 ${progress >= 50 ? 'text-primary' : 'text-text-secondary'}`} />
              <div>
                <p className="text-sm font-bold text-white">Lead Engine Setup</p>
                <p className="text-xs text-text-secondary mt-0.5">Define your ICP to start.</p>
              </div>
            </div>
            <div className={`p-4 rounded-xl border flex items-start gap-3 ${progress === 100 ? 'border-success/30 bg-success/5' : 'border-surface-3 bg-surface-2/50 opacity-60'}`}>
              {progress === 100 ? <CheckCircle2 className="w-5 h-5 text-success shrink-0" /> : <Lock className="w-5 h-5 text-text-secondary shrink-0" />}
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
                  <Link to={currentStep?.link || '/dashboard/help'}>
                    <Button variant="outline" className="w-full md:w-auto border-surface-3 text-text-secondary hover:bg-surface-2">
                      <Lock className="w-4 h-4 mr-2" /> {currentStep ? 'Complete Previous Step' : 'Get Help'}
                    </Button>
                  </Link>
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
        <Link to="/dashboard/help">
          <Button variant="outline" className="w-full sm:w-auto border-secondary/30 text-secondary hover:bg-secondary/10 whitespace-nowrap">
            Chat with Support
          </Button>
        </Link>
      </Card>

    </div>
  );
}
