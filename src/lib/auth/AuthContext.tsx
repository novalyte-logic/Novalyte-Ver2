import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, supabase } from '../../firebase';
import type { AuthUser } from '../supabase/client';

const ADMIN_ACCESS_STORAGE_KEY = 'novalyte_admin_access';
const ADMIN_EMAIL = 'admin@novalyte.io';

function isAdminIdentity(user: AuthUser | null, role: string | null) {
  return role === 'admin' || Boolean(user?.email === ADMIN_EMAIL && user.emailVerified);
}

interface AuthContextType {
  user: AuthUser | null;
  role: string | null;
  loading: boolean;
  hasAdminAccess: boolean;
  isAdminUser: boolean;
  signInWithGoogle: () => Promise<void>;
  grantAdminAccess: () => void;
  revokeAdminAccess: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
  hasAdminAccess: false,
  isAdminUser: false,
  signInWithGoogle: async () => {},
  grantAdminAccess: () => {},
  revokeAdminAccess: () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

async function syncRoleForUser(currentUser: AuthUser | null) {
  if (!currentUser) {
    return null;
  }

  const userDocRef = doc(db, 'users', currentUser.uid);
  const userDoc = await getDoc(userDocRef);
  const nextRole = currentUser.email === ADMIN_EMAIL && currentUser.emailVerified ? 'admin' : 'patient';

  if (userDoc.exists()) {
    const userData = userDoc.data() ?? {};
    return typeof userData.role === 'string' ? userData.role : nextRole;
  }

  await setDoc(userDocRef, {
    uid: currentUser.uid,
    email: currentUser.email,
    name: currentUser.displayName || '',
    role: nextRole,
    createdAt: serverTimestamp(),
  });

  return nextRole;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(auth.currentUser);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasAdminAccess, setHasAdminAccess] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    return window.localStorage.getItem(ADMIN_ACCESS_STORAGE_KEY) === 'true';
  });

  useEffect(() => {
    let isMounted = true;

    const syncAuthState = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!isMounted) {
          return;
        }

        setUser(currentUser);
        const nextRole = await syncRoleForUser(currentUser);
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

  const signInWithGoogle = async () => {
    const redirectTo = typeof window !== 'undefined' ? window.location.href : undefined;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
      },
    });

    if (error) {
      throw error;
    }
  };

  const grantAdminAccess = () => {
    setHasAdminAccess(true);
    window.localStorage.setItem(ADMIN_ACCESS_STORAGE_KEY, 'true');
  };

  const revokeAdminAccess = () => {
    setHasAdminAccess(false);
    window.localStorage.removeItem(ADMIN_ACCESS_STORAGE_KEY);
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
        hasAdminAccess,
        isAdminUser: isAdminIdentity(user, role),
        signInWithGoogle,
        grantAdminAccess,
        revokeAdminAccess,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
