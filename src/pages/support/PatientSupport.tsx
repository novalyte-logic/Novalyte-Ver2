import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, MessageSquare, FileText, Activity, Shield } from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';

export function PatientSupport() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      question: "How does the AI assessment work?",
      answer: "Our AI assessment analyzes your symptoms, health goals, and medical history to match you with the most appropriate clinical protocols and certified providers in our network. It uses advanced machine learning trained on thousands of successful patient outcomes."
    },
    {
      question: "Is my medical data secure?",
      answer: "Yes. Novalyte AI employs enterprise-grade encryption and is fully HIPAA-aligned. Your personal health information (PHI) is isolated, encrypted at rest and in transit, and only shared with clinics you explicitly authorize."
    },
    {
      question: "How are clinics vetted?",
      answer: "Every clinic in the Novalyte network undergoes a rigorous verification process. We check medical licenses, verify their operational history, review patient outcomes, and ensure they meet our high standards for clinical excellence and patient care."
    },
    {
      question: "What happens after I book a consultation?",
      answer: "Once you book a consultation, your selected clinic will receive your secure health dossier. They will contact you to confirm the appointment, discuss your specific needs, and outline the next steps for your treatment plan."
    },
    {
      question: "Can I use my insurance?",
      answer: "Novalyte AI focuses on specialized, optimization-focused treatments (like TRT, peptide therapy, and longevity protocols) which are typically out-of-pocket. However, some clinics may accept HSA/FSA cards or provide superbills for out-of-network reimbursement."
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Shield className="w-4 h-4" /> Patient Help Center
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-6">
            How can we help you?
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-8">
            Find answers to common questions about our assessment, data privacy, and clinic matching process.
          </p>
          
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
            <input 
              type="text" 
              placeholder="Search for answers..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-surface-1 border border-surface-3 rounded-xl text-lg focus:outline-none focus:border-primary/50 transition-colors shadow-lg"
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card className="bg-surface-1 border-surface-3 p-6 hover:border-primary/30 transition-colors cursor-pointer group">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">Assessment Guide</h3>
            <p className="text-text-secondary text-sm">Learn how to get the most accurate results from your health assessment.</p>
          </Card>
          
          <Card className="bg-surface-1 border-surface-3 p-6 hover:border-primary/30 transition-colors cursor-pointer group">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">Privacy & Security</h3>
            <p className="text-text-secondary text-sm">Understand how we protect your sensitive medical information.</p>
          </Card>

          <Card className="bg-surface-1 border-surface-3 p-6 hover:border-primary/30 transition-colors cursor-pointer group">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">Treatment Info</h3>
            <p className="text-text-secondary text-sm">Read about common protocols, expected outcomes, and timelines.</p>
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
                      <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
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
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-6">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-4">Still need help?</h2>
            <p className="text-text-secondary mb-8 max-w-lg mx-auto">
              Our patient support team is available to answer any specific questions about your assessment, privacy, or clinic matching.
            </p>
            <Button className="px-8 py-4 text-lg">Contact Support</Button>
          </div>
        </Card>

      </div>
    </div>
  );
}
