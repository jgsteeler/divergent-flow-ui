import { useEffect, useState } from 'react';
import { getTheme } from './theme';
import { getUiMode, setUiMode, getNeuroMode, setNeuroMode } from './utils/preferences';
import type { UiMode, NeuroMode } from './utils/preferences';
import { getConfig } from './config';
import { useAuth0 } from '@auth0/auth0-react';
import DivergentDashboard from './components/DivergentDashboard';
import TopNav from './components/TopNav';
import SettingsPage from './pages/SettingsPage';
import CapturePage from './pages/CapturePage';
import AnonymousHomePage from './pages/AnonymousHomePage';


function useUiVersion() {
  // Use version from runtime config
  return getConfig().version || 'unknown';
}

export default function LandingPage() {
  const { isLoading, isAuthenticated, loginWithRedirect } = useAuth0();
  const [mode, setModeState] = useState<UiMode>(getUiMode());
  const [neuroMode, setNeuroModeState] = useState<NeuroMode>(getNeuroMode());
  const [currentPage, setCurrentPage] = useState<string>('home');
  const theme = getTheme();
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

  // If not authenticated, show anonymous home page
  if (!isAuthenticated) {
    return <AnonymousHomePage theme={theme} onLogin={loginWithRedirect} />;
  }

  // Authenticated: show main dashboard
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
        uiVersion={uiVersion}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />
      {currentPage === 'settings' && (
        <SettingsPage
          theme={theme}
          mode={mode}
          neuroMode={neuroMode}
          onModeToggle={toggleMode}
          onNeuroModeToggle={toggleNeuroMode}
        />
      )}
      {currentPage === 'capture' && <CapturePage theme={theme} />}
      {currentPage === 'home' && (
        <DivergentDashboard
          theme={theme}
          uiVersion={uiVersion}
          neuroMode={neuroMode}
          onNeuroModeToggle={toggleNeuroMode}
        />
      )}
    </div>
  );
}
