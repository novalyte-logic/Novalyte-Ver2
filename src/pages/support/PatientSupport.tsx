import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, MessageSquare, FileText, Activity, Shield, Sparkles, ArrowRight, Lock, Stethoscope, CreditCard } from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

const FAQ_CATEGORIES = [
  {
    id: 'assessment',
    title: 'Assessment & Matching',
    icon: Activity,
    faqs: [
      {
        question: "How does the AI clinical assessment work?",
        answer: "Our clinical assessment engine analyzes your reported symptoms, health goals, and medical history to map potential endocrine or metabolic friction. It then matches you with the most appropriate clinical protocols and certified providers in our network based on your specific profile."
      },
      {
        question: "What happens after I complete my assessment?",
        answer: "Upon completion, you will receive a clinical match score and a personalized symptom profile. If you choose to proceed, your secure health dossier is routed to a vetted clinic in our network. They will contact you to schedule a comprehensive consultation and order necessary lab work."
      },
      {
        question: "Is the assessment a medical diagnosis?",
        answer: "No. The Novalyte AI assessment is an educational and routing tool. It does not provide medical diagnoses. Only a licensed healthcare provider can diagnose conditions and prescribe treatments after reviewing your comprehensive blood work and medical history."
      }
    ]
  },
  {
    id: 'privacy',
    title: 'Privacy & Security',
    icon: Lock,
    faqs: [
      {
        question: "Is my medical data secure and private?",
        answer: "Absolutely. Novalyte AI employs enterprise-grade encryption and operates with strict HIPAA-aligned protocols. Your personal health information (PHI) is isolated, encrypted both at rest and in transit, and is never sold to third parties."
      },
      {
        question: "Who has access to my assessment results?",
        answer: "Your assessment data is strictly confidential. It is only shared with the specific clinical partner you explicitly authorize during the booking process. Our internal systems use anonymized data for routing and intelligence."
      }
    ]
  },
  {
    id: 'network',
    title: 'Clinic Network',
    icon: Stethoscope,
    faqs: [
      {
        question: "How are clinics in your network vetted?",
        answer: "Every clinic in the Novalyte network undergoes a rigorous operational and clinical verification process. We verify active medical licenses, review patient outcomes, ensure they require comprehensive lab work before prescribing, and confirm they meet our high standards for patient care."
      },
      {
        question: "Can I choose which clinic I work with?",
        answer: "Yes. While our intelligence engine will recommend the best-matched clinic based on your assessment and location, you can always browse our full Clinic Directory to select a provider you prefer."
      }
    ]
  },
  {
    id: 'billing',
    title: 'Billing & Insurance',
    icon: CreditCard,
    faqs: [
      {
        question: "Does Novalyte AI charge me for the assessment?",
        answer: "No, the initial clinical assessment and clinic matching service are provided completely free of charge to patients."
      },
      {
        question: "Can I use my health insurance for treatments?",
        answer: "Novalyte AI focuses on specialized, optimization-focused treatments (like TRT, peptide therapy, and longevity protocols) which are typically out-of-pocket. However, many of our partner clinics accept HSA/FSA cards or can provide superbills for out-of-network reimbursement."
      }
    ]
  }
];

export function PatientSupport() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const navigate = useNavigate();

  const filteredCategories = useMemo(() => {
    let filtered = FAQ_CATEGORIES;

    if (activeCategory !== 'all') {
      filtered = filtered.filter(cat => cat.id === activeCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.map(cat => ({
        ...cat,
        faqs: cat.faqs.filter(faq => 
          faq.question.toLowerCase().includes(query) || 
          faq.answer.toLowerCase().includes(query)
        )
      })).filter(cat => cat.faqs.length > 0);
    }

    return filtered;
  }, [searchQuery, activeCategory]);

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#05070A] pt-24 pb-16 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-secondary/10 to-transparent blur-3xl rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-6 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <Shield className="w-4 h-4" /> Patient Help Center
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 tracking-tight">
            How can we support you?
          </h1>
          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10">
            Find answers about our clinical assessment, data privacy, and how we connect you with vetted medical providers.
          </p>
          
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
            <input 
              type="text" 
              placeholder="Search for answers..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-[#0B0F14] border border-surface-3 rounded-xl text-white placeholder:text-text-secondary focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-lg"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              activeCategory === 'all' 
                ? 'bg-primary text-[#05070A] shadow-[0_0_15px_rgba(6,182,212,0.3)]' 
                : 'bg-surface-1 border border-surface-3 text-text-secondary hover:text-white hover:border-surface-3/80'
            }`}
          >
            All Topics
          </button>
          {FAQ_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                activeCategory === cat.id 
                  ? 'bg-primary text-[#05070A] shadow-[0_0_15px_rgba(6,182,212,0.3)]' 
                  : 'bg-surface-1 border border-surface-3 text-text-secondary hover:text-white hover:border-surface-3/80'
              }`}
            >
              <cat.icon className="w-4 h-4" />
              {cat.title}
            </button>
          ))}
        </div>

        {/* FAQs */}
        <div className="mb-20 min-h-[400px]">
          {filteredCategories.length > 0 ? (
            <div className="space-y-10">
              {filteredCategories.map((category) => (
                <div key={category.id} className="space-y-4">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                    <category.icon className="w-5 h-5 text-primary" />
                    {category.title}
                  </h2>
                  <div className="space-y-3">
                    {category.faqs.map((faq, index) => {
                      const faqId = `${category.id}-${index}`;
                      const isOpen = openFaq === faqId;
                      return (
                        <Card 
                          key={index} 
                          className={`bg-[#0B0F14] border transition-all cursor-pointer overflow-hidden ${
                            isOpen ? 'border-primary/30 shadow-[0_0_15px_rgba(6,182,212,0.05)]' : 'border-surface-3 hover:border-surface-3/80'
                          }`}
                          onClick={() => toggleFaq(faqId)}
                        >
                          <div className="p-5 flex justify-between items-center gap-4">
                            <h3 className={`text-base font-bold transition-colors ${isOpen ? 'text-white' : 'text-text-primary'}`}>
                              {faq.question}
                            </h3>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                              isOpen ? 'bg-primary/10 text-primary' : 'bg-surface-2 text-text-secondary'
                            }`}>
                              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </div>
                          </div>
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <div className="px-5 pb-5 text-text-secondary leading-relaxed border-t border-surface-3/50 pt-4 mt-1">
                                  {faq.answer}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-[#0B0F14] rounded-2xl border border-surface-3">
              <Search className="w-12 h-12 text-surface-3 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">No results found</h3>
              <p className="text-text-secondary">We couldn't find any answers matching "{searchQuery}".</p>
              <Button 
                variant="outline" 
                className="mt-6"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
              >
                Clear Search
              </Button>
            </div>
          )}
        </div>

        {/* Escalation Paths */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ask AI Escalation */}
          <Card className="bg-gradient-to-br from-[#0B0F14] to-surface-1 border-surface-3 p-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary mb-6 border border-secondary/20 shadow-[0_0_15px_rgba(139,92,246,0.15)]">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Ask Novalyte AI</h3>
              <p className="text-text-secondary mb-8 text-sm leading-relaxed">
                Get instant, personalized guidance on symptoms, optimization protocols, and clinical routing from our intelligent health assistant.
              </p>
              <Button 
                onClick={() => navigate('/ask-ai')}
                className="w-full bg-secondary hover:bg-secondary-hover text-white border-none"
              >
                Chat with AI <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>

          {/* Human Support Escalation */}
          <Card className="bg-gradient-to-br from-[#0B0F14] to-surface-1 border-surface-3 p-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 border border-primary/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Contact Support</h3>
              <p className="text-text-secondary mb-8 text-sm leading-relaxed">
                Need help with a specific clinic, billing issue, or technical problem? Our patient support team is ready to assist you.
              </p>
              <Button 
                onClick={() => navigate('/contact')}
                variant="outline"
                className="w-full border-surface-3 hover:border-primary/50 hover:text-white"
              >
                Submit a Request <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
