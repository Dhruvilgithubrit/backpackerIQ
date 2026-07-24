-- BackpackerIQ Phase 1 Schema
-- Run via: npx supabase db query --linked -f schema.sql

-- ─── destinations ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS destinations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  state TEXT NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  category TEXT[] DEFAULT '{}',
  season_best TEXT[] DEFAULT '{}',
  budget_range TEXT,
  image_url TEXT,
  description TEXT,
  popular_activities TEXT[] DEFAULT '{}',
  best_months TEXT,
  rating FLOAT DEFAULT 4.5,
  review_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;

-- Public read policy
DO $$ BEGIN
  CREATE POLICY "Anyone can read destinations"
    ON destinations FOR SELECT
    TO anon, authenticated
    USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ─── user_preferences ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  preferred_budget TEXT,
  favorite_activities TEXT[] DEFAULT '{}',
  travel_style TEXT,
  preferred_seasons TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Users own their preferences
DO $$ BEGIN
  CREATE POLICY "Users own their preferences"
    ON user_preferences
    TO authenticated
    USING ((select auth.uid()) = user_id)
    WITH CHECK ((select auth.uid()) = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
