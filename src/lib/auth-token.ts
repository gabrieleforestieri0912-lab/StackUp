import { supabase } from './supabase';

/**
 * Restituisce l'access token corrente per le chiamate autenticate.
 * Preferisce la sessione viva di Supabase (auto-rinnovata) e come
 * fallback il token persistito in localStorage.
 */
export async function getAccessToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) return session.access_token;
  } catch {
    // ignora: si ripiega sul token persistito
  }

  try {
    return localStorage.getItem('token');
  } catch {
    return null;
  }
}
