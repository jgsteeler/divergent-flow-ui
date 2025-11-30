import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { GSC_LIGHT } from '../theme';
import { ThemeContext } from './ThemeContextInstance';

type ThemeMode = 'light' | 'dark';

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<ThemeMode>('light');

  // Inject CSS variables for the current theme
  useEffect(() => {
    const theme = GSC_LIGHT;
    const root = document.documentElement;
    Object.entries(theme).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
    // Set color-scheme for native elements
    root.style.setProperty('color-scheme', mode);
  }, [mode]);

  const toggleMode = () => setMode((prev: ThemeMode) => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ mode, setMode, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

