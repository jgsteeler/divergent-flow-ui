import { useEffect, useState } from 'react';
import { getTheme } from './theme';
import { getNeuroMode, setNeuroMode } from './utils/preferences';
import type { NeuroMode } from './utils/preferences';
import { getConfig } from './config';
import { useAuth0 } from '@auth0/auth0-react';
import DivergentDashboard from './components/DivergentDashboard';
import TopNav from './components/TopNav';
import SettingsPage from './pages/SettingsPage';
import CapturePage from './pages/CapturePage';
import AnonymousHomePage from './pages/AnonymousHomePage';
import TypicalDashboard from './components/TypicalDashboard';


function useUiVersion() {
  // Use version from runtime config
  return getConfig().version || 'unknown';
}

export default function LandingPage() {
  const { isLoading, isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const [neuroMode, setNeuroModeState] = useState<NeuroMode>(() => getNeuroMode());
  const theme = getTheme();
  const uiVersion = useUiVersion();
  const [currentPage, setCurrentPage] = useState<string>('home');

  // Set body background to match theme
  useEffect(() => {
    document.body.style.background = theme.background;
  }, [theme.background]);

  // Persist neuro mode changes
  useEffect(() => {
    setNeuroMode(neuroMode);
  }, [neuroMode]);

  // Toggle neuro mode only
  const toggleNeuroMode = () => {
    const newMode = neuroMode === 'typical' ? 'divergent' : 'typical';
    setNeuroModeState(newMode);
  };

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

  // If not authenticated, show anonymous home page
  if (!isAuthenticated) {
    return <AnonymousHomePage theme={theme} onLogin={loginWithRedirect} />;
  }

  // Authenticated: show main dashboard
  if (neuroMode === 'divergent') {
    return (
      <DivergentDashboard
        theme={theme}
        uiVersion={uiVersion}
        neuroMode={neuroMode}
        onNeuroModeToggle={toggleNeuroMode}
        onLogout={() => logout({ returnTo: window.location.origin } as any)}
      />
    );
  }

  // Typical mode: show full UI with navigation
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
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <TopNav isAuthenticated={isAuthenticated} currentPage={currentPage} onNavigate={setCurrentPage} onLogout={() => logout({ returnTo: window.location.origin } as any)} />
      {currentPage === 'settings' && (
        <SettingsPage
          theme={theme}
          neuroMode={neuroMode}
          onNeuroModeToggle={toggleNeuroMode}
          mode={'light'}
          onModeToggle={() => {}}
        />
      )}
      {currentPage === 'capture' && <CapturePage theme={theme} />}
      {currentPage === 'home' && (neuroMode as NeuroMode) === 'typical' && (
        <TypicalDashboard onNavigate={setCurrentPage} onLogout={() => logout({ returnTo: window.location.origin } as any)} />
      )}
      {currentPage === 'home' && (neuroMode as NeuroMode) === 'divergent' && (
        <DivergentDashboard
          theme={theme}
          uiVersion={uiVersion}
          neuroMode={neuroMode}
          onNeuroModeToggle={toggleNeuroMode}
          onLogout={() => logout({ returnTo: window.location.origin } as any)}
        />
      )}
    </div>
  );
}
