import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, ArrowRight, CheckCircle2, Building2, Users, Stethoscope, DollarSign } from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';

export function ClinicApply() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Simulate submission
      setTimeout(() => {
        navigate('/auth/register-clinic');
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="h-20 border-b border-surface-3 bg-surface-1/50 backdrop-blur-md flex items-center px-6">
        <Link to="/" className="flex items-center gap-2">
          <Activity className="w-6 h-6 text-primary" />
          <span className="font-display font-bold text-xl tracking-tight">Novalyte <span className="text-primary">AI</span></span>
        </Link>
      </header>

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="mb-8 flex justify-between items-center">
            <h1 className="text-2xl font-display font-bold">Clinic Application</h1>
            <span className="text-sm font-mono text-text-secondary">Step {step} of 4</span>
          </div>

          <div className="flex gap-2 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`h-1 flex-grow rounded-full transition-colors ${i <= step ? 'bg-primary' : 'bg-surface-3'}`} />
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
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold mb-6">Clinic Identity</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Clinic Name</label>
                      <input type="text" className="w-full px-4 py-3 bg-surface-2 border border-surface-3 rounded-lg text-text-primary focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50" placeholder="e.g. Apex Longevity" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Website URL</label>
                      <input type="url" className="w-full px-4 py-3 bg-surface-2 border border-surface-3 rounded-lg text-text-primary focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50" placeholder="https://" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">NPI Number (Optional)</label>
                      <input type="text" className="w-full px-4 py-3 bg-surface-2 border border-surface-3 rounded-lg text-text-primary focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50" placeholder="10-digit NPI" />
                    </div>
                  </div>
                </Card>
              )}

              {step === 2 && (
                <Card className="p-8 bg-surface-1 border-surface-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold mb-6">Clinical Focus</h2>
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-text-secondary mb-2">Primary Specialties (Select all that apply)</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {['Hormone Optimization', 'Peptide Therapy', 'Weight Management', 'Longevity', 'Cognitive Health', 'Sexual Health'].map((spec, i) => (
                        <label key={i} className="flex items-center gap-3 p-3 rounded-lg border border-surface-3 bg-surface-2 cursor-pointer hover:border-primary/50 transition-colors">
                          <input type="checkbox" className="rounded border-surface-3 text-primary focus:ring-primary/50" />
                          <span className="text-sm font-medium">{spec}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </Card>
              )}

              {step === 3 && (
                <Card className="p-8 bg-surface-1 border-surface-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6">
                    <Users className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold mb-6">Operational Scale</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Monthly Patient Volume</label>
                      <select className="w-full px-4 py-3 bg-surface-2 border border-surface-3 rounded-lg text-text-primary focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50">
                        <option>Under 50</option>
                        <option>50 - 200</option>
                        <option>200 - 500</option>
                        <option>500+</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Current EMR System</label>
                      <select className="w-full px-4 py-3 bg-surface-2 border border-surface-3 rounded-lg text-text-primary focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50">
                        <option>AthenaHealth</option>
                        <option>DrChrono</option>
                        <option>AdvancedMD</option>
                        <option>Other / Custom</option>
                        <option>Paper / None</option>
                      </select>
                    </div>
                  </div>
                </Card>
              )}

              {step === 4 && (
                <Card className="p-8 bg-surface-1 border-surface-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold mb-6">Growth Goals</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Primary Objective</label>
                      <div className="space-y-3">
                        {['Increase Patient Volume', 'Improve Lead Conversion', 'Automate Triage & Intake', 'Access Marketplace Products'].map((obj, i) => (
                          <label key={i} className="flex items-center gap-3 p-3 rounded-lg border border-surface-3 bg-surface-2 cursor-pointer hover:border-primary/50 transition-colors">
                            <input type="radio" name="objective" className="border-surface-3 text-primary focus:ring-primary/50" />
                            <span className="text-sm font-medium">{obj}</span>
                          </label>
                        ))}
                      </div>
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
              {step === 4 ? 'Submit Application' : 'Continue'}
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
