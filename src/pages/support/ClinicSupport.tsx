import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, MessageSquare, Building2, Users, CreditCard, Settings } from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';

export function ClinicSupport() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      question: "How do I integrate my EMR?",
      answer: "Novalyte AI supports standard HL7/FHIR integrations for major EMR systems. You can access your API keys and integration documentation in the Settings > Integrations panel of your Clinic Dashboard."
    },
    {
      question: "How are leads routed to my clinic?",
      answer: "Leads are routed based on your Ideal Clinic Profile (ICP). The AI matches patient demographics, treatment interests, budget, and location against your capacity and specialty settings to ensure high-intent matches."
    },
    {
      question: "What is the cost per lead?",
      answer: "Novalyte AI operates on a subscription model for the Clinic OS, with tiered lead volumes included. Additional leads are priced dynamically based on intent score, treatment type, and geographic competition."
    },
    {
      question: "How do I update my clinic profile?",
      answer: "Navigate to Settings > Clinic Profile in your dashboard. Changes to your specialties, providers, or location will automatically update your public directory listing and adjust your AI routing parameters."
    },
    {
      question: "How do I request staffing?",
      answer: "Use the Workforce tab in your dashboard to create a new staffing request. Specify the role, required certifications, schedule, and compensation. The AI will match you with available, credentialed practitioners in your area."
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-6">
            <Building2 className="w-4 h-4" /> Clinic Knowledge Base
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-6">
            Clinic Operations Support
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-8">
            Documentation, integration guides, and operational support for Novalyte clinic partners.
          </p>
          
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
            <input 
              type="text" 
              placeholder="Search documentation..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-surface-1 border border-surface-3 rounded-xl text-lg focus:outline-none focus:border-secondary/50 transition-colors shadow-lg"
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card className="bg-surface-1 border-surface-3 p-6 hover:border-secondary/30 transition-colors cursor-pointer group">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">Lead Routing</h3>
            <p className="text-text-secondary text-sm">Understand the AI matching engine and how to optimize your ICP.</p>
          </Card>
          
          <Card className="bg-surface-1 border-surface-3 p-6 hover:border-secondary/30 transition-colors cursor-pointer group">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary mb-4 group-hover:scale-110 transition-transform">
              <Settings className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">Integrations</h3>
            <p className="text-text-secondary text-sm">Connect your EMR, CRM, and communication tools.</p>
          </Card>

          <Card className="bg-surface-1 border-surface-3 p-6 hover:border-secondary/30 transition-colors cursor-pointer group">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary mb-4 group-hover:scale-110 transition-transform">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">Billing & Plans</h3>
            <p className="text-text-secondary text-sm">Manage your subscription, invoices, and payment methods.</p>
          </Card>
        </div>

        {/* FAQs */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-text-primary mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <Card 
                  key={index} 
                  className="bg-surface-1 border-surface-3 p-0 overflow-hidden cursor-pointer hover:border-surface-3/80 transition-colors"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <div className="p-6 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-text-primary pr-8">{faq.question}</h3>
                    {openFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-secondary flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-text-secondary flex-shrink-0" />
                    )}
                  </div>
                  {openFaq === index && (
                    <div className="px-6 pb-6 text-text-secondary leading-relaxed animate-in fade-in slide-in-from-top-2">
                      {faq.answer}
                    </div>
                  )}
                </Card>
              ))
            ) : (
              <div className="text-center py-12 bg-surface-1 rounded-xl border border-surface-3">
                <p className="text-text-secondary">No results found for "{searchQuery}".</p>
              </div>
            )}
          </div>
        </div>

        {/* Contact Support */}
        <Card className="bg-gradient-to-br from-surface-1 to-surface-2 border-surface-3 p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-secondary/5 via-transparent to-transparent" />
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center text-secondary mx-auto mb-6">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-4">Need technical support?</h2>
            <p className="text-text-secondary mb-8 max-w-lg mx-auto">
              Our partner success team is available to assist with integrations, routing configuration, and operational issues.
            </p>
            <Button className="px-8 py-4 text-lg bg-secondary hover:bg-secondary/90 text-white">Contact Partner Success</Button>
          </div>
        </Card>

      </div>
    </div>
  );
}
