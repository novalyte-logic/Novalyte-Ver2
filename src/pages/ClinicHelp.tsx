import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Search, LifeBuoy, BookOpen, MessageCircle, FileText, 
  ExternalLink, PlayCircle, Activity, CheckCircle2, 
  ChevronDown, ChevronUp, Ticket, Phone, Mail, ArrowRight,
  AlertCircle
} from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';

export function ClinicHelp() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    { 
      q: "How do I integrate my EMR with Novalyte?", 
      a: "Novalyte OS supports HL7 and FHIR standards. Navigate to Settings > Integrations to connect supported EMRs like AthenaHealth or DrChrono. For custom integrations, refer to our API Documentation." 
    },
    { 
      q: "How are patient leads scored and routed?", 
      a: "Leads are scored based on clinical fit, financial readiness, urgency, and engagement with our AI triage system. Only leads meeting your clinic's Ideal Patient Profile (ICP) are routed to your pipeline." 
    },
    { 
      q: "Can I pause lead generation if we are at capacity?", 
      a: "Yes. You can adjust your lead velocity dial in the Leads tab to pause or accelerate incoming patient requests in real-time." 
    },
    { 
      q: "How do I request temporary staffing?", 
      a: "Navigate to the Workforce tab and click 'New Staffing Request'. Specify the role, duration, and requirements. Our AI will match you with qualified, vetted practitioners within 24-48 hours." 
    },
    { 
      q: "Where can I view my billing history and invoices?", 
      a: "Your subscription details, payment methods, and past invoices are located in the Billing tab within your dashboard." 
    }
  ];

  const tickets = [
    { id: 'TIC-8921', subject: 'EMR Sync Delay', status: 'Resolved', date: 'Oct 12, 2026' },
    { id: 'TIC-8944', subject: 'Billing Update Inquiry', status: 'In Progress', date: 'Oct 14, 2026' },
  ];

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col animate-in fade-in duration-500">
      
      {/* Header & Search */}
      <div className="flex-none flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Help & Support</h1>
          <p className="text-text-secondary mt-1">Get assistance, read documentation, and manage your support tickets.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
          <input 
            type="text"
            placeholder="Search guides, FAQs, and documentation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#0B0F14] border border-surface-3 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
      </div>

      <div className="flex-grow overflow-y-auto hide-scrollbar pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Resource Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="p-5 bg-surface-1 border-surface-3 hover:border-primary/50 transition-all cursor-pointer group">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1 group-hover:text-primary transition-colors">Knowledge Base</h3>
                    <p className="text-sm text-text-secondary mb-3">Browse articles, tutorials, and operational guides.</p>
                    <span className="text-xs font-bold text-primary flex items-center gap-1">
                      Browse Articles <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="p-5 bg-surface-1 border-surface-3 hover:border-secondary/50 transition-all cursor-pointer group">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary shrink-0 group-hover:scale-110 transition-transform">
                    <PlayCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1 group-hover:text-secondary transition-colors">Video Tutorials</h3>
                    <p className="text-sm text-text-secondary mb-3">Step-by-step video guides for clinic operators.</p>
                    <span className="text-xs font-bold text-secondary flex items-center gap-1">
                      Watch Videos <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="p-5 bg-surface-1 border-surface-3 hover:border-warning/50 transition-all cursor-pointer group">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center text-warning shrink-0 group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1 group-hover:text-warning transition-colors">Community Forum</h3>
                    <p className="text-sm text-text-secondary mb-3">Connect with other clinic operators and share protocols.</p>
                    <span className="text-xs font-bold text-warning flex items-center gap-1">
                      Join Discussion <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="p-5 bg-surface-1 border-surface-3 hover:border-success/50 transition-all cursor-pointer group">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center text-success shrink-0 group-hover:scale-110 transition-transform">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1 group-hover:text-success transition-colors">API Documentation</h3>
                    <p className="text-sm text-text-secondary mb-3">Technical docs for custom EMR and CRM integrations.</p>
                    <span className="text-xs font-bold text-success flex items-center gap-1">
                      View Docs <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Card>
            </div>

            {/* FAQs */}
            <Card className="p-6 bg-surface-1 border-surface-3">
              <h2 className="text-xl font-bold text-white mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {faqs.map((faq, i) => (
                  <div 
                    key={i} 
                    className={`border rounded-xl overflow-hidden transition-colors ${
                      openFaq === i ? 'border-primary/30 bg-primary/5' : 'border-surface-3 bg-[#0B0F14] hover:border-surface-4'
                    }`}
                  >
                    <button 
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-4 text-left focus:outline-none"
                    >
                      <span className="font-bold text-white pr-4">{faq.q}</span>
                      {openFaq === i ? (
                        <ChevronUp className="w-5 h-5 text-primary shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-text-secondary shrink-0" />
                      )}
                    </button>
                    <AnimatePresence>
                      {openFaq === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 pt-0 text-sm text-text-secondary leading-relaxed">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </Card>

          </div>

          {/* Right Sidebar Column */}
          <div className="space-y-6">
            
            {/* Escalation Paths */}
            <Card className="p-6 bg-surface-1 border-surface-3">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <LifeBuoy className="w-5 h-5 text-primary" /> Support Channels
              </h2>
              
              <div className="space-y-3">
                <Link to="/contact">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-black font-bold flex items-center justify-center gap-2 py-3">
                    <MessageCircle className="w-4 h-4" /> Live Chat Support
                  </Button>
                </Link>
                
                <Link to="/contact">
                  <Button variant="outline" className="w-full border-surface-3 text-white hover:bg-surface-2 flex items-center justify-center gap-2 py-3">
                    <Ticket className="w-4 h-4" /> Submit a Ticket
                  </Button>
                </Link>

                <div className="pt-4 mt-4 border-t border-surface-3">
                  <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">Enterprise Support</p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-white">
                      <div className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center shrink-0">
                        <Phone className="w-4 h-4 text-text-secondary" />
                      </div>
                      <div>
                        <p className="font-bold">Dedicated Account Manager</p>
                        <p className="text-text-secondary text-xs">Available 9am - 6pm EST</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-white">
                      <div className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center shrink-0">
                        <Mail className="w-4 h-4 text-text-secondary" />
                      </div>
                      <div>
                        <p className="font-bold">Priority Email</p>
                        <p className="text-text-secondary text-xs">support@novalyte.io</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Recent Tickets */}
            <Card className="p-6 bg-surface-1 border-surface-3">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">Recent Tickets</h2>
                <button className="text-xs font-bold text-primary hover:text-primary/80 transition-colors">View All</button>
              </div>
              <div className="space-y-3">
                {tickets.map((ticket, i) => (
                  <div key={i} className="p-3 border border-surface-3 rounded-lg bg-[#0B0F14] hover:border-surface-4 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono text-text-secondary">{ticket.id}</span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        ticket.status === 'Resolved' 
                          ? 'bg-success/10 text-success border-success/20' 
                          : 'bg-warning/10 text-warning border-warning/20'
                      }`}>
                        {ticket.status}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-white truncate">{ticket.subject}</p>
                    <p className="text-xs text-text-secondary mt-1">Updated {ticket.date}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* System Health */}
            <Card className="p-6 bg-surface-1 border-surface-3">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-success" /> System Health
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Lead Routing Engine</span>
                  <span className="flex items-center gap-1.5 text-xs font-bold text-success">
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse" /> Operational
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">EMR Sync API</span>
                  <span className="flex items-center gap-1.5 text-xs font-bold text-success">
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse" /> Operational
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Workforce Matching</span>
                  <span className="flex items-center gap-1.5 text-xs font-bold text-success">
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse" /> Operational
                  </span>
                </div>
                <div className="pt-3 mt-3 border-t border-surface-3 flex items-center justify-between">
                  <span className="text-xs text-text-secondary">Last checked: Just now</span>
                  <button className="text-xs font-bold text-primary hover:text-primary/80 flex items-center gap-1">
                    Status Page <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}
