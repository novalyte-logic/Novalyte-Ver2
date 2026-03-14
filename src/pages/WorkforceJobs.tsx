import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Search, MapPin, Briefcase, Clock, DollarSign, Filter, ArrowRight, Star } from 'lucide-react';

const MOCK_JOBS = [
  { id: '1', title: 'Registered Nurse (RN) - TRT Specialist', clinic: 'Apex Longevity', location: 'Miami, FL', type: 'Full-time', salary: '$85k - $105k', match: 94, posted: '2 days ago', tags: ['TRT', 'Phlebotomy', 'Patient Education'] },
  { id: '2', title: 'Nurse Practitioner (NP)', clinic: 'Vitality Men\'s Health', location: 'Remote (Telehealth)', type: 'Contract', salary: '$65 - $85/hr', match: 88, posted: '5 hours ago', tags: ['Telehealth', 'Hormone Optimization', 'Prescribing'] },
  { id: '3', title: 'Medical Assistant', clinic: 'Prime Performance Clinic', location: 'Austin, TX', type: 'Full-time', salary: '$45k - $55k', match: 76, posted: '1 week ago', tags: ['Vitals', 'Admin', 'Patient Intake'] },
  { id: '4', title: 'Physician Assistant (PA)', clinic: 'Elite Wellness', location: 'New York, NY', type: 'Part-time', salary: '$75 - $95/hr', match: 91, posted: '3 days ago', tags: ['Peptide Therapy', 'Consultations'] },
];

export function WorkforceJobs() {
  const [view, setView] = useState<'list' | 'map'>('list');

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <section className="pt-24 pb-12 border-b border-surface-3 bg-surface-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-display font-bold text-text-primary mb-2">Clinical Opportunities</h1>
              <p className="text-text-secondary">Find your next role in high-growth men's health and longevity clinics.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-surface-2 p-1 rounded-lg border border-surface-3 flex">
                <button 
                  onClick={() => setView('list')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${view === 'list' ? 'bg-surface-3 text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}
                >
                  List View
                </button>
                <button 
                  onClick={() => setView('map')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${view === 'map' ? 'bg-surface-3 text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}
                >
                  Map View
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0 space-y-6">
            <Card className="p-6 bg-surface-1 border-surface-3">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-4 h-4 text-text-secondary" />
                <h3 className="font-bold text-text-primary">Filters</h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-text-secondary mb-3">Role Type</h4>
                  <div className="space-y-2">
                    {['Registered Nurse (RN)', 'Nurse Practitioner (NP)', 'Physician Assistant (PA)', 'Medical Assistant', 'Physician (MD/DO)'].map((role) => (
                      <label key={role} className="flex items-center gap-2 text-sm text-text-primary cursor-pointer">
                        <input type="checkbox" className="rounded border-surface-3 text-secondary focus:ring-secondary/50" />
                        {role}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-text-secondary mb-3">Employment Type</h4>
                  <div className="space-y-2">
                    {['Full-time', 'Part-time', 'Contract', 'Per Diem'].map((type) => (
                      <label key={type} className="flex items-center gap-2 text-sm text-text-primary cursor-pointer">
                        <input type="checkbox" className="rounded border-surface-3 text-secondary focus:ring-secondary/50" />
                        {type}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-text-secondary mb-3">Location</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm text-text-primary cursor-pointer">
                      <input type="checkbox" className="rounded border-surface-3 text-secondary focus:ring-secondary/50" />
                      Remote / Telehealth
                    </label>
                    <label className="flex items-center gap-2 text-sm text-text-primary cursor-pointer">
                      <input type="checkbox" className="rounded border-surface-3 text-secondary focus:ring-secondary/50" />
                      On-site
                    </label>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Job List */}
          <div className="flex-grow space-y-6">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <input 
                type="text" 
                placeholder="Search roles, clinics, or keywords..." 
                className="w-full h-14 pl-12 pr-4 bg-surface-2 border border-surface-3 rounded-xl text-text-primary focus:outline-none focus:border-secondary/50 focus:ring-1 focus:ring-secondary/50 transition-all"
              />
            </div>

            <div className="flex items-center justify-between text-sm text-text-secondary mb-4">
              <span>Showing {MOCK_JOBS.length} opportunities</span>
              <select className="bg-transparent border-none focus:ring-0 cursor-pointer text-text-primary">
                <option>Highest Match</option>
                <option>Newest</option>
                <option>Highest Pay</option>
              </select>
            </div>

            <div className="space-y-4">
              {MOCK_JOBS.map((job) => (
                <Card key={job.id} className="p-6 bg-surface-1 border-surface-3 hover:border-secondary/50 transition-colors group">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-text-primary group-hover:text-secondary transition-colors">{job.title}</h3>
                        {job.match > 90 && (
                          <span className="px-2 py-0.5 rounded bg-success/10 text-success border border-success/20 text-xs font-mono font-medium flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current" /> {job.match}% Match
                          </span>
                        )}
                      </div>
                      
                      <p className="text-lg text-text-secondary mb-4">{job.clinic}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary mb-4">
                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location}</span>
                        <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> {job.type}</span>
                        <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> {job.salary}</span>
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {job.posted}</span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {job.tags.map((tag, i) => (
                          <span key={i} className="px-2 py-1 rounded-md bg-surface-2 border border-surface-3 text-xs text-text-secondary">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-3 md:items-end flex-shrink-0">
                      <Link to={`/workforce/apply/${job.id}`}>
                        <Button className="w-full md:w-auto group-hover:bg-secondary group-hover:text-white transition-colors">
                          Apply Now
                        </Button>
                      </Link>
                      <Button variant="outline" className="w-full md:w-auto">
                        Save Role
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
