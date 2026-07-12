const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

const supabaseUrl = 'https://idgqcdvzracfvmznjwzm.supabase.co';
const supabaseKey = 'sb_publishable__TarIweUo9C1vSn6kyI3uQ_yTqfDa7W';
const supabase = createClient(supabaseUrl, supabaseKey, {
  realtime: { transport: WebSocket },
  auth: { persistSession: false },
});

const ASSETS_DIR = path.join(__dirname, 'src', 'components', 'Assets');
const BUCKET = 'portfolio-assets';

async function uploadFile(filePath, storagePath) {
  const file = fs.readFileSync(filePath);
  const ext = path.extname(filePath).slice(1);
  const mimeMap = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', svg: 'image/svg+xml', webp: 'image/webp' };
  const contentType = mimeMap[ext] || 'application/octet-stream';

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

async function createBucket() {
  console.log('Creating storage bucket...');
  const { error } = await supabase.storage.createBucket(BUCKET, { public: true });
  if (error && !error.message.includes('already exists')) {
    console.error('Bucket error:', error.message);
  } else {
    console.log('  Bucket ready.');
  }
}

async function seedTechnologies() {
  console.log('\nSeeding technologies...');

  const techData = [
    { name: 'C#', file: 'tech/csharp.png' },
    { name: '.NET Core', file: 'tech/dotnet.png' },
    { name: 'Blazor', file: 'tech/blazor.png' },
    { name: 'Kendo UI', file: 'tech/kendo.png' },
    { name: 'Telerik', file: 'tech/telerik.png' },
    { name: 'SQL Server', file: 'tech/sqlserver.png' },
    { name: 'PostgreSQL', file: 'tech/postgres.png' },
    { name: 'Redis', file: 'tech/redis.png' },
    { name: 'Swagger', file: 'tech/swagger.png' },
    { name: 'Postman', file: 'tech/postman.png' },
    { name: 'Docker', file: 'tech/docker.png' },
    { name: 'Kubernetes', file: 'tech/kubernetes.png' },
    { name: 'Azure DevOps', file: 'tech/azure.png' },
    { name: 'Git', file: 'tech/git.png' },
    { name: 'Talend ETL', file: 'tech/talend.png' },
  ];

  for (let i = 0; i < techData.length; i++) {
    const t = techData[i];
    const filePath = path.join(ASSETS_DIR, t.file);
    if (!fs.existsSync(filePath)) {
      console.error(`  File not found: ${filePath}`);
      continue;
    }
    const iconUrl = await uploadFile(filePath, `tech/${path.basename(t.file)}`);
    if (!iconUrl) continue;

    const { error } = await supabase.from('technologies').insert({
      name: t.name,
      icon_url: iconUrl,
      sort_order: i,
    });
    if (error) console.error(`  Insert error (${t.name}):`, error.message);
    else console.log(`  ✓ ${t.name}`);
  }
}

async function seedExperiences() {
  console.log('\nSeeding experiences...');

  const expData = [
    {
      title: 'Software Developer (Support Operation)',
      company_name: 'PT. Pertamina Hulu Energi',
      file: 'company/pertamina.png',
      icon_bg: '#ffffff',
      date_range: 'May 2025 - Present',
      points: [
        'Maintaining and supporting production systems, including bug fixing and performance optimization.',
        'Conducting issue tracing up to ETL processes using Talend.',
        'Managing CI/CD pipelines and deployments using Azure DevSecOps.',
        'Ensuring SLA compliance with fast resolution time for production issues.',
        'Collaborating with cross-functional teams to improve system reliability.',
      ],
    },
    {
      title: 'Software Developer',
      company_name: 'PT. Realta Chakradharma',
      file: 'company/realta.png',
      icon_bg: '#ffffff',
      date_range: 'May 2023 - Apr 2025',
      points: [
        'Developed BIMASAKTI11, a property management web app for apartments and malls.',
        'Built reporting, transaction, and batch processing features.',
        'Implemented MVVM architecture with C#, .NET Core, and Blazor WASM.',
        'Utilized Redis Cache, SQL Server, and ADO.NET for performance optimization.',
        'Deployed applications using Docker, Kubernetes, Helmfile, and IIS.',
      ],
    },
    {
      title: '.NET Developer',
      company_name: 'PT. Code Development Indonesia',
      file: 'company/codeid.png',
      icon_bg: '#ffffff',
      date_range: 'Nov 2022 - Apr 2023',
      points: [
        'Developed the master module for Hotel Realta project.',
        'Ensured integration between multiple modules for system consistency.',
        'Implemented MVC architecture with C#, SQL Server, and Entity Framework.',
        'Built responsive UI using Blazor and Bootstrap.',
        'Managed version control and collaboration using GitHub.',
      ],
    },
    {
      title: 'Machine Learning Developer',
      company_name: 'Digital Talent Scholarship (Kominfo)',
      file: 'company/digitalent.png',
      icon_bg: '#ffffff',
      date_range: 'Oct 2022 - Dec 2022',
      points: [
        'Developed machine learning models using Python and TensorFlow.',
        'Built image classification models using CNN.',
        'Designed NLP solutions for real-world use cases.',
      ],
    },
    {
      title: 'Graphic Designer',
      company_name: 'PT. Bifarma Adiluhung (Kalbe)',
      file: 'company/bifarma.png',
      icon_bg: '#ffffff',
      date_range: 'Aug 2021 - Jan 2022',
      points: [
        'Designed marketing materials such as posters, banners, and flyers.',
        'Edited videos for product branding and promotion.',
        'Handled UI/UX design for Genme.id website.',
      ],
    },
  ];

  for (let i = 0; i < expData.length; i++) {
    const exp = expData[i];
    const filePath = path.join(ASSETS_DIR, exp.file);
    if (!fs.existsSync(filePath)) {
      console.error(`  File not found: ${filePath}`);
      continue;
    }
    const iconUrl = await uploadFile(filePath, `company/${path.basename(exp.file)}`);
    if (!iconUrl) continue;

    const { error } = await supabase.from('experiences').insert({
      title: exp.title,
      company_name: exp.company_name,
      icon_url: iconUrl,
      icon_bg: exp.icon_bg,
      date_range: exp.date_range,
      points: exp.points,
      sort_order: i,
    });
    if (error) console.error(`  Insert error (${exp.company_name}):`, error.message);
    else console.log(`  ✓ ${exp.company_name}`);
  }
}

async function seedProjects() {
  console.log('\nSeeding projects...');

  const projData = [
    {
      name: 'Kalkulator Harga Emas',
      description: 'Provides real-time updates on gold prices in USD and IDR, with a calculator for price per gram.',
      file: 'hargaemas.png',
      tags: [
        { name: 'react', color: 'blue-text-gradient' },
        { name: 'expressjs', color: 'green-text-gradient' },
        { name: 'mui', color: 'pink-text-gradient' },
      ],
      source_code_link: 'https://github.com/aliefkurnia/harga-emas',
      website_link: 'https://harga-emas.vercel.app/',
    },
    {
      name: 'Cari Surah',
      description: 'Search and listen to Quran surahs with integrated audio playback.',
      file: 'carisurah.png',
      tags: [
        { name: 'react', color: 'blue-text-gradient' },
        { name: 'axios', color: 'green-text-gradient' },
        { name: 'restapi', color: 'pink-text-gradient' },
      ],
      source_code_link: 'https://github.com/aliefkurnia/cari-surah',
      website_link: 'https://cari-surah.vercel.app/',
    },
    {
      name: 'Cariin',
      description: 'Movie search app with detailed descriptions and ratings.',
      file: 'cariin.png',
      tags: [
        { name: 'react', color: 'blue-text-gradient' },
        { name: 'axios', color: 'green-text-gradient' },
        { name: 'restapi', color: 'pink-text-gradient' },
      ],
      source_code_link: 'https://github.com/aliefkurnia/Cariin-Film-Finder',
      website_link: 'https://cariin-film.vercel.app/',
    },
    {
      name: 'Bookingin',
      description: 'Hotel search web app with property details and ratings.',
      file: 'bookingin.png',
      tags: [
        { name: 'javascript', color: 'blue-text-gradient' },
        { name: 'dom', color: 'green-text-gradient' },
        { name: 'html', color: 'pink-text-gradient' },
        { name: 'css', color: 'pink-text-gradient' },
      ],
      source_code_link: 'https://github.com/aliefkurnia/submission-tugas-akhir-membuat-website',
      website_link: 'https://bookingin.vercel.app/',
    },
    {
      name: 'Bookshelf App',
      description: 'Manage book collection with add, edit, search, and local storage.',
      file: 'bookshelf.png',
      tags: [
        { name: 'javascript', color: 'blue-text-gradient' },
        { name: 'local storage', color: 'green-text-gradient' },
        { name: 'html', color: 'pink-text-gradient' },
        { name: 'css', color: 'pink-text-gradient' },
      ],
      source_code_link: 'https://github.com/aliefkurnia/submission-membangun-bookshelf-app',
      website_link: 'https://bookshelfalief.vercel.app/',
    },
  ];

  for (let i = 0; i < projData.length; i++) {
    const proj = projData[i];
    const filePath = path.join(ASSETS_DIR, proj.file);
    if (!fs.existsSync(filePath)) {
      console.error(`  File not found: ${filePath}`);
      continue;
    }
    const imageUrl = await uploadFile(filePath, `projects/${proj.file}`);
    if (!imageUrl) continue;

    const { error } = await supabase.from('projects').insert({
      name: proj.name,
      description: proj.description,
      image_url: imageUrl,
      source_code_link: proj.source_code_link,
      website_link: proj.website_link,
      tags: proj.tags,
      sort_order: i,
    });
    if (error) console.error(`  Insert error (${proj.name}):`, error.message);
    else console.log(`  ✓ ${proj.name}`);
  }
}

async function main() {
  console.log('=== Porto-GSAP Supabase Seeder ===\n');

  await createBucket();
  await seedTechnologies();
  await seedExperiences();
  await seedProjects();

  console.log('\n=== Done! ===');
}

main().catch(console.error);
