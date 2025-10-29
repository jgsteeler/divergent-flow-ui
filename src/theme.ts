// src/theme.ts
import { getConfig } from './config';

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

// Non-prod environment backgrounds (light pea green tint)
const GSC_LIGHT_NONPROD = {
  ...GSC_LIGHT,
  background: '#d4edda', // stronger light pea green
};

const GSC_DARK_NONPROD = {
  ...GSC_DARK,
  background: '#1b2e1f', // dark pea green
};

export type Theme = typeof GSC_LIGHT;

// Export default themes for testing
export const lightTheme = GSC_LIGHT;
export const darkTheme = GSC_DARK;

export function getTheme(mode: 'light' | 'dark'): Theme {
  const { ENVIRONMENT } = getConfig();
  const isNonProd = ENVIRONMENT && !['production', 'localprod'].includes(ENVIRONMENT.toLowerCase());
  
  if (isNonProd) {
    return mode === 'dark' ? GSC_DARK_NONPROD : GSC_LIGHT_NONPROD;
  }
  
  return mode === 'dark' ? GSC_DARK : GSC_LIGHT;
}
