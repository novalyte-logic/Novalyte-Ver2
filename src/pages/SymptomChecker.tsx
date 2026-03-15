import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Activity, ArrowRight, ChevronLeft, Shield, AlertTriangle, CheckCircle2, Bot, Brain, ActivitySquare, Stethoscope, Clock } from 'lucide-react';

const SYMPTOMS = [
  'Chronic Fatigue',
  'Brain Fog / Focus Issues',
  'Decreased Libido',
  'Unexplained Weight Gain',
  'Muscle Loss / Weakness',
  'Sleep Disturbances',
  'Joint Pain / Recovery Issues',
  'Mood Swings / Irritability'
];

const DURATIONS = [
  { id: 'days', label: 'Just started (Days)', score: 1 },
  { id: 'weeks', label: 'A few weeks', score: 2 },
  { id: 'months', label: 'Several months', score: 3 },
  { id: 'years', label: 'More than a year', score: 4 }
];

const SEVERITIES = [
  { id: 'mild', label: 'Mild', desc: 'Noticeable but manageable', color: 'text-primary', border: 'hover:border-primary/50' },
  { id: 'moderate', label: 'Moderate', desc: 'Affecting daily performance', color: 'text-amber-400', border: 'hover:border-amber-400/50' },
  { id: 'severe', label: 'Severe', desc: 'Significant disruption to life', color: 'text-red-400', border: 'hover:border-red-400/50' }
];

export function SymptomChecker() {
  const [step, setStep] = useState(0);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [duration, setDuration] = useState<string>('');
  const [severity, setSeverity] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisText, setAnalysisText] = useState('');
  const navigate = useNavigate();

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleNext = () => {
    if (step === 3) {
      setIsProcessing(true);
      setStep(4);
    } else {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(prev => prev - 1);
  };

  // Simulated AI Processing
  useEffect(() => {
    if (isProcessing) {
      const texts = [
        "Initializing symptom matrix...",
        "Cross-referencing endocrine patterns...",
        "Evaluating metabolic markers...",
        "Generating clinical recommendations..."
      ];
      
      let i = 0;
      setAnalysisText(texts[0]);
      
      const interval = setInterval(() => {
        i++;
        if (i < texts.length) {
          setAnalysisText(texts[i]);
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setIsProcessing(false);
            setStep(5); // Results step
          }, 800);
        }
      }, 800);
      
      return () => clearInterval(interval);
    }
  }, [isProcessing]);

  // Calculate a mock "Clinical Match Score" based on inputs
  const calculateScore = () => {
    let score = 40; // Base score
    score += selectedSymptoms.length * 5;
    if (duration === 'months' || duration === 'years') score += 10;
    if (severity === 'moderate') score += 10;
    if (severity === 'severe') score += 20;
    return Math.min(score, 98); // Cap at 98%
  };

  return (
    <div className="min-h-screen bg-[#05070A] text-text-primary pt-24 pb-20 flex flex-col relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-secondary/10 to-transparent blur-3xl rounded-full" />
      </div>

      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 relative z-10">
        <div className="w-full max-w-2xl">
          
          {/* Header & Progress */}
          {step > 0 && step < 4 && (
            <div className="mb-8 flex items-center justify-between">
              <button 
                onClick={handleBack}
                className="text-text-secondary hover:text-white flex items-center gap-1 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <div 
                    key={i} 
                    className={`w-12 h-1.5 rounded-full transition-colors duration-300 ${i <= step ? 'bg-primary shadow-[0_0_8px_rgba(6,182,212,0.5)]' : 'bg-surface-3'}`} 
                  />
                ))}
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            
            {/* STEP 0: Intro */}
            {step === 0 && (
              <motion.div
                key="step-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="p-8 md:p-12 bg-[#0B0F14] border-surface-3 text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/20">
                    <ActivitySquare className="w-10 h-10 text-primary" />
                  </div>
                  <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
                    Clinical Pre-Assessment
                  </h1>
                  <p className="text-lg text-text-secondary mb-8 max-w-lg mx-auto leading-relaxed">
                    Our AI-guided symptom checker helps map your current health profile to identify potential endocrine or metabolic optimizations.
                  </p>
                  
                  <div className="bg-surface-1 border border-surface-3 rounded-xl p-4 mb-8 flex items-start gap-3 text-left">
                    <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-text-secondary">
                      <strong className="text-white">Medical Disclaimer:</strong> This tool provides informational guidance only and is not a substitute for professional medical diagnosis or emergency care.
                    </p>
                  </div>

                  <Button size="lg" className="w-full md:w-auto px-12 h-14 text-lg" onClick={handleNext}>
                    Acknowledge & Start
                  </Button>
                </Card>
              </motion.div>
            )}

            {/* STEP 1: Symptoms */}
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-8 md:p-10 bg-[#0B0F14] border-surface-3">
                  <div className="flex items-center gap-3 mb-6">
                    <Bot className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-display font-bold text-white">What are you experiencing?</h2>
                  </div>
                  <p className="text-text-secondary mb-8">Select all symptoms that apply to your current state.</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                    {SYMPTOMS.map((symptom) => {
                      const isSelected = selectedSymptoms.includes(symptom);
                      return (
                        <button
                          key={symptom}
                          onClick={() => toggleSymptom(symptom)}
                          className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${
                            isSelected 
                              ? 'bg-primary/10 border-primary shadow-[0_0_10px_rgba(6,182,212,0.15)]' 
                              : 'bg-surface-1 border-surface-3 hover:border-text-secondary/50'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                            isSelected ? 'bg-primary border-primary' : 'border-text-secondary/50 bg-surface-2'
                          }`}>
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#05070A]" />}
                          </div>
                          <span className={`font-medium ${isSelected ? 'text-white' : 'text-text-secondary'}`}>
                            {symptom}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  
                  <Button 
                    size="lg" 
                    className="w-full" 
                    onClick={handleNext}
                    disabled={selectedSymptoms.length === 0}
                  >
                    Continue
                  </Button>
                </Card>
              </motion.div>
            )}

            {/* STEP 2: Duration */}
            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-8 md:p-10 bg-[#0B0F14] border-surface-3">
                  <div className="flex items-center gap-3 mb-6">
                    <Clock className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-display font-bold text-white">How long has this been happening?</h2>
                  </div>
                  <p className="text-text-secondary mb-8">Duration helps us determine the chronicity of your symptoms.</p>
                  
                  <div className="space-y-3 mb-8">
                    {DURATIONS.map((dur) => {
                      const isSelected = duration === dur.id;
                      return (
                        <button
                          key={dur.id}
                          onClick={() => {
                            setDuration(dur.id);
                            setTimeout(handleNext, 300); // Auto-advance
                          }}
                          className={`w-full flex items-center justify-between p-5 rounded-xl border transition-all text-left ${
                            isSelected 
                              ? 'bg-primary/10 border-primary shadow-[0_0_10px_rgba(6,182,212,0.15)]' 
                              : 'bg-surface-1 border-surface-3 hover:border-text-secondary/50'
                          }`}
                        >
                          <span className={`font-medium ${isSelected ? 'text-white' : 'text-text-secondary'}`}>
                            {dur.label}
                          </span>
                          <ArrowRight className={`w-5 h-5 transition-transform ${isSelected ? 'text-primary translate-x-1' : 'text-surface-3'}`} />
                        </button>
                      );
                    })}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* STEP 3: Severity */}
            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-8 md:p-10 bg-[#0B0F14] border-surface-3">
                  <div className="flex items-center gap-3 mb-6">
                    <Activity className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-display font-bold text-white">How severe is the impact?</h2>
                  </div>
                  <p className="text-text-secondary mb-8">Select the level of disruption to your daily life and performance.</p>
                  
                  <div className="space-y-3 mb-8">
                    {SEVERITIES.map((sev) => {
                      const isSelected = severity === sev.id;
                      return (
                        <button
                          key={sev.id}
                          onClick={() => {
                            setSeverity(sev.id);
                            setTimeout(handleNext, 300); // Auto-advance
                          }}
                          className={`w-full flex items-center justify-between p-5 rounded-xl border transition-all text-left ${
                            isSelected 
                              ? `bg-surface-2 border-${sev.color.split('-')[1]}` 
                              : `bg-surface-1 border-surface-3 ${sev.border}`
                          }`}
                        >
                          <div>
                            <span className={`block font-bold text-lg mb-1 ${isSelected ? sev.color : 'text-white'}`}>
                              {sev.label}
                            </span>
                            <span className="text-sm text-text-secondary">{sev.desc}</span>
                          </div>
                          <ArrowRight className={`w-5 h-5 transition-transform ${isSelected ? sev.color + ' translate-x-1' : 'text-surface-3'}`} />
                        </button>
                      );
                    })}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* STEP 4: Processing */}
            {step === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <div className="relative w-32 h-32 mx-auto mb-8">
                  {/* Outer spinning ring */}
                  <div className="absolute inset-0 rounded-full border-t-2 border-primary/30 animate-spin" style={{ animationDuration: '3s' }} />
                  {/* Inner spinning ring */}
                  <div className="absolute inset-2 rounded-full border-r-2 border-secondary/50 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                  {/* Center icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Brain className="w-10 h-10 text-primary animate-pulse" />
                  </div>
                  {/* Scanning laser line */}
                  <motion.div 
                    className="absolute left-0 right-0 h-[2px] bg-primary shadow-[0_0_10px_#06B6D4]"
                    initial={{ top: '0%' }}
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                </div>
                
                <h3 className="text-xl font-display font-bold text-white mb-4">AI Analysis in Progress</h3>
                <div className="h-6 flex items-center justify-center">
                  <p className="font-mono text-sm text-primary">{`> ${analysisText}`}</p>
                </div>
              </motion.div>
            )}

            {/* STEP 5: Results */}
            {step === 5 && (
              <motion.div
                key="step-5"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="p-8 md:p-10 bg-[#0B0F14] border-primary/30 relative overflow-hidden">
                  {/* Success glow */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
                  
                  <div className="flex flex-col md:flex-row gap-8 mb-8 pb-8 border-b border-surface-3">
                    {/* Score Box */}
                    <div className="flex-shrink-0 w-full md:w-48 bg-surface-1 border border-surface-3 rounded-2xl p-6 text-center flex flex-col justify-center items-center">
                      <span className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-2">Clinical Match</span>
                      <div className="text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-primary to-secondary">
                        {calculateScore()}%
                      </div>
                      <span className="text-xs text-text-secondary mt-2">Optimization Potential</span>
                    </div>
                    
                    {/* Insights */}
                    <div className="flex-grow flex flex-col justify-center">
                      <h2 className="text-2xl font-display font-bold text-white mb-3">Symptom Profile Generated</h2>
                      <p className="text-text-secondary leading-relaxed mb-4">
                        Your reported cluster of <strong className="text-white">{selectedSymptoms.length} symptoms</strong> lasting for <strong className="text-white">{DURATIONS.find(d => d.id === duration)?.label.toLowerCase()}</strong> indicates a high probability of underlying endocrine or metabolic friction.
                      </p>
                      <div className="flex items-center gap-2 text-sm font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-lg w-fit">
                        <Stethoscope className="w-4 h-4" />
                        Clinical intervention is highly recommended.
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 mb-8">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Shield className="w-5 h-5 text-secondary" /> Recommended Next Steps
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-surface-1 border border-surface-3 p-4 rounded-xl">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                          <span className="text-primary font-bold">1</span>
                        </div>
                        <h4 className="font-bold text-white mb-1">Comprehensive Blood Panel</h4>
                        <p className="text-sm text-text-secondary">Testosterone, Free T, Estradiol, and Thyroid markers to establish a baseline.</p>
                      </div>
                      <div className="bg-surface-1 border border-surface-3 p-4 rounded-xl">
                        <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center mb-3">
                          <span className="text-secondary font-bold">2</span>
                        </div>
                        <h4 className="font-bold text-white mb-1">Specialist Consultation</h4>
                        <p className="text-sm text-text-secondary">Review your biomarkers with a certified hormone optimization provider.</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      size="lg" 
                      className="flex-grow h-14 text-lg"
                      onClick={() => navigate('/patient/assessment')}
                    >
                      Start Full Clinical Assessment
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="flex-grow h-14 text-lg"
                      onClick={() => navigate('/directory')}
                    >
                      Browse Clinic Directory
                    </Button>
                  </div>
                  
                  <p className="text-xs text-text-secondary text-center mt-6">
                    Disclaimer: This pre-assessment provides informational guidance only and is not a substitute for professional medical advice, diagnosis, or treatment.
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

