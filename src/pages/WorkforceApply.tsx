import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  Activity, ArrowLeft, CheckCircle2, Briefcase, FileText, 
  Send, MapPin, DollarSign, Clock, ShieldCheck, Sparkles,
  User, AlertCircle, Loader2
} from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';

// Mock Job Data
const MOCK_JOB = {
  id: '1',
  title: 'Registered Nurse (RN) - TRT Specialist',
  clinic: 'Apex Longevity',
  location: 'Austin, TX (Hybrid)',
  type: 'Full-time',
  salary: '$85k - $105k',
  matchScore: 92,
  matchReasons: [
    'Your RN experience exceeds the 3-year requirement.',
    'Active state license matches clinic location.',
    'TRT and Peptide Therapy protocols align with clinic services.'
  ],
  requirements: [
    'Active RN License',
    '3+ years clinical experience',
    'Experience with TRT protocols',
    'Excellent patient communication'
  ]
};

export function WorkforceApply() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [coverNote, setCoverNote] = useState('');
  const [authorized, setAuthorized] = useState(false);
  
  // Load candidate profile from local storage
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('novalyte_workforce_profile');
    if (saved) {
      setProfile(JSON.parse(saved));
    } else {
      // Fallback mock profile if none exists
      setProfile({
        firstName: 'Jane',
        lastName: 'Doe',
        role: 'RN',
        experience: '3-5',
        location: 'Austin, TX',
        resumeUploaded: true
      });
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorized) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Redirect after success
      setTimeout(() => {
        navigate('/workforce/dashboard');
      }, 2500);
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#05070A] flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-8 relative">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="absolute inset-0 rounded-full border-4 border-success/30"
            />
            <CheckCircle2 className="w-12 h-12 text-success" />
          </div>
          <h2 className="text-3xl font-display font-bold text-white mb-4">Application Sent</h2>
          <p className="text-text-secondary text-lg mb-8">
            Your profile and application have been securely transmitted to <span className="text-white font-bold">{MOCK_JOB.clinic}</span>.
          </p>
          <Card className="p-6 bg-surface-1 border-surface-3 mb-8 text-left">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Next Steps</p>
                <p className="text-xs text-text-secondary">The clinic will review your match score.</p>
              </div>
            </div>
            <div className="h-1 w-full bg-surface-2 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 2.5, ease: "linear" }}
                className="h-full bg-secondary"
              />
            </div>
            <p className="text-xs text-center text-text-secondary mt-4 uppercase tracking-wider font-bold">
              Redirecting to Dashboard...
            </p>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070A] flex flex-col selection:bg-secondary/30 selection:text-white">
      {/* Header */}
      <header className="h-20 border-b border-surface-3 bg-[#0B0F14] flex items-center justify-between px-6 sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2">
          <Activity className="w-6 h-6 text-secondary" />
          <span className="font-display font-bold text-xl tracking-tight text-white">Novalyte <span className="text-secondary">AI</span></span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-text-secondary hidden md:inline-block">Application Portal</span>
          <div className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center border border-surface-3">
            <User className="w-4 h-4 text-text-secondary" />
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-6xl w-full mx-auto px-6 py-8 md:py-12">
        <Link to="/workforce/jobs" className="inline-flex items-center text-sm font-bold text-text-secondary hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Opportunities
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Job Context & Match */}
          <div className="lg:col-span-5 space-y-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
              <Card className="p-6 bg-[#0B0F14] border-surface-3">
                <div className="mb-6">
                  <h1 className="text-2xl font-display font-bold text-white mb-2">{MOCK_JOB.title}</h1>
                  <p className="text-lg text-secondary font-medium">{MOCK_JOB.clinic}</p>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-text-secondary">
                    <MapPin className="w-5 h-5" />
                    <span>{MOCK_JOB.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-text-secondary">
                    <Clock className="w-5 h-5" />
                    <span>{MOCK_JOB.type}</span>
                  </div>
                  <div className="flex items-center gap-3 text-text-secondary">
                    <DollarSign className="w-5 h-5" />
                    <span>{MOCK_JOB.salary}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Key Requirements</h3>
                  <ul className="space-y-2">
                    {MOCK_JOB.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                        <div className="w-1.5 h-1.5 rounded-full bg-surface-3 mt-1.5 shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
              <Card className="p-6 bg-secondary/5 border-secondary/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Sparkles className="w-24 h-24 text-secondary" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center text-secondary">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">AI Match Analysis</h3>
                      <p className="text-sm text-secondary font-bold">{MOCK_JOB.matchScore}% Compatibility</p>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {MOCK_JOB.matchReasons.map((reason, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                        <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Right Column: Application Form */}
          <div className="lg:col-span-7">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
              <Card className="p-6 md:p-8 bg-surface-1 border-surface-3">
                <h2 className="text-xl font-bold text-white mb-6">Submit Application</h2>
                
                <form onSubmit={handleSubmit} className="space-y-8">
                  
                  {/* Candidate Context */}
                  <div className="p-5 rounded-xl bg-[#0B0F14] border border-surface-3">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center text-text-secondary">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white">
                            {profile?.firstName} {profile?.lastName}
                          </h3>
                          <p className="text-sm text-text-secondary">{profile?.role} • {profile?.location}</p>
                        </div>
                      </div>
                      <Link to="/workforce/profile" className="text-xs font-bold text-secondary hover:text-white uppercase tracking-wider">
                        Edit Profile
                      </Link>
                    </div>
                    
                    <div className="flex items-center gap-4 pt-4 border-t border-surface-3">
                      <div className="flex items-center gap-2 text-sm">
                        {profile?.resumeUploaded ? (
                          <><CheckCircle2 className="w-4 h-4 text-success" /> <span className="text-text-secondary">Resume Attached</span></>
                        ) : (
                          <><AlertCircle className="w-4 h-4 text-warning" /> <span className="text-text-secondary">No Resume</span></>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <ShieldCheck className="w-4 h-4 text-success" /> 
                        <span className="text-text-secondary">Credentials Verified</span>
                      </div>
                    </div>
                  </div>

                  {/* Cover Note */}
                  <div>
                    <label className="block text-sm font-bold text-text-secondary mb-3 uppercase tracking-wider">
                      Cover Note <span className="text-text-secondary/50 normal-case font-normal">(Optional)</span>
                    </label>
                    <textarea 
                      value={coverNote}
                      onChange={(e) => setCoverNote(e.target.value)}
                      className="w-full h-32 px-4 py-3 bg-[#0B0F14] border border-surface-3 rounded-xl text-white focus:outline-none focus:border-secondary/50 focus:ring-1 focus:ring-secondary/50 transition-all resize-none"
                      placeholder="Briefly explain why you're a great fit for this specific clinic..."
                    />
                  </div>

                  {/* Authorization */}
                  <div className="flex items-start gap-4 p-5 rounded-xl bg-surface-2 border border-surface-3">
                    <div className="pt-0.5">
                      <input 
                        type="checkbox" 
                        id="auth-check"
                        checked={authorized}
                        onChange={(e) => setAuthorized(e.target.checked)}
                        className="w-5 h-5 rounded border-surface-3 text-secondary focus:ring-secondary/50 bg-[#0B0F14]" 
                      />
                    </div>
                    <label htmlFor="auth-check" className="text-sm text-text-secondary leading-relaxed cursor-pointer">
                      I authorize Novalyte AI to share my professional profile, credentials, and contact information with <strong className="text-white">{MOCK_JOB.clinic}</strong> for the purpose of this application.
                    </label>
                  </div>

                  {/* Submit Action */}
                  <div className="pt-6 border-t border-surface-3 flex items-center justify-between">
                    <p className="text-xs text-text-secondary">
                      By submitting, you agree to our <Link to="/terms" className="underline hover:text-white">Terms of Service</Link>.
                    </p>
                    <Button 
                      type="submit" 
                      size="lg" 
                      disabled={!authorized || isSubmitting}
                      className={`min-w-[180px] ${authorized ? 'bg-secondary hover:bg-secondary/90 text-white' : 'bg-surface-3 text-text-secondary cursor-not-allowed'}`}
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                      ) : (
                        <span className="flex items-center">
                          Submit Application <Send className="ml-2 w-4 h-4" />
                        </span>
                      )}
                    </Button>
                  </div>

                </form>
              </Card>
            </motion.div>
          </div>

        </div>
      </main>
    </div>
  );
}
