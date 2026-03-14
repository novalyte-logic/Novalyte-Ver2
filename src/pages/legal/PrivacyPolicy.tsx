import React from 'react';
import { Shield, Lock, Eye, Database, Server, FileText } from 'lucide-react';
import { Card } from '@/src/components/ui/Card';

export function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Shield className="w-4 h-4" /> Legal & Compliance
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-text-secondary">
            Last Updated: March 14, 2026
          </p>
        </div>

        {/* Content */}
        <div className="space-y-12">
          
          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-2">
              <Eye className="w-6 h-6 text-primary" /> 1. Information We Collect
            </h2>
            <div className="prose prose-invert max-w-none text-text-secondary">
              <p>Novalyte AI ("we", "our", or "us") collects information to provide, improve, and secure our AI-driven healthcare infrastructure platform. This includes:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>Personal Information:</strong> Name, email address, phone number, and demographic data.</li>
                <li><strong>Health Information:</strong> Symptoms, medical history, wellness goals, and treatment preferences provided during the assessment process.</li>
                <li><strong>Financial Information:</strong> Budget preferences and willingness to pay out-of-pocket (we do not store full credit card numbers).</li>
                <li><strong>Usage Data:</strong> Interaction with our platform, IP addresses, device information, and analytics data.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-2">
              <Database className="w-6 h-6 text-primary" /> 2. How We Use Your Information
            </h2>
            <div className="prose prose-invert max-w-none text-text-secondary">
              <p>We use the collected information for the following purposes:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>Clinical Routing:</strong> To match patients with the most appropriate clinics and practitioners based on clinical and financial fit.</li>
                <li><strong>AI Analysis:</strong> To generate personalized health insights, triage recommendations, and operational analytics.</li>
                <li><strong>Platform Operations:</strong> To maintain the directory, process marketplace transactions, and facilitate workforce matching.</li>
                <li><strong>Communication:</strong> To send appointment reminders, system updates, and relevant health information.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-2">
              <Lock className="w-6 h-6 text-primary" /> 3. Data Security & HIPAA Alignment
            </h2>
            <div className="prose prose-invert max-w-none text-text-secondary">
              <p>We implement enterprise-grade security measures to protect your data:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>Encryption:</strong> All data is encrypted at rest (AES-256) and in transit (TLS 1.3).</li>
                <li><strong>Access Control:</strong> Strict Role-Based Access Control (RBAC) ensures that only authorized personnel and matched clinics can access sensitive information.</li>
                <li><strong>HIPAA Alignment:</strong> Our infrastructure is designed to align with HIPAA requirements for the handling of Protected Health Information (PHI). We execute Business Associate Agreements (BAAs) with our clinic partners.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-2">
              <Server className="w-6 h-6 text-primary" /> 4. Data Sharing & Third Parties
            </h2>
            <div className="prose prose-invert max-w-none text-text-secondary">
              <p>We do not sell your personal or health information. We only share data under the following circumstances:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>Matched Clinics:</strong> When you complete an assessment and book a consultation, your health dossier is securely transmitted to the selected clinic.</li>
                <li><strong>Service Providers:</strong> We use trusted third-party services (e.g., cloud hosting, analytics) that are bound by strict confidentiality and security agreements.</li>
                <li><strong>Legal Requirements:</strong> If required by law, subpoena, or other legal processes.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-primary" /> 5. Your Rights & Choices
            </h2>
            <div className="prose prose-invert max-w-none text-text-secondary">
              <p>Depending on your jurisdiction, you may have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Access, correct, or delete your personal information.</li>
                <li>Opt-out of certain data processing activities.</li>
                <li>Request a copy of your data in a machine-readable format.</li>
              </ul>
              <p className="mt-4">To exercise these rights, please contact our privacy team at privacy@novalyte.io.</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
