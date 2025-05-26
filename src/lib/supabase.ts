import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,         // Mantiene la sesión activa entre recargas
    autoRefreshToken: true,       // Refresca automáticamente el token si expira
    detectSessionInUrl: true,     // Para manejar logins OAuth
  },
});
