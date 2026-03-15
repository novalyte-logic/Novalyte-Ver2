import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, MessageSquare, Box, BarChart2, Code, ShieldCheck, ArrowRight, Database, DollarSign, Activity, Zap } from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

const VENDOR_CATEGORIES = [
  {
    id: 'integration',
    title: 'API & Integration',
    icon: Code,
    articles: [
      {
        question: "How do I authenticate with the Vendor API?",
        answer: "Authentication is handled via Bearer tokens. You can generate your production and sandbox API keys in the Vendor Portal under Developer Settings. All requests must be made over HTTPS and include your token in the Authorization header."
      },
      {
        question: "How do I configure inventory sync webhooks?",
        answer: "To keep your marketplace listings accurate, configure a webhook endpoint in your Vendor Portal. We will send POST requests to your endpoint whenever an order is placed, and you should push inventory updates to our /api/v1/inventory endpoint when stock levels change."
      },
      {
        question: "What are the API rate limits?",
        answer: "Standard vendor API access allows 1,000 requests per minute for catalog sync and order management. Enterprise partners can request increased limits through their dedicated account manager."
      }
    ]
  },
  {
    id: 'listing',
    title: 'Catalog & Listing',
    icon: Box,
    articles: [
      {
        question: "How do I list products requiring clinical approval?",
        answer: "Products that require clinical gating (e.g., prescription peptides, specialized diagnostics) must be flagged in your catalog upload. These products will not have a direct 'Buy' button; instead, the CTA will route the patient through the Novalyte Clinical Assessment funnel."
      },
      {
        question: "What is the product approval process?",
        answer: "After uploading your catalog via CSV or API, all products undergo a compliance review. We verify FDA compliance (where applicable), marketing claims, and third-party testing certificates. This process typically takes 2-3 business days."
      }
    ]
  },
  {
    id: 'analytics',
    title: 'Analytics & Visibility',
    icon: BarChart2,
    articles: [
      {
        question: "How is the Marketplace Visibility Score calculated?",
        answer: "Your Visibility Score determines your ranking in marketplace search results and AI recommendations. It is calculated based on your fulfillment velocity, clinic adoption rate, patient reviews, and the completeness of your product metadata."
      },
      {
        question: "How do I track conversion funnels?",
        answer: "The Vendor Portal provides real-time dashboards showing product impressions, click-through rates, and conversion metrics. You can segment this data by patient demographics or clinic type to optimize your listing copy."
      }
    ]
  },
  {
    id: 'commercial',
    title: 'Commercial Operations',
    icon: DollarSign,
    articles: [
      {
        question: "How are marketplace transactions processed?",
        answer: "Novalyte AI facilitates the transaction and routes the order details to your system via webhook or API. Payment processing is handled securely through our Stripe Connect infrastructure."
      },
      {
        question: "What is the payout schedule?",
        answer: "Funds are disbursed to your connected bank account on a rolling 7-day schedule after the order is marked as 'Fulfilled' via the API. You can view your upcoming payouts and download reconciliation reports in the Billing tab."
      },
      {
        question: "How are patient disputes handled?",
        answer: "If a patient initiates a dispute or refund request, it will appear in your Resolution Center. You have 48 hours to respond with tracking information or authorize the refund before the system automatically decides in the patient's favor."
      }
    ]
  }
];

export function VendorSupport() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openArticle, setOpenArticle] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const navigate = useNavigate();

  const filteredCategories = useMemo(() => {
    let filtered = VENDOR_CATEGORIES;

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
        <div className="absolute inset-0 bg-gradient-to-b from-teal-500/20 via-emerald-500/5 to-transparent blur-3xl rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm font-bold mb-6 shadow-[0_0_15px_rgba(20,184,166,0.15)]">
            <Box className="w-4 h-4" /> Partner Documentation
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 tracking-tight">
            Vendor Support Center
          </h1>
          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10">
            API documentation, marketplace guidelines, and commercial operations support for Novalyte vendors.
          </p>
          
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
            <input 
              type="text" 
              placeholder="Search API docs, webhooks, or listing guidelines..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-[#0B0F14] border border-surface-3 rounded-xl text-white placeholder:text-text-secondary focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all shadow-lg"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              activeCategory === 'all' 
                ? 'bg-teal-500 text-[#05070A] shadow-[0_0_15px_rgba(20,184,166,0.3)]' 
                : 'bg-surface-1 border border-surface-3 text-text-secondary hover:text-white hover:border-surface-3/80'
            }`}
          >
            All Documentation
          </button>
          {VENDOR_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                activeCategory === cat.id 
                  ? 'bg-teal-500 text-[#05070A] shadow-[0_0_15px_rgba(20,184,166,0.3)]' 
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
                    <category.icon className="w-5 h-5 text-teal-400" />
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
                            isOpen ? 'border-teal-500/30 shadow-[0_0_15px_rgba(20,184,166,0.05)]' : 'border-surface-3 hover:border-surface-3/80'
                          }`}
                          onClick={() => toggleArticle(articleId)}
                        >
                          <div className="p-5 flex justify-between items-center gap-4">
                            <h3 className={`text-base font-bold transition-colors ${isOpen ? 'text-white' : 'text-text-primary'}`}>
                              {article.question}
                            </h3>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                              isOpen ? 'bg-teal-500/10 text-teal-400' : 'bg-surface-2 text-text-secondary'
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
                className="mt-6 border-surface-3 hover:border-teal-500/50 hover:text-white"
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
          {/* Developer Support Escalation */}
          <Card className="bg-gradient-to-br from-[#0B0F14] to-surface-1 border-surface-3 p-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400 mb-6 border border-teal-500/20 shadow-[0_0_15px_rgba(20,184,166,0.15)]">
                <Code className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Partner Engineering</h3>
              <p className="text-text-secondary mb-8 text-sm leading-relaxed">
                Need assistance with API authentication, webhook payloads, or catalog synchronization? Our partner engineering team is ready to help.
              </p>
              <Button 
                onClick={() => navigate('/contact')}
                className="w-full bg-teal-500 hover:bg-teal-600 text-[#05070A] font-bold border-none"
              >
                Open Technical Ticket <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>

          {/* Vendor Portal Escalation */}
          <Card className="bg-gradient-to-br from-[#0B0F14] to-surface-1 border-surface-3 p-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-6 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Vendor Portal</h3>
              <p className="text-text-secondary mb-8 text-sm leading-relaxed">
                Access your API keys, manage your product catalog, view real-time analytics, and handle order fulfillment in your dedicated portal.
              </p>
              <Button 
                onClick={() => navigate('/vendors/apply')}
                variant="outline"
                className="w-full border-surface-3 hover:border-emerald-500/50 hover:text-white"
              >
                Access Vendor Portal <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
