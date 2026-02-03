import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables");
  }
  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createSupabaseClient(supabaseUrl, supabaseAnonKey)
    : null;

// Types
export interface Participant {
  id: number;
  name: string;
  email: string;
  google_dev_profile_url?: string;
  google_skills_profile_url?: string;
  created_at: string;
}

export interface Score {
  id: number;
  participant_id: number;
  google_dev_badges: number;
  google_skills_badges: number;
  social_media_posts: number;
  total_points: number;
  last_scraped?: string;
  updated_at: string;
}

export interface LeaderboardEntry {
  rank: number;
  id: number;
  name: string;
  email: string;
  google_dev_badges: number;
  google_skills_badges: number;
  social_media_posts: number;
  total_points: number;
  last_updated: string;
}

// Helper function to calculate total points
export function calculateTotalPoints(
  devBadges: number,
  skillsBadges: number,
  socialPosts: number,
): number {
  return (devBadges + skillsBadges) * 5 + socialPosts * 2;
}
