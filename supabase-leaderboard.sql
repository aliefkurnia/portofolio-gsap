-- Arcade leaderboard — run once in Supabase SQL Editor
-- (https://supabase.com/dashboard → your project → SQL Editor → New query)

CREATE TABLE IF NOT EXISTS game_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id TEXT NOT NULL,
  player_name TEXT NOT NULL,
  score INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Fast leaderboard lookups per game
CREATE INDEX IF NOT EXISTS game_scores_game_score_idx
  ON game_scores (game_id, score);

ALTER TABLE game_scores ENABLE ROW LEVEL SECURITY;

-- Anyone can read the leaderboard and post a score.
-- (No update/delete for the public — scores can be added but not edited.)
CREATE POLICY "Public read game_scores"
  ON game_scores FOR SELECT USING (true);

CREATE POLICY "Public insert game_scores"
  ON game_scores FOR INSERT WITH CHECK (
    char_length(player_name) BETWEEN 1 AND 24
    AND score >= 0
  );
