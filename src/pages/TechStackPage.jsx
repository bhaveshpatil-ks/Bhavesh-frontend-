import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { portfolioData } from '../data/portfolioData';
import ScrollReveal from '../components/ScrollReveal';
import TextReveal from '../components/ui/TextReveal';
import HoverCard from '../components/ui/HoverCard';

gsap.registerPlugin(ScrollTrigger);

// ─── Data ────────────────────────────────────────────────────────
const PROFICIENCY = {
  html: 95, css: 90, javascript: 88, typescript: 75, tailwind: 85, react: 87,
  nodejs: 85, express: 82, mongodb: 80, python: 70, firebase: 78, gcloud: 65,
  github: 92, render: 80, replit: 75, netlify: 82, vercel: 85, vscode: 95,
  canva: 70, postman: 85, llm: 88, codex: 80, cursor: 90, ollama: 75,
  gemini: 85, openai: 82, copilot: 88, claude: 80, huggingface: 70,
};

const TASTE_LEVEL = {
  html: { label: 'Expert', desc: 'Semantic, accessible markup.' },
  css: { label: 'Expert', desc: 'Layouts, animations, custom properties.' },
  javascript: { label: 'Advanced', desc: 'Async patterns, closures, event-driven.' },
  typescript: { label: 'Proficient', desc: 'Type-safe code, interfaces & generics.' },
  tailwind: { label: 'Advanced', desc: 'Utility-first rapid UI building.' },
  react: { label: 'Advanced', desc: 'Hooks, context, performance optimization.' },
  nodejs: { label: 'Advanced', desc: 'REST APIs, event loop, streams.' },
  express: { label: 'Advanced', desc: 'Middleware chains & route architecture.' },
  mongodb: { label: 'Proficient', desc: 'Schema design, aggregation pipelines.' },
  python: { label: 'Proficient', desc: 'Scripting, automation, data wrangling.' },
  firebase: { label: 'Proficient', desc: 'Auth, Firestore, realtime DB.' },
  gcloud: { label: 'Learning', desc: 'Cloud Run, Storage, IAM basics.' },
  github: { label: 'Expert', desc: 'Git workflows, PRs, CI/CD.' },
  render: { label: 'Proficient', desc: 'Backend & fullstack deployments.' },
  replit: { label: 'Advanced', desc: 'Rapid prototyping & collaboration.' },
  netlify: { label: 'Proficient', desc: 'JAMstack static site deployments.' },
  vercel: { label: 'Advanced', desc: 'Next.js / Vite edge deployments.' },
  vscode: { label: 'Expert', desc: 'Custom configs, extensions, debugging.' },
  canva: { label: 'Proficient', desc: 'Design assets, social media content.' },
  postman: { label: 'Advanced', desc: 'API testing, collections, environments.' },
  llm: { label: 'Advanced', desc: 'Prompt engineering, RAG, fine-tuning.' },
  codex: { label: 'Proficient', desc: 'Code generation & refactoring via API.' },
  cursor: { label: 'Expert', desc: 'AI-pair-programming at full speed.' },
  ollama: { label: 'Proficient', desc: 'Local LLM inference & model mgmt.' },
  gemini: { label: 'Advanced', desc: 'Multimodal AI tasks & API integration.' },
  openai: { label: 'Advanced', desc: 'GPT-4o, embeddings, function calling.' },
  copilot: { label: 'Expert', desc: 'Daily driver for code completions.' },
  claude: { label: 'Advanced', desc: 'Long-context reasoning & analysis.' },
  huggingface: { label: 'Learning', desc: 'Transformer models, inference.' },
};

const TASTE_COLORS = { Expert: '#ff4d00', Advanced: '#3b82f6', Proficient: '#10b981', Learning: '#a1a1aa' };

const TechIcon = ({ icon }) => {
  const icons = {
    html: <span style={{ color: '#E34F26', fontWeight: '900', fontSize: '11px' }}>HTML5</span>,
    css: <span style={{ color: '#1572B6', fontWeight: '900', fontSize: '11px' }}>CSS3</span>,
    javascript: <span style={{ color: '#F7DF1E', background: '#000', padding: '1px 4px', borderRadius: '3px', fontWeight: '900', fontSize: '10px' }}>JS</span>,
    typescript: <span style={{ color: '#3178C6', fontWeight: '900', fontSize: '11px' }}>TS</span>,
    tailwind: <span>💨</span>, react: <span style={{ color: '#61DAFB' }}>⚛️</span>,
    nodejs: <span style={{ color: '#339933' }}>⬢</span>, express: <span style={{ fontWeight: '900', fontSize: '11px' }}>ex</span>,
    mongodb: <span>🍃</span>, python: <span>🐍</span>, firebase: <span>🔥</span>, gcloud: <span>☁️</span>,
    github: <span>🐙</span>, render: <span>⚡</span>, replit: <span>🔴</span>, netlify: <span>🌐</span>,
    vercel: <span>▲</span>, vscode: <span>💻</span>, canva: <span>🎨</span>, postman: <span>🚀</span>,
    llm: <span>🧠</span>, codex: <span>🧬</span>, cursor: <span>🎯</span>, ollama: <span>🦙</span>,
    gemini: <span>✨</span>, openai: <span>⚙️</span>, copilot: <span>🤖</span>, claude: <span>✴️</span>,
    huggingface: <span>🤗</span>,
  };
  return icons[icon] || <span>⚡</span>;
};

const VIEWS = ['BARS', 'TASTE', 'FLOW', 'METERS'];
const CAT_INDICES = ['01', '02', '03', '04'];

export default function TechStackPage() {
  const { skillsCategories } = portfolioData;
  const [activeTab, setActiveTab] = useState('BARS');
  const [activeCategory, setActiveCategory] = useState(0);
  const statsRef = useRef(null);
  const currentSkills = skillsCategories[activeCategory]?.skills || [];

  // Animated counters
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.ts-stat-num').forEach((el) => {
        const target = parseInt(el.dataset.target);
        gsap.fromTo(el, { innerText: 0 }, {
          innerText: target,
          duration: 2,
          snap: { innerText: 1 },
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        });
      });
    }, statsRef);
    return () => ctx.revert();
  }, []);

  // Tab change animations
  useEffect(() => {
    if (activeTab === 'BARS') {
      gsap.fromTo('.ts-bar-fill', { scaleX: 0 }, { scaleX: 1, duration: 1, stagger: 0.07, ease: 'power3.out', transformOrigin: 'left center' });
    }
    if (activeTab === 'FLOW') {
      gsap.fromTo('.ts-flow-item', { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.5, stagger: 0.06, ease: 'power3.out' });
    }
    if (activeTab === 'METERS') {
      gsap.fromTo('.ts-meter-dot-fill', { scale: 0 }, { scale: 1, duration: 0.3, stagger: 0.03, ease: 'back.out(2)' });
    }
    if (activeTab === 'TASTE') {
      gsap.fromTo('.ts-taste-card', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: 'power3.out' });
    }
  }, [activeTab, activeCategory]);

  return (
    <div className="ts-page">
      <div className="ts-spacer" />

      {/* ─── Hero ─────────────────────────────────────── */}
      <section className="ts-hero">
        <div className="container">
          <ScrollReveal>
            <div className="tech-badge">
              <span className="badge-slash">//</span>
              <span>03 / CAPABILITIES</span>
            </div>
            <TextReveal text="Technical Stack" as="h1" className="ts-hero-title" />
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <p className="ts-hero-subtitle">
              A curated selection of tools, languages, and frameworks I use to build robust, scalable, and premium digital experiences.
            </p>
          </ScrollReveal>

          {/* Animated Stats */}
          <ScrollReveal delay={0.2}>
            <div ref={statsRef} className="ts-stats-grid">
              {[
                { num: 25, suffix: '+', label: 'Technologies' },
                { num: 4, suffix: '', label: 'Domains' },
                { num: 3, suffix: '+', label: 'Years Exp.' },
                { num: 6, suffix: '+', label: 'Projects Built' },
              ].map((stat, i) => (
                <div key={i} className="ts-stat-item">
                  <div className="ts-stat-value">
                    <span className="ts-stat-num" data-target={stat.num}>0</span>
                    {stat.suffix && <span className="ts-stat-suffix">{stat.suffix}</span>}
                  </div>
                  <div className="ts-stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── Category + View Controls ────────────────── */}
      <section className="ts-controls">
        <div className="container">
          <div className="ts-cat-row">
            {skillsCategories.map((cat, i) => (
              <button
                key={i}
                className={`ts-cat-btn ${activeCategory === i ? 'active' : ''}`}
                onClick={() => setActiveCategory(i)}
              >
                <span className="ts-cat-idx">{CAT_INDICES[i]}</span>
                {cat.category}
              </button>
            ))}
          </div>

          <div className="ts-view-row">
            <span className="ts-view-label">VIEW</span>
            {VIEWS.map((v) => (
              <button
                key={v}
                className={`ts-view-btn ${activeTab === v ? 'active' : ''}`}
                onClick={() => setActiveTab(v)}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Main Skills Panel ───────────────────────── */}
      <section className="ts-panel-section">
        <div className="container">
          <HoverCard intensity={6}>
            <div className="ts-panel">
              <div className="ts-panel-header">
                <span className="ts-panel-index">{CAT_INDICES[activeCategory]} / {skillsCategories[activeCategory]?.category.toUpperCase()}</span>
                <h2 className="ts-panel-title">{skillsCategories[activeCategory]?.category}</h2>
              </div>

              {/* BARS */}
              {activeTab === 'BARS' && (
                <div className="ts-bars-list">
                  {currentSkills.map((skill) => {
                    const pct = PROFICIENCY[skill.icon] || 70;
                    return (
                      <div key={skill.name} className="ts-bar-row">
                        <div className="ts-bar-meta">
                          <span className="ts-bar-icon"><TechIcon icon={skill.icon} /></span>
                          <span className="ts-bar-name">{skill.name}</span>
                          <span className="ts-bar-pct">{pct}%</span>
                        </div>
                        <div className="ts-bar-track">
                          <div className="ts-bar-fill" style={{ width: `${pct}%`, transform: 'scaleX(0)' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* TASTE */}
              {activeTab === 'TASTE' && (
                <div className="ts-taste-grid">
                  {currentSkills.map((skill) => {
                    const taste = TASTE_LEVEL[skill.icon] || { label: 'Proficient', desc: 'Used in production.' };
                    const color = TASTE_COLORS[taste.label];
                    return (
                      <div key={skill.name} className="ts-taste-card">
                        <div className="ts-taste-icon"><TechIcon icon={skill.icon} /></div>
                        <div className="ts-taste-name">{skill.name}</div>
                        <div className="ts-taste-level" style={{ color }}>{taste.label}</div>
                        <div className="ts-taste-desc">{taste.desc}</div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* FLOW */}
              {activeTab === 'FLOW' && (
                <div className="ts-flow-list">
                  {currentSkills.map((skill) => {
                    const taste = TASTE_LEVEL[skill.icon] || { label: 'Proficient' };
                    const color = TASTE_COLORS[taste.label];
                    return (
                      <div key={skill.name} className="ts-flow-item" style={{ opacity: 0 }}>
                        <span className="ts-flow-icon"><TechIcon icon={skill.icon} /></span>
                        <span className="ts-flow-name">{skill.name}</span>
                        <span className="ts-flow-badge" style={{ background: color + '18', color, borderColor: color + '40' }}>{taste.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* METERS */}
              {activeTab === 'METERS' && (
                <div className="ts-meters-list">
                  {currentSkills.map((skill) => {
                    const pct = PROFICIENCY[skill.icon] || 70;
                    const filled = Math.round((pct / 100) * 5);
                    const taste = TASTE_LEVEL[skill.icon] || { label: 'Proficient' };
                    const color = TASTE_COLORS[taste.label];
                    return (
                      <div key={skill.name} className="ts-meter-row">
                        <span className="ts-meter-icon"><TechIcon icon={skill.icon} /></span>
                        <span className="ts-meter-name">{skill.name}</span>
                        <div className="ts-meter-dots">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <span
                              key={j}
                              className={`ts-meter-dot ${j < filled ? 'ts-meter-dot-fill' : ''}`}
                              style={{ background: j < filled ? color : 'transparent', borderColor: j < filled ? color : 'rgba(255, 255, 255, 0.15)' }}
                            />
                          ))}
                        </div>
                        <span className="ts-meter-label" style={{ color }}>{taste.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </HoverCard>
        </div>
      </section>

      {/* ─── Domain Overview ─────────────────────────── */}
      <section className="ts-domains-section">
        <div className="container">
          <ScrollReveal>
            <h3 className="ts-domains-title">Domain Architecture</h3>
          </ScrollReveal>
          <div className="ts-domains-grid">
            {skillsCategories.map((cat, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="ts-domain-card">
                  <span className="ts-domain-idx">{CAT_INDICES[i]}</span>
                  <h4 className="ts-domain-name">{cat.category}</h4>
                  <div className="ts-domain-tags">
                    {cat.skills.slice(0, 4).map((s, j) => (
                      <span key={j} className="ts-domain-tag">
                        <TechIcon icon={s.icon} /> {s.name}
                      </span>
                    ))}
                    {cat.skills.length > 4 && (
                      <span className="ts-domain-tag ts-domain-more">+{cat.skills.length - 4}</span>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .ts-page {
          min-height: 100vh;
          background-color: #0a0a0a;
          color: #ffffff;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .ts-spacer { height: 100px; }

        /* ── Hero ──────────────────────────── */
        .ts-hero { padding: 40px 0 0; }

        .tech-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 2px;
          color: #888888;
          text-transform: uppercase;
          margin-bottom: 16px;
        }

        .badge-slash { color: #ff4d00; font-weight: 900; }

        .ts-hero-title {
          font-family: var(--font-heading) !important;
          font-size: clamp(40px, 7vw, 80px) !important;
          font-weight: 900 !important;
          letter-spacing: -0.03em;
          color: #ffffff;
          line-height: 1.05;
        }

        .ts-hero-subtitle {
          font-size: 1.1rem;
          color: #a1a1aa;
          max-width: 620px;
          line-height: 1.65;
          margin-top: 16px;
        }

        /* ── Stats ─────────────────────────── */
        .ts-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          margin-top: 40px;
          padding: 32px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .ts-stat-item { text-align: center; }

        .ts-stat-value {
          font-family: var(--font-heading);
          font-size: clamp(32px, 4vw, 52px);
          font-weight: 900;
          color: #ff4d00;
          letter-spacing: -0.02em;
        }

        .ts-stat-suffix { color: #ff4d00; }

        .ts-stat-label {
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #888888;
          margin-top: 6px;
        }

        /* ── Controls ──────────────────────── */
        .ts-controls { padding: 40px 0 0; }

        .ts-cat-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 20px;
        }

        .ts-cat-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.03);
          font-family: var(--font-heading);
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.04em;
          color: #a1a1aa;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .ts-cat-btn.active,
        .ts-cat-btn:hover {
          background: #ffffff;
          color: #09090b;
          border-color: #ffffff;
        }

        .ts-cat-idx { color: #ff4d00; font-weight: 900; font-size: 11px; }

        .ts-view-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 32px;
        }

        .ts-view-label {
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.14em;
          color: #71717a;
          margin-right: 8px;
        }

        .ts-view-btn {
          padding: 7px 16px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.03);
          font-family: var(--font-heading);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: #a1a1aa;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .ts-view-btn.active {
          background: #ff4d00;
          color: #ffffff;
          border-color: #ff4d00;
          box-shadow: 0 0 16px rgba(255, 77, 0, 0.4);
        }

        .ts-view-btn:hover:not(.active) {
          border-color: #ff4d00;
          color: #ffffff;
        }

        /* ── Panel ─────────────────────────── */
        .ts-panel-section { padding: 0 0 80px; }

        .ts-panel {
          position: relative;
          background: rgba(18, 18, 22, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-radius: 20px;
          padding: 44px;
          min-height: 360px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
        }

        .ts-panel-header { margin-bottom: 36px; }

        .ts-panel-index {
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.12em;
          color: #ff4d00;
          display: block;
          margin-bottom: 6px;
        }

        .ts-panel-title {
          font-family: var(--font-heading);
          font-size: clamp(24px, 3vw, 38px);
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #ffffff;
        }

        /* ── BARS ──────────────────────────── */
        .ts-bars-list { display: flex; flex-direction: column; gap: 20px; }
        .ts-bar-row { display: flex; flex-direction: column; gap: 8px; }
        .ts-bar-meta { display: flex; align-items: center; gap: 10px; }
        .ts-bar-icon { font-size: 16px; width: 24px; display: flex; align-items: center; justify-content: center; }
        .ts-bar-name { font-family: var(--font-heading); font-size: 14px; font-weight: 700; color: #ffffff; flex: 1; }
        .ts-bar-pct { font-family: var(--font-heading); font-size: 13px; font-weight: 800; color: #ff4d00; }
        .ts-bar-track { height: 6px; background: rgba(255, 255, 255, 0.08); border-radius: 9999px; overflow: hidden; }
        .ts-bar-fill { height: 100%; background: linear-gradient(90deg, #ff4d00, #ff7700); border-radius: 9999px; transform-origin: left center; }

        /* ── TASTE ─────────────────────────── */
        .ts-taste-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 16px; }
        .ts-taste-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 24px 18px;
          text-align: center;
          transition: transform 0.25s ease, border-color 0.25s ease;
        }

        .ts-taste-card:hover { transform: translateY(-4px); border-color: rgba(255, 77, 0, 0.5); }
        .ts-taste-icon { font-size: 24px; margin-bottom: 10px; }
        .ts-taste-name { font-family: var(--font-heading); font-size: 13px; font-weight: 800; color: #ffffff; margin-bottom: 6px; }
        .ts-taste-level { font-family: var(--font-heading); font-size: 11px; font-weight: 900; letter-spacing: 0.06em; margin-bottom: 6px; }
        .ts-taste-desc { font-size: 11px; color: #a1a1aa; line-height: 1.4; }

        /* ── FLOW ──────────────────────────── */
        .ts-flow-list { display: flex; flex-direction: column; gap: 12px; }
        .ts-flow-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 22px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          transition: transform 0.25s ease, border-color 0.25s ease;
        }

        .ts-flow-item:hover { transform: translateX(6px); border-color: rgba(255, 77, 0, 0.5); }
        .ts-flow-icon { font-size: 18px; width: 24px; }
        .ts-flow-name { font-family: var(--font-heading); font-size: 14px; font-weight: 800; color: #ffffff; flex: 1; }
        .ts-flow-badge {
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.08em;
          padding: 5px 12px;
          border-radius: 9999px;
          border: 1px solid;
        }

        /* ── METERS ────────────────────────── */
        .ts-meters-list { display: flex; flex-direction: column; gap: 18px; }
        .ts-meter-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .ts-meter-row:last-child { border-bottom: none; }
        .ts-meter-icon { font-size: 18px; width: 24px; }
        .ts-meter-name { font-family: var(--font-heading); font-size: 14px; font-weight: 700; color: #ffffff; flex: 1; min-width: 100px; }
        .ts-meter-dots { display: flex; gap: 7px; }
        .ts-meter-dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 2px solid;
        }

        .ts-meter-label {
          font-family: var(--font-heading);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.06em;
          min-width: 80px;
          text-align: right;
        }

        /* ── Domain Overview ───────────────── */
        .ts-domains-section { padding: 0 0 100px; }

        .ts-domains-title {
          font-family: var(--font-heading);
          font-size: clamp(24px, 3vw, 36px);
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #ffffff;
          margin-bottom: 32px;
        }

        .ts-domains-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }

        .ts-domain-card {
          background: rgba(18, 18, 22, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(16px);
          border-radius: 20px;
          padding: 32px;
          transition: transform 0.25s ease, border-color 0.25s ease;
        }

        .ts-domain-card:hover { transform: translateY(-4px); border-color: rgba(255, 77, 0, 0.5); }

        .ts-domain-idx {
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 900;
          color: #ff4d00;
          letter-spacing: 0.1em;
          display: block;
          margin-bottom: 8px;
        }

        .ts-domain-name {
          font-family: var(--font-heading);
          font-size: 22px;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 16px;
        }

        .ts-domain-tags { display: flex; flex-wrap: wrap; gap: 8px; }

        .ts-domain-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 9999px;
          font-family: var(--font-mono);
          font-size: 12px;
          font-weight: 700;
          color: #d4d4d8;
          background: rgba(255, 255, 255, 0.04);
        }

        .ts-domain-more {
          color: #a1a1aa;
          font-weight: 800;
        }

        /* ── Responsive ────────────────────── */
        @media (max-width: 820px) {
          .ts-stats-grid { grid-template-columns: repeat(2, 1fr); }
          .ts-domains-grid { grid-template-columns: 1fr; }
          .ts-panel { padding: 28px; }
          .ts-taste-grid { grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); }
          .ts-meter-label { display: none; }
        }
      `}</style>
    </div>
  );
}
