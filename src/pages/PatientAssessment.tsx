import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Shield, Activity, ArrowRight, CheckCircle2, ChevronLeft } from 'lucide-react';

export function PatientAssessment() {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      setIsProcessing(true);
      setTimeout(() => {
        setStep(5);
        setIsProcessing(false);
      }, 2000);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="h-20 border-b border-surface-3 flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <Activity className="w-6 h-6 text-primary" />
          <span className="font-display font-bold text-xl tracking-tight text-text-primary">
            Novalyte <span className="text-primary">AI</span>
          </span>
        </Link>
        <div className="flex items-center gap-2 text-sm text-text-secondary font-mono">
          <Shield className="w-4 h-4 text-success" /> End-to-End Encrypted
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-secondary/5 via-background to-background" />
        
        <div className="w-full max-w-2xl relative z-10">
          <AnimatePresence mode="wait">
            {step < 5 && !isProcessing && (
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
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={`w-12 h-1.5 rounded-full ${i <= step ? 'bg-secondary' : 'bg-surface-3'}`} />
                    ))}
                  </div>
                </div>

                <Card glow="violet" className="p-8 md:p-12">
                  {step === 1 && (
                    <div className="space-y-6">
                      <h2 className="text-3xl font-display font-bold">What is your primary health goal?</h2>
                      <p className="text-text-secondary">Select the area you want to optimize first.</p>
                      <div className="grid grid-cols-1 gap-4 mt-8">
                        {['Hormone Optimization', 'Cognitive Performance', 'Longevity & Aging', 'Weight Management', 'General Wellness'].map((goal, i) => (
                          <button key={i} onClick={handleNext} className="w-full text-left px-6 py-4 rounded-xl border border-surface-3 bg-surface-2 hover:border-secondary/50 hover:bg-surface-3 transition-all flex justify-between items-center group">
                            <span className="font-medium">{goal}</span>
                            <ArrowRight className="w-5 h-5 text-text-secondary group-hover:text-secondary group-hover:translate-x-1 transition-all" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-6">
                      <h2 className="text-3xl font-display font-bold">How quickly are you looking to start?</h2>
                      <p className="text-text-secondary">This helps us prioritize your clinical routing.</p>
                      <div className="grid grid-cols-1 gap-4 mt-8">
                        {['Immediately (Within 48 hours)', 'This week', 'Within a month', 'Just exploring options'].map((urgency, i) => (
                          <button key={i} onClick={handleNext} className="w-full text-left px-6 py-4 rounded-xl border border-surface-3 bg-surface-2 hover:border-secondary/50 hover:bg-surface-3 transition-all flex justify-between items-center group">
                            <span className="font-medium">{urgency}</span>
                            <ArrowRight className="w-5 h-5 text-text-secondary group-hover:text-secondary group-hover:translate-x-1 transition-all" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-6">
                      <h2 className="text-3xl font-display font-bold">Are you willing to complete lab work?</h2>
                      <p className="text-text-secondary">Comprehensive blood work is required for most advanced protocols.</p>
                      <div className="grid grid-cols-1 gap-4 mt-8">
                        <button onClick={handleNext} className="w-full text-left px-6 py-4 rounded-xl border border-surface-3 bg-surface-2 hover:border-secondary/50 hover:bg-surface-3 transition-all flex justify-between items-center group">
                          <span className="font-medium">Yes, I have recent labs</span>
                          <ArrowRight className="w-5 h-5 text-text-secondary group-hover:text-secondary group-hover:translate-x-1 transition-all" />
                        </button>
                        <button onClick={handleNext} className="w-full text-left px-6 py-4 rounded-xl border border-surface-3 bg-surface-2 hover:border-secondary/50 hover:bg-surface-3 transition-all flex justify-between items-center group">
                          <span className="font-medium">Yes, I need to order labs</span>
                          <ArrowRight className="w-5 h-5 text-text-secondary group-hover:text-secondary group-hover:translate-x-1 transition-all" />
                        </button>
                        <button onClick={handleNext} className="w-full text-left px-6 py-4 rounded-xl border border-surface-3 bg-surface-2 hover:border-secondary/50 hover:bg-surface-3 transition-all flex justify-between items-center group">
                          <span className="font-medium">No, I am not willing to do lab work</span>
                          <ArrowRight className="w-5 h-5 text-text-secondary group-hover:text-secondary group-hover:translate-x-1 transition-all" />
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 4 && (
                    <div className="space-y-6">
                      <h2 className="text-3xl font-display font-bold">Final Details</h2>
                      <p className="text-text-secondary">Where should we send your clinical match?</p>
                      <div className="space-y-4 mt-8">
                        <div>
                          <label className="block text-sm font-medium text-text-secondary mb-1">Full Name</label>
                          <input type="text" className="w-full h-12 px-4 bg-surface-1 border border-surface-3 rounded-lg text-text-primary focus:outline-none focus:border-secondary/50 focus:ring-1 focus:ring-secondary/50 transition-all" placeholder="John Doe" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-text-secondary mb-1">Email Address</label>
                          <input type="email" className="w-full h-12 px-4 bg-surface-1 border border-surface-3 rounded-lg text-text-primary focus:outline-none focus:border-secondary/50 focus:ring-1 focus:ring-secondary/50 transition-all" placeholder="john@example.com" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-text-secondary mb-1">Zip Code</label>
                          <input type="text" className="w-full h-12 px-4 bg-surface-1 border border-surface-3 rounded-lg text-text-primary focus:outline-none focus:border-secondary/50 focus:ring-1 focus:ring-secondary/50 transition-all" placeholder="10001" />
                        </div>
                        <Button variant="secondary" size="lg" className="w-full mt-4" onClick={handleNext}>
                          Analyze & Match
                        </Button>
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
                  <p className="text-secondary">{`> INITIATING_CLINICAL_ANALYSIS`}</p>
                  <p>{`[OK] Processing biometric markers`}</p>
                  <p>{`[OK] Evaluating protocol fit`}</p>
                  <p>{`[OK] Scanning elite clinic network`}</p>
                </div>
              </motion.div>
            )}

            {step === 5 && !isProcessing && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-8">
                  <CheckCircle2 className="w-10 h-10 text-success" />
                </div>
                <h2 className="text-4xl font-display font-bold mb-4">Analysis Complete</h2>
                <p className="text-xl text-text-secondary mb-8">
                  We've identified 3 elite clinics in your area that specialize in your required protocols.
                </p>
                <Card className="p-6 bg-surface-2 border-surface-3 text-left mb-8">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-text-primary">Apex Longevity Institute</h3>
                      <p className="text-text-secondary">98% Match â€¢ 2.4 miles away</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-success/10 text-success text-sm font-medium">Top Match</span>
                  </div>
                  <div className="flex gap-4 mt-6">
                    <Button variant="secondary" className="flex-grow">Book Consultation</Button>
                    <Button variant="outline" className="flex-grow">View Profile</Button>
                  </div>
                </Card>
                <Link to="/directory" className="text-text-secondary hover:text-text-primary font-medium transition-colors">
                  View all matched clinics
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
