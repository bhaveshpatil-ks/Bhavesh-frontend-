import React from 'react';
import { ArrowUpRight, Sparkles, Code2, Cpu, Globe, Terminal } from 'lucide-react';

export default function SelectedWorkMarquee() {
  const tickerItems = [
    { text: 'FULL STACK ARCHITECTURE', icon: Code2 },
    { text: 'SPARSE SOCIAL MEDIA', icon: Sparkles },
    { text: 'MAILFLOW AUTOMATION', icon: Terminal },
    { text: 'FACULTYONE CLOUD', icon: Cpu },
    { text: 'MID-NIGHT BOOKING', icon: Globe },
    { text: 'HIGH PERFORMANCE SYSTEMS', icon: ArrowUpRight },
  ];

  return (
    <div className="marquee-wrapper">
      <div className="marquee-track">
        {[...tickerItems, ...tickerItems, ...tickerItems].map((item, idx) => {
          const IconComponent = item.icon;
          return (
            <div key={idx} className="marquee-item">
              <IconComponent size={14} className="marquee-icon" />
              <span className="marquee-text">{item.text}</span>
              <span className="marquee-dot">•</span>
            </div>
          );
        })}
      </div>

      <style>{`
        .marquee-wrapper {
          width: 100%;
          overflow: hidden;
          background: #09090b;
          color: #ffffff;
          padding: 18px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          user-select: none;
        }

        .marquee-track {
          display: flex;
          align-items: center;
          gap: 32px;
          white-space: nowrap;
          width: max-content;
          animation: marqueeScroll 25s linear infinite;
        }

        .marquee-wrapper:hover .marquee-track {
          animation-play-state: paused;
        }

        .marquee-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-family: var(--font-heading);
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.12em;
        }

        .marquee-icon {
          color: #ff4500;
        }

        .marquee-text {
          color: #f4f4f5;
        }

        .marquee-dot {
          color: rgba(255, 255, 255, 0.3);
          margin-left: 16px;
        }

        @keyframes marqueeScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.33%);
          }
        }
      `}</style>
    </div>
  );
}
