import React from 'react';
import { motion } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Stethoscope, ShieldCheck, Zap, ArrowRight, 
  MapPin, Clock, DollarSign, Star, CheckCircle2,
  Building2, Users, Activity, Lock
} from 'lucide-react';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';

export function Practitioners() {
  const navigate = useNavigate();

  const valueProps = [
    {
      icon: ShieldCheck,
      title: "Curated Premium Clinics",
      description: "We strictly vet every clinic in our network. You only match with high-end, cash-pay facilities focused on longevity, hormone optimization, and performance."
    },
    {
      icon: Zap,
      title: "Instant Credentialing",
      description: "Upload your credentials once. Our AI-driven compliance engine verifies your licenses and clears you for deployment across our entire network in 48 hours."
    },
    {
      icon: DollarSign,
      title: "Top-Tier Compensation",
      description: "Bypass traditional recruiting agencies. By connecting directly with clinic operators, our practitioners command premium hourly and salary rates."
    },
    {
      icon: Activity,
      title: "Protocol-Driven Care",
      description: "Step into clinics with established, evidence-based protocols. Focus on delivering exceptional patient outcomes rather than administrative overhead."
    }
  ];

  const opportunities = [
    {
      role: "Medical Director (MD/DO)",
      specialty: "Longevity & Peptide Therapy",
      location: "Austin, TX (Hybrid)",
      type: "Part-Time / 1099",
      rate: "$250 - $300 / hr",
      match: "98%"
    },
    {
      role: "Lead Nurse Practitioner",
      specialty: "Hormone Optimization",
      location: "Miami, FL (On-Site)",
      type: "Full-Time",
      rate: "$140k - $160k / yr",
      match: "94%"
    },
    {
      role: "Registered Nurse (RN)",
      specialty: "IV Therapy & Aesthetics",
      location: "Scottsdale, AZ",
      type: "Per Diem",
      rate: "$65 - $85 / hr",
      match: "91%"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-6">
              <Star className="w-4 h-4" /> The Novalyte Clinical Network
            </div>
            <h1 className="text-5xl lg:text-6xl font-display font-bold leading-tight mb-6">
              The exclusive network for <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">elite practitioners.</span>
            </h1>
            <p className="text-xl text-text-secondary mb-8 leading-relaxed">
              Stop scrolling generic job boards. Join a curated network of premium men's health, longevity, and performance clinics. One profile unlocks instant matching, streamlined credentialing, and top-tier compensation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => navigate('/practitioners/onboarding')}
                className="bg-primary hover:bg-primary/90 text-black font-bold text-lg px-8 py-4 h-auto flex items-center justify-center gap-2"
              >
                Apply to Network <ArrowRight className="w-5 h-5" />
              </Button>
              <Link to="/platform">
                <Button 
                  variant="outline"
                  className="border-surface-3 text-white hover:bg-surface-2 text-lg px-8 py-4 h-auto"
                >
                  View Network Standards
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-text-secondary font-medium">
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> Free for Practitioners</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> HIPAA Compliant</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> Hidden from Employers</span>
            </div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 blur-3xl rounded-full" />
            <Card className="relative p-8 bg-surface-1/80 backdrop-blur-xl border-surface-3 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-surface-2 flex items-center justify-center border border-surface-3">
                    <Stethoscope className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Dr. James Wilson</h3>
                    <p className="text-sm text-text-secondary">Board Certified • TRT Specialist</p>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-success/10 border border-success/20 text-success text-xs font-bold uppercase tracking-wider">
                  Verified
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#0B0F14] border border-surface-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">New Match</p>
                      <p className="font-bold">Medical Director</p>
                    </div>
                    <span className="text-xs font-bold text-text-secondary">2h ago</span>
                  </div>
                  <p className="text-sm text-text-secondary">Premium Longevity Clinic • Austin, TX</p>
                </div>
                <div className="p-4 rounded-xl bg-[#0B0F14] border border-surface-3 opacity-60">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-xs font-bold text-secondary uppercase tracking-wider mb-1">Interview Request</p>
                      <p className="font-bold">Lead Physician</p>
                    </div>
                    <span className="text-xs font-bold text-text-secondary">1d ago</span>
                  </div>
                  <p className="text-sm text-text-secondary">Men's Health Center • Remote Consults</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Value Propositions */}
      <div className="bg-surface-1 border-y border-surface-3 py-24 mb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Built for the modern practitioner.</h2>
            <p className="text-lg text-text-secondary">We've engineered a network that removes friction, maximizes your earning potential, and connects you with clinics that share your standard of care.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {valueProps.map((prop, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="p-6 h-full bg-[#0B0F14] border-surface-3 hover:border-primary/50 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-surface-2 flex items-center justify-center text-primary mb-6 border border-surface-3">
                    <prop.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{prop.title}</h3>
                  <p className="text-text-secondary leading-relaxed">{prop.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Opportunity Previews */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Exclusive Network Opportunities</h2>
            <p className="text-lg text-text-secondary">A preview of active requisitions currently matching with our credentialed practitioners. Apply to the network to unlock full clinic details.</p>
          </div>
          <Button 
            onClick={() => navigate('/practitioners/onboarding')}
            variant="outline" 
            className="border-surface-3 text-white hover:bg-surface-2 shrink-0"
          >
            View All Opportunities
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {opportunities.map((opp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className="p-6 bg-surface-1 border-surface-3 relative overflow-hidden group">
                <div className="flex justify-between items-start mb-6">
                  <div className="px-3 py-1 rounded-full bg-surface-2 border border-surface-3 text-xs font-bold text-text-secondary uppercase tracking-wider">
                    {opp.specialty}
                  </div>
                  <div className="flex items-center gap-1 text-success text-sm font-bold">
                    <Zap className="w-4 h-4" /> {opp.match} Match
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-4">{opp.role}</h3>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-text-secondary text-sm">
                    <MapPin className="w-4 h-4" /> {opp.location}
                  </div>
                  <div className="flex items-center gap-3 text-text-secondary text-sm">
                    <Clock className="w-4 h-4" /> {opp.type}
                  </div>
                  <div className="flex items-center gap-3 text-text-secondary text-sm">
                    <DollarSign className="w-4 h-4" /> {opp.rate}
                  </div>
                </div>

                {/* Blurred / Locked State */}
                <div className="absolute bottom-0 left-0 w-full p-6 pt-12 bg-gradient-to-t from-surface-1 via-surface-1 to-transparent flex justify-center translate-y-4 group-hover:translate-y-0 transition-transform">
                  <Button 
                    onClick={() => navigate('/practitioners/onboarding')}
                    className="w-full bg-white text-black hover:bg-white/90 font-bold flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Lock className="w-4 h-4" /> Unlock to Apply
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <Card className="p-12 bg-gradient-to-b from-surface-1 to-[#0B0F14] border-surface-3 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-32 bg-primary/20 blur-[100px]" />
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 relative z-10">Ready to elevate your practice?</h2>
          <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto relative z-10">
            Join hundreds of elite practitioners who have already bypassed traditional recruiting to connect directly with premium clinics.
          </p>
          <Button 
            onClick={() => navigate('/practitioners/onboarding')}
            className="bg-primary hover:bg-primary/90 text-black font-bold text-lg px-8 py-4 h-auto relative z-10"
          >
            Create Your Profile
          </Button>
        </Card>
      </div>
    </div>
  );
}
