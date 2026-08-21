import React, { useState } from 'react';
import { portfolioData } from '../data/portfolioData';
import ScrollReveal from '../components/ScrollReveal';
import TextReveal from '../components/ui/TextReveal';
import MagneticButton from '../components/ui/MagneticButton';
import { Github, ExternalLink, Star, Code } from 'lucide-react';

const ProjectsPage = () => {
  const [filter, setFilter] = useState('ALL');
  const categories = ['ALL', 'FULLSTACK', 'AI', 'MOBILE', 'CLOUD'];

  const filteredProjects = portfolioData.projects.filter((project) => {
    if (filter === 'ALL') return true;
    const tags = project.tags.map(t => t.toUpperCase());
    const tagString = tags.join(' ');
    
    if (filter === 'FULLSTACK') {
      return tagString.includes('FULLSTACK') || tagString.includes('MERN') || (tagString.includes('REACT') && tagString.includes('NODE'));
    }
    if (filter === 'AI') {
      return tagString.includes('AI') || tagString.includes('GPT-4O') || tagString.includes('OLLAMA') || tagString.includes('VISION');
    }
    if (filter === 'MOBILE') {
      return tagString.includes('MOBILE') || tagString.includes('ANDROID') || tagString.includes('NATIVE');
    }
    if (filter === 'CLOUD') {
      return tagString.includes('CLOUD') || tagString.includes('FIREBASE') || tagString.includes('NODEMAILER');
    }
    return true;
  });

  return (
    <div className="projects-page">
      <div className="hero-section">
        <ScrollReveal>
          <div className="projects-badge">
            <span className="badge-slash">//</span>
            <span>PORTFOLIO SHOWCASE</span>
          </div>

          <TextReveal 
            text="Selected Projects" 
            as="h1" 
            className="proj-hero-title"
          />
          <p className="hero-subtitle">
            A curated collection of production-ready full-stack applications, real-time AI tools, mobile platforms, and educator workspaces.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="filter-row">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`filter-pill ${filter === cat ? 'active' : ''}`}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </ScrollReveal>
      </div>

      <div className="projects-grid">
        {filteredProjects.map((project, index) => (
          <ScrollReveal key={project.id} delay={0.06 * (index % 6)}>
            {/* Compact Uiverse Glassmorphism Card */}
            <div className="uiverse-project-card">
              {/* Compact Repo Bar Header */}
              <div className="repo-bar">
                <div className="repo-bar-left">
                  <Code size={14} className="repo-icon" />
                  <span className="repo-name">{project.repoName || project.title}</span>
                  <span className="visibility-badge">Public</span>
                </div>
                {project.stars > 0 && (
                  <div className="star-badge">
                    <Star size={13} className="star-icon" />
                    <span>{project.stars}</span>
                  </div>
                )}
              </div>

              {/* Compact Project Image */}
              <div className="project-image-wrapper">
                <span className="project-index">
                  {(index + 1).toString().padStart(2, '0')}
                </span>
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="project-image"
                />
              </div>

              {/* Compact Card Content */}
              <div className="project-content">
                <div className="project-tags">
                  {project.tags?.slice(0, 4).map((tag, i) => (
                    <span key={i} className="tag-pill">{tag}</span>
                  ))}
                </div>

                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>

                <div className="project-actions">
                  {project.github && (
                    <MagneticButton strength={0.25}>
                      <a href={project.github} target="_blank" rel="noopener noreferrer" className="action-button primary">
                        <span>Code</span>
                        <Github size={14} />
                      </a>
                    </MagneticButton>
                  )}
                  {project.demo && (
                    <MagneticButton strength={0.25}>
                      <a href={project.demo} target="_blank" rel="noopener noreferrer" className="action-button secondary">
                        <span>Live</span>
                        <ExternalLink size={14} />
                      </a>
                    </MagneticButton>
                  )}
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      <style>{`
        .projects-page {
          min-height: 100vh;
          padding-top: 100px;
          padding-bottom: 100px;
          background: #0a0a0a;
          color: #ffffff;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .hero-section {
          max-width: 1240px;
          margin: 0 auto;
          padding: 30px 24px;
        }

        .projects-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 2px;
          color: #888888;
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .badge-slash { color: #ff4d00; font-weight: 900; }

        .proj-hero-title {
          font-family: var(--font-heading) !important;
          font-size: clamp(32px, 5vw, 60px) !important;
          font-weight: 900 !important;
          letter-spacing: -0.03em;
          color: #ffffff;
          line-height: 1.05;
        }

        .hero-subtitle {
          font-size: 1.05rem;
          color: #a1a1aa;
          margin-top: 0.8rem;
          max-width: 600px;
          line-height: 1.55;
        }

        .filter-row {
          display: flex;
          gap: 10px;
          margin-top: 28px;
          flex-wrap: wrap;
        }

        .filter-pill {
          padding: 6px 18px;
          border-radius: 100px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.03);
          color: #a1a1aa;
          font-family: var(--font-mono);
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .filter-pill:hover {
          border-color: rgba(255, 77, 0, 0.5);
          color: #ffffff;
        }

        .filter-pill.active {
          background: #ff4d00;
          color: #ffffff;
          border-color: #ff4d00;
          box-shadow: 0 0 16px rgba(255, 77, 0, 0.4);
        }

        .projects-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          max-width: 1240px;
          margin: 36px auto 0;
          padding: 0 24px;
        }

        @media (max-width: 1080px) {
          .projects-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 680px) {
          .projects-grid {
            grid-template-columns: 1fr;
          }
        }

        .uiverse-project-card {
          box-sizing: border-box;
          width: 100%;
          background: rgba(18, 18, 22, 0.78);
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 8px 12px 35px rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          display: flex;
          flex-direction: column;
          user-select: none;
          overflow: hidden;
          height: 100%;
        }

        .uiverse-project-card:hover {
          border: 1px solid #ff4d00;
          transform: scale(1.03);
          box-shadow: 10px 15px 40px rgba(0, 0, 0, 0.65), 0 0 25px rgba(255, 77, 0, 0.22);
        }

        .uiverse-project-card:active {
          transform: scale(0.96) rotateZ(1.5deg);
        }

        .repo-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 16px;
          background: rgba(255, 255, 255, 0.03);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          font-family: var(--font-mono);
          font-size: 12px;
        }

        .repo-bar-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .repo-icon { color: #ff4d00; }

        .repo-name {
          font-weight: 700;
          color: #ffffff;
          letter-spacing: 0.3px;
        }

        .visibility-badge {
          font-size: 9px;
          padding: 1px 6px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #a1a1aa;
        }

        .star-badge {
          display: flex;
          align-items: center;
          gap: 3px;
          font-size: 11px;
          color: #eab308;
          font-weight: 700;
        }

        .star-icon { fill: #eab308; }

        .project-image-wrapper {
          width: 100%;
          padding-top: 45%;
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .project-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .uiverse-project-card:hover .project-image {
          transform: scale(1.06);
        }

        .project-index {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(10, 10, 12, 0.85);
          backdrop-filter: blur(6px);
          color: #ff4d00;
          font-family: var(--font-mono);
          font-weight: 900;
          font-size: 0.75rem;
          padding: 2px 8px;
          border-radius: 100px;
          border: 1px solid rgba(255, 77, 0, 0.3);
          z-index: 10;
        }

        .project-content {
          padding: 18px 20px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .project-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          margin-bottom: 12px;
        }

        .tag-pill {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 100px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #a1a1aa;
        }

        .project-title {
          font-family: var(--font-heading);
          font-size: 1.15rem;
          font-weight: 800;
          margin-bottom: 8px;
          color: #ffffff;
          letter-spacing: -0.02em;
          line-height: 1.3;
        }

        .project-description {
          font-size: 0.84rem;
          color: #a1a1aa;
          line-height: 1.5;
          margin-bottom: 18px;
          flex-grow: 1;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .project-actions {
          display: flex;
          gap: 10px;
          margin-top: auto;
        }

        .action-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 7px 16px;
          border-radius: 100px;
          font-family: var(--font-heading);
          font-size: 0.76rem;
          font-weight: 800;
          letter-spacing: 0.5px;
          text-decoration: none;
          transition: all 0.25s ease;
          border: 1px solid transparent;
          cursor: pointer;
        }

        .action-button.primary {
          background: #ffffff;
          color: #09090b;
          border-color: #ffffff;
        }

        .action-button.primary:hover {
          background: #ff4d00;
          color: #ffffff;
          border-color: #ff4d00;
          box-shadow: 0 0 16px rgba(255, 77, 0, 0.4);
        }

        .action-button.secondary {
          background: rgba(255, 255, 255, 0.05);
          color: #ffffff;
          border-color: rgba(255, 255, 255, 0.15);
        }

        .action-button.secondary:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: #ffffff;
        }
      `}</style>
    </div>
  );
};

export default ProjectsPage;
