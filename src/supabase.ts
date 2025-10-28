import 'dotenv/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.log(supabaseUrl, supabaseAnonKey);
  throw new Error('Missing Supabase environment variables');
}

// Global Supabase client for admin operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create an authenticated Supabase client for a specific user
// This client will respect RLS policies based on the user's JWT
export function createAuthenticatedClient(accessToken: string): SupabaseClient {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
}
