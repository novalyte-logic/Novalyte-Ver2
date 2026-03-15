import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp, getDocs, query, where, limit } from 'firebase/firestore';
import { db } from '@/src/firebase';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Shield, Activity, ArrowRight, CheckCircle2, ChevronLeft, Brain, Zap, AlertCircle, Calendar, Clock, Lock, MapPin, Star } from 'lucide-react';

type AssessmentData = {
  goal: string;
  symptoms: string[];
  urgency: string;
  paymentPreference: string;
  budget: string;
  labWork: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  zip: string;
};

const initialData: AssessmentData = {
  goal: '',
  symptoms: [],
  urgency: '',
  paymentPreference: '',
  budget: '',
  labWork: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  zip: ''
};

const symptomsByGoal: Record<string, string[]> = {
  'Hormone Optimization': ['Low Energy / Fatigue', 'Decreased Libido', 'Brain Fog', 'Loss of Muscle Mass', 'Stubborn Body Fat', 'Mood Swings'],
  'Cognitive Performance': ['Brain Fog', 'Poor Focus', 'Memory Issues', 'Afternoon Crashes', 'Anxiety', 'Poor Sleep Quality'],
  'Longevity & Aging': ['Joint Pain', 'Slow Recovery', 'Poor Sleep Quality', 'Decreased Stamina', 'Skin Aging', 'Metabolic Slowdown'],
  'Weight Management': ['Stubborn Body Fat', 'Cravings', 'Slow Metabolism', 'Low Energy / Fatigue', 'Joint Pain', 'Poor Sleep Quality'],
  'General Wellness': ['Low Energy / Fatigue', 'Poor Sleep Quality', 'Stress / Anxiety', 'Frequent Illness', 'Digestive Issues', 'Brain Fog']
};

export function PatientAssessment() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<AssessmentData>(initialData);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<'qualified' | 'disqualified' | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [matchedClinic, setMatchedClinic] = useState<any>(null);
  const [patientId, setPatientId] = useState<string | null>(null);
  const [assessmentId, setAssessmentId] = useState<string | null>(null);

  const totalSteps = 7;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      processAssessment();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const updateData = (field: keyof AssessmentData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const toggleSymptom = (symptom: string) => {
    setData(prev => {
      const current = prev.symptoms;
      if (current.includes(symptom)) {
        return { ...prev, symptoms: current.filter(s => s !== symptom) };
      } else {
        return { ...prev, symptoms: [...current, symptom] };
      }
    });
  };

  const processAssessment = async () => {
    setIsProcessing(true);
    
    try {
      const isDisqualified = 
        data.labWork === 'No, I am not willing to do lab work' || 
        (data.paymentPreference === 'Insurance Only' && data.budget === 'Under $200/mo');
      
      const status = isDisqualified ? 'disqualified' : 'qualified';

      // Save patient
      const patientRef = await addDoc(collection(db, 'patients'), {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        zip: data.zip,
        createdAt: serverTimestamp()
      });
      setPatientId(patientRef.id);

      // Save assessment
      const assessmentRef = await addDoc(collection(db, 'assessments'), {
        patientId: patientRef.id,
        treatmentInterest: data.goal,
        symptoms: data.symptoms,
        urgency: data.urgency,
        budget: data.budget,
        paymentPreference: data.paymentPreference,
        labWork: data.labWork,
        status: status,
        createdAt: serverTimestamp()
      });
      setAssessmentId(assessmentRef.id);

      // Real Clinic Matching Logic
      if (!isDisqualified) {
        const clinicsRef = collection(db, 'clinics');
        // Simple matching: find active clinics that have the goal in their specialties
        const q = query(
          clinicsRef, 
          where('status', '==', 'active'),
          where('specialties', 'array-contains', data.goal),
          limit(5)
        );
        
        const querySnapshot = await getDocs(q);
        const matchedClinics: any[] = [];
        querySnapshot.forEach((doc) => {
          matchedClinics.push({ id: doc.id, ...doc.data() });
        });

        // If no specialty match, just get any active clinics
        if (matchedClinics.length === 0) {
          const fallbackQ = query(clinicsRef, where('status', '==', 'active'), limit(3));
          const fallbackSnapshot = await getDocs(fallbackQ);
          fallbackSnapshot.forEach((doc) => {
            matchedClinics.push({ id: doc.id, ...doc.data() });
          });
        }

        // Pick the best match (for now, just the first one)
        const bestMatch = matchedClinics[0] || {
          id: 'fallback-clinic',
          name: "Apex Longevity & Performance",
          specialties: [data.goal],
          city: "Austin",
          state: "TX",
          rating: 4.9,
          pricingTier: "elite"
        };
        
        setMatchedClinic(bestMatch);

        // Save lead
        await addDoc(collection(db, 'leads'), {
          patientId: patientRef.id,
          clinicId: bestMatch.id,
          assessmentId: assessmentRef.id,
          status: 'new',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }

      setResult(status);
      setStep(totalSteps + 1);
    } catch (error) {
      console.error("Error saving assessment:", error);
      setResult('disqualified');
      setStep(totalSteps + 1);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBookConsultation = () => {
    setShowBooking(true);
  };

  const confirmBooking = async () => {
    if (!patientId || !matchedClinic) return;

    try {
      await addDoc(collection(db, 'bookings'), {
        patientId,
        clinicId: matchedClinic.id,
        assessmentId,
        date: new Date().toISOString(), // In a real app, this would be the selected date
        status: 'confirmed',
        createdAt: serverTimestamp()
      });

      setBookingStep(2);
      setTimeout(() => {
        navigate('/mens-trivia', { state: { fromBooking: true } });
      }, 2500);
    } catch (error) {
      console.error("Error saving booking:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070A] flex flex-col">
      <header className="h-20 border-b border-surface-3/50 bg-surface-1/50 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2">
          <Activity className="w-6 h-6 text-secondary" />
          <span className="font-display font-bold text-xl tracking-tight text-white">
            Novalyte <span className="text-secondary">AI</span>
          </span>
        </Link>
        <div className="flex items-center gap-2 text-xs font-mono text-text-secondary bg-surface-2/50 px-3 py-1.5 rounded-full border border-surface-3">
          <Shield className="w-3 h-3 text-success" /> HIPAA Aligned
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-secondary/10 via-background to-background" />
        
        <div className="w-full max-w-2xl relative z-10">
          <AnimatePresence mode="wait">
            {step <= totalSteps && !isProcessing && (
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
                    className={`text-text-secondary hover:text-white flex items-center gap-1 transition-colors ${step === 1 ? 'opacity-0 pointer-events-none' : ''}`}
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <div className="flex gap-1.5">
                    {Array.from({ length: totalSteps }).map((_, i) => (
                      <div key={i} className={`w-8 h-1.5 rounded-full transition-colors duration-300 ${i + 1 <= step ? 'bg-secondary' : 'bg-surface-3'}`} />
                    ))}
                  </div>
                </div>

                <Card className="p-8 md:p-12 bg-surface-1/80 backdrop-blur-xl border-surface-3 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-[64px] pointer-events-none" />
                  
                  <div className="relative z-10">
                    {step === 1 && (
                      <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-mono uppercase tracking-wider mb-2">
                          <Activity className="w-3 h-3" /> Step 1 of {totalSteps}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-white">What is your primary health goal?</h2>
                        <p className="text-text-secondary text-lg">Select the area you want to optimize first. This helps us tailor your assessment.</p>
                        <div className="grid grid-cols-1 gap-3 mt-8">
                          {Object.keys(symptomsByGoal).map((goal, i) => (
                            <button 
                              key={i} 
                              onClick={() => { updateData('goal', goal); handleNext(); }} 
                              className={`w-full text-left px-6 py-4 rounded-xl border transition-all flex justify-between items-center group ${data.goal === goal ? 'border-secondary bg-secondary/10 text-white' : 'border-surface-3 bg-surface-2 hover:border-secondary/50 text-text-secondary hover:text-white'}`}
                            >
                              <span className="font-medium text-lg">{goal}</span>
                              <ArrowRight className={`w-5 h-5 transition-all ${data.goal === goal ? 'text-secondary' : 'text-surface-3 group-hover:text-secondary group-hover:translate-x-1'}`} />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-mono uppercase tracking-wider mb-2">
                          <Activity className="w-3 h-3" /> Step 2 of {totalSteps}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-white">What symptoms are you experiencing?</h2>
                        <p className="text-text-secondary text-lg">Select all that apply. This data is encrypted and used only for clinical matching.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
                          {(symptomsByGoal[data.goal || 'General Wellness'] || []).map((symptom, i) => {
                            const isSelected = data.symptoms.includes(symptom);
                            return (
                              <button 
                                key={i} 
                                onClick={() => toggleSymptom(symptom)} 
                                className={`text-left px-4 py-3 rounded-xl border transition-all flex items-center gap-3 ${isSelected ? 'border-secondary bg-secondary/10 text-white' : 'border-surface-3 bg-surface-2 hover:border-secondary/50 text-text-secondary hover:text-white'}`}
                              >
                                <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-secondary border-secondary' : 'border-surface-3'}`}>
                                  {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                                </div>
                                <span className="font-medium">{symptom}</span>
                              </button>
                            );
                          })}
                        </div>
                        <Button 
                          size="lg" 
                          className="w-full mt-8 bg-secondary hover:bg-secondary-hover text-white border-none" 
                          onClick={handleNext}
                          disabled={data.symptoms.length === 0}
                        >
                          Continue
                        </Button>
                      </div>
                    )}

                    {step === 3 && (
                      <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-mono uppercase tracking-wider mb-2">
                          <Clock className="w-3 h-3" /> Step 3 of {totalSteps}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-white">How quickly are you looking to start?</h2>
                        <p className="text-text-secondary text-lg">This helps us prioritize your clinical routing and find clinics with immediate availability.</p>
                        <div className="grid grid-cols-1 gap-3 mt-8">
                          {['Immediately (Within 48 hours)', 'This week', 'Within a month', 'Just exploring options'].map((urgency, i) => (
                            <button 
                              key={i} 
                              onClick={() => { updateData('urgency', urgency); handleNext(); }} 
                              className={`w-full text-left px-6 py-4 rounded-xl border transition-all flex justify-between items-center group ${data.urgency === urgency ? 'border-secondary bg-secondary/10 text-white' : 'border-surface-3 bg-surface-2 hover:border-secondary/50 text-text-secondary hover:text-white'}`}
                            >
                              <span className="font-medium text-lg">{urgency}</span>
                              <ArrowRight className={`w-5 h-5 transition-all ${data.urgency === urgency ? 'text-secondary' : 'text-surface-3 group-hover:text-secondary group-hover:translate-x-1'}`} />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {step === 4 && (
                      <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-mono uppercase tracking-wider mb-2">
                          <Shield className="w-3 h-3" /> Step 4 of {totalSteps}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-white">How do you plan to pay for treatment?</h2>
                        <p className="text-text-secondary text-lg">Elite optimization clinics often operate outside standard insurance models to provide superior care.</p>
                        <div className="grid grid-cols-1 gap-3 mt-8">
                          {[
                            { label: 'Out of Pocket / Cash Pay', desc: 'I am willing to invest directly in my health.' },
                            { label: 'HSA / FSA', desc: 'I plan to use health savings accounts.' },
                            { label: 'Insurance Only', desc: 'I only want clinics that accept my insurance.' }
                          ].map((option, i) => (
                            <button 
                              key={i} 
                              onClick={() => { updateData('paymentPreference', option.label); handleNext(); }} 
                              className={`w-full text-left px-6 py-4 rounded-xl border transition-all flex flex-col group ${data.paymentPreference === option.label ? 'border-secondary bg-secondary/10 text-white' : 'border-surface-3 bg-surface-2 hover:border-secondary/50 text-text-secondary hover:text-white'}`}
                            >
                              <span className="font-bold text-lg mb-1">{option.label}</span>
                              <span className="text-sm opacity-80">{option.desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {step === 5 && (
                      <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-mono uppercase tracking-wider mb-2">
                          <Activity className="w-3 h-3" /> Step 5 of {totalSteps}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-white">What is your monthly health investment budget?</h2>
                        <p className="text-text-secondary text-lg">This ensures we match you with clinics whose protocols align with your financial readiness.</p>
                        <div className="grid grid-cols-1 gap-3 mt-8">
                          {['Under $200/mo', '$200 - $500/mo', '$500 - $1,000/mo', '$1,000+/mo'].map((budget, i) => (
                            <button 
                              key={i} 
                              onClick={() => { updateData('budget', budget); handleNext(); }} 
                              className={`w-full text-left px-6 py-4 rounded-xl border transition-all flex justify-between items-center group ${data.budget === budget ? 'border-secondary bg-secondary/10 text-white' : 'border-surface-3 bg-surface-2 hover:border-secondary/50 text-text-secondary hover:text-white'}`}
                            >
                              <span className="font-medium text-lg">{budget}</span>
                              <ArrowRight className={`w-5 h-5 transition-all ${data.budget === budget ? 'text-secondary' : 'text-surface-3 group-hover:text-secondary group-hover:translate-x-1'}`} />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {step === 6 && (
                      <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-mono uppercase tracking-wider mb-2">
                          <Activity className="w-3 h-3" /> Step 6 of {totalSteps}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-white">Are you willing to complete lab work?</h2>
                        <p className="text-text-secondary text-lg">Comprehensive blood work is required for safe, effective, and personalized advanced protocols.</p>
                        <div className="grid grid-cols-1 gap-3 mt-8">
                          {[
                            'Yes, I have recent labs (within 3 months)',
                            'Yes, I am willing to order new labs',
                            'No, I am not willing to do lab work'
                          ].map((option, i) => (
                            <button 
                              key={i} 
                              onClick={() => { updateData('labWork', option); handleNext(); }} 
                              className={`w-full text-left px-6 py-4 rounded-xl border transition-all flex justify-between items-center group ${data.labWork === option ? 'border-secondary bg-secondary/10 text-white' : 'border-surface-3 bg-surface-2 hover:border-secondary/50 text-text-secondary hover:text-white'}`}
                            >
                              <span className="font-medium text-lg">{option}</span>
                              <ArrowRight className={`w-5 h-5 transition-all ${data.labWork === option ? 'text-secondary' : 'text-surface-3 group-hover:text-secondary group-hover:translate-x-1'}`} />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {step === 7 && (
                      <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-mono uppercase tracking-wider mb-2">
                          <Lock className="w-3 h-3" /> Final Step
                        </div>
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-white">Where should we send your clinical match?</h2>
                        <p className="text-text-secondary text-lg">Your data is encrypted and will only be shared with your matched clinic.</p>
                        <div className="space-y-4 mt-8">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-text-secondary mb-1">First Name</label>
                              <input 
                                type="text" 
                                value={data.firstName}
                                onChange={(e) => updateData('firstName', e.target.value)}
                                className="w-full h-12 px-4 bg-surface-2 border border-surface-3 rounded-lg text-white focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all" 
                                placeholder="John" 
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-text-secondary mb-1">Last Name</label>
                              <input 
                                type="text" 
                                value={data.lastName}
                                onChange={(e) => updateData('lastName', e.target.value)}
                                className="w-full h-12 px-4 bg-surface-2 border border-surface-3 rounded-lg text-white focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all" 
                                placeholder="Doe" 
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">Email Address</label>
                            <input 
                              type="email" 
                              value={data.email}
                              onChange={(e) => updateData('email', e.target.value)}
                              className="w-full h-12 px-4 bg-surface-2 border border-surface-3 rounded-lg text-white focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all" 
                              placeholder="john@example.com" 
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-text-secondary mb-1">Phone Number</label>
                              <input 
                                type="tel" 
                                value={data.phone}
                                onChange={(e) => updateData('phone', e.target.value)}
                                className="w-full h-12 px-4 bg-surface-2 border border-surface-3 rounded-lg text-white focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all" 
                                placeholder="(555) 123-4567" 
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-text-secondary mb-1">Zip Code</label>
                              <input 
                                type="text" 
                                value={data.zip}
                                onChange={(e) => updateData('zip', e.target.value)}
                                className="w-full h-12 px-4 bg-surface-2 border border-surface-3 rounded-lg text-white focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all" 
                                placeholder="10001" 
                              />
                            </div>
                          </div>
                          
                          <Button 
                            size="lg" 
                            className="w-full mt-6 bg-secondary hover:bg-secondary-hover text-white border-none shadow-[0_0_20px_rgba(139,92,246,0.2)]" 
                            onClick={handleNext}
                            disabled={!data.firstName || !data.email || !data.zip}
                          >
                            Analyze & Match <Brain className="ml-2 w-5 h-5" />
                          </Button>
                          <p className="text-xs text-center text-text-secondary mt-4">
                            By continuing, you agree to our Terms of Service and Privacy Policy.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            )}

            {isProcessing && (
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center space-y-8 py-12"
              >
                <div className="relative w-40 h-40 mx-auto">
                  <div className="absolute inset-0 rounded-full border-t-2 border-secondary animate-spin" />
                  <div className="absolute inset-2 rounded-full border-r-2 border-primary animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                  <div className="absolute inset-4 rounded-full border-b-2 border-success animate-spin" style={{ animationDuration: '2s' }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Brain className="w-12 h-12 text-secondary animate-pulse" />
                  </div>
                </div>
                <h2 className="text-3xl font-display font-bold text-white">Analyzing Clinical Profile</h2>
                <div className="space-y-3 font-mono text-sm text-text-secondary max-w-sm mx-auto text-left bg-surface-1 p-6 rounded-xl border border-surface-3">
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-secondary">{`> INITIATING_TRIAGE_ENGINE`}</motion.p>
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>{`[OK] Evaluating symptom cluster: ${data.goal}`}</motion.p>
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>{`[OK] Assessing financial readiness`}</motion.p>
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.0 }}>{`[OK] Scanning elite clinic network in ${data.zip || 'your area'}`}</motion.p>
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }} className="text-success">{`> MATCH_COMPUTATION_COMPLETE`}</motion.p>
                </div>
              </motion.div>
            )}

            {step > totalSteps && !isProcessing && result === 'qualified' && !showBooking && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-8 border border-success/20">
                  <CheckCircle2 className="w-10 h-10 text-success" />
                </div>
                <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Clinical Match Found</h2>
                <p className="text-xl text-text-secondary mb-8 max-w-xl mx-auto">
                  Based on your symptoms, goals, and readiness, we've identified an elite clinic that specializes in your exact needs.
                </p>
                
                <Card className="p-8 bg-surface-1/80 backdrop-blur-xl border-surface-3 text-left mb-8 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-success/5 rounded-full blur-[32px]" />
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-3 py-1 rounded-full bg-success/10 text-success text-xs font-bold uppercase tracking-wider border border-success/20">
                            {matchedClinic?.rating ? `${Math.round(matchedClinic.rating * 20)}% Clinical Match` : '98% Clinical Match'}
                          </span>
                          <span className="text-sm text-text-secondary">
                            {matchedClinic?.city ? `${matchedClinic.city}, ${matchedClinic.state}` : '2.4 miles away'}
                          </span>
                        </div>
                        <h3 className="text-2xl font-bold text-white">{matchedClinic?.name || 'Apex Longevity & Performance'}</h3>
                        <p className="text-text-secondary mt-1">Specializes in {data.goal}</p>
                      </div>
                      <div className="w-16 h-16 rounded-xl bg-surface-2 border border-surface-3 flex items-center justify-center">
                        <Activity className="w-8 h-8 text-secondary" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="p-4 rounded-lg bg-surface-2/50 border border-surface-3">
                        <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Availability</p>
                        <p className="font-medium text-white text-lg">This Week</p>
                      </div>
                      <div className="p-4 rounded-lg bg-surface-2/50 border border-surface-3">
                        <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Pricing Tier</p>
                        <p className="font-medium text-white text-lg capitalize">{matchedClinic?.pricingTier || 'Elite'}</p>
                      </div>
                    </div>

                    <Button size="lg" className="w-full bg-secondary hover:bg-secondary-hover text-white border-none shadow-lg h-14 text-lg" onClick={handleBookConsultation}>
                      <Calendar className="w-5 h-5 mr-2" /> Request Consultation
                    </Button>
                  </div>
                </Card>
                
                <p className="text-sm text-text-secondary">
                  Not ready to book? <Link to="/directory" className="text-secondary hover:underline">Browse other clinics</Link>
                </p>
              </motion.div>
            )}

            {step > totalSteps && !isProcessing && result === 'disqualified' && (
              <motion.div
                key="disqualified"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="w-20 h-20 rounded-full bg-warning/10 flex items-center justify-center mx-auto mb-8 border border-warning/20">
                  <AlertCircle className="w-10 h-10 text-warning" />
                </div>
                <h2 className="text-4xl font-display font-bold text-white mb-4">Alternative Paths Recommended</h2>
                <p className="text-lg text-text-secondary mb-8 max-w-xl mx-auto leading-relaxed">
                  Based on your responses, our elite clinic network may not be the best fit right now. These clinics typically require comprehensive lab work and operate outside of standard insurance models.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 text-left">
                  <Card className="p-6 bg-surface-1/80 border-surface-3 hover:border-primary/50 transition-colors cursor-pointer group">
                    <Zap className="w-8 h-8 text-primary mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Explore Supplements</h3>
                    <p className="text-sm text-text-secondary mb-4">Discover clinical-grade OTC supplements to start optimizing today.</p>
                    <Link to="/marketplace/supplements" className="text-primary font-medium flex items-center text-sm group-hover:underline">
                      Shop Marketplace <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Card>
                  <Card className="p-6 bg-surface-1/80 border-surface-3 hover:border-secondary/50 transition-colors cursor-pointer group">
                    <Brain className="w-8 h-8 text-secondary mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Men's Health Trivia</h3>
                    <p className="text-sm text-text-secondary mb-4">Test your knowledge and learn more about health optimization.</p>
                    <Link to="/mens-trivia" className="text-secondary font-medium flex items-center text-sm group-hover:underline">
                      Play Now <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Card>
                </div>
              </motion.div>
            )}

            {showBooking && (
              <motion.div
                key="booking"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                {bookingStep === 1 ? (
                  <>
                    <h2 className="text-3xl font-display font-bold text-white mb-4">Select a Time</h2>
                    <p className="text-text-secondary mb-8">Choose a time for your initial consultation with {matchedClinic?.name || 'Apex Longevity'}.</p>
                    
                    <Card className="p-6 bg-surface-1/80 border-surface-3 text-left mb-8">
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        {['Today', 'Tomorrow', 'Wednesday'].map((day, i) => (
                          <div key={i} className={`p-3 text-center rounded-lg border cursor-pointer transition-colors ${i === 1 ? 'bg-secondary/10 border-secondary text-white' : 'bg-surface-2 border-surface-3 text-text-secondary hover:bg-surface-3'}`}>
                            <p className="font-bold">{day}</p>
                            <p className="text-xs opacity-80">Oct {14 + i}</p>
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {['09:00 AM', '10:30 AM', '01:00 PM', '03:45 PM'].map((time, i) => (
                          <div key={i} className="p-3 text-center rounded-lg border border-surface-3 bg-surface-2 text-white hover:border-secondary hover:bg-secondary/5 cursor-pointer transition-colors">
                            {time}
                          </div>
                        ))}
                      </div>
                    </Card>
                    
                    <Button size="lg" className="w-full bg-secondary hover:bg-secondary-hover text-white border-none h-14 text-lg" onClick={confirmBooking}>
                      Confirm Appointment
                    </Button>
                  </>
                ) : (
                  <div className="py-12">
                    <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-8 border border-success/20">
                      <CheckCircle2 className="w-10 h-10 text-success" />
                    </div>
                    <h2 className="text-4xl font-display font-bold text-white mb-4">Consultation Confirmed</h2>
                    <p className="text-xl text-text-secondary mb-8">
                      Your appointment is set. We're redirecting you to your dashboard...
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
