import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

export default function ExperienceJourney() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let masterTimeline;

    const ctx = gsap.context(() => {
      const path = document.querySelector('#path-experience');
      if (!path) return;

      const pathLength = path.getTotalLength();

      // Setup initial SVG stroke dash offset
      gsap.set(path, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
      });

      // Initial States: Card 1 is VISIBLE IMMEDIATELY on mount (ZERO BLANK SCREEN!)
      gsap.set('#card-1', { opacity: 1, scale: 1, pointerEvents: 'auto' });
      gsap.set('#card-2', { opacity: 0, scale: 0.95, pointerEvents: 'none' });
      gsap.set('#card-3', { opacity: 0, scale: 0.95, pointerEvents: 'none' });
      gsap.set('#card-4', { opacity: 0, scale: 0.95, pointerEvents: 'none' });

      // Master Scroll Timeline pinned via GSAP ScrollTrigger
      masterTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=3500',
          scrub: 0.5,
          pin: true,
          anticipatePin: 1,
          refreshPriority: 1,
        },
      });

      // 1. Line draws continuously forward along notebook path
      masterTimeline.to(
        path,
        {
          strokeDashoffset: 0,
          ease: 'none',
        },
        0
      );

      // 2. Beacon head glides along path-experience
      masterTimeline.to(
        '#beacon',
        {
          motionPath: {
            path: '#path-experience',
            align: '#path-experience',
            alignOrigin: [0.5, 0.5],
            autoRotate: false,
          },
          ease: 'none',
        },
        0
      );

      // 3. Highlight Vertex Dots as beacon moves
      masterTimeline
        .to('#dot-1', { fill: '#ff4d00', scale: 1.4, transformOrigin: 'center', duration: 0.02 }, 0.106)
        .to('#dot-2', { fill: '#ff4d00', scale: 1.4, transformOrigin: 'center', duration: 0.02 }, 0.324)
        .to('#dot-3', { fill: '#ff4d00', scale: 1.4, transformOrigin: 'center', duration: 0.02 }, 0.551)
        .to('#dot-4', { fill: '#ff4d00', scale: 1.4, transformOrigin: 'center', duration: 0.02 }, 0.785);

      // 4. Exact Card Transitions at Notebook Dots:

      // Dot 2 (Balmohan 12th @ 0.324): Card 1 HIDES, Card 2 SHOWS on RIGHT
      masterTimeline
        .to('#card-1', { opacity: 0, scale: 0.95, pointerEvents: 'none', duration: 0.02 }, 0.324)
        .to('#card-2', { opacity: 1, scale: 1, pointerEvents: 'auto', duration: 0.02 }, 0.324);

      // Dot 3 (Web Dev 2025 @ 0.551): Card 2 HIDES, Card 3 SHOWS on LEFT
      masterTimeline
        .to('#card-2', { opacity: 0, scale: 0.95, pointerEvents: 'none', duration: 0.02 }, 0.551)
        .to('#card-3', { opacity: 1, scale: 1, pointerEvents: 'auto', duration: 0.02 }, 0.551);

      // Dot 4 (MIT-WPU 1st Year BCA @ 0.785): Card 3 HIDES, Card 4 SHOWS on RIGHT
      masterTimeline
        .to('#card-3', { opacity: 0, scale: 0.95, pointerEvents: 'none', duration: 0.02 }, 0.785)
        .to('#card-4', { opacity: 1, scale: 1, pointerEvents: 'auto', duration: 0.02 }, 0.785);
    }, section);

    // Refresh ScrollTrigger after mounting
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, []);

  return (
    <section id="experience-journey-scrolly" ref={sectionRef} className="experience-sticky-section">
      <div className="grid-bg" />

      {/* SVG Line Geometry matching Notebook Plan */}
      <svg className="line-svg" viewBox="0 0 1000 1200" preserveAspectRatio="none">
        <defs>
          <linearGradient id="glow-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff4d00" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#ff4d00" stopOpacity="1" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.9" />
          </linearGradient>

          <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Notebook Path: M 450 0 L 200 180 L 800 380 L 180 600 L 820 820 L 450 980 L 450 1200 */}
        <path
          id="path-bg"
          className="path-base"
          d="M 450 0 L 200 180 L 800 380 L 180 600 L 820 820 L 450 980 L 450 1200"
        />
        <path
          id="path-experience"
          className="path-glow"
          d="M 450 0 L 200 180 L 800 380 L 180 600 L 820 820 L 450 980 L 450 1200"
        />

        {/* 4 Explicit Vertex Dots drawn from Notebook Blueprint */}
        <circle id="dot-1" className="vertex-dot" cx="200" cy="180" r="7" />
        <circle id="dot-2" className="vertex-dot" cx="800" cy="380" r="7" />
        <circle id="dot-3" className="vertex-dot" cx="180" cy="600" r="7" />
        <circle id="dot-4" className="vertex-dot" cx="820" cy="820" r="7" />

        {/* Luminous Beacon Head */}
        <circle id="beacon" cx="450" cy="0" r="8" />
      </svg>

      {/* Milestone Overlay Cards Wrapper */}
      <div className="cards-wrapper">
        {/* 1st Card: 10th Standard Details (OEMS, Chopda - 2023) */}
        <div className="timeline-card card-left" id="card-1">
          <div className="card-tag">1ST MILESTONE / ACADEMIC</div>
          <div className="card-year">
            2023 <span className="accent-slash">/</span> 10th Standard
          </div>
          <h3 className="card-title">OEMS, Chopda</h3>
          <p className="card-desc">
            Completed Secondary School Certificate (SSC) with a strong foundation in core sciences & mathematics.
          </p>
          <div className="card-meta">
            <span className="badge">OEMS Chopda</span>
            <span className="badge">Class of 2023</span>
          </div>
        </div>

        {/* 2nd Card: 12th Standard Details (Balmohan Jr. College, Chopda - 2025 HSC Science) */}
        <div className="timeline-card card-right" id="card-2">
          <div className="card-tag">2ND MILESTONE / HIGHER SECONDARY</div>
          <div className="card-year">
            2025 <span className="accent-slash">/</span> 12th Standard
          </div>
          <h3 className="card-title">Balmohan Jr. College, Chopda</h3>
          <p className="card-desc">
            Completed Higher Secondary Certificate (HSC Science) developing analytical problem solving.
          </p>
          <div className="card-meta">
            <span className="badge">HSC Science</span>
            <span className="badge">Class of 2025</span>
          </div>
        </div>

        {/* 3rd Card: Web Dev Starting 2025 (Genesis / Dev Journey) */}
        <div className="timeline-card card-left" id="card-3">
          <div className="card-tag">3RD MILESTONE / GENESIS</div>
          <div className="card-year">
            2025 <span className="accent-slash">/</span> Starting Web Dev
          </div>
          <h3 className="card-title">Creative Full-Stack Initiation</h3>
          <p className="card-desc">
            Began architecting modern frontends, scalable systems, and high-performance interactive experiences.
          </p>
          <div className="card-meta">
            <span className="badge">Full-Stack</span>
            <span className="badge">UI/UX Design</span>
            <span className="badge status-active">Interactive Web</span>
          </div>
        </div>

        {/* 4th Card: Current College Details (MIT-WPU Pune First Year BCA Sci Hons) */}
        <div className="timeline-card card-right" id="card-4">
          <div className="card-tag">4TH MILESTONE / UNDERGRADUATE</div>
          <div className="card-year">
            PRESENT <span className="accent-slash">/</span> 1st Year BCA
          </div>
          <h3 className="card-title">MIT World Peace University (MIT-WPU), Pune</h3>
          <p className="card-desc">
            Pursuing Bachelor of Computer Applications (Science Hons) specializing in computer science & software engineering.
          </p>
          <div className="card-meta">
            <span className="badge status-active">MIT-WPU Pune</span>
            <span className="badge">BCA Sci (Hons)</span>
          </div>
        </div>
      </div>

      <style>{`
        .experience-sticky-section {
          position: relative;
          width: 100vw;
          height: 100vh;
          background-color: #0a0a0a;
          overflow: hidden;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .grid-bg {
          position: absolute;
          inset: 0;
          background-size: 60px 60px;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
          z-index: 1;
          pointer-events: none;
        }

        .line-svg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 2;
          pointer-events: none;
        }

        .path-base {
          fill: none;
          stroke: rgba(255, 255, 255, 0.08);
          stroke-width: 2.5;
        }

        .path-glow {
          fill: none;
          stroke: url(#glow-gradient);
          stroke-width: 3.5;
          stroke-linecap: round;
          filter: url(#neon-glow);
        }

        .vertex-dot {
          fill: rgba(255, 255, 255, 0.25);
          stroke: rgba(255, 255, 255, 0.4);
          stroke-width: 1.5;
          transition: fill 0.2s, scale 0.2s;
        }

        #beacon {
          fill: #ffffff;
          filter: drop-shadow(0 0 10px #ff4d00);
        }

        .cards-wrapper {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 3;
          pointer-events: none;
        }

        .timeline-card {
          position: absolute;
          top: 50%;
          width: 380px;
          padding: 24px 28px;
          background: rgba(18, 18, 18, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-radius: 14px;
          color: #ffffff;
          opacity: 0;
          pointer-events: none;
          transform: translateY(-50%) scale(0.95) translateZ(0);
          will-change: transform, opacity;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.7);
          transition: border-color 0.3s, box-shadow 0.3s;
        }

        .timeline-card:hover {
          border-color: rgba(255, 77, 0, 0.5);
          box-shadow: 0 0 24px rgba(255, 77, 0, 0.25), 0 30px 60px rgba(0, 0, 0, 0.8);
        }

        .card-left { left: 8%; }
        .card-right { right: 8%; }

        .card-tag {
          font-size: 0.75rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #777777;
          margin-bottom: 8px;
          font-family: monospace;
        }

        .card-year {
          font-size: 1.1rem;
          font-weight: 700;
          letter-spacing: 1px;
          margin-bottom: 8px;
          font-family: var(--font-heading);
          color: #ffffff;
        }

        .accent-slash {
          color: #ff4d00;
          font-weight: 900;
          margin: 0 4px;
        }

        .card-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 8px;
          color: #ffffff;
          font-family: var(--font-heading);
        }

        .card-desc {
          font-size: 0.88rem;
          line-height: 1.55;
          color: #aaaaaa;
          margin-bottom: 16px;
          font-family: var(--font-body);
        }

        .card-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .badge {
          font-size: 0.75rem;
          padding: 4px 10px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          color: #cccccc;
          font-family: monospace;
        }

        .badge.status-active {
          border-color: rgba(255, 77, 0, 0.5);
          color: #ff4d00;
          box-shadow: 0 0 10px rgba(255, 77, 0, 0.3);
        }

        @media (max-width: 1024px) {
          .card-left, .card-right {
            left: 50%;
            right: auto;
            transform: translate(-50%, -50%) scale(0.95) translateZ(0);
          }
        }

        @media (max-width: 640px) {
          .timeline-card {
            width: 88%;
            padding: 20px;
          }
        }
      `}</style>
    </section>
  );
}
