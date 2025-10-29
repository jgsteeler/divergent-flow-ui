import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
  localStorage.clear();
  sessionStorage.clear();
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

global.localStorage = localStorageMock as any;

// Mock config module
vi.mock('./src/config', () => ({
  getConfig: vi.fn(() => ({
    API_BASE_URL: 'http://localhost:8080',
    USER_EMAIL: 'test@example.com',
    NEURO_MODE: 'divergent' as const,
  })),
}));
