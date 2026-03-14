import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';

export function ClinicRegister() {
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
    }, 2000);
  };

  const handleComplete = () => {
    navigate('/auth/clinic-login');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="h-20 border-b border-surface-3 bg-surface-1/50 backdrop-blur-md flex items-center px-6">
        <Link to="/" className="flex items-center gap-2">
          <Activity className="w-6 h-6 text-primary" />
          <span className="font-display font-bold text-xl tracking-tight">Novalyte <span className="text-primary">AI</span></span>
        </Link>
      </header>

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-display font-bold mb-2">Verify Identity</h1>
              <p className="text-text-secondary">
                Secure your clinic account and enable HIPAA-compliant infrastructure.
              </p>
            </div>

            <Card className="p-8 bg-surface-1 border-surface-3">
              {!isVerified ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Admin Email Address</label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-3 bg-surface-2 border border-surface-3 rounded-lg text-text-primary focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                      placeholder="admin@clinic.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Create Password</label>
                    <input 
                      type="password" 
                      className="w-full px-4 py-3 bg-surface-2 border border-surface-3 rounded-lg text-text-primary focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Confirm Password</label>
                    <input 
                      type="password" 
                      className="w-full px-4 py-3 bg-surface-2 border border-surface-3 rounded-lg text-text-primary focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                  
                  <Button 
                    className="w-full group" 
                    onClick={handleVerify}
                    disabled={isVerifying}
                  >
                    {isVerifying ? 'Verifying...' : 'Create Account'}
                    {!isVerifying && <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                  </Button>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-6"
                >
                  <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-success" />
                  </div>
                  <h2 className="text-2xl font-bold text-text-primary">Account Verified</h2>
                  <p className="text-text-secondary">
                    Your clinic profile has been created and verified. You can now access the Clinic OS dashboard.
                  </p>
                  <Button className="w-full" onClick={handleComplete}>
                    Go to Login
                  </Button>
                </motion.div>
              )}
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
