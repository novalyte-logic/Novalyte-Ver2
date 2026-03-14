import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Shield, Activity, Lock, ArrowRight, ChevronDown, CheckCircle2 } from 'lucide-react';

export function PatientLanding() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary/10 via-background to-background" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2 border border-surface-3 mb-8">
              <Shield className="w-4 h-4 text-secondary" />
              <span className="text-sm font-mono text-text-secondary uppercase tracking-wider">Private & Secure Assessment</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6">
              Precision Healthcare, <br className="hidden md:block" />
              <span className="text-secondary">Engineered for You.</span>
            </h1>
            
            <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-10">
              Stop guessing with your health. Get an intelligent medical assessment, discover optimized treatments, and connect with elite clinics instantly.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/patient/assessment">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto group">
                  Start Private Assessment
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/directory">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Browse Clinic Directory
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-8 border-y border-surface-3 bg-surface-1/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale">
            {/* Mock logos/trust signals */}
            <div className="text-xl font-display font-bold">HIPAA Compliant</div>
            <div className="text-xl font-display font-bold">SOC 2 Ready</div>
            <div className="text-xl font-display font-bold">End-to-End Encrypted</div>
            <div className="text-xl font-display font-bold">AI Verified</div>
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">The Standard System is Broken</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Traditional healthcare is slow, generalized, and reactive. You deserve proactive, optimized care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card glow="violet">
              <div className="w-12 h-12 rounded-lg bg-surface-2 flex items-center justify-center mb-6">
                <Activity className="w-6 h-6 text-text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Generalized Advice</h3>
              <p className="text-text-secondary">
                Standard doctors treat averages, not individuals. We connect you with clinics that optimize for peak performance.
              </p>
            </Card>
            <Card glow="violet">
              <div className="w-12 h-12 rounded-lg bg-surface-2 flex items-center justify-center mb-6">
                <Lock className="w-6 h-6 text-text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Fragmented Records</h3>
              <p className="text-text-secondary">
                Your health data is scattered. Our platform unifies your intake, assessment, and clinic communication securely.
              </p>
            </Card>
            <Card glow="violet">
              <div className="w-12 h-12 rounded-lg bg-surface-2 flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Slow Access</h3>
              <p className="text-text-secondary">
                Waiting weeks for an appointment is unacceptable. Our intelligent routing connects you to the right specialist in minutes.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Treatment Quick Cards */}
      <section className="py-24 bg-surface-1 border-y border-surface-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Optimized Treatments</h2>
              <p className="text-text-secondary max-w-xl">
                Discover advanced protocols available through our elite clinic network.
              </p>
            </div>
            <Link to="/directory" className="hidden md:inline-flex text-secondary hover:text-secondary-hover font-medium items-center">
              View All Clinics <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {['Hormone Optimization', 'Peptide Therapy', 'Longevity Protocols', 'Cognitive Enhancement'].map((treatment, i) => (
              <Card key={i} className="group cursor-pointer" glow="violet">
                <h3 className="text-lg font-semibold mb-2 group-hover:text-secondary transition-colors">{treatment}</h3>
                <p className="text-sm text-text-secondary mb-4">Advanced protocols tailored to your unique biology.</p>
                <div className="flex items-center text-sm font-medium text-text-primary">
                  Learn more <ArrowRight className="ml-1 w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-secondary/5" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Ready to Optimize?</h2>
          <p className="text-xl text-text-secondary mb-10">
            Take the 3-minute assessment. Get matched with the right clinic. Start your protocol.
          </p>
          <Link to="/patient/assessment">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              Start Private Assessment
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

