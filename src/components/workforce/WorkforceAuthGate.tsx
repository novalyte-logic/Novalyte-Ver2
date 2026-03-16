import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/src/lib/auth/AuthContext';
import { AccessCodeAuth } from '@/src/components/auth/AccessCodeAuth';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';

interface WorkforceAuthGateProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

export function WorkforceAuthGate({
  children,
  title,
  description,
}: WorkforceAuthGateProps) {
  const { loading, user } = useAuth();
  const [error, setError] = React.useState('');

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05070A] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#05070A] px-6 py-24 flex items-center justify-center">
      <Card className="max-w-xl w-full bg-[#0B0F14] border-surface-3 p-8">
        <div className="w-14 h-14 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center mb-6">
          <Activity className="w-7 h-7 text-secondary" />
        </div>
        <h1 className="text-3xl font-display font-bold text-white mb-3">{title}</h1>
        <p className="text-text-secondary leading-7">{description}</p>

        <div className="mt-6 rounded-2xl border border-surface-3 bg-surface-2/60 p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
            <p className="text-sm text-text-secondary">
              Workforce profiles, applications, interviews, and offers are now persisted server-side. Use an email access code as the primary path, or continue with Google or LinkedIn.
            </p>
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-xl border border-danger/25 bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </div>
        ) : null}

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <AccessCodeAuth
              modeLabel="Practitioner and workforce access"
              helperText="Request a secure access code to the email tied to your profile, or continue with a configured Google or LinkedIn account."
              providers={['google', 'linkedin']}
            />
          </div>
          <Link to="/workforce" className="flex-1">
            <Button variant="outline" className="w-full border-surface-3 text-white hover:bg-surface-2">
              Back to Workforce
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
