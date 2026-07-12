const { createClient } = require('@supabase/supabase-js');
const WebSocket = require('ws');

const supabase = createClient(
  'https://idgqcdvzracfvmznjwzm.supabase.co',
  'sb_publishable__TarIweUo9C1vSn6kyI3uQ_yTqfDa7W',
  { realtime: { transport: WebSocket }, auth: { persistSession: false } }
);

async function createTables() {
  console.log('Checking tables...');

  const { error: techErr } = await supabase.from('technologies').select('id').limit(1);
  const { error: expErr } = await supabase.from('experiences').select('id').limit(1);
  const { error: projErr } = await supabase.from('projects').select('id').limit(1);

  if (techErr) console.log('technologies table:', techErr.message);
  else console.log('  ✓ technologies table exists');

  if (expErr) console.log('experiences table:', expErr.message);
  else console.log('  ✓ experiences table exists');

  if (projErr) console.log('projects table:', projErr.message);
  else console.log('  ✓ projects table exists');

  if (techErr || expErr || projErr) {
    console.log('\nPlease run this SQL in Supabase SQL Editor (https://supabase.com/dashboard):\n');
    console.log(`
CREATE TABLE IF NOT EXISTS technologies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon_url TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  icon_url TEXT NOT NULL,
  icon_bg TEXT DEFAULT '#ffffff',
  date_range TEXT NOT NULL,
  points TEXT[] NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  source_code_link TEXT,
  website_link TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read technologies" ON technologies FOR SELECT USING (true);
CREATE POLICY "Public read experiences" ON experiences FOR SELECT USING (true);
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow all technologies" ON technologies FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all experiences" ON experiences FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all projects" ON projects FOR ALL USING (true) WITH CHECK (true);
    `);
    return false;
  }
  return true;
}

createTables();
