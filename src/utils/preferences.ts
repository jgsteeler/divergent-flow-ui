// src/utils/preferences.ts
// User preferences stored in localStorage
// TODO: Move to database user profile for persistence across devices

const LOCAL_STORAGE_MODE_KEY = 'uiMode';
const LOCAL_STORAGE_NEURO_KEY = 'neuroMode';

export type UiMode = 'light' | 'dark';
export type NeuroMode = 'typical' | 'divergent';

export function getUiMode(): UiMode {
  const saved = localStorage.getItem(LOCAL_STORAGE_MODE_KEY);
  if (saved === 'light' || saved === 'dark') return saved;
  return 'light'; // Default to light mode
}

export function setUiMode(mode: UiMode) {
  localStorage.setItem(LOCAL_STORAGE_MODE_KEY, mode);
}

export function getNeuroMode(): NeuroMode {
  const saved = localStorage.getItem(LOCAL_STORAGE_NEURO_KEY);
  if (saved === 'typical' || saved === 'divergent') return saved;
  return 'typical'; // Default to typical mode
}

export function setNeuroMode(mode: NeuroMode) {
  localStorage.setItem(LOCAL_STORAGE_NEURO_KEY, mode);
}
