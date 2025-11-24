import { useEffect, useState } from 'react';
import { getTheme } from './theme';
import { versionService } from './api/services/versionService';
import { getUiMode, setUiMode, getNeuroMode, setNeuroMode } from './utils/preferences';
import type { UiMode, NeuroMode } from './utils/preferences';
import { getConfig } from './config';
import { useAuth } from './context/useAuth';
import DivergentDashboard from './components/DivergentDashboard';
import TopNav from './components/TopNav';
import SettingsPage from './pages/SettingsPage';
import CapturePage from './pages/CapturePage';
import AnonymousHomePage from './pages/AnonymousHomePage';


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
  const { user, isLoading, login } = useAuth();
  const [mode, setModeState] = useState<UiMode>(getUiMode());
  const [neuroMode, setNeuroModeState] = useState<NeuroMode>(getNeuroMode());
  const [currentPage, setCurrentPage] = useState<string>('home');
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

  // Toggle functions
  const toggleMode = () => setModeState(mode === 'light' ? 'dark' : 'light');
  const toggleNeuroMode = () => setNeuroModeState(neuroMode === 'typical' ? 'divergent' : 'typical');

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: theme.background,
          color: theme.text,
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <div style={{ fontSize: '18px' }}>Loading...</div>
        </div>
      </div>
    );
  }

  // Route to divergent dashboard if in divergent mode (only for authenticated users)
  if (user && neuroMode === 'divergent') {
    return (
      <DivergentDashboard
        theme={theme}
        uiVersion={uiVersion}
        apiVersion={apiVersion}
        mode={mode}
        neuroMode={neuroMode}
        onModeToggle={toggleMode}
        onNeuroModeToggle={toggleNeuroMode}
      />
    );
  }

  // Render page content based on current route
  const renderPage = () => {
    // Show anonymous home page for unauthenticated users
    if (!user) {
      return <AnonymousHomePage theme={theme} onLogin={login} />;
    }

    // Protected pages - require authentication
    switch (currentPage) {
      case 'settings':
        return (
          <SettingsPage
            theme={theme}
            mode={mode}
            neuroMode={neuroMode}
            onModeToggle={toggleMode}
            onNeuroModeToggle={toggleNeuroMode}
          />
        );
      case 'capture':
        return <CapturePage theme={theme} />;
      case 'home':
      default:
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 'calc(100vh - 60px)',
              padding: 'max(2vw, 16px)',
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
              <p style={{ fontSize: 16, lineHeight: 1.6, margin: '1.5rem 0' }}>
                Welcome to Divergent Flow - a productivity system designed specifically for neurodivergent minds.
                Use the navigation above to get started with capturing your thoughts.
              </p>
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
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        overflowX: 'hidden',
        background: theme.background,
        color: theme.text,
        transition: 'background 0.3s, color 0.3s',
      }}
    >
      <TopNav
        theme={theme}
        currentPage={currentPage}
        uiVersion={uiVersion}
        apiVersion={apiVersion}
        onNavigate={setCurrentPage}
      />
      {renderPage()}
    </div>
  );
}
