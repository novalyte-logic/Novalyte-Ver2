import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, ChevronRight, ShieldCheck, Stethoscope, 
  MapPin, Clock, DollarSign, FileText, Upload, ArrowRight,
  Activity, Lock
} from 'lucide-react';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';

type Step = 'identity' | 'credentials' | 'specialty' | 'availability' | 'review' | 'success';

export function PractitionerOnboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>('identity');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    role: '',
    licenseState: '',
    licenseNumber: '',
    npi: '',
    yearsExperience: '',
    primarySpecialty: '',
    protocols: [] as string[],
    availabilityType: '',
    targetRate: '',
    travelWillingness: ''
  });

  const updateForm = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleProtocol = (protocol: string) => {
    setFormData(prev => ({
      ...prev,
      protocols: prev.protocols.includes(protocol)
        ? prev.protocols.filter(p => p !== protocol)
        : [...prev.protocols, protocol]
    }));
  };

  const calculateProfileStrength = () => {
    let score = 0;
    if (formData.firstName && formData.lastName) score += 10;
    if (formData.email && formData.phone) score += 10;
    if (formData.location) score += 10;
    if (formData.role && formData.licenseState && formData.licenseNumber) score += 25;
    if (formData.npi) score += 10;
    if (formData.primarySpecialty && formData.yearsExperience) score += 15;
    if (formData.protocols.length > 0) score += 10;
    if (formData.availabilityType && formData.targetRate) score += 10;
    return score;
  };

  const profileStrength = calculateProfileStrength();

  const handleNext = (nextStep: Step) => {
    setCurrentStep(nextStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setCurrentStep('success');
  };

  const steps = [
    { id: 'identity', label: 'Identity' },
    { id: 'credentials', label: 'Credentials' },
    { id: 'specialty', label: 'Specialty' },
    { id: 'availability', label: 'Availability' },
    { id: 'review', label: 'Review' }
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        
        {/* Header & Progress */}
        {currentStep !== 'success' && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-display font-bold mb-2">Network Application</h1>
                <p className="text-text-secondary">Join the exclusive Novalyte Clinical Network.</p>
              </div>
              <div className="hidden md:flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-bold text-white mb-1">Profile Strength</p>
                  <p className="text-xs text-text-secondary">{profileStrength}% Complete</p>
                </div>
                <div className="w-16 h-16 rounded-full border-4 border-surface-3 relative flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="46"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-primary transition-all duration-1000 ease-out"
                      strokeDasharray={`${profileStrength * 2.89} 289`}
                    />
                  </svg>
                  <span className="text-sm font-bold">{profileStrength}%</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-surface-3 rounded-full" />
              <div 
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full transition-all duration-500"
                style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
              />
              {steps.map((step, index) => (
                <div 
                  key={step.id}
                  className={`relative z-10 flex flex-col items-center gap-2 transition-colors duration-300 ${
                    index <= currentStepIndex ? 'text-primary' : 'text-text-secondary'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors duration-300 ${
                    index < currentStepIndex 
                      ? 'bg-primary border-primary text-black' 
                      : index === currentStepIndex
                        ? 'bg-black border-primary text-primary'
                        : 'bg-black border-surface-3 text-text-secondary'
                  }`}>
                    {index < currentStepIndex ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider hidden sm:block">{step.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Form Content */}
        <AnimatePresence mode="wait">
          {currentStep === 'identity' && (
            <motion.div
              key="identity"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="p-8 bg-surface-1 border-surface-3">
                <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">First Name</label>
                    <input 
                      type="text" 
                      value={formData.firstName}
                      onChange={(e) => updateForm('firstName', e.target.value)}
                      className="w-full bg-[#0B0F14] border border-surface-3 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                      placeholder="James"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Last Name</label>
                    <input 
                      type="text" 
                      value={formData.lastName}
                      onChange={(e) => updateForm('lastName', e.target.value)}
                      className="w-full bg-[#0B0F14] border border-surface-3 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                      placeholder="Wilson"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Email Address</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => updateForm('email', e.target.value)}
                      className="w-full bg-[#0B0F14] border border-surface-3 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                      placeholder="dr.wilson@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => updateForm('phone', e.target.value)}
                      className="w-full bg-[#0B0F14] border border-surface-3 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-text-secondary mb-2">Primary Location (City, State)</label>
                    <input 
                      type="text" 
                      value={formData.location}
                      onChange={(e) => updateForm('location', e.target.value)}
                      className="w-full bg-[#0B0F14] border border-surface-3 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                      placeholder="Austin, TX"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button 
                    onClick={() => handleNext('credentials')}
                    disabled={!formData.firstName || !formData.lastName || !formData.email}
                    className="bg-primary hover:bg-primary/90 text-black font-bold px-8"
                  >
                    Next: Credentials <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {currentStep === 'credentials' && (
            <motion.div
              key="credentials"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="p-8 bg-surface-1 border-surface-3">
                <div className="flex items-center gap-3 mb-6">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold">Clinical Credentials</h2>
                </div>
                <p className="text-text-secondary mb-8">We verify all licenses against national databases to ensure network integrity.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-text-secondary mb-2">Professional Role</label>
                    <select 
                      value={formData.role}
                      onChange={(e) => updateForm('role', e.target.value)}
                      className="w-full bg-[#0B0F14] border border-surface-3 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none"
                    >
                      <option value="">Select your role...</option>
                      <option value="MD">Medical Doctor (MD)</option>
                      <option value="DO">Doctor of Osteopathic Medicine (DO)</option>
                      <option value="NP">Nurse Practitioner (NP)</option>
                      <option value="PA">Physician Assistant (PA)</option>
                      <option value="RN">Registered Nurse (RN)</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Primary License State</label>
                    <input 
                      type="text" 
                      value={formData.licenseState}
                      onChange={(e) => updateForm('licenseState', e.target.value)}
                      className="w-full bg-[#0B0F14] border border-surface-3 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                      placeholder="e.g. TX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">License Number</label>
                    <input 
                      type="text" 
                      value={formData.licenseNumber}
                      onChange={(e) => updateForm('licenseNumber', e.target.value)}
                      className="w-full bg-[#0B0F14] border border-surface-3 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                      placeholder="Enter license number"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-text-secondary mb-2">NPI Number (Optional)</label>
                    <input 
                      type="text" 
                      value={formData.npi}
                      onChange={(e) => updateForm('npi', e.target.value)}
                      className="w-full bg-[#0B0F14] border border-surface-3 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                      placeholder="10-digit NPI"
                    />
                  </div>
                </div>

                <div className="p-6 border border-dashed border-surface-3 rounded-xl bg-[#0B0F14] text-center mb-8">
                  <Upload className="w-8 h-8 text-text-secondary mx-auto mb-3" />
                  <p className="font-bold text-white mb-1">Upload CV / Resume</p>
                  <p className="text-sm text-text-secondary mb-4">PDF, DOCX up to 10MB</p>
                  <Button variant="outline" className="border-surface-3 text-white hover:bg-surface-2">
                    Select File
                  </Button>
                </div>

                <div className="flex justify-between">
                  <Button 
                    variant="ghost"
                    onClick={() => handleNext('identity')}
                    className="text-text-secondary hover:text-white"
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={() => handleNext('specialty')}
                    disabled={!formData.role || !formData.licenseState || !formData.licenseNumber}
                    className="bg-primary hover:bg-primary/90 text-black font-bold px-8"
                  >
                    Next: Specialty <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {currentStep === 'specialty' && (
            <motion.div
              key="specialty"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="p-8 bg-surface-1 border-surface-3">
                <div className="flex items-center gap-3 mb-6">
                  <Stethoscope className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold">Specialty & Experience</h2>
                </div>
                
                <div className="space-y-8 mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Primary Specialty</label>
                      <select 
                        value={formData.primarySpecialty}
                        onChange={(e) => updateForm('primarySpecialty', e.target.value)}
                        className="w-full bg-[#0B0F14] border border-surface-3 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none"
                      >
                        <option value="">Select specialty...</option>
                        <option value="Men's Health / TRT">Men's Health / TRT</option>
                        <option value="Longevity & Anti-Aging">Longevity & Anti-Aging</option>
                        <option value="Sports Medicine">Sports Medicine</option>
                        <option value="Aesthetics">Aesthetics</option>
                        <option value="General Practice">General Practice</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Years of Experience</label>
                      <select 
                        value={formData.yearsExperience}
                        onChange={(e) => updateForm('yearsExperience', e.target.value)}
                        className="w-full bg-[#0B0F14] border border-surface-3 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none"
                      >
                        <option value="">Select experience...</option>
                        <option value="1-3">1-3 years</option>
                        <option value="4-7">4-7 years</option>
                        <option value="8-12">8-12 years</option>
                        <option value="12+">12+ years</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-4">Protocol Familiarity (Select all that apply)</label>
                    <div className="flex flex-wrap gap-3">
                      {[
                        'Testosterone Replacement', 'Peptide Therapy', 'IV Hydration', 
                        'Weight Loss (GLP-1)', 'Hair Restoration', 'Shockwave Therapy', 
                        'PRP Injections', 'Stem Cell Therapy'
                      ].map(protocol => (
                        <button
                          key={protocol}
                          onClick={() => toggleProtocol(protocol)}
                          className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                            formData.protocols.includes(protocol)
                              ? 'bg-primary/20 border-primary text-primary'
                              : 'bg-[#0B0F14] border-surface-3 text-text-secondary hover:border-surface-4'
                          }`}
                        >
                          {protocol}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button 
                    variant="ghost"
                    onClick={() => handleNext('credentials')}
                    className="text-text-secondary hover:text-white"
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={() => handleNext('availability')}
                    disabled={!formData.primarySpecialty || !formData.yearsExperience}
                    className="bg-primary hover:bg-primary/90 text-black font-bold px-8"
                  >
                    Next: Availability <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {currentStep === 'availability' && (
            <motion.div
              key="availability"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="p-8 bg-surface-1 border-surface-3">
                <div className="flex items-center gap-3 mb-6">
                  <Clock className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold">Availability & Preferences</h2>
                </div>
                
                <div className="space-y-8 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-4">Desired Engagement Type</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {['Full-Time', 'Part-Time', 'Per Diem / PRN'].map(type => (
                        <button
                          key={type}
                          onClick={() => updateForm('availabilityType', type)}
                          className={`p-4 rounded-xl border text-center transition-colors ${
                            formData.availabilityType === type
                              ? 'bg-primary/10 border-primary text-primary font-bold'
                              : 'bg-[#0B0F14] border-surface-3 text-text-secondary hover:border-surface-4'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Target Compensation</label>
                      <select 
                        value={formData.targetRate}
                        onChange={(e) => updateForm('targetRate', e.target.value)}
                        className="w-full bg-[#0B0F14] border border-surface-3 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none"
                      >
                        <option value="">Select range...</option>
                        <option value="$50-$75/hr">$50 - $75 / hr</option>
                        <option value="$75-$100/hr">$75 - $100 / hr</option>
                        <option value="$100-$150/hr">$100 - $150 / hr</option>
                        <option value="$150+/hr">$150+ / hr</option>
                        <option value="Salary Negotiable">Salary Negotiable</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Travel Willingness</label>
                      <select 
                        value={formData.travelWillingness}
                        onChange={(e) => updateForm('travelWillingness', e.target.value)}
                        className="w-full bg-[#0B0F14] border border-surface-3 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none"
                      >
                        <option value="">Select preference...</option>
                        <option value="Local Only">Local Only (No Travel)</option>
                        <option value="Up to 50 miles">Up to 50 miles</option>
                        <option value="Statewide">Statewide</option>
                        <option value="Remote / Telehealth Only">Remote / Telehealth Only</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button 
                    variant="ghost"
                    onClick={() => handleNext('specialty')}
                    className="text-text-secondary hover:text-white"
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={() => handleNext('review')}
                    disabled={!formData.availabilityType || !formData.targetRate}
                    className="bg-primary hover:bg-primary/90 text-black font-bold px-8"
                  >
                    Next: Review <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {currentStep === 'review' && (
            <motion.div
              key="review"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="p-8 bg-surface-1 border-surface-3">
                <div className="flex items-center gap-3 mb-6">
                  <FileText className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold">Review Application</h2>
                </div>
                
                <div className="space-y-6 mb-8">
                  <div className="p-5 rounded-xl bg-[#0B0F14] border border-surface-3">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-white">Identity & Contact</h3>
                      <button onClick={() => handleNext('identity')} className="text-xs font-bold text-primary">Edit</button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-text-secondary mb-1">Name</p>
                        <p className="text-white">{formData.firstName} {formData.lastName}</p>
                      </div>
                      <div>
                        <p className="text-text-secondary mb-1">Email</p>
                        <p className="text-white">{formData.email}</p>
                      </div>
                      <div>
                        <p className="text-text-secondary mb-1">Location</p>
                        <p className="text-white">{formData.location}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-xl bg-[#0B0F14] border border-surface-3">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-white">Credentials & Specialty</h3>
                      <button onClick={() => handleNext('credentials')} className="text-xs font-bold text-primary">Edit</button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-text-secondary mb-1">Role & License</p>
                        <p className="text-white">{formData.role} • {formData.licenseState} ({formData.licenseNumber})</p>
                      </div>
                      <div>
                        <p className="text-text-secondary mb-1">Specialty</p>
                        <p className="text-white">{formData.primarySpecialty} ({formData.yearsExperience} yrs)</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-text-secondary mb-1">Protocols</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {formData.protocols.map(p => (
                            <span key={p} className="px-2 py-1 bg-surface-2 rounded text-xs text-white">{p}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-xl bg-[#0B0F14] border border-surface-3">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-white">Availability</h3>
                      <button onClick={() => handleNext('availability')} className="text-xs font-bold text-primary">Edit</button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-text-secondary mb-1">Type</p>
                        <p className="text-white">{formData.availabilityType}</p>
                      </div>
                      <div>
                        <p className="text-text-secondary mb-1">Target Rate</p>
                        <p className="text-white">{formData.targetRate}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/10 border border-primary/20 mb-8 text-sm">
                  <Lock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-white">
                    By submitting this application, you agree to our <span className="text-primary cursor-pointer">Terms of Service</span> and consent to a standard credential verification background check. Your profile remains hidden from current employers.
                  </p>
                </div>

                <div className="flex justify-between">
                  <Button 
                    variant="ghost"
                    onClick={() => handleNext('availability')}
                    className="text-text-secondary hover:text-white"
                    disabled={isSubmitting}
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-primary hover:bg-primary/90 text-black font-bold px-8"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {currentStep === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-8 border border-success/20">
                <CheckCircle2 className="w-12 h-12 text-success" />
              </div>
              <h2 className="text-4xl font-display font-bold mb-4">Application Received</h2>
              <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
                Your profile is now under review by our credentialing team. We verify all licenses within 48 hours.
              </p>
              
              <Card className="p-8 bg-surface-1 border-surface-3 max-w-xl mx-auto text-left mb-12">
                <h3 className="font-bold text-white mb-6">Next Steps</h3>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">1</div>
                    <div>
                      <p className="font-bold text-white mb-1">Credential Verification</p>
                      <p className="text-sm text-text-secondary">Our team verifies your NPI and state licenses against national databases.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center text-text-secondary font-bold shrink-0">2</div>
                    <div>
                      <p className="font-bold text-white mb-1">Network Activation</p>
                      <p className="text-sm text-text-secondary">Once approved, your profile becomes visible to premium clinics matching your criteria.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center text-text-secondary font-bold shrink-0">3</div>
                    <div>
                      <p className="font-bold text-white mb-1">Interview Requests</p>
                      <p className="text-sm text-text-secondary">Receive direct interview requests and offers from clinic operators.</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Button 
                onClick={() => navigate('/practitioners/profile')}
                className="bg-primary hover:bg-primary/90 text-black font-bold px-8 py-3"
              >
                View Your Profile
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
