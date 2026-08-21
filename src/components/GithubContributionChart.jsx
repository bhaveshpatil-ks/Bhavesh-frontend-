import React from 'react';

export default function GithubContributionChart() {
  return (
    <section className="gh-contrib-section">
      <div className="container">
        <div className="gh-contrib-card">
          <div className="card-corner-motif" />

          <div className="gh-contrib-header">
            <span className="section-index-badge" style={{ marginBottom: '8px' }}>GITHUB ACTIVITY</span>
            <h3 className="gh-contrib-title">Contribution Graph</h3>
            <p className="gh-contrib-subtitle">A snapshot of consistent commits, pull requests, and open-source work.</p>
          </div>

          <div className="gh-contrib-img-wrap">
            {/* Dark mode chart */}
            <img
              src="/assets/github-dark.webp"
              alt="GitHub Contribution Chart - Dark"
              className="gh-chart gh-chart-dark"
              loading="lazy"
            />
            {/* Light mode chart */}
            <img
              src="/assets/github-light.webp"
              alt="GitHub Contribution Chart - Light"
              className="gh-chart gh-chart-light"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      <style>{`
        .gh-contrib-section {
          padding: 60px 0 0 0;
          background: #f6f7f9;
        }

        .gh-contrib-card {
          position: relative;
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.08);
          box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.02);
          border-radius: var(--radius-card);
          padding: 44px 44px 36px;
          overflow: hidden;
        }

        .gh-contrib-header {
          margin-bottom: 28px;
        }

        .section-index-badge {
          display: inline-block;
          font-family: var(--font-heading);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.15em;
          color: #64748b;
          text-transform: uppercase;
        }

        .gh-contrib-title {
          font-family: var(--font-heading);
          font-size: clamp(24px, 3.2vw, 36px);
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #09090b;
          margin-bottom: 6px;
        }

        .gh-contrib-subtitle {
          font-size: 14px;
          color: #64748b;
          line-height: 1.55;
          max-width: 520px;
        }

        .gh-contrib-img-wrap {
          width: 100%;
          border-radius: var(--radius-inner);
          overflow: hidden;
        }

        .gh-chart {
          width: 100%;
          height: auto;
          display: block;
          border-radius: var(--radius-inner);
        }

        .gh-chart-light { display: none; }
        .gh-chart-dark  { display: block; }

        @media (max-width: 820px) {
          .gh-contrib-card {
            padding: 28px 20px 24px;
          }
        }
      `}</style>
    </section>
  );
}
