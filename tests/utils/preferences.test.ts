import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getUiMode, setUiMode, getNeuroMode, setNeuroMode } from '../../src/utils/preferences';
import type { UiMode, NeuroMode } from '../../src/utils/preferences';

describe('preferences utility', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('getUiMode', () => {
    it('should return "light" by default when nothing is stored', () => {
      (localStorage.getItem as any).mockReturnValue(null);
      expect(getUiMode()).toBe('light');
    });

    it('should return "light" when stored value is "light"', () => {
      (localStorage.getItem as any).mockReturnValue('light');
      expect(getUiMode()).toBe('light');
    });

    it('should return "dark" when stored value is "dark"', () => {
      (localStorage.getItem as any).mockReturnValue('dark');
      expect(getUiMode()).toBe('dark');
    });

    it('should return "light" for invalid stored values', () => {
      (localStorage.getItem as any).mockReturnValue('invalid');
      expect(getUiMode()).toBe('light');
    });
  });

  describe('setUiMode', () => {
    it('should store "light" mode in localStorage', () => {
      setUiMode('light');
      expect(localStorage.setItem).toHaveBeenCalledWith('uiMode', 'light');
    });

    it('should store "dark" mode in localStorage', () => {
      setUiMode('dark');
      expect(localStorage.setItem).toHaveBeenCalledWith('uiMode', 'dark');
    });
  });

  describe('getNeuroMode', () => {
    it('should return "typical" by default when nothing is stored', () => {
      window.localStorage.clear();
      expect(getNeuroMode()).toBe('typical');
    });

    it('should return "typical" when stored value is "typical"', () => {
      window.localStorage.setItem('neuroMode', 'typical');
      expect(getNeuroMode()).toBe('typical');
    });

    it('should return "typical" for invalid stored values', () => {
      window.localStorage.setItem('neuroMode', 'invalid');
      expect(getNeuroMode()).toBe('typical');
    });
  });

  describe('setNeuroMode', () => {
    it('should store "typical" mode in localStorage', () => {
      setNeuroMode('typical');
      expect(localStorage.setItem).toHaveBeenCalledWith('neuroMode', 'typical');
    });

    it('should store "divergent" mode in localStorage', () => {
      setNeuroMode('divergent');
      expect(localStorage.setItem).toHaveBeenCalledWith('neuroMode', 'divergent');
    });
  });

  describe('neuroMode localStorage persistence', () => {
    beforeEach(() => {
      window.localStorage.clear();
    });

    it('should default to typical if not set', () => {
      expect(getNeuroMode()).toBe('typical');
    });

    it('should persist and retrieve typical mode', () => {
      setNeuroMode('typical');
      expect(getNeuroMode()).toBe('typical');
    });

    it('should ignore invalid values and default to typical', () => {
      window.localStorage.setItem('neuroMode', 'invalid');
      expect(getNeuroMode()).toBe('typical');
    });
  });

  describe('neuroMode localStorage persistence (isolated)', () => {
    beforeEach(() => {
      window.localStorage.clear();
    });

    it('should persist and retrieve typical mode', () => {
      window.localStorage.setItem('neuroMode', 'typical');
      expect(getNeuroMode()).toBe('typical');
    });

    it('should persist and retrieve typical mode', () => {
      window.localStorage.setItem('neuroMode', 'typical');
      expect(getNeuroMode()).toBe('typical');
    });
  });
});
