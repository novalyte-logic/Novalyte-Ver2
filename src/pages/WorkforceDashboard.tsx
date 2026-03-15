import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Activity, User, Briefcase, FileText, CheckCircle2, Star, 
  MapPin, Clock, DollarSign, MessageCircle, Settings, LogOut, 
  Search, Sparkles, ChevronRight, ShieldCheck, AlertCircle,
  TrendingUp, Calendar
} from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';

export function WorkforceDashboard() {
  const [activeTab, setActiveTab] = useState('applications');
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('novalyte_workforce_profile');
    if (saved) {
      setProfile(JSON.parse(saved));
    } else {
      setProfile({
        firstName: 'Jane',
        lastName: 'Doe',
        role: 'Registered Nurse',
        experience: '3-5',
        location: 'Austin, TX',
        resumeUploaded: true
      });
    }
  }, []);

  const getInitials = () => {
    if (!profile) return 'JD';
    return `${profile.firstName?.[0] || ''}${profile.lastName?.[0] || ''}`.toUpperCase() || 'JD';
  };

  const tabs = [
    { id: 'applications', label: 'My Applications', icon: Briefcase },
    { id: 'matches', label: 'AI Matches', icon: Star },
    { id: 'profile', label: 'Profile & Resume', icon: User },
    { id: 'messages', label: 'Messages', icon: MessageCircle, badge: 2 },
  ];

  return (
    <div className="min-h-screen bg-[#05070A] flex flex-col md:flex-row selection:bg-secondary/30 selection:text-white font-sans">
      
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-[#0B0F14] border-r border-surface-3 flex-shrink-0 flex flex-col h-screen sticky top-0 z-20">
        <div className="h-20 flex items-center px-6 border-b border-surface-3">
          <Link to="/" className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-secondary" />
            <span className="font-display font-bold text-xl tracking-tight text-white">Novalyte <span className="text-secondary">AI</span></span>
          </Link>
        </div>

        <div className="p-6 flex-grow flex flex-col">
          {/* User Profile Snippet */}
          <div className="flex items-center gap-4 mb-8 p-4 rounded-xl bg-surface-2 border border-surface-3">
            <div className="w-12 h-12 rounded-full bg-secondary/10 border border-secondary/20 flex items-center justify-center text-lg font-bold text-secondary">
              {getInitials()}
            </div>
            <div className="overflow-hidden">
              <h3 className="font-bold text-white truncate">{profile?.firstName} {profile?.lastName}</h3>
              <p className="text-xs text-text-secondary truncate">{profile?.role}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2 flex-grow">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                    isActive 
                      ? 'bg-secondary/10 text-secondary border border-secondary/20' 
                      : 'text-text-secondary hover:bg-surface-2 hover:text-white border border-transparent'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-secondary' : 'text-text-secondary'}`} /> 
                  {tab.label}
                  {tab.badge && (
                    <span className="ml-auto bg-secondary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="pt-6 border-t border-surface-3 space-y-2 mt-auto">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-text-secondary hover:bg-surface-2 hover:text-white transition-colors">
              <Settings className="w-5 h-5" /> Settings
            </button>
            <Link to="/" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-text-secondary hover:bg-surface-2 hover:text-white transition-colors">
              <LogOut className="w-5 h-5" /> Sign Out
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6 md:p-10 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div>
              <h1 className="text-3xl font-display font-bold text-white capitalize">
                {activeTab.replace('-', ' ')}
              </h1>
              <p className="text-text-secondary mt-1">Manage your career and opportunities.</p>
            </div>
            <Link to="/workforce/jobs">
              <Button className="bg-white text-black hover:bg-white/90 font-bold">
                <Search className="w-4 h-4 mr-2" /> Browse Opportunities
              </Button>
            </Link>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* APPLICATIONS TAB */}
              {activeTab === 'applications' && (
                <div className="space-y-6">
                  {/* AI Copilot Insight */}
                  <Card className="p-6 bg-secondary/5 border-secondary/20 flex flex-col md:flex-row gap-6 items-start">
                    <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                      <Sparkles className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">Career Copilot Insight</h3>
                      <p className="text-text-secondary leading-relaxed mb-4">
                        Your application for the TRT Specialist role at Apex Longevity is currently under review. Based on historical data, clinics typically respond within 48 hours for candidates with a 90%+ match score.
                      </p>
                      <div className="flex gap-3">
                        <Link to="/ask-ai">
                          <Button variant="outline" size="sm" className="border-secondary/30 text-secondary hover:bg-secondary/10">
                            Prepare for Interview
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>

                  {/* Application List */}
                  <div className="space-y-4">
                    {[
                      { clinic: 'Apex Longevity', role: 'Registered Nurse (RN) - TRT Specialist', status: 'Under Review', date: 'Today', location: 'Austin, TX', type: 'Full-time' },
                      { clinic: 'Vitality Men\'s Health', role: 'Nurse Practitioner (NP)', status: 'Interview Scheduled', date: '3 days ago', location: 'Remote', type: 'Contract' },
                      { clinic: 'Prime Performance Clinic', role: 'Medical Assistant', status: 'Rejected', date: '1 week ago', location: 'Dallas, TX', type: 'Part-time' },
                    ].map((app, i) => (
                      <Card key={i} className="p-6 bg-[#0B0F14] border-surface-3 hover:border-surface-4 transition-all group">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div className="flex-grow">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-white group-hover:text-secondary transition-colors">{app.role}</h3>
                              <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border ${
                                app.status === 'Under Review' ? 'bg-warning/10 text-warning border-warning/20' :
                                app.status === 'Interview Scheduled' ? 'bg-success/10 text-success border-success/20' :
                                'bg-surface-3 text-text-secondary border-surface-3'
                              }`}>
                                {app.status}
                              </span>
                            </div>
                            <p className="text-lg text-text-secondary mb-4">{app.clinic}</p>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
                              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {app.location}</span>
                              <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> {app.type}</span>
                              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Applied {app.date}</span>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                            {app.status === 'Interview Scheduled' ? (
                              <>
                                <Link to="/contact">
                                  <Button variant="outline" className="border-surface-3 hover:bg-surface-2 text-white">Reschedule</Button>
                                </Link>
                                <Link to="/contact">
                                  <Button className="bg-success hover:bg-success/90 text-black font-bold">
                                    <Calendar className="w-4 h-4 mr-2" /> Join Interview
                                  </Button>
                                </Link>
                              </>
                            ) : (
                              <Link to="/workforce/jobs">
                                <Button variant="outline" className="border-surface-3 hover:bg-surface-2 text-white">
                                  View Details <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                              </Link>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* MATCHES TAB */}
              {activeTab === 'matches' && (
                <div className="space-y-6">
                  <div className="p-6 rounded-xl bg-[#0B0F14] border border-surface-3 flex items-start gap-4 mb-8">
                    <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                      <TrendingUp className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white mb-1">High-Demand Market</h3>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        Demand for <strong className="text-white">{profile?.role || 'your role'}s</strong> in <strong className="text-white">{profile?.location || 'your area'}</strong> is up 24% this month. We've found 4 clinics actively hiring that match your profile.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[
                      { clinic: 'Elite Wellness', role: 'Registered Nurse', match: 98, salary: '$90k - $110k', location: 'Miami, FL' },
                      { clinic: 'TestoCare Clinics', role: 'RN - Phlebotomy Specialist', match: 92, salary: '$85k - $100k', location: 'Remote' },
                      { clinic: 'Longevity Institute', role: 'IV Therapy Nurse', match: 88, salary: '$45 - $55/hr', location: 'Austin, TX' },
                      { clinic: 'Men\'s Health Co.', role: 'Triage Nurse', match: 85, salary: '$80k - $95k', location: 'New York, NY' },
                    ].map((match, i) => (
                      <Card key={i} className="p-6 bg-[#0B0F14] border-surface-3 hover:border-secondary/30 transition-all flex flex-col h-full group">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-bold text-white group-hover:text-secondary transition-colors">{match.role}</h3>
                          <span className="px-2 py-1 rounded bg-success/10 text-success border border-success/20 text-xs font-mono font-bold flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current" /> {match.match}% Match
                          </span>
                        </div>
                        <p className="text-text-secondary mb-6 flex-grow">{match.clinic}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary mb-6 p-3 rounded-lg bg-surface-2">
                          <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {match.location}</span>
                          <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4" /> {match.salary}</span>
                        </div>
                        <Link to={`/workforce/apply/${i}`}>
                          <Button className="w-full bg-surface-2 hover:bg-secondary hover:text-white text-white transition-colors">
                            Review & Apply
                          </Button>
                        </Link>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* PROFILE TAB */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <Card className="p-8 bg-[#0B0F14] border-surface-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                      <ShieldCheck className="w-48 h-48 text-success" />
                    </div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h2 className="text-2xl font-bold text-white mb-1">Profile Strength</h2>
                          <p className="text-text-secondary text-sm">A complete profile increases interview requests by 3x.</p>
                        </div>
                        <span className="text-4xl font-display font-bold text-success">85%</span>
                      </div>
                      <div className="w-full h-3 bg-surface-2 rounded-full overflow-hidden mb-6">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '85%' }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full bg-success rounded-full" 
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl border border-success/20 bg-success/5 flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                          <div>
                            <p className="text-sm font-bold text-white">Resume Uploaded</p>
                            <p className="text-xs text-text-secondary mt-1">Parsed and indexed for AI matching.</p>
                          </div>
                        </div>
                        <div className="p-4 rounded-xl border border-warning/20 bg-warning/5 flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-warning shrink-0" />
                          <div>
                            <p className="text-sm font-bold text-white">Missing NPI Number</p>
                            <p className="text-xs text-text-secondary mt-1">Add your NPI to reach 100% completion.</p>
                            <button className="text-xs font-bold text-warning hover:underline mt-2">Add NPI Now</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-8 bg-[#0B0F14] border-surface-3">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-white">Documents & Credentials</h2>
                      <Link to="/workforce/profile">
                        <Button variant="outline" size="sm" className="border-surface-3 text-white hover:bg-surface-2">
                          Upload New
                        </Button>
                      </Link>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 rounded-xl bg-surface-2 border border-surface-3 hover:border-surface-4 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-surface-3 flex items-center justify-center text-text-secondary">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-white">{profile?.firstName}_Resume_2026.pdf</p>
                            <p className="text-xs text-text-secondary mt-0.5">Uploaded 2 days ago • 2.4 MB</p>
                          </div>
                        </div>
                        <Link to="/workforce/profile">
                          <Button variant="outline" size="sm" className="border-surface-3 text-white">View</Button>
                        </Link>
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-xl bg-surface-2 border border-surface-3 hover:border-surface-4 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center text-success">
                            <ShieldCheck className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-white">State RN License Verification</p>
                            <p className="text-xs text-text-secondary mt-0.5">Verified by Novalyte • Expires 12/2026</p>
                          </div>
                        </div>
                        <span className="text-[10px] uppercase tracking-wider font-bold text-success bg-success/10 px-2.5 py-1 rounded-full border border-success/20">
                          Verified
                        </span>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
              
              {/* MESSAGES TAB */}
              {activeTab === 'messages' && (
                <Card className="p-16 bg-[#0B0F14] border-surface-3 text-center flex flex-col items-center justify-center min-h-[400px]">
                  <div className="w-20 h-20 rounded-full bg-surface-2 flex items-center justify-center mb-6">
                    <MessageCircle className="w-10 h-10 text-text-secondary" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">No Active Conversations</h3>
                  <p className="text-text-secondary max-w-md mx-auto leading-relaxed">
                    When a clinic wants to schedule an interview or ask questions about your application, secure messages will appear here.
                  </p>
                  <Button className="mt-8 bg-surface-2 text-white hover:bg-surface-3" onClick={() => setActiveTab('matches')}>
                    View AI Matches
                  </Button>
                </Card>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
