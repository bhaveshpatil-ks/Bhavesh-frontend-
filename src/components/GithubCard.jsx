import React, { useState } from 'react';
import { Search, BookOpen, Bookmark, Star, MapPin, Mail, Briefcase, Users, Heart } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

export default function GithubCard() {
  const { profile, githubPinnedRepos } = portfolioData;
  const [activeYear, setActiveYear] = useState('2026');

  // Generate 52 weeks x 7 days heatmap grid matrix
  const generateContributionHeatmap = () => {
    const weeks = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let w = 0; w < 48; w++) {
      const days = [];
      for (let d = 0; d < 7; d++) {
        let level = 0;
        if (w >= 16 && w <= 20) {
          if (d === 1 || d === 3 || d === 5) level = (w + d) % 3 + 1;
        } else if (w % 7 === 0 && d === 2) {
          level = 1;
        }
        days.push(level);
      }
      weeks.push(days);
    }
    return { weeks, months };
  };

  const { weeks, months } = generateContributionHeatmap();

  return (
    <section id="github" className="north-github-section">
      <div className="container">
        {/* Editorial Header */}
        <div className="section-header-editorial">
          <span className="section-index-badge">04 / REPOSITORIES</span>
          <h2 className="section-title-editorial">GitHub Engineering & Commits</h2>
          <p className="section-subtitle-editorial">
            Open-source contributions, pinned repositories, and daily development activity log.
          </p>
        </div>

        <div className="github-browser-card">
          {/* Corner motif */}
          <div className="card-corner-motif" />

          {/* Browser Top Navbar */}
          <div className="github-nav-bar">
            <div className="github-nav-left">
              <span className="github-username-header">{profile.handle} / OVERVIEW</span>
            </div>
            <div className="github-search-box">
              <Search size={13} />
              <span>Filter repositories...</span>
            </div>
          </div>

          {/* Main GitHub Profile Body */}
          <div className="github-body">
            {/* Sidebar Profile Info */}
            <aside className="github-sidebar">
              <div className="github-avatar-container">
                <img src={profile.githubAvatar} alt="GitHub Avatar" className="github-avatar" />
              </div>

              <h3 className="github-name">{profile.name} {profile.lastName}</h3>
              <div className="github-handle">@{profile.handle}</div>
              <p className="github-bio">{profile.bio}</p>

              <div className="github-meta-list">
                <div className="github-meta-item">
                  <Users size={14} />
                  <span><strong>{profile.followers}</strong> follower · <strong>{profile.following}</strong> following</span>
                </div>
                <div className="github-meta-item">
                  <Briefcase size={14} />
                  <span>{profile.workType}</span>
                </div>
                <div className="github-meta-item">
                  <MapPin size={14} />
                  <span>{profile.location}</span>
                </div>
              </div>
            </aside>

            {/* Pinned Repositories Area */}
            <main className="github-content">
              <div className="pinned-header">
                <span className="pinned-title">PINNED REPOSITORIES</span>
              </div>

              <div className="pinned-grid">
                {githubPinnedRepos.map((repo, idx) => (
                  <div key={repo.id} className="repo-card north-card-relative">
                    <div className="repo-card-header">
                      <a href={repo.url} target="_blank" rel="noopener noreferrer" className="repo-name">
                        <span>0{idx + 1} / {repo.name}</span>
                      </a>
                    </div>

                    <p className="repo-desc">{repo.description}</p>

                    <div className="repo-footer">
                      {repo.language && (
                        <span className="pill-outline-tag">{repo.language}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </main>
          </div>
        </div>
      </div>

      <style>{`
        .north-github-section {
          padding: 100px 0;
          border-bottom: 1px solid var(--card-border);
        }

        .github-browser-card {
          position: relative;
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: var(--radius-card);
          overflow: hidden;
        }

        .github-nav-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          border-bottom: 1px solid var(--card-border);
          background: rgba(0, 0, 0, 0.03);
          font-family: var(--font-heading);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.1em;
        }

        .github-search-box {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border: 1px solid var(--card-border);
          border-radius: 9999px;
          font-size: 11px;
          color: var(--text-muted);
        }

        .github-body {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 40px;
          padding: 40px;
        }

        .github-avatar {
          width: 100%;
          aspect-ratio: 1;
          border-radius: 50%;
          object-fit: cover;
          border: 1px solid var(--card-border);
          margin-bottom: 16px;
        }

        .github-name {
          font-family: var(--font-heading);
          font-size: 20px;
          font-weight: 800;
          margin-bottom: 4px;
          color: var(--text-bold);
        }

        .github-handle {
          font-family: var(--font-mono);
          font-size: 12px;
          color: #ff4500;
          margin-bottom: 16px;
        }

        .github-bio {
          font-size: 13px;
          line-height: 1.6;
          color: var(--text-secondary);
          margin-bottom: 20px;
        }

        .github-meta-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          font-size: 12px;
          color: var(--text-muted);
        }

        .github-meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .pinned-header {
          margin-bottom: 20px;
          font-family: var(--font-heading);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.12em;
          color: var(--text-muted);
        }

        .pinned-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .repo-card {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: var(--radius-inner);
          padding: 24px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: border-color 0.2s, transform 0.2s;
        }

        .repo-card:hover {
          transform: translateY(-2px);
          border-color: #ff4500;
        }

        .repo-name {
          font-family: var(--font-heading);
          font-size: 15px;
          font-weight: 800;
          color: var(--text-bold);
          text-decoration: none;
          display: block;
          margin-bottom: 10px;
        }

        .repo-desc {
          font-size: 13px;
          line-height: 1.5;
          color: var(--text-secondary);
          margin-bottom: 20px;
        }

        @media (max-width: 900px) {
          .github-body {
            grid-template-columns: 1fr;
            padding: 24px;
          }

          .pinned-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}

