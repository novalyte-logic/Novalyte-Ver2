import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, User, Briefcase, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';

export function WorkforceProfile() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      setTimeout(() => {
        navigate('/workforce/dashboard');
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="h-20 border-b border-surface-3 bg-surface-1/50 backdrop-blur-md flex items-center px-6">
        <Link to="/" className="flex items-center gap-2">
          <Activity className="w-6 h-6 text-secondary" />
          <span className="font-display font-bold text-xl tracking-tight">Novalyte <span className="text-secondary">AI</span></span>
        </Link>
      </header>

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="mb-8 flex justify-between items-center">
            <h1 className="text-2xl font-display font-bold">Practitioner Profile</h1>
            <span className="text-sm font-mono text-text-secondary">Step {step} of 4</span>
          </div>

          <div className="flex gap-2 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`h-1 flex-grow rounded-full transition-colors ${i <= step ? 'bg-secondary' : 'bg-surface-3'}`} />
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
                <Card className="p-8 bg-surface-1 border-surface-3">
                  <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary mb-6">
                    <User className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold mb-6">Identity & Credentials</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">First Name</label>
                        <input type="text" className="w-full px-4 py-3 bg-surface-2 border border-surface-3 rounded-lg text-text-primary focus:outline-none focus:border-secondary/50 focus:ring-1 focus:ring-secondary/50" placeholder="Jane" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">Last Name</label>
                        <input type="text" className="w-full px-4 py-3 bg-surface-2 border border-surface-3 rounded-lg text-text-primary focus:outline-none focus:border-secondary/50 focus:ring-1 focus:ring-secondary/50" placeholder="Doe" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Primary Credential</label>
                      <select className="w-full px-4 py-3 bg-surface-2 border border-surface-3 rounded-lg text-text-primary focus:outline-none focus:border-secondary/50 focus:ring-1 focus:ring-secondary/50">
                        <option>Registered Nurse (RN)</option>
                        <option>Nurse Practitioner (NP)</option>
                        <option>Physician Assistant (PA)</option>
                        <option>Medical Doctor (MD/DO)</option>
                        <option>Medical Assistant (MA)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">State Licenses (Comma separated)</label>
                      <input type="text" className="w-full px-4 py-3 bg-surface-2 border border-surface-3 rounded-lg text-text-primary focus:outline-none focus:border-secondary/50 focus:ring-1 focus:ring-secondary/50" placeholder="FL, TX, NY" />
                    </div>
                  </div>
                </Card>
              )}

              {step === 2 && (
                <Card className="p-8 bg-surface-1 border-surface-3">
                  <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary mb-6">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold mb-6">Experience & Specialties</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Years of Experience</label>
                      <select className="w-full px-4 py-3 bg-surface-2 border border-surface-3 rounded-lg text-text-primary focus:outline-none focus:border-secondary/50 focus:ring-1 focus:ring-secondary/50">
                        <option>0-2 years</option>
                        <option>3-5 years</option>
                        <option>6-10 years</option>
                        <option>10+ years</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Clinical Focus Areas (Select all that apply)</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {['Hormone Optimization', 'Peptide Therapy', 'IV Therapy', 'Phlebotomy', 'Telehealth Consults', 'Weight Management'].map((spec, i) => (
                          <label key={i} className="flex items-center gap-3 p-3 rounded-lg border border-surface-3 bg-surface-2 cursor-pointer hover:border-secondary/50 transition-colors">
                            <input type="checkbox" className="rounded border-surface-3 text-secondary focus:ring-secondary/50" />
                            <span className="text-sm font-medium">{spec}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {step === 3 && (
                <Card className="p-8 bg-surface-1 border-surface-3">
                  <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary mb-6">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold mb-6">Resume & Availability</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Upload Resume (PDF)</label>
                      <div className="border-2 border-dashed border-surface-3 rounded-xl p-8 text-center bg-surface-2 hover:border-secondary/50 transition-colors cursor-pointer">
                        <FileText className="w-8 h-8 text-text-secondary mx-auto mb-3" />
                        <p className="text-sm text-text-primary font-medium">Click to upload or drag and drop</p>
                        <p className="text-xs text-text-secondary mt-1">PDF up to 5MB</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Desired Employment Type</label>
                      <div className="flex flex-wrap gap-3">
                        {['Full-time', 'Part-time', 'Contract', 'Per Diem'].map((type, i) => (
                          <label key={i} className="flex items-center gap-3 p-3 rounded-lg border border-surface-3 bg-surface-2 cursor-pointer hover:border-secondary/50 transition-colors">
                            <input type="checkbox" className="rounded border-surface-3 text-secondary focus:ring-secondary/50" />
                            <span className="text-sm font-medium">{type}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {step === 4 && (
                <Card className="p-8 bg-surface-1 border-surface-3">
                  <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center text-success mb-6">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold mb-6">Review & Submit</h2>
                  <div className="space-y-6">
                    <div className="p-4 rounded-lg bg-surface-2 border border-surface-3">
                      <h3 className="text-sm font-medium text-text-secondary mb-2">Profile Summary</h3>
                      <p className="text-text-primary font-medium">Jane Doe, RN</p>
                      <p className="text-sm text-text-secondary mt-1">3-5 years experience • FL, TX licenses</p>
                      <p className="text-sm text-text-secondary mt-1">Hormone Optimization, IV Therapy</p>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary/10 border border-secondary/20">
                      <Activity className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-secondary">
                        Your profile will be analyzed by Novalyte AI to match you with high-growth clinics seeking your specific skill set.
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex justify-between">
            {step > 1 ? (
              <Button variant="outline" onClick={() => setStep(step - 1)}>Back</Button>
            ) : (
              <div />
            )}
            <Button onClick={handleNext} className="group">
              {step === 4 ? 'Submit Profile' : 'Continue'}
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
