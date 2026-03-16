import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/src/lib/auth/AuthContext';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { AccessCodeAuth } from '@/src/components/auth/AccessCodeAuth';
import { Activity, ChevronLeft, ShieldCheck, UserCircle } from 'lucide-react';

export function ClinicLogin() {
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    if (role === 'clinic' || role === 'clinic_admin') {
      navigate('/dashboard');
    }
  }, [navigate, role]);

  useEffect(() => {
    if (user && role && role !== 'clinic' && role !== 'clinic_admin') {
      setError('This account is not provisioned for clinic workspace access.');
    }
  }, [role, user]);

  return (
    <div className="min-h-screen bg-[#05070A] flex flex-col lg:flex-row">
      <div className="hidden lg:flex lg:w-1/2 bg-[#0B0F14] border-r border-surface-3 relative overflow-hidden flex-col justify-between p-12">
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
            Clinic Operations <br />
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
                <span>Auth Method</span>
                <span className="text-white">Email Access Code + OAuth</span>
              </div>
            </div>
          </div>
        </div>
      </div>

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
              <p className="text-text-secondary">Email access codes are now the primary clinic sign-in path, with Google and LinkedIn available as secondary options.</p>
            </div>

            <Card className="p-8 bg-[#101720] border-surface-3 shadow-2xl">
              <div className="space-y-6">
                <div className="rounded-2xl border border-surface-3 bg-[#05070A]/70 p-5">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
                      <UserCircle className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Approved clinic operators only</p>
                      <p className="mt-1 text-sm text-text-secondary">
                        Use the email address tied to your clinic workspace to receive a 6-digit access code, or continue with your configured Google or LinkedIn identity.
                      </p>
                    </div>
                  </div>
                </div>

                {error ? (
                  <div className="rounded-lg border border-danger/20 bg-danger/10 p-3 text-center text-sm text-danger">
                    {error}
                  </div>
                ) : null}

                {user && role && role !== 'clinic' && role !== 'clinic_admin' ? (
                  <Button
                    type="button"
                    size="lg"
                    className="w-full font-semibold"
                    onClick={() => logout()}
                  >
                    Switch Account
                  </Button>
                ) : (
                  <AccessCodeAuth
                    modeLabel="Clinic workspace access"
                    helperText="Request a secure access code or continue with a configured provider. Clinic sessions are role-validated on the server after sign-in."
                    providers={['google', 'linkedin']}
                  />
                )}
              </div>
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
