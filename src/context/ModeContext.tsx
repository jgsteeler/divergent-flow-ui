// src/context/ModeContext.tsx

import { useState } from 'react';
import type { ReactNode } from 'react';
import type { Mode } from '../types/config';
import { ModeContext } from './ModeContext';

export function ModeProvider({ children, initialMode = 'divergent' }: { children: ReactNode; initialMode?: Mode }) {
  const [mode, setMode] = useState<Mode>(initialMode);
  return (
    <ModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ModeContext.Provider>
  );
}


