import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Server, Activity, CheckCircle2, Database, ChevronRight, Key, Eye, Users, Cpu, FileCheck } from 'lucide-react';

export function SecurityStandards() {
  const [activeSection, setActiveSection] = useState('overview');

  // Handle scroll spy for table of contents
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['overview', 'encryption', 'access', 'ai-security', 'monitoring', 'vendor'];
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
    <div className="min-h-screen bg-[#05070A] pt-24 pb-24 relative selection:bg-success/30 selection:text-success-content">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-success/20 via-success/5 to-transparent blur-3xl rounded-full" />
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
              <Shield className="w-4 h-4 text-success" /> Trust & Security
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 tracking-tight">
              Security Standards
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed">
              Enterprise-grade protection for sensitive healthcare data and AI infrastructure. We treat security as a foundational feature, not an afterthought.
            </p>
            <div className="mt-6 flex items-center gap-4 text-sm text-text-secondary">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success" />
                SOC 2 Type II Ready
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-surface-3" />
                HIPAA Aligned Architecture
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
                onClick={() => scrollToSection('overview')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeSection === 'overview' ? 'bg-success/10 text-success' : 'text-text-secondary hover:text-white hover:bg-surface-2'}`}
              >
                Core Pillars
                {activeSection === 'overview' && <ChevronRight className="w-4 h-4" />}
              </button>
              
              <button 
                onClick={() => scrollToSection('encryption')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeSection === 'encryption' ? 'bg-success/10 text-success' : 'text-text-secondary hover:text-white hover:bg-surface-2'}`}
              >
                Data Encryption
                {activeSection === 'encryption' && <ChevronRight className="w-4 h-4" />}
              </button>
              
              <button 
                onClick={() => scrollToSection('access')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeSection === 'access' ? 'bg-success/10 text-success' : 'text-text-secondary hover:text-white hover:bg-surface-2'}`}
              >
                Access Control & Auth
                {activeSection === 'access' && <ChevronRight className="w-4 h-4" />}
              </button>
              
              <button 
                onClick={() => scrollToSection('ai-security')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeSection === 'ai-security' ? 'bg-success/10 text-success' : 'text-text-secondary hover:text-white hover:bg-surface-2'}`}
              >
                AI & Model Security
                {activeSection === 'ai-security' && <ChevronRight className="w-4 h-4" />}
              </button>

              <button 
                onClick={() => scrollToSection('monitoring')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeSection === 'monitoring' ? 'bg-success/10 text-success' : 'text-text-secondary hover:text-white hover:bg-surface-2'}`}
              >
                Monitoring & Auditing
                {activeSection === 'monitoring' && <ChevronRight className="w-4 h-4" />}
              </button>
              
              <button 
                onClick={() => scrollToSection('vendor')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeSection === 'vendor' ? 'bg-success/10 text-success' : 'text-text-secondary hover:text-white hover:bg-surface-2'}`}
              >
                Vendor Security
                {activeSection === 'vendor' && <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4 max-w-3xl">
            <div className="prose prose-invert prose-lg max-w-none">
              
              {/* Section 1: Overview */}
              <section id="overview" className="mb-20 scroll-mt-32">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-surface-2 border border-surface-3 flex items-center justify-center shrink-0">
                    <Shield className="w-6 h-6 text-success" />
                  </div>
                  <h2 className="text-3xl font-display font-bold text-white m-0">1. Core Security Pillars</h2>
                </div>
                <p className="text-text-secondary leading-relaxed mb-8">
                  Novalyte AI is built on a foundation of zero-trust architecture, continuous monitoring, and strict data isolation. Our platform is designed to meet the rigorous demands of modern healthcare operations.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="p-6 rounded-xl bg-[#0B0F14] border border-surface-3">
                    <Lock className="w-6 h-6 text-success mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2 m-0">Encryption Everywhere</h3>
                    <p className="text-sm text-text-secondary m-0">Data is encrypted at rest (AES-256) and in transit (TLS 1.3), utilizing managed KMS for cryptographic key rotation.</p>
                  </div>
                  <div className="p-6 rounded-xl bg-[#0B0F14] border border-surface-3">
                    <FileCheck className="w-6 h-6 text-success mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2 m-0">HIPAA Alignment</h3>
                    <p className="text-sm text-text-secondary m-0">Architecture designed to exceed HIPAA Security Rule requirements, supported by comprehensive BAAs.</p>
                  </div>
                  <div className="p-6 rounded-xl bg-[#0B0F14] border border-surface-3">
                    <Server className="w-6 h-6 text-success mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2 m-0">Isolated Infrastructure</h3>
                    <p className="text-sm text-text-secondary m-0">Hosted within isolated Virtual Private Clouds (VPCs) with strict network access controls and Identity-Aware Proxies.</p>
                  </div>
                  <div className="p-6 rounded-xl bg-[#0B0F14] border border-surface-3">
                    <Activity className="w-6 h-6 text-success mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2 m-0">Continuous Auditing</h3>
                    <p className="text-sm text-text-secondary m-0">24/7 monitoring with immutable logging for all data access, modifications, and system events.</p>
                  </div>
                </div>
              </section>

              {/* Section 2: Encryption */}
              <section id="encryption" className="mb-20 scroll-mt-32">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-surface-2 border border-surface-3 flex items-center justify-center shrink-0">
                    <Key className="w-6 h-6 text-success" />
                  </div>
                  <h2 className="text-3xl font-display font-bold text-white m-0">2. Data Encryption</h2>
                </div>
                <p className="text-text-secondary leading-relaxed mb-6">
                  We employ state-of-the-art cryptographic standards to ensure that your data remains confidential and tamper-proof across all states.
                </p>
                <div className="pl-6 border-l-2 border-surface-3 space-y-6">
                  <div>
                    <h4 className="font-bold text-white m-0 mb-2">Data at Rest</h4>
                    <p className="text-text-secondary m-0">All persistent data, including databases, object storage, and backups, is encrypted at rest using AES-256. We utilize Google Cloud Key Management Service (KMS) for secure, automated key rotation and lifecycle management.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-white m-0 mb-2">Data in Transit</h4>
                    <p className="text-text-secondary m-0">All communications between clients, our services, and internal microservices are encrypted in transit using TLS 1.3. We enforce HTTP Strict Transport Security (HSTS) across all domains.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-white m-0 mb-2">Field-Level Encryption</h4>
                    <p className="text-text-secondary m-0">Highly sensitive fields (such as specific medical identifiers or financial tokens) undergo an additional layer of application-level encryption before being written to the database.</p>
                  </div>
                </div>
              </section>

              {/* Section 3: Access Control */}
              <section id="access" className="mb-20 scroll-mt-32">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-surface-2 border border-surface-3 flex items-center justify-center shrink-0">
                    <Users className="w-6 h-6 text-success" />
                  </div>
                  <h2 className="text-3xl font-display font-bold text-white m-0">3. Access Control & Authentication</h2>
                </div>
                <p className="text-text-secondary leading-relaxed mb-6">
                  We enforce rigorous access controls to ensure data is only available to authorized individuals, operating on the principle of least privilege.
                </p>
                <ul className="space-y-4 text-text-secondary list-none pl-0">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-success mt-2.5 shrink-0" />
                    <span><strong className="text-white">Role-Based Access Control (RBAC):</strong> Granular permissions ensure users (patients, clinics, admins, practitioners) only access data necessary for their specific role and context.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-success mt-2.5 shrink-0" />
                    <span><strong className="text-white">Multi-Factor Authentication (MFA):</strong> MFA is required for all clinic administrators, practitioners, and internal Novalyte staff accessing production environments.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-success mt-2.5 shrink-0" />
                    <span><strong className="text-white">Zero-Trust Internal Access:</strong> Internal access to production systems is granted on a temporary, as-needed basis via Identity-Aware Proxies. VPNs are not relied upon as the sole perimeter defense.</span>
                  </li>
                </ul>
              </section>

              {/* Section 4: AI Security */}
              <section id="ai-security" className="mb-20 scroll-mt-32">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-surface-2 border border-surface-3 flex items-center justify-center shrink-0">
                    <Cpu className="w-6 h-6 text-success" />
                  </div>
                  <h2 className="text-3xl font-display font-bold text-white m-0">4. AI & Model Security</h2>
                </div>
                <p className="text-text-secondary leading-relaxed mb-6">
                  Novalyte AI employs strict boundaries between patient data and our machine learning models to prevent data leakage and ensure privacy.
                </p>
                <div className="p-6 rounded-xl bg-success/5 border border-success/20 mb-8">
                  <ul className="list-none space-y-4 m-0 p-0">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-text-secondary"><strong className="text-white">No Training on PHI:</strong> We do not use your Protected Health Information (PHI) to train our foundational models. Your data remains your data.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-text-secondary"><strong className="text-white">Data Anonymization:</strong> Any data used for analytics, routing optimization, or model fine-tuning is strictly de-identified according to HIPAA Safe Harbor standards.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-text-secondary"><strong className="text-white">Isolated Inference:</strong> AI inference runs in isolated, ephemeral environments that are destroyed immediately after processing, preventing cross-tenant data contamination.</span>
                    </li>
                  </ul>
                </div>
              </section>

              {/* Section 5: Monitoring */}
              <section id="monitoring" className="mb-20 scroll-mt-32">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-surface-2 border border-surface-3 flex items-center justify-center shrink-0">
                    <Eye className="w-6 h-6 text-success" />
                  </div>
                  <h2 className="text-3xl font-display font-bold text-white m-0">5. Monitoring, Auditing & Response</h2>
                </div>
                <p className="text-text-secondary leading-relaxed mb-6">
                  Visibility is critical to security. We maintain comprehensive audit trails and proactive monitoring systems to detect and respond to threats rapidly.
                </p>
                <div className="pl-6 border-l-2 border-surface-3 space-y-6">
                  <div>
                    <h4 className="font-bold text-white m-0 mb-2">Immutable Audit Logs</h4>
                    <p className="text-text-secondary m-0">Every authentication attempt, data access, and modification event is logged immutably. These logs are retained for compliance reporting and forensic analysis.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-white m-0 mb-2">Anomaly Detection</h4>
                    <p className="text-text-secondary m-0">Automated systems monitor traffic patterns, API usage, and access logs to detect anomalous behavior indicative of a potential breach or abuse.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-white m-0 mb-2">Incident Response Plan</h4>
                    <p className="text-text-secondary m-0">We maintain a documented and tested Incident Response Plan (IRP) that dictates immediate containment, eradication, recovery, and notification procedures in the event of a security incident.</p>
                  </div>
                </div>
              </section>

              {/* Section 6: Vendor Security */}
              <section id="vendor" className="mb-20 scroll-mt-32">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-surface-2 border border-surface-3 flex items-center justify-center shrink-0">
                    <Database className="w-6 h-6 text-success" />
                  </div>
                  <h2 className="text-3xl font-display font-bold text-white m-0">6. Vendor & Third-Party Security</h2>
                </div>
                <p className="text-text-secondary leading-relaxed mb-6">
                  Our security posture extends to the partners and vendors we integrate with. We hold our supply chain to the same high standards we hold ourselves.
                </p>
                <ul className="space-y-4 text-text-secondary list-none pl-0">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-success mt-2.5 shrink-0" />
                    <span><strong className="text-white">Vendor Risk Assessments:</strong> All third-party services undergo rigorous security reviews before integration into the Novalyte ecosystem.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-success mt-2.5 shrink-0" />
                    <span><strong className="text-white">Business Associate Agreements:</strong> We require BAAs with any vendor that may process, store, or transmit PHI on our behalf.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-success mt-2.5 shrink-0" />
                    <span><strong className="text-white">Continuous Evaluation:</strong> Vendor security postures are re-evaluated annually or upon significant changes to their service offerings.</span>
                  </li>
                </ul>
              </section>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
