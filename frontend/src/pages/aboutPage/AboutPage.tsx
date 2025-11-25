// frontend/src/pages/aboutPage/AboutPage.tsx
import React from 'react';
import './styles/aboutPage.css';

const AboutPage: React.FC = () => (
  <div className="about-page">
    <div className="about-container">
      <h1 className="about-title">About Park Radar</h1>

      <p className="about-text">
        Park Radar is a full-stack web application designed to make discovering
        parks across the United States simple and intuitive. The platform
        combines geospatial data, interactive maps, and user-generated content
        to create a fast and engaging outdoor-exploration experience.
      </p>

      <h2 className="about-subtitle">Project Overview</h2>
      <p className="about-text">
        The project began as a way to explore real-world geospatial development
        and gradually evolved into a complete park-search and trip-planning
        tool. The focus has been on building clean architecture, creating
        reusable UI components, and implementing efficient spatial querying
        using a modern tech stack.
      </p>

      <h2 className="about-subtitle">Technologies Used</h2>
      <ul className="about-list">
        <li>
          <strong>Frontend:</strong> React, TypeScript, Vite
        </li>
        <li>
          <strong>Mapping:</strong> Leaflet.js for interactive map display and
          marker logic
        </li>
        <li>
          <strong>Backend:</strong> Node.js with Express for routing, API
          structure, and middleware
        </li>
        <li>
          <strong>Database:</strong> PostgreSQL with PostGIS for geospatial
          indexing and queries
        </li>
        <li>
          <strong>Authentication:</strong> Clerk for managed auth, user
          sessions, and UI components
        </li>
        <li>
          <strong>Tooling:</strong> ESLint, Prettier, environment variables, Git
          version control
        </li>
      </ul>

      <h2 className="about-subtitle">Engineering Highlights</h2>
      <ul className="about-list">
        <li>
          Implemented geospatial search using{' '}
          <strong>PostGIS ST_DWithin</strong> and
          <strong> geography types</strong> for efficient location-based
          filtering.
        </li>
        <li>
          Built a modular React component architecture with reusable UI
          components, stateful hooks, and a clean separation of map logic and
          data fetching.
        </li>
        <li>
          Created a robust Express API layer supporting filtering, pagination,
          park metadata retrieval, and geolocation-based searches.
        </li>
        <li>
          Integrated Leaflet maps to visualize park locations, user coordinates,
          and distance queries in real time.
        </li>
        <li>
          Implemented user login, protected routes, and review functionality
          using Clerk-managed authentication.
        </li>
        <li>
          Improved reliability and maintainability through consistent linting,
          formatting automation, and commit organization.
        </li>
      </ul>

      <h2 className="about-subtitle">Development Journey</h2>
      <p className="about-text">
        Park Radar has evolved through multiple iterations of backend
        optimization (including spatial indexing and improved SQL queries),
        frontend refactors, and UI improvements. Along the way, the project
        provided experience in:
      </p>

      <ul className="about-list">
        <li>Designing intuitive map-driven interfaces</li>
        <li>
          Building and refining geospatial queries based on real-world
          performance
        </li>
        <li>Structuring an Express API with clear and modular routing</li>
        <li>
          Integrating authentication and user-state logic into a TypeScript
          React app
        </li>
        <li>
          Optimizing developer workflow with linting, formatting, and Git best
          practices
        </li>
      </ul>

      <h2 className="about-subtitle">The Vision</h2>
      <p className="about-text">
        Park Radar continues to grow as a comprehensive demonstration of
        full-stack engineering, geospatial development, and UI/UX design. The
        goal is to create a polished, scalable, and user-friendly platform while
        showcasing strong software engineering practices and a passion for
        building useful tools.
      </p>
    </div>
  </div>
);

export default AboutPage;
