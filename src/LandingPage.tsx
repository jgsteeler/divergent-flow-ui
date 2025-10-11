import { useEffect, useState } from 'react';
import { getTheme } from './theme';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const MODE = import.meta.env.VITE_MODE || 'light';

function useApiVersion() {
  const [apiVersion, setApiVersion] = useState<string>('');
  const [apiService, setApiService] = useState<string>('');
  const [apiTimestamp, setApiTimestamp] = useState<string>('');
  useEffect(() => {
    const url = `${API_BASE}/version`;
    fetch(url)
      .then((r) => {
        if (!r.ok) {
          console.error(`API version fetch failed: ${r.status} ${r.statusText} at ${url}`);
          setApiVersion('unavailable');
          return null;
        }
        return r.json();
      })
      .then((d) => {
        if (!d) return;
        setApiVersion(d.version || '');
        setApiService(d.service || '');
        setApiTimestamp(d.timestamp || '');
      })
      .catch((err) => {
        console.error('API version fetch error:', err, 'URL:', url);
        setApiVersion('unavailable');
      });
  }, []);
  return { apiVersion, apiService, apiTimestamp };
}


function useUiVersion() {
  // Use VITE_UI_VERSION injected at build time
  return import.meta.env.VITE_UI_VERSION || 'unknown';
}

export default function LandingPage() {
  const [mode, setMode] = useState<'light' | 'dark'>(MODE === 'dark' ? 'dark' : 'light');
  const theme = getTheme(mode);
  const { apiVersion, apiService, apiTimestamp } = useApiVersion();
  const uiVersion = useUiVersion();

  // Debug: log API version fetch errors if any
  useEffect(() => {
    if (apiVersion === 'unavailable') {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch API version from', `${API_BASE}/version`);
    }
  }, [apiVersion]);

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        background: theme.background,
        color: theme.text,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2vw',
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
          <div style={{ fontSize: 12, color: theme.text, opacity: 0.7 }}>{apiService && `Service: ${apiService}`}</div>
          <div style={{ fontSize: 12, color: theme.text, opacity: 0.7 }}>{apiTimestamp && `Timestamp: ${apiTimestamp}`}</div>
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
          onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
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
