import React from 'react';
import { motion } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, MapPin, ShieldCheck, Star, Clock, DollarSign, 
  Briefcase, FileText, CheckCircle2, ChevronRight, Zap,
  Award, GraduationCap, Building2, Edit3, ArrowUpRight
} from 'lucide-react';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';

export function PractitionerProfile() {
  const navigate = useNavigate();

  const practitioner = {
    name: "Dr. James Wilson",
    role: "Medical Director (MD)",
    location: "Austin, TX",
    status: "Verified",
    completeness: 85,
    about: "Board-certified physician specializing in longevity medicine, hormone optimization, and peptide therapy. Passionate about preventative care and performance medicine.",
    credentials: [
      { type: "Medical License", state: "TX", number: "M12345", status: "Active", expiry: "12/2027" },
      { type: "NPI", number: "1098765432", status: "Active", expiry: "N/A" },
      { type: "DEA", number: "XW1234567", status: "Active", expiry: "06/2026" }
    ],
    specialties: ["Men's Health / TRT", "Longevity & Anti-Aging", "Sports Medicine"],
    protocols: ["Testosterone Replacement", "Peptide Therapy", "Weight Loss (GLP-1)", "IV Hydration"],
    availability: {
      type: "Part-Time / 1099",
      rate: "$250 - $300 / hr",
      travel: "Local Only (No Travel)"
    }
  };

  const assignments = [
    {
      clinic: "Apex Longevity Center",
      role: "Consulting Medical Director",
      status: "Active",
      startDate: "Jan 2026",
      hours: "10 hrs/week"
    }
  ];

  const opportunities = [
    {
      role: "Lead Physician",
      clinic: "Vitality Men's Clinic",
      location: "Austin, TX (Hybrid)",
      type: "Part-Time",
      rate: "$275 / hr",
      match: "98%"
    },
    {
      role: "Telehealth Supervising MD",
      clinic: "National Peptide Network",
      location: "Remote",
      type: "1099 Contract",
      rate: "$200 / hr",
      match: "92%"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="p-8 bg-surface-1 border-surface-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-surface-2 border-2 border-surface-3 flex items-center justify-center shrink-0">
                  <User className="w-10 h-10 text-text-secondary" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-display font-bold">{practitioner.name}</h1>
                    <div className="px-3 py-1 rounded-full bg-success/10 border border-success/20 text-success text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> {practitioner.status}
                    </div>
                  </div>
                  <p className="text-lg text-text-secondary mb-2">{practitioner.role}</p>
                  <div className="flex items-center gap-4 text-sm text-text-secondary font-medium">
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {practitioner.location}</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Joined Jan 2026</span>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-auto bg-[#0B0F14] p-4 rounded-xl border border-surface-3 flex items-center gap-6">
                <div>
                  <p className="text-sm font-bold text-white mb-1">Profile Strength</p>
                  <p className="text-xs text-text-secondary">Complete your profile to boost matches</p>
                </div>
                <div className="w-14 h-14 rounded-full border-4 border-surface-3 relative flex items-center justify-center shrink-0">
                  <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="46"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-primary"
                      strokeDasharray={`${practitioner.completeness * 2.89} 289`}
                    />
                  </svg>
                  <span className="text-xs font-bold">{practitioner.completeness}%</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Identity & Details */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* About */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="p-6 bg-surface-1 border-surface-3">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" /> About
                  </h2>
                  <button className="text-text-secondary hover:text-white transition-colors">
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-text-secondary leading-relaxed">{practitioner.about}</p>
              </Card>
            </motion.div>

            {/* Credentials */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="p-6 bg-surface-1 border-surface-3">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" /> Credentials & Licenses
                  </h2>
                  <button className="text-text-secondary hover:text-white transition-colors">
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {practitioner.credentials.map((cred, i) => (
                    <div key={i} className="p-4 rounded-xl bg-[#0B0F14] border border-surface-3">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-bold text-white">{cred.type}</p>
                        <span className="px-2 py-0.5 rounded bg-success/10 text-success text-[10px] font-bold uppercase tracking-wider">
                          {cred.status}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-text-secondary">
                        <p>Number: <span className="text-white">{cred.number}</span></p>
                        {cred.state && <p>State: <span className="text-white">{cred.state}</span></p>}
                        <p>Expires: <span className="text-white">{cred.expiry}</span></p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Specialties & Protocols */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="p-6 bg-surface-1 border-surface-3">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Star className="w-5 h-5 text-primary" /> Specialties & Protocols
                  </h2>
                  <button className="text-text-secondary hover:text-white transition-colors">
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="mb-6">
                  <p className="text-sm font-medium text-text-secondary mb-3">Primary Specialties</p>
                  <div className="flex flex-wrap gap-2">
                    {practitioner.specialties.map(spec => (
                      <span key={spec} className="px-3 py-1.5 bg-surface-2 border border-surface-3 rounded-lg text-sm font-medium text-white">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-text-secondary mb-3">Protocol Familiarity</p>
                  <div className="flex flex-wrap gap-2">
                    {practitioner.protocols.map(proto => (
                      <span key={proto} className="px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-lg text-sm font-medium text-primary">
                        {proto}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Availability */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="p-6 bg-surface-1 border-surface-3">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" /> Availability & Preferences
                  </h2>
                  <button className="text-text-secondary hover:text-white transition-colors">
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-[#0B0F14] border border-surface-3">
                    <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Engagement</p>
                    <p className="font-bold text-white">{practitioner.availability.type}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#0B0F14] border border-surface-3">
                    <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Target Rate</p>
                    <p className="font-bold text-white">{practitioner.availability.rate}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#0B0F14] border border-surface-3">
                    <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Travel</p>
                    <p className="font-bold text-white">{practitioner.availability.travel}</p>
                  </div>
                </div>
              </Card>
            </motion.div>

          </div>

          {/* Right Column: Dashboard & Matching */}
          <div className="space-y-8">
            
            {/* Active Assignments */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="p-6 bg-surface-1 border-surface-3">
                <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                  <Briefcase className="w-5 h-5 text-primary" /> Active Assignments
                </h2>
                <div className="space-y-4">
                  {assignments.map((assignment, i) => (
                    <div key={i} className="p-4 rounded-xl bg-[#0B0F14] border border-surface-3">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-bold text-white">{assignment.clinic}</p>
                        <span className="px-2 py-0.5 rounded bg-success/10 text-success text-[10px] font-bold uppercase tracking-wider">
                          {assignment.status}
                        </span>
                      </div>
                      <p className="text-sm text-primary font-medium mb-3">{assignment.role}</p>
                      <div className="flex items-center justify-between text-xs text-text-secondary">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {assignment.hours}</span>
                        <span>Started {assignment.startDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <Link to="/dashboard">
                  <Button variant="outline" className="w-full mt-4 border-surface-3 text-white hover:bg-surface-2">
                    View Timesheets
                  </Button>
                </Link>
              </Card>
            </motion.div>

            {/* Recommended Opportunities */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="p-6 bg-surface-1 border-surface-3">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" /> Recommended Matches
                  </h2>
                </div>
                <div className="space-y-4">
                  {opportunities.map((opp, i) => (
                    <div key={i} className="p-4 rounded-xl bg-[#0B0F14] border border-surface-3 group hover:border-primary/50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                          {opp.match} Match
                        </span>
                        <span className="text-xs font-bold text-text-secondary">{opp.rate}</span>
                      </div>
                      <p className="font-bold text-white mb-1">{opp.role}</p>
                      <p className="text-sm text-text-secondary mb-3">{opp.clinic}</p>
                      <div className="flex items-center gap-3 text-xs text-text-secondary mb-4">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {opp.location}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {opp.type}</span>
                      </div>
                      <Link to="/workforce/jobs">
                        <Button className="w-full bg-surface-2 hover:bg-primary hover:text-black text-white transition-colors flex items-center justify-center gap-2">
                          Review Match <ArrowUpRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
                <Link to="/workforce/jobs">
                  <Button variant="ghost" className="w-full mt-4 text-text-secondary hover:text-white">
                    View All Opportunities
                  </Button>
                </Link>
              </Card>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}
