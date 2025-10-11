// src/types/config.ts
export type Mode = 'divergent' | 'typical';

export interface AppConfig {
  mode: Mode;
  apiBaseUrl: string;
}
