// frontend/src/components/header/components/Navbar.tsx
import React from 'react';
import { useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <nav className="navbar">
      <a href="/" className={`nav-link ${path === '/' ? 'active' : ''}`}>
        Home
      </a>

      <a
        href="/search"
        className={`nav-link ${path.startsWith('/search') ? 'active' : ''}`}
      >
        Search
      </a>

      <a
        href="/about"
        className={`nav-link ${path.startsWith('/about') ? 'active' : ''}`}
      >
        About
      </a>
    </nav>
  );
};

export default Navbar;
