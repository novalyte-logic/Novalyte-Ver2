import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, ArrowRight, ChevronLeft, ShieldAlert, ShieldCheck, UserCircle2 } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { AccessCodeAuth } from '@/src/components/auth/AccessCodeAuth';
import { useAuth } from '@/src/lib/auth/AuthContext';

const ADMIN_HOME_PATH = '/admin/command-center';

export function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdminUser, logout } = useAuth();
  const [error, setError] = useState('');

  const targetPath = typeof location.state?.from?.pathname === 'string'
    ? location.state.from.pathname
    : ADMIN_HOME_PATH;

  useEffect(() => {
    if (isAdminUser) {
      navigate(targetPath, { replace: true });
    }
  }, [isAdminUser, navigate, targetPath]);

  useEffect(() => {
    if (user && !isAdminUser) {
      setError('This account does not have admin access.');
    }
  }, [isAdminUser, user]);

  return (
    <div className="min-h-screen bg-[#05070A] overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(53,212,255,0.18),_transparent_30%),radial-gradient(circle_at_80%_20%,_rgba(139,92,246,0.18),_transparent_28%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:28px_28px]" />

      <div className="relative min-h-screen flex flex-col lg:flex-row">
        <section className="lg:w-[54%] border-b lg:border-b-0 lg:border-r border-surface-3 bg-[#081019]/80 backdrop-blur-xl px-6 py-10 sm:px-10 lg:px-14 lg:py-14 flex flex-col justify-between">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-white transition-colors">
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Return to public site</span>
            </Link>

            <div className="mt-12 flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl border border-primary/30 bg-primary/10 flex items-center justify-center shadow-[0_0_30px_rgba(53,212,255,0.18)]">
                <Activity className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-display text-2xl font-bold tracking-tight text-white">Novalyte Admin</p>
                <p className="text-sm text-text-secondary tracking-[0.24em]">Internal control surface</p>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="mt-16 max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs tracking-[0.3em] text-primary">
                <ShieldCheck className="w-4 h-4" />
                Dedicated admin entry
              </div>
              <h1 className="mt-6 font-display text-4xl sm:text-5xl font-bold leading-tight text-white">
                Separate operator access from the clinic workspace.
              </h1>
              <p className="mt-6 max-w-xl text-base sm:text-lg text-text-secondary leading-8">
                `/admin` now routes to its own login screen. Authorized team members authenticate with an approved admin email access code first, with Google as a secondary option, before entering CRM, outreach, and launch controls.
              </p>
            </motion.div>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            <Card className="bg-[#0B1622]/90 border-primary/15 p-5">
              <p className="text-xs tracking-[0.24em] text-text-secondary">Access policy</p>
              <p className="mt-3 text-2xl font-display font-semibold text-white">Server enforced</p>
              <p className="mt-2 text-sm text-text-secondary">Protected admin routes now rely on authenticated admin identity instead of client-side access flags.</p>
            </Card>
            <Card className="bg-[#120C1C]/90 border-secondary/15 p-5">
              <p className="text-xs tracking-[0.24em] text-text-secondary">Destination</p>
              <p className="mt-3 text-2xl font-display font-semibold text-white">Command Center</p>
              <p className="mt-2 text-sm text-text-secondary">Successful login redirects to the admin console and preserves deep links like `/admin/crm`.</p>
            </Card>
          </div>
        </section>

        <section className="lg:flex-1 flex items-center justify-center px-6 py-10 sm:px-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="w-full max-w-md"
          >
            <Card className="bg-[#0E141D]/90 border-surface-3 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm tracking-[0.24em] text-text-secondary">Admin login</p>
                  <h2 className="mt-2 text-3xl font-display font-bold text-white">Authenticate admin account</h2>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <ShieldAlert className="w-7 h-7 text-primary" />
                </div>
              </div>

              <div className="mt-8 space-y-6">
                <div className="rounded-2xl border border-surface-3 bg-[#05070A]/70 p-5">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
                      {isAdminUser ? <ShieldCheck className="w-5 h-5 text-primary" /> : <UserCircle2 className="w-5 h-5 text-primary" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {user ? `Signed in as ${user.email}` : 'Approved admin account required'}
                      </p>
                      <p className="mt-1 text-sm text-text-secondary">
                        Admin routes are protected server-side. Request a 6-digit access code to your approved admin email, or use your configured Google account.
                      </p>
                    </div>
                  </div>
                </div>

                {error ? (
                  <div className="rounded-xl border border-danger/25 bg-danger/10 px-4 py-3 text-sm text-danger">
                    {error}
                  </div>
                ) : null}

                {user && !isAdminUser ? (
                  <Button
                    type="button"
                    size="lg"
                    className="w-full group font-semibold"
                    onClick={() => logout()}
                  >
                    Switch admin account
                    <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                ) : (
                  <AccessCodeAuth
                    modeLabel="Admin command center access"
                    helperText="Use the approved admin email on your allowlist to receive a secure 6-digit access code. Google remains available as a fallback provider."
                    providers={['google']}
                  />
                )}
              </div>

              <div className="mt-6 rounded-xl border border-surface-3 bg-[#05070A]/70 px-4 py-4 text-sm text-text-secondary">
                Clinic operators should use <Link to="/auth/clinic-login" className="text-primary hover:text-primary-hover">clinic login</Link> instead.
              </div>
            </Card>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
