import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  Network, 
  Server, 
  Lock,
  ChevronRight,
  ChevronLeft,
  FileText,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/src/lib/auth/AuthContext';
import { AccessCodeAuth } from '@/src/components/auth/AccessCodeAuth';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';

const ONBOARDING_STEPS = [
  { id: 'auth', title: 'Identity Setup', icon: Lock, description: 'Secure Account Creation' },
  { id: 'entity', title: 'Entity Verification', icon: Building2, description: 'NPI & Legal Validation' },
  { id: 'compliance', title: 'Compliance & Security', icon: ShieldCheck, description: 'HIPAA & BAA Setup' },
  { id: 'operations', title: 'Operations Setup', icon: Activity, description: 'EMR & Clinical Workflows' },
  { id: 'connectivity', title: 'Data Readiness', icon: Network, description: 'API & HL7 Integration' }
];

export function ClinicRegister() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    // Entity
    legalName: '',
    npiNumber: '',
    taxId: '',
    adminEmail: '',
    // Compliance
    hipaaOfficer: '',
    hipaaEmail: '',
    baaAccepted: false,
    dataResidency: 'us-east',
    // Operations
    primaryEmr: '',
    telehealth: '',
    monthlyVolume: '',
    // Connectivity
    hl7Capable: 'no',
    webhookUrl: '',
    techContact: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  useEffect(() => {
    if (user && currentStep === 0) {
      setCurrentStep(1);
    }
  }, [currentStep, user]);

  const handleNext = async () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleProvision();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleProvision = async () => {
    if (!user) return;
    setIsProvisioning(true);
    setError('');

    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/auth/clinic-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        let message = 'Failed to submit clinic registration.';
        try {
          const payload = (await response.json()) as { error?: string };
          if (payload.error) {
            message = payload.error;
          }
        } catch {
          // Ignore malformed error payloads.
        }
        throw new Error(message);
      }

      setIsComplete(true);
    } catch (err) {
      console.error("Error provisioning clinic:", err);
      setError(err instanceof Error ? err.message : 'Failed to submit clinic registration. Please contact support.');
    } finally {
      setIsProvisioning(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return true; // Auth step, handled by user presence
      case 1:
        return formData.legalName && formData.npiNumber.length >= 10 && formData.adminEmail;
      case 2:
        return formData.hipaaOfficer && formData.hipaaEmail && formData.baaAccepted;
      case 3:
        return formData.primaryEmr && formData.monthlyVolume;
      case 4:
        return formData.techContact;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-[#05070A] flex flex-col font-sans text-text-primary">
      {/* Enterprise Header */}
      <header className="h-20 border-b border-surface-3 bg-[#0B0F14] flex items-center justify-between px-8 sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-white">
            Novalyte <span className="text-primary">OS</span>
          </span>
        </Link>
        <div className="flex items-center gap-4 text-sm font-mono text-text-secondary">
          <span className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            SOC2 Type II Compliant
          </span>
          <span className="w-px h-4 bg-surface-3" />
          <span className="flex items-center gap-2">
            <Server className="w-4 h-4" />
            Node: US-EAST-1
          </span>
        </div>
      </header>

      <main className="flex-grow flex">
        {/* Sidebar Progress */}
        <div className="hidden lg:block w-80 bg-[#0B0F14] border-r border-surface-3 p-8">
          <div className="mb-12">
            <h2 className="text-sm font-bold tracking-widest text-text-secondary uppercase mb-2">Infrastructure Setup</h2>
            <p className="text-2xl font-display font-bold text-white">Clinic Onboarding</p>
          </div>

          <div className="space-y-8 relative">
            {/* Connecting line */}
            <div className="absolute left-6 top-8 bottom-8 w-px bg-surface-3" />

            {ONBOARDING_STEPS.map((step, index) => {
              const isActive = index === currentStep;
              const isPast = index < currentStep;
              const Icon = step.icon;

              return (
                <div key={step.id} className="relative flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center relative z-10 transition-colors duration-300 ${
                    isActive ? 'bg-primary/20 border border-primary/30 text-primary shadow-[0_0_15px_rgba(6,182,212,0.2)]' :
                    isPast ? 'bg-success/20 border border-success/30 text-success' :
                    'bg-[#05070A] border border-surface-3 text-text-secondary'
                  }`}>
                    {isPast ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                  </div>
                  <div className="pt-1">
                    <h3 className={`font-bold ${isActive ? 'text-white' : isPast ? 'text-text-primary' : 'text-text-secondary'}`}>
                      {step.title}
                    </h3>
                    <p className="text-sm text-text-secondary mt-1">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-grow flex items-center justify-center p-6 lg:p-12 relative overflow-hidden">
          {/* Background grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          
          <div className="w-full max-w-2xl relative z-10">
            {isComplete ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-8 bg-[#0B0F14] border border-surface-3 p-12 rounded-2xl shadow-2xl"
              >
                <div className="w-24 h-24 rounded-full bg-success/10 border border-success/20 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(46,230,166,0.15)]">
                  <CheckCircle2 className="w-12 h-12 text-success" />
                </div>
                <div>
                  <h2 className="text-4xl font-display font-bold text-white mb-4">Registration Submitted</h2>
                  <p className="text-lg text-text-secondary max-w-md mx-auto">
                    Your clinic workspace is created and pending verification. Continue into the operating system to complete onboarding and activation.
                  </p>
                </div>
                
                <div className="bg-[#05070A] border border-surface-3 rounded-xl p-6 text-left font-mono text-sm space-y-3 mx-auto max-w-md">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Workspace</span>
                    <span className="text-success">Created</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Review Status</span>
                    <span className="text-warning">Pending</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Data Residency</span>
                    <span className="text-white uppercase">{formData.dataResidency}</span>
                  </div>
                </div>

                <Button size="lg" className="w-full text-lg h-14" onClick={() => window.location.assign('/dashboard')}>
                  Open Clinic Workspace
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            ) : isProvisioning ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center space-y-8 bg-[#0B0F14] border border-surface-3 p-12 rounded-2xl shadow-2xl"
              >
                <div className="w-24 h-24 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6 relative">
                  <div className="absolute inset-0 rounded-2xl border-2 border-primary/30 border-t-primary animate-spin" />
                  <Server className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <h2 className="text-3xl font-display font-bold text-white mb-4">Submitting Registration</h2>
                  <p className="text-text-secondary">Creating your clinic workspace and securing onboarding records...</p>
                </div>
                <div className="space-y-4 text-left font-mono text-sm max-w-sm mx-auto">
                  <div className="flex items-center gap-3 text-success">
                    <CheckCircle2 className="w-4 h-4" /> <span>Verifying authenticated session...</span>
                  </div>
                  <div className="flex items-center gap-3 text-success">
                    <CheckCircle2 className="w-4 h-4" /> <span>Writing clinic onboarding record...</span>
                  </div>
                  <div className="flex items-center gap-3 text-primary">
                    <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /> 
                    <span>Assigning clinic workspace permissions...</span>
                  </div>
                  <div className="flex items-center gap-3 text-text-secondary">
                    <div className="w-4 h-4 rounded-full border border-surface-3" /> 
                    <span>Readying activation checklist...</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <Card className="bg-[#0B0F14] border-surface-3 shadow-2xl overflow-hidden">
                <div className="p-8 border-b border-surface-3 bg-[#05070A]">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-surface-2 flex items-center justify-center">
                      {React.createElement(ONBOARDING_STEPS[currentStep].icon, { className: "w-5 h-5 text-primary" })}
                    </div>
                    <h2 className="text-2xl font-display font-bold text-white">
                      {ONBOARDING_STEPS[currentStep].title}
                    </h2>
                  </div>
                  <p className="text-text-secondary ml-14">
                    {ONBOARDING_STEPS[currentStep].description}
                  </p>
                </div>

                <div className="p-8">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      {/* Step 0: Auth */}
                      {currentStep === 0 && (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
                            <Lock className="w-8 h-8 text-primary" />
                          </div>
                          <h3 className="text-xl font-bold text-white mb-4">Secure Identity Verification</h3>
                          <p className="text-text-secondary mb-8">
                            To begin provisioning your clinic environment, verify your operator identity with an email access code. Google and LinkedIn remain available as secondary options.
                          </p>
                          {user ? (
                            <div className="p-4 rounded-xl bg-success/10 border border-success/20 flex items-center justify-center gap-3">
                              <CheckCircle2 className="w-5 h-5 text-success" />
                              <span className="text-success font-bold">Authenticated as {user.email}</span>
                            </div>
                          ) : (
                            <AccessCodeAuth
                              modeLabel="Clinic operator account"
                              helperText="Use the business email tied to your clinic. We will create the account if it does not exist and send a secure 6-digit access code."
                              providers={['google', 'linkedin']}
                            />
                          )}
                        </div>
                      )}

                      {/* Step 1: Entity */}
                      {currentStep === 1 && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2">Legal Clinic Name</label>
                            <input 
                              type="text" name="legalName" value={formData.legalName} onChange={handleInputChange}
                              className="w-full h-12 px-4 bg-[#05070A] border border-surface-3 rounded-lg text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                              placeholder="e.g. Apex Men's Health LLC"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-text-secondary mb-2">NPI Number</label>
                              <input 
                                type="text" name="npiNumber" value={formData.npiNumber} onChange={handleInputChange}
                                className="w-full h-12 px-4 bg-[#05070A] border border-surface-3 rounded-lg text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-mono"
                                placeholder="10-digit NPI"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-text-secondary mb-2">Tax ID (EIN)</label>
                              <input 
                                type="text" name="taxId" value={formData.taxId} onChange={handleInputChange}
                                className="w-full h-12 px-4 bg-[#05070A] border border-surface-3 rounded-lg text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-mono"
                                placeholder="XX-XXXXXXX"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2">Primary Admin Email</label>
                            <input 
                              type="email" name="adminEmail" value={formData.adminEmail} onChange={handleInputChange}
                              className="w-full h-12 px-4 bg-[#05070A] border border-surface-3 rounded-lg text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                              placeholder="admin@clinic.com"
                            />
                          </div>
                        </>
                      )}

                      {/* Step 2: Compliance */}
                      {currentStep === 2 && (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-text-secondary mb-2">HIPAA Privacy Officer Name</label>
                              <input 
                                type="text" name="hipaaOfficer" value={formData.hipaaOfficer} onChange={handleInputChange}
                                className="w-full h-12 px-4 bg-[#05070A] border border-surface-3 rounded-lg text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                placeholder="Full Name"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-text-secondary mb-2">Officer Email</label>
                              <input 
                                type="email" name="hipaaEmail" value={formData.hipaaEmail} onChange={handleInputChange}
                                className="w-full h-12 px-4 bg-[#05070A] border border-surface-3 rounded-lg text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                placeholder="officer@clinic.com"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2">Data Residency Preference</label>
                            <select 
                              name="dataResidency" value={formData.dataResidency} onChange={handleInputChange}
                              className="w-full h-12 px-4 bg-[#05070A] border border-surface-3 rounded-lg text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                            >
                              <option value="us-east">US East (N. Virginia) - Default</option>
                              <option value="us-west">US West (Oregon)</option>
                            </select>
                          </div>
                          <div className="p-4 rounded-lg border border-surface-3 bg-[#05070A] flex items-start gap-4 mt-6">
                            <div className="pt-1">
                              <input 
                                type="checkbox" name="baaAccepted" checked={formData.baaAccepted} onChange={handleInputChange}
                                className="w-5 h-5 rounded border-surface-3 text-primary focus:ring-primary/50 bg-surface-2"
                              />
                            </div>
                            <div>
                              <p className="text-white font-medium mb-1">Business Associate Agreement (BAA)</p>
                              <p className="text-sm text-text-secondary mb-2">
                                I acknowledge and agree to the standard Novalyte AI BAA for the handling of Protected Health Information (PHI).
                              </p>
                              <Link to="/security" className="text-primary text-sm hover:underline flex items-center gap-1">
                                <FileText className="w-4 h-4" /> View Full BAA
                              </Link>
                            </div>
                          </div>
                        </>
                      )}

                      {/* Step 3: Operations */}
                      {currentStep === 3 && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2">Primary EMR System</label>
                            <select 
                              name="primaryEmr" value={formData.primaryEmr} onChange={handleInputChange}
                              className="w-full h-12 px-4 bg-[#05070A] border border-surface-3 rounded-lg text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                            >
                              <option value="">Select EMR...</option>
                              <option value="athena">Athenahealth</option>
                              <option value="epic">Epic</option>
                              <option value="cerner">Cerner</option>
                              <option value="drchrono">DrChrono</option>
                              <option value="advancedmd">AdvancedMD</option>
                              <option value="other">Other / Custom</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2">Telehealth Platform</label>
                            <select 
                              name="telehealth" value={formData.telehealth} onChange={handleInputChange}
                              className="w-full h-12 px-4 bg-[#05070A] border border-surface-3 rounded-lg text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                            >
                              <option value="">Select Platform...</option>
                              <option value="zoom">Zoom for Healthcare</option>
                              <option value="doxy">Doxy.me</option>
                              <option value="integrated">Integrated with EMR</option>
                              <option value="none">None (In-person only)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2">Average Monthly Patient Volume</label>
                            <input 
                              type="number" name="monthlyVolume" value={formData.monthlyVolume} onChange={handleInputChange}
                              className="w-full h-12 px-4 bg-[#05070A] border border-surface-3 rounded-lg text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                              placeholder="e.g. 150"
                            />
                          </div>
                        </>
                      )}

                      {/* Step 4: Connectivity */}
                      {currentStep === 3 && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-text-secondary mb-3">HL7 / FHIR Capability</label>
                            <div className="grid grid-cols-2 gap-4">
                              <label className={`flex items-center justify-center p-4 rounded-lg border cursor-pointer transition-all ${formData.hl7Capable === 'yes' ? 'bg-primary/10 border-primary text-primary' : 'bg-[#05070A] border-surface-3 text-text-secondary hover:border-surface-4'}`}>
                                <input type="radio" name="hl7Capable" value="yes" checked={formData.hl7Capable === 'yes'} onChange={handleInputChange} className="sr-only" />
                                <span className="font-medium">Yes, Capable</span>
                              </label>
                              <label className={`flex items-center justify-center p-4 rounded-lg border cursor-pointer transition-all ${formData.hl7Capable === 'no' ? 'bg-primary/10 border-primary text-primary' : 'bg-[#05070A] border-surface-3 text-text-secondary hover:border-surface-4'}`}>
                                <input type="radio" name="hl7Capable" value="no" checked={formData.hl7Capable === 'no'} onChange={handleInputChange} className="sr-only" />
                                <span className="font-medium">No / Unsure</span>
                              </label>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2">Lead Sync Webhook URL (Optional)</label>
                            <input 
                              type="url" name="webhookUrl" value={formData.webhookUrl} onChange={handleInputChange}
                              className="w-full h-12 px-4 bg-[#05070A] border border-surface-3 rounded-lg text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-mono text-sm"
                              placeholder="https://api.yourclinic.com/webhooks/leads"
                            />
                            <p className="text-xs text-text-secondary mt-2">Leave blank if you prefer to use the Novalyte OS dashboard for lead management.</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-text-secondary mb-2">Technical Contact Email</label>
                            <input 
                              type="email" name="techContact" value={formData.techContact} onChange={handleInputChange}
                              className="w-full h-12 px-4 bg-[#05070A] border border-surface-3 rounded-lg text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                              placeholder="it@clinic.com"
                            />
                          </div>
                        </>
                      )}

                      {error && (
                        <div className="p-4 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm flex items-center gap-3">
                          <AlertCircle className="w-5 h-5 shrink-0" />
                          {error}
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="p-6 border-t border-surface-3 bg-[#05070A] flex items-center justify-between">
                  <Button 
                    variant="ghost" 
                    onClick={handleBack} 
                    disabled={currentStep === 0}
                    className={currentStep === 0 ? 'opacity-0 pointer-events-none' : ''}
                  >
                    <ChevronLeft className="w-5 h-5 mr-2" /> Back
                  </Button>
                  
                  <Button 
                    onClick={handleNext} 
                    disabled={(currentStep === 0 && !user) || (currentStep > 0 && !isStepValid())}
                    className="min-w-[140px]"
                  >
                    {currentStep === ONBOARDING_STEPS.length - 1 ? 'Deploy Infrastructure' : 'Next Step'}
                    {currentStep !== ONBOARDING_STEPS.length - 1 && <ChevronRight className="w-5 h-5 ml-2" />}
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
