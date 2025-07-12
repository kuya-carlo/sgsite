import { createClient } from '@supabase/supabase-js';

// Fallback to NEXT_PUBLIC_* in case SUPABASE_* is undefined
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase environment variables are not defined.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
