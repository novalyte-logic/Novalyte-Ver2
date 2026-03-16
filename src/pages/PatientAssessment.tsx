import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Shield, Activity, ArrowRight, CheckCircle2, ChevronLeft, Brain, Zap, AlertCircle, Calendar, Clock, Lock } from 'lucide-react';
import {
  PublicService,
  type BookingResponse,
  type ClinicAvailabilitySlot,
  type MatchedClinicSummary,
} from '@/src/services/public';
import { AnalyticsEngine } from '@/src/lib/analytics/events';
import { parsePatientAssessmentHandoff } from '@/src/lib/patientJourney';

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

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isValidPhone(value: string) {
  return value.replace(/\D/g, '').length >= 10;
}

function isValidZip(value: string) {
  return /^[A-Za-z0-9 -]{3,10}$/.test(value.trim());
}

export function PatientAssessment() {
  const [searchParams] = useSearchParams();
  const handoff = useMemo(() => parsePatientAssessmentHandoff(searchParams), [searchParams]);
  const [step, setStep] = useState(1);
  const [data, setData] = useState<AssessmentData>(initialData);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<'qualified' | 'disqualified' | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [matchedClinic, setMatchedClinic] = useState<MatchedClinicSummary>(null);
  const [patientId, setPatientId] = useState<string | null>(null);
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [bookingSlots, setBookingSlots] = useState<ClinicAvailabilitySlot[]>([]);
  const [selectedSlotKey, setSelectedSlotKey] = useState('');
  const [assessmentError, setAssessmentError] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [bookingSlotsError, setBookingSlotsError] = useState('');
  const [bookingSlotsLoading, setBookingSlotsLoading] = useState(false);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState<BookingResponse | null>(null);

  const totalSteps = 7;
  const availableSymptoms = useMemo(
    () =>
      [...new Set([...(symptomsByGoal[data.goal || 'General Wellness'] || []), ...data.symptoms])],
    [data.goal, data.symptoms],
  );
  const contactValidationError = useMemo(() => {
    if (!data.firstName.trim() || !data.lastName.trim()) {
      return 'Enter your full name so the matched clinic can identify your intake.';
    }
    if (!isValidEmail(data.email)) {
      return 'Enter a valid email address for follow-up.';
    }
    if (!isValidPhone(data.phone)) {
      return 'Enter a valid phone number for scheduling updates.';
    }
    if (!isValidZip(data.zip)) {
      return 'Enter a valid ZIP or postal code.';
    }
    return '';
  }, [data.email, data.firstName, data.lastName, data.phone, data.zip]);

  useEffect(() => {
    setData((current) => {
      const next = { ...current };
      let changed = false;

      if (!current.goal && handoff.goal) {
        next.goal = handoff.goal;
        changed = true;
      }
      if (!current.urgency && handoff.urgency) {
        next.urgency = handoff.urgency;
        changed = true;
      }
      if (handoff.symptoms.length > 0 && current.symptoms.length === 0) {
        next.symptoms = handoff.symptoms;
        changed = true;
      }

      return changed ? next : current;
    });
  }, [handoff.goal, handoff.urgency, handoff.symptoms]);

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      if (contactValidationError) {
        return;
      }
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
    setAssessmentError('');
    
    try {
      const response = await PublicService.submitPatientAssessment({
        ...data,
        preferredClinicId: handoff.preferredClinicId,
        entryPoint: handoff.entryPoint || 'direct',
      });
      setBookingStep(1);
      setBookingSlots([]);
      setSelectedSlotKey('');
      setBookingError('');
      setBookingSlotsError('');
      setPatientId(response.patientId);
      setAssessmentId(response.assessmentId);
      setMatchedClinic(response.matchedClinic);
      setResult(response.result);
      setBookingResult(null);
      setShowBooking(false);
      AnalyticsEngine.track('assessment_complete', {
        source: handoff.entryPoint || 'patient_assessment',
        result: response.result,
        matchedClinicId: response.matchedClinic?.id || null,
      });
      setStep(totalSteps + 1);
    } catch (error) {
      console.error("Error saving assessment:", error);
      setAssessmentError(
        error instanceof Error ? error.message : 'Unable to submit your clinical assessment right now.',
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const loadBookingAvailability = async (clinicId: string) => {
    setBookingSlotsLoading(true);
    setBookingSlotsError('');

    try {
      const response = await PublicService.getClinicAvailability(clinicId);
      setBookingSlots(response.slots);
      setSelectedSlotKey((current) =>
        response.slots.some((slot) => slot.key === current) ? current : response.slots[0]?.key || '',
      );
    } catch (error) {
      console.error('Error loading booking availability:', error);
      setBookingSlots([]);
      setBookingSlotsError(
        error instanceof Error ? error.message : 'Unable to load consultation windows right now.',
      );
    } finally {
      setBookingSlotsLoading(false);
    }
  };

  const handleBookConsultation = () => {
    if (!matchedClinic) {
      return;
    }
    AnalyticsEngine.track('cta_click', {
      source: 'patient_assessment_match',
      label: 'request_consultation',
      destination: `/clinics/${matchedClinic.id}`,
    });
    setShowBooking(true);
    setBookingStep(1);
    void loadBookingAvailability(matchedClinic.id);
  };

  const confirmBooking = async () => {
    if (!patientId || !matchedClinic || !selectedSlotKey) {
      setBookingError('Select an available consultation window before continuing.');
      return;
    }
    setBookingSubmitting(true);
    setBookingError('');

    try {
      const response = await PublicService.requestBooking({
        patientId,
        clinicId: matchedClinic.id,
        assessmentId,
        requestedSlotKey: selectedSlotKey,
      });
      setBookingResult(response);
      setBookingStep(2);
      AnalyticsEngine.track('cta_click', {
        source: 'patient_assessment_booking',
        label: 'consultation_requested',
        destination: response.followUpPath,
      });
    } catch (error) {
      console.error("Error saving booking:", error);
      setBookingError(
        error instanceof Error ? error.message : 'Unable to send your consultation request right now.',
      );
    } finally {
      setBookingSubmitting(false);
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
                    {handoff.preferredClinicName ? (
                      <div className="mb-6 rounded-xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">
                        We will prioritize <span className="font-semibold text-white">{handoff.preferredClinicName}</span>
                        {handoff.preferredClinicLocation ? ` in ${handoff.preferredClinicLocation}` : ''} during routing if the clinic remains the best active fit for your intake.
                      </div>
                    ) : null}

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
                          {availableSymptoms.map((symptom, i) => {
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
                        {assessmentError ? (
                          <div className="rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
                            {assessmentError}
                          </div>
                        ) : null}
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
                            disabled={
                              isProcessing ||
                              Boolean(contactValidationError)
                            }
                          >
                            {assessmentError ? 'Retry Clinical Match' : 'Analyze & Match'} <Brain className="ml-2 w-5 h-5" />
                          </Button>
                          {contactValidationError && (data.firstName || data.lastName || data.email || data.phone || data.zip) ? (
                            <p className="text-sm text-warning">
                              {contactValidationError}
                            </p>
                          ) : null}
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
                <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
                  {matchedClinic ? 'Clinical Match Found' : 'Qualified for Concierge Routing'}
                </h2>
                <p className="text-xl text-text-secondary mb-8 max-w-xl mx-auto">
                  {matchedClinic
                    ? "Based on your symptoms, goals, and readiness, we've identified an elite clinic that specializes in your exact needs."
                    : "You meet the intake requirements. Our routing team is reviewing live clinic availability and will place you with the best current partner."}
                </p>
                
                <Card className="p-8 bg-surface-1/80 backdrop-blur-xl border-surface-3 text-left mb-8 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-success/5 rounded-full blur-[32px]" />
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-3 py-1 rounded-full bg-success/10 text-success text-xs font-bold uppercase tracking-wider border border-success/20">
                            {matchedClinic?.matchScore ? `${matchedClinic.matchScore}% Clinical Match` : 'Human Review'}
                          </span>
                          <span className="text-sm text-text-secondary">
                            {matchedClinic?.city ? `${matchedClinic.city}, ${matchedClinic.state}` : 'Nationwide network review'}
                          </span>
                        </div>
                        <h3 className="text-2xl font-bold text-white">{matchedClinic?.name || 'Novalyte Concierge Team'}</h3>
                        <p className="text-text-secondary mt-1">Specializes in {data.goal}</p>
                      </div>
                      <div className="w-16 h-16 rounded-xl bg-surface-2 border border-surface-3 flex items-center justify-center">
                        <Activity className="w-8 h-8 text-secondary" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="p-4 rounded-lg bg-surface-2/50 border border-surface-3">
                        <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Availability</p>
                        <p className="font-medium text-white text-lg">{matchedClinic ? 'This Week' : 'Under 24 Hours'}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-surface-2/50 border border-surface-3">
                        <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Pricing Tier</p>
                        <p className="font-medium text-white text-lg capitalize">{matchedClinic?.pricingTier || 'Custom'}</p>
                      </div>
                    </div>

                    {matchedClinic ? (
                      <div className="space-y-3">
                        {matchedClinic.routingReason ? (
                          <p className="text-sm text-text-secondary">
                            {matchedClinic.routingReason}
                          </p>
                        ) : null}
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button size="lg" className="w-full bg-secondary hover:bg-secondary-hover text-white border-none shadow-lg h-14 text-lg" onClick={handleBookConsultation}>
                            <Calendar className="w-5 h-5 mr-2" /> Request Consultation
                          </Button>
                          <Link to={`/clinics/${matchedClinic.id}`} className="w-full">
                            <Button variant="outline" size="lg" className="w-full h-14 text-lg border-surface-3 hover:bg-surface-2">
                              Review Clinic
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <Link to="/contact?role=patient&topic=concierge_routing">
                        <Button size="lg" className="w-full bg-secondary hover:bg-secondary-hover text-white border-none shadow-lg h-14 text-lg">
                          <ArrowRight className="w-5 h-5 mr-2" /> Contact Concierge
                        </Button>
                      </Link>
                    )}
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
                    <h3 className="text-xl font-bold text-white mb-2">Revisit Symptom Review</h3>
                    <p className="text-sm text-text-secondary mb-4">Run the guided symptom checker again if you want additional context before pursuing next steps.</p>
                    <Link to="/symptom-checker" className="text-primary font-medium flex items-center text-sm group-hover:underline">
                      Open Symptom Checker <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Card>
                  <Card className="p-6 bg-surface-1/80 border-surface-3 hover:border-secondary/50 transition-colors cursor-pointer group">
                    <Brain className="w-8 h-8 text-secondary mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Talk to Novalyte AI</h3>
                    <p className="text-sm text-text-secondary mb-4">Get educational guidance on treatment readiness, lab work, and what to do next.</p>
                    <Link to="/ask-ai" className="text-secondary font-medium flex items-center text-sm group-hover:underline">
                      Ask a Question <ArrowRight className="w-4 h-4 ml-1" />
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
                    <h2 className="text-3xl font-display font-bold text-white mb-4">Select a Consultation Window</h2>
                    <p className="text-text-secondary mb-8">Choose a preferred time for your initial consultation request with {matchedClinic?.name || 'your matched clinic'}.</p>
                    {bookingError ? (
                      <div className="mb-6 rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger text-left">
                        {bookingError}
                      </div>
                    ) : null}
                    
                    <Card className="p-6 bg-surface-1/80 border-surface-3 text-left mb-8">
                      {bookingSlotsLoading ? (
                        <div className="rounded-xl border border-surface-3 bg-surface-2/50 px-4 py-5 text-center text-text-secondary">
                          Loading live availability...
                        </div>
                      ) : bookingSlotsError ? (
                        <div className="space-y-4">
                          <div className="rounded-xl border border-danger/20 bg-danger/10 px-4 py-4 text-sm text-danger">
                            {bookingSlotsError}
                          </div>
                          <Button variant="outline" className="w-full" onClick={() => matchedClinic ? void loadBookingAvailability(matchedClinic.id) : undefined}>
                            Retry Availability
                          </Button>
                        </div>
                      ) : bookingSlots.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {bookingSlots.map((slot) => (
                            <button
                              key={slot.key}
                              type="button"
                              onClick={() => setSelectedSlotKey(slot.key)}
                              className={`rounded-xl border p-4 text-left transition-colors ${
                                selectedSlotKey === slot.key
                                  ? 'border-secondary bg-secondary/10 text-white'
                                  : 'border-surface-3 bg-surface-2 hover:border-secondary/50 text-text-secondary hover:text-white'
                              }`}
                            >
                              <p className="font-bold text-white">{slot.dayLabel}</p>
                              <p className="mt-1 text-sm">{slot.timeLabel}</p>
                              <p className="mt-2 text-xs opacity-80">{slot.label}</p>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="rounded-xl border border-surface-3 bg-surface-2/50 px-4 py-5 text-sm text-text-secondary">
                            No consultation windows are currently published for this clinic. You can contact concierge and we will coordinate the next available option.
                          </div>
                          <Link to={`/contact?role=patient&topic=clinic_${encodeURIComponent(matchedClinic?.id || '')}`}>
                            <Button variant="outline" className="w-full">
                              Contact Concierge
                            </Button>
                          </Link>
                        </div>
                      )}
                    </Card>
                    
                    <Button
                      size="lg"
                      className="w-full bg-secondary hover:bg-secondary-hover text-white border-none h-14 text-lg"
                      onClick={confirmBooking}
                      disabled={bookingSubmitting || bookingSlotsLoading || bookingSlots.length === 0 || !selectedSlotKey}
                    >
                      {bookingSubmitting ? 'Sending Request...' : 'Send Consultation Request'}
                    </Button>
                  </>
                ) : (
                  <div className="py-12">
                    <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-8 border border-success/20">
                      <CheckCircle2 className="w-10 h-10 text-success" />
                    </div>
                    <h2 className="text-4xl font-display font-bold text-white mb-4">Consultation Request Sent</h2>
                    <p className="text-xl text-text-secondary mb-4">
                      {bookingResult?.clinicName || matchedClinic?.name} has your preferred slot request.
                    </p>
                    <p className="text-sm text-text-secondary mb-8">
                      {bookingResult?.slotLabel ? `Requested window: ${bookingResult.slotLabel}. ` : ''}
                      Reference ID: <span className="text-white font-medium">{bookingResult?.bookingId}</span>
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Link to={bookingResult?.followUpPath || `/clinics/${matchedClinic?.id || ''}`}>
                        <Button className="w-full sm:w-auto">
                          Review Clinic Profile
                        </Button>
                      </Link>
                      <Link to="/support/patient">
                        <Button variant="outline" className="w-full sm:w-auto border-surface-3 hover:bg-surface-2">
                          Patient Support
                        </Button>
                      </Link>
                      <Link to="/ask-ai">
                        <Button variant="outline" className="w-full sm:w-auto border-surface-3 hover:bg-surface-2">
                          Ask Novalyte AI
                        </Button>
                      </Link>
                    </div>
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
