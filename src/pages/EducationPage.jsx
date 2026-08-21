import React from 'react';
import ExperienceJourney from '../components/ExperienceJourney';

export default function EducationPage() {
  return (
    <div className="edu-page-container">
      <ExperienceJourney />

      <style>{`
        .edu-page-container {
          background-color: #0a0a0a;
          min-height: 100vh;
          width: 100%;
          color: #ffffff;
        }
      `}</style>
    </div>
  );
}
