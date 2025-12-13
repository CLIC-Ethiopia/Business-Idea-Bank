import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://jxuemlrthnfwpiissxof.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4dWVtbHJ0aG5md3BpaXNzeG9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2MDQyMjcsImV4cCI6MjA4MTE4MDIyN30.8BGGhKZdA-3VmwM6IpRHwjvYJV9zX90wpyd7SwgXTyE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);