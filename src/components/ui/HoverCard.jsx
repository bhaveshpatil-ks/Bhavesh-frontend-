import React, { useRef, useCallback } from 'react';
import { gsap } from 'gsap';

/**
 * HoverCard — 21st.dev-style 3D tilt + cursor gradient shine effect.
 * Wraps any card content. Mouse-follow tilt using GSAP + CSS perspective.
 */
export default function HoverCard({ children, className = '', intensity = 12 }) {
  const cardRef = useRef(null);
  const shineRef = useRef(null);

  const handleMouseMove = useCallback(
    (e) => {
      const card = cardRef.current;
      const shine = shineRef.current;
      if (!card || !shine) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;

      const rotateX = ((y - cy) / cy) * -intensity;
      const rotateY = ((x - cx) / cx) * intensity;

      gsap.to(card, {
        rotateX,
        rotateY,
        transformPerspective: 900,
        duration: 0.4,
        ease: 'power2.out',
      });

      // Move shine gradient toward cursor
      const shineX = (x / rect.width) * 100;
      const shineY = (y / rect.height) * 100;
      gsap.to(shine, {
        opacity: 0.12,
        background: `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255,255,255,0.7) 0%, transparent 65%)`,
        duration: 0.3,
      });
    },
    [intensity]
  );

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    const shine = shineRef.current;
    if (!card || !shine) return;

    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.7,
      ease: 'elastic.out(1, 0.5)',
    });

    gsap.to(shine, {
      opacity: 0,
      duration: 0.4,
    });
  }, []);

  return (
    <div
      ref={cardRef}
      className={`hover-card-root ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
    >
      {/* Shine overlay */}
      <div
        ref={shineRef}
        className="hover-card-shine"
        style={{ opacity: 0, pointerEvents: 'none' }}
      />
      {children}

      <style>{`
        .hover-card-root {
          position: relative;
          cursor: default;
        }
        .hover-card-shine {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          z-index: 2;
          mix-blend-mode: overlay;
        }
      `}</style>
    </div>
  );
}
