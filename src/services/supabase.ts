import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env['VITE_SUPABASE_URL'] as string;
const supabaseAnonKey = import.meta.env['VITE_SUPABASE_ANON_KEY'] as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Pandoos] Supabase env vars not set. Auth and library features will not work.\n' +
    'Copy .env.example to .env.local and fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
  );
}

/**
 * Singleton Supabase client.
 * Creating multiple clients causes connection pool exhaustion —
 * always import this instance, never call createClient again.
 */
export const supabase = createClient(
  supabaseUrl ?? 'https://placeholder.supabase.co',
  supabaseAnonKey ?? 'placeholder-key',
  {
    auth: {
      // Persist session in localStorage so users stay logged in
      // across app restarts (critical for Capacitor apps)
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
