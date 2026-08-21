import React from 'react';

export default function WhyBhavesh() {
  const cards = [
    {
      index: '01 / SPRINT',
      title: 'Built Projects & Delivery',
      tag: '6+ FULL STACK APPS',
      description: 'Hands-on execution across full stack products, combining frontend polish, backend logic, and production shipping speed.',
      isDark: false,
    },
    {
      index: '02 / ARCHITECTURE',
      title: 'Backend Engineering',
      tag: 'SCALABLE SYSTEMS',
      description: 'Full stack foundation with deep focus on Node.js/Express backend microservices, security, and database query optimization.',
      isDark: false,
    },
    {
      index: '03 / ENGAGEMENT',
      title: 'Full Product Experience',
      tag: 'END-TO-END SHIP',
      description: 'A steady growth curve across products, systems design, and product thinking instead of random one-off experiments.',
      isDark: true,
    },
  ];

  return (
    <section id="why-bhavesh" className="north-why-section">
      <div className="container">
        {/* Editorial Section Header */}
        <div className="section-header-editorial">
          <span className="section-index-badge">05 / ADVANTAGE & VALUE</span>
          <h2 className="section-title-editorial">Ways to Work Together</h2>
          <p className="section-subtitle-editorial">
            A builder mindset, sharp execution, and consistent delivery across product, frontend, backend, and engineering speed.
          </p>
        </div>

        {/* 3 North / Form Cards Grid */}
        <div className="north-why-grid">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className={`north-why-card ${card.isDark ? 'dark-experience-card' : ''}`}
            >
              <div className="card-corner-motif" />

              <div className="why-card-top">
                <span className="why-card-index">{card.index}</span>
                <h3 className="why-card-title">{card.title}</h3>
                <span className="pill-outline-tag why-tag-badge">{card.tag}</span>
              </div>

              <div className="why-card-bottom">
                <p className="why-card-desc">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .north-why-section {
          padding: 100px 0;
          background: #f6f7f9;
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
        }

        .section-header-editorial {
          margin-bottom: 48px;
        }

        .section-index-badge {
          display: inline-block;
          font-family: var(--font-heading);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.15em;
          color: #64748b;
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .section-title-editorial {
          font-family: var(--font-heading);
          font-size: clamp(28px, 4vw, 44px);
          font-weight: 900;
          letter-spacing: -0.03em;
          color: #09090b;
          margin-bottom: 12px;
        }

        .section-subtitle-editorial {
          font-size: clamp(14px, 1.8vw, 16px);
          color: #64748b;
          max-width: 600px;
          line-height: 1.6;
        }

        .north-why-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
        }

        .north-why-card {
          position: relative;
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.08);
          box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.02);
          border-radius: var(--radius-card);
          padding: 40px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 380px;
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s, box-shadow 0.25s;
        }

        .north-why-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255, 69, 0, 0.4);
          box-shadow: 0 16px 36px -5px rgba(0, 0, 0, 0.09);
        }

        .why-card-index {
          font-family: var(--font-heading);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.12em;
          color: #94a3b8;
          display: block;
          margin-bottom: 14px;
        }

        .why-card-title {
          font-family: var(--font-heading);
          font-size: clamp(26px, 3vw, 36px);
          font-weight: 800;
          line-height: 1.08;
          letter-spacing: -0.02em;
          color: #09090b;
          margin-bottom: 24px;
        }

        .why-tag-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 9999px;
          border: 1px solid rgba(0, 0, 0, 0.1);
          font-family: var(--font-heading);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: #475569;
          background: rgba(0, 0, 0, 0.02);
        }

        .why-card-desc {
          font-size: 14px;
          line-height: 1.6;
          color: #64748b;
        }

        /* 3rd Card is High-Contrast Dark Feature Card */
        .dark-experience-card {
          background: #09090b !important;
          color: #ffffff !important;
          border-color: rgba(255, 255, 255, 0.15) !important;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.25) !important;
        }

        .dark-experience-card .why-card-index {
          color: #ff4500 !important;
        }

        .dark-experience-card .why-card-title {
          color: #ffffff !important;
        }

        .dark-experience-card .why-tag-badge {
          border-color: rgba(255, 255, 255, 0.2) !important;
          color: #ffffff !important;
          background: rgba(255, 255, 255, 0.06) !important;
        }

        .dark-experience-card .why-card-desc {
          color: rgba(255, 255, 255, 0.75) !important;
        }

        @media (max-width: 960px) {
          .north-why-grid {
            grid-template-columns: 1fr;
          }

          .north-why-card {
            padding: 28px;
            min-height: auto;
          }
        }
      `}</style>
    </section>
  );
}
