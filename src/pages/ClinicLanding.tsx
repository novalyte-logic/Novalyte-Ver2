import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Activity, TrendingUp, Users, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';

export function ClinicLanding() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2 border border-surface-3 mb-8">
              <Activity className="w-4 h-4 text-primary" />
              <span className="text-sm font-mono text-text-secondary uppercase tracking-wider">Clinic OS Platform</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6">
              Scale Your Clinic with <br className="hidden md:block" />
              <span className="text-primary">Intelligent Infrastructure.</span>
            </h1>
            
            <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-10">
              Stop losing leads to slow follow-ups. Novalyte AI automates patient acquisition, triage, and pipeline management so you can focus on care.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/clinics/apply">
                <Button size="lg" className="w-full sm:w-auto group">
                  Apply for Clinic OS
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/auth/clinic-login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Clinic Login
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-12 relative z-20 -mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-surface-3 bg-surface-1/80 backdrop-blur-xl shadow-2xl overflow-hidden">
            <div className="h-12 border-b border-surface-3 bg-surface-2 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-danger/80" />
              <div className="w-3 h-3 rounded-full bg-warning/80" />
              <div className="w-3 h-3 rounded-full bg-success/80" />
              <div className="ml-4 px-3 py-1 rounded bg-surface-1 text-xs font-mono text-text-secondary">novalyte.io/dashboard</div>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-2 space-y-6">
                <div className="h-48 rounded-xl bg-surface-2 border border-surface-3 flex items-center justify-center">
                  <span className="text-text-secondary font-mono text-sm">[ Pipeline Visualization ]</span>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="h-32 rounded-xl bg-surface-2 border border-surface-3 flex items-center justify-center">
                    <span className="text-text-secondary font-mono text-sm">[ Lead Velocity ]</span>
                  </div>
                  <div className="h-32 rounded-xl bg-surface-2 border border-surface-3 flex items-center justify-center">
                    <span className="text-text-secondary font-mono text-sm">[ Conversion Rate ]</span>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-full rounded-xl bg-surface-2 border border-surface-3 flex items-center justify-center">
                  <span className="text-text-secondary font-mono text-sm">[ Live Activity Feed ]</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Built for Revenue & Scale</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Everything you need to run a high-performance clinic, unified in one platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card glow="cyan">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Intelligent Routing</h3>
              <p className="text-text-secondary">
                Receive highly qualified, pre-assessed patients matched specifically to your clinic's ICP and capacity.
              </p>
            </Card>
            <Card glow="cyan">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Automated Triage</h3>
              <p className="text-text-secondary">
                Our AI handles initial screening, financial qualification, and urgency scoring before your staff lifts a finger.
              </p>
            </Card>
            <Card glow="cyan">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Revenue Recovery</h3>
              <p className="text-text-secondary">
                Identify dropped leads, automate follow-ups, and visualize your entire pipeline to plug revenue leaks.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* ROI Calculator Preview */}
      <section className="py-24 bg-surface-1 border-y border-surface-3">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Stop Leaving Money on the Table</h2>
          <p className="text-xl text-text-secondary mb-10">
            Clinics using Novalyte AI see an average 32% increase in lead-to-consult conversion rates within the first 60 days.
          </p>
          <Link to="/clinics/apply">
            <Button size="lg">Apply for Access</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

