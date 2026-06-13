import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Client for public read access
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client for admin write access (server-side only)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
