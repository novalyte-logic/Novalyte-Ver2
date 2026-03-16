import React, { createContext, useContext, useEffect, useState } from 'react';
import { normalizeAppRole } from '../../../shared/authRoles';
import { auth, supabase } from '../../firebase';
import type { AuthUser } from '../supabase/client';

interface AuthContextType {
  user: AuthUser | null;
  role: string | null;
  loading: boolean;
  isAdminUser: boolean;
  requestEmailAccessCode: (email: string) => Promise<void>;
  verifyEmailAccessCode: (email: string, code: string) => Promise<void>;
  signInWithLinkedIn: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
  isAdminUser: false,
  requestEmailAccessCode: async () => {},
  verifyEmailAccessCode: async () => {},
  signInWithLinkedIn: async () => {},
  signInWithGoogle: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

async function fetchAuthenticatedSession(currentUser: AuthUser | null) {
  if (!currentUser) {
    return null;
  }

  const token = await currentUser.getIdToken();
  const response = await fetch('/api/auth/session', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    let message = 'Unable to validate your session.';
    try {
      const payload = (await response.json()) as { error?: string };
      if (payload.error) {
        message = payload.error;
      }
    } catch {
      // Ignore malformed error payloads.
    }

    throw new Error(message);
  }

  const payload = (await response.json()) as {
    role?: string | null;
  };

  return normalizeAppRole(payload.role) || 'patient';
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(auth.currentUser);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const syncAuthState = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!isMounted) {
          return;
        }

        setUser(currentUser);
        const nextRole = await fetchAuthenticatedSession(currentUser);
        if (isMounted) {
          setRole(nextRole);
        }
      } catch (error) {
        console.error('Error syncing auth state:', error);
        if (isMounted) {
          setRole(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void auth.getSession().then(() => syncAuthState());

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void syncAuthState();
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signInWithOAuthProvider = async (provider: 'google' | 'linkedin_oidc') => {
    const redirectTo = typeof window !== 'undefined' ? window.location.href : undefined;
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
      },
    });

    if (error) {
      throw error;
    }
  };

  const requestEmailAccessCode = async (email: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const { error } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
      options: {
        shouldCreateUser: true,
      },
    });

    if (error) {
      throw error;
    }
  };

  const verifyEmailAccessCode = async (email: string, code: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const token = code.replace(/\D/g, '').slice(0, 6);
    const { error } = await supabase.auth.verifyOtp({
      email: normalizedEmail,
      token,
      type: 'email',
    });

    if (error) {
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    await signInWithOAuthProvider('google');
  };

  const signInWithLinkedIn = async () => {
    await signInWithOAuthProvider('linkedin_oidc');
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        isAdminUser: role === 'admin' || role === 'system_admin',
        requestEmailAccessCode,
        verifyEmailAccessCode,
        signInWithLinkedIn,
        signInWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
