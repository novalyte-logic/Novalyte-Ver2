import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Activity, ArrowRight, ShieldCheck, Key, UserCircle, ChevronLeft } from 'lucide-react';

export function ClinicLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'provider' | 'staff'>('admin');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate real auth request
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (!email || !password) {
        throw new Error('Invalid credentials');
      }

      // Set session
      localStorage.setItem('novalyte_clinic_session', JSON.stringify({
        email,
        role,
        authenticatedAt: new Date().toISOString()
      }));

      navigate('/dashboard');
    } catch (err) {
      setError('Authentication failed. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070A] flex flex-col lg:flex-row">
      {/* Left Side - Operations Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0B0F14] border-r border-surface-3 relative overflow-hidden flex-col justify-between p-12">
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-50" />
        
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 mb-16 text-text-secondary hover:text-white transition-colors w-fit">
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium text-sm">Return to Public Site</span>
          </Link>
          
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <span className="font-display font-bold text-3xl tracking-tight text-white">
              Novalyte <span className="text-primary">OS</span>
            </span>
          </div>
          
          <h1 className="text-4xl font-display font-bold text-white mb-6 leading-tight">
            Clinic Operations <br/>
            <span className="text-text-secondary">Control Center</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-md">
            Secure access to your patient pipeline, revenue analytics, and workforce orchestration tools.
          </p>
        </div>
        
        <div className="relative z-10">
          <div className="bg-[#05070A] border border-surface-3 rounded-xl p-6 font-mono text-sm shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-surface-3 pb-4">
              <span className="text-text-secondary">SYSTEM STATUS</span>
              <span className="text-success flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
                OPTIMAL
              </span>
            </div>
            <div className="space-y-3 text-text-secondary">
              <div className="flex justify-between">
                <span>Encryption</span>
                <span className="text-white">AES-256 Active</span>
              </div>
              <div className="flex justify-between">
                <span>HIPAA Compliance</span>
                <span className="text-white">Verified</span>
              </div>
              <div className="flex justify-between">
                <span>Network Latency</span>
                <span className="text-white">12ms</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-[#05070A] relative">
        <div className="absolute top-6 left-6 lg:hidden">
          <Link to="/" className="flex items-center gap-2 text-text-secondary hover:text-white">
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium text-sm">Back</span>
          </Link>
        </div>

        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="text-center mb-10">
              <div className="w-16 h-16 rounded-2xl bg-[#101720] border border-surface-3 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
                <ShieldCheck className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl font-display font-bold text-white mb-2">Secure Authentication</h2>
              <p className="text-text-secondary">Enter your credentials to access the network.</p>
            </div>

            <Card className="p-8 bg-[#101720] border-surface-3 shadow-2xl">
              <form onSubmit={handleLogin} className="space-y-6">
                
                {/* Role Selector */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-3">Access Role</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['admin', 'provider', 'staff'] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={`py-2 px-3 rounded-lg border text-xs font-medium capitalize transition-all ${
                          role === r 
                            ? 'bg-primary/10 border-primary text-primary' 
                            : 'bg-[#05070A] border-surface-3 text-text-secondary hover:border-surface-4'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Work Email</label>
                  <div className="relative">
                    <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-12 pl-10 pr-4 bg-[#05070A] border border-surface-3 rounded-lg text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all" 
                      placeholder="doctor@clinic.com" 
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-text-secondary">Password / Access Code</label>
                    <a href="#" className="text-xs text-primary hover:text-primary-hover transition-colors">Forgot code?</a>
                  </div>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-12 pl-10 pr-4 bg-[#05070A] border border-surface-3 rounded-lg text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-mono tracking-widest" 
                      placeholder="••••••••" 
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm text-center">
                    {error}
                  </div>
                )}

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full group bg-primary text-black hover:bg-primary-hover font-bold shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      Authenticating...
                    </span>
                  ) : (
                    <>
                      Authorize Access
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>
            </Card>

            <p className="text-center text-sm text-text-secondary mt-8">
              Clinic not registered? <Link to="/clinics/apply" className="text-primary hover:text-primary-hover font-medium transition-colors">Apply for Network Access</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
