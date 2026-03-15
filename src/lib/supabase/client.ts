import { createClient, type Session, type User as SupabaseUser } from '@supabase/supabase-js';

export type AuthUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  emailVerified: boolean;
  getIdToken: () => Promise<string>;
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://invalid-project.supabase.co';
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'invalid-publishable-key';

export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
);

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    autoRefreshToken: true,
    detectSessionInUrl: true,
    persistSession: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

let currentSession: Session | null = null;
let currentUser: AuthUser | null = null;

function inferDisplayName(user: SupabaseUser) {
  const metadata = user.user_metadata ?? {};
  const rawName = metadata.full_name || metadata.name || metadata.user_name;
  return typeof rawName === 'string' ? rawName : user.email ?? null;
}

function mapUser(session: Session | null): AuthUser | null {
  const user = session?.user;
  if (!user) {
    return null;
  }

  return {
    uid: user.id,
    email: user.email ?? null,
    displayName: inferDisplayName(user),
    emailVerified: Boolean(user.email_confirmed_at),
    async getIdToken() {
      const token = await getAccessToken();
      if (!token) {
        throw new Error('Supabase access token is unavailable.');
      }
      return token;
    },
  };
}

function syncSession(session: Session | null) {
  currentSession = session;
  currentUser = mapUser(session);
}

async function getAccessToken() {
  if (currentSession?.access_token) {
    return currentSession.access_token;
  }

  const { data, error } = await supabase.auth.getSession();
  if (error) {
    throw error;
  }

  syncSession(data.session);
  return data.session?.access_token ?? null;
}

export const auth = {
  get currentUser() {
    return currentUser;
  },
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      throw error;
    }
    syncSession(data.session);
    return data.session;
  },
};

void supabase.auth.getSession().then(({ data }) => {
  syncSession(data.session);
});

supabase.auth.onAuthStateChange((_event, session) => {
  syncSession(session);
});
