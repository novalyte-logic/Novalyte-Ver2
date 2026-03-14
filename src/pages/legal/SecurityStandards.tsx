import React from 'react';
import { Shield, Lock, Server, Activity, CheckCircle2, Database } from 'lucide-react';
import { Card } from '@/src/components/ui/Card';

export function SecurityStandards() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 text-success text-sm font-medium mb-6">
            <Shield className="w-4 h-4" /> Trust & Security
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-6">
            Security Standards
          </h1>
          <p className="text-xl text-text-secondary">
            Enterprise-grade protection for sensitive healthcare data and AI infrastructure.
          </p>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <Card className="bg-surface-1 border-surface-3 p-6">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center text-success mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">Data Encryption</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              All data is encrypted at rest using AES-256 and in transit using TLS 1.3. We utilize Google Cloud Key Management Service (KMS) for cryptographic key rotation and secure storage.
            </p>
          </Card>

          <Card className="bg-surface-1 border-surface-3 p-6">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center text-success mb-4">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">HIPAA Alignment</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              Our architecture is designed to meet and exceed HIPAA Security Rule requirements. We execute Business Associate Agreements (BAAs) with all covered entities and subcontractors.
            </p>
          </Card>

          <Card className="bg-surface-1 border-surface-3 p-6">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center text-success mb-4">
              <Server className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">Infrastructure Security</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              Hosted on Google Cloud Platform (GCP) within isolated Virtual Private Clouds (VPCs). Network access is strictly controlled via Identity-Aware Proxy (IAP) and zero-trust principles.
            </p>
          </Card>

          <Card className="bg-surface-1 border-surface-3 p-6">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center text-success mb-4">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">Monitoring & Auditing</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              Continuous 24/7 monitoring of all systems. Every data access and modification event is logged immutably for audit trails, anomaly detection, and compliance reporting.
            </p>
          </Card>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-12">
          
          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
              <Database className="w-6 h-6 text-primary" /> AI & Model Security
            </h2>
            <div className="prose prose-invert max-w-none text-text-secondary">
              <p>Novalyte AI employs strict boundaries between patient data and our machine learning models:</p>
              <ul className="list-none space-y-4 mt-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span><strong>No Training on PHI:</strong> We do not use your Protected Health Information (PHI) to train our foundational models.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span><strong>Data Anonymization:</strong> Any data used for analytics or routing optimization is strictly de-identified according to HIPAA Safe Harbor standards.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span><strong>Isolated Inference:</strong> AI inference runs in isolated, ephemeral containers that are destroyed immediately after processing.</span>
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
              <Lock className="w-6 h-6 text-primary" /> Access Control & Authentication
            </h2>
            <div className="prose prose-invert max-w-none text-text-secondary">
              <p>We enforce rigorous access controls to ensure data is only available to authorized individuals:</p>
              <ul className="list-none space-y-4 mt-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span><strong>Role-Based Access Control (RBAC):</strong> Granular permissions ensure users (patients, clinics, admins) only access data necessary for their role.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span><strong>Multi-Factor Authentication (MFA):</strong> Required for all clinic administrators, practitioners, and internal Novalyte staff.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span><strong>Principle of Least Privilege:</strong> Internal access to production systems is granted on a temporary, as-needed basis and heavily audited.</span>
                </li>
              </ul>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
