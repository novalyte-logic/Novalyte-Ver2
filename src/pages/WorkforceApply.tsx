import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Activity, ArrowLeft, CheckCircle2, Briefcase, FileText, Send } from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';

export function WorkforceApply() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setTimeout(() => {
        navigate('/workforce/dashboard');
      }, 2000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="h-20 border-b border-surface-3 bg-surface-1/50 backdrop-blur-md flex items-center px-6">
        <Link to="/" className="flex items-center gap-2">
          <Activity className="w-6 h-6 text-secondary" />
          <span className="font-display font-bold text-xl tracking-tight">Novalyte <span className="text-secondary">AI</span></span>
        </Link>
      </header>

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <Link to="/workforce/jobs" className="inline-flex items-center text-sm text-text-secondary hover:text-secondary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Jobs
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="p-8 bg-surface-1 border-surface-3">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="border-b border-surface-3 pb-6">
                    <h1 className="text-2xl font-display font-bold text-text-primary mb-2">Apply for Role</h1>
                    <p className="text-lg text-text-secondary">Registered Nurse (RN) - TRT Specialist at Apex Longevity</p>
                  </div>

                  <div className="space-y-6">
                    <div className="p-4 rounded-xl bg-surface-2 border border-surface-3 flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary flex-shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-text-primary mb-1">Using Profile: Jane Doe, RN</h3>
                        <p className="text-sm text-text-secondary mb-2">Your saved profile and resume will be securely transmitted to the clinic.</p>
                        <Link to="/workforce/profile" className="text-sm text-secondary hover:underline">Edit Profile</Link>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Cover Note (Optional)</label>
                      <textarea 
                        className="w-full h-32 px-4 py-3 bg-surface-2 border border-surface-3 rounded-lg text-text-primary focus:outline-none focus:border-secondary/50 focus:ring-1 focus:ring-secondary/50 transition-all resize-none"
                        placeholder="Briefly explain why you're a great fit for this clinic..."
                      />
                    </div>

                    <div className="flex items-center gap-3 p-4 rounded-lg bg-surface-2 border border-surface-3">
                      <input type="checkbox" required className="rounded border-surface-3 text-secondary focus:ring-secondary/50" />
                      <span className="text-sm text-text-secondary">I authorize Novalyte AI to share my profile, credentials, and contact information with this clinic.</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-surface-3 flex justify-end">
                    <Button type="submit" size="lg" className="group" disabled={isSubmitting}>
                      {isSubmitting ? 'Submitting...' : 'Submit Application'}
                      {!isSubmitting && <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                    </Button>
                  </div>
                </form>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-success" />
                  </div>
                  <h2 className="text-3xl font-display font-bold text-text-primary mb-4">Application Sent</h2>
                  <p className="text-text-secondary text-lg mb-8 max-w-md mx-auto">
                    Your profile has been securely transmitted to Apex Longevity. You can track the status in your dashboard.
                  </p>
                  <p className="text-sm text-text-secondary">Redirecting to dashboard...</p>
                </motion.div>
              )}
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
