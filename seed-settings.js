const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

const supabase = createClient(
  'https://idgqcdvzracfvmznjwzm.supabase.co',
  'sb_publishable__TarIweUo9C1vSn6kyI3uQ_yTqfDa7W',
  { realtime: { transport: WebSocket }, auth: { persistSession: false } }
);

const BUCKET = 'portfolio-assets';
const ASSETS = path.join(__dirname, 'src', 'components', 'Assets');

async function uploadFile(localPath, storagePath, contentType) {
  const file = fs.readFileSync(localPath);
  const { error } = await supabase.storage.from(BUCKET).upload(storagePath, file, {
    contentType,
    upsert: true,
  });
  if (error) {
    console.error(`  Upload error (${storagePath}):`, error.message);
    return null;
  }
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  return data.publicUrl;
}

async function upsertSetting(key, value) {
  const { data } = await supabase.from('site_settings').select('id').eq('key', key).single();
  if (data) {
    await supabase.from('site_settings').update({ value }).eq('key', key);
  } else {
    await supabase.from('site_settings').insert({ key, value });
  }
}

async function main() {
  console.log('=== Seeding Settings ===\n');

  // Upload hero photo
  console.log('Uploading hero photo...');
  const heroUrl = await uploadFile(
    path.join(ASSETS, 'alief.png'),
    'hero/alief.png',
    'image/png'
  );
  if (heroUrl) {
    await upsertSetting('hero_photo_url', heroUrl);
    console.log('  ✓ Hero photo:', heroUrl);
  }

  // Upload CV ID
  console.log('Uploading CV (ID)...');
  const cvIdUrl = await uploadFile(
    path.join(ASSETS, 'Muchammad Alief Kurnia Wijaya-resume-id.pdf'),
    'cv/cv-id.pdf',
    'application/pdf'
  );
  if (cvIdUrl) {
    await upsertSetting('cv_id_url', cvIdUrl);
    console.log('  ✓ CV ID:', cvIdUrl);
  }

  // Upload CV EN
  console.log('Uploading CV (EN)...');
  const cvEnUrl = await uploadFile(
    path.join(ASSETS, 'Muchammad Alief Kurnia Wijaya-resume-en.pdf'),
    'cv/cv-en.pdf',
    'application/pdf'
  );
  if (cvEnUrl) {
    await upsertSetting('cv_en_url', cvEnUrl);
    console.log('  ✓ CV EN:', cvEnUrl);
  }

  // Marquee text
  await upsertSetting('marquee_text', 'Software Developer');
  console.log('  ✓ Marquee text: Software Developer');

  console.log('\n=== Done! ===');
}

main().catch(console.error);
