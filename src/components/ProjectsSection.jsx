import React from 'react';
import { Github, ExternalLink } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

export default function ProjectsSection() {
  const { projects } = portfolioData;

  return (
    <section id="projects" className="projects-section">
      <div className="container">
        <div className="text-center">
          <span className="section-badge">PORTFOLIO</span>
          <h2 className="section-title">
            Featured <span className="muted-text">Projects</span>
          </h2>
          <p className="section-subtitle">
            Real-world full-stack web applications, automation tools, and scalable software systems built with precision.
          </p>
        </div>

        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-image-container">
                <img src={project.image} alt={project.title} className="project-image" />
                <div className="project-overlay" />
              </div>

              <div className="project-info">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-desc">{project.description}</p>

                <div className="project-tags">
                  {project.tags.map((tag, idx) => (
                    <span key={idx} className="project-tag">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="project-links">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pill-btn pill-btn-dark project-btn"
                  >
                    <Github size={15} />
                    <span>Source Code</span>
                  </a>

                  {project.demo && project.demo !== '#' && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pill-btn pill-btn-light project-btn"
                    >
                      <span>Live Demo</span>
                      <ExternalLink size={15} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .projects-section {
          padding: 60px 0 80px 0;
        }

        .text-center {
          text-align: center;
        }

        .projects-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 28px;
          margin-top: 36px;
        }

        .project-card {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: var(--radius-card);
          box-shadow: var(--card-shadow);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s;
        }

        .project-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.08);
        }

        .project-image-container {
          position: relative;
          width: 100%;
          height: 220px;
          overflow: hidden;
          background: var(--badge-bg);
        }

        .project-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .project-card:hover .project-image {
          transform: scale(1.04);
        }

        .project-info {
          padding: 24px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .project-title {
          font-size: 20px;
          font-weight: 800;
          margin-bottom: 10px;
          color: var(--text-bold);
        }

        .project-desc {
          font-size: 14px;
          line-height: 1.6;
          color: var(--text-secondary);
          margin-bottom: 20px;
          flex-grow: 1;
        }

        .project-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 20px;
        }

        .project-tag {
          padding: 4px 12px;
          background: var(--badge-bg);
          border: 1px solid var(--badge-border);
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .project-links {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .project-btn {
          height: 38px;
          padding: 0 16px;
          font-size: 13px;
        }

        @media (max-width: 900px) {
          .projects-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
