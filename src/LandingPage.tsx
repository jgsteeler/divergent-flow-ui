import { useEffect, useState } from 'react';
import { getTheme } from './theme';
import { versionService } from './api/services/versionService';
import { getUiMode, setUiMode, getNeuroMode, setNeuroMode } from './utils/preferences';
import type { UiMode, NeuroMode } from './utils/preferences';
import { getConfig } from './config';


function useApiVersion() {
  const [apiVersion, setApiVersion] = useState<string>('');
  const [apiService, setApiService] = useState<string>('');
  const [apiTimestamp, setApiTimestamp] = useState<string>('');
  useEffect(() => {
    versionService.getVersion()
      .then((d: { version?: string; service?: string; timestamp?: string }) => {
        setApiVersion(d.version || '');
        setApiService(d.service || '');
        setApiTimestamp(d.timestamp || '');
      })
      .catch((err: unknown) => {
        console.error('API version fetch error:', err);
        setApiVersion('unavailable');
      });
  }, []);
  return { apiVersion, apiService, apiTimestamp };
}

function useUiVersion() {
  // Use VERSION from runtime config
  return getConfig().VERSION || 'unknown';
}
export default function LandingPage() {
  const [mode, setModeState] = useState<UiMode>(getUiMode());
  const [neuroMode, setNeuroModeState] = useState<NeuroMode>(getNeuroMode());
  const theme = getTheme(mode);
  const { apiVersion } = useApiVersion();
  const uiVersion = useUiVersion();

  // Set body background to match theme
  useEffect(() => {
    document.body.style.background = theme.background;
  }, [theme.background]);

  // Persist mode changes
  useEffect(() => {
    setUiMode(mode);
  }, [mode]);

  useEffect(() => {
    setNeuroMode(neuroMode);
  }, [neuroMode]);

  // Debug: log API version fetch errors if any
  useEffect(() => {
    if (apiVersion === 'unavailable') {
      console.error('Failed to fetch API version from versionService');
    }
  }, [apiVersion]);

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        overflowX: 'hidden',
        background: theme.background,
        color: theme.text,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'max(2vw, 16px)',
        boxSizing: 'border-box',
        transition: 'background 0.3s, color 0.3s',
      }}
    >
      <div
        style={{
          background: theme.primary,
          color: theme.background,
          borderRadius: 20,
          padding: 'clamp(1.5rem, 4vw, 3rem) clamp(1.5rem, 6vw, 4rem)',
          boxShadow: '0 4px 32px rgba(0,0,0,0.10)',
          maxWidth: '700px',
          minWidth: 'min(320px, 100vw)',
          width: '100%',
          textAlign: 'center',
          margin: '0 auto',
        }}
      >
        <h1 style={{ margin: 0, fontSize: 36, letterSpacing: 1 }}>Divergent Flow</h1>
        <h2 style={{ margin: '0.5rem 0 1.5rem', fontWeight: 400, color: theme.accent, fontSize: 20 }}>
          Empowering Neurodivergent Minds to Flow
        </h2>
        <div style={{ margin: '1.5rem 0', fontSize: 16, color: theme.secondary }}>
          <div>Web UI Version: <b>{uiVersion}</b></div>
          <div>API Version: <b>{apiVersion}</b></div>
          {/* Service and Timestamp removed to avoid unused variable warnings */}
          <div style={{ marginTop: 12, fontSize: 15, color: theme.accent, fontWeight: 600 }}>
            Neuro Mode: <span style={{ fontWeight: 700 }}>{neuroMode}</span>
            <button
              style={{
                marginLeft: 16,
                background: theme.secondary,
                color: theme.background,
                border: 'none',
                borderRadius: 8,
                padding: '0.2rem 1rem',
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onClick={() => setNeuroModeState(neuroMode === 'typical' ? 'divergent' : 'typical')}
            >
              Switch to {neuroMode === 'typical' ? 'Divergent' : 'Typical'}
            </button>
          </div>
        </div>
        <button
          style={{
            background: theme.accent,
            color: theme.background,
            border: 'none',
            borderRadius: 8,
            padding: '0.5rem 1.5rem',
            fontWeight: 600,
            fontSize: 16,
            cursor: 'pointer',
            marginTop: 16,
            transition: 'background 0.2s',
          }}
          onClick={() => setModeState(mode === 'light' ? 'dark' : 'light')}
        >
          Switch to {mode === 'light' ? 'Dark' : 'Light'} Mode
        </button>
      </div>
      <footer
        style={{
          marginTop: 40,
          fontSize: 13,
          color: theme.secondary,
          opacity: 0.8,
          width: '100%',
          textAlign: 'center',
        }}
      >
        &copy; {new Date().getFullYear()} GSC Prod, a division of Gibson Service Company, LLC
      </footer>
    </div>
  );
}
