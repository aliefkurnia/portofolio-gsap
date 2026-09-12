-- AI Tools — run once in Supabase SQL Editor
-- (https://supabase.com/dashboard → your project → SQL Editor → New query)

CREATE TABLE IF NOT EXISTS ai_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon_url TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE ai_tools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read ai_tools" ON ai_tools FOR SELECT USING (true);
CREATE POLICY "Allow all ai_tools" ON ai_tools FOR ALL USING (true) WITH CHECK (true);
