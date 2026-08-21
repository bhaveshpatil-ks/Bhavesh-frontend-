import React from 'react';
import { portfolioData } from '../data/portfolioData';

export default function ExperienceSection() {
  const { experience, education } = portfolioData;

  return (
    <section id="experience-grid-details" className="north-experience-section">
      <div className="container">
        {/* Editorial Section Header */}
        <div className="section-header-editorial">
          <span className="section-index-badge">06 / CAREER & LEARNING</span>
          <h2 className="section-title-editorial">Experience & Education</h2>
          <p className="section-subtitle-editorial">
            Engineering journey across production systems, full stack development, and computer science fundamentals.
          </p>
        </div>

        <div className="north-experience-grid">
          {/* Experience Column Card */}
          <div className="north-exp-card">
            <div className="card-corner-motif" />
            <div className="exp-card-header">
              <span className="exp-card-index">01 / WORK EXPERIENCE</span>
            </div>

            <div className="exp-timeline">
              {experience.map((item, idx) => (
                <div key={idx} className="exp-timeline-item">
                  <div className="exp-timeline-year">{item.period}</div>
                  <h3 className="exp-timeline-role">{item.role}</h3>
                  <div className="exp-timeline-company">{item.company}</div>
                  <p className="exp-timeline-desc">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Education Column Card */}
          <div className="north-exp-card">
            <div className="card-corner-motif" />
            <div className="exp-card-header">
              <span className="exp-card-index">02 / EDUCATION</span>
            </div>

            <div className="exp-timeline">
              {education.map((item, idx) => (
                <div key={idx} className="exp-timeline-item">
                  <div className="exp-timeline-year">{item.year}</div>
                  <h3 className="exp-timeline-role">{item.degree}</h3>
                  <div className="exp-timeline-company">{item.institution}</div>
                  <p className="exp-timeline-desc">{item.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .north-experience-section {
          padding: 100px 0;
          border-bottom: 1px solid var(--card-border);
          background-color: #0a0a0a;
        }

        .north-experience-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 32px;
        }

        .north-exp-card {
          position: relative;
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: var(--radius-card);
          padding: 40px;
          display: flex;
          flex-direction: column;
        }

        .exp-card-index {
          font-family: var(--font-heading);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.12em;
          color: #ff4500;
          display: block;
          margin-bottom: 24px;
        }

        .exp-timeline {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .exp-timeline-item {
          border-left: 2px solid var(--card-border);
          padding-left: 20px;
          position: relative;
        }

        .exp-timeline-year {
          font-family: var(--font-mono);
          font-size: 12px;
          font-weight: 700;
          color: #ff4500;
          margin-bottom: 6px;
        }

        .exp-timeline-role {
          font-family: var(--font-heading);
          font-size: 20px;
          font-weight: 800;
          line-height: 1.2;
          color: var(--text-bold);
          margin-bottom: 4px;
        }

        .exp-timeline-company {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-muted);
          margin-bottom: 10px;
        }

        .exp-timeline-desc {
          font-size: 14px;
          line-height: 1.6;
          color: var(--text-secondary);
        }

        @media (max-width: 900px) {
          .north-experience-grid {
            grid-template-columns: 1fr;
          }

          .north-exp-card {
            padding: 28px;
          }
        }
      `}</style>
    </section>
  );
}
