import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Github, Mail, User, Info, Sparkles, Coffee } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';
import { toast } from './ui/toast';

export default function MegaFooter() {
  const { profile } = portfolioData;

  const handleAdminClick = (e) => {
    e.preventDefault();
    toast({
      title: 'Admin Access',
      description: 'Admin dashboard is private. Authenticate via GitHub.',
      variant: 'default',
      duration: 3500,
    });
  };

  const handleAboutWebClick = (e) => {
    e.preventDefault();
    toast({
      title: 'About This Portfolio',
      description: 'Built with React, Vite, GSAP animations, Lucide icons, and modern full-stack architecture.',
      variant: 'default',
      duration: 4000,
    });
  };

  const handleCoffeeClick = (e) => {
    e.preventDefault();
    toast({
      title: 'Buy Me a Coffee ☕',
      description: 'Thanks for the appreciation! Connect on WhatsApp or GitHub to support.',
      variant: 'default',
      duration: 4000,
    });
  };

  return (
    <footer className="north-footer-section">
      <div className="container">
        <div className="north-footer-card">
          <div className="footer-row">
            {/* Left Bio Section */}
            <div className="mega-footer-bio">
              <h2 className="mega-footer-title">
                {profile.name} <span className="title-secondary">{profile.lastName}</span>
              </h2>
              <p className="mega-footer-desc">
                Full stack developer building clean, scalable, and production-ready web experiences with strong attention to performance and detail.
              </p>
            </div>

            {/* Right Action Link Grid (10 Pill Buttons) */}
            <div className="mega-footer-grid">
              {/* Row 1: Home & Projects */}
              <Link to="/" className="btn-pill btn-pill-white">
                <span>Home</span>
                <ArrowUpRight size={14} className="pill-arrow" />
              </Link>

              <Link to="/projects" className="btn-pill btn-pill-white">
                <span>Projects</span>
                <ArrowUpRight size={14} className="pill-arrow" />
              </Link>

              {/* Row 2: Skills & Experience */}
              <Link to="/tech-stack" className="btn-pill btn-pill-white">
                <span>Skills</span>
                <ArrowUpRight size={14} className="pill-arrow" />
              </Link>

              <Link to="/education" className="btn-pill btn-pill-white">
                <span>Experience</span>
                <ArrowUpRight size={14} className="pill-arrow" />
              </Link>

              {/* Row 3: GitHub & Contact */}
              <a
                href={`https://github.com/${profile.handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-pill btn-pill-dark"
              >
                <Github size={15} className="pill-icon" />
                <span>GitHub</span>
              </a>

              <Link to="/contact" className="btn-pill btn-pill-dark">
                <Mail size={15} className="pill-icon" />
                <span>Contact</span>
              </Link>

              {/* Row 4: Admin & About this web */}
              <Link
                to="/admin"
                className="btn-pill btn-pill-gray"
              >
                <User size={15} className="pill-icon" />
                <span>Admin</span>
              </Link>

              <button
                type="button"
                onClick={handleAboutWebClick}
                className="btn-pill btn-pill-gray"
              >
                <Info size={15} className="pill-icon" />
                <span>About this web</span>
              </button>

              {/* Row 5: Sparse & Buy me a coffee */}
              <a
                href="https://github.com/bhaveshpatil-ks"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-pill btn-pill-dark"
              >
                <Sparkles size={15} className="pill-icon" />
                <span>Sparse</span>
              </a>

              <Link
                to="/buy-me-a-coffee"
                className="btn-pill btn-pill-yellow"
              >
                <Coffee size={15} className="pill-icon" />
                <span>Buy me a coffee</span>
                <ArrowUpRight size={14} className="pill-arrow" />
              </Link>
            </div>
          </div>

          {/* Bottom Copyright Notice */}
          <div className="footer-copyright">
            <div className="copyright-text">
              © {new Date().getFullYear()} {profile.name} {profile.lastName}. All rights reserved.
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .north-footer-section {
          padding: 30px 0 20px;
          background: #050505;
          color: #ffffff;
          width: 100%;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          box-sizing: border-box;
        }

        .container {
          max-width: 1440px;
          width: 100%;
          margin: 0 auto;
          padding: 0 40px;
          box-sizing: border-box;
        }

        .north-footer-card {
          position: relative;
          width: 100%;
          background: rgba(18, 18, 22, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-radius: 20px;
          padding: 28px 36px;
          overflow: hidden;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.6);
          box-sizing: border-box;
        }

        .footer-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 36px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          width: 100%;
        }

        .mega-footer-bio {
          flex: 1.1;
          max-width: 500px;
        }

        .mega-footer-title {
          font-family: var(--font-heading);
          font-size: clamp(24px, 2.8vw, 34px);
          font-weight: 900;
          line-height: 1.05;
          letter-spacing: -0.03em;
          margin-bottom: 8px;
          color: #ffffff;
        }

        .title-secondary {
          color: #71717a;
          font-weight: 800;
        }

        .mega-footer-desc {
          font-size: 0.88rem;
          line-height: 1.5;
          color: #a1a1aa;
          font-weight: 400;
        }

        /* ─── 2-Column Pill Button Grid ─────────────── */
        .mega-footer-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          flex: 1;
          max-width: 480px;
          width: 100%;
          box-sizing: border-box;
        }

        .btn-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 8px 16px;
          border-radius: 9999px;
          font-family: var(--font-heading);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: -0.01em;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          border: 1px solid transparent;
          white-space: nowrap;
          box-sizing: border-box;
          user-select: none;
        }

        .btn-pill:hover {
          transform: translateY(-1px);
        }

        .pill-icon {
          flex-shrink: 0;
        }

        .pill-arrow {
          margin-left: auto;
          color: #71717a;
          transition: transform 0.2s ease, color 0.2s ease;
        }

        .btn-pill-white:hover .pill-arrow {
          color: #09090b;
          transform: translate(2px, -2px);
        }

        /* White Variant (Home, Projects, Skills, Experience) */
        .btn-pill-white {
          background: #ffffff;
          color: #09090b;
          border-color: rgba(255, 255, 255, 0.9);
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
          justify-content: space-between;
        }

        .btn-pill-white:hover {
          background: #f4f4f5;
          box-shadow: 0 6px 20px rgba(255, 255, 255, 0.2);
        }

        /* Dark Variant (GitHub, Contact, Sparse) */
        .btn-pill-dark {
          background: #18181b;
          color: #ffffff;
          border-color: rgba(255, 255, 255, 0.12);
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
        }

        .btn-pill-dark:hover {
          background: #27272a;
          border-color: rgba(255, 255, 255, 0.25);
          color: #ffffff;
        }

        /* Gray/Silver Variant (Admin, About this web) */
        .btn-pill-gray {
          background: #d4d4d8;
          color: #18181b;
          border-color: #e4e4e7;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
        }

        .btn-pill-gray:hover {
          background: #e4e4e7;
          color: #09090b;
        }

        /* Yellow Variant (Buy me a coffee) */
        .btn-pill-yellow {
          background: #ffdd00;
          color: #000000;
          border-color: #ffd000;
          box-shadow: 0 4px 16px rgba(255, 221, 0, 0.3);
          font-weight: 800;
        }

        .btn-pill-yellow:hover {
          background: #ffe524;
          box-shadow: 0 6px 22px rgba(255, 221, 0, 0.45);
          transform: translateY(-1px) scale(1.01);
        }

        /* Bottom Copyright */
        .footer-copyright {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 16px;
          font-size: 11px;
          color: #52525b;
          font-family: var(--font-mono);
        }

        /* ─── Responsive Media Queries ──────────────── */
        @media (max-width: 960px) {
          .container {
            padding: 0 20px;
          }

          .north-footer-card {
            padding: 24px 22px;
          }

          .footer-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
          }

          .mega-footer-bio {
            max-width: 100%;
          }

          .mega-footer-grid {
            max-width: 100%;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
          }
        }

        @media (max-width: 520px) {
          .north-footer-section {
            padding: 16px 0 14px;
          }

          .container {
            padding: 0 14px;
          }

          .north-footer-card {
            padding: 20px 16px;
            border-radius: 16px;
          }

          .footer-row {
            gap: 16px;
            padding-bottom: 14px;
          }

          .mega-footer-title {
            font-size: 22px;
            margin-bottom: 4px;
          }

          .mega-footer-desc {
            font-size: 0.8rem;
            line-height: 1.45;
          }

          .mega-footer-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 6px;
          }

          .btn-pill {
            padding: 7px 10px;
            font-size: 11px;
            gap: 5px;
            min-height: 36px;
          }

          .btn-pill span {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .footer-copyright {
            margin-top: 12px;
            font-size: 10px;
            justify-content: center;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
}

