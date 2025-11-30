// src/theme.ts


export const GSC_LIGHT = {
  primary: '#004687', // deep blue
  secondary: '#7BB2DD', // powder blue
  accent: '#C09A5B', // gold
  background: '#F7FAFC',
  text: '#1A202C',
};


export type Theme = typeof GSC_LIGHT;

export const lightTheme = GSC_LIGHT;

export function getTheme(): Theme {
  return GSC_LIGHT;
}
