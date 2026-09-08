import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  GraduationCap, 
  Award, 
  Code2, 
  Building2, 
  Sparkles, 
  Compass, 
  BookOpen, 
  Layers, 
  CheckCircle2,
  Terminal
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const educationMilestones = [
  {
    id: 'schooling',
    year: '2023',
    period: '2022 — 2023',
    tag: '10th Secondary Schooling',
    title: 'Oxford English Medium School',
    subtitle: 'Chopda, Maharashtra',
    grade: 'CBSE Board',
    icon: BookOpen,
    overview: 'Built rock-solid foundations in Mathematics, Science, and Analytical Logic. Cultivated early curiosity in computers and technology.',
    achievements: [
      'Strong academic performance across core subjects',
      'First exposure to computational thinking and basic programming concepts',
      'Developed disciplined study habits and problem-solving mindset'
    ],
    skills: ['Mathematics', 'Science', 'Computer Basics', 'Logical Reasoning']
  },
  {
    id: 'junior-college',
    year: '2025',
    period: '2023 — 2025',
    tag: '12th Higher Secondary (PCMB)',
    title: 'Balmohan Jr. College',
    subtitle: 'Chopda, Maharashtra',
    grade: '76.33% Aggregate • Distinction',
    icon: Award,
    overview: 'Completed rigorous 12th HSC science curriculum in the PCMB stream (Physics, Chemistry, Mathematics, Biology) securing 76.33%.',
    achievements: [
      'Scored 76.33% aggregate in Maharashtra State Board',
      'Mastered advanced Calculus, Physics principles, and Organic Chemistry',
      'Developed algorithmic thinking and quantitative analysis skills'
    ],
    skills: ['Advanced Mathematics', 'Physics', 'Chemistry', 'Analytical Modeling']
  },
  {
    id: 'self-taught-dev',
    year: '2025',
    period: '2025 — 2026',
    tag: 'Started Web Development',
    title: 'Full-Stack Web Development',
    subtitle: 'Building Modern Web Apps & Systems',
    grade: '8+ Production Builds Shipped',
    icon: Terminal,
    overview: 'Started learning web development in 2025. Focused on building real-world full-stack web applications, scalable backends, real-time features, and modern interactive interfaces.',
    achievements: [
      'Built and shipped Sparse (sparse.in), RivoCode CLI, FacultyOne, and Odoy',
      'Implemented real-time WebSockets, WebAuthn Passkeys, and secure RESTful APIs',
      'Designed responsive and modern UI systems with React and Tailwind CSS'
    ],
    skills: ['React', 'Node.js', 'MongoDB', 'Firebase', 'WebAuthn']
  },
  {
    id: 'undergrad-mit',
    year: '2026',
    period: '2026 — Present (1st Year)',
    tag: 'Undergraduate Degree',
    title: 'MIT World Peace University (MIT-WPU)',
    subtitle: 'Pune, Maharashtra',
    grade: 'Bachelor of Computer Applications (Hons)',
    icon: Building2,
    overview: 'Currently in 1st Year pursuing BCA Science (Hons) at MIT-WPU Pune, studying computer science fundamentals, data structures, and database systems.',
    achievements: [
      'Specializing in Data Structures, Algorithms, and Core Computer Science',
      'Collaborating on open-source toolchains and developer ecosystem tools',
      'Connecting computer science theories with hands-on project development'
    ],
    skills: ['Data Structures', 'Algorithms', 'Database Systems']
  }
];

export default function EducationPage() {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const progressBarRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    let mm = gsap.matchMedia();

    mm.add("(min-width: 901px)", () => {
      // Calculate total horizontal translation needed on desktop
      const getScrollAmount = () => {
        const trackWidth = track.scrollWidth;
        return -(trackWidth - window.innerWidth + 120);
      };
      const scrollDistance = () => (track.scrollWidth - window.innerWidth) * 1.6 + 1200;

      // Horizontal Scroll Scrub Timeline (Silky smooth damping and slower travel)
      gsap.to(track, {
        x: getScrollAmount,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: () => `+=${scrollDistance()}`,
          pin: true,
          scrub: 1.2,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const prog = Math.round(self.progress * 100);
            setScrollProgress(prog);
            const index = Math.min(
              educationMilestones.length - 1,
              Math.floor(self.progress * educationMilestones.length)
            );
            setActiveCardIndex(index);
          }
        }
      });

      // Animate progress bar fill smoothly matching the scroll duration
      if (progressBarRef.current) {
        gsap.to(progressBarRef.current, {
          width: '100%',
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top top',
            end: () => `+=${scrollDistance()}`,
            scrub: 1.2
          }
        });
      }
    });

    return () => mm.revert();
  }, []);

  return (
    <div className="edu-page-root">
      {/* Main Pinned Horizontal Experience Section */}
      <section ref={containerRef} className="edu-pinned-section">
        {/* Top Info Banner & Scroll Instruction */}
        <div className="edu-hero-intro">
          <div className="badge-pill">
            <span className="badge-slash">//</span>
            <span>ACADEMIC & TECHNICAL TIMELINE</span>
          </div>
          <h1 className="edu-main-title">
            Education <span className="title-highlight">Structure</span>
          </h1>
        </div>

        {/* The Overhead Clean Rail Line (No fancy multi-colors) */}
        <div className="overhead-rail-wrapper">
          <div className="overhead-rail-line">
            <div 
              className="overhead-rail-glow"
              style={{ width: `${Math.max(6, scrollProgress)}%` }}
            />
          </div>
        </div>

        {/* Horizontal Track Container */}
        <div ref={trackRef} className="edu-horizontal-track">
          {educationMilestones.map((item, index) => {
            const IconComponent = item.icon;
            const isActive = activeCardIndex === index;

            return (
              <React.Fragment key={item.id}>
                <div className="timeline-node-unit">
                  {/* 1. Overhead Year Badge & Metallic Stem Joint (Centered right above card) */}
                  <div className="node-anchor-box">
                    <div className={`node-year-badge ${isActive ? 'active' : ''}`}>
                      <span className="year-number">{item.year}</span>
                      {isActive && <span className="active-dot-beacon" />}
                    </div>

                    {/* Vertical Hanging Connector Stem (Clean Industrial Style) */}
                    <div className="hanging-stem-connector">
                      <div className="stem-joint-top" />
                      <div className={`stem-cable ${isActive ? 'active' : ''}`} />
                      <div className={`stem-joint-bottom ${isActive ? 'active' : ''}`} />
                    </div>
                  </div>

                  {/* 2. The Main Hanging Card */}
                  <div className={`edu-card-container ${isActive ? 'is-active' : ''}`}>
                    {/* Card Header */}
                    <div className="card-top-bar">
                      <div className="card-icon-frame">
                        <IconComponent size={18} />
                      </div>

                      <div className="card-tag-badge">
                        <span>{item.tag}</span>
                      </div>

                      <span className="card-period-text">{item.period}</span>
                    </div>

                    {/* Institution / Project Title */}
                    <h3 className="card-institution-title">{item.title}</h3>
                    <div className="card-subtitle-row">
                      <Compass size={13} className="sub-icon" />
                      <span>{item.subtitle}</span>
                    </div>

                    {/* Grade / Milestone Highlight Banner */}
                    <div className="card-grade-banner">
                      <CheckCircle2 size={14} className="grade-icon" />
                      <span className="grade-highlight-text">{item.grade}</span>
                    </div>

                    {/* Overview Paragraph */}
                    <p className="card-overview-text">{item.overview}</p>

                    {/* Key Highlights */}
                    <div className="card-highlights-section">
                      <span className="highlights-label">Key Milestones & Focus:</span>
                      <ul className="highlights-list">
                        {item.achievements.map((ach, i) => (
                          <li key={i}>
                            <span className="bullet-dash">—</span>
                            <span>{ach}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Bottom Skills / Competency Tags */}
                    <div className="card-skills-row">
                      {item.skills.map((skill, sIdx) => (
                        <span key={sIdx} className="skill-chip">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3. Subtle Clean Milestone Conduit (Between Cards) */}
                {index < educationMilestones.length - 1 && (
                  <div className="inter-card-connector">
                    <div className="connector-path-line">
                      <div className="connector-pulse-dot" />
                    </div>
                    <div className="connector-milestone-tag">
                      <span>STEP 0{index + 1} ➔ 0{index + 2}</span>
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Bottom Clean HUD & Progress Controller */}
        <div className="edu-hud-dock">
          <div className="hud-progress-info">
            <span className="hud-step-counter">
              0{activeCardIndex + 1} <span className="hud-step-total">/ 0{educationMilestones.length}</span>
            </span>
            <span className="hud-step-name">{educationMilestones[activeCardIndex].tag}</span>
          </div>

          <div className="hud-progress-bar-track">
            <div ref={progressBarRef} className="hud-progress-bar-fill" />
          </div>

          <div className="hud-status-badge">
            <span className="hud-live-dot" />
            <span>Timeline Active</span>
          </div>
        </div>
      </section>

      {/* Styled JSX Theme and CSS (Matching Main Portfolio Aesthetic) */}
      <style>{`
        .edu-page-root {
          background-color: #050507;
          min-height: 100vh;
          width: 100%;
          color: #ffffff;
          overflow-x: hidden;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        /* Pinned Container Section */
        .edu-pinned-section {
          position: relative;
          width: 100%;
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding-top: 96px;
          padding-bottom: 60px;
          overflow: hidden;
          background: #050507;
        }

        /* Hero Intro */
        .edu-hero-intro {
          padding: 10px 40px 0 40px;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 10;
        }

        .badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.8);
          padding: 4px 12px;
          border-radius: 999px;
          font-size: 11px;
          font-family: var(--font-mono, monospace);
          letter-spacing: 0.08em;
          font-weight: 700;
          margin-bottom: 6px;
        }

        .badge-slash {
          color: #ff4500;
        }

        .edu-main-title {
          font-family: var(--font-heading);
          font-size: clamp(26px, 3.5vw, 40px);
          font-weight: 900;
          letter-spacing: -0.03em;
          margin: 0 0 6px 0;
          color: #ffffff;
        }

        .title-highlight {
          color: rgba(255, 255, 255, 0.6);
          font-weight: 400;
        }

        /* Clean Rail Line (Clean Monochrome) */
        .overhead-rail-wrapper {
          position: absolute;
          top: 220px;
          left: 0;
          right: 0;
          height: 2px;
          z-index: 5;
          pointer-events: none;
        }

        .overhead-rail-line {
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.08);
          position: relative;
        }

        .overhead-rail-glow {
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          background: #ffffff;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
          transition: width 0.1s linear;
        }

        /* Horizontal Track */
        .edu-horizontal-track {
          display: flex;
          align-items: flex-start;
          gap: 0;
          padding: 0 80px;
          width: fit-content;
          z-index: 10;
          margin-top: 15px;
          will-change: transform;
        }

        .timeline-node-unit {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          width: 440px;
          flex-shrink: 0;
        }

        /* Node Anchor & Hanging Stem (Centered in Middle of Card) */
        .node-anchor-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          margin-top: -24px;
        }

        .node-year-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #0d0d12;
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 999px;
          padding: 5px 14px;
          font-family: var(--font-mono, monospace);
          font-size: 13px;
          font-weight: 800;
          color: #ffffff;
          transition: all 0.25s ease;
          z-index: 6;
        }

        .node-year-badge.active {
          border-color: #ffffff;
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
          transform: scale(1.05);
        }

        .active-dot-beacon {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background-color: #ff4500;
          box-shadow: 0 0 8px #ff4500;
        }

        .hanging-stem-connector {
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 48px;
        }

        .stem-cable {
          width: 1.5px;
          height: 100%;
          background: rgba(255, 255, 255, 0.12);
          transition: background 0.3s ease;
        }

        .stem-cable.active {
          background: rgba(255, 255, 255, 0.4);
        }

        .stem-joint-top {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #ffffff;
        }

        .stem-joint-bottom {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #0d0d12;
          border: 1.5px solid rgba(255, 255, 255, 0.3);
        }

        .stem-joint-bottom.active {
          border-color: #ff4500;
          background: #ff4500;
        }

        /* The Main Hanging Card (Unified Matte Dark Aesthetic) */
        .edu-card-container {
          width: 440px;
          min-height: 390px;
          background: rgba(13, 13, 18, 0.9);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 24px 26px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: all 0.25s ease;
          position: relative;
          margin-left: 0;
          margin-top: 0;
        }

        .edu-card-container:hover,
        .edu-card-container.is-active {
          transform: translateY(-4px);
          border-color: rgba(255, 255, 255, 0.2);
          background: rgba(18, 18, 24, 0.95);
          box-shadow: 0 16px 32px rgba(0, 0, 0, 0.5);
        }

        .card-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 12px;
        }

        .card-icon-frame {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.04);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .card-tag-badge {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 5px;
          padding: 3px 9px;
          font-size: 11.5px;
          font-family: var(--font-mono, monospace);
          font-weight: 600;
          color: rgba(255, 255, 255, 0.85);
        }

        .card-period-text {
          font-size: 11.5px;
          color: rgba(255, 255, 255, 0.45);
          font-family: var(--font-mono, monospace);
        }

        .card-institution-title {
          font-size: 20px;
          font-weight: 800;
          color: #ffffff;
          margin: 0 0 3px 0;
          line-height: 1.3;
        }

        .card-subtitle-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12.5px;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 11px;
        }

        .sub-icon {
          color: rgba(255, 255, 255, 0.45);
        }

        .card-grade-banner {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 7px 12px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-left: 2px solid #ff4500;
          margin-bottom: 11px;
        }

        .grade-icon {
          color: #ff4500;
        }

        .grade-highlight-text {
          font-size: 12.5px;
          font-weight: 700;
          color: #ffffff;
        }

        .card-overview-text {
          font-size: 13.5px;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.7);
          margin: 0 0 12px 0;
        }

        .card-highlights-section {
          margin-bottom: 12px;
        }

        .highlights-label {
          font-size: 10.5px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.4);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          display: block;
          margin-bottom: 5px;
          font-family: var(--font-mono, monospace);
        }

        .highlights-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .highlights-list li {
          display: flex;
          align-items: flex-start;
          gap: 7px;
          font-size: 12.5px;
          line-height: 1.4;
          color: rgba(255, 255, 255, 0.8);
        }

        .bullet-dash {
          color: #ff4500;
        }

        .card-skills-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          padding-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }

        .skill-chip {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 5px;
          padding: 3px 9px;
          font-size: 11px;
          font-family: var(--font-mono, monospace);
          color: rgba(255, 255, 255, 0.65);
        }

        /* Clean Inter-Card Transition Connector */
        .inter-card-connector {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 130px;
          margin-top: 190px;
          position: relative;
        }

        .connector-path-line {
          width: 100%;
          height: 1.5px;
          background: repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.15) 0px, rgba(255, 255, 255, 0.15) 5px, transparent 5px, transparent 10px);
          position: relative;
        }

        .connector-pulse-dot {
          position: absolute;
          top: -3.5px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ffffff;
          box-shadow: 0 0 8px rgba(255, 255, 255, 0.6);
          animation: glideAcross 2.5s infinite ease-in-out;
        }

        @keyframes glideAcross {
          0% { left: 0%; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }

        .connector-milestone-tag {
          margin-top: 8px;
          font-size: 9px;
          font-family: var(--font-mono, monospace);
          color: rgba(255, 255, 255, 0.3);
          letter-spacing: 0.1em;
          white-space: nowrap;
        }

        /* Bottom Clean HUD */
        .edu-hud-dock {
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 50;
          display: flex;
          align-items: center;
          gap: 20px;
          background: rgba(13, 13, 18, 0.9);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 8px 22px;
          border-radius: 999px;
          min-width: 460px;
          max-width: 90vw;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
        }

        .hud-progress-info {
          display: flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
        }

        .hud-step-counter {
          font-family: var(--font-mono, monospace);
          font-size: 13px;
          font-weight: 800;
          color: #ffffff;
        }

        .hud-step-total {
          color: rgba(255, 255, 255, 0.3);
          font-size: 11px;
        }

        .hud-step-name {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.65);
          font-weight: 600;
        }

        .hud-progress-bar-track {
          flex: 1;
          height: 3px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 999px;
          overflow: hidden;
        }

        .hud-progress-bar-fill {
          width: 0%;
          height: 100%;
          background: linear-gradient(90deg, #ff4500, #ffffff);
          border-radius: 999px;
        }

        .hud-status-badge {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 10px;
          font-family: var(--font-mono, monospace);
          color: rgba(255, 255, 255, 0.35);
          white-space: nowrap;
        }

        .hud-live-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 5px #22c55e;
        }

        /* Responsive Mobile Styles */
        @media (max-width: 900px) {
          .edu-nav-header {
            padding: 12px 18px;
          }

          .nav-breadcrumb {
            display: none;
          }

          .edu-pinned-section {
            height: auto;
            min-height: 100vh;
            padding-top: 76px;
            padding-bottom: 50px;
            overflow: visible;
            justify-content: flex-start;
          }

          .edu-hero-intro {
            padding: 8px 16px 20px;
            max-width: 100%;
          }

          .overhead-rail-wrapper {
            display: none;
          }

          .edu-horizontal-track {
            flex-direction: column;
            width: 100%;
            max-width: 520px;
            padding: 0 16px;
            margin: 0 auto;
            gap: 0;
            align-items: center;
            transform: none !important;
            box-sizing: border-box;
          }

          .timeline-node-unit {
            flex-direction: column;
            width: 100%;
            align-items: center;
            box-sizing: border-box;
          }

          .node-anchor-box {
            margin: 0;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .hanging-stem-connector {
            height: 20px;
          }

          .edu-card-container {
            width: 100%;
            max-width: 100%;
            margin-left: 0 !important;
            margin-top: 0;
            min-height: auto;
            padding: 22px 20px;
            box-sizing: border-box;
            border-radius: 16px;
          }

          .inter-card-connector {
            margin: 18px 0;
            width: 2px;
            height: 36px;
            position: relative;
          }

          .connector-path-line {
            width: 2px;
            height: 100%;
            background: repeating-linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0px, rgba(255, 255, 255, 0.2) 4px, transparent 4px, transparent 8px);
          }

          .connector-pulse-dot {
            left: -3px;
            top: 0;
          }

          .connector-milestone-tag {
            display: none;
          }

          .edu-hud-dock {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .edu-pinned-section {
            padding-top: 70px;
            padding-bottom: 40px;
          }

          .edu-hero-intro {
            padding: 4px 12px 16px;
          }

          .edu-main-title {
            font-size: 26px;
          }

          .edu-main-subtitle {
            font-size: 12px;
          }

          .edu-horizontal-track {
            padding: 0 12px;
          }

          .edu-card-container {
            padding: 18px 16px;
            border-radius: 14px;
          }

          .card-top-bar {
            flex-wrap: wrap;
            gap: 8px;
            justify-content: flex-start;
          }

          .card-period-text {
            margin-left: auto;
          }

          .card-institution-title {
            font-size: 18px;
          }

          .card-overview-text {
            font-size: 13px;
          }

          .highlights-list li {
            font-size: 12px;
          }

          .grade-highlight-text {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
}
