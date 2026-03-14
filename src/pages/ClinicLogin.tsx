import React from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Activity, Lock, ArrowRight } from 'lucide-react';

export function ClinicLogin() {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Left Side - Branding */}
      <div className="hidden md:flex md:w-1/2 bg-surface-1 border-r border-surface-3 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        
        <div className="relative z-10 max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-12">
            <Activity className="w-8 h-8 text-primary" />
            <span className="font-display font-bold text-2xl tracking-tight text-text-primary">
              Novalyte <span className="text-primary">AI</span>
            </span>
          </Link>
          
          <h1 className="text-4xl font-display font-bold mb-6">
            Clinic Operating System
          </h1>
          <p className="text-xl text-text-secondary mb-12">
            Access your pipeline, manage leads, and orchestrate care with intelligent infrastructure.
          </p>
          
          <div className="space-y-4 font-mono text-sm text-text-secondary">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span>Secure Connection Established</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span>End-to-End Encryption Active</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span>HIPAA Compliance Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute top-6 left-6 md:hidden">
          <Link to="/" className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" />
            <span className="font-display font-bold text-xl tracking-tight text-text-primary">
              Novalyte
            </span>
          </Link>
        </div>

        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="text-center mb-10">
              <div className="w-16 h-16 rounded-2xl bg-surface-2 border border-surface-3 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(53,212,255,0.1)]">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl font-display font-bold mb-2">Welcome Back</h2>
              <p className="text-text-secondary">Sign in to access your clinic dashboard.</p>
            </div>

            <Card className="p-8 bg-surface-2/50 backdrop-blur-xl border-surface-3">
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Work Email</label>
                  <input 
                    type="email" 
                    required
                    defaultValue="sanbosay@gmail.com"
                    className="w-full h-12 px-4 bg-surface-1 border border-surface-3 rounded-lg text-text-primary focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all" 
                    placeholder="doctor@clinic.com" 
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-text-secondary">Access Code</label>
                    <a href="#" className="text-xs text-primary hover:text-primary-hover transition-colors">Forgot code?</a>
                  </div>
                  <input 
                    type="password" 
                    required
                    defaultValue="2104"
                    className="w-full h-12 px-4 bg-surface-1 border border-surface-3 rounded-lg text-text-primary focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-mono" 
                    placeholder="â€¢â€¢â€¢â€¢" 
                  />
                </div>
                <Button type="submit" size="lg" className="w-full group">
                  Authenticate
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>
            </Card>

            <p className="text-center text-sm text-text-secondary mt-8">
              Don't have an account? <Link to="/clinics/apply" className="text-primary hover:text-primary-hover font-medium transition-colors">Apply for Access</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
