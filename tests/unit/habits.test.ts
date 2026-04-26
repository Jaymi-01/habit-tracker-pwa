import { describe, it, expect } from 'vitest';
import { toggleHabitCompletion } from '../../src/lib/habits';
import { Habit } from '../../src/types/habit';

describe('toggleHabitCompletion', () => {
  const mockHabit: Habit = {
    id: '1',
    userId: 'user1',
    name: 'Test Habit',
    description: 'Description',
    frequency: 'daily',
    createdAt: '2023-10-25T10:00:00Z',
    completions: ['2023-10-25'],
  };

  it('adds a completion date when the date is not present', () => {
    const result = toggleHabitCompletion(mockHabit, '2023-10-26');
    expect(result.completions).toContain('2023-10-26');
    expect(result.completions.length).toBe(2);
  });

  it('removes a completion date when the date already exists', () => {
    const result = toggleHabitCompletion(mockHabit, '2023-10-25');
    expect(result.completions).not.toContain('2023-10-25');
    expect(result.completions.length).toBe(0);
  });

  it('does not mutate the original habit object', () => {
    const originalCompletions = [...mockHabit.completions];
    toggleHabitCompletion(mockHabit, '2023-10-26');
    expect(mockHabit.completions).toEqual(originalCompletions);
  });

  it('does not return duplicate completion dates', () => {
    const habitWithDupes = { ...mockHabit, completions: ['2023-10-25', '2023-10-25'] };
    const result = toggleHabitCompletion(habitWithDupes, '2023-10-26');
    const uniqueCompletions = new Set(result.completions);
    expect(uniqueCompletions.size).toBe(result.completions.length);
  });
});
