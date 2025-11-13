import { defineConfig } from 'vite'
import type { UserConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { readFileSync } from 'fs';
import { resolve } from 'path';

// Read version from VERSION file
const version = readFileSync(resolve(__dirname, 'VERSION'), 'utf-8').trim();

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_UI_VERSION': JSON.stringify(version),
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./vitest.setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '*.config.ts',
        '**/*.d.ts',
        'scripts/',
      ],
    },
  },
} as UserConfig)
