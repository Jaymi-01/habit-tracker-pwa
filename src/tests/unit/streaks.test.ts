import { describe, it, expect } from 'vitest';
import { calculateCurrentStreak } from '../../lib/streaks';

/* MENTOR_TRACE_STAGE3_HABIT_A91 */

describe('calculateCurrentStreak', () => {
  it('returns 0 when completions is empty', () => {
    expect(calculateCurrentStreak([])).toBe(0);
  });

  it('returns 0 when today is not completed', () => {
    const today = '2023-10-27';
    const completions = ['2023-10-26'];
    expect(calculateCurrentStreak(completions, today)).toBe(0);
  });

  it('returns the correct streak for consecutive completed days', () => {
    const today = '2023-10-27';
    const completions = ['2023-10-27', '2023-10-26', '2023-10-25'];
    expect(calculateCurrentStreak(completions, today)).toBe(3);
  });

  it('ignores duplicate completion dates', () => {
    const today = '2023-10-27';
    const completions = ['2023-10-27', '2023-10-27', '2023-10-26'];
    expect(calculateCurrentStreak(completions, today)).toBe(2);
  });

  it('breaks the streak when a calendar day is missing', () => {
    const today = '2023-10-27';
    const completions = ['2023-10-27', '2023-10-25'];
    expect(calculateCurrentStreak(completions, today)).toBe(1);
  });
});
