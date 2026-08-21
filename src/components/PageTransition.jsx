import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function PageTransition({ onComplete }) {
  const panel1 = useRef(null);
  const panel2 = useRef(null);
  const panel3 = useRef(null);
  const logoRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        if (wrapperRef.current) {
          wrapperRef.current.style.display = 'none';
        }
        onComplete?.();
      },
    });

    // Start: all panels covering viewport
    gsap.set([panel1.current, panel2.current, panel3.current], {
      yPercent: 0,
    });
    gsap.set(logoRef.current, { opacity: 1, scale: 0.85 });

    // Step 1: animate logo in
    tl.to(logoRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.6,
      ease: 'power3.out',
    });

    // Step 2: hold a beat
    tl.to({}, { duration: 0.4 });

    // Step 3: panels slide up with stagger, revealing content
    tl.to(
      [panel3.current, panel2.current, panel1.current],
      {
        yPercent: -100,
        duration: 0.75,
        ease: 'power4.inOut',
        stagger: 0.09,
      }
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div ref={wrapperRef} className="page-transition-root" aria-hidden="true">
      <div ref={panel1} className="pt-panel pt-panel-1" />
      <div ref={panel2} className="pt-panel pt-panel-2" />
      <div ref={panel3} className="pt-panel pt-panel-3" />

      {/* Centered intro logo */}
      <div className="pt-logo-center">
        <div ref={logoRef} className="pt-logo-mark">
          <span className="pt-logo-name">BHAVESH</span>
          <span className="pt-logo-slash">/</span>
          <span className="pt-logo-dev">KAI</span>
        </div>
      </div>

      <style>{`
        .page-transition-root {
          position: fixed;
          inset: 0;
          z-index: 9998;
          pointer-events: none;
        }

        .pt-panel {
          position: fixed;
          left: 0;
          right: 0;
          will-change: transform;
        }

        .pt-panel-1 {
          top: 0;
          height: 34vh;
          background: #09090b;
        }

        .pt-panel-2 {
          top: 33vh;
          height: 34vh;
          background: #111113;
        }

        .pt-panel-3 {
          top: 66vh;
          height: 34vh;
          background: #09090b;
        }

        .pt-logo-center {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          pointer-events: none;
        }

        .pt-logo-mark {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-heading, 'Space Grotesk', sans-serif);
          font-size: clamp(32px, 5vw, 64px);
          font-weight: 900;
          letter-spacing: -0.02em;
          opacity: 0;
        }

        .pt-logo-name {
          color: #ffffff;
        }

        .pt-logo-slash {
          color: #ff4500;
          font-weight: 900;
        }

        .pt-logo-dev {
          color: #71717a;
        }
      `}</style>
    </div>
  );
}
