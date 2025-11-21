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
      (localStorage.getItem as any).mockReturnValue(null);
      const mode = getNeuroMode();
      expect(mode).toBe('typical');
    });

    it('should return "typical" when stored value is "typical"', () => {
      (localStorage.getItem as any).mockReturnValue('typical');
      expect(getNeuroMode()).toBe('typical');
    });

    it('should return "divergent" when stored value is "divergent"', () => {
      (localStorage.getItem as any).mockReturnValue('divergent');
      expect(getNeuroMode()).toBe('divergent');
    });

    it('should return "typical" for invalid stored values', () => {
      (localStorage.getItem as any).mockReturnValue('invalid');
      const mode = getNeuroMode();
      expect(mode).toBe('typical');
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
});
