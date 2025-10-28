// src/config.ts
// Define the expected shape of your runtime configuration
export interface IAppConfig {
  API_BASE_URL: string;
  NEURO_MODE: 'typical' | 'divergent';
  VERSION: string;
  ENVIRONMENT?: string;
  USER_ID?: string;
}

// Global variable to hold the config (populated by the main script)
declare global {
  interface Window {
    appConfig: IAppConfig | undefined;
  }
}

// Export a getter for easy access
export const getConfig = (): IAppConfig => {
  if (!window.appConfig) {
    // In a real app, you might want to throw an error or use a default config
    console.error("Application configuration not loaded!");
    return { 
      API_BASE_URL: 'http://localhost:3000/api', 
      NEURO_MODE: 'typical',
      VERSION: '0.0.0',
      ENVIRONMENT: 'development',
      USER_ID: '00000000-0000-0000-0000-000000000001', // fallback user ID
    };
  }
  return window.appConfig;
};
