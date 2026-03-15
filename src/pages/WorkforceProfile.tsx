import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Activity, User, Briefcase, FileText, CheckCircle2, 
  ArrowRight, ShieldCheck, UploadCloud, Star, ChevronLeft,
  Check, AlertCircle, Loader2
} from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';

// Define the form data interface
interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  role: string;
  licenses: string;
  dea: string;
  experience: string;
  protocols: string[];
  employmentType: string[];
  resumeUploaded: boolean;
}

const DEFAULT_DATA: ProfileData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  location: '',
  role: '',
  licenses: '',
  dea: '',
  experience: '',
  protocols: [],
  employmentType: [],
  resumeUploaded: false,
};

const STORAGE_KEY = 'novalyte_workforce_profile';

const PROTOCOLS = [
  'Testosterone Replacement (TRT)', 'Hormone Replacement (HRT)', 
  'Peptide Therapy', 'IV Nutrition', 'Weight Loss (GLP-1)', 
  'Longevity / Anti-aging', 'Aesthetics', 'Phlebotomy'
];

const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract (1099)', 'Per Diem', 'Telehealth Only'];

export function WorkforceProfile() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ProfileData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_DATA;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Auto-save
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const updateForm = (updates: Partial<ProfileData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const toggleArrayItem = (field: 'protocols' | 'employmentType', item: string) => {
    setFormData(prev => {
      const array = prev[field];
      const newArray = array.includes(item) 
        ? array.filter(i => i !== item)
        : [...array, item];
      return { ...prev, [field]: newArray };
    });
  };

  // Calculate Profile Score
  const calculateScore = () => {
    let score = 0;
    if (formData.firstName && formData.lastName) score += 10;
    if (formData.email && formData.phone) score += 10;
    if (formData.location) score += 5;
    if (formData.role) score += 15;
    if (formData.licenses) score += 15;
    if (formData.dea) score += 5;
    if (formData.experience) score += 10;
    if (formData.protocols.length > 0) score += 10;
    if (formData.employmentType.length > 0) score += 5;
    if (formData.resumeUploaded) score += 15;
    return Math.min(score, 100);
  };

  const score = calculateScore();

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (step === 4) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setStep(5); // Success step
        // Clear local storage on successful submission
        localStorage.removeItem(STORAGE_KEY);
      }, 2000);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Simulate upload
    setTimeout(() => {
      updateForm({ resumeUploaded: true });
    }, 800);
  };

  const STEPS = [
    { id: 1, title: 'Identity', icon: User },
    { id: 2, title: 'Credentials', icon: ShieldCheck },
    { id: 3, title: 'Specialties', icon: Briefcase },
    { id: 4, title: 'Review', icon: FileText },
  ];

  if (step === 5) {
    return (
      <div className="min-h-screen bg-[#05070A] flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-8 relative">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="absolute inset-0 rounded-full border-4 border-success/30"
            />
            <CheckCircle2 className="w-12 h-12 text-success" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-4">Profile Submitted</h1>
          <p className="text-text-secondary mb-8">
            Your professional profile has been securely stored. Novalyte AI is now analyzing your credentials to match you with high-growth clinics.
          </p>
          <Card className="p-6 bg-surface-1 border-surface-3 mb-8 text-left">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-text-secondary uppercase tracking-wider">Profile Strength</span>
              <span className="text-secondary font-bold">{score}%</span>
            </div>
            <div className="h-2 bg-surface-2 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-secondary"
              />
            </div>
          </Card>
          <div className="flex flex-col gap-4">
            <Button onClick={() => navigate('/workforce/dashboard')} className="w-full bg-secondary hover:bg-secondary/90 text-white">
              Go to Dashboard
            </Button>
            <Button variant="outline" onClick={() => navigate('/workforce/jobs')} className="w-full border-surface-3 text-white hover:bg-surface-2">
              Browse Opportunities
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070A] flex flex-col selection:bg-secondary/30 selection:text-white">
      {/* Header */}
      <header className="h-20 border-b border-surface-3 bg-[#0B0F14] flex items-center justify-between px-6 sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2">
          <Activity className="w-6 h-6 text-secondary" />
          <span className="font-display font-bold text-xl tracking-tight text-white">Novalyte <span className="text-secondary">AI</span></span>
        </Link>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 text-sm">
            <span className="text-text-secondary">Profile Strength:</span>
            <span className="text-white font-bold">{score}%</span>
            <div className="w-24 h-2 bg-surface-2 rounded-full overflow-hidden ml-2">
              <div className="h-full bg-secondary transition-all duration-500" style={{ width: `${score}%` }} />
            </div>
          </div>
          <Button variant="outline" size="sm" className="border-surface-3 text-text-secondary hover:text-white" onClick={() => navigate('/workforce')}>
            Save & Exit
          </Button>
        </div>
      </header>

      <main className="flex-grow flex flex-col lg:flex-row max-w-7xl w-full mx-auto">
        {/* Sidebar Stepper */}
        <div className="w-full lg:w-80 p-6 lg:p-12 border-b lg:border-b-0 lg:border-r border-surface-3 bg-[#0B0F14]/50">
          <div className="sticky top-32">
            <h2 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-8">Onboarding Flow</h2>
            <div className="space-y-8">
              {STEPS.map((s, i) => {
                const isActive = step === s.id;
                const isPast = step > s.id;
                const Icon = s.icon;
                return (
                  <div key={s.id} className="flex items-start gap-4 relative">
                    {i !== STEPS.length - 1 && (
                      <div className={`absolute left-5 top-10 w-0.5 h-12 -ml-px ${isPast ? 'bg-secondary' : 'bg-surface-3'}`} />
                    )}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors duration-300 ${
                      isActive ? 'border-secondary bg-secondary/10 text-secondary' : 
                      isPast ? 'border-secondary bg-secondary text-white' : 
                      'border-surface-3 bg-surface-1 text-text-secondary'
                    }`}>
                      {isPast ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <div className="pt-2">
                      <p className={`font-bold ${isActive ? 'text-white' : isPast ? 'text-text-secondary' : 'text-text-secondary/50'}`}>
                        {s.title}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-16 p-4 rounded-xl bg-secondary/5 border border-secondary/20">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <p className="text-xs text-text-secondary leading-relaxed">
                  Your data is encrypted and securely stored. We only share your full profile with clinics when you explicitly apply or accept an interview request.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-grow p-6 lg:p-12 max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* STEP 1: IDENTITY */}
              {step === 1 && (
                <>
                  <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">Identity & Contact</h1>
                    <p className="text-text-secondary">Basic information to establish your professional profile.</p>
                  </div>
                  <Card className="p-6 md:p-8 bg-surface-1 border-surface-3 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-text-secondary mb-2 uppercase tracking-wider">First Name</label>
                        <input 
                          type="text" 
                          value={formData.firstName}
                          onChange={(e) => updateForm({ firstName: e.target.value })}
                          className="w-full px-4 py-3 bg-[#0B0F14] border border-surface-3 rounded-xl text-white focus:outline-none focus:border-secondary/50 focus:ring-1 focus:ring-secondary/50 transition-all" 
                          placeholder="Jane" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-text-secondary mb-2 uppercase tracking-wider">Last Name</label>
                        <input 
                          type="text" 
                          value={formData.lastName}
                          onChange={(e) => updateForm({ lastName: e.target.value })}
                          className="w-full px-4 py-3 bg-[#0B0F14] border border-surface-3 rounded-xl text-white focus:outline-none focus:border-secondary/50 focus:ring-1 focus:ring-secondary/50 transition-all" 
                          placeholder="Doe" 
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-text-secondary mb-2 uppercase tracking-wider">Email Address</label>
                        <input 
                          type="email" 
                          value={formData.email}
                          onChange={(e) => updateForm({ email: e.target.value })}
                          className="w-full px-4 py-3 bg-[#0B0F14] border border-surface-3 rounded-xl text-white focus:outline-none focus:border-secondary/50 focus:ring-1 focus:ring-secondary/50 transition-all" 
                          placeholder="jane.doe@example.com" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-text-secondary mb-2 uppercase tracking-wider">Phone Number</label>
                        <input 
                          type="tel" 
                          value={formData.phone}
                          onChange={(e) => updateForm({ phone: e.target.value })}
                          className="w-full px-4 py-3 bg-[#0B0F14] border border-surface-3 rounded-xl text-white focus:outline-none focus:border-secondary/50 focus:ring-1 focus:ring-secondary/50 transition-all" 
                          placeholder="(555) 123-4567" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-text-secondary mb-2 uppercase tracking-wider">Primary Location</label>
                      <input 
                        type="text" 
                        value={formData.location}
                        onChange={(e) => updateForm({ location: e.target.value })}
                        className="w-full px-4 py-3 bg-[#0B0F14] border border-surface-3 rounded-xl text-white focus:outline-none focus:border-secondary/50 focus:ring-1 focus:ring-secondary/50 transition-all" 
                        placeholder="City, State (e.g., Austin, TX)" 
                      />
                    </div>
                  </Card>
                </>
              )}

              {/* STEP 2: CREDENTIALS */}
              {step === 2 && (
                <>
                  <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">Professional Credentials</h1>
                    <p className="text-text-secondary">Your licensure and clinical authority.</p>
                  </div>
                  <Card className="p-6 md:p-8 bg-surface-1 border-surface-3 space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-text-secondary mb-2 uppercase tracking-wider">Primary Role</label>
                      <select 
                        value={formData.role}
                        onChange={(e) => updateForm({ role: e.target.value })}
                        className="w-full px-4 py-3 bg-[#0B0F14] border border-surface-3 rounded-xl text-white focus:outline-none focus:border-secondary/50 focus:ring-1 focus:ring-secondary/50 transition-all appearance-none"
                      >
                        <option value="">Select your primary credential...</option>
                        <option value="MD/DO">Medical Doctor (MD/DO)</option>
                        <option value="NP">Nurse Practitioner (NP)</option>
                        <option value="PA">Physician Assistant (PA)</option>
                        <option value="RN">Registered Nurse (RN)</option>
                        <option value="MA">Medical Assistant (MA)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-text-secondary mb-2 uppercase tracking-wider">Active State Licenses</label>
                      <input 
                        type="text" 
                        value={formData.licenses}
                        onChange={(e) => updateForm({ licenses: e.target.value })}
                        className="w-full px-4 py-3 bg-[#0B0F14] border border-surface-3 rounded-xl text-white focus:outline-none focus:border-secondary/50 focus:ring-1 focus:ring-secondary/50 transition-all" 
                        placeholder="e.g., FL, TX, NY (Comma separated)" 
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-text-secondary mb-2 uppercase tracking-wider">DEA Registration</label>
                        <select 
                          value={formData.dea}
                          onChange={(e) => updateForm({ dea: e.target.value })}
                          className="w-full px-4 py-3 bg-[#0B0F14] border border-surface-3 rounded-xl text-white focus:outline-none focus:border-secondary/50 focus:ring-1 focus:ring-secondary/50 transition-all appearance-none"
                        >
                          <option value="">Select...</option>
                          <option value="Yes">Yes, Active</option>
                          <option value="No">No</option>
                          <option value="Pending">Pending</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-text-secondary mb-2 uppercase tracking-wider">Years of Experience</label>
                        <select 
                          value={formData.experience}
                          onChange={(e) => updateForm({ experience: e.target.value })}
                          className="w-full px-4 py-3 bg-[#0B0F14] border border-surface-3 rounded-xl text-white focus:outline-none focus:border-secondary/50 focus:ring-1 focus:ring-secondary/50 transition-all appearance-none"
                        >
                          <option value="">Select...</option>
                          <option value="0-2">0 - 2 years</option>
                          <option value="3-5">3 - 5 years</option>
                          <option value="6-10">6 - 10 years</option>
                          <option value="10+">10+ years</option>
                        </select>
                      </div>
                    </div>
                  </Card>
                </>
              )}

              {/* STEP 3: SPECIALTIES & RESUME */}
              {step === 3 && (
                <>
                  <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">Specialties & Resume</h1>
                    <p className="text-text-secondary">Highlight your clinical focus areas and upload your CV.</p>
                  </div>
                  <Card className="p-6 md:p-8 bg-surface-1 border-surface-3 space-y-8">
                    
                    <div>
                      <label className="block text-sm font-bold text-text-secondary mb-4 uppercase tracking-wider">Clinical Protocols (Select all that apply)</label>
                      <div className="flex flex-wrap gap-3">
                        {PROTOCOLS.map((protocol) => {
                          const isSelected = formData.protocols.includes(protocol);
                          return (
                            <button
                              key={protocol}
                              onClick={() => toggleArrayItem('protocols', protocol)}
                              className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${
                                isSelected 
                                  ? 'bg-secondary/10 border-secondary text-secondary' 
                                  : 'bg-[#0B0F14] border-surface-3 text-text-secondary hover:border-surface-3/80 hover:text-white'
                              }`}
                            >
                              {protocol}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-text-secondary mb-4 uppercase tracking-wider">Desired Employment Type</label>
                      <div className="flex flex-wrap gap-3">
                        {EMPLOYMENT_TYPES.map((type) => {
                          const isSelected = formData.employmentType.includes(type);
                          return (
                            <button
                              key={type}
                              onClick={() => toggleArrayItem('employmentType', type)}
                              className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${
                                isSelected 
                                  ? 'bg-secondary/10 border-secondary text-secondary' 
                                  : 'bg-[#0B0F14] border-surface-3 text-text-secondary hover:border-surface-3/80 hover:text-white'
                              }`}
                            >
                              {type}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-text-secondary mb-4 uppercase tracking-wider">Resume / CV</label>
                      <div 
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleFileUpload}
                        className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all ${
                          isDragging ? 'border-secondary bg-secondary/5' : 
                          formData.resumeUploaded ? 'border-success/50 bg-success/5' : 
                          'border-surface-3 bg-[#0B0F14] hover:border-secondary/50'
                        }`}
                      >
                        {formData.resumeUploaded ? (
                          <div className="flex flex-col items-center">
                            <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center text-success mb-4">
                              <Check className="w-6 h-6" />
                            </div>
                            <p className="text-white font-bold">Resume Uploaded Successfully</p>
                            <button onClick={() => updateForm({ resumeUploaded: false })} className="text-sm text-text-secondary hover:text-white mt-2 underline">
                              Remove or replace file
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <div className="w-12 h-12 rounded-full bg-surface-2 flex items-center justify-center text-text-secondary mb-4">
                              <UploadCloud className="w-6 h-6" />
                            </div>
                            <p className="text-white font-bold mb-1">Drag and drop your resume here</p>
                            <p className="text-sm text-text-secondary mb-6">PDF, DOCX up to 10MB</p>
                            <Button variant="outline" className="border-surface-3 bg-surface-1 hover:bg-surface-2 relative overflow-hidden">
                              Browse Files
                              <input 
                                type="file" 
                                className="absolute inset-0 opacity-0 cursor-pointer" 
                                onChange={handleFileUpload}
                                accept=".pdf,.doc,.docx"
                              />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                  </Card>
                </>
              )}

              {/* STEP 4: REVIEW */}
              {step === 4 && (
                <>
                  <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">Review Profile</h1>
                    <p className="text-text-secondary">Verify your information before submitting to the network.</p>
                  </div>
                  <Card className="p-6 md:p-8 bg-surface-1 border-surface-3 space-y-8">
                    
                    {/* Identity Summary */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white">Identity</h3>
                        <button onClick={() => setStep(1)} className="text-sm text-secondary hover:text-secondary/80 font-bold">Edit</button>
                      </div>
                      <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[#0B0F14] border border-surface-3">
                        <div>
                          <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Name</p>
                          <p className="text-white font-medium">{formData.firstName || '-'} {formData.lastName || '-'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Location</p>
                          <p className="text-white font-medium">{formData.location || '-'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Email</p>
                          <p className="text-white font-medium">{formData.email || '-'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Phone</p>
                          <p className="text-white font-medium">{formData.phone || '-'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Credentials Summary */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white">Credentials</h3>
                        <button onClick={() => setStep(2)} className="text-sm text-secondary hover:text-secondary/80 font-bold">Edit</button>
                      </div>
                      <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[#0B0F14] border border-surface-3">
                        <div>
                          <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Role</p>
                          <p className="text-white font-medium">{formData.role || '-'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Experience</p>
                          <p className="text-white font-medium">{formData.experience ? `${formData.experience} years` : '-'}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Licenses</p>
                          <p className="text-white font-medium">{formData.licenses || '-'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Specialties Summary */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white">Specialties</h3>
                        <button onClick={() => setStep(3)} className="text-sm text-secondary hover:text-secondary/80 font-bold">Edit</button>
                      </div>
                      <div className="p-4 rounded-xl bg-[#0B0F14] border border-surface-3 space-y-4">
                        <div>
                          <p className="text-xs text-text-secondary uppercase tracking-wider mb-2">Protocols</p>
                          <div className="flex flex-wrap gap-2">
                            {formData.protocols.length > 0 ? formData.protocols.map(p => (
                              <span key={p} className="px-2 py-1 rounded bg-surface-2 text-xs text-white">{p}</span>
                            )) : <span className="text-text-secondary text-sm">-</span>}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-text-secondary uppercase tracking-wider mb-2">Resume</p>
                          <div className="flex items-center gap-2">
                            {formData.resumeUploaded ? (
                              <span className="flex items-center gap-2 text-sm text-success font-medium"><CheckCircle2 className="w-4 h-4" /> Uploaded</span>
                            ) : (
                              <span className="flex items-center gap-2 text-sm text-warning font-medium"><AlertCircle className="w-4 h-4" /> Not Uploaded</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                  </Card>
                </>
              )}

            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="mt-8 pt-8 border-t border-surface-3 flex items-center justify-between">
            <Button 
              variant="outline" 
              onClick={handleBack} 
              disabled={step === 1 || isSubmitting}
              className={`border-surface-3 bg-surface-1 hover:bg-surface-2 ${step === 1 ? 'opacity-0 pointer-events-none' : ''}`}
            >
              <ChevronLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            
            <Button 
              onClick={handleNext} 
              disabled={isSubmitting}
              className="bg-secondary hover:bg-secondary/90 text-white min-w-[140px]"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : step === 4 ? (
                'Submit Profile'
              ) : (
                <>Continue <ArrowRight className="w-4 h-4 ml-2" /></>
              )}
            </Button>
          </div>

        </div>
      </main>
    </div>
  );
}
