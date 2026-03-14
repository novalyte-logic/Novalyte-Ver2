import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Briefcase, Users, Activity, ArrowRight, CheckCircle2 } from 'lucide-react';

export function Workforce() {
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
              <Briefcase className="w-4 h-4 text-secondary" />
              <span className="text-sm font-mono text-text-secondary uppercase tracking-wider">Healthcare Talent Exchange</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6">
              The Intelligent Network for <br className="hidden md:block" />
              <span className="text-secondary">Clinical Talent.</span>
            </h1>
            
            <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-10">
              Match with high-growth clinics or find top-tier practitioners. Novalyte AI connects the right talent with the right opportunities instantly.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/workforce/jobs" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full group">
                  Find Opportunities
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/workforce/profile" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full">
                  Create Profile
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-surface-1 border-y border-surface-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-display font-bold mb-6">For Practitioners</h2>
              <div className="space-y-6">
                <Card glow="violet" className="p-6">
                  <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-secondary" /> AI-Matched Roles
                  </h3>
                  <p className="text-text-secondary">Get matched with clinics that align with your specialty, schedule, and compensation requirements.</p>
                </Card>
                <Card glow="violet" className="p-6">
                  <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-secondary" /> Verified Clinics
                  </h3>
                  <p className="text-text-secondary">Work only with vetted, high-growth clinics operating on modern infrastructure.</p>
                </Card>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-display font-bold mb-6">For Clinics</h2>
              <div className="space-y-6">
                <Card glow="cyan" className="p-6">
                  <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" /> On-Demand Staffing
                  </h3>
                  <p className="text-text-secondary">Scale your clinical team dynamically based on patient volume and pipeline velocity.</p>
                </Card>
                <Card glow="cyan" className="p-6">
                  <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" /> Credential Verification
                  </h3>
                  <p className="text-text-secondary">Automated credential checking and compliance verification for all practitioners.</p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
