// frontend/src/pages/aboutPage/AboutPage.tsx
import React from 'react';
// import '../../styles/aboutPage.css';

const AboutPage: React.FC = () => (
  <div className="about-page">
    <h1>About Park Radar</h1>
    <p>
      Park Radar is a web application that helps you find parks across the U.S.
      We fetch data from our PostgreSQL/PostGIS backend and display them on a
      map.
    </p>
    <h2>Data Sources</h2>
    <ul>
      <li>OpenStreetMap (for base map layers)</li>
      <li>US National Park Service (for park details)</li>
      <li>User-submitted reviews</li>
      {/* etc. */}
    </ul>
  </div>
);

export default AboutPage;
