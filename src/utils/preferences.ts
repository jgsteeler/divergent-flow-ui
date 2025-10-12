// src/utils/preferences.ts
import { getConfig } from '../config';

const LOCAL_STORAGE_MODE_KEY = 'uiMode';
const LOCAL_STORAGE_NEURO_KEY = 'neuroMode';

export type UiMode = 'light' | 'dark';
export type NeuroMode = 'typical' | 'divergent';

export function getUiMode(): UiMode {
  const saved = localStorage.getItem(LOCAL_STORAGE_MODE_KEY);
  if (saved === 'light' || saved === 'dark') return saved;
  // Default to 'light' if nothing is set in localStorage
  return 'light';
}

export function setUiMode(mode: UiMode) {
  localStorage.setItem(LOCAL_STORAGE_MODE_KEY, mode);
}

export function getNeuroMode(): NeuroMode {
  const saved = localStorage.getItem(LOCAL_STORAGE_NEURO_KEY);
  if (saved === 'typical' || saved === 'divergent') return saved;
  return getConfig().NEURO_MODE;
}

export function setNeuroMode(mode: NeuroMode) {
  localStorage.setItem(LOCAL_STORAGE_NEURO_KEY, mode);
}
