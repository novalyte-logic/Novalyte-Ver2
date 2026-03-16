import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Search, LifeBuoy, BookOpen, MessageCircle, FileText, 
  ExternalLink, PlayCircle, Activity, CheckCircle2, 
  ChevronDown, ChevronUp, Ticket, Phone, Mail, ArrowRight,
  AlertCircle, X, Send
} from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { ClinicApiError, ClinicService } from '@/src/services/clinic';

interface SupportTicket {
  id: string;
  subject: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  priority: 'Low' | 'Medium' | 'High';
  createdAt: any;
  updatedAt: any;
}

export function ClinicHelp() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: '', description: '', priority: 'Medium' });
  const [submitting, setSubmitting] = useState(false);
  const [ticketFeedback, setTicketFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [systemHealth, setSystemHealth] = useState<Array<{ id: string; label: string; status: string }>>([]);

  useEffect(() => {
    let isActive = true;

    const loadSupport = async (silent = false) => {
      if (!silent) {
        setLoading(true);
      }
      try {
        const response = await ClinicService.getSupport();
        if (isActive) {
          setTickets(response.tickets as SupportTicket[]);
          setSystemHealth(response.systemHealth);
        }
      } catch (error) {
        console.error('Error loading support:', error);
        if (isActive) {
          setTicketFeedback({
            type: 'error',
            message: error instanceof ClinicApiError ? error.message : 'Unable to load support resources right now.',
          });
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void loadSupport();
    const interval = window.setInterval(() => {
      void loadSupport(true);
    }, 30000);

    return () => {
      isActive = false;
      window.clearInterval(interval);
    };
  }, []);

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicket.subject || !newTicket.description) return;

    setSubmitting(true);
    setTicketFeedback(null);
    try {
      const response = await ClinicService.createSupportTicket({
        subject: newTicket.subject,
        description: newTicket.description,
        priority: newTicket.priority,
      });
      setTickets((current) => [response.ticket as SupportTicket, ...current]);
      setNewTicket({ subject: '', description: '', priority: 'Medium' });
      setShowNewTicketModal(false);
      setTicketFeedback({
        type: 'success',
        message: 'Support ticket submitted successfully. Our team will respond shortly.',
      });
    } catch (error) {
      console.error('Error submitting ticket:', error);
      setTicketFeedback({
        type: 'error',
        message:
          error instanceof ClinicApiError
            ? error.message
            : 'Unable to submit your ticket right now. Please try again or contact support.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const resources = [
    {
      title: 'Knowledge Base',
      description: 'Browse articles, tutorials, and operational guides.',
      link: '/blog',
      label: 'Browse Articles',
      icon: BookOpen,
      accent: 'primary',
    },
    {
      title: 'Video Tutorials',
      description: 'Step-by-step video guides for clinic operators.',
      link: '/blog?topic=Clinic%20Operations',
      label: 'Watch Videos',
      icon: PlayCircle,
      accent: 'secondary',
    },
    {
      title: 'Community Forum',
      description: 'Connect with other clinic operators and share protocols.',
      link: '/contact?role=clinic&topic=community_forum',
      label: 'Join Discussion',
      icon: MessageCircle,
      accent: 'warning',
    },
    {
      title: 'API Documentation',
      description: 'Technical docs for custom EMR and CRM integrations.',
      link: '/support/clinic',
      label: 'View Docs',
      icon: FileText,
      accent: 'success',
    },
  ];

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

  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filteredResources = resources.filter((resource) =>
    !normalizedSearch ||
    resource.title.toLowerCase().includes(normalizedSearch) ||
    resource.description.toLowerCase().includes(normalizedSearch),
  );
  const filteredFaqs = faqs.filter((faq) =>
    !normalizedSearch ||
    faq.q.toLowerCase().includes(normalizedSearch) ||
    faq.a.toLowerCase().includes(normalizedSearch),
  );
  const filteredTickets = tickets.filter((ticket) =>
    !normalizedSearch ||
    ticket.subject.toLowerCase().includes(normalizedSearch) ||
    ticket.status.toLowerCase().includes(normalizedSearch) ||
    ticket.priority.toLowerCase().includes(normalizedSearch),
  );

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col animate-in fade-in duration-500">
      
      {/* Header & Search */}
      <div className="flex-none flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Help & Support</h1>
          <p className="text-text-secondary mt-1">Get assistance, read documentation, and manage your support tickets.</p>
          {ticketFeedback ? (
            <div className={`mt-4 rounded-lg border px-4 py-3 text-sm ${
              ticketFeedback.type === 'success'
                ? 'border-success/20 bg-success/10 text-success'
                : 'border-danger/20 bg-danger/10 text-danger'
            }`}>
              {ticketFeedback.message}
            </div>
          ) : null}
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
              {filteredResources.map((resource) => {
                const accentStyles =
                  resource.accent === 'primary'
                    ? {
                        border: 'hover:border-primary/50',
                        iconColor: 'text-primary',
                        iconBg: 'bg-primary/10',
                        titleHover: 'group-hover:text-primary',
                      }
                    : resource.accent === 'secondary'
                    ? {
                        border: 'hover:border-secondary/50',
                        iconColor: 'text-secondary',
                        iconBg: 'bg-secondary/10',
                        titleHover: 'group-hover:text-secondary',
                      }
                    : resource.accent === 'warning'
                    ? {
                        border: 'hover:border-warning/50',
                        iconColor: 'text-warning',
                        iconBg: 'bg-warning/10',
                        titleHover: 'group-hover:text-warning',
                      }
                    : {
                        border: 'hover:border-success/50',
                        iconColor: 'text-success',
                        iconBg: 'bg-success/10',
                        titleHover: 'group-hover:text-success',
                      };

                return (
                  <Link key={resource.title} to={resource.link}>
                    <Card className={`p-5 bg-surface-1 border-surface-3 transition-all cursor-pointer group ${accentStyles.border}`}>
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform ${accentStyles.iconBg}`}>
                          <resource.icon className={`w-5 h-5 ${accentStyles.iconColor}`} />
                        </div>
                        <div>
                          <h3 className={`font-bold text-white mb-1 ${accentStyles.titleHover} transition-colors`}>{resource.title}</h3>
                          <p className="text-sm text-text-secondary mb-3">{resource.description}</p>
                          <span className={`text-xs font-bold flex items-center gap-1 ${accentStyles.iconColor}`}>
                            {resource.label} <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
              {!filteredResources.length ? (
                <div className="sm:col-span-2 rounded-xl border border-dashed border-surface-3 bg-surface-1/30 p-8 text-center text-text-secondary">
                  No support resources matched that search.
                </div>
              ) : null}
            </div>

            {/* FAQs */}
            <Card className="p-6 bg-surface-1 border-surface-3">
              <h2 className="text-xl font-bold text-white mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {filteredFaqs.map((faq, i) => (
                  <div 
                    key={faq.q}
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
                {!filteredFaqs.length ? (
                  <div className="rounded-xl border border-dashed border-surface-3 bg-[#0B0F14] p-6 text-center text-text-secondary">
                    No FAQs matched your search.
                  </div>
                ) : null}
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
                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-black font-bold flex items-center justify-center gap-2 py-3"
                  onClick={() => navigate('/contact?role=clinic&topic=live_chat_support')}
                >
                  <MessageCircle className="w-4 h-4" /> Live Chat Support
                </Button>
                
                <Button 
                  onClick={() => setShowNewTicketModal(true)}
                  variant="outline" 
                  className="w-full border-surface-3 text-white hover:bg-surface-2 flex items-center justify-center gap-2 py-3"
                >
                  <Ticket className="w-4 h-4" /> Submit a Ticket
                </Button>

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
                <span className="text-xs font-bold text-text-secondary">
                  {filteredTickets.length} visible
                </span>
              </div>
              <div className="space-y-3">
                {loading ? (
                  <p className="text-xs text-text-secondary">Loading tickets...</p>
                ) : filteredTickets.length > 0 ? (
                  filteredTickets.map((ticket) => (
                    <div key={ticket.id} className="p-3 border border-surface-3 rounded-lg bg-[#0B0F14] hover:border-surface-4 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-mono text-text-secondary">{ticket.id.slice(0, 8).toUpperCase()}</span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          ticket.status === 'Resolved' 
                            ? 'bg-success/10 text-success border-success/20' 
                            : ticket.status === 'In Progress'
                            ? 'bg-warning/10 text-warning border-warning/20'
                            : 'bg-primary/10 text-primary border-primary/20'
                        }`}>
                          {ticket.status}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-white truncate">{ticket.subject}</p>
                      <p className="text-xs text-text-secondary mt-1">
                        Updated {ticket.updatedAt ? new Date(ticket.updatedAt).toLocaleDateString() : 'Recently'}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-text-secondary">No recent tickets matched your search.</p>
                )}
              </div>
            </Card>

            {/* System Health */}
            <Card className="p-6 bg-surface-1 border-surface-3">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-success" /> System Health
              </h2>
              <div className="space-y-4">
                {(systemHealth.length ? systemHealth : [
                  { id: 'lead-routing', label: 'Lead Routing Engine', status: 'operational' },
                  { id: 'clinic-api', label: 'Clinic API', status: 'operational' },
                  { id: 'workforce-exchange', label: 'Workforce Exchange', status: 'operational' },
                ]).map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">{entry.label}</span>
                    <span className="flex items-center gap-1.5 text-xs font-bold text-success">
                      <div className="w-2 h-2 rounded-full bg-success animate-pulse" /> {entry.status === 'operational' ? 'Operational' : entry.status}
                    </span>
                  </div>
                ))}
                <div className="pt-3 mt-3 border-t border-surface-3 flex items-center justify-between">
                  <span className="text-xs text-text-secondary">Last checked: Just now</span>
                  <Link to="/status" className="text-xs font-bold text-primary hover:text-primary/80 flex items-center gap-1">
                    Status Page <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </Card>

          </div>
        </div>
      </div>

      {/* New Ticket Modal */}
      <AnimatePresence>
        {showNewTicketModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-surface-1 border border-surface-3 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-surface-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Ticket className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Submit Support Ticket</h2>
                    <p className="text-xs text-text-secondary">Our team typically responds within 4 hours.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowNewTicketModal(false)}
                  className="p-2 hover:bg-surface-2 rounded-full text-text-secondary transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitTicket} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Subject</label>
                  <input 
                    type="text"
                    required
                    value={newTicket.subject}
                    onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                    placeholder="e.g., EMR Sync Delay"
                    className="w-full bg-[#0B0F14] border border-surface-3 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Priority</label>
                  <select 
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value as any })}
                    className="w-full bg-[#0B0F14] border border-surface-3 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                  >
                    <option value="Low">Low - General Question</option>
                    <option value="Medium">Medium - Feature Issue</option>
                    <option value="High">High - System Blocker</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Description</label>
                  <textarea 
                    required
                    rows={4}
                    value={newTicket.description}
                    onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                    placeholder="Please describe the issue in detail..."
                    className="w-full bg-[#0B0F14] border border-surface-3 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors resize-none"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => setShowNewTicketModal(false)}
                    className="flex-1 border-surface-3 text-white hover:bg-surface-2"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-primary hover:bg-primary/90 text-black font-bold flex items-center justify-center gap-2"
                  >
                    {submitting ? 'Submitting...' : <><Send className="w-4 h-4" /> Send Ticket</>}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
