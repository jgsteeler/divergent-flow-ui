import React from 'react';
import './TopNav.css';

interface TopNavProps {
  isAuthenticated: boolean;
  logoSrc?: string;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout?: () => void;
}

const TopNav: React.FC<TopNavProps> = ({ isAuthenticated, logoSrc, currentPage, onNavigate, onLogout }) => {
  return (
    <nav className="topnav">
      <img
        src={logoSrc || '/branding/divergent-flow-logo.png'}
        alt="Divergent Flow Logo"
        className="topnav-logo"
      />
      <a
        href="#"
        className={`topnav-link${currentPage === 'home' ? ' active' : ''}`}
        onClick={e => { e.preventDefault(); onNavigate('home'); }}
      >
        Home
      </a>
      {isAuthenticated && (
        <a
          href="#"
          className={`topnav-link${currentPage === 'capture' ? ' active' : ''}`}
          onClick={e => { e.preventDefault(); onNavigate('capture'); }}
        >
          Capture
        </a>
      )}
      {isAuthenticated && (
        <a
          href="#"
          className={`topnav-link${currentPage === 'settings' ? ' active' : ''}`}
          onClick={e => { e.preventDefault(); onNavigate('settings'); }}
        >
          Settings
        </a>
      )}
      <div className="topnav-actions">
        {isAuthenticated && onLogout && (
          <button className="topnav-logout-btn" onClick={onLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default TopNav;
