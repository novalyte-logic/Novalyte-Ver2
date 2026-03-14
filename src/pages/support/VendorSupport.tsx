import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, MessageSquare, Box, BarChart2, Code, ShieldCheck } from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';

export function VendorSupport() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      question: "How do I list my products in the Marketplace?",
      answer: "After your vendor application is approved, you will receive access to the Vendor Portal. From there, you can upload product catalogs via CSV, API, or manual entry. All products undergo a brief compliance review before going live."
    },
    {
      question: "What are the API rate limits?",
      answer: "Standard vendor API access allows 1,000 requests per minute for catalog sync and order management. Enterprise partners can request increased limits through their account manager."
    },
    {
      question: "How are marketplace transactions processed?",
      answer: "Novalyte AI facilitates the transaction and routes the order details to your system via webhook or API. Payment processing is handled securely, and funds are disbursed according to your vendor agreement."
    },
    {
      question: "How do I access performance analytics?",
      answer: "The Vendor Portal provides real-time dashboards showing product views, conversion rates, clinic adoption metrics, and revenue analytics. You can also export this data or access it programmatically via the Analytics API."
    },
    {
      question: "What are the compliance requirements?",
      answer: "All products must comply with FDA regulations (where applicable) and our internal quality standards. Health tech devices must provide data security documentation, and supplements must provide third-party testing certificates."
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 text-sm font-medium mb-6">
            <Box className="w-4 h-4" /> Vendor Documentation
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-6">
            Vendor Support Center
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-8">
            API documentation, marketplace guidelines, and analytics support for Novalyte vendors.
          </p>
          
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
            <input 
              type="text" 
              placeholder="Search API docs, guidelines..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-surface-1 border border-surface-3 rounded-xl text-lg focus:outline-none focus:border-teal-500/50 transition-colors shadow-lg"
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card className="bg-surface-1 border-surface-3 p-6 hover:border-teal-500/30 transition-colors cursor-pointer group">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400 mb-4 group-hover:scale-110 transition-transform">
              <Code className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">API Reference</h3>
            <p className="text-text-secondary text-sm">Endpoints for catalog sync, order management, and webhooks.</p>
          </Card>
          
          <Card className="bg-surface-1 border-surface-3 p-6 hover:border-teal-500/30 transition-colors cursor-pointer group">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400 mb-4 group-hover:scale-110 transition-transform">
              <BarChart2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">Analytics Guide</h3>
            <p className="text-text-secondary text-sm">Understand your dashboard metrics and conversion funnels.</p>
          </Card>

          <Card className="bg-surface-1 border-surface-3 p-6 hover:border-teal-500/30 transition-colors cursor-pointer group">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400 mb-4 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">Compliance</h3>
            <p className="text-text-secondary text-sm">Quality standards, FDA requirements, and listing guidelines.</p>
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
                      <ChevronUp className="w-5 h-5 text-teal-400 flex-shrink-0" />
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
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-teal-500/5 via-transparent to-transparent" />
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-400 mx-auto mb-6">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-4">API or Integration Issues?</h2>
            <p className="text-text-secondary mb-8 max-w-lg mx-auto">
              Our developer support team is available to assist with API integration, webhooks, and catalog synchronization.
            </p>
            <Button className="px-8 py-4 text-lg bg-teal-500 hover:bg-teal-600 text-white border-none">Contact Developer Support</Button>
          </div>
        </Card>

      </div>
    </div>
  );
}
