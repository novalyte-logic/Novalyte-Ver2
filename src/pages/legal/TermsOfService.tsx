import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Scale, FileText, AlertTriangle, Users, Building2, Shield, ChevronRight, Cpu, Network, Gavel, Mail } from 'lucide-react';

export function TermsOfService() {
  const [activeSection, setActiveSection] = useState('acceptance');

  // Handle scroll spy for table of contents
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['acceptance', 'medical', 'platform', 'clinics', 'marketplace', 'ip', 'termination'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && element.offsetTop <= scrollPosition && (element.offsetTop + element.offsetHeight) > scrollPosition) {
          setActiveSection(section);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#05070A] pt-24 pb-24 relative selection:bg-primary/30 selection:text-primary-content">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-primary/5 to-transparent blur-3xl rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-2 border border-surface-3 text-text-secondary text-sm font-bold uppercase tracking-wider mb-6">
              <Scale className="w-4 h-4 text-primary" /> Legal & Compliance
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 tracking-tight">
              Terms of Service
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed">
              These Terms of Service govern your access to and use of the Novalyte AI platform, including our patient routing, clinic operating system, and marketplace infrastructure.
            </p>
            <div className="mt-6 flex items-center gap-4 text-sm text-text-secondary">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                Last Updated: March 14, 2026
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-surface-3" />
                Effective Date: March 14, 2026
              </div>
            </div>
          </motion.div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          
          {/* Table of Contents (Sticky Sidebar) */}
          <div className="lg:w-1/4 hidden lg:block">
            <div className="sticky top-32 space-y-1">
              <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-4 px-3">Contents</h3>
              
              <button 
                onClick={() => scrollToSection('acceptance')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeSection === 'acceptance' ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:text-white hover:bg-surface-2'}`}
              >
                Acceptance of Terms
                {activeSection === 'acceptance' && <ChevronRight className="w-4 h-4" />}
              </button>
              
              <button 
                onClick={() => scrollToSection('medical')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeSection === 'medical' ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:text-white hover:bg-surface-2'}`}
              >
                AI Advisory Limitations
                {activeSection === 'medical' && <ChevronRight className="w-4 h-4" />}
              </button>
              
              <button 
                onClick={() => scrollToSection('platform')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeSection === 'platform' ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:text-white hover:bg-surface-2'}`}
              >
                Platform Usage & Conduct
                {activeSection === 'platform' && <ChevronRight className="w-4 h-4" />}
              </button>
              
              <button 
                onClick={() => scrollToSection('clinics')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeSection === 'clinics' ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:text-white hover:bg-surface-2'}`}
              >
                Clinic Responsibilities
                {activeSection === 'clinics' && <ChevronRight className="w-4 h-4" />}
              </button>

              <button 
                onClick={() => scrollToSection('marketplace')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeSection === 'marketplace' ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:text-white hover:bg-surface-2'}`}
              >
                Marketplace Disclaimers
                {activeSection === 'marketplace' && <ChevronRight className="w-4 h-4" />}
              </button>
              
              <button 
                onClick={() => scrollToSection('ip')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeSection === 'ip' ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:text-white hover:bg-surface-2'}`}
              >
                Intellectual Property
                {activeSection === 'ip' && <ChevronRight className="w-4 h-4" />}
              </button>

              <button 
                onClick={() => scrollToSection('termination')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeSection === 'termination' ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:text-white hover:bg-surface-2'}`}
              >
                Termination & Arbitration
                {activeSection === 'termination' && <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4 max-w-3xl">
            <div className="prose prose-invert prose-lg max-w-none">
              
              {/* Section 1 */}
              <section id="acceptance" className="mb-20 scroll-mt-32">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-surface-2 border border-surface-3 flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-3xl font-display font-bold text-white m-0">1. Acceptance of Terms</h2>
                </div>
                <p className="text-text-secondary leading-relaxed mb-6">
                  By accessing or using the Novalyte AI platform, including our websites, APIs, mobile applications, and associated infrastructure (collectively, the "Service"), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the Service.
                </p>
                <p className="text-text-secondary leading-relaxed">
                  These terms apply to all participants in the Novalyte ecosystem, including but not limited to:
                </p>
                <ul className="space-y-3 text-text-secondary list-none pl-0 mt-4">
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    <span><strong>Patients</strong> seeking health optimization and clinical routing.</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    <span><strong>Clinics and Administrators</strong> utilizing our operating system and lead generation.</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    <span><strong>Healthcare Practitioners</strong> participating in the workforce exchange.</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    <span><strong>Vendors</strong> listing equipment, diagnostics, or software in the marketplace.</span>
                  </li>
                </ul>
              </section>

              {/* Section 2 */}
              <section id="medical" className="mb-20 scroll-mt-32">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-warning/10 border border-warning/20 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-6 h-6 text-warning" />
                  </div>
                  <h2 className="text-3xl font-display font-bold text-white m-0">2. AI Advisory Limitations</h2>
                </div>
                
                <div className="p-6 rounded-xl bg-warning/10 border border-warning/20 mb-8">
                  <h3 className="text-lg font-bold text-warning m-0 mb-2">NOT MEDICAL ADVICE</h3>
                  <p className="text-sm text-warning/90 m-0 leading-relaxed">
                    Novalyte AI is a technology infrastructure provider, not a healthcare provider. The content, AI-driven assessments, triage recommendations, symptom checkers, and insights provided by the Service are for informational and routing purposes only. They are not intended to be a substitute for professional medical advice, diagnosis, or treatment.
                  </p>
                </div>

                <p className="text-text-secondary leading-relaxed mb-6">
                  Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read on the Novalyte AI platform.
                </p>
                <p className="text-text-secondary leading-relaxed">
                  If you think you may have a medical emergency, call your doctor, go to the nearest hospital emergency department, or call emergency services immediately. Reliance on any information provided by Novalyte AI, our employees, or others appearing on the Service is solely at your own risk.
                </p>
              </section>

              {/* Section 3 */}
              <section id="platform" className="mb-20 scroll-mt-32">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-surface-2 border border-surface-3 flex items-center justify-center shrink-0">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-3xl font-display font-bold text-white m-0">3. Platform Usage & Conduct</h2>
                </div>
                <p className="text-text-secondary leading-relaxed mb-6">
                  As a user of the Service, you agree to use the platform responsibly and legally. You agree that you will not:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="p-5 rounded-xl bg-[#0B0F14] border border-surface-3">
                    <h4 className="font-bold text-white m-0 mb-2">Account Security</h4>
                    <p className="text-sm text-text-secondary m-0">Share your account credentials, allow unauthorized access, or bypass security measures.</p>
                  </div>
                  <div className="p-5 rounded-xl bg-[#0B0F14] border border-surface-3">
                    <h4 className="font-bold text-white m-0 mb-2">Data Integrity</h4>
                    <p className="text-sm text-text-secondary m-0">Provide false, inaccurate, or misleading information during assessments, registration, or marketplace listings.</p>
                  </div>
                  <div className="p-5 rounded-xl bg-[#0B0F14] border border-surface-3">
                    <h4 className="font-bold text-white m-0 mb-2">System Abuse</h4>
                    <p className="text-sm text-text-secondary m-0">Attempt to reverse engineer, scrape, or disrupt the AI models, routing algorithms, or infrastructure.</p>
                  </div>
                  <div className="p-5 rounded-xl bg-[#0B0F14] border border-surface-3">
                    <h4 className="font-bold text-white m-0 mb-2">Compliance</h4>
                    <p className="text-sm text-text-secondary m-0">Use the platform in violation of any local, state, national, or international law or regulation.</p>
                  </div>
                </div>
              </section>

              {/* Section 4 */}
              <section id="clinics" className="mb-20 scroll-mt-32">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-surface-2 border border-surface-3 flex items-center justify-center shrink-0">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-3xl font-display font-bold text-white m-0">4. Clinic Responsibilities & Separation</h2>
                </div>
                <p className="text-text-secondary leading-relaxed mb-6">
                  Novalyte AI acts solely as a technology intermediary. Clinics and healthcare practitioners utilizing our Clinic OS or receiving patient leads agree to the following strict separation of responsibilities:
                </p>
                <div className="pl-6 border-l-2 border-surface-3 space-y-6">
                  <div>
                    <h4 className="font-bold text-white m-0 mb-2">Independent Medical Judgment</h4>
                    <p className="text-text-secondary m-0">Clinics retain sole responsibility for all medical decisions, diagnoses, prescriptions, and treatments. Novalyte AI's routing and triage scores do not dictate clinical care.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-white m-0 mb-2">Licensing & Compliance</h4>
                    <p className="text-text-secondary m-0">Clinics must maintain all necessary licenses, certifications, and regulatory approvals. Clinics are solely responsible for compliance with HIPAA, anti-kickback statutes, and corporate practice of medicine (CPOM) laws.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-white m-0 mb-2">Indemnification</h4>
                    <p className="text-text-secondary m-0">Clinics agree to indemnify and hold Novalyte AI harmless against any claims, damages, or liabilities arising from the delivery of clinical care, malpractice, or regulatory violations.</p>
                  </div>
                </div>
              </section>

              {/* Section 5 */}
              <section id="marketplace" className="mb-20 scroll-mt-32">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-surface-2 border border-surface-3 flex items-center justify-center shrink-0">
                    <Network className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-3xl font-display font-bold text-white m-0">5. Marketplace & Vendor Disclaimers</h2>
                </div>
                <p className="text-text-secondary leading-relaxed mb-6">
                  The Novalyte Marketplace connects clinics and patients with third-party vendors providing equipment, diagnostics, supplements, and digital health tools.
                </p>
                <ul className="space-y-4 text-text-secondary list-none pl-0">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                    <span><strong className="text-white">Third-Party Products:</strong> Novalyte AI does not manufacture, endorse, or guarantee the efficacy of any products listed in the marketplace. All product claims are the sole responsibility of the vendor.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                    <span><strong className="text-white">Transactions:</strong> While we facilitate discovery and routing, the actual purchase, fulfillment, warranty, and support of marketplace items are governed by the respective vendor's terms.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                    <span><strong className="text-white">ROI Estimates:</strong> Any Return on Investment (ROI) calculators or revenue projections provided in the marketplace are estimates based on aggregated data and do not constitute financial guarantees.</span>
                  </li>
                </ul>
              </section>

              {/* Section 6 */}
              <section id="ip" className="mb-20 scroll-mt-32">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-surface-2 border border-surface-3 flex items-center justify-center shrink-0">
                    <Cpu className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-3xl font-display font-bold text-white m-0">6. Intellectual Property</h2>
                </div>
                <p className="text-text-secondary leading-relaxed mb-6">
                  The Service and its original content, features, functionality, AI models, scoring algorithms, UI designs, and routing logic are and will remain the exclusive property of Novalyte AI and its licensors. The Service is protected by copyright, trademark, trade secret, and other intellectual property laws.
                </p>
                <div className="p-6 rounded-xl bg-primary/5 border border-primary/20">
                  <h4 className="font-bold text-white m-0 mb-2">Restrictions</h4>
                  <p className="text-sm text-text-secondary m-0">
                    You may not modify, reproduce, distribute, create derivative works or adaptations of, publicly display, or in any way exploit any of the content, software, or algorithms, in whole or in part, except as expressly authorized by us in writing.
                  </p>
                </div>
              </section>

              {/* Section 7 */}
              <section id="termination" className="mb-20 scroll-mt-32">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-surface-2 border border-surface-3 flex items-center justify-center shrink-0">
                    <Gavel className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-3xl font-display font-bold text-white m-0">7. Termination & Arbitration</h2>
                </div>
                <p className="text-text-secondary leading-relaxed mb-6">
                  We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                </p>
                <div className="pl-6 border-l-2 border-surface-3 space-y-6 mb-8">
                  <div>
                    <h4 className="font-bold text-white m-0 mb-2">Dispute Resolution</h4>
                    <p className="text-text-secondary m-0">Any dispute arising from or relating to these Terms or the Service shall be resolved through binding arbitration, rather than in court, except that you may assert claims in small claims court if your claims qualify.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-white m-0 mb-2">Class Action Waiver</h4>
                    <p className="text-text-secondary m-0">You agree that any dispute resolution proceedings will be conducted only on an individual basis and not in a class, consolidated, or representative action.</p>
                  </div>
                </div>

                <div className="p-6 rounded-xl bg-surface-2 border border-surface-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-12">
                  <div>
                    <h4 className="font-bold text-white m-0 mb-1">Questions about these Terms?</h4>
                    <p className="text-sm text-text-secondary m-0">Contact our legal team for clarification.</p>
                  </div>
                  <a href="mailto:legal@novalyte.io" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0B0F14] border border-surface-3 text-white hover:bg-surface-3 transition-colors shrink-0 no-underline">
                    <Mail className="w-4 h-4" /> legal@novalyte.io
                  </a>
                </div>
              </section>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
