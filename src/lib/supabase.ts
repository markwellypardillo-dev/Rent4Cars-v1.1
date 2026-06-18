import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Use placeholders to prevent the "supabaseUrl is required" error 
// if the user hasn't set their secrets yet.
let url = (supabaseUrl || '').trim() || 'https://placeholder.supabase.co';

// CRITICAL: Clean up URL from common copy-paste errors
url = url.replace(/\s/g, ''); 
url = url.replace(/\.+$/, ''); 
if (url.includes('/rest/v1')) {
  url = url.split('/rest/v1')[0];
}
url = url.replace(/\/$/, '');

// Detect dummy values from .env.example
if (url.includes('your-project-id') || url.includes('placeholder')) {
  url = 'https://placeholder.supabase.co'; // normalize dummy
}

const key = (supabaseAnonKey || '').trim() || 'placeholder-key';

if (url === 'https://placeholder.supabase.co') {
  console.warn("Supabase credentials missing or invalid! Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Settings.");
}

export const supabase = createClient(url, key, {
  auth: {
    persistSession: true,
    storage: window.sessionStorage,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
