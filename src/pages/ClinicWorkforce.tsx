import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Briefcase, UserPlus, Search, Star, MapPin, CheckCircle2, XCircle } from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';

export function ClinicWorkforce() {
  const [activeTab, setActiveTab] = useState('requests');

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Workforce Exchange</h1>
          <p className="text-text-secondary mt-1">Manage staffing requests and review matched practitioners.</p>
        </div>
        <div className="flex gap-3">
          <Button>New Staffing Request</Button>
        </div>
      </div>

      <div className="flex gap-4 border-b border-surface-3 mb-6">
        <button
          onClick={() => setActiveTab('requests')}
          className={`pb-3 px-2 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'requests' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          Active Requests
        </button>
        <button
          onClick={() => setActiveTab('matches')}
          className={`pb-3 px-2 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'matches' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          AI Matches
        </button>
      </div>

      {activeTab === 'requests' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: 'Registered Nurse (RN)', type: 'Full-time', location: 'Miami, FL', status: 'Sourcing', matches: 3 },
            { title: 'Medical Assistant', type: 'Part-time', location: 'Miami, FL', status: 'Interviewing', matches: 5 },
            { title: 'Nurse Practitioner (NP)', type: 'Contract', location: 'Remote', status: 'Draft', matches: 0 },
          ].map((req, i) => (
            <Card key={i} className="p-6 bg-surface-1 border-surface-3">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-lg bg-surface-2 flex items-center justify-center text-primary">
                  <Briefcase className="w-5 h-5" />
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  req.status === 'Sourcing' ? 'bg-warning/10 text-warning' :
                  req.status === 'Interviewing' ? 'bg-primary/10 text-primary' :
                  'bg-surface-3 text-text-secondary'
                }`}>
                  {req.status}
                </span>
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-1">{req.title}</h3>
              <div className="flex items-center gap-4 text-sm text-text-secondary mb-4">
                <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {req.type}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {req.location}</span>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-surface-3">
                <span className="text-sm font-medium text-text-primary">{req.matches} Matches</span>
                <Button variant="outline" size="sm">View</Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {[
            { name: 'Sarah Jenkins, RN', role: 'Registered Nurse', matchScore: 95, experience: '8 years', location: 'Miami, FL' },
            { name: 'Dr. Emily Chen', role: 'Nurse Practitioner', matchScore: 88, experience: '5 years', location: 'Remote' },
          ].map((candidate, i) => (
            <Card key={i} className="p-6 bg-surface-1 border-surface-3 flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="w-16 h-16 rounded-full bg-surface-2 border border-surface-3 flex items-center justify-center flex-shrink-0">
                <span className="text-xl font-bold text-text-secondary">{candidate.name.charAt(0)}</span>
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-bold text-text-primary">{candidate.name}</h3>
                  <span className="px-2 py-0.5 rounded bg-success/10 text-success border border-success/20 text-xs font-mono font-medium flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" /> {candidate.matchScore}% Match
                  </span>
                </div>
                <p className="text-text-secondary text-sm mb-2">{candidate.role}</p>
                <div className="flex items-center gap-4 text-sm text-text-secondary">
                  <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {candidate.experience}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {candidate.location}</span>
                </div>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <Button variant="outline" className="flex-grow md:flex-grow-0">View Profile</Button>
                <Button className="flex-grow md:flex-grow-0">Request Interview</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
