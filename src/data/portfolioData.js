export const portfolioData = {
  profile: {
    name: "Bhavesh",
    lastName: "Patil",
    handle: "bhaveshpatil-ks",
    email: "bhaveshpatil4251@gmail.com",
    avatar: "/assets/bhavesh-profile.png",
    githubAvatar: "/assets/profile.png",
    role: "Full Stack Developer",
    bio: "Full Stack Developer building scalable, real-time web applications with modern architectures. Focused on performance, security, and production-ready systems.",
    location: "Maharashtra",
    phone: "+91 93076 01125",
    whatsapp: "+919307601125",
    sparseHandle: "@kaii",
    resume: "/assets/bhavesh-patil-resume.png",
    workType: "Freelance & Personal Projects",
    statusText: "Available For Work",
    siteUpdate: "Last updated web on 06 May 2026",
    followers: 1,
    following: 1,
  },

  heroButtons: [
    { label: "View Projects", icon: "folder", variant: "dark", action: "#projects" },
    { label: "Contact Me", icon: "arrow-up-right", variant: "light", action: "#contact" },
    { label: "Leaderboard", icon: "trophy", variant: "light", action: "#github" },
    { label: "View Education", icon: "arrow-up-right", variant: "light", action: "/education" },
    { label: "GitHub", icon: "github", variant: "light", action: "https://github.com/bhaveshpatil-ks", external: true },
  ],

  githubPinnedRepos: [
    {
      id: 1,
      name: "sanketpadhyal/Sparse",
      url: "https://github.com/bhaveshpatil-ks",
      visibility: "Public",
      description: "A minimal social media 💬 platform for mature users, focused on distraction-free interaction with basic posts, stories, chat, and a simple chronological feed. No reels, no addictive algorithms.",
      stars: 6,
      language: "JavaScript",
      languageColor: "#f1e05a",
    },
    {
      id: 2,
      name: "Mail-flow-",
      url: "https://github.com/bhaveshpatil-ks",
      visibility: "Public",
      description: "MailFlow is a modern full-stack email automation platform built with React, Node.js, Express, MongoDB, and Nodemailer. Users can manage contacts, send professional email campaigns, track history, and automate workflows.",
      stars: 0,
      language: "JavaScript",
      languageColor: "#f1e05a",
    },
    {
      id: 3,
      name: "sanketpadhyal/FacultyOne",
      url: "https://github.com/bhaveshpatil-ks",
      visibility: "Public",
      description: "A secure cloud ☁️ workspace built for educators to manage and access teaching resources across devices and classrooms using one-time session tokens.",
      stars: 0,
      language: "JavaScript",
      languageColor: "#f1e05a",
    },
    {
      id: 4,
      name: "sanketpadhyal/Odoy",
      url: "https://github.com/bhaveshpatil-ks",
      visibility: "Public",
      description: "Odoy 💬 is a modern real-time social platform with seamless chat, friend system, and AI-powered interactions — built for speed, scale, and a clean user experience.",
      stars: 0,
      language: "CSS",
      languageColor: "#563d7c",
    },
    {
      id: 5,
      name: "sanketpadhyal/Sweface",
      url: "https://github.com/bhaveshpatil-ks",
      visibility: "Public",
      description: "A full-stack face recognition attendance system for companies, featuring an Android app, live website, admin dashboard, backend API, offline attendance sync, liveness checks, and Firebase Firestore...",
      stars: 5,
      language: "JavaScript",
      languageColor: "#f1e05a",
    },
    {
      id: 6,
      name: "AI-CALL-SUMMARY-APP",
      url: "https://github.com/bhaveshpatil-ks",
      visibility: "Public",
      description: "A modern, high-performance mobile AI CRM platform that auto-syncs phone call recordings, generates AI summaries (GPT-4o / Ollama), and manages lead pipelines with 1-tap SMS.",
      stars: 1,
      language: "JavaScript",
      languageColor: "#f1e05a",
    },
  ],

  whyBhaveshCards: [
    {
      id: "built-projects",
      badgeText: "6+",
      badgeSubtitle: "FULL STACK PROJECTS",
      title: "Built Projects",
      description: "Hands-on work across full stack products, combining frontend polish, backend logic, integrations, and shipping focus.",
      type: "stat"
    },
    {
      id: "backend-engineering",
      pills: ["Full Stack Developer", "Specialized Backend Engineer"],
      title: "Backend Engineering",
      description: "Full stack foundation with deep focus on backend systems, scalability, and clean architecture.",
      type: "pills"
    },
    {
      id: "progress-track",
      timelineYears: ["2024", "2025", "2026"],
      title: "Progress You Can Track",
      description: "A steady growth curve across projects, systems, and product thinking instead of random one-off experiments.",
      type: "timeline"
    }
  ],

  skillsCategories: [
    {
      category: "Frontend",
      highlight: "Front",
      suffix: "end",
      skills: [
        { name: "HTML", icon: "html" },
        { name: "CSS", icon: "css" },
        { name: "JavaScript", icon: "javascript" },
        { name: "TypeScript", icon: "typescript" },
        { name: "Tailwind CSS", icon: "tailwind" },
        { name: "React", icon: "react" }
      ]
    },
    {
      category: "Backend",
      highlight: "Back",
      suffix: "end",
      skills: [
        { name: "Node.js", icon: "nodejs" },
        { name: "Express.js", icon: "express" },
        { name: "MongoDB", icon: "mongodb" },
        { name: "Python", icon: "python" },
        { name: "Firebase", icon: "firebase" },
        { name: "Google Cloud", icon: "gcloud" }
      ]
    },
    {
      category: "Tools & Platforms",
      highlight: "Tools & ",
      suffix: "Platforms",
      skills: [
        { name: "GitHub", icon: "github" },
        { name: "Render", icon: "render" },
        { name: "Replit", icon: "replit" },
        { name: "Netlify", icon: "netlify" },
        { name: "Vercel", icon: "vercel" },
        { name: "VS Code", icon: "vscode" },
        { name: "Canva", icon: "canva" },
        { name: "Postman", icon: "postman" }
      ]
    },
    {
      category: "AI",
      highlight: "AI",
      suffix: "",
      skills: [
        { name: "LLM", icon: "llm" },
        { name: "Codex", icon: "codex" },
        { name: "Cursor", icon: "cursor" },
        { name: "Ollama", icon: "ollama" },
        { name: "Gemini", icon: "gemini" },
        { name: "OpenAI", icon: "openai" },
        { name: "Copilot", icon: "copilot" },
        { name: "Claude", icon: "claude" },
        { name: "Hugging Face", icon: "huggingface" }
      ]
    }
  ],

  projectsBanner: {
    badge: "PROJECTS",
    titlePrefix: "Bhavesh ",
    titleSuffix: "has 6 pinned projects worth checking out.",
    description: "Explore selected builds across real-time apps, email automation, AI platforms, and production-ready web systems in one focused showcase.",
    buttonTitle: "Go To Projects",
    buttonSubtitle: "Open portfolio ↗"
  },

  projects: [
    {
      id: "sparse",
      title: "Sparse — Distraction-Free Social Media",
      repoName: "sanketpadhyal/Sparse",
      description: "A minimal social media 💬 platform for mature users, focused on distraction-free interaction with basic posts, stories, chat, and a simple chronological feed. No reels, no addictive algorithms.",
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2070&auto=format&fit=crop",
      tags: ["React", "Node.js", "Express", "MongoDB", "Socket.io", "Fullstack"],
      stars: 6,
      language: "JavaScript",
      github: "https://github.com/bhaveshpatil-ks",
      demo: "#"
    },
    {
      id: "mail-flow",
      title: "MailFlow — Email Automation Platform",
      repoName: "Mail-flow-",
      description: "MailFlow is a modern full-stack email automation platform built with React, Node.js, Express, MongoDB, and Nodemailer. Users can manage contacts, send professional email campaigns, track history, and automate workflows.",
      image: "https://images.unsplash.com/photo-1557200134-90327ee9fafa?q=80&w=2070&auto=format&fit=crop",
      tags: ["React", "Node.js", "Express", "MongoDB", "Nodemailer", "Fullstack"],
      stars: 0,
      language: "JavaScript",
      github: "https://github.com/bhaveshpatil-ks",
      demo: "#"
    },
    {
      id: "faculty-one",
      title: "FacultyOne — Secure Educator Workspace",
      repoName: "sanketpadhyal/FacultyOne",
      description: "A secure cloud ☁️ workspace built for educators to manage and access teaching resources across devices and classrooms using one-time session tokens.",
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop",
      tags: ["React", "Tailwind CSS", "Firebase", "Node.js", "Cloud"],
      stars: 0,
      language: "JavaScript",
      github: "https://github.com/bhaveshpatil-ks",
      demo: "#"
    },
    {
      id: "odoy",
      title: "Odoy — Real-Time AI Social Platform",
      repoName: "sanketpadhyal/Odoy",
      description: "Odoy 💬 is a modern real-time social platform with seamless chat, friend system, and AI-powered interactions — built for speed, scale, and a clean user experience.",
      image: "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?q=80&w=2070&auto=format&fit=crop",
      tags: ["React", "CSS3", "Node.js", "AI", "Socket.io", "Fullstack"],
      stars: 0,
      language: "CSS",
      github: "https://github.com/bhaveshpatil-ks",
      demo: "#"
    },
    {
      id: "sweface",
      title: "Sweface — Face Recognition Attendance System",
      repoName: "sanketpadhyal/Sweface",
      description: "A full-stack face recognition attendance system for companies, featuring an Android app, live website, admin dashboard, backend API, offline attendance sync, liveness checks, and Firebase Firestore...",
      image: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?q=80&w=2070&auto=format&fit=crop",
      tags: ["JavaScript", "Android App", "Firebase", "Node.js", "AI / Vision", "Fullstack"],
      stars: 5,
      language: "JavaScript",
      github: "https://github.com/bhaveshpatil-ks",
      demo: "#"
    },
    {
      id: "ai-call-summary",
      title: "AI Call Summary CRM — Mobile Call Intelligence",
      repoName: "AI-CALL-SUMMARY-APP",
      description: "A modern, high-performance mobile AI CRM platform that auto-syncs phone call recordings, generates AI summaries (GPT-4o / Ollama), and manages lead pipelines with 1-tap SMS.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
      tags: ["React Native", "GPT-4o", "Ollama", "Node.js", "AI", "Mobile"],
      stars: 1,
      language: "JavaScript",
      github: "https://github.com/bhaveshpatil-ks",
      demo: "#"
    }
  ],

  experience: [
    {
      period: "2025 - Present",
      role: "Full Stack Web Developer",
      company: "Freelance & Independent Projects",
      description: "Started learning Web Development in 2025. Now building production-grade web applications, RESTful APIs, real-time systems, and modern user interfaces."
    }
  ],

  education: [
    {
      degree: "BCA Science (Hons)",
      institution: "MIT-WPU (MIT World Peace University)",
      year: "2026 - Present (1st Year)",
      details: "Currently in 1st Year pursuing Bachelor of Computer Applications in Science (Hons) with focus on modern software engineering, computer systems, and web development."
    }
  ],

  megaFooter: {
    links: [
      { label: "Home", action: "#home" },
      { label: "Projects", action: "#projects" },
      { label: "Skills", action: "#skills" },
      { label: "Experience", action: "#experience" },
    ],
    buttons: [
      { label: "GitHub", icon: "github", variant: "dark", action: "https://github.com/bhaveshpatil-ks", external: true },
      { label: "Contact", icon: "mail", variant: "dark", action: "#contact" },
      { label: "Admin", icon: "user", variant: "gray", action: "#" },
      { label: "About this web", icon: "info", variant: "gray", action: "#about" },
      { label: "Sparse", icon: "sparkles", variant: "dark", action: "https://github.com/bhaveshpatil-ks" },
      { label: "Buy me a coffee", icon: "coffee", variant: "yellow", action: "#" }
    ]
  }
};
