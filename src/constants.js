import {
  javascript,
  html,
  css,
  reactjs,
  tailwind,
  nodejs,
  git,
  docker,
  threejs,
  csharp,
  vb,
  blazor,
  sqlserver,
  bifarma,
  digitalent,
  codeid,
  realta,
  hargaemas,
  carisurah,
  cariin,
  bookingin,
  bookshelf,
  kubernetes,
  expres,
  postgres,
  pyhton
} from "./components/Assets";

const technologies = [
  {
    name: "HTML 5",
    icon: html,
  },
  {
    name: "CSS 3",
    icon: css,
  },
  {
    name: "JavaScript",
    icon: javascript,
  },
  {
    name: "C#",
    icon: csharp,
  },
  {
    name: "React JS",
    icon: reactjs,
  },
  {
    name: "VB",
    icon: vb,
  },
  {
    name: "Tailwind CSS",
    icon: tailwind,
  },
  {
    name: "Node JS",
    icon: nodejs,
  },
  {
    name: "Blazor",
    icon: blazor,
  },
  {
    name: "Three JS",
    icon: threejs,
  },
  {
    name: "git",
    icon: git,
  },
  {
    name: "SQL Server",
    icon: sqlserver,
  },
  {
    name: "Docker",
    icon: docker,
  },
  {
    name: "kubernetes",
    icon: kubernetes,
  },
  {
    name: "Express",
    icon: expres,
  },
  {
    name: "Postgres",
    icon: postgres,
  },
  {
    name: "Pyhton",
    icon: pyhton,
  },
];

const experiences = [
  {
    title: "Software Developer",
    company_name: "PT.Realta Chakradharma",
    icon: realta,
    iconBg: "#ffffff",
    date: "May 2023 - Present",
    points: [
      "Developing enterprise software solutions with C#, .NET Core, and SQL Server.",
      "Building responsive front-end applications using Blazor and WASM.",
      "Utilizing Docker and Kubernetes for containerization and orchestration.",
      "Collaborating with teams to integrate cutting-edge technology.",
    ],
  },
  {
    title: "Fullstack Developer",
    company_name: "Code Academy",
    icon: codeid,
    iconBg: "#ffffff",
    date: "Nov 2022 - Apr 2023",
    points: [
      "Developed and maintained the master module of the Hotel Realta project.",
      "Collaborated with cross-functional teams for seamless integration.",
      "Implemented backend functionality with C# and SQL Server.",
      "Created responsive front-end interfaces using Blazor.",
    ],
  },
  {
    title: "Machine Learning Developer",
    company_name:
      "Student of Fresh Graduate Academy - Digital Talent Scholarship",
    icon: digitalent,
    iconBg: "#ffffff",
    date: "Oct 2022 - Dec 2022",
    points: [
      "Developed skills in Python programming and machine learning.",
      "Worked on image classification using CNNs.",
      "Designed NLP models with TensorFlow for real-world applications.",
    ],
  },
  {
    title: "Graphic Designer",
    company_name: "PT.Bifarma Adiluhung (Kalbe)",
    icon: bifarma,
    iconBg: "#ffffff",
    date: "Aug 2021 - Jan 2022",
    points: [
      "Design posters, banners, and flyers for social media.",
      "Edit videos for product branding.",
      "Responsible for UI/UX design of the genme.id website.",
    ],
  },
];

const projects = [
  {
    name: "Kalkulator Harga Emas",
    description:
      "provides real-time updates on the latest gold prices, reflecting changes in both USD and IDR. Additionally, it features a calculator to easily determine the price of gold per gram, offering a convenient tool for anyone interested in staying informed about gold market trends.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "expressjs",
        color: "green-text-gradient",
      },
      {
        name: "mui",
        color: "pink-text-gradient",
      },
    ],
    image: hargaemas,
    source_code_link: "https://github.com/aliefkurnia/harga-emas",
    website_link: "https://harga-emas.vercel.app/",
  },
  {
    name: "Cari Surah",
    description:
      "This Website have a feature to search for specific Surahs in the Quran, along with a play feature that allows users to listen to the recitation of each Surah. This tool is designed to make it easier for users to explore and engage with the Quranic text.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "axios",
        color: "green-text-gradient",
      },
      {
        name: "restapi",
        color: "pink-text-gradient",
      },
    ],
    image: carisurah,
    source_code_link: "https://github.com/aliefkurnia/cari-surah",
    website_link: "https://cari-surah.vercel.app/",
  },
  {
    name: "Cariin",
    description:
      "A web application for searching movies, providing detailed descriptions and ratings for each title.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "axios",
        color: "green-text-gradient",
      },
      {
        name: "restapi",
        color: "pink-text-gradient",
      },
    ],
    image: cariin,
    source_code_link: "https://github.com/aliefkurnia/Cariin-Film-Finder",
    website_link: "https://cariin-film.vercel.app/",
  },
  {
    name: "Bookingin",
    description:
      "A web application for searching hotels, providing detailed descriptions and ratings for each property.",
    tags: [
      {
        name: "javascript",
        color: "blue-text-gradient",
      },
      {
        name: "dom",
        color: "green-text-gradient",
      },
      {
        name: "html",
        color: "pink-text-gradient",
      },
      {
        name: "css",
        color: "pink-text-gradient",
      },
    ],
    image: bookingin,
    source_code_link:
      "https://github.com/aliefkurnia/submission-tugas-akhir-membuat-website",
    website_link: "https://bookingin.vercel.app/",
  },
  {
    name: "Bookshelf App",
    description:
      "A web application for managing your book collection, with features for adding, editing, searching, and categorizing books. Supports local storage for data persistence.",
    tags: [
      {
        name: "javascript",
        color: "blue-text-gradient",
      },
      {
        name: "local storage",
        color: "green-text-gradient",
      },
      {
        name: "html",
        color: "pink-text-gradient",
      },
      {
        name: "css",
        color: "pink-text-gradient",
      },
    ],
    image: bookshelf,
    source_code_link:
      "https://github.com/aliefkurnia/submission-membangun-bookshelf-app",
    website_link: "https://bookshelfalief.vercel.app/",
  },
];

export { technologies, experiences, projects };
