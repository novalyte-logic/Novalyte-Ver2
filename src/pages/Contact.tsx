import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useSearchParams } from 'react-router-dom';
import { Send, Bot, Zap, Clock, Shield, CheckCircle2, AlertCircle, ArrowRight, Building2, User, Stethoscope, Package } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { PublicService, type ContactSubmissionResponse } from '@/src/services/public';

type Role = 'patient' | 'clinic' | 'vendor' | 'other';
type Intent = 'support' | 'partnership' | 'billing' | 'technical' | 'general' | 'analyzing';
type Urgency = 'low' | 'medium' | 'high' | 'analyzing';

export function Contact() {
  const [searchParams] = useSearchParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('patient');
  const [message, setMessage] = useState('');
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [intent, setIntent] = useState<Intent>('general');
  const [urgency, setUrgency] = useState<Urgency>('low');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submission, setSubmission] = useState<ContactSubmissionResponse | null>(null);

  useEffect(() => {
    const roleParam = searchParams.get('role');
    const topicParam = searchParams.get('topic');
    const productParam = searchParams.get('product');

    if (roleParam && ['patient', 'clinic', 'vendor', 'other'].includes(roleParam)) {
      setRole(roleParam as Role);
    }

    if (!message && (topicParam || productParam)) {
      const nextMessage = [
        topicParam ? `Topic: ${topicParam}` : '',
        productParam ? `Product / Context: ${productParam}` : '',
      ]
        .filter(Boolean)
        .join('\n');

      setMessage(nextMessage);
    }
  }, [message, searchParams]);

  // Simulated AI analysis effect
  useEffect(() => {
    if (message.length > 10) {
      setIsAnalyzing(true);
      setIntent('analyzing');
      setUrgency('analyzing');
      
      const timer = setTimeout(() => {
        // Simple keyword-based intent simulation
        const lowerMsg = message.toLowerCase();
        
        let newIntent: Intent = 'general';
        if (lowerMsg.includes('help') || lowerMsg.includes('issue') || lowerMsg.includes('broken') || lowerMsg.includes('error')) {
          newIntent = 'technical';
        } else if (lowerMsg.includes('partner') || lowerMsg.includes('join') || lowerMsg.includes('integrate')) {
          newIntent = 'partnership';
        } else if (lowerMsg.includes('charge') || lowerMsg.includes('invoice') || lowerMsg.includes('pay')) {
          newIntent = 'billing';
        } else if (lowerMsg.includes('treatment') || lowerMsg.includes('doctor') || lowerMsg.includes('protocol')) {
          newIntent = 'support';
        }
        
        let newUrgency: Urgency = 'low';
        if (lowerMsg.includes('urgent') || lowerMsg.includes('emergency') || lowerMsg.includes('immediately')) {
          newUrgency = 'high';
        } else if (lowerMsg.includes('soon') || lowerMsg.includes('issue') || lowerMsg.includes('error')) {
          newUrgency = 'medium';
        }
        
        setIntent(newIntent);
        setUrgency(newUrgency);
        setIsAnalyzing(false);
      }, 800);
      
      return () => clearTimeout(timer);
    } else {
      setIntent('general');
      setUrgency('low');
      setIsAnalyzing(false);
    }
  }, [message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await PublicService.submitContact({
        name,
        email,
        role,
        message,
      });

      setSubmission(response);
      setIntent(response.intent);
      setUrgency(response.urgency);
      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch (error) {
      setIsSubmitting(false);
      setSubmitError(error instanceof Error ? error.message : 'Unable to submit your message right now.');
    }
  };

  const getRoutingDestination = () => {
    if (submission?.routingDestination) {
      return submission.routingDestination;
    }
    if (role === 'patient') return 'Patient Success Team';
    if (role === 'clinic') return 'Clinical Operations';
    if (role === 'vendor') return 'Marketplace Partnerships';
    return 'General Triage';
  };

  const getExpectedResponseTime = () => {
    if (submission?.expectedResponseTime) {
      return submission.expectedResponseTime;
    }
    if (urgency === 'high') return '< 2 Hours';
    if (urgency === 'medium') return '< 12 Hours';
    return '24-48 Hours';
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setSubmitError('');
    setSubmission(null);
    setName('');
    setEmail('');
    setMessage('');
    setIntent('general');
    setUrgency('low');
  };

  return (
    <div className="min-h-screen bg-[#05070A] font-sans text-text-primary pt-24 pb-32 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-secondary/10 to-transparent blur-3xl rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6">
              <Bot className="w-4 h-4" />
              <span className="text-sm font-bold tracking-wide uppercase">Intelligent Routing</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 tracking-tight">
              Communications <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Hub</span>
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed">
              Our AI-driven triage system analyzes your request in real-time, ensuring it reaches the exact team equipped to resolve it instantly.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
          
          {/* Left Column: Smart Form */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className="p-8 bg-[#0B0F14] border-surface-3 relative overflow-hidden">
                    {/* Active Scanning Laser Effect */}
                    {isAnalyzing && (
                      <motion.div 
                        className="absolute top-0 left-0 w-full h-[2px] bg-primary shadow-[0_0_10px_#06B6D4]"
                        initial={{ y: 0, opacity: 0 }}
                        animate={{ y: [0, 600, 0], opacity: [0, 1, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      />
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                      
                      {/* Role Selection */}
                      <div className="space-y-3">
                        <label className="text-sm font-bold text-white uppercase tracking-wider">I am a...</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {[
                            { id: 'patient', label: 'Patient', icon: User },
                            { id: 'clinic', label: 'Clinic', icon: Stethoscope },
                            { id: 'vendor', label: 'Vendor', icon: Package },
                            { id: 'other', label: 'Other', icon: Building2 }
                          ].map((r) => {
                            const Icon = r.icon;
                            const isSelected = role === r.id;
                            return (
                              <button
                                key={r.id}
                                type="button"
                                onClick={() => setRole(r.id as Role)}
                                className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                                  isSelected 
                                    ? 'bg-primary/10 border-primary text-primary' 
                                    : 'bg-surface-1 border-surface-3 text-text-secondary hover:bg-surface-2 hover:text-white'
                                }`}
                              >
                                <Icon className="w-6 h-6 mb-2" />
                                <span className="text-xs font-bold">{r.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-text-secondary">Full Name</label>
                          <input 
                            type="text" 
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-surface-1 border border-surface-3 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                            placeholder="John Doe"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-text-secondary">Email Address</label>
                          <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-surface-1 border border-surface-3 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-text-secondary flex justify-between">
                          <span>Message</span>
                          {message.length > 0 && (
                            <span className="text-xs text-primary font-mono animate-pulse">
                              {isAnalyzing ? 'Analyzing intent...' : 'Analysis complete'}
                            </span>
                          )}
                        </label>
                        <textarea 
                          required
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          rows={5}
                          className="w-full bg-surface-1 border border-surface-3 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-none"
                          placeholder="Describe your inquiry in detail. Our system will automatically route it to the correct department..."
                        />
                      </div>

                      {submitError && (
                        <div className="rounded-lg border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
                          {submitError}
                        </div>
                      )}

                      <Button 
                        type="submit" 
                        className="w-full h-12 text-lg font-bold"
                        disabled={isSubmitting || !name || !email || message.trim().length < 20}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Routing Message...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            Initialize Secure Transmission <Send className="w-5 h-5" />
                          </span>
                        )}
                      </Button>
                    </form>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex items-center"
                >
                  <Card className="p-10 bg-[#0B0F14] border-primary/30 text-center w-full">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-10 h-10 text-primary" />
                    </div>
                    <h2 className="text-2xl font-display font-bold text-white mb-4">Transmission Successful</h2>
                    <p className="text-text-secondary mb-8">
                      Your message has been classified and securely routed to the <strong className="text-white">{getRoutingDestination()}</strong>.
                    </p>
                    <div className="bg-surface-1 rounded-xl p-6 text-left space-y-4 mb-8">
                      <div className="flex justify-between items-center border-b border-surface-3 pb-4">
                        <span className="text-text-secondary text-sm">Tracking ID</span>
                        <span className="text-white font-mono text-sm">{submission?.trackingId || 'Pending'}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-surface-3 pb-4">
                        <span className="text-text-secondary text-sm">Priority Level</span>
                        <span className="text-white font-bold capitalize">{urgency}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-text-secondary text-sm">Expected Response</span>
                        <span className="text-primary font-bold">{getExpectedResponseTime()}</span>
                      </div>
                    </div>
                    <Button variant="outline" onClick={resetForm}>
                      Send Another Message
                    </Button>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Routing Logic & Info */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Live Routing Status Card */}
            <Card className="p-6 bg-gradient-to-br from-surface-1 to-surface-2 border-surface-3">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5 text-secondary" />
                Live Routing Telemetry
              </h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-text-secondary">Detected Intent</span>
                    {isAnalyzing ? (
                      <span className="text-secondary animate-pulse font-mono">Processing...</span>
                    ) : (
                      <span className="text-white font-bold capitalize">{intent}</span>
                    )}
                  </div>
                  <div className="h-2 bg-surface-3 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-secondary"
                      initial={{ width: '0%' }}
                      animate={{ width: isAnalyzing ? '50%' : '100%' }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-text-secondary">Assigned Priority</span>
                    {isAnalyzing ? (
                      <span className="text-primary animate-pulse font-mono">Processing...</span>
                    ) : (
                      <span className={`font-bold capitalize ${urgency === 'high' ? 'text-red-400' : urgency === 'medium' ? 'text-amber-400' : 'text-primary'}`}>
                        {urgency}
                      </span>
                    )}
                  </div>
                  <div className="h-2 bg-surface-3 rounded-full overflow-hidden">
                    <motion.div 
                      className={`h-full ${urgency === 'high' ? 'bg-red-400' : urgency === 'medium' ? 'bg-amber-400' : 'bg-primary'}`}
                      initial={{ width: '0%' }}
                      animate={{ width: isAnalyzing ? '50%' : urgency === 'high' ? '100%' : urgency === 'medium' ? '66%' : '33%' }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-surface-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <Shield className="w-5 h-5 text-text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Target Destination</p>
                      <p className="text-xs text-text-secondary mt-1">
                        {isAnalyzing ? 'Calculating optimal routing path...' : `Routing to ${getRoutingDestination()}`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Operational Standards */}
            <Card className="p-6 bg-[#0B0F14] border-surface-3">
              <h3 className="text-lg font-bold text-white mb-4">Operational Standards</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-white">24/7 Triage</p>
                    <p className="text-xs text-text-secondary mt-1">Our AI layer processes and categorizes inbound requests instantly, 24 hours a day.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-white">Escalation Protocols</p>
                    <p className="text-xs text-text-secondary mt-1">Clinical emergencies and critical infrastructure alerts bypass standard queues.</p>
                  </div>
                </li>
              </ul>
            </Card>

            {/* Direct Links */}
            <div className="grid grid-cols-2 gap-4">
              <Link to="/support/patient" className="p-4 rounded-xl bg-surface-1 border border-surface-3 hover:border-primary/50 transition-colors group">
                <p className="text-sm font-bold text-white mb-1 group-hover:text-primary transition-colors">Patient FAQ</p>
                <ArrowRight className="w-4 h-4 text-text-secondary group-hover:text-primary transition-colors" />
              </Link>
              <Link to="/support/clinic" className="p-4 rounded-xl bg-surface-1 border border-surface-3 hover:border-secondary/50 transition-colors group">
                <p className="text-sm font-bold text-white mb-1 group-hover:text-secondary transition-colors">Clinic Docs</p>
                <ArrowRight className="w-4 h-4 text-text-secondary group-hover:text-secondary transition-colors" />
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
