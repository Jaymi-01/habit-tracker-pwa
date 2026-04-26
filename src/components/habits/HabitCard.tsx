'use client';

import React from 'react';
import { Habit } from '@/types/habit';
import { getHabitSlug } from '@/lib/slug';
import { calculateCurrentStreak } from '@/lib/streaks';

interface HabitCardProps {
  habit: Habit;
  onToggle: (habit: Habit) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habit: Habit) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit, onToggle, onEdit, onDelete }) => {
  const slug = getHabitSlug(habit.name);
  const today = new Date().toISOString().split('T')[0];
  const isCompletedToday = habit.completions.includes(today);
  const streak = calculateCurrentStreak(habit.completions, today);

  return (
    <div 
      data-testid={`habit-card-${slug}`}
      className="p-4 bg-background border border-border rounded-lg shadow-sm flex flex-col gap-2"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold">{habit.name}</h3>
          {habit.description && <p className="text-sm text-foreground/60">{habit.description}</p>}
        </div>
        <div 
          data-testid={`habit-streak-${slug}`}
          className="text-xs font-medium text-foreground/40"
        >
          {streak}d streak
        </div>
      </div>
      
      <div className="flex items-center gap-2 mt-2">
        <button
          data-testid={`habit-complete-${slug}`}
          onClick={() => onToggle(habit)}
          className={`px-4 py-2 rounded-md font-medium transition-colors flex-1 ${
            isCompletedToday 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
        >
          {isCompletedToday ? 'Completed' : 'Mark Complete'}
        </button>
        
        <button
          data-testid={`habit-edit-${slug}`}
          onClick={() => onEdit(habit)}
          className="p-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
          aria-label="Edit Habit"
        >
          ✎
        </button>
        
        <button
          data-testid={`habit-delete-${slug}`}
          onClick={() => onDelete(habit)}
          className="p-2 bg-destructive/10 text-destructive rounded-md hover:bg-destructive/20 transition-colors"
          aria-label="Delete Habit"
        >
          🗑
        </button>
      </div>
    </div>
  );
};
