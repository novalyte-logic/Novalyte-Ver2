import React from 'react';
import { ArrowRight, Chrome, KeyRound, Linkedin, Mail, RefreshCw } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';
import { useAuth } from '@/src/lib/auth/AuthContext';

type AuthProviderOption = 'google' | 'linkedin';

type AccessCodeAuthProps = {
  emailLabel?: string;
  emailPlaceholder?: string;
  modeLabel: string;
  helperText: string;
  providers?: AuthProviderOption[];
  onError?: (message: string) => void;
};

function formatAuthError(error: unknown) {
  const message =
    typeof error === 'object' && error && 'message' in error ? String(error.message) : '';
  const normalized = message.toLowerCase();

  if (normalized.includes('rate limit')) {
    return 'Too many authentication attempts. Wait a moment, then request another code.';
  }
  if (normalized.includes('invalid login credentials') || normalized.includes('token')) {
    return 'The access code is invalid or expired. Request a new code and try again.';
  }
  if (normalized.includes('redirect')) {
    return 'OAuth redirect URLs are not configured for this environment.';
  }
  if (normalized.includes('provider is not enabled')) {
    return 'This social sign-in provider is not configured in Supabase Auth for this environment.';
  }

  return message || 'Authentication failed. Please try again.';
}

export function AccessCodeAuth({
  emailLabel = 'Email address',
  emailPlaceholder = 'you@company.com',
  modeLabel,
  helperText,
  providers = ['google', 'linkedin'],
  onError,
}: AccessCodeAuthProps) {
  const { requestEmailAccessCode, verifyEmailAccessCode, signInWithGoogle, signInWithLinkedIn } = useAuth();
  const [email, setEmail] = React.useState('');
  const [code, setCode] = React.useState('');
  const [codeSent, setCodeSent] = React.useState(false);
  const [busyAction, setBusyAction] = React.useState<'code' | 'verify' | 'google' | 'linkedin' | null>(null);
  const [localError, setLocalError] = React.useState('');
  const [notice, setNotice] = React.useState('');
  const [cooldownRemaining, setCooldownRemaining] = React.useState(0);

  React.useEffect(() => {
    if (cooldownRemaining <= 0) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setCooldownRemaining((current) => Math.max(0, current - 1));
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [cooldownRemaining]);

  const surfaceError = (message: string) => {
    setLocalError(message);
    if (onError) {
      onError(message);
    }
  };

  const clearMessages = () => {
    setLocalError('');
    setNotice('');
    if (onError) {
      onError('');
    }
  };

  const handleRequestCode = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      surfaceError('Enter a valid email address to continue.');
      return;
    }

    try {
      clearMessages();
      setBusyAction('code');
      await requestEmailAccessCode(normalizedEmail);
      setCodeSent(true);
      setCode('');
      setCooldownRemaining(30);
      setNotice(`We sent a 6-digit access code to ${normalizedEmail}.`);
    } catch (error) {
      surfaceError(formatAuthError(error));
    } finally {
      setBusyAction(null);
    }
  };

  const handleVerifyCode = async () => {
    if (code.replace(/\D/g, '').length !== 6) {
      surfaceError('Enter the full 6-digit access code.');
      return;
    }

    try {
      clearMessages();
      setBusyAction('verify');
      await verifyEmailAccessCode(email, code);
      setNotice('Access confirmed. Finalizing your session...');
    } catch (error) {
      surfaceError(formatAuthError(error));
    } finally {
      setBusyAction(null);
    }
  };

  const handleProviderSignIn = async (provider: AuthProviderOption) => {
    try {
      clearMessages();
      setBusyAction(provider);
      if (provider === 'linkedin') {
        await signInWithLinkedIn();
      } else {
        await signInWithGoogle();
      }
    } catch (error) {
      surfaceError(formatAuthError(error));
      setBusyAction(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-surface-3 bg-[#05070A]/70 p-5">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
            <Mail className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">{modeLabel}</p>
            <p className="mt-1 text-sm text-text-secondary">{helperText}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-secondary">{emailLabel}</label>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={emailPlaceholder}
            disabled={busyAction !== null}
            className="w-full rounded-xl border border-surface-3 bg-[#05070A] px-4 py-3 text-white focus:border-primary focus:outline-none"
          />
        </div>

        {codeSent ? (
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">6-digit access code</label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={code}
                  onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  disabled={busyAction !== null}
                  className="w-full rounded-xl border border-surface-3 bg-[#05070A] py-3 pl-11 pr-4 text-white tracking-[0.4em] focus:border-primary focus:outline-none"
                />
              </div>
              <Button
                type="button"
                className="shrink-0 font-semibold"
                disabled={busyAction !== null || cooldownRemaining > 0}
                onClick={handleRequestCode}
              >
                {busyAction === 'code' ? 'Sending...' : cooldownRemaining > 0 ? `Resend ${cooldownRemaining}s` : 'Resend'}
              </Button>
            </div>
          </div>
        ) : null}

        {localError ? (
          <div className="rounded-xl border border-danger/25 bg-danger/10 px-4 py-3 text-sm text-danger">
            {localError}
          </div>
        ) : null}

        {notice ? (
          <div className="rounded-xl border border-success/25 bg-success/10 px-4 py-3 text-sm text-success">
            {notice}
          </div>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            type="button"
            size="lg"
            className="font-semibold"
            onClick={codeSent ? handleVerifyCode : handleRequestCode}
            disabled={busyAction !== null}
          >
            {busyAction === 'verify'
              ? 'Verifying...'
              : busyAction === 'code'
                ? 'Sending code...'
                : codeSent
                  ? 'Verify Access Code'
                  : 'Email Me a Code'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          {codeSent ? (
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="border-surface-3 text-white hover:bg-surface-2"
              disabled={busyAction !== null}
              onClick={() => {
                setCodeSent(false);
                setCode('');
                clearMessages();
              }}
            >
              Change Email
            </Button>
          ) : null}
        </div>
      </div>

      {providers.length > 0 ? (
        <>
          <div className="flex items-center gap-3 py-1">
            <div className="h-px flex-1 bg-surface-3" />
            <span className="text-xs font-medium tracking-[0.24em] text-text-secondary">Or continue with</span>
            <div className="h-px flex-1 bg-surface-3" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {providers.includes('google') ? (
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="border-surface-3 text-white hover:bg-surface-2"
                disabled={busyAction !== null}
                onClick={() => handleProviderSignIn('google')}
              >
                {busyAction === 'google' ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Opening Google...
                  </>
                ) : (
                  <>
                    <Chrome className="mr-2 h-4 w-4" />
                    Continue with Google
                  </>
                )}
              </Button>
            ) : null}
            {providers.includes('linkedin') ? (
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="border-surface-3 text-white hover:bg-surface-2"
                disabled={busyAction !== null}
                onClick={() => handleProviderSignIn('linkedin')}
              >
                {busyAction === 'linkedin' ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Opening LinkedIn...
                  </>
                ) : (
                  <>
                    <Linkedin className="mr-2 h-4 w-4" />
                    Continue with LinkedIn
                  </>
                )}
              </Button>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  );
}
