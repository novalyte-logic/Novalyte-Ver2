import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Activity, ArrowRight, ChevronLeft, Shield, AlertTriangle, CheckCircle2 } from 'lucide-react';

export function SymptomChecker() {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setIsProcessing(true);
      setTimeout(() => {
        setStep(4);
        setIsProcessing(false);
      }, 2500);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pt-20">
      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-secondary/5 via-background to-background" />
        
        <div className="w-full max-w-2xl relative z-10">
          <AnimatePresence mode="wait">
            {step < 4 && !isProcessing && (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8 flex items-center justify-between">
                  <button 
                    onClick={handleBack}
                    className={`text-text-secondary hover:text-text-primary flex items-center gap-1 transition-colors ${step === 1 ? 'opacity-0 pointer-events-none' : ''}`}
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <div className="flex gap-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className={`w-12 h-1.5 rounded-full ${i <= step ? 'bg-secondary' : 'bg-surface-3'}`} />
                    ))}
                  </div>
                </div>

                <Card glow="violet" className="p-8 md:p-12">
                  {step === 1 && (
                    <div className="space-y-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warning/10 border border-warning/20 mb-4">
                        <AlertTriangle className="w-4 h-4 text-warning" />
                        <span className="text-xs font-mono text-warning uppercase tracking-wider">Not for emergencies</span>
                      </div>
                      <h2 className="text-3xl font-display font-bold">What symptoms are you experiencing?</h2>
                      <p className="text-text-secondary">Select all that apply to help us understand your current state.</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                        {['Fatigue / Low Energy', 'Brain Fog', 'Decreased Libido', 'Weight Gain', 'Muscle Loss', 'Poor Sleep', 'Joint Pain', 'Mood Changes'].map((symptom, i) => (
                          <label key={i} className="flex items-center gap-3 p-4 rounded-xl border border-surface-3 bg-surface-2 hover:border-secondary/50 cursor-pointer transition-all">
                            <input type="checkbox" className="w-5 h-5 rounded border-surface-3 bg-surface-1 text-secondary focus:ring-secondary/50" />
                            <span className="font-medium text-text-primary">{symptom}</span>
                          </label>
                        ))}
                      </div>
                      <Button variant="secondary" size="lg" className="w-full mt-8" onClick={handleNext}>
                        Continue
                      </Button>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-6">
                      <h2 className="text-3xl font-display font-bold">How long have you been experiencing this?</h2>
                      <p className="text-text-secondary">Duration helps us determine the chronicity of your symptoms.</p>
                      <div className="grid grid-cols-1 gap-4 mt-8">
                        {['Just started (Days)', 'A few weeks', 'Several months', 'More than a year'].map((duration, i) => (
                          <button key={i} onClick={handleNext} className="w-full text-left px-6 py-4 rounded-xl border border-surface-3 bg-surface-2 hover:border-secondary/50 hover:bg-surface-3 transition-all flex justify-between items-center group">
                            <span className="font-medium">{duration}</span>
                            <ArrowRight className="w-5 h-5 text-text-secondary group-hover:text-secondary group-hover:translate-x-1 transition-all" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-6">
                      <h2 className="text-3xl font-display font-bold">How severe is the impact on your daily life?</h2>
                      <p className="text-text-secondary">Select the level of disruption you are experiencing.</p>
                      <div className="grid grid-cols-1 gap-4 mt-8">
                        <button onClick={handleNext} className="w-full text-left px-6 py-4 rounded-xl border border-surface-3 bg-surface-2 hover:border-secondary/50 hover:bg-surface-3 transition-all flex justify-between items-center group">
                          <span className="font-medium">Mild (Noticeable but manageable)</span>
                          <ArrowRight className="w-5 h-5 text-text-secondary group-hover:text-secondary group-hover:translate-x-1 transition-all" />
                        </button>
                        <button onClick={handleNext} className="w-full text-left px-6 py-4 rounded-xl border border-surface-3 bg-surface-2 hover:border-warning/50 hover:bg-surface-3 transition-all flex justify-between items-center group">
                          <span className="font-medium">Moderate (Affecting performance/mood)</span>
                          <ArrowRight className="w-5 h-5 text-text-secondary group-hover:text-warning group-hover:translate-x-1 transition-all" />
                        </button>
                        <button onClick={handleNext} className="w-full text-left px-6 py-4 rounded-xl border border-surface-3 bg-surface-2 hover:border-danger/50 hover:bg-surface-3 transition-all flex justify-between items-center group">
                          <span className="font-medium">Severe (Significant disruption)</span>
                          <ArrowRight className="w-5 h-5 text-text-secondary group-hover:text-danger group-hover:translate-x-1 transition-all" />
                        </button>
                      </div>
                    </div>
                  )}
                </Card>
              </motion.div>
            )}

            {isProcessing && (
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center space-y-8"
              >
                <div className="relative w-32 h-32 mx-auto">
                  <div className="absolute inset-0 rounded-full border-t-2 border-secondary animate-spin" />
                  <div className="absolute inset-2 rounded-full border-r-2 border-primary animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Activity className="w-8 h-8 text-secondary animate-pulse" />
                  </div>
                </div>
                <div className="space-y-2 font-mono text-sm text-text-secondary">
                  <p className="text-secondary">{`> ANALYZING_SYMPTOM_CLUSTER`}</p>
                  <p>{`[OK] Correlating with endocrine profiles`}</p>
                  <p>{`[OK] Checking metabolic indicators`}</p>
                  <p>{`[OK] Generating clinical recommendations`}</p>
                </div>
              </motion.div>
            )}

            {step === 4 && !isProcessing && (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card glow="cyan" className="p-8 md:p-12">
                  <div className="flex items-center gap-4 mb-8 pb-8 border-b border-surface-3">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Activity className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-display font-bold text-text-primary">Analysis Complete</h2>
                      <p className="text-text-secondary">Based on your reported symptoms, here is our initial assessment.</p>
                    </div>
                  </div>

                  <div className="space-y-6 mb-8">
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary mb-2">Potential Indicators</h3>
                      <p className="text-text-secondary">
                        Your symptom cluster (Fatigue, Brain Fog, Poor Sleep) is commonly associated with suboptimal hormone levels, specifically testosterone or thyroid imbalances, as well as potential metabolic dysregulation.
                      </p>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-surface-2 border border-surface-3">
                      <h4 className="font-medium text-text-primary mb-2 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-secondary" /> Recommended Next Steps
                      </h4>
                      <ul className="space-y-2 text-sm text-text-secondary">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                          <span>Comprehensive blood panel (Testosterone, Free T, Estradiol, Thyroid Panel)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                          <span>Consultation with a hormone optimization specialist</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      variant="primary" 
                      size="lg" 
                      className="flex-grow"
                      onClick={() => navigate('/patient/assessment')}
                    >
                      Start Full Assessment
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="flex-grow"
                      onClick={() => navigate('/directory')}
                    >
                      Find a Clinic
                    </Button>
                  </div>
                  <p className="text-xs text-text-secondary text-center mt-6">
                    Disclaimer: This tool provides informational guidance only and is not a substitute for professional medical advice, diagnosis, or treatment.
                  </p>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
