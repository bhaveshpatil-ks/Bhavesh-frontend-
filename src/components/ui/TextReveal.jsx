import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * TextReveal — 21st.dev-style character-by-character stagger text reveal.
 * Splits text into individual character spans and animates them in
 * with a staggered GSAP timeline when the element enters the viewport.
 */
export default function TextReveal({
  text,
  as: Tag = 'h2',
  className = '',
  stagger = 0.022,
  delay = 0,
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const chars = container.querySelectorAll('.tr-char');
    if (!chars.length) return;

    gsap.fromTo(
      chars,
      { opacity: 0, y: '110%' },
      {
        opacity: 1,
        y: '0%',
        duration: 0.65,
        stagger,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 90%',
          once: true,
        },
      }
    );
  }, [stagger, delay]);

  const words = text.split(' ');

  return (
    <Tag ref={containerRef} className={`text-reveal-root ${className}`}>
      {words.map((word, wi) => (
        <span key={wi} className="tr-word">
          {word.split('').map((char, ci) => (
            <span key={ci} className="tr-char" style={{ opacity: 0 }}>
              {char}
            </span>
          ))}
          {wi < words.length - 1 && (
            <span className="tr-char" style={{ opacity: 0 }}>
              &nbsp;
            </span>
          )}
        </span>
      ))}

      <style>{`
        .text-reveal-root {
          overflow: visible;
        }
        .tr-word {
          display: inline-block;
          overflow: hidden;
          line-height: inherit;
        }
        .tr-char {
          display: inline-block;
          will-change: transform, opacity;
        }
      `}</style>
    </Tag>
  );
}
