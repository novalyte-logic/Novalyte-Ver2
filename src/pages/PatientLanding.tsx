import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { AnalyticsEngine } from '@/src/lib/analytics/events';
import { buildPatientAssessmentPath } from '@/src/lib/patientJourney';
import { 
  Shield, Activity, Lock, ArrowRight, ChevronDown, CheckCircle2, 
  Stethoscope, Brain, Zap, Heart, TrendingUp, MapPin, Star, Quote,
  Scale, Flame, Sparkles, Dumbbell, TrendingDown, Target
} from 'lucide-react';

const pillars = [
  {
    title: 'TRT & Hormone Optimization',
    description: 'Reclaim metabolic energy, body composition, and vitality with precision-monitored testosterone and hormone optimization.',
    icon: Activity,
    path: buildPatientAssessmentPath({ entryPoint: 'patient_landing', goal: 'Hormone Optimization' }),
  },
  {
    title: 'Peptide Therapy & Repair',
    description: 'Accelerate musculoskeletal recovery and cellular healing with advanced bioregulators and repair peptides.',
    icon: Zap,
    path: buildPatientAssessmentPath({ entryPoint: 'patient_landing', goal: 'Peptide Therapy' }),
  },
  {
    title: 'Metabolic & GLP-1 Weight Loss',
    description: 'Intelligent weight management protocols designed to optimize visceral fat loss while preserving lean muscle mass.',
    icon: Scale,
    path: buildPatientAssessmentPath({ entryPoint: 'patient_landing', goal: 'Weight Management' }),
  },
  {
    title: 'Sexual Health & Performance',
    description: 'Elite clinical solutions for vascular health, erectile performance, and long-term urological vitality.',
    icon: Flame,
    path: buildPatientAssessmentPath({ entryPoint: 'patient_landing', goal: 'Sexual Health' }),
  },
  {
    title: 'Longevity & Biohacking',
    description: 'Proactive biological age reduction using biomarker tracking, senolytics, and advanced longevity interventions.',
    icon: Heart,
    path: buildPatientAssessmentPath({ entryPoint: 'patient_landing', goal: 'Longevity & Aging' }),
  },
  {
    title: 'Hair & Aesthetics',
    description: 'Precision regenerative treatments for hair restoration and clinical skin optimization for men.',
    icon: Sparkles,
    path: buildPatientAssessmentPath({ entryPoint: 'patient_landing', goal: 'Hair & Aesthetics' }),
  },
  {
    title: 'Physical Performance',
    description: 'Maximize VO2 max, strength, and neurological recovery with data-driven performance protocols.',
    icon: Dumbbell,
    path: buildPatientAssessmentPath({ entryPoint: 'patient_landing', goal: 'Physical Performance' }),
  },
  {
    title: 'Cognitive Fortitude',
    description: 'Enhancing neuro-efficiency, focus, and stress resilience through clinical neuro-optimization.',
    icon: Brain,
    path: buildPatientAssessmentPath({ entryPoint: 'patient_landing', goal: 'Cognitive Performance' }),
  }
];

const faqs = [
  {
    question: 'How does the private assessment work?',
    answer: 'Our 3-minute clinical assessment evaluates your symptoms, goals, and medical history. Using our proprietary intelligence engine, we match you with the most qualified clinics in our network that specialize in your specific needs.'
  },
  {
    question: 'Is my medical data secure?',
    answer: 'Absolutely. Novalyte is built on enterprise-grade, HIPAA-aligned infrastructure. Your data is end-to-end encrypted and never shared without your explicit consent. We prioritize your privacy above all else.'
  },
  {
    question: 'Are the clinics vetted?',
    answer: 'Yes. Every clinic in the Novalyte network undergoes a rigorous vetting process. We verify their medical credentials, operational standards, and patient outcomes to ensure you receive elite, evidence-based care.'
  },
  {
    question: 'Do I need to do lab work?',
    answer: 'Most optimization protocols require comprehensive blood work to establish a baseline and ensure safe, effective treatment. Your matched clinic will guide you through the lab testing process.'
  }
];

const testimonials = [
  {
    quote: "I spent years feeling fatigued and being told my labs were 'normal'. Novalyte matched me with a clinic that actually looked at optimal ranges. It changed my life.",
    author: "Michael T.",
    age: 42,
    focus: "Hormone Optimization"
  },
  {
    quote: "The assessment was incredibly thorough but fast. Within 24 hours, I was connected with a top-tier longevity specialist in my city. The process is seamless.",
    author: "David R.",
    age: 51,
    focus: "Longevity Protocols"
  },
  {
    quote: "Finding a reputable clinic for peptide therapy was overwhelming until I used Novalyte. They filtered out the noise and connected me with true medical professionals.",
    author: "James L.",
    age: 38,
    focus: "Peptide Therapy"
  }
];

export function PatientLanding() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const trackCta = (label: string, destination: string) => {
    AnalyticsEngine.track('cta_click', {
      source: 'patient_landing',
      label,
      destination,
    });
  };

  return (
    <div className="min-h-screen bg-[#05070A] flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary/20 via-background to-background" />
        <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-secondary/10 rounded-full blur-[120px] opacity-50 mix-blend-screen pointer-events-none" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-2/80 backdrop-blur-md border border-surface-3 mb-8 shadow-lg">
              <Shield className="w-4 h-4 text-secondary" />
              <span className="text-xs font-mono text-text-secondary uppercase tracking-wider">Private, Secure, & HIPAA-Aligned</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6 text-white leading-[1.1]">
              Precision Healthcare, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">Engineered for Men.</span>
            </h1>
            
            <p className="text-xl text-text-secondary mb-10 leading-relaxed max-w-2xl mx-auto">
              Access elite practitioners for Hormone Optimization, Peptide Therapy, Weight Loss, and Longevity, all in one secure platform.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to={buildPatientAssessmentPath({ entryPoint: 'patient_landing' })}
                className="w-full sm:w-auto"
                onClick={() => {
                  trackCta('hero_start_assessment', '/patient/assessment');
                  AnalyticsEngine.track('assessment_start', { source: 'patient_landing' });
                }}
              >
                <Button size="lg" className="w-full bg-secondary hover:bg-secondary-hover text-white border-none shadow-[0_0_30px_rgba(139,92,246,0.3)] group h-14 px-8 text-lg">
                  Start Private Assessment
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link
                to="/directory"
                className="w-full sm:w-auto"
                onClick={() => trackCta('hero_browse_directory', '/directory')}
              >
                <Button variant="outline" size="lg" className="w-full h-14 px-8 text-lg border-surface-3 hover:bg-surface-2 text-white">
                  Browse Clinic Directory
                </Button>
              </Link>
            </div>
            
            <div className="mt-10 flex items-center justify-center gap-6 text-sm text-text-secondary font-medium">
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> 3-Minute Assessment</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> Vetted Network</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> Confidential</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-8 border-y border-surface-3 bg-surface-1/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60">
            <div className="flex items-center gap-2 text-lg font-display font-bold text-white"><Shield className="w-5 h-5" /> HIPAA Compliant</div>
            <div className="flex items-center gap-2 text-lg font-display font-bold text-white"><Lock className="w-5 h-5" /> SOC 2 Ready</div>
            <div className="flex items-center gap-2 text-lg font-display font-bold text-white"><CheckCircle2 className="w-5 h-5" /> End-to-End Encrypted</div>
            <div className="flex items-center gap-2 text-lg font-display font-bold text-white"><Stethoscope className="w-5 h-5" /> Clinically Vetted</div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">The Path to Optimization</h2>
            <p className="text-text-secondary max-w-2xl mx-auto text-lg">
              A streamlined, intelligent process designed to get you the care you need without the friction of traditional healthcare.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-surface-3 via-secondary/50 to-surface-3 -translate-y-1/2 z-0" />

            {[
              { step: '01', title: 'AI Biomarker Analysis', desc: 'Complete AI-driven biomarker analysis to establish your clinical baseline.', icon: Activity },
              { step: '02', title: 'Specialist Matching', desc: 'Match with specialized men\'s health clinics for precision protocol development.', icon: Target },
              { step: '03', title: 'Performance Tracking', desc: 'Track your biological age and treatment progress through our secure dashboard.', icon: TrendingUp }
            ].map((item, i) => (
              <Card key={i} className="relative z-10 p-8 bg-surface-1/80 backdrop-blur-xl border-surface-3 text-center hover:border-secondary/50 transition-colors group">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-surface-2 border border-surface-3 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <item.icon className="w-8 h-8 text-secondary" />
                </div>
                <div className="text-sm font-mono text-secondary mb-2">STEP {item.step}</div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-text-secondary leading-relaxed">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-24 bg-[#05070A] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">Optimization Dashboard</h2>
              <p className="text-xl text-text-secondary mb-8 font-light leading-relaxed">
                Track your biological age and treatment progress through our secure dashboard. Access real-time clinical data and stay connected with your specialist.
              </p>
              <ul className="space-y-4">
                {[
                  'Automated biomarker synchronization',
                  'Biological age performance index',
                  'Metabolic health trend analysis',
                  'Encrypted specialist communication'
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-text-secondary">
                    <CheckCircle2 className="w-5 h-5 text-secondary" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="lg:w-1/2 w-full">
              <Card className="bg-surface-1/80 backdrop-blur-xl border-surface-3 p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                  <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-bold tracking-widest uppercase border border-secondary/20">Live Metrics</span>
                </div>
                
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                    <Activity className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <p className="text-white font-bold">Patient Optimization Score</p>
                    <p className="text-xs text-text-secondary">Age 42 • Biological Age: 38.2 ( -4.0 yrs )</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="p-4 rounded-xl bg-surface-2 border border-surface-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-text-secondary font-medium">Testosterone</span>
                      <TrendingUp className="w-4 h-4 text-success" />
                    </div>
                    <div className="text-2xl font-display font-bold text-white">864 ng/dL</div>
                    <div className="text-[10px] text-success font-bold mt-1">+14% from baseline</div>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-2 border border-surface-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-text-secondary font-medium">Visceral Fat</span>
                      <TrendingDown className="w-4 h-4 text-success" />
                    </div>
                    <div className="text-2xl font-display font-bold text-white">11.8%</div>
                    <div className="text-[10px] text-success font-bold mt-1">-2.4% from start</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-text-secondary">Overall Progress</span>
                    <span className="text-secondary font-bold">94% Target</span>
                  </div>
                  <div className="h-2 w-full bg-surface-3 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-secondary to-primary"
                      initial={{ width: 0 }}
                      whileInView={{ width: '94%' }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Treatment Highlights */}
      <section className="py-24 bg-surface-1/30 border-y border-surface-3 relative overflow-hidden">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Optimization Pillars</h2>
              <p className="text-text-secondary text-lg">
                Explore clinical-grade protocols tailored for peak performance and longevity.
              </p>
            </div>
            <Link to="/directory" onClick={() => trackCta('explore_directory', '/directory')}>
              <Button variant="outline" className="border-surface-3 hover:bg-surface-2 text-white">
                Explore Clinic Network <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((treatment, i) => (
              <Link
                key={i}
                to={treatment.path}
                onClick={() => {
                  trackCta(`treatment_${treatment.title.toLowerCase().replace(/\s+/g, '_')}`, treatment.path);
                  AnalyticsEngine.track('assessment_start', {
                    source: 'patient_landing_treatment',
                    goal: treatment.title,
                  });
                }}
              >
                <Card className="p-6 bg-surface-1/80 backdrop-blur-sm border-surface-3 hover:border-primary/50 transition-all duration-300 group cursor-pointer h-full">
                  <div className="w-12 h-12 rounded-xl bg-surface-2 flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                    <treatment.icon className="w-6 h-6 text-text-secondary group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3 group-hover:text-primary transition-colors">{treatment.title}</h3>
                  <p className="text-sm text-text-secondary mb-6 leading-relaxed">{treatment.description}</p>
                  <div className="mt-auto flex items-center text-sm font-medium text-text-secondary group-hover:text-primary transition-colors">
                    Start intake <ArrowRight className="ml-1 w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Patient Success Stories */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Real Results</h2>
            <p className="text-text-secondary max-w-2xl mx-auto text-lg">
              Hear from men who have reclaimed their health and performance through the Novalyte network.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <Card key={i} className="p-8 bg-surface-1/50 border-surface-3 relative">
                <Quote className="absolute top-6 right-6 w-8 h-8 text-surface-3 opacity-50" />
                <div className="flex items-center gap-1 text-warning mb-6">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-white text-lg leading-relaxed mb-8 italic">"{testimonial.quote}"</p>
                <div className="mt-auto">
                  <p className="font-bold text-white">{testimonial.author}, {testimonial.age}</p>
                  <p className="text-sm text-secondary font-medium">{testimonial.focus}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-surface-1/30 border-y border-surface-3">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-text-secondary">Everything you need to know about the Novalyte platform.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <Card 
                key={i} 
                className="p-0 bg-surface-1/80 border-surface-3 overflow-hidden cursor-pointer transition-colors hover:border-surface-3/80"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div className="p-6 flex items-center justify-between">
                  <h3 className="font-bold text-white pr-8">{faq.question}</h3>
                  <ChevronDown className={`w-5 h-5 text-text-secondary transition-transform duration-300 flex-shrink-0 ${openFaq === i ? 'rotate-180' : ''}`} />
                </div>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-6 text-text-secondary leading-relaxed border-t border-surface-3/50 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-secondary/10" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-secondary/20 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">Ready to Optimize?</h2>
          <p className="text-xl text-text-secondary mb-10 max-w-2xl mx-auto font-light">
            Take the 3-minute clinical assessment. Get matched with the right specialist. Start your protocol.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={buildPatientAssessmentPath({ entryPoint: 'patient_landing' })}
              className="w-full sm:w-auto"
              onClick={() => {
                trackCta('footer_start_assessment', '/patient/assessment');
                AnalyticsEngine.track('assessment_start', { source: 'patient_landing_footer' });
              }}
            >
              <Button size="lg" className="w-full bg-secondary hover:bg-secondary-hover text-white border-none shadow-[0_0_30px_rgba(139,92,246,0.3)] h-14 px-8 text-lg">
                Start Private Assessment
              </Button>
            </Link>
            <Link
              to="/directory"
              className="w-full sm:w-auto"
              onClick={() => trackCta('footer_browse_directory', '/directory')}
            >
              <Button variant="outline" size="lg" className="w-full h-14 px-8 text-lg border-surface-3 hover:bg-surface-2 text-white">
                <MapPin className="w-5 h-5 mr-2" /> Find a Clinic Near Me
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
