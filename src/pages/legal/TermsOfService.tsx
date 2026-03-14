import React from 'react';
import { Shield, Scale, FileText, AlertTriangle, Users, Building2 } from 'lucide-react';

export function TermsOfService() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Scale className="w-4 h-4" /> Legal & Compliance
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-6">
            Terms of Service
          </h1>
          <p className="text-xl text-text-secondary">
            Last Updated: March 14, 2026
          </p>
        </div>

        {/* Content */}
        <div className="space-y-12">
          
          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-primary" /> 1. Acceptance of Terms
            </h2>
            <div className="prose prose-invert max-w-none text-text-secondary">
              <p>By accessing or using the Novalyte AI platform (the "Service"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the Service.</p>
              <p className="mt-4">These terms apply to all users, including patients, clinic administrators, healthcare practitioners, and vendors.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-warning" /> 2. Medical Disclaimer
            </h2>
            <div className="prose prose-invert max-w-none text-text-secondary">
              <div className="p-4 rounded-lg bg-warning/10 border border-warning/20 mb-4">
                <p className="text-warning font-medium">NOVALYTE AI DOES NOT PROVIDE MEDICAL ADVICE.</p>
              </div>
              <p>The content, AI assessments, triage recommendations, and insights provided by Novalyte AI are for informational and routing purposes only. They are not intended to be a substitute for professional medical advice, diagnosis, or treatment.</p>
              <p className="mt-4">Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read on the Novalyte AI platform.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" /> 3. User Responsibilities
            </h2>
            <div className="prose prose-invert max-w-none text-text-secondary">
              <p>As a user of the Service, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Provide accurate, current, and complete information during registration and assessment.</li>
                <li>Maintain the security and confidentiality of your account credentials.</li>
                <li>Notify us immediately of any unauthorized use of your account.</li>
                <li>Use the Service only for lawful purposes and in accordance with these Terms.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-primary" /> 4. Clinic & Vendor Obligations
            </h2>
            <div className="prose prose-invert max-w-none text-text-secondary">
              <p>Clinics, practitioners, and vendors participating in the Novalyte AI ecosystem must:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Maintain all necessary licenses, certifications, and regulatory approvals required to provide their respective services or products.</li>
                <li>Comply with all applicable healthcare laws, including HIPAA (or equivalent regional privacy laws) and anti-kickback statutes.</li>
                <li>Ensure that all information provided in directory listings, marketplace catalogs, and workforce profiles is accurate and not misleading.</li>
                <li>Indemnify Novalyte AI against any claims arising from the delivery of clinical care or the sale of products.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" /> 5. Intellectual Property
            </h2>
            <div className="prose prose-invert max-w-none text-text-secondary">
              <p>The Service and its original content, features, functionality, AI models, scoring algorithms, and routing logic are and will remain the exclusive property of Novalyte AI and its licensors. The Service is protected by copyright, trademark, and other laws.</p>
              <p className="mt-4">You may not modify, reproduce, distribute, create derivative works or adaptations of, publicly display or in any way exploit any of the content, software, or algorithms, in whole or in part, except as expressly authorized by us.</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
