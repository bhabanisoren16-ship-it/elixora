import { createClient } from '@supabase/supabase-js';

// Live Supabase configuration for Elixora 2.0
const LIVE_SUPABASE_URL = 'https://wpipjvudqumqwltrtrct.supabase.co';
const LIVE_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwaXBqdnVkcXVtcXdsdHJ0cmN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI0NzI4NTgsImV4cCI6MjEwODA0ODg1OH0.4MoZiaJIdXfMm48FTWawQ2T7m0UNri0WB4dPNILBZbM';
const LIVE_SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwaXBqdnVkcXVtcXdsdHJ0cmN0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MjQ3Mjg1OCwiZXhwIjoyMTA4MDQ4ODU4fQ.x0a1qmSfzDC_KTBSdRf9kmauTSUkwcFIUWnlzMEKWi8';

const envUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL);
const envKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY);
const envServiceKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_SERVICE_ROLE_KEY) || (typeof process !== 'undefined' && (process.env?.SUPABASE_SERVICE_ROLE_KEY || process.env?.VITE_SUPABASE_SERVICE_ROLE_KEY));

const supabaseUrl = envUrl || LIVE_SUPABASE_URL;
const supabaseAnonKey = envKey || LIVE_SUPABASE_ANON_KEY;
const supabaseServiceKey = envServiceKey || LIVE_SUPABASE_SERVICE_ROLE_KEY;

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

export const supabaseAdmin = (isSupabaseConfigured() && supabaseServiceKey)
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;

if (isSupabaseConfigured()) {
  console.info('[ELIXORA Cloud] Supabase database connected successfully (https://wpipjvudqumqwltrtrct.supabase.co)');
}
