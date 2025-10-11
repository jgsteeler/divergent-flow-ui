// src/context/useMode.ts
import { useContext } from 'react';
import { ModeContext } from './ModeContext';

export function useMode() {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error('useMode must be used within a ModeProvider');
  return ctx;
}
