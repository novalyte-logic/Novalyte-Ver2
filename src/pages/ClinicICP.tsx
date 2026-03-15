import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Target, Users, MapPin, DollarSign, Activity, ChevronRight, ChevronLeft, 
  CheckCircle2, ShieldCheck, Zap, BrainCircuit, ArrowRight, Building2
} from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';

export function ClinicICP() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Clinic Info
    clinicName: '',
    website: '',
    contactName: '',
    contactEmail: '',
    // Step 2: Services
    primaryService: '',
    secondaryServices: [] as string[],
    // Step 3: Patient Demographics & Geography
    targetAgeRange: '',
    targetGender: 'Men',
    geographyType: 'local',
    radius: '25',
    states: '',
    // Step 4: Lead Quality & Capacity
    minBudget: '',
    urgencyLevel: '',
    monthlyCapacity: '',
    targetCPA: '',
    // Step 5: Competitors & Notes
    competitors: '',
    additionalNotes: ''
  });

  const updateForm = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const toggleService = (service: string) => {
    setFormData(prev => {
      const current = prev.secondaryServices;
      if (current.includes(service)) {
        return { ...prev, secondaryServices: current.filter(s => s !== service) };
      } else {
        return { ...prev, secondaryServices: [...current, service] };
      }
    });
  };

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call to /api/clinic-icp
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#05070A] pt-24 pb-12 px-4 flex items-center justify-center font-sans">
        <Card className="max-w-xl w-full bg-surface-1 border-surface-3 p-8 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary via-primary to-secondary" />
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-secondary/20 rounded-full blur-[80px]" />
          
          <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-success/20">
            <CheckCircle2 className="w-10 h-10 text-success" />
          </div>
          
          <h2 className="text-3xl font-display font-bold text-white mb-4">ICP Profile Activated</h2>
          <p className="text-text-secondary mb-8 text-lg">
            Your Ideal Patient Profile has been locked into the routing engine. We are now configuring custom lead funnels based on your exact parameters.
          </p>
          
          <div className="bg-[#0B0F14] rounded-xl p-6 border border-surface-3 mb-8 text-left space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" /> Next Steps
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-surface-2 flex items-center justify-center shrink-0 text-xs font-bold text-white">1</div>
                <p className="text-sm text-text-secondary"><strong className="text-white">Funnel Generation:</strong> Our AI is building targeted acquisition assets matching your service mix.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-surface-2 flex items-center justify-center shrink-0 text-xs font-bold text-white">2</div>
                <p className="text-sm text-text-secondary"><strong className="text-white">Pilot Leads:</strong> You will receive a small batch of pilot leads to calibrate quality within 48 hours.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-surface-2 flex items-center justify-center shrink-0 text-xs font-bold text-white">3</div>
                <p className="text-sm text-text-secondary"><strong className="text-white">Dashboard Access:</strong> Your clinic dashboard will unlock once the first lead is routed.</p>
              </div>
            </div>
          </div>
          
          <Link to="/">
            <Button className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold h-12 text-lg">
              Return to Homepage
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070A] pt-24 pb-12 px-4 font-sans relative">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-secondary/10 via-[#05070A] to-[#05070A] pointer-events-none" />
      
      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-bold uppercase tracking-widest mb-4">
            <BrainCircuit className="w-4 h-4" /> Routing Intelligence
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight mb-4">
            Define Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">Ideal Patient</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Tell the routing engine exactly who you want to treat, where they are, and what quality you require. We use this to filter and route leads directly to your pipeline.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 px-1">
            <span className={step >= 1 ? 'text-secondary' : ''}>Identity</span>
            <span className={step >= 2 ? 'text-secondary' : ''}>Services</span>
            <span className={step >= 3 ? 'text-secondary' : ''}>Targeting</span>
            <span className={step >= 4 ? 'text-secondary' : ''}>Capacity</span>
            <span className={step >= 5 ? 'text-secondary' : ''}>Intel</span>
          </div>
          <div className="h-2 bg-surface-2 rounded-full overflow-hidden flex">
            <motion.div 
              className="h-full bg-gradient-to-r from-secondary to-primary"
              initial={{ width: '20%' }}
              animate={{ width: `${(step / 5) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Form Container */}
        <Card className="bg-surface-1/80 backdrop-blur-xl border-surface-3 p-0 overflow-hidden shadow-2xl">
          <div className="p-8">
            <AnimatePresence mode="wait">
              
              {/* Step 1: Clinic Info */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 rounded-xl bg-secondary/10 text-secondary border border-secondary/20"><Building2 className="w-6 h-6" /></div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Clinic Identity</h2>
                      <p className="text-sm text-text-secondary">Basic information for account mapping.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-text-secondary uppercase tracking-wider mb-2">Clinic Name</label>
                      <input 
                        type="text" 
                        value={formData.clinicName}
                        onChange={(e) => updateForm('clinicName', e.target.value)}
                        className="w-full bg-[#0B0F14] border border-surface-3 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary/50 transition-colors"
                        placeholder="e.g. Apex Men's Health"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-text-secondary uppercase tracking-wider mb-2">Website URL</label>
                      <input 
                        type="text" 
                        value={formData.website}
                        onChange={(e) => updateForm('website', e.target.value)}
                        className="w-full bg-[#0B0F14] border border-surface-3 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary/50 transition-colors"
                        placeholder="https://"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-text-secondary uppercase tracking-wider mb-2">Primary Contact Name</label>
                        <input 
                          type="text" 
                          value={formData.contactName}
                          onChange={(e) => updateForm('contactName', e.target.value)}
                          className="w-full bg-[#0B0F14] border border-surface-3 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary/50 transition-colors"
                          placeholder="Dr. John Smith"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-text-secondary uppercase tracking-wider mb-2">Contact Email</label>
                        <input 
                          type="email" 
                          value={formData.contactEmail}
                          onChange={(e) => updateForm('contactEmail', e.target.value)}
                          className="w-full bg-[#0B0F14] border border-surface-3 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary/50 transition-colors"
                          placeholder="john@apexhealth.com"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Services */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 rounded-xl bg-secondary/10 text-secondary border border-secondary/20"><Activity className="w-6 h-6" /></div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Service Mix</h2>
                      <p className="text-sm text-text-secondary">What treatments drive your revenue?</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-text-secondary uppercase tracking-wider mb-3">Primary Revenue Driver</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {['TRT / Hormone Optimization', 'Weight Management (GLP-1)', 'Peptide Therapy', 'Longevity / Anti-Aging', 'Sexual Health', 'Hair Restoration'].map(service => (
                          <button
                            key={service}
                            onClick={() => updateForm('primaryService', service)}
                            className={`p-4 rounded-xl border text-left transition-all ${
                              formData.primaryService === service 
                                ? 'bg-secondary/10 border-secondary text-white shadow-[0_0_15px_rgba(139,92,246,0.15)]' 
                                : 'bg-[#0B0F14] border-surface-3 text-text-secondary hover:border-surface-4'
                            }`}
                          >
                            <span className="font-medium">{service}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-text-secondary uppercase tracking-wider mb-3">Secondary Services (Select all that apply)</label>
                      <div className="flex flex-wrap gap-2">
                        {['IV Therapy', 'Aesthetics', 'Cognitive Enhancement', 'Diagnostics/Labs', 'Primary Care', 'Regenerative Medicine'].map(service => (
                          <button
                            key={service}
                            onClick={() => toggleService(service)}
                            className={`px-4 py-2 rounded-lg border text-sm transition-all ${
                              formData.secondaryServices.includes(service)
                                ? 'bg-secondary/10 border-secondary text-white' 
                                : 'bg-[#0B0F14] border-surface-3 text-text-secondary hover:border-surface-4'
                            }`}
                          >
                            {service}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Demographics & Geo */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 rounded-xl bg-secondary/10 text-secondary border border-secondary/20"><MapPin className="w-6 h-6" /></div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Targeting & Geography</h2>
                      <p className="text-sm text-text-secondary">Who are they and where are they located?</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-text-secondary uppercase tracking-wider mb-2">Target Age Range</label>
                        <select 
                          value={formData.targetAgeRange}
                          onChange={(e) => updateForm('targetAgeRange', e.target.value)}
                          className="w-full bg-[#0B0F14] border border-surface-3 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary/50 transition-colors appearance-none"
                        >
                          <option value="" disabled>Select range...</option>
                          <option value="25-35">25 - 35</option>
                          <option value="35-45">35 - 45</option>
                          <option value="45-55">45 - 55</option>
                          <option value="55+">55+</option>
                          <option value="all">Any Age</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-text-secondary uppercase tracking-wider mb-2">Target Gender</label>
                        <select 
                          value={formData.targetGender}
                          onChange={(e) => updateForm('targetGender', e.target.value)}
                          className="w-full bg-[#0B0F14] border border-surface-3 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary/50 transition-colors appearance-none"
                        >
                          <option value="Men">Men Only</option>
                          <option value="Women">Women Only</option>
                          <option value="Both">Both Men & Women</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-surface-3">
                      <label className="block text-sm font-bold text-text-secondary uppercase tracking-wider mb-3">Geographic Model</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                        <button
                          onClick={() => updateForm('geographyType', 'local')}
                          className={`p-4 rounded-xl border text-left transition-all ${
                            formData.geographyType === 'local' 
                              ? 'bg-secondary/10 border-secondary text-white' 
                              : 'bg-[#0B0F14] border-surface-3 text-text-secondary hover:border-surface-4'
                          }`}
                        >
                          <div className="font-bold mb-1">Local / In-Person</div>
                          <div className="text-xs opacity-70">Patients visit a physical clinic.</div>
                        </button>
                        <button
                          onClick={() => updateForm('geographyType', 'telehealth')}
                          className={`p-4 rounded-xl border text-left transition-all ${
                            formData.geographyType === 'telehealth' 
                              ? 'bg-secondary/10 border-secondary text-white' 
                              : 'bg-[#0B0F14] border-surface-3 text-text-secondary hover:border-surface-4'
                          }`}
                        >
                          <div className="font-bold mb-1">Telehealth / Remote</div>
                          <div className="text-xs opacity-70">State-wide or national coverage.</div>
                        </button>
                      </div>

                      {formData.geographyType === 'local' ? (
                        <div>
                          <label className="block text-sm font-bold text-text-secondary uppercase tracking-wider mb-2">Max Driving Radius (Miles)</label>
                          <input 
                            type="number" 
                            value={formData.radius}
                            onChange={(e) => updateForm('radius', e.target.value)}
                            className="w-full bg-[#0B0F14] border border-surface-3 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary/50 transition-colors"
                            placeholder="e.g. 25"
                          />
                        </div>
                      ) : (
                        <div>
                          <label className="block text-sm font-bold text-text-secondary uppercase tracking-wider mb-2">Licensed States</label>
                          <input 
                            type="text" 
                            value={formData.states}
                            onChange={(e) => updateForm('states', e.target.value)}
                            className="w-full bg-[#0B0F14] border border-surface-3 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary/50 transition-colors"
                            placeholder="e.g. FL, TX, NY (or 'All 50')"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Quality & Capacity */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 rounded-xl bg-secondary/10 text-secondary border border-secondary/20"><Target className="w-6 h-6" /></div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Quality & Capacity</h2>
                      <p className="text-sm text-text-secondary">Set the bar for lead qualification.</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-text-secondary uppercase tracking-wider mb-2">Minimum Monthly Budget</label>
                        <select 
                          value={formData.minBudget}
                          onChange={(e) => updateForm('minBudget', e.target.value)}
                          className="w-full bg-[#0B0F14] border border-surface-3 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary/50 transition-colors appearance-none"
                        >
                          <option value="" disabled>Select minimum...</option>
                          <option value="100">Under $100/mo (Insurance)</option>
                          <option value="200">$200/mo (Cash)</option>
                          <option value="500">$500/mo (Premium)</option>
                          <option value="1000">$1,000+/mo (Concierge)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-text-secondary uppercase tracking-wider mb-2">Required Urgency</label>
                        <select 
                          value={formData.urgencyLevel}
                          onChange={(e) => updateForm('urgencyLevel', e.target.value)}
                          className="w-full bg-[#0B0F14] border border-surface-3 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary/50 transition-colors appearance-none"
                        >
                          <option value="" disabled>Select urgency...</option>
                          <option value="high">High (Ready to book now)</option>
                          <option value="medium">Medium (Researching, ready soon)</option>
                          <option value="any">Any (Include top-of-funnel)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-surface-3">
                      <div>
                        <label className="block text-sm font-bold text-text-secondary uppercase tracking-wider mb-2">Monthly Lead Capacity</label>
                        <input 
                          type="number" 
                          value={formData.monthlyCapacity}
                          onChange={(e) => updateForm('monthlyCapacity', e.target.value)}
                          className="w-full bg-[#0B0F14] border border-surface-3 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary/50 transition-colors"
                          placeholder="e.g. 50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-text-secondary uppercase tracking-wider mb-2">Target CPA ($)</label>
                        <input 
                          type="number" 
                          value={formData.targetCPA}
                          onChange={(e) => updateForm('targetCPA', e.target.value)}
                          className="w-full bg-[#0B0F14] border border-surface-3 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary/50 transition-colors"
                          placeholder="e.g. 150"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 5: Competitors & Notes */}
              {step === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 rounded-xl bg-secondary/10 text-secondary border border-secondary/20"><ShieldCheck className="w-6 h-6" /></div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Intelligence & Notes</h2>
                      <p className="text-sm text-text-secondary">Final context for the routing engine.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-text-secondary uppercase tracking-wider mb-2">Key Competitors</label>
                      <textarea 
                        value={formData.competitors}
                        onChange={(e) => updateForm('competitors', e.target.value)}
                        className="w-full bg-[#0B0F14] border border-surface-3 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary/50 transition-colors min-h-[100px] resize-none"
                        placeholder="Who are patients currently going to instead of you?"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-text-secondary uppercase tracking-wider mb-2">Additional Routing Rules</label>
                      <textarea 
                        value={formData.additionalNotes}
                        onChange={(e) => updateForm('additionalNotes', e.target.value)}
                        className="w-full bg-[#0B0F14] border border-surface-3 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary/50 transition-colors min-h-[120px] resize-none"
                        placeholder="e.g. 'Do not route patients with a history of heart disease' or 'Prioritize patients asking about Semaglutide.'"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Footer Controls */}
          <div className="p-6 bg-[#0B0F14] border-t border-surface-3 flex items-center justify-between">
            <Button 
              variant="outline" 
              onClick={handleBack}
              disabled={step === 1 || isSubmitting}
              className="border-surface-3 bg-surface-1 text-white hover:bg-surface-2 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            
            {step < 5 ? (
              <Button 
                onClick={handleNext}
                className="bg-secondary hover:bg-secondary/90 text-white font-bold"
              >
                Continue <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-secondary hover:bg-secondary/90 text-white font-bold min-w-[160px]"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Lock ICP Profile <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
