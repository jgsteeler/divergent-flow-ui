import './HamburgerMenu.css';
import { useState } from 'react';
import type { NeuroMode } from '../utils/preferences';
import type { Theme } from '../theme';

interface HamburgerMenuProps {
  theme: Theme;
  uiVersion: string;
  neuroMode: NeuroMode;
  onNeuroModeToggle: () => void;
  onLogout?: () => void;
}

export default function HamburgerMenu({
  theme,
  uiVersion,
  neuroMode,
  onNeuroModeToggle,
  onLogout,
}: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          top: 20,
          right: 20,
          background: theme.primary,
          color: theme.background,
          border: 'none',
          borderRadius: 8,
          padding: '12px 16px',
          cursor: 'pointer',
          fontSize: 24,
          lineHeight: 1,
          zIndex: 1000,
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        }}
        aria-label="Menu"
      >
        <span className="hamburger-icon">&#9776;</span>
      </button>

      {/* Menu Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.3)',
              zIndex: 1001,
            }}
          />

          {/* Menu Panel */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              width: 'min(320px, 80vw)',
              height: '100vh',
              background: theme.background,
              color: theme.text,
              boxShadow: '-4px 0 16px rgba(0,0,0,0.2)',
              zIndex: 1002,
              padding: '24px',
              overflowY: 'auto',
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: 'transparent',
                color: theme.text,
                border: 'none',
                fontSize: 28,
                cursor: 'pointer',
                padding: 8,
                lineHeight: 1,
              }}
              aria-label="Close"
            >
              ×
            </button>

            {/* Menu Content */}
            <h2 style={{ marginTop: 0, marginBottom: 24, color: theme.primary }}>
              Settings
            </h2>

            {/* Version Info */}
            <div
              style={{
                marginBottom: 24,
                padding: 16,
                background: theme.primary,
                color: theme.background,
                borderRadius: 8,
              }}
            >
              <div style={{ fontSize: 14 }}>
                <strong>Version:</strong> {uiVersion}
              </div>
            </div>

            {/* Neuro Mode Toggle Only */}
            <div style={{ marginBottom: 24 }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: 16,
                }}
              >
                <span>Neuro Mode</span>
                <button
                  onClick={onNeuroModeToggle}
                  style={{
                    background: theme.secondary,
                    color: theme.background,
                    border: 'none',
                    borderRadius: 6,
                    padding: '8px 16px',
                    cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  {neuroMode === 'divergent' ? 'Switch to Typical Mode' : 'Switch to Divergent Mode'}
                </button>
              </label>
            </div>

            {/* Logout Button */}
            {onLogout && (
              <button
                style={{
                  marginTop: '2rem',
                  background: theme.accent,
                  color: theme.background,
                  border: 'none',
                  borderRadius: 8,
                  padding: '12px 24px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  transition: 'background 0.2s, color 0.2s',
                }}
                onClick={() => { setIsOpen(false); onLogout(); }}
              >
                Logout
              </button>
            )}
          </div>
        </>
      )}
    </>
  );
}
