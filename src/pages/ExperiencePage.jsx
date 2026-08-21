import React from 'react';
import ExperienceJourney from '../components/ExperienceJourney';

export default function ExperiencePage() {
  return (
    <div className="exp-page-container">
      <ExperienceJourney />

      <style>{`
        .exp-page-container {
          background-color: #0a0a0a;
          min-height: 100vh;
          width: 100%;
          color: #ffffff;
        }
      `}</style>
    </div>
  );
}
