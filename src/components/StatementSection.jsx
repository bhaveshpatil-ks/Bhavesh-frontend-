import React from 'react';

export default function StatementSection() {
  const metrics = [
    { value: '6+', label: 'PROJECTS DELIVERED', sub: 'Full Stack & AI Apps' },
    { value: '99.9%', label: 'UPTIME / PERFORMANCE', sub: 'High Reliability Systems' },
    { value: '500+', label: 'GITHUB COMMITS', sub: 'Active Engineering' },
    { value: '4', label: 'TECH DOMAINS', sub: 'Frontend, Backend, Cloud & AI' },
  ];

  return (
    <section className="statement-section">
      {/* Visual Sheet Pull Handle Bar */}
      <div className="sheet-pull-indicator">
        <span className="pull-bar" />
      </div>

      <div className="statement-container">
        {/* Section Label */}
        <div className="statement-badge">
          <span>01 / PHILOSOPHY & METRICS</span>
        </div>

        {/* Statement Main Headline */}
        <h2 className="statement-headline">
          I build resilient web applications where <span className="highlight-text">clean architecture</span>,
          motion, and performance become one single language.
        </h2>

        {/* 4-Column Metrics Grid */}
        <div className="metrics-grid">
          {metrics.map((item, idx) => (
            <div key={idx} className="metric-card">
              <div className="metric-value">{item.value}</div>
              <div className="metric-label">{item.label}</div>
              <div className="metric-sub">{item.sub}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .statement-section {
          width: 100%;
          background-color: #f6f7f9;
          color: #0f172a;
          padding: 60px 20px 100px;
          border-top-left-radius: 36px;
          border-top-right-radius: 36px;
          margin-top: -24px;
          position: relative;
          z-index: 10;
          box-shadow: 0 -20px 45px rgba(0, 0, 0, 0.35);
          border-top: 1px solid rgba(255, 255, 255, 0.4);
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
        }

        .sheet-pull-indicator {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 36px;
        }

        .pull-bar {
          width: 48px;
          height: 5px;
          border-radius: 9999px;
          background: rgba(0, 0, 0, 0.15);
          transition: width 0.3s ease, background 0.3s ease;
        }

        .statement-section:hover .pull-bar {
          width: 64px;
          background: #ff4500;
        }

        .statement-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 48px;
        }

        .statement-badge {
          font-family: var(--font-heading);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.15em;
          color: #64748b;
          text-transform: uppercase;
        }

        .statement-headline {
          font-family: var(--font-heading);
          font-size: clamp(28px, 4.5vw, 54px);
          font-weight: 800;
          line-height: 1.15;
          letter-spacing: -0.02em;
          max-width: 1050px;
          color: #09090b;
        }

        .highlight-text {
          color: #ff4500;
          border-bottom: 2px solid #ff4500;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          margin-top: 20px;
          padding-top: 40px;
          border-top: 1px solid rgba(0, 0, 0, 0.08);
        }

        .metric-card {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .metric-value {
          font-family: var(--font-heading);
          font-size: clamp(32px, 3.5vw, 48px);
          font-weight: 900;
          letter-spacing: -0.03em;
          color: #09090b;
        }

        .metric-label {
          font-family: var(--font-heading);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: #475569;
          text-transform: uppercase;
        }

        .metric-sub {
          font-size: 12px;
          color: #64748b;
        }

        @media (max-width: 900px) {
          .metrics-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 550px) {
          .metrics-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
