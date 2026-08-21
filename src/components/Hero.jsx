import React, { useState, useEffect } from 'react';
import { ArrowDown, Plus, Minus } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

export default function Hero() {
  const { profile } = portfolioData;
  const [coordsOpen, setCoordsOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 15;
      const y = (e.clientY / innerHeight - 0.5) * 15;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section id="home" className="north-hero-wrapper">
      {/* Background Video Layer */}
      <div className="hero-video-container">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="hero-video"
          style={{
            transform: `scale(1.05) translate(${mousePos.x}px, ${mousePos.y}px)`,
          }}
        >
          <source src="/assets/bhavesh face video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="video-overlay-gradient" />
        <div className="video-overlay-noise" />
      </div>

      {/* Hero Interactive Grid Layout */}
      <div className="hero-content-grid">
        {/* Top-Left Micro Bio Floating Blurb */}
        <div className="hero-top-left">
          <p className="micro-bio-text">
            Full-Stack / Creative Developer crafting high-performance digital experiences,
            scalable backend systems, and interactive web apps.
          </p>
          <a href="#projects" className="view-work-link">
            <span>VIEW SELECTED WORK</span>
            <ArrowDown size={14} className="arrow-down-icon" />
          </a>
        </div>

        {/* Bottom-Right Geolocation & Status Drawer */}
        <div className="hero-bottom-right">
          <div className="geo-location-box">
            <div className="geo-header">
              <span className="geo-city">MAHARASHTRA, IN</span>
              <span className="geo-coords">19.7515° N • 75.7139° E</span>
              <button
                onClick={() => setCoordsOpen(!coordsOpen)}
                className="geo-toggle-btn"
                aria-label="Toggle availability status"
              >
                {coordsOpen ? <Minus size={14} /> : <Plus size={14} />}
              </button>
            </div>

            {coordsOpen && (
              <div className="geo-drawer">
                <div className="status-indicator-row">
                  <span className="live-status-dot" />
                  <span className="status-status-text">Available for freelance & full-time roles</span>
                </div>
                <div className="time-zone-text">UTC+05:30 • IST (Local Time)</div>
              </div>
            )}
          </div>
        </div>

        {/* Giant Bottom Typography Banner */}
        <div className="hero-giant-title-container">
          <h1 className="hero-giant-title">
            BHAVESH <span className="slash-accent">/</span> PATIL
          </h1>
        </div>
      </div>

      <style>{`
        .north-hero-wrapper {
          position: relative;
          width: 100%;
          min-height: 100vh;
          background-color: #050507;
          color: #ffffff;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding-top: 100px;
        }

        .hero-video-container {
          position: absolute;
          inset: 0;
          z-index: 1;
          overflow: hidden;
        }

        .hero-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(100%) contrast(125%) brightness(0.65);
          transition: transform 0.2s ease-out;
        }

        .video-overlay-gradient {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, rgba(5,5,7,0.1) 0%, rgba(5,5,7,0.85) 85%),
                      linear-gradient(to bottom, rgba(5,5,7,0.7) 0%, transparent 25%, transparent 70%, rgba(5,5,7,0.95) 100%);
          pointer-events: none;
        }

        .video-overlay-noise {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 0);
          background-size: 24px 24px;
          opacity: 0.3;
          pointer-events: none;
        }

        .hero-content-grid {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          height: calc(100vh - 100px);
          padding: 20px 40px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .hero-top-left {
          max-width: 380px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          animation: fadeInDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .micro-bio-text {
          font-family: var(--font-body);
          font-size: 14px;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.85);
          font-weight: 400;
          letter-spacing: -0.01em;
        }

        .view-work-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-heading);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.12em;
          color: #ffffff;
          text-decoration: none;
          padding-bottom: 4px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.4);
          width: fit-content;
          transition: border-color 0.2s, transform 0.2s;
        }

        .view-work-link:hover {
          border-color: #ff4500;
          color: #ffffff;
          transform: translateY(2px);
        }

        .arrow-down-icon {
          color: #ff4500;
        }

        .hero-bottom-left {
          position: absolute;
          bottom: 150px;
          left: 40px;
        }

        .meta-text {
          font-family: var(--font-heading);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.15em;
          color: rgba(255, 255, 255, 0.6);
        }

        .hero-bottom-right {
          position: absolute;
          bottom: 150px;
          right: 40px;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .geo-location-box {
          background: rgba(15, 15, 18, 0.65);
          border: 1px solid rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(12px);
          border-radius: 12px;
          padding: 12px 16px;
          min-width: 260px;
          transition: all 0.3s ease;
        }

        .geo-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .geo-city {
          font-family: var(--font-heading);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #ffffff;
        }

        .geo-coords {
          font-family: var(--font-mono);
          font-size: 10px;
          color: rgba(255, 255, 255, 0.5);
        }

        .geo-toggle-btn {
          background: transparent;
          border: none;
          color: #ffffff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2px;
          transition: color 0.2s;
        }

        .geo-toggle-btn:hover {
          color: #ff4500;
        }

        .geo-drawer {
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          flex-direction: column;
          gap: 6px;
          animation: fadeIn 0.2s ease-out;
        }

        .status-indicator-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .live-status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #22c55e;
          box-shadow: 0 0 8px #22c55e;
        }

        .status-status-text {
          font-family: var(--font-heading);
          font-size: 11px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
        }

        .time-zone-text {
          font-size: 10px;
          color: rgba(255, 255, 255, 0.4);
          font-family: var(--font-mono);
        }

        .hero-giant-title-container {
          width: 100%;
          margin-top: auto;
          padding-bottom: 20px;
          text-align: center;
        }

        .hero-giant-title {
          font-family: var(--font-heading);
          font-size: clamp(44px, 11vw, 150px);
          font-weight: 900;
          line-height: 0.9;
          letter-spacing: -0.04em;
          color: #ffffff;
          text-transform: uppercase;
          margin: 0;
          user-select: none;
          white-space: nowrap;
        }

        .slash-accent {
          color: #ff4500;
          display: inline-block;
          margin: 0 0.05em;
          text-shadow: 0 0 30px rgba(255, 69, 0, 0.5);
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @media (max-width: 900px) {
          .hero-content-grid {
            padding: 20px;
            height: auto;
            min-height: calc(100vh - 100px);
          }

          .hero-bottom-left,
          .hero-bottom-right {
            position: relative;
            bottom: auto;
            left: auto;
            right: auto;
            margin-top: 20px;
          }

          .hero-bottom-right {
            align-items: flex-start;
          }

          .hero-giant-title {
            font-size: clamp(36px, 12vw, 80px);
            margin-top: 40px;
          }
        }
      `}</style>
    </section>
  );
}
