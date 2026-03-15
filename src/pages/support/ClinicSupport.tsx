import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, MessageSquare, Building2, Users, CreditCard, Settings, Activity, ArrowRight, ShieldCheck, Zap, Database, Briefcase } from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

const KNOWLEDGE_CATEGORIES = [
  {
    id: 'onboarding',
    title: 'Onboarding & Setup',
    icon: ShieldCheck,
    articles: [
      {
        question: "What is the KYB and NPI verification process?",
        answer: "To maintain network integrity, all clinics must pass a Know Your Business (KYB) check and National Provider Identifier (NPI) verification. This process typically takes 24-48 hours. You will need to provide your clinic's legal entity name, EIN, and the active NPI numbers of your primary prescribing physicians."
      },
      {
        question: "How do I configure my Ideal Clinic Profile (ICP)?",
        answer: "Your ICP dictates the types of patients routed to your clinic. Navigate to Settings > Clinic ICP in your dashboard. You must define your primary treatment modalities, minimum acceptable patient budget, and geographic radius. The tighter your ICP, the higher your lead conversion rate will be."
      }
    ]
  },
  {
    id: 'routing',
    title: 'Patient Routing & Pipeline',
    icon: Users,
    articles: [
      {
        question: "How does the AI matching engine route leads?",
        answer: "The Novalyte AI engine scores incoming patients across three vectors: Clinical Fit, Financial Readiness, and Urgency. When a patient scores above the threshold for your defined ICP, their anonymized dossier is routed to your pipeline. You only receive leads that match your operational capacity."
      },
      {
        question: "How do I manage patient stages in the pipeline?",
        answer: "Your Pipeline dashboard uses a Kanban-style interface. When a lead arrives, it sits in 'Incoming Intel'. Once you initiate contact, move them to 'Triage in Progress'. It is critical to update these stages accurately, as our machine learning models use your conversion velocity to optimize future routing."
      }
    ]
  },
  {
    id: 'integrations',
    title: 'Integrations & EMR',
    icon: Database,
    articles: [
      {
        question: "How do I integrate my EMR via HL7/FHIR?",
        answer: "Novalyte AI supports standard HL7/FHIR integrations for major EMR systems (e.g., Athenahealth, DrChrono, AdvancedMD). Navigate to Settings > Integrations to generate your API keys. You will need to provide your EMR integration endpoint and configure the webhook listeners for patient sync."
      },
      {
        question: "Can I export leads to my external CRM?",
        answer: "Yes. We offer native integrations for Salesforce Health Cloud, HubSpot, and GoHighLevel. If you use a custom CRM, you can utilize our secure Webhook architecture to push lead payloads in real-time upon patient routing."
      }
    ]
  },
  {
    id: 'billing',
    title: 'Billing & Subscriptions',
    icon: CreditCard,
    articles: [
      {
        question: "How does the lead pricing model work?",
        answer: "Novalyte AI operates on a SaaS + Performance model. Your base Clinic OS subscription covers platform access and a baseline volume of leads. Additional leads are priced dynamically based on intent score, treatment type (e.g., TRT vs. Peptides), and geographic competition."
      },
      {
        question: "Where can I download my monthly invoices?",
        answer: "Invoices are generated on the 1st of every month. You can download PDF copies and review your itemized lead acquisition costs by navigating to Dashboard > Billing > Invoice History."
      }
    ]
  },
  {
    id: 'workforce',
    title: 'Workforce & Staffing',
    icon: Briefcase,
    articles: [
      {
        question: "How do I request temporary or permanent staffing?",
        answer: "Use the Workforce tab in your dashboard to create a new staffing requisition. Specify the role (e.g., NP, PA, RN), required certifications, schedule, and compensation. Our AI will match you with available, credentialed practitioners in your area."
      }
    ]
  }
];

export function ClinicSupport() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openArticle, setOpenArticle] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const navigate = useNavigate();

  const filteredCategories = useMemo(() => {
    let filtered = KNOWLEDGE_CATEGORIES;

    if (activeCategory !== 'all') {
      filtered = filtered.filter(cat => cat.id === activeCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.map(cat => ({
        ...cat,
        articles: cat.articles.filter(article => 
          article.question.toLowerCase().includes(query) || 
          article.answer.toLowerCase().includes(query)
        )
      })).filter(cat => cat.articles.length > 0);
    }

    return filtered;
  }, [searchQuery, activeCategory]);

  const toggleArticle = (id: string) => {
    setOpenArticle(openArticle === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#05070A] pt-24 pb-16 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 via-primary/5 to-transparent blur-3xl rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-sm font-bold mb-6 shadow-[0_0_15px_rgba(139,92,246,0.15)]">
            <Building2 className="w-4 h-4" /> Clinic Enablement Center
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 tracking-tight">
            Clinic Operations Support
          </h1>
          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10">
            Technical documentation, integration guides, and operational playbooks for Novalyte clinic partners.
          </p>
          
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
            <input 
              type="text" 
              placeholder="Search documentation, API guides, or routing rules..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-[#0B0F14] border border-surface-3 rounded-xl text-white placeholder:text-text-secondary focus:outline-none focus:border-secondary/50 focus:ring-1 focus:ring-secondary/50 transition-all shadow-lg"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              activeCategory === 'all' 
                ? 'bg-secondary text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]' 
                : 'bg-surface-1 border border-surface-3 text-text-secondary hover:text-white hover:border-surface-3/80'
            }`}
          >
            All Documentation
          </button>
          {KNOWLEDGE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                activeCategory === cat.id 
                  ? 'bg-secondary text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]' 
                  : 'bg-surface-1 border border-surface-3 text-text-secondary hover:text-white hover:border-surface-3/80'
              }`}
            >
              <cat.icon className="w-4 h-4" />
              {cat.title}
            </button>
          ))}
        </div>

        {/* Knowledge Base Articles */}
        <div className="mb-20 min-h-[400px]">
          {filteredCategories.length > 0 ? (
            <div className="space-y-10">
              {filteredCategories.map((category) => (
                <div key={category.id} className="space-y-4">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                    <category.icon className="w-5 h-5 text-secondary" />
                    {category.title}
                  </h2>
                  <div className="space-y-3">
                    {category.articles.map((article, index) => {
                      const articleId = `${category.id}-${index}`;
                      const isOpen = openArticle === articleId;
                      return (
                        <Card 
                          key={index} 
                          className={`bg-[#0B0F14] border transition-all cursor-pointer overflow-hidden ${
                            isOpen ? 'border-secondary/30 shadow-[0_0_15px_rgba(139,92,246,0.05)]' : 'border-surface-3 hover:border-surface-3/80'
                          }`}
                          onClick={() => toggleArticle(articleId)}
                        >
                          <div className="p-5 flex justify-between items-center gap-4">
                            <h3 className={`text-base font-bold transition-colors ${isOpen ? 'text-white' : 'text-text-primary'}`}>
                              {article.question}
                            </h3>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                              isOpen ? 'bg-secondary/10 text-secondary' : 'bg-surface-2 text-text-secondary'
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
                                  {article.answer}
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
              <h3 className="text-lg font-bold text-white mb-2">No documentation found</h3>
              <p className="text-text-secondary">We couldn't find any articles matching "{searchQuery}".</p>
              <Button 
                variant="outline" 
                className="mt-6 border-surface-3 hover:border-secondary/50 hover:text-white"
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
          {/* Partner Success Escalation */}
          <Card className="bg-gradient-to-br from-[#0B0F14] to-surface-1 border-surface-3 p-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary mb-6 border border-secondary/20 shadow-[0_0_15px_rgba(139,92,246,0.15)]">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Contact Partner Success</h3>
              <p className="text-text-secondary mb-8 text-sm leading-relaxed">
                Need assistance configuring your ICP, troubleshooting an EMR integration, or adjusting your lead volume? Our partner success team is ready to help.
              </p>
              <Button 
                onClick={() => navigate('/contact')}
                className="w-full bg-secondary hover:bg-secondary-hover text-white border-none"
              >
                Open Support Ticket <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>

          {/* System Status Escalation */}
          <Card className="bg-gradient-to-br from-[#0B0F14] to-surface-1 border-surface-3 p-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 border border-primary/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">System Status</h3>
              <p className="text-text-secondary mb-8 text-sm leading-relaxed">
                Check the real-time operational status of the Novalyte AI routing engine, API endpoints, and marketplace infrastructure.
              </p>
              <Button 
                onClick={() => navigate('/status')}
                variant="outline"
                className="w-full border-surface-3 hover:border-primary/50 hover:text-white"
              >
                View System Status <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
