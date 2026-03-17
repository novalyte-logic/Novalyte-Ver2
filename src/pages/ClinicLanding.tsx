import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Activity, TrendingUp, Users, Zap, ArrowRight, CheckCircle2, Shield, Clock, DollarSign, Stethoscope, Dna, Waves, Video, Quote } from 'lucide-react';

const TREATMENT_DATA = {
  trt: {
    label: 'TRT & Hormone Optimization',
    cpl: 150,
    ltv: 2500,
    labReviewMins: 15,
    protocolMins: 10,
    efficiencyLift: 35,
  },
  peptides: {
    label: 'Peptide Therapy',
    cpl: 100,
    ltv: 1500,
    labReviewMins: 10,
    protocolMins: 15,
    efficiencyLift: 40,
  },
  shockwave: {
    label: 'Acoustic Shockwave & Aesthetics',
    cpl: 200,
    ltv: 3500,
    labReviewMins: 5,
    protocolMins: 5,
    efficiencyLift: 25,
  },
  longevity: {
    label: 'Longevity Consults',
    cpl: 250,
    ltv: 5000,
    labReviewMins: 30,
    protocolMins: 20,
    efficiencyLift: 45,
  }
};

export function ClinicLanding() {
  const [patientVolume, setPatientVolume] = useState(50);
  const [selectedTreatment, setSelectedTreatment] = useState<keyof typeof TREATMENT_DATA>('trt');

  const roiMetrics = useMemo(() => {
    const data = TREATMENT_DATA[selectedTreatment];
    const totalLabTimeSavedHours = Math.round((data.labReviewMins * patientVolume) / 60);
    const totalProtocolTimeSavedHours = Math.round((data.protocolMins * patientVolume) / 60);
    const totalTimeSavedHours = totalLabTimeSavedHours + totalProtocolTimeSavedHours;
    
    // Assume a 20% absolute increase in conversion from pre-qualified patients vs raw leads
    const currentConversion = 0.10; // 10%
    const novalyteConversion = 0.30; // 30%
    
    const revenueLift = Math.round((novalyteConversion - currentConversion) * patientVolume * data.ltv);
    const costSavings = totalTimeSavedHours * 150; // Assume $150/hr provider time

    return {
      totalLabTimeSavedHours,
      totalProtocolTimeSavedHours,
      totalTimeSavedHours,
      revenueLift,
      costSavings,
      efficiencyLift: data.efficiencyLift,
      cpl: data.cpl
    };
  }, [patientVolume, selectedTreatment]);

  return (
    <div className="flex flex-col bg-background">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Activity className="w-4 h-4 text-primary" />
              <span className="text-xs font-mono text-primary uppercase tracking-wider font-bold">For Clinic Operators</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6 text-white leading-[1.1]">
              Acquire Pre Qualified Patients <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Not Leads.</span>
            </h1>
            
            <p className="text-xl text-text-secondary mb-10 leading-relaxed max-w-3xl mx-auto">
              Novalyte is the first AI-powered OS dedicated to men’s health, combining patient acquisition, a clinic directory, on-demand staffing, and a services marketplace into one seamless platform.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
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
            
            <div className="mt-10 flex justify-center items-center gap-6 text-sm text-text-secondary font-mono">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> HIPAA Aligned</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> EMR Integrated</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> SOC2 Compliant</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Sections */}
      <section className="py-24 bg-[#0B0F14] border-y border-surface-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">Built for Men's Health Operations</h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Stop using generic CRMs. Novalyte provides specialized infrastructure to handle the unique compliance, clinical, and operational demands of men's health.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8 bg-[#101720] border-surface-3 hover:border-primary/50 transition-colors group">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Automated TRT & Controlled Substance Logging</h3>
              <p className="text-text-secondary leading-relaxed">
                Maintain flawless compliance with automated DEA logging, prescription tracking, and refill management. Novalyte flags anomalies and ensures your TRT protocols meet regulatory standards without manual oversight.
              </p>
            </Card>

            <Card className="p-8 bg-[#101720] border-surface-3 hover:border-secondary/50 transition-colors group">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Dna className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Peptide Protocol Builders</h3>
              <p className="text-text-secondary leading-relaxed">
                Generate customized peptide stacks (e.g., BPC-157, CJC-1295/Ipamorelin) based on patient lab data and goals. Our AI suggests optimal dosing schedules and automatically generates patient education materials.
              </p>
            </Card>

            <Card className="p-8 bg-[#101720] border-surface-3 hover:border-warning/50 transition-colors group">
              <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Waves className="w-6 h-6 text-warning" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Acoustic Shockwave & Aesthetics Scheduling</h3>
              <p className="text-text-secondary leading-relaxed">
                Maximize machine utilization. Our smart scheduler optimizes bookings for high-ticket in-clinic procedures like Acoustic Shockwave Therapy, ensuring your equipment and staff are never idle.
              </p>
            </Card>

            <Card className="p-8 bg-[#101720] border-surface-3 hover:border-success/50 transition-colors group">
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Video className="w-6 h-6 text-success" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Integrated Telehealth for Longevity Consults</h3>
              <p className="text-text-secondary leading-relaxed">
                Conduct high-value longevity and biohacking consults via our secure, integrated telehealth platform. Review comprehensive lab panels and wearables data in real-time with the patient.
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
                <span className="text-xs font-mono text-success uppercase tracking-wider font-bold">Operational Efficiency</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">Calculate Your Operational ROI.</h2>
              <p className="text-lg text-text-secondary mb-8">
                By delivering pre-qualified patients and automating clinical workflows, Novalyte drastically reduces administrative burden and increases your effective hourly rate.
              </p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                  <span className="text-text-secondary"><strong className="text-white">Pre-Qualified Intent:</strong> Stop paying for clicks. We deliver patients who have already completed clinical assessments.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                  <span className="text-text-secondary"><strong className="text-white">Automated Lab Review:</strong> AI pre-analyzes lab results, highlighting out-of-range markers before you even open the chart.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                  <span className="text-text-secondary"><strong className="text-white">Protocol Generation:</strong> Instantly generate compliant, evidence-based treatment protocols based on patient data.</span>
                </li>
              </ul>
            </div>

            <Card className="p-8 bg-[#0B0F14]/90 backdrop-blur-xl border-surface-3 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-8">Monthly Impact Calculator</h3>
              
              <div className="space-y-8">
                <div>
                  <label className="text-sm font-medium text-text-secondary block mb-3">Primary Treatment Focus</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.keys(TREATMENT_DATA) as Array<keyof typeof TREATMENT_DATA>).map((key) => (
                      <button
                        key={key}
                        onClick={() => setSelectedTreatment(key)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                          selectedTreatment === key 
                            ? 'bg-primary/20 border-primary text-white' 
                            : 'bg-surface-2 border-surface-3 text-text-secondary hover:text-white hover:border-surface-3'
                        }`}
                      >
                        {TREATMENT_DATA[key].label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-text-secondary">Monthly Patient Volume</label>
                    <span className="text-white font-mono">{patientVolume} Patients</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" max="500" step="10"
                    value={patientVolume} 
                    onChange={(e) => setPatientVolume(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                  <p className="text-xs text-text-secondary mt-2 text-right">
                    Est. Industry CPL: <span className="text-white font-mono">${roiMetrics.cpl}</span>
                  </p>
                </div>

                <div className="pt-8 border-t border-surface-3">
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="p-4 rounded-xl bg-surface-2 border border-surface-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-secondary" />
                        <p className="text-sm text-text-secondary">Time Saved</p>
                      </div>
                      <p className="text-2xl font-mono text-white">{roiMetrics.totalTimeSavedHours} <span className="text-sm text-text-secondary">hrs/mo</span></p>
                      <div className="mt-2 text-xs text-text-secondary space-y-1">
                        <p>• {roiMetrics.totalLabTimeSavedHours}h on lab review</p>
                        <p>• {roiMetrics.totalProtocolTimeSavedHours}h on protocols</p>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-surface-2 border border-surface-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-4 h-4 text-primary" />
                        <p className="text-sm text-text-secondary">Efficiency Lift</p>
                      </div>
                      <p className="text-2xl font-mono text-white">+{roiMetrics.efficiencyLift}%</p>
                      <p className="mt-2 text-xs text-text-secondary">
                        Increase in operational throughput
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-success/10 border border-success/20">
                    <p className="text-sm text-success font-bold uppercase tracking-wider mb-1">Projected Revenue Lift</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-4xl font-display font-bold text-success">+${roiMetrics.revenueLift.toLocaleString()}</p>
                      <span className="text-success/80 text-sm">/mo</span>
                    </div>
                    <p className="text-xs text-success/80 mt-2">
                      Based on higher conversion of pre-qualified patients vs. raw leads.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-24 bg-[#0B0F14] border-t border-surface-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">Trusted by Elite Operators</h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              See how top men's health and longevity clinics are scaling their operations with Novalyte.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 bg-[#101720] border-surface-3 relative">
              <Quote className="absolute top-6 right-6 w-8 h-8 text-surface-3" />
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-surface-3 flex items-center justify-center text-white font-bold text-lg">
                  DR
                </div>
                <div>
                  <h4 className="text-white font-bold">Dr. David Reynolds</h4>
                  <p className="text-sm text-text-secondary">Medical Director, Apex Men's Health</p>
                </div>
              </div>
              <p className="text-text-secondary italic leading-relaxed">
                "Novalyte completely changed our acquisition model. We stopped buying generic leads and started receiving patients who already had their labs uploaded and were financially qualified for our TRT programs. It's night and day."
              </p>
            </Card>

            <Card className="p-8 bg-[#101720] border-surface-3 relative">
              <Quote className="absolute top-6 right-6 w-8 h-8 text-surface-3" />
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-surface-3 flex items-center justify-center text-white font-bold text-lg">
                  MS
                </div>
                <div>
                  <h4 className="text-white font-bold">Marcus Sterling</h4>
                  <p className="text-sm text-text-secondary">Founder, Vitality Longevity Institute</p>
                </div>
              </div>
              <p className="text-text-secondary italic leading-relaxed">
                "The peptide protocol builder alone saves our practitioners 15 hours a week. But the real value is the integrated telehealth and automated compliance logging. It's the only OS that actually understands our business model."
              </p>
            </Card>

            <Card className="p-8 bg-[#101720] border-surface-3 relative">
              <Quote className="absolute top-6 right-6 w-8 h-8 text-surface-3" />
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-surface-3 flex items-center justify-center text-white font-bold text-lg">
                  JC
                </div>
                <div>
                  <h4 className="text-white font-bold">Dr. James Chen</h4>
                  <p className="text-sm text-text-secondary">Chief Medical Officer, Optima Performance</p>
                </div>
              </div>
              <p className="text-text-secondary italic leading-relaxed">
                "We were drowning in administrative overhead trying to manage shockwave scheduling alongside our hormone replacement patients. Novalyte unified our entire operation and increased our revenue per patient by 40%."
              </p>
            </Card>
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


