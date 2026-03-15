import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/src/firebase';
import { Activity, ArrowRight, CheckCircle2, Building2, Users, Stethoscope, DollarSign, Shield, AlertCircle, XCircle, ChevronLeft, Brain, Zap } from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';

type ApplicationData = {
  clinicName: string;
  website: string;
  npi: string;
  isFranchise: string;
  monthlyVolume: string;
  frontDeskStaff: string;
  emr: string;
  telehealth: string;
  avgLtv: string;
  investment: string;
};

export function ClinicApply() {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<'approved' | 'manual_review' | 'rejected' | null>(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ApplicationData>({
    clinicName: '',
    website: '',
    npi: '',
    isFranchise: '',
    monthlyVolume: '',
    frontDeskStaff: '',
    emr: '',
    telehealth: '',
    avgLtv: '',
    investment: ''
  });

  const updateForm = (field: keyof ApplicationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.clinicName.length > 2 && formData.website.length > 5 && formData.isFranchise !== '';
      case 2:
        return formData.monthlyVolume !== '' && formData.frontDeskStaff !== '';
      case 3:
        return formData.emr !== '' && formData.telehealth !== '';
      case 4:
        return formData.avgLtv !== '' && formData.investment !== '';
      default:
        return true;
    }
  };

  const processApplication = async () => {
    setIsProcessing(true);
    
    try {
      // Hard Disqualifiers
      let finalResult: 'approved' | 'manual_review' | 'rejected' = 'approved';
      
      if (
        formData.monthlyVolume === 'Under 50' ||
        formData.frontDeskStaff === '0' ||
        formData.emr === 'Paper / None' ||
        formData.investment === 'No'
      ) {
        finalResult = 'rejected';
      } else if (
        formData.isFranchise === 'Yes' ||
        formData.monthlyVolume === '50 - 100' ||
        formData.emr === 'Other / Custom'
      ) {
        finalResult = 'manual_review';
      }

      await addDoc(collection(db, 'clinics'), {
        name: formData.clinicName,
        website: formData.website,
        npi: formData.npi,
        isFranchise: formData.isFranchise,
        monthlyVolume: formData.monthlyVolume,
        frontDeskStaff: formData.frontDeskStaff,
        emr: formData.emr,
        telehealth: formData.telehealth,
        avgLtv: formData.avgLtv,
        investment: formData.investment,
        status: finalResult === 'approved' ? 'Verified' : finalResult === 'manual_review' ? 'Pending Review' : 'Suspended',
        outreachStatus: 'Onboarding',
        createdAt: serverTimestamp(),
      });

      setResult(finalResult);
    } catch (error) {
      console.error("Error saving clinic application:", error);
      setResult('manual_review');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      processApplication();
    }
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-[#05070A] flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 border-4 border-surface-3 rounded-full" />
            <motion.div
              className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Brain className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h2 className="text-2xl font-display font-bold text-white mb-4">Analyzing Clinic Profile</h2>
          <div className="space-y-3 text-left max-w-xs mx-auto">
            <motion.div 
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
              className="flex items-center gap-3 text-sm text-text-secondary"
            >
              <CheckCircle2 className="w-4 h-4 text-success" /> Verifying operational scale
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.5 }}
              className="flex items-center gap-3 text-sm text-text-secondary"
            >
              <CheckCircle2 className="w-4 h-4 text-success" /> Checking infrastructure compatibility
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.5 }}
              className="flex items-center gap-3 text-sm text-text-secondary"
            >
              <CheckCircle2 className="w-4 h-4 text-success" /> Computing network fit score
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen bg-[#05070A] flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg w-full"
        >
          {result === 'approved' && (
            <Card className="p-8 bg-[#101720] border-success/30 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-success" />
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-success" />
              </div>
              <h2 className="text-3xl font-display font-bold text-white mb-4">Application Approved</h2>
              <p className="text-text-secondary mb-8">
                Your clinic meets the operational requirements for Novalyte OS. You have been fast-tracked for onboarding.
              </p>
              <div className="bg-[#15202B] p-4 rounded-lg border border-surface-3 mb-8 text-left">
                <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" /> Next Steps
                </h4>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li>1. Create your operator account</li>
                  <li>2. Complete KYB (Know Your Business) verification</li>
                  <li>3. Configure your EMR integration</li>
                </ul>
              </div>
              <Link to="/auth/register-clinic">
                <Button size="lg" className="w-full bg-primary hover:bg-primary-hover text-black font-bold">
                  Continue to Registration <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </Card>
          )}

          {result === 'manual_review' && (
            <Card className="p-8 bg-[#101720] border-warning/30 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-warning" />
              <div className="w-16 h-16 rounded-full bg-warning/10 flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-warning" />
              </div>
              <h2 className="text-3xl font-display font-bold text-white mb-4">Under Review</h2>
              <p className="text-text-secondary mb-8">
                Your application has been received and flagged for manual review by our network operations team.
              </p>
              <div className="bg-[#15202B] p-4 rounded-lg border border-surface-3 mb-8 text-left text-sm text-text-secondary">
                Because of your specific operational structure (e.g., franchise model or custom EMR), we need to manually verify integration capabilities before granting platform access. Our team will reach out within 24-48 hours.
              </div>
              <Link to="/">
                <Button variant="outline" size="lg" className="w-full">
                  Return to Homepage
                </Button>
              </Link>
            </Card>
          )}

          {result === 'rejected' && (
            <Card className="p-8 bg-[#101720] border-danger/30 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-danger" />
              <div className="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-8 h-8 text-danger" />
              </div>
              <h2 className="text-3xl font-display font-bold text-white mb-4">Application Declined</h2>
              <p className="text-text-secondary mb-8">
                Thank you for your interest. At this time, your clinic does not meet the minimum infrastructure requirements for the Novalyte network.
              </p>
              <div className="bg-[#15202B] p-4 rounded-lg border border-surface-3 mb-8 text-left text-sm text-text-secondary">
                <p className="mb-2"><strong className="text-white">Common reasons for decline:</strong></p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Patient volume below minimum threshold (50/mo)</li>
                  <li>Lack of dedicated front-desk staff</li>
                  <li>Incompatible or missing EMR infrastructure</li>
                  <li>Insufficient budget for growth infrastructure</li>
                </ul>
              </div>
              <Link to="/">
                <Button variant="outline" size="lg" className="w-full">
                  Return to Homepage
                </Button>
              </Link>
            </Card>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070A] flex flex-col">
      <header className="h-20 border-b border-surface-3 bg-[#0B0F14]/80 backdrop-blur-md flex items-center px-6 sticky top-0 z-50">
        <Link to="/clinics" className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors">
          <ChevronLeft className="w-5 h-5" />
          <span className="font-medium text-sm">Back to Clinics</span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <Shield className="w-4 h-4 text-success" />
          <span className="text-xs font-mono text-success uppercase tracking-wider">Secure Application</span>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-2xl">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-white mb-2">Network Application</h1>
            <p className="text-text-secondary">Complete this assessment to verify your clinic's eligibility for Novalyte OS.</p>
          </div>

          <div className="flex gap-2 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`h-1.5 flex-grow rounded-full transition-colors duration-300 ${i <= step ? 'bg-primary shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'bg-surface-3'}`} />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {step === 1 && (
                <Card className="p-8 bg-[#101720] border-surface-3 shadow-xl">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6 border border-primary/20">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-6">Clinic Identity</h2>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Legal Clinic Name <span className="text-danger">*</span></label>
                      <input 
                        type="text" 
                        value={formData.clinicName}
                        onChange={(e) => updateForm('clinicName', e.target.value)}
                        className="w-full px-4 py-3 bg-[#05070A] border border-surface-3 rounded-lg text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all" 
                        placeholder="e.g. Apex Longevity & Performance" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Clinic Website <span className="text-danger">*</span></label>
                      <input 
                        type="url" 
                        value={formData.website}
                        onChange={(e) => updateForm('website', e.target.value)}
                        className="w-full px-4 py-3 bg-[#05070A] border border-surface-3 rounded-lg text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all" 
                        placeholder="https://" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">NPI Number (Optional)</label>
                      <input 
                        type="text" 
                        value={formData.npi}
                        onChange={(e) => updateForm('npi', e.target.value)}
                        className="w-full px-4 py-3 bg-[#05070A] border border-surface-3 rounded-lg text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all" 
                        placeholder="10-digit NPI" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-3">Is this clinic part of a franchise? <span className="text-danger">*</span></label>
                      <div className="grid grid-cols-2 gap-4">
                        {['Yes', 'No'].map((opt) => (
                          <button
                            key={opt}
                            onClick={() => updateForm('isFranchise', opt)}
                            className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                              formData.isFranchise === opt 
                                ? 'bg-primary/10 border-primary text-primary' 
                                : 'bg-[#05070A] border-surface-3 text-text-secondary hover:border-surface-4'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {step === 2 && (
                <Card className="p-8 bg-[#101720] border-surface-3 shadow-xl">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6 border border-primary/20">
                    <Users className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Scale & Operations</h2>
                  <p className="text-text-secondary text-sm mb-6">We need to ensure your clinic has the capacity to handle increased patient flow.</p>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-3">Average Monthly Patient Volume <span className="text-danger">*</span></label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {['Under 50', '50 - 100', '100 - 300', '300+'].map((opt) => (
                          <button
                            key={opt}
                            onClick={() => updateForm('monthlyVolume', opt)}
                            className={`p-3 rounded-lg border text-sm font-medium transition-all text-left ${
                              formData.monthlyVolume === opt 
                                ? 'bg-primary/10 border-primary text-primary' 
                                : 'bg-[#05070A] border-surface-3 text-text-secondary hover:border-surface-4'
                            }`}
                          >
                            {opt} patients/mo
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-3">Dedicated Front Desk / Intake Staff <span className="text-danger">*</span></label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {['0', '1', '2-3', '4+'].map((opt) => (
                          <button
                            key={opt}
                            onClick={() => updateForm('frontDeskStaff', opt)}
                            className={`p-3 rounded-lg border text-sm font-medium transition-all text-center ${
                              formData.frontDeskStaff === opt 
                                ? 'bg-primary/10 border-primary text-primary' 
                                : 'bg-[#05070A] border-surface-3 text-text-secondary hover:border-surface-4'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-text-secondary mt-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Zero dedicated staff may disqualify your application.
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              {step === 3 && (
                <Card className="p-8 bg-[#101720] border-surface-3 shadow-xl">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6 border border-primary/20">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Tech & Infrastructure</h2>
                  <p className="text-text-secondary text-sm mb-6">Novalyte OS requires specific technical capabilities for integration.</p>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-3">Current EMR System <span className="text-danger">*</span></label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {['AthenaHealth', 'DrChrono', 'AdvancedMD', 'Jane', 'Other / Custom', 'Paper / None'].map((opt) => (
                          <button
                            key={opt}
                            onClick={() => updateForm('emr', opt)}
                            className={`p-3 rounded-lg border text-sm font-medium transition-all text-left ${
                              formData.emr === opt 
                                ? 'bg-primary/10 border-primary text-primary' 
                                : 'bg-[#05070A] border-surface-3 text-text-secondary hover:border-surface-4'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-3">Do you currently offer Telehealth consults? <span className="text-danger">*</span></label>
                      <div className="grid grid-cols-2 gap-4">
                        {['Yes', 'No'].map((opt) => (
                          <button
                            key={opt}
                            onClick={() => updateForm('telehealth', opt)}
                            className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                              formData.telehealth === opt 
                                ? 'bg-primary/10 border-primary text-primary' 
                                : 'bg-[#05070A] border-surface-3 text-text-secondary hover:border-surface-4'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {step === 4 && (
                <Card className="p-8 bg-[#101720] border-surface-3 shadow-xl">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6 border border-primary/20">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Revenue & Commitment</h2>
                  <p className="text-text-secondary text-sm mb-6">Final step to verify financial alignment and growth readiness.</p>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-3">Average Patient LTV (Lifetime Value) <span className="text-danger">*</span></label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {['Under $1,000', '$1,000 - $2,500', '$2,500 - $5,000', '$5,000+'].map((opt) => (
                          <button
                            key={opt}
                            onClick={() => updateForm('avgLtv', opt)}
                            className={`p-3 rounded-lg border text-sm font-medium transition-all text-left ${
                              formData.avgLtv === opt 
                                ? 'bg-primary/10 border-primary text-primary' 
                                : 'bg-[#05070A] border-surface-3 text-text-secondary hover:border-surface-4'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-3">
                        Novalyte OS requires a minimum infrastructure investment of $997/mo. Are you prepared to invest in growth? <span className="text-danger">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        {['Yes', 'No'].map((opt) => (
                          <button
                            key={opt}
                            onClick={() => updateForm('investment', opt)}
                            className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                              formData.investment === opt 
                                ? 'bg-primary/10 border-primary text-primary' 
                                : 'bg-[#05070A] border-surface-3 text-text-secondary hover:border-surface-4'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex justify-between items-center border-t border-surface-3 pt-6">
            {step > 1 ? (
              <Button variant="ghost" onClick={() => setStep(step - 1)} className="text-text-secondary hover:text-white">
                <ChevronLeft className="w-4 h-4 mr-2" /> Back
              </Button>
            ) : (
              <div />
            )}
            <Button 
              onClick={handleNext} 
              disabled={!isStepValid()}
              className={`group px-8 ${step === 4 ? 'bg-primary text-black hover:bg-primary-hover shadow-[0_0_20px_rgba(6,182,212,0.3)]' : ''}`}
            >
              {step === 4 ? 'Submit Application' : 'Continue'}
              {step < 4 && <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
