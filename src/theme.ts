// src/theme.ts

export const GSC_LIGHT = {
  primary: '#004687', // deep blue
  secondary: '#7BB2DD', // powder blue
  accent: '#C09A5B', // gold
  background: '#F7FAFC',
  text: '#1A202C',
};

export const GSC_DARK = {
  primary: '#7BB2DD', // powder blue (as primary in dark)
  secondary: '#004687', // deep blue
  accent: '#C09A5B',
  background: '#181C20',
  text: '#F7FAFC',
};

export type Theme = typeof GSC_LIGHT;

export function getTheme(mode: 'light' | 'dark'): Theme {
  return mode === 'dark' ? GSC_DARK : GSC_LIGHT;
}
