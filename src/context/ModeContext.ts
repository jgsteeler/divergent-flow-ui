// src/context/ModeContext.ts
import { createContext } from 'react';
import type { Mode } from '../types/config';

export interface ModeContextProps {
  mode: Mode;
  setMode: (mode: Mode) => void;
}

export const ModeContext = createContext<ModeContextProps | undefined>(undefined);
