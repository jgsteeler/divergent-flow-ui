

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';
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
  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE;
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Auth0Provider
        domain={domain}
        clientId={clientId}
        authorizationParams={{
          redirect_uri: window.location.origin,
          audience: audience
        }}
      >
        <App />
      </Auth0Provider>
    </StrictMode>,
  );
};

initApp();
