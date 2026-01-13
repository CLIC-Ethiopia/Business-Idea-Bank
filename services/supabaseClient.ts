
import { createClient } from '@supabase/supabase-js';

// Fallback to placeholders to prevent the app from crashing immediately if .env is not set up.
// The Supabase client throws an error if initialized with an empty string.
const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'placeholder';

if (supabaseUrl === 'https://placeholder.supabase.co') {
  console.warn('⚠️ Supabase credentials missing. App running in offline/demo mode. Check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
