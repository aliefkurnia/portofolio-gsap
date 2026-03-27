import {
  // TECH
  csharp,
  blazor,
  dotnet,
  kendo,
  telerik,
  sqlserver,
  postgres,
  redis,
  swagger,
  postman,
  docker,
  kubernetes,
  azure,
  git,
  talend,

  // COMPANY
  pertamina,
  realta,
  codeid,
  digitalent,
  bifarma,

  // PROJECT
  hargaemas,
  carisurah,
  cariin,
  bookingin,
  bookshelf,
} from "./components/Assets";

const technologies = [
  // CORE STACK
  { name: "C#", icon: csharp },
  { name: ".NET Core", icon: dotnet },
  { name: "Blazor", icon: blazor },

  // UI FRAMEWORK
  { name: "Kendo UI", icon: kendo },
  { name: "Telerik", icon: telerik },

  // DATABASE
  { name: "SQL Server", icon: sqlserver },
  { name: "PostgreSQL", icon: postgres },
  { name: "Redis", icon: redis },

  // API & TOOLS
  { name: "Swagger", icon: swagger },
  { name: "Postman", icon: postman },

  // DEVOPS
  { name: "Docker", icon: docker },
  { name: "Kubernetes", icon: kubernetes },
  { name: "Azure DevOps", icon: azure },
  { name: "Git", icon: git },

  // DATA PROCESSING
  { name: "Talend ETL", icon: talend },
];

const experiences = [
  {
    title: "Software Developer (Support Operation)",
    company_name: "PT. Pertamina Hulu Energi",
    icon: pertamina,
    iconBg: "#ffffff",
    date: "May 2025 - Present",
    points: [
      "Maintaining and supporting production systems, including bug fixing and performance optimization.",
      "Conducting issue tracing up to ETL processes using Talend.",
      "Managing CI/CD pipelines and deployments using Azure DevSecOps.",
      "Ensuring SLA compliance with fast resolution time for production issues.",
      "Collaborating with cross-functional teams to improve system reliability.",
    ],
  },
  {
    title: "Software Developer",
    company_name: "PT. Realta Chakradharma",
    icon: realta,
    iconBg: "#ffffff",
    date: "May 2023 - Apr 2025",
    points: [
      "Developed BIMASAKTI11, a property management web app for apartments and malls.",
      "Built reporting, transaction, and batch processing features.",
      "Implemented MVVM architecture with C#, .NET Core, and Blazor WASM.",
      "Utilized Redis Cache, SQL Server, and ADO.NET for performance optimization.",
      "Deployed applications using Docker, Kubernetes, Helmfile, and IIS.",
    ],
  },
  {
    title: ".NET Developer",
    company_name: "PT. Code Development Indonesia",
    icon: codeid,
    iconBg: "#ffffff",
    date: "Nov 2022 - Apr 2023",
    points: [
      "Developed the master module for Hotel Realta project.",
      "Ensured integration between multiple modules for system consistency.",
      "Implemented MVC architecture with C#, SQL Server, and Entity Framework.",
      "Built responsive UI using Blazor and Bootstrap.",
      "Managed version control and collaboration using GitHub.",
    ],
  },
  {
    title: "Machine Learning Developer",
    company_name: "Digital Talent Scholarship (Kominfo)",
    icon: digitalent,
    iconBg: "#ffffff",
    date: "Oct 2022 - Dec 2022",
    points: [
      "Developed machine learning models using Python and TensorFlow.",
      "Built image classification models using CNN.",
      "Designed NLP solutions for real-world use cases.",
    ],
  },
  {
    title: "Graphic Designer",
    company_name: "PT. Bifarma Adiluhung (Kalbe)",
    icon: bifarma,
    iconBg: "#ffffff",
    date: "Aug 2021 - Jan 2022",
    points: [
      "Designed marketing materials such as posters, banners, and flyers.",
      "Edited videos for product branding and promotion.",
      "Handled UI/UX design for Genme.id website.",
    ],
  },
];

const projects = [
  {
    name: "Kalkulator Harga Emas",
    description:
      "Provides real-time updates on gold prices in USD and IDR, with a calculator for price per gram.",
    tags: [
      { name: "react", color: "blue-text-gradient" },
      { name: "expressjs", color: "green-text-gradient" },
      { name: "mui", color: "pink-text-gradient" },
    ],
    image: hargaemas,
    source_code_link: "https://github.com/aliefkurnia/harga-emas",
    website_link: "https://harga-emas.vercel.app/",
  },
  {
    name: "Cari Surah",
    description:
      "Search and listen to Quran surahs with integrated audio playback.",
    tags: [
      { name: "react", color: "blue-text-gradient" },
      { name: "axios", color: "green-text-gradient" },
      { name: "restapi", color: "pink-text-gradient" },
    ],
    image: carisurah,
    source_code_link: "https://github.com/aliefkurnia/cari-surah",
    website_link: "https://cari-surah.vercel.app/",
  },
  {
    name: "Cariin",
    description: "Movie search app with detailed descriptions and ratings.",
    tags: [
      { name: "react", color: "blue-text-gradient" },
      { name: "axios", color: "green-text-gradient" },
      { name: "restapi", color: "pink-text-gradient" },
    ],
    image: cariin,
    source_code_link: "https://github.com/aliefkurnia/Cariin-Film-Finder",
    website_link: "https://cariin-film.vercel.app/",
  },
  {
    name: "Bookingin",
    description: "Hotel search web app with property details and ratings.",
    tags: [
      { name: "javascript", color: "blue-text-gradient" },
      { name: "dom", color: "green-text-gradient" },
      { name: "html", color: "pink-text-gradient" },
      { name: "css", color: "pink-text-gradient" },
    ],
    image: bookingin,
    source_code_link:
      "https://github.com/aliefkurnia/submission-tugas-akhir-membuat-website",
    website_link: "https://bookingin.vercel.app/",
  },
  {
    name: "Bookshelf App",
    description:
      "Manage book collection with add, edit, search, and local storage.",
    tags: [
      { name: "javascript", color: "blue-text-gradient" },
      { name: "local storage", color: "green-text-gradient" },
      { name: "html", color: "pink-text-gradient" },
      { name: "css", color: "pink-text-gradient" },
    ],
    image: bookshelf,
    source_code_link:
      "https://github.com/aliefkurnia/submission-membangun-bookshelf-app",
    website_link: "https://bookshelfalief.vercel.app/",
  },
];

export { technologies, experiences, projects };
