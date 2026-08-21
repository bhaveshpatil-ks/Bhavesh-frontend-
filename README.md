<div align="center">

# ⚡ Bhavesh Patil — Full-Stack Developer Portfolio

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.1.6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![GSAP](https://img.shields.io/badge/GSAP-3.15.0-88CE02?style=for-the-badge&logo=greensock&logoColor=white)](https://greensock.com/gsap/)
[![Lenis](https://img.shields.io/badge/Lenis-Smooth_Scroll-black?style=for-the-badge)](https://lenis.darkroom.engineering/)
[![Netlify Status](https://img.shields.io/badge/Deploy-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://www.netlify.com/)

<p align="center">
  <strong>A modern, high-performance personal portfolio showcasing full-stack applications, real-time AI tools, and production-grade software engineering.</strong>
</p>

[Live Demo](https://rococo-malabi-00c5ca.netlify.app) • [Backend Repository](https://github.com/bhaveshpatil-ks/BhaveshPatil-Backend) • [Report Issue](https://github.com/bhaveshpatil-ks/Bhavesh-frontend-/issues)

</div>

---

## 🌟 Key Features

- **🎬 Video Background Hero**: Immersive grayscale video hero with interactive geolocation status drawer and live availability pill.
- **📜 Smooth Scroll & Parallax Physics**: Integrated with [Lenis](https://lenis.darkroom.engineering/) smooth scrolling and GSAP ScrollTrigger for seamless sheet reveal transitions.
- **🤖 Built-in AI Assistant**: Interactive floating AI chatbot connected to the Render backend via Groq LLM with quick prompt suggestions.
- **🗂️ Interactive Contact Hub**: Stacked 6-capsule glassmorphic contact hub with one-click clipboard copying, WhatsApp direct integration, and embedded message form.
- **📱 Universal Responsiveness**: Fully responsive across Windows/Mac desktops, laptops, iPads/tablets, and mobile smartphones with clean viewport handling.
- **⚡ Single Page Application (SPA) Routing**: Powered by React Router v7 with zero-config Netlify redirects (`_redirects` & `netlify.toml`).

---

## 🛠️ Tech Stack & Architecture

| Layer | Technologies |
|---|---|
| **Core Framework** | React 18, Vite 5, JavaScript (ESNext) |
| **Styling & UI** | Pure CSS3 (CSS Variables), Radix UI Primitives, Lucide Icons |
| **Motion & Animation** | GSAP (GreenSock), ScrollTrigger, Lenis Smooth Scroll |
| **Routing** | React Router DOM v7 |
| **Backend Integration** | RESTful API Client communicating with Express / Node.js on Render |
| **Deployment** | Netlify (Static SPA with `_redirects` proxy) |

---

## 📂 Project Structure

```bash
frontend/
├── public/                     # Static media assets & Netlify SPA routing
│   ├── _redirects              # Netlify SPA redirect rules
│   └── assets/                 # Videos (.mp4), WebP charts, avatars, icons
├── src/
│   ├── components/             # Reusable UI components & sections
│   │   ├── ui/                 # MagneticButton, Toast, TextReveal, Inputs
│   │   ├── FloatingAIChat.jsx  # Interactive AI chatbot drawer
│   │   ├── Hero.jsx            # Video Hero & Geolocation drawer
│   │   ├── MegaFooter.jsx      # 10-pill button grid footer
│   │   ├── Navbar.jsx          # Capsule header navbar with drawer
│   │   ├── StatementSection.jsx# Philosophy & metrics section
│   │   └── WhyBhavesh.jsx      # Ways to Work Together cards
│   ├── data/
│   │   └── portfolioData.js    # Centralized portfolio data & projects
│   ├── lib/
│   │   ├── api.js              # Backend API client (/ai, /tickets)
│   │   └── utils.js            # Utility helpers
│   ├── pages/                  # Page routes (Home, Projects, TechStack, Education, Contact)
│   ├── App.jsx                 # Route manager & Lenis scroll-to-top sync
│   ├── index.css               # Design system tokens & typography
│   └── main.jsx                # Application root entry point
├── .env.example                # Template for environment variables (safe)
├── .gitignore                  # Git ignore rules (protects private keys)
├── netlify.toml                # Netlify build & redirect configuration
├── package.json                # Project dependencies and build scripts
└── vite.config.js              # Vite bundler configuration
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **yarn** / **pnpm**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/bhaveshpatil-ks/Bhavesh-frontend-.git
   cd Bhavesh-frontend-
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory (based on `.env.example`):
   ```env
   VITE_API_URL=https://bhaveshpatil-backend.onrender.com
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

5. **Build for Production**:
   ```bash
   npm run build
   ```
   The bundled static files will be generated in the `dist/` directory.

---

## 🔒 Security Best Practices

- **Zero Secrets Committed**: All API keys, environment variables, and backend credentials are kept in `.env` (ignored by Git).
- **CORS Configured**: Protected backend communication with origin whitelisting.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — feel free to use it for personal inspiration.

---

<div align="center">
  <sub>Designed & Developed with ❤️ by <a href="https://github.com/bhaveshpatil-ks">Bhavesh Patil</a></sub>
</div>
