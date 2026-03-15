import { auth, supabase } from './lib/supabase/client';
import { db } from './lib/supabase/firestore';

export const app = {
  name: 'supabase',
};

export { auth, db, supabase };
