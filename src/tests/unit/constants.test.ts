import { describe, it, expect } from 'vitest';
import { APP_NAME, ROUTES, SPLASH_DURATION } from '../../lib/constants';

describe('constants', () => {
  it('has correct APP_NAME', () => {
    expect(APP_NAME).toBe('Habit Tracker');
  });

  it('has correct ROUTES', () => {
    expect(ROUTES.HOME).toBe('/');
    expect(ROUTES.DASHBOARD).toBe('/dashboard');
  });

  it('has correct SPLASH_DURATION', () => {
    expect(SPLASH_DURATION).toBe(1500);
  });
});
