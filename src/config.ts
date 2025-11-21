// src/config.ts
// Runtime configuration for the application
// Version is loaded from config.json (generated from package.json at build time)
// User preferences (neuroMode, etc) will be stored in database user profile
export interface IAppConfig {
  VERSION: string;
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
    console.warn("Application configuration not loaded, using defaults");
    return { 
      VERSION: '0.0.0',
    };
  }
  return window.appConfig;
};
