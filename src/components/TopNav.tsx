import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import type { Theme } from '../theme';

interface TopNavProps {
  theme: Theme;
  currentPage: string;
  uiVersion: string;
  onNavigate: (page: string) => void;
}

export default function TopNav({
  theme,
  currentPage,
  uiVersion,
  onNavigate,
}: TopNavProps) {
  const [aboutOpen, setAboutOpen] = useState(false);
  const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();

  const navLinkStyle = (page: string) => ({
    padding: '12px 20px',
    cursor: 'pointer',
    textDecoration: 'none',
    color: theme.text,
    fontWeight: currentPage === page ? 600 : 400,
    border: 'none',
    borderBottom: currentPage === page ? `3px solid ${theme.accent}` : '3px solid transparent',
    transition: 'all 0.2s',
    background: 'transparent',
    fontSize: '16px',
    position: 'relative' as const,
  });

  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        background: theme.primary,
        color: theme.background,
        padding: '0 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Logo (SVG, transparent background) */}
      <img
        src="/branding/divergent-flow-logo.png"
        alt="Divergent Flow Logo"
        style={{ width: 40, height: 40, marginRight: 16, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
      />
      {/* Home Link */}
      <button
        onClick={() => onNavigate('home')}
        style={navLinkStyle('home')}
      >
        🏠 Home
      </button>

      {/* Capture Link - Only show for authenticated users */}
      {isAuthenticated && (
        <button
          onClick={() => onNavigate('capture')}
          style={navLinkStyle('capture')}
        >
          📝 Capture
        </button>
      )}

      {/* Settings Link - Only show for authenticated users */}
      {isAuthenticated && (
        <button
          onClick={() => onNavigate('settings')}
          style={navLinkStyle('settings')}
        >
          ⚙️ Settings
        </button>
      )}

      {/* About Dropdown */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setAboutOpen(!aboutOpen)}
          style={{
            ...navLinkStyle('about'),
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          ℹ️ About
          <span style={{ fontSize: '12px' }}>{aboutOpen ? '▲' : '▼'}</span>
        </button>

        {/* Dropdown Menu */}
        {aboutOpen && (
          <>
            {/* Backdrop to close dropdown */}
            <div
              onClick={() => setAboutOpen(false)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 99,
              }}
            />

            {/* Dropdown Content */}
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: '8px',
                background: theme.background,
                color: theme.text,
                borderRadius: '8px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                padding: '16px',
                minWidth: '250px',
                zIndex: 101,
                border: `1px solid ${theme.secondary}`,
              }}
            >
              <h3
                style={{
                  margin: '0 0 12px 0',
                  color: theme.primary,
                  fontSize: '18px',
                }}
              >
                Divergent Flow
              </h3>

              <div style={{ marginBottom: '12px', fontSize: '14px' }}>
                <div style={{ marginBottom: '8px' }}>
                  <strong>Version:</strong> {uiVersion}
                </div>
              </div>

              <div
                style={{
                  borderTop: `1px solid ${theme.secondary}`,
                  paddingTop: '12px',
                  fontSize: '12px',
                  color: theme.secondary,
                }}
              >
                &copy; {new Date().getFullYear()} GSC Prod, a division of Gibson
                Service Company, LLC
              </div>
            </div>
          </>
        )}
      </div>

      {/* Auth Buttons */}
      <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
        {isAuthenticated && user ? (
          <>
            <span style={{ color: theme.background, fontSize: '14px', alignSelf: 'center' }}>
              Welcome, {user.name || user.email}
            </span>
            <button
              onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
              style={{
                padding: '8px 16px',
                background: theme.accent,
                color: theme.background,
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => loginWithRedirect()}
            style={{
              padding: '8px 16px',
              background: theme.accent,
              color: theme.background,
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}
