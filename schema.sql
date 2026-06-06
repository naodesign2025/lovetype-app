-- lovetype-app Supabase Schema
-- Supabase ダッシュボードの SQL Editor で実行してください

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  result_type TEXT NOT NULL,   -- 'fire' | 'mystery' | 'angel' | 'devil'
  result_name TEXT NOT NULL,   -- '情熱の一途系' など
  scores JSONB NOT NULL,       -- { fire: 2, mystery: 1, angel: 1, devil: 1 }
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS results_user_id_idx ON results(user_id);
