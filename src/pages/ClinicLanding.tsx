import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Activity, TrendingUp, Users, Zap, ArrowRight, CheckCircle2, Shield, BarChart3, Clock, DollarSign, ChevronRight } from 'lucide-react';

export function ClinicLanding() {
  const [leads, setLeads] = useState(150);
  const [showRate, setShowRate] = useState(40);
  const [ltv, setLtv] = useState(2500);

  // ROI Calculations
  const currentCloseRate = 0.5; // Assume 50% close rate on shows
  const currentPatients = Math.round(leads * (showRate / 100) * currentCloseRate);
  const currentRevenue = currentPatients * ltv;

  const novalyteShowRate = Math.min(showRate * 1.35, 95); // 35% relative lift
  const novalyteCloseRate = currentCloseRate * 1.2; // 20% relative lift
  const projectedPatients = Math.round(leads * (novalyteShowRate / 100) * novalyteCloseRate);
  const projectedRevenue = projectedPatients * ltv;

  const recoveredRevenue = projectedRevenue - currentRevenue;

  return (
    <div className="flex flex-col bg-[#05070A]">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Activity className="w-4 h-4 text-primary" />
                <span className="text-xs font-mono text-primary uppercase tracking-wider font-bold">For Clinic Operators</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6 text-white leading-[1.1]">
                Stop Bleeding <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Patient Revenue.</span>
              </h1>
              
              <p className="text-xl text-text-secondary mb-10 leading-relaxed max-w-xl">
                Novalyte AI is the growth infrastructure for serious men's health clinics. We automate patient acquisition, clinical triage, and pipeline management so you can scale without adding headcount.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link to="/clinics/apply" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full bg-primary hover:bg-primary-hover text-black font-bold h-14 px-8 text-lg shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                    Apply for Clinic OS
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/auth/clinic-login" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full h-14 px-8 text-lg border-surface-3 hover:bg-surface-2 text-white">
                    Operator Login
                  </Button>
                </Link>
              </div>
              
              <div className="mt-10 flex items-center gap-6 text-sm text-text-secondary font-mono">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> HIPAA Aligned</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> EMR Integrated</div>
              </div>
            </motion.div>

            {/* Hero Visual - Dashboard Abstract */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-2xl blur-3xl opacity-50" />
              <div className="relative rounded-2xl border border-surface-3 bg-[#0B0F14]/90 backdrop-blur-xl shadow-2xl overflow-hidden">
                <div className="h-10 border-b border-surface-3 bg-[#101720] flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-danger/80" />
                  <div className="w-3 h-3 rounded-full bg-warning/80" />
                  <div className="w-3 h-3 rounded-full bg-success/80" />
                  <div className="ml-4 px-3 py-1 rounded bg-[#05070A] text-xs font-mono text-text-secondary">novalyte.os / pipeline</div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-white font-bold text-lg">Active Pipeline</h3>
                      <p className="text-text-secondary text-sm">Real-time patient flow</p>
                    </div>
                    <div className="text-right">
                      <h3 className="text-primary font-mono font-bold text-xl">$142,500</h3>
                      <p className="text-text-secondary text-sm">Projected Revenue</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      { name: 'Hormone Optimization Lead', status: 'Triage Complete', score: '98%', value: '$3,200' },
                      { name: 'Longevity Consult Queue', status: 'Consult Scheduled', score: '92%', value: '$2,500' },
                      { name: 'Metabolic Assessment Intake', status: 'Awaiting Labs', score: '85%', value: '$4,100' },
                    ].map((lead, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[#15202B] border border-surface-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                            {lead.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">{lead.name}</p>
                            <p className="text-text-secondary text-xs">{lead.status}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-success text-sm font-mono">{lead.score} Match</p>
                          <p className="text-text-secondary text-xs">{lead.value} LTV</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-24 bg-[#0B0F14] border-y border-surface-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">The Old Way is Costing You Millions.</h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Most clinics operate with broken funnels. You pay for clicks, but lose patients to friction, slow follow-ups, and manual qualification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 bg-[#101720] border-surface-3 hover:border-danger/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-danger/10 flex items-center justify-center mb-6">
                <Clock className="w-6 h-6 text-danger" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">The Speed-to-Lead Trap</h3>
              <p className="text-text-secondary">
                If you don't engage a high-intent patient within 5 minutes, your conversion rate drops by 80%. Manual front-desk outreach can't compete.
              </p>
            </Card>
            <Card className="p-8 bg-[#101720] border-surface-3 hover:border-warning/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-warning" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Unqualified Volume</h3>
              <p className="text-text-secondary">
                Your staff spends hours talking to leads who can't afford out-of-pocket care or refuse to do lab work, burning operational bandwidth.
              </p>
            </Card>
            <Card className="p-8 bg-[#101720] border-surface-3 hover:border-danger/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-danger/10 flex items-center justify-center mb-6">
                <DollarSign className="w-6 h-6 text-danger" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">The "Ghosting" Epidemic</h3>
              <p className="text-text-secondary">
                Patients book consults but never show up because there is no automated nurturing, education, or pre-consultation engagement.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* ROI Calculator Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20 mb-6">
                <TrendingUp className="w-4 h-4 text-success" />
                <span className="text-xs font-mono text-success uppercase tracking-wider font-bold">Revenue Recovery</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">Calculate Your Recovered Revenue.</h2>
              <p className="text-lg text-text-secondary mb-8">
                Novalyte AI plugs the leaks in your funnel. By automating triage and instantly engaging leads, we dramatically increase your show rates and close rates. See what that means for your bottom line.
              </p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                  <span className="text-text-secondary"><strong className="text-white">Instant AI Triage:</strong> Qualify patients financially and clinically before they hit your calendar.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                  <span className="text-text-secondary"><strong className="text-white">Automated Nurture:</strong> Keep patients engaged with personalized education leading up to their consult.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                  <span className="text-text-secondary"><strong className="text-white">Zero Added Headcount:</strong> Scale your patient volume without hiring more front-desk staff.</span>
                </li>
              </ul>
            </div>

            <Card className="p-8 bg-[#0B0F14]/90 backdrop-blur-xl border-surface-3 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-8">Monthly Impact Calculator</h3>
              
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-text-secondary">Monthly Leads Generated</label>
                    <span className="text-white font-mono">{leads}</span>
                  </div>
                  <input 
                    type="range" 
                    min="50" max="1000" step="10"
                    value={leads} 
                    onChange={(e) => setLeads(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-text-secondary">Current Show Rate (%)</label>
                    <span className="text-white font-mono">{showRate}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" max="80" step="5"
                    value={showRate} 
                    onChange={(e) => setShowRate(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-text-secondary">Average Patient LTV ($)</label>
                    <span className="text-white font-mono">${ltv.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" 
                    min="500" max="10000" step="500"
                    value={ltv} 
                    onChange={(e) => setLtv(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>

                <div className="pt-8 border-t border-surface-3">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-text-secondary mb-1">Current Revenue</p>
                      <p className="text-2xl font-mono text-white">${currentRevenue.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-text-secondary mb-1">Projected Revenue</p>
                      <p className="text-2xl font-mono text-primary font-bold">${projectedRevenue.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 rounded-xl bg-success/10 border border-success/20">
                    <p className="text-sm text-success font-bold uppercase tracking-wider mb-1">Monthly Recovered Revenue</p>
                    <p className="text-4xl font-display font-bold text-success">+${recoveredRevenue.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-[#0B0F14] border-t border-surface-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">The Complete Clinic Operating System</h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Replace fragmented tools with a single, intelligent platform designed specifically for men's health and optimization clinics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: "AI Patient Triage", desc: "Automatically score leads based on clinical fit, financial readiness, and urgency before they reach your staff." },
              { icon: BarChart3, title: "Pipeline Visualization", desc: "Track every patient from initial inquiry to active treatment in a real-time, drag-and-drop command center." },
              { icon: Shield, title: "HIPAA-Aligned Comms", desc: "Securely message patients, share lab requisitions, and automate follow-ups within a compliant environment." },
              { icon: Users, title: "Workforce Exchange", desc: "Instantly match with vetted prescribers, medical directors, and specialized staff to scale your operations." },
              { icon: Activity, title: "Marketplace Access", desc: "Procure capital equipment, diagnostics, and clinical-grade supplements at negotiated network rates." },
              { icon: TrendingUp, title: "Revenue Analytics", desc: "See exactly which marketing channels and protocols are driving your highest LTV patients." }
            ].map((feature, i) => (
              <Card key={i} className="p-6 bg-[#15202B] border-surface-3 hover:border-primary/50 transition-colors">
                <feature.icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-[#0B0F14]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">Ready to Scale Your Clinic?</h2>
          <p className="text-xl text-text-secondary mb-10 max-w-2xl mx-auto">
            Join the elite network of optimization clinics using Novalyte AI to automate acquisition and maximize revenue.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/clinics/apply">
              <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-black font-bold h-14 px-8 text-lg shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                Apply for Access
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 text-lg border-surface-3 hover:bg-surface-2 text-white">
                Talk to Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
