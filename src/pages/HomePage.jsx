import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hero from '../components/Hero';
import StatementSection from '../components/StatementSection';
import SelectedWorkMarquee from '../components/SelectedWorkMarquee';
import GithubContributionChart from '../components/GithubContributionChart';
import WhyBhavesh from '../components/WhyBhavesh';
import ScrollReveal from '../components/ScrollReveal';

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const containerRef = useRef(null);
  const heroWrapperRef = useRef(null);
  const sheetRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Smooth Swipe-Up Parallax Sheet Animation on Scroll
      if (sheetRef.current && heroWrapperRef.current) {
        gsap.fromTo(
          sheetRef.current,
          {
            y: 90,
            borderTopLeftRadius: 54,
            borderTopRightRadius: 54,
            boxShadow: '0 -35px 70px rgba(0, 0, 0, 0.65)',
          },
          {
            y: 0,
            borderTopLeftRadius: 36,
            borderTopRightRadius: 36,
            boxShadow: '0 -20px 45px rgba(0, 0, 0, 0.35)',
            ease: 'power2.out',
            scrollTrigger: {
              trigger: heroWrapperRef.current,
              start: 'bottom 92%',
              end: 'bottom 35%',
              scrub: 1.2,
            },
          }
        );

        // 2. Hero Background Depth Parallax (scales down slightly as sheet slides over)
        gsap.to(heroWrapperRef.current, {
          scale: 0.95,
          opacity: 0.88,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: heroWrapperRef.current,
            start: 'bottom 90%',
            end: 'bottom 15%',
            scrub: 1,
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="homepage-wrapper" ref={containerRef}>
      <div ref={heroWrapperRef} className="hero-scroll-container">
        <Hero />
      </div>

      <div ref={sheetRef} className="homepage-light-content sheet-swipe-up">
        <StatementSection />

        <SelectedWorkMarquee />

        <ScrollReveal delay={0.05}>
          <GithubContributionChart />
        </ScrollReveal>

        <ScrollReveal delay={0.05}>
          <WhyBhavesh />
        </ScrollReveal>
      </div>

      <style>{`
        .homepage-wrapper {
          width: 100%;
          overflow-x: hidden;
          background: #050507;
        }

        .hero-scroll-container {
          position: relative;
          z-index: 1;
          transform-origin: center bottom;
          will-change: transform, opacity;
        }

        .homepage-light-content {
          background: #f6f7f9;
          color: #0f172a;
          width: 100%;
          position: relative;
          z-index: 10;
          margin-top: -32px;
          border-top: 1px solid rgba(255, 255, 255, 0.35);
          will-change: transform;
        }
      `}</style>
    </div>
  );
}


