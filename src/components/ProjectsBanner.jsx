import React from 'react';
import { Folder, ArrowUpRight } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

export default function ProjectsBanner() {
  const { projectsBanner } = portfolioData;

  return (
    <section className="projects-banner-section">
      <div className="container">
        <div className="projects-banner-card">
          <div className="banner-content">
            <span className="banner-badge">{projectsBanner.badge}</span>
            <h2 className="banner-title">
              {projectsBanner.titlePrefix}
              <span className="banner-title-muted">{projectsBanner.titleSuffix}</span>
            </h2>
            <p className="banner-desc">{projectsBanner.description}</p>
          </div>

          <a href="#projects" className="banner-action-card">
            <div className="action-top">
              <Folder size={18} className="folder-icon" />
              <span>{projectsBanner.buttonTitle}</span>
            </div>
            <div className="action-bottom">
              <span>{projectsBanner.buttonSubtitle}</span>
            </div>
          </a>
        </div>
      </div>

      <style>{`
        .projects-banner-section {
          padding: 40px 0 60px 0;
        }

        .projects-banner-card {
          width: 100%;
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: var(--radius-card);
          box-shadow: var(--card-shadow);
          padding: 40px 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
        }

        .banner-content {
          max-width: 620px;
        }

        .banner-badge {
          display: inline-block;
          padding: 3px 10px;
          background: var(--badge-bg);
          color: var(--badge-text);
          border: 1px solid var(--badge-border);
          border-radius: var(--radius-full);
          font-family: var(--font-heading);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          margin-bottom: 16px;
        }

        .banner-title {
          font-size: clamp(26px, 4vw, 38px);
          font-weight: 900;
          line-height: 1.15;
          margin-bottom: 14px;
          color: var(--text-bold);
        }

        .banner-title-muted {
          color: var(--text-muted);
          font-weight: 800;
        }

        .banner-desc {
          font-size: 14px;
          line-height: 1.6;
          color: var(--text-secondary);
        }

        /* Right Action Button Box */
        .banner-action-card {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 16px 24px;
          background: var(--btn-dark-bg);
          color: var(--btn-dark-text);
          border-radius: 18px;
          text-decoration: none;
          min-width: 220px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s;
        }

        .banner-action-card:hover {
          transform: translateY(-3px);
          background: #27272a;
        }

        .action-top {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-heading);
          font-size: 15px;
          font-weight: 800;
        }

        .folder-icon {
          color: #ffffff;
        }

        .action-bottom {
          font-family: var(--font-heading);
          font-size: 12px;
          color: var(--text-muted);
          font-weight: 600;
        }

        @media (max-width: 860px) {
          .projects-banner-card {
            flex-direction: column;
            align-items: flex-start;
            padding: 32px 24px;
          }

          .banner-action-card {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
