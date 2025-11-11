import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if credentials are configured
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not configured. Chat features will be disabled.');
}

// Create Supabase client (will be null if credentials not configured)
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Type definition for chat messages
export interface ChatMessage {
  id: string;
  created_at: string;
  username: string;
  message: string;
  avatar_color: string;
}
