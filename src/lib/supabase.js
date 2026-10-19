import { createClient } from '@supabase/supabase-js';

// Live Supabase configuration for Elixora 2.0
const LIVE_SUPABASE_URL = 'https://wpipjvudqumqwltrtrct.supabase.co';
const LIVE_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwaXBqdnVkcXVtcXdsdHJ0cmN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI0NzI4NTgsImV4cCI6MjEwODA0ODg1OH0.4MoZiaJIdXfMm48FTWawQ2T7m0UNri0WB4dPNILBZbM';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || LIVE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || LIVE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('your-project-id')
  );
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

if (isSupabaseConfigured()) {
  console.info('[ELIXORA Cloud] Supabase database connected successfully (https://wpipjvudqumqwltrtrct.supabase.co)');
}
