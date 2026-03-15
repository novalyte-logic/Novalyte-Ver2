import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Eye, Database, Server, FileText, ChevronRight, Activity, Users, Mail } from 'lucide-react';

export function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState('collect');

  // Handle scroll spy for table of contents
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['collect', 'use', 'security', 'sharing', 'rights'];
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
              <Shield className="w-4 h-4 text-primary" /> Legal & Compliance
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed">
              Novalyte AI is committed to protecting your privacy and ensuring the security of your data across our healthcare infrastructure platform.
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
                onClick={() => scrollToSection('collect')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeSection === 'collect' ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:text-white hover:bg-surface-2'}`}
              >
                Information We Collect
                {activeSection === 'collect' && <ChevronRight className="w-4 h-4" />}
              </button>
              
              <button 
                onClick={() => scrollToSection('use')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeSection === 'use' ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:text-white hover:bg-surface-2'}`}
              >
                How We Use Your Information
                {activeSection === 'use' && <ChevronRight className="w-4 h-4" />}
              </button>
              
              <button 
                onClick={() => scrollToSection('security')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeSection === 'security' ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:text-white hover:bg-surface-2'}`}
              >
                Data Security & HIPAA
                {activeSection === 'security' && <ChevronRight className="w-4 h-4" />}
              </button>
              
              <button 
                onClick={() => scrollToSection('sharing')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeSection === 'sharing' ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:text-white hover:bg-surface-2'}`}
              >
                Data Sharing & Third Parties
                {activeSection === 'sharing' && <ChevronRight className="w-4 h-4" />}
              </button>
              
              <button 
                onClick={() => scrollToSection('rights')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeSection === 'rights' ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:text-white hover:bg-surface-2'}`}
              >
                Your Rights & Choices
                {activeSection === 'rights' && <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4 max-w-3xl">
            <div className="prose prose-invert prose-lg max-w-none">
              
              {/* Section 1 */}
              <section id="collect" className="mb-20 scroll-mt-32">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-surface-2 border border-surface-3 flex items-center justify-center shrink-0">
                    <Eye className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-3xl font-display font-bold text-white m-0">1. Information We Collect</h2>
                </div>
                <p className="text-text-secondary leading-relaxed mb-8">
                  Novalyte AI ("we", "our", or "us") collects information to provide, improve, and secure our AI-driven healthcare infrastructure platform. The data we collect depends on your role within our ecosystem (Patient, Clinic, Vendor, or Practitioner).
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="p-6 rounded-xl bg-[#0B0F14] border border-surface-3">
                    <Users className="w-6 h-6 text-primary mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2 m-0">Personal Information</h3>
                    <p className="text-sm text-text-secondary m-0">Name, email address, phone number, and demographic data collected during registration or intake.</p>
                  </div>
                  <div className="p-6 rounded-xl bg-[#0B0F14] border border-surface-3">
                    <Activity className="w-6 h-6 text-primary mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2 m-0">Health Information</h3>
                    <p className="text-sm text-text-secondary m-0">Symptoms, medical history, wellness goals, and treatment preferences provided during the assessment process.</p>
                  </div>
                  <div className="p-6 rounded-xl bg-[#0B0F14] border border-surface-3">
                    <Database className="w-6 h-6 text-primary mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2 m-0">Financial Information</h3>
                    <p className="text-sm text-text-secondary m-0">Budget preferences and willingness to pay out-of-pocket (we do not store full credit card numbers on our servers).</p>
                  </div>
                  <div className="p-6 rounded-xl bg-[#0B0F14] border border-surface-3">
                    <Server className="w-6 h-6 text-primary mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2 m-0">Usage Data</h3>
                    <p className="text-sm text-text-secondary m-0">Interaction with our platform, IP addresses, device information, and operational analytics data.</p>
                  </div>
                </div>
              </section>

              {/* Section 2 */}
              <section id="use" className="mb-20 scroll-mt-32">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-surface-2 border border-surface-3 flex items-center justify-center shrink-0">
                    <Database className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-3xl font-display font-bold text-white m-0">2. How We Use Your Information</h2>
                </div>
                <p className="text-text-secondary leading-relaxed mb-6">
                  We use the collected information to operate our platform, facilitate connections between ecosystem participants, and improve our artificial intelligence models. Specifically, we use your data for:
                </p>
                <ul className="space-y-4 text-text-secondary list-none pl-0">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                    <span><strong className="text-white">Clinical Routing:</strong> To match patients with the most appropriate clinics and practitioners based on clinical and financial fit.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                    <span><strong className="text-white">AI Analysis:</strong> To generate personalized health insights, triage recommendations, and operational analytics for clinics.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                    <span><strong className="text-white">Platform Operations:</strong> To maintain the directory, process marketplace transactions, and facilitate workforce matching.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
                    <span><strong className="text-white">Communication:</strong> To send appointment reminders, system updates, and relevant health or operational information.</span>
                  </li>
                </ul>
              </section>

              {/* Section 3 */}
              <section id="security" className="mb-20 scroll-mt-32">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-surface-2 border border-surface-3 flex items-center justify-center shrink-0">
                    <Lock className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-3xl font-display font-bold text-white m-0">3. Data Security & HIPAA Alignment</h2>
                </div>
                <p className="text-text-secondary leading-relaxed mb-8">
                  Security is foundational to our infrastructure. We implement enterprise-grade security measures to protect your data against unauthorized access, alteration, disclosure, or destruction.
                </p>
                
                <div className="space-y-4">
                  <div className="p-5 rounded-xl bg-[#0B0F14] border border-surface-3 flex gap-4">
                    <Shield className="w-6 h-6 text-success shrink-0" />
                    <div>
                      <h4 className="font-bold text-white m-0 mb-1">Encryption Standards</h4>
                      <p className="text-sm text-text-secondary m-0">All data is encrypted at rest using AES-256 and in transit using TLS 1.3 or higher.</p>
                    </div>
                  </div>
                  <div className="p-5 rounded-xl bg-[#0B0F14] border border-surface-3 flex gap-4">
                    <Lock className="w-6 h-6 text-success shrink-0" />
                    <div>
                      <h4 className="font-bold text-white m-0 mb-1">Access Control</h4>
                      <p className="text-sm text-text-secondary m-0">Strict Role-Based Access Control (RBAC) ensures that only authorized personnel and matched clinics can access sensitive information.</p>
                    </div>
                  </div>
                  <div className="p-5 rounded-xl bg-primary/5 border border-primary/20 flex gap-4">
                    <Activity className="w-6 h-6 text-primary shrink-0" />
                    <div>
                      <h4 className="font-bold text-white m-0 mb-1">HIPAA Alignment</h4>
                      <p className="text-sm text-text-secondary m-0">Our infrastructure is designed to align with HIPAA requirements for the handling of Protected Health Information (PHI). We execute Business Associate Agreements (BAAs) with our clinic partners.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 4 */}
              <section id="sharing" className="mb-20 scroll-mt-32">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-surface-2 border border-surface-3 flex items-center justify-center shrink-0">
                    <Server className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-3xl font-display font-bold text-white m-0">4. Data Sharing & Third Parties</h2>
                </div>
                <p className="text-text-secondary leading-relaxed mb-6">
                  We do not sell your personal or health information to data brokers or advertising networks. We only share data under the following strictly controlled circumstances:
                </p>
                <div className="pl-6 border-l-2 border-surface-3 space-y-6">
                  <div>
                    <h4 className="font-bold text-white m-0 mb-2">Matched Clinics & Practitioners</h4>
                    <p className="text-text-secondary m-0">When you complete an assessment and book a consultation, your health dossier is securely transmitted to the selected clinic to facilitate your care.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-white m-0 mb-2">Infrastructure Providers</h4>
                    <p className="text-text-secondary m-0">We use trusted third-party services (e.g., cloud hosting, analytics, AI processing) that are bound by strict confidentiality, security agreements, and BAAs where applicable.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-white m-0 mb-2">Legal Requirements</h4>
                    <p className="text-text-secondary m-0">We may disclose information if required by law, subpoena, or other legal processes, or to protect the rights, property, or safety of Novalyte AI, our users, or others.</p>
                  </div>
                </div>
              </section>

              {/* Section 5 */}
              <section id="rights" className="mb-20 scroll-mt-32">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-surface-2 border border-surface-3 flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-3xl font-display font-bold text-white m-0">5. Your Rights & Choices</h2>
                </div>
                <p className="text-text-secondary leading-relaxed mb-6">
                  Depending on your jurisdiction (such as under CCPA/CPRA or GDPR), you may have specific rights regarding your personal information:
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  <div className="p-4 rounded-lg bg-surface-2 border border-surface-3 text-center">
                    <div className="font-bold text-white mb-1">Access</div>
                    <div className="text-xs text-text-secondary">Request a copy of your data</div>
                  </div>
                  <div className="p-4 rounded-lg bg-surface-2 border border-surface-3 text-center">
                    <div className="font-bold text-white mb-1">Correction</div>
                    <div className="text-xs text-text-secondary">Update inaccurate info</div>
                  </div>
                  <div className="p-4 rounded-lg bg-surface-2 border border-surface-3 text-center">
                    <div className="font-bold text-white mb-1">Deletion</div>
                    <div className="text-xs text-text-secondary">Request data removal</div>
                  </div>
                </div>

                <div className="p-6 rounded-xl bg-primary/5 border border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-white m-0 mb-1">Exercise Your Rights</h4>
                    <p className="text-sm text-text-secondary m-0">To submit a request regarding your data privacy rights, please contact our compliance team.</p>
                  </div>
                  <a href="mailto:privacy@novalyte.io" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-2 border border-surface-3 text-white hover:bg-surface-3 transition-colors shrink-0 no-underline">
                    <Mail className="w-4 h-4" /> privacy@novalyte.io
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
