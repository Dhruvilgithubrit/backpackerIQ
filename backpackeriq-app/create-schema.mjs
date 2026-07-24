/**
 * Run this once to create the DB schema:
 * node backpackeriq-app/create-schema.mjs
 */
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://rmskrraaqbzoxifwrsrm.supabase.co'
// We need the service_role key to run DDL. Since we only have the anon key,
// we'll use Supabase's management API (direct SQL via REST).
// The anon key allows DML only. DDL requires service_role.
// 
// Instructions: Go to https://supabase.com/dashboard/project/rmskrraaqbzoxifwrsrm/settings/api
// and paste your service_role key below, then run this script.
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'PASTE_SERVICE_ROLE_KEY_HERE'

if (SERVICE_ROLE_KEY === 'PASTE_SERVICE_ROLE_KEY_HERE') {
  console.log(`
┌─────────────────────────────────────────────────────┐
│  ACTION NEEDED                                      │
│                                                     │
│  1. Go to: Supabase Dashboard > Project Settings   │
│           > API > service_role secret               │
│  2. Run:                                            │
│     SUPABASE_SERVICE_ROLE_KEY=<key> node \\          │
│       backpackeriq-app/create-schema.mjs            │
│                                                     │
│  OR paste the schema.sql manually in the            │
│  Supabase SQL Editor:                               │
│  https://supabase.com/dashboard/project/            │
│  rmskrraaqbzoxifwrsrm/sql                           │
└─────────────────────────────────────────────────────┘
`)
  process.exit(0)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

const sql = `
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

ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Anyone can read destinations" ON destinations
    FOR SELECT TO anon, authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

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

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Users own their preferences" ON user_preferences
    TO authenticated
    USING ((select auth.uid()) = user_id)
    WITH CHECK ((select auth.uid()) = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
`

const { error } = await supabase.rpc('exec_sql', { sql }).catch(() => ({ error: 'rpc not available' }))

if (error) {
  // Fallback: execute via fetch
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec`, {
    method: 'POST',
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sql }),
  })
  console.log('Response status:', res.status)
  const body = await res.text()
  console.log('Response:', body)
} else {
  console.log('✓ Schema created successfully!')
}
