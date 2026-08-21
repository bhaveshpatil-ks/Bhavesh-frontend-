import React, { useRef, useCallback } from 'react';
import { gsap } from 'gsap';

/**
 * MagneticButton — 21st.dev-style magnetic hover effect.
 * The button physically leans toward the cursor on hover.
 */
export default function MagneticButton({ children, className = '', strength = 0.35, ...props }) {
  const btnRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * strength;
    const dy = (e.clientY - cy) * strength;

    gsap.to(btn, {
      x: dx,
      y: dy,
      duration: 0.4,
      ease: 'power2.out',
    });
  }, [strength]);

  const handleMouseLeave = useCallback(() => {
    gsap.to(btnRef.current, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.4)',
    });
  }, []);

  return (
    <span
      ref={btnRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`magnetic-wrap ${className}`}
      style={{ display: 'inline-block' }}
      {...props}
    >
      {children}
    </span>
  );
}
