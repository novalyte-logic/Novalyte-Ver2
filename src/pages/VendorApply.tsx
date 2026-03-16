import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Building2, Box, Code2, ShieldCheck, ChevronRight, ChevronLeft, 
  CheckCircle2, ArrowRight, Network, Zap, Globe
} from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { PublicService } from '@/src/services/public';

export function VendorApply() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [applicationId, setApplicationId] = useState('');
  const [reviewEtaDays, setReviewEtaDays] = useState<number | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Identity
    companyName: '',
    website: '',
    contactName: '',
    contactEmail: '',
    contactRole: '',
    // Step 2: Product
    category: '',
    description: '',
    targetAudience: '',
    pricingModel: '',
    // Step 3: Integration
    apiAvailability: '',
    emrCompatibility: '',
    dataExport: '',
    // Step 4: Compliance
    hipaa: '',
    soc2: '',
    supportSLA: '',
    additionalNotes: ''
  });

  const updateForm = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return Boolean(
          formData.companyName &&
          formData.website &&
          formData.contactName &&
          formData.contactEmail &&
          formData.contactRole,
        );
      case 2:
        return Boolean(
          formData.category &&
          formData.description &&
          formData.targetAudience &&
          formData.pricingModel,
        );
      case 3:
        return Boolean(
          formData.apiAvailability &&
          formData.emrCompatibility &&
          formData.dataExport,
        );
      case 4:
        return Boolean(formData.hipaa && formData.soc2 && formData.supportSLA);
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < 4 && isStepValid()) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await PublicService.submitVendorApplication(formData);
      setApplicationId(response.applicationId);
      setReviewEtaDays(response.reviewEtaDays);
      setIsSuccess(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to submit your application right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#05070A] pt-24 pb-12 px-4 flex items-center justify-center font-sans">
        <Card className="max-w-xl w-full bg-surface-1 border-surface-3 p-8 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary" />
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-[80px]" />
          
          <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-success/20">
            <CheckCircle2 className="w-10 h-10 text-success" />
          </div>
          
          <h2 className="text-3xl font-display font-bold text-white mb-4">Application Received</h2>
          <p className="text-text-secondary mb-8 text-lg">
            Your partnership application has been submitted to the Novalyte ecosystem team. We review all vendor applications to ensure clinical and operational alignment.
          </p>
          <div className="mb-8 rounded-xl border border-primary/20 bg-primary/10 px-4 py-3 text-left text-sm text-primary">
            Reference: <span className="font-mono text-white">{applicationId}</span>
            {reviewEtaDays ? ` • Estimated review: ${reviewEtaDays}-${reviewEtaDays + 2} business days` : ''}
          </div>
          
          <div className="bg-[#0B0F14] rounded-xl p-6 border border-surface-3 mb-8 text-left space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Network className="w-4 h-4 text-primary" /> Partnership Pipeline
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-surface-2 flex items-center justify-center shrink-0 text-xs font-bold text-white">1</div>
                <p className="text-sm text-text-secondary"><strong className="text-white">Initial Review:</strong> Our team will review your product fit and compliance posture within 3-5 business days.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-surface-2 flex items-center justify-center shrink-0 text-xs font-bold text-white">2</div>
                <p className="text-sm text-text-secondary"><strong className="text-white">Technical Discovery:</strong> If aligned, we will schedule a call to discuss API integration and data flow.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-surface-2 flex items-center justify-center shrink-0 text-xs font-bold text-white">3</div>
                <p className="text-sm text-text-secondary"><strong className="text-white">Marketplace Listing:</strong> Approved partners are integrated into the clinic dashboard and patient routing engine.</p>
              </div>
            </div>
          </div>
          
          <Link to="/">
            <Button className="w-full bg-primary hover:bg-primary/90 text-black font-bold h-12 text-lg">
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
      <div className="absolute top-0 left-0 w-full h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-[#05070A] to-[#05070A] pointer-events-none" />
      
      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-4">
            <Globe className="w-4 h-4" /> Ecosystem Partner
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight mb-4">
            Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Marketplace</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Integrate your product, equipment, or service directly into the operating system used by top men's health clinics and high-performance patients.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 px-1">
            <span className={step >= 1 ? 'text-primary' : ''}>Identity</span>
            <span className={step >= 2 ? 'text-primary' : ''}>Product</span>
            <span className={step >= 3 ? 'text-primary' : ''}>Integration</span>
            <span className={step >= 4 ? 'text-primary' : ''}>Compliance</span>
          </div>
          <div className="h-2 bg-surface-2 rounded-full overflow-hidden flex">
            <motion.div 
              className="h-full bg-gradient-to-r from-primary to-secondary"
              initial={{ width: '25%' }}
              animate={{ width: `${(step / 4) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Form Container */}
        <Card className="bg-surface-1/80 backdrop-blur-xl border-surface-3 p-0 overflow-hidden shadow-2xl">
          <div className="p-8">
            <AnimatePresence mode="wait">
              
              {/* Step 1: Identity */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20"><Building2 className="w-6 h-6" /></div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Company Identity</h2>
                      <p className="text-sm text-text-secondary">Basic information about your organization.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-text-secondary uppercase tracking-wider mb-2">Company Name</label>
                        <input 
                          type="text" 
                          value={formData.companyName}
                          onChange={(e) => updateForm('companyName', e.target.value)}
                          className="w-full bg-[#0B0F14] border border-surface-3 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                          placeholder="e.g. Apex Diagnostics"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-text-secondary uppercase tracking-wider mb-2">Website URL</label>
                        <input 
                          type="text" 
                          value={formData.website}
                          onChange={(e) => updateForm('website', e.target.value)}
                          className="w-full bg-[#0B0F14] border border-surface-3 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                          placeholder="https://"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-text-secondary uppercase tracking-wider mb-2">Primary Contact Name</label>
                      <input 
                        type="text" 
                        value={formData.contactName}
                        onChange={(e) => updateForm('contactName', e.target.value)}
                        className="w-full bg-[#0B0F14] border border-surface-3 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                        placeholder="Sarah Jenkins"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-text-secondary uppercase tracking-wider mb-2">Contact Email</label>
                        <input 
                          type="email" 
                          value={formData.contactEmail}
                          onChange={(e) => updateForm('contactEmail', e.target.value)}
                          className="w-full bg-[#0B0F14] border border-surface-3 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                          placeholder="sarah@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-text-secondary uppercase tracking-wider mb-2">Contact Role</label>
                        <input 
                          type="text" 
                          value={formData.contactRole}
                          onChange={(e) => updateForm('contactRole', e.target.value)}
                          className="w-full bg-[#0B0F14] border border-surface-3 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                          placeholder="e.g. VP of Partnerships"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Product */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20"><Box className="w-6 h-6" /></div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Product Details</h2>
                      <p className="text-sm text-text-secondary">What are you bringing to the ecosystem?</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-text-secondary uppercase tracking-wider mb-3">Primary Category</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {['Supplements & Nutraceuticals', 'Clinical Equipment', 'Diagnostics & Labs', 'Digital Health SaaS', 'Health Tech & Wearables', 'Other Services'].map(cat => (
                          <button
                            key={cat}
                            onClick={() => updateForm('category', cat)}
                            className={`p-4 rounded-xl border text-left transition-all ${
                              formData.category === cat 
                                ? 'bg-primary/10 border-primary text-white shadow-[0_0_15px_rgba(53,212,255,0.15)]' 
                                : 'bg-[#0B0F14] border-surface-3 text-text-secondary hover:border-surface-4'
                            }`}
                          >
                            <span className="font-medium">{cat}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-text-secondary uppercase tracking-wider mb-2">Product Description</label>
                      <textarea 
                        value={formData.description}
                        onChange={(e) => updateForm('description', e.target.value)}
                        className="w-full bg-[#0B0F14] border border-surface-3 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors min-h-[100px] resize-none"
                        placeholder="Briefly describe your product and its core value proposition..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-text-secondary uppercase tracking-wider mb-2">Target Audience</label>
                        <select 
                          value={formData.targetAudience}
                          onChange={(e) => updateForm('targetAudience', e.target.value)}
                          className="w-full bg-[#0B0F14] border border-surface-3 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none"
                        >
                          <option value="" disabled>Select audience...</option>
                          <option value="clinics">B2B (Clinics & Providers)</option>
                          <option value="patients">B2C (Direct to Patient)</option>
                          <option value="both">B2B2C (Both)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-text-secondary uppercase tracking-wider mb-2">Pricing Model</label>
                        <select 
                          value={formData.pricingModel}
                          onChange={(e) => updateForm('pricingModel', e.target.value)}
                          className="w-full bg-[#0B0F14] border border-surface-3 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none"
                        >
                          <option value="" disabled>Select model...</option>
                          <option value="subscription">SaaS / Subscription</option>
                          <option value="one-time">One-time Purchase (Hardware)</option>
                          <option value="wholesale">Wholesale / Consumables</option>
                          <option value="rev-share">Revenue Share</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Integration */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20"><Code2 className="w-6 h-6" /></div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Integration Readiness</h2>
                      <p className="text-sm text-text-secondary">How does your product connect to our ecosystem?</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-text-secondary uppercase tracking-wider mb-3">API Availability</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                          { id: 'rest', label: 'REST API', desc: 'Standard endpoints' },
                          { id: 'graphql', label: 'GraphQL', desc: 'Flexible queries' },
                          { id: 'none', label: 'No API', desc: 'Manual/Standalone' }
                        ].map(api => (
                          <button
                            key={api.id}
                            onClick={() => updateForm('apiAvailability', api.id)}
                            className={`p-4 rounded-xl border text-left transition-all ${
                              formData.apiAvailability === api.id 
                                ? 'bg-primary/10 border-primary text-white' 
                                : 'bg-[#0B0F14] border-surface-3 text-text-secondary hover:border-surface-4'
                            }`}
                          >
                            <div className="font-bold mb-1">{api.label}</div>
                            <div className="text-xs opacity-70">{api.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-text-secondary uppercase tracking-wider mb-2">EMR Compatibility</label>
                        <select 
                          value={formData.emrCompatibility}
                          onChange={(e) => updateForm('emrCompatibility', e.target.value)}
                          className="w-full bg-[#0B0F14] border border-surface-3 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none"
                        >
                          <option value="" disabled>Select status...</option>
                          <option value="native">Native Integrations (Epic, Athena, etc.)</option>
                          <option value="hl7">HL7 / FHIR Supported</option>
                          <option value="custom">Custom Webhooks Only</option>
                          <option value="none">Not Applicable / Standalone</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-text-secondary uppercase tracking-wider mb-2">Data Export Capabilities</label>
                        <select 
                          value={formData.dataExport}
                          onChange={(e) => updateForm('dataExport', e.target.value)}
                          className="w-full bg-[#0B0F14] border border-surface-3 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none"
                        >
                          <option value="" disabled>Select capability...</option>
                          <option value="realtime">Real-time Webhooks</option>
                          <option value="daily">Daily CSV/JSON Dumps</option>
                          <option value="manual">Manual Export Only</option>
                          <option value="none">No Export Available</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Compliance */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20"><ShieldCheck className="w-6 h-6" /></div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Compliance & Operations</h2>
                      <p className="text-sm text-text-secondary">Security posture and support capabilities.</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-text-secondary uppercase tracking-wider mb-2">HIPAA Compliance</label>
                        <select 
                          value={formData.hipaa}
                          onChange={(e) => updateForm('hipaa', e.target.value)}
                          className="w-full bg-[#0B0F14] border border-surface-3 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none"
                        >
                          <option value="" disabled>Select status...</option>
                          <option value="compliant">Fully Compliant (BAA Ready)</option>
                          <option value="in-progress">In Progress / Audit Pending</option>
                          <option value="not-applicable">Not Applicable (No PHI)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-text-secondary uppercase tracking-wider mb-2">SOC 2 Type II</label>
                        <select 
                          value={formData.soc2}
                          onChange={(e) => updateForm('soc2', e.target.value)}
                          className="w-full bg-[#0B0F14] border border-surface-3 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none"
                        >
                          <option value="" disabled>Select status...</option>
                          <option value="certified">Certified</option>
                          <option value="in-progress">In Progress</option>
                          <option value="no">No</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-text-secondary uppercase tracking-wider mb-2">Support SLA</label>
                      <select 
                        value={formData.supportSLA}
                        onChange={(e) => updateForm('supportSLA', e.target.value)}
                        className="w-full bg-[#0B0F14] border border-surface-3 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none"
                      >
                        <option value="" disabled>Select SLA...</option>
                        <option value="24-7">24/7 Dedicated Support</option>
                        <option value="business-hours">Business Hours (Phone & Email)</option>
                        <option value="email-only">Email Only (24h Response)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-text-secondary uppercase tracking-wider mb-2">Additional Notes</label>
                      <textarea 
                        value={formData.additionalNotes}
                        onChange={(e) => updateForm('additionalNotes', e.target.value)}
                        className="w-full bg-[#0B0F14] border border-surface-3 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors min-h-[100px] resize-none"
                        placeholder="Any other details we should know about your product or partnership goals?"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

	          {/* Footer Controls */}
	          <div className="p-6 bg-[#0B0F14] border-t border-surface-3 flex items-center justify-between">
            {submitError && (
              <div className="mr-4 max-w-md rounded-lg border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
                {submitError}
              </div>
            )}
	            <Button 
	              variant="outline" 
	              onClick={handleBack}
              disabled={step === 1 || isSubmitting}
              className="border-surface-3 bg-surface-1 text-white hover:bg-surface-2 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            
	            {step < 4 ? (
	              <Button 
	                onClick={handleNext}
	                disabled={!isStepValid() || isSubmitting}
	                className="bg-primary hover:bg-primary/90 text-black font-bold"
	              >
                Continue <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
	              <Button 
	                onClick={handleSubmit}
	                disabled={isSubmitting || !isStepValid()}
	                className="bg-primary hover:bg-primary/90 text-black font-bold min-w-[160px]"
	              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Submit Application <ArrowRight className="w-4 h-4" />
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
