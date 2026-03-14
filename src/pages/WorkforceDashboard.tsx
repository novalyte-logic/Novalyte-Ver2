import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Activity, User, Briefcase, FileText, CheckCircle2, Star, MapPin, Clock, DollarSign, MessageCircle, Settings, LogOut, Search } from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';

export function WorkforceDashboard() {
  const [activeTab, setActiveTab] = useState('applications');

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-surface-1 border-r border-surface-3 flex-shrink-0 flex flex-col h-screen sticky top-0">
        <div className="h-20 flex items-center px-6 border-b border-surface-3">
          <Link to="/" className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-secondary" />
            <span className="font-display font-bold text-xl tracking-tight">Novalyte <span className="text-secondary">AI</span></span>
          </Link>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-full bg-surface-2 border border-surface-3 flex items-center justify-center text-xl font-bold text-text-secondary">
              JD
            </div>
            <div>
              <h3 className="font-bold text-text-primary">Jane Doe</h3>
              <p className="text-sm text-text-secondary">Registered Nurse</p>
            </div>
          </div>

          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab('applications')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'applications' ? 'bg-secondary/10 text-secondary' : 'text-text-secondary hover:bg-surface-2 hover:text-text-primary'}`}
            >
              <Briefcase className="w-5 h-5" /> My Applications
            </button>
            <button 
              onClick={() => setActiveTab('matches')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'matches' ? 'bg-secondary/10 text-secondary' : 'text-text-secondary hover:bg-surface-2 hover:text-text-primary'}`}
            >
              <Star className="w-5 h-5" /> AI Matches
            </button>
            <button 
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'profile' ? 'bg-secondary/10 text-secondary' : 'text-text-secondary hover:bg-surface-2 hover:text-text-primary'}`}
            >
              <User className="w-5 h-5" /> Profile & Resume
            </button>
            <button 
              onClick={() => setActiveTab('messages')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'messages' ? 'bg-secondary/10 text-secondary' : 'text-text-secondary hover:bg-surface-2 hover:text-text-primary'}`}
            >
              <MessageCircle className="w-5 h-5" /> Messages
              <span className="ml-auto bg-secondary text-white text-xs font-bold px-2 py-0.5 rounded-full">2</span>
            </button>
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-surface-3 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:bg-surface-2 hover:text-text-primary transition-colors">
            <Settings className="w-5 h-5" /> Settings
          </button>
          <Link to="/" className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:bg-surface-2 hover:text-text-primary transition-colors">
            <LogOut className="w-5 h-5" /> Sign Out
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-display font-bold text-text-primary capitalize">{activeTab.replace('-', ' ')}</h1>
            <Link to="/workforce/jobs">
              <Button variant="outline" className="flex items-center gap-2">
                <Search className="w-4 h-4" /> Browse Jobs
              </Button>
            </Link>
          </div>

          {activeTab === 'applications' && (
            <div className="space-y-6">
              {[
                { clinic: 'Apex Longevity', role: 'Registered Nurse (RN) - TRT Specialist', status: 'Under Review', date: 'Today', location: 'Miami, FL' },
                { clinic: 'Vitality Men\'s Health', role: 'Nurse Practitioner (NP)', status: 'Interview Scheduled', date: '3 days ago', location: 'Remote' },
                { clinic: 'Prime Performance Clinic', role: 'Medical Assistant', status: 'Rejected', date: '1 week ago', location: 'Austin, TX' },
              ].map((app, i) => (
                <Card key={i} className="p-6 bg-surface-1 border-surface-3 hover:border-secondary/50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-text-primary">{app.role}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                          app.status === 'Under Review' ? 'bg-warning/10 text-warning border-warning/20' :
                          app.status === 'Interview Scheduled' ? 'bg-success/10 text-success border-success/20' :
                          'bg-surface-3 text-text-secondary border-surface-3'
                        }`}>
                          {app.status}
                        </span>
                      </div>
                      <p className="text-lg text-text-secondary mb-2">{app.clinic}</p>
                      <div className="flex items-center gap-4 text-sm text-text-secondary">
                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {app.location}</span>
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Applied {app.date}</span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline">View Details</Button>
                      {app.status === 'Interview Scheduled' && <Button>Join Interview</Button>}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'matches' && (
            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-secondary/10 border border-secondary/20 flex items-start gap-4 mb-8">
                <Activity className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-text-primary mb-2">Novalyte AI Matching Engine</h3>
                  <p className="text-sm text-text-secondary">
                    Based on your profile (RN, 3-5 years experience, Hormone Optimization focus), we've identified these high-growth clinics actively seeking your exact skill set.
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
                  <Card key={i} className="p-6 bg-surface-1 border-surface-3 hover:border-secondary/50 transition-colors flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-bold text-text-primary">{match.role}</h3>
                      <span className="px-2 py-1 rounded bg-success/10 text-success border border-success/20 text-xs font-mono font-medium flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" /> {match.match}% Match
                      </span>
                    </div>
                    <p className="text-text-secondary mb-4 flex-grow">{match.clinic}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary mb-6">
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {match.location}</span>
                      <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> {match.salary}</span>
                    </div>
                    <Button className="w-full">Apply Now</Button>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-8">
              <Card className="p-8 bg-surface-1 border-surface-3">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-text-primary">Profile Strength</h2>
                  <span className="text-2xl font-display font-bold text-success">85%</span>
                </div>
                <div className="w-full h-2 bg-surface-2 rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-success w-[85%]" />
                </div>
                <p className="text-sm text-text-secondary">Add your NPI number and complete 1 more skill assessment to reach 100%.</p>
              </Card>

              <Card className="p-8 bg-surface-1 border-surface-3">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-text-primary">Resume & Documents</h2>
                  <Button variant="outline" size="sm">Upload New</Button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-surface-2 border border-surface-3">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-text-secondary" />
                      <div>
                        <p className="font-medium text-text-primary">Jane_Doe_RN_Resume.pdf</p>
                        <p className="text-xs text-text-secondary">Uploaded 2 days ago • 2.4 MB</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-surface-2 border border-surface-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-success" />
                      <div>
                        <p className="font-medium text-text-primary">Florida RN License Verification</p>
                        <p className="text-xs text-text-secondary">Verified by Novalyte • Expires 12/2026</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-success bg-success/10 px-2 py-1 rounded-full">Verified</span>
                  </div>
                </div>
              </Card>
            </div>
          )}
          
          {activeTab === 'messages' && (
            <Card className="p-12 bg-surface-1 border-surface-3 text-center">
              <MessageCircle className="w-12 h-12 text-surface-3 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-text-primary mb-2">No Active Conversations</h3>
              <p className="text-text-secondary max-w-md mx-auto">
                When a clinic wants to schedule an interview or ask questions about your application, messages will appear here.
              </p>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
