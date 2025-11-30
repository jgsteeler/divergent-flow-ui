import { describe, it, expect, beforeEach } from 'vitest';
import { getNeuroMode, setNeuroMode } from '../../src/utils/preferences';

describe('Isolated neuroMode localStorage test', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('should persist and retrieve typical mode', () => {
    setNeuroMode('typical');
    expect(getNeuroMode()).toBe('typical');
  });
});
