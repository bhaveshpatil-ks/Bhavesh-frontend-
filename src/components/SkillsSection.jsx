import React from 'react';
import { portfolioData } from '../data/portfolioData';

// Custom Tech Icon Component
const TechIcon = ({ icon }) => {
  switch (icon) {
    case 'html':
      return <span style={{ color: '#E34F26', fontWeight: 'bold' }}>HTML5</span>;
    case 'css':
      return <span style={{ color: '#1572B6', fontWeight: 'bold' }}>CSS3</span>;
    case 'javascript':
      return <span style={{ color: '#F7DF1E', background: '#000', padding: '0 3px', borderRadius: '3px', fontWeight: 'bold', fontSize: '10px' }}>JS</span>;
    case 'typescript':
      return <span style={{ color: '#3178C6', fontWeight: 'bold' }}>TS</span>;
    case 'tailwind':
      return <span style={{ color: '#06B6D4' }}>💨</span>;
    case 'react':
      return <span style={{ color: '#61DAFB' }}>⚛️</span>;
    case 'nodejs':
      return <span style={{ color: '#339933' }}>⬢</span>;
    case 'express':
      return <span style={{ color: '#000000', fontWeight: 'bold' }}>ex</span>;
    case 'mongodb':
      return <span style={{ color: '#47A248' }}>🍃</span>;
    case 'python':
      return <span style={{ color: '#3776AB' }}>🐍</span>;
    case 'firebase':
      return <span style={{ color: '#FFCA28' }}>🔥</span>;
    case 'gcloud':
      return <span style={{ color: '#4285F4' }}>☁️</span>;
    case 'github':
      return <span style={{ color: '#181717' }}>🐙</span>;
    case 'render':
      return <span style={{ color: '#000000' }}>⚡</span>;
    case 'replit':
      return <span style={{ color: '#F26207' }}>🔴</span>;
    case 'netlify':
      return <span style={{ color: '#00C7B7' }}>🌐</span>;
    case 'vercel':
      return <span style={{ color: '#000000' }}>▲</span>;
    case 'vscode':
      return <span style={{ color: '#007ACC' }}>💻</span>;
    case 'canva':
      return <span style={{ color: '#00C4CC' }}>🎨</span>;
    case 'postman':
      return <span style={{ color: '#FF6C37' }}>🚀</span>;
    case 'llm':
      return <span style={{ color: '#6366F1' }}>🧠</span>;
    case 'codex':
      return <span style={{ color: '#10B981' }}>🧬</span>;
    case 'cursor':
      return <span style={{ color: '#000000' }}>🎯</span>;
    case 'ollama':
      return <span style={{ color: '#000000' }}>🦙</span>;
    case 'gemini':
      return <span style={{ color: '#8E75FF' }}>✨</span>;
    case 'openai':
      return <span style={{ color: '#10A37F' }}>⚙️</span>;
    case 'copilot':
      return <span style={{ color: '#000000' }}>🤖</span>;
    case 'claude':
      return <span style={{ color: '#D97706' }}>✴️</span>;
    case 'huggingface':
      return <span style={{ color: '#FFD21E' }}>🤗</span>;
    default:
      return <span>⚡</span>;
  }
};

export default function SkillsSection() {
  const { skillsCategories } = portfolioData;

  return (
    <section id="skills" className="skills-section">
      <div className="container">
        {/* Section Title */}
        <div className="text-center">
          <span className="section-badge">STACK</span>
          <h2 className="section-title">
            Technical <span className="muted-text">Skills</span>
          </h2>
        </div>

        {/* 2x2 Category Cards Grid */}
        <div className="skills-grid">
          {skillsCategories.map((cat, idx) => (
            <div key={idx} className="skills-card">
              <h3 className="skills-category-title">
                {cat.highlight}
                <span className="muted-text">{cat.suffix}</span>
              </h3>

              <div className="skills-pills-wrap">
                {cat.skills.map((skill, sIdx) => (
                  <div key={sIdx} className="skill-pill">
                    <TechIcon icon={skill.icon} />
                    <span className="skill-name">{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .skills-section {
          padding: 60px 0 80px 0;
        }

        .text-center {
          text-align: center;
        }

        .skills-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
          margin-top: 36px;
        }

        .skills-card {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: var(--radius-card);
          box-shadow: var(--card-shadow);
          padding: 32px;
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .skills-card:hover {
          transform: translateY(-3px);
        }

        .skills-category-title {
          font-size: 26px;
          font-weight: 900;
          margin-bottom: 24px;
          letter-spacing: -0.02em;
        }

        .skills-pills-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .skill-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 18px;
          background: var(--badge-bg);
          border: 1px solid var(--badge-border);
          border-radius: 14px;
          font-family: var(--font-heading);
          font-size: 14px;
          font-weight: 700;
          color: var(--text-primary);
          transition: all 0.2s;
        }

        .skill-pill:hover {
          background: var(--card-bg);
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
          border-color: rgba(0, 0, 0, 0.12);
        }

        .skill-name {
          line-height: 1;
        }

        @media (max-width: 820px) {
          .skills-grid {
            grid-template-columns: 1fr;
          }

          .skills-card {
            padding: 24px;
          }
        }
      `}</style>
    </section>
  );
}
