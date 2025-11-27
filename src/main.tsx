

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import type { IAppConfig } from './config';

// Fetch runtime config before rendering the app
const fetchConfig = async (): Promise<IAppConfig> => {
  try {
    const response = await fetch('/config/config.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Could not fetch runtime configuration. Falling back to defaults.', error);
    return {
      version: '0.0.0',
      service: 'divergent-flow-ui',
      timestamp: new Date().toISOString(),
    };
  }
};

const initApp = async () => {
  const config = await fetchConfig();
  window.appConfig = config;
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
};

initApp();
