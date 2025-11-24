import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import type { UserProfile } from 'oidc-client-ts';
import type { Theme } from '../theme';

interface TopNavProps {
  theme: Theme;
  currentPage: string;
  uiVersion: string;
  apiVersion: string;
  onNavigate: (page: string) => void;
}

export default function TopNav({
  theme,
  currentPage,
  uiVersion,
  apiVersion,
  onNavigate,
}: TopNavProps) {
  const [aboutOpen, setAboutOpen] = useState(false);
  const { user, login, logout } = useAuth();

  const navLinkStyle = (page: string) => ({
    padding: '12px 20px',
    cursor: 'pointer',
    textDecoration: 'none',
    color: theme.text,
    fontWeight: currentPage === page ? 600 : 400,
    borderBottom: currentPage === page ? `3px solid ${theme.accent}` : '3px solid transparent',
    transition: 'all 0.2s',
    background: 'transparent',
    border: 'none',
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
      {/* Home Link */}
      <button
        onClick={() => onNavigate('home')}
        style={navLinkStyle('home')}
      >
        🏠 Home
      </button>

      {/* Capture Link - Only show for authenticated users */}
      {user && (
        <button
          onClick={() => onNavigate('capture')}
          style={navLinkStyle('capture')}
        >
          📝 Capture
        </button>
      )}

      {/* Settings Link - Only show for authenticated users */}
      {user && (
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
                  <strong>UI Version:</strong> {uiVersion}
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <strong>API Version:</strong> {apiVersion}
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
        {user ? (
          <>
            <span style={{ color: theme.background, fontSize: '14px', alignSelf: 'center' }}>
              Welcome, {(user.profile as UserProfile)?.name || (user.profile as UserProfile)?.email || user.profile?.sub}
            </span>
            <button
              onClick={logout}
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
            onClick={login}
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
