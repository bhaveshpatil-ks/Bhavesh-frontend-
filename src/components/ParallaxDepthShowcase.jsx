import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Layers, Sparkles, MoveDown, Compass, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function ParallaxDepthShowcase() {
  const sectionRef = useRef(null);
  const bgRef = useRef(null);
  const midRef = useRef(null);
  const fgRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // 1. Background Layer (0.5x Speed - Moves Slowest)
      gsap.to(bgRef.current, {
        y: '-140px',
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5,
        },
      });

      // 2. Midground Layer (1.0x Speed - Normal Speed)
      gsap.to(midRef.current, {
        y: '-40px',
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5,
        },
      });

      // 3. Foreground Layer (1.4x Speed - Moves Fastest near Camera)
      gsap.to(fgRef.current, {
        y: '-280px',
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="parallax-showcase-section">
      {/* LAYER 1: BACKGROUND (0.5x Speed - Slowest) */}
      <div ref={bgRef} className="parallax-layer layer-bg">
        <div className="bg-grid-mesh" />
        <div className="bg-glow-orb orb-orange" />
        <div className="bg-glow-orb orb-purple" />
        <div className="bg-watermark">DEPTH & MOTION</div>
      </div>

      {/* LAYER 2: MIDGROUND (1.0x Speed - Normal Content) */}
      <div ref={midRef} className="parallax-layer layer-mid">
        <div className="container">
          <div className="mid-header">
            <div className="parallax-badge">
              <span className="badge-slash">//</span>
              <span>03 / MULTI-LAYER PARALLAX</span>
            </div>

            <h2 className="parallax-title">
              parallax <span className="title-serif">effect</span>
            </h2>

            <p className="parallax-subtitle">
              Not everything moves at the same speed. <br />
              <span className="accent-orange">Create depth with motion.</span>
            </p>
          </div>

          {/* Speed Indicator Interactive Card (Matching Image Spec) */}
          <div className="depth-indicator-card">
            <div className="indicator-header">
              <MoveDown size={18} className="scroll-icon" />
              <span>SCROLL DEPTH METRICS</span>
            </div>

            <div className="speed-rows">
              <div className="speed-row row-fg">
                <div className="speed-icon">
                  <Zap size={16} />
                </div>
                <div className="speed-info">
                  <span className="speed-label">FOREGROUND</span>
                  <span className="speed-multiplier">1.4x FAST</span>
                </div>
                <div className="speed-bar fg-bar" />
              </div>

              <div className="speed-row row-mid">
                <div className="speed-icon">
                  <Compass size={16} />
                </div>
                <div className="speed-info">
                  <span className="speed-label">MIDGROUND</span>
                  <span className="speed-multiplier">1.0x MEDIUM</span>
                </div>
                <div className="speed-bar mid-bar" />
              </div>

              <div className="speed-row row-bg">
                <div className="speed-icon">
                  <Layers size={16} />
                </div>
                <div className="speed-info">
                  <span className="speed-label">BACKGROUND</span>
                  <span className="speed-multiplier">0.5x SLOW</span>
                </div>
                <div className="speed-bar bg-bar" />
              </div>
            </div>

            <p className="indicator-desc">
              Parallax makes layers move at different speeds, creating a real sense of 3D depth.
            </p>

            <div className="tech-pills">
              <span className="tech-tag">GSAP</span>
              <span className="tech-tag">SCROLLTRIGGER</span>
              <span className="tech-tag">LENIS</span>
            </div>
          </div>
        </div>
      </div>

      {/* LAYER 3: FOREGROUND (1.4x Speed - Moves Fastest) */}
      <div ref={fgRef} className="parallax-layer layer-fg">
        <div className="fg-chip chip-1">
          <Sparkles size={14} className="chip-icon" />
          <span>1.4x Speed Parallax</span>
        </div>

        <div className="fg-chip chip-2">
          <Layers size={14} className="chip-icon" />
          <span>Smooth Lenis Interpolation</span>
        </div>

        <div className="fg-glow-card">
          <div className="fg-card-title">Explore. Build. Discover.</div>
          <div className="fg-card-sub">Engineering 3D Interactive Web Experiences</div>
        </div>
      </div>

      <style>{`
        .parallax-showcase-section {
          position: relative;
          width: 100%;
          min-height: 110vh;
          background-color: #060709;
          overflow: hidden;
          padding: 120px 0;
          color: #ffffff;
        }

        .parallax-layer {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          will-change: transform;
        }

        /* BACKGROUND LAYER (0.5x Speed) */
        .layer-bg {
          z-index: 1;
          pointer-events: none;
        }

        .bg-grid-mesh {
          position: absolute;
          inset: 0;
          background-size: 80px 80px;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
        }

        .bg-glow-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.18;
        }

        .orb-orange {
          top: 10%;
          right: 15%;
          width: 450px;
          height: 450px;
          background: #ff4d00;
        }

        .orb-purple {
          bottom: 10%;
          left: 10%;
          width: 400px;
          height: 400px;
          background: #7928ca;
        }

        .bg-watermark {
          position: absolute;
          bottom: 5%;
          right: 5%;
          font-family: var(--font-heading);
          font-size: clamp(80px, 12vw, 180px);
          font-weight: 900;
          color: rgba(255, 255, 255, 0.02);
          letter-spacing: -0.05em;
          white-space: nowrap;
          pointer-events: none;
          user-select: none;
        }

        /* MIDGROUND LAYER (1.0x Speed) */
        .layer-mid {
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
        }

        .mid-header {
          margin-bottom: 48px;
        }

        .parallax-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 2px;
          color: #888888;
          text-transform: uppercase;
          margin-bottom: 16px;
        }

        .badge-slash { color: #ff4d00; font-weight: 900; }

        .parallax-title {
          font-family: var(--font-heading);
          font-size: clamp(48px, 8vw, 100px);
          font-weight: 900;
          line-height: 1;
          letter-spacing: -0.04em;
          margin-bottom: 20px;
          color: #ffffff;
        }

        .title-serif {
          font-family: 'Playfair Display', Georgia, serif;
          font-style: italic;
          font-weight: 400;
          color: #e4e4e7;
        }

        .parallax-subtitle {
          font-size: clamp(18px, 2.5vw, 28px);
          line-height: 1.4;
          color: #a1a1aa;
          font-family: var(--font-body);
        }

        .accent-orange { color: #ff4d00; font-weight: 700; }

        /* Speed Indicator Glass Card */
        .depth-indicator-card {
          width: 100%;
          max-width: 440px;
          padding: 28px;
          background: rgba(15, 15, 18, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 16px;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6);
        }

        .indicator-header {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 1px;
          color: #ff4d00;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .scroll-icon {
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(4px); }
        }

        .speed-rows {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
        }

        .speed-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 10px 14px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 10px;
        }

        .speed-icon {
          color: #ff4d00;
          display: flex;
          align-items: center;
        }

        .speed-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 140px;
        }

        .speed-label {
          font-size: 11px;
          font-family: var(--font-mono);
          letter-spacing: 1px;
          color: #ffffff;
          font-weight: 700;
        }

        .speed-multiplier {
          font-size: 10px;
          font-family: var(--font-mono);
          color: #888888;
        }

        .speed-bar {
          flex: 1;
          height: 4px;
          border-radius: 2px;
        }

        .fg-bar { background: linear-gradient(90deg, #ff4d00, #ff7700); width: 100%; }
        .mid-bar { background: linear-gradient(90deg, #00d2ff, #3a7bd5); width: 75%; }
        .bg-bar { background: linear-gradient(90deg, #7928ca, #ff0080); width: 45%; }

        .indicator-desc {
          font-size: 0.85rem;
          color: #a1a1aa;
          line-height: 1.5;
          margin-bottom: 20px;
        }

        .tech-pills {
          display: flex;
          gap: 8px;
        }

        .tech-tag {
          font-size: 10px;
          font-family: var(--font-mono);
          padding: 4px 10px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          color: #d4d4d8;
        }

        /* FOREGROUND LAYER (1.4x Speed - Moves Fastest) */
        .layer-fg {
          z-index: 3;
          pointer-events: none;
        }

        .fg-chip {
          position: absolute;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: rgba(255, 77, 0, 0.15);
          border: 1px solid rgba(255, 77, 0, 0.4);
          backdrop-filter: blur(12px);
          border-radius: 30px;
          color: #ffffff;
          font-family: var(--font-mono);
          font-size: 12px;
          box-shadow: 0 10px 30px rgba(255, 77, 0, 0.2);
        }

        .chip-icon { color: #ff4d00; }

        .chip-1 {
          top: 22%;
          right: 12%;
        }

        .chip-2 {
          top: 65%;
          left: 10%;
        }

        .fg-glow-card {
          position: absolute;
          bottom: 12%;
          right: 8%;
          padding: 20px 24px;
          background: rgba(20, 20, 25, 0.9);
          border: 1px solid rgba(255, 77, 0, 0.3);
          border-radius: 14px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.8), 0 0 30px rgba(255, 77, 0, 0.15);
        }

        .fg-card-title {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 15px;
          color: #ffffff;
          margin-bottom: 4px;
        }

        .fg-card-sub {
          font-size: 12px;
          color: #a1a1aa;
        }

        @media (max-width: 900px) {
          .chip-1, .chip-2, .fg-glow-card {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
