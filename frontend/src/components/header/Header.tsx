// frontend/src/components/header/Header.tsx
import React, { useState, useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
import ProfileOverlay from './components/ProfileOverlay';
import LoginOverlay from './components/LoginOverlay';
import UserControls from './components/UserControls';
import Navbar from './components/Navbar';
import './styles/header.css';
import type { LoginData } from '../../types/loginData';

export interface HeaderProps {
  user: { username: string; profilePic: string } | null;
  onLogin: (data: LoginData) => void;
  onLogout: () => void;
  onSignup: () => void;
  disableAuth?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  user,
  onLogin,
  onLogout,
  onSignup,
  disableAuth = true,
}) => {
  const [showProfileOverlay, setShowProfileOverlay] = useState(false);
  const [showLoginOverlay, setShowLoginOverlay] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 920);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 921);
      if (window.innerWidth >= 921) {
        setIsMenuOpen(false);
        setAccountMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleProfileOverlay = () => {
    setShowProfileOverlay(!showProfileOverlay);
    setShowLoginOverlay(false);
  };
  const toggleLoginOverlay = () => {
    setShowLoginOverlay(!showLoginOverlay);
    setShowProfileOverlay(false);
  };
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isMenuOpen) setAccountMenuOpen(false);
  };

  return (
    <header className="header">
      <a href="/" className="logo">
        <img src="/images/logo.png" alt="Logo" className="logo-image" />
        <span className="website-name">Park Radar</span>
      </a>

      {isMobile ? (
        <button onClick={toggleMenu} className="hamburger-button">
          {isMenuOpen ? '✕' : '☰'}
        </button>
      ) : (
        <>
          <Navbar />

          {!disableAuth && (
            <div className="user-controls">
              <UserControls
                user={user}
                toggleProfileOverlay={toggleProfileOverlay}
                toggleLoginOverlay={toggleLoginOverlay}
              />
            </div>
          )}
        </>
      )}

      {isMobile && (
        <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
          <div className="mobile-menu-header">
            <button onClick={toggleMenu} className="mobile-menu-close">
              ✕
            </button>
          </div>

          <div className="mobile-menu-content">
            <div className="mobile-navbar">
              <Navbar />
            </div>

            {!disableAuth && (
              <div className="mobile-account-section">
                {user ? (
                  <div className="mobile-account">
                    <button
                      onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                      className="mobile-account-button"
                    >
                      Account
                    </button>
                    {accountMenuOpen && (
                      <div className="mobile-account-submenu">
                        <a href="/profile" className="mobile-account-option">
                          Profile
                        </a>
                        <button
                          onClick={onLogout}
                          className="mobile-account-option"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <a href="/login" className="login-button">
                    Login
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {!disableAuth && showProfileOverlay && user && (
        <ProfileOverlay
          user={user}
          onClose={() => setShowProfileOverlay(false)}
          onLogout={onLogout}
        />
      )}

      {!disableAuth && showLoginOverlay && (
        <LoginOverlay
          onClose={() => setShowLoginOverlay(false)}
          onLogin={onLogin}
          onSignup={onSignup}
        />
      )}
    </header>
  );
};

export default Header;
