'use client';

import React, { useState } from 'react';
import { Habit } from '@/src/types/habit';
import { getHabitSlug } from '@/src/lib/slug';
import { calculateCurrentStreak } from '@/src/lib/streaks';

interface HabitCardProps {
  habit: Habit;
  onToggle: (habit: Habit) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habit: Habit) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit, onToggle, onEdit, onDelete }) => {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const slug = getHabitSlug(habit.name);
  const today = new Date().toISOString().split('T')[0];
  const isCompletedToday = habit.completions.includes(today);
  const streak = calculateCurrentStreak(habit.completions, today);

  return (
    <div 
      data-testid={`habit-card-${slug}`}
      className="p-4 bg-background border border-border rounded-lg shadow-sm flex flex-col gap-2 relative overflow-hidden"
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
          onClick={() => setIsConfirmingDelete(true)}
          className="p-2 bg-destructive/10 text-destructive rounded-md hover:bg-destructive/20 transition-colors"
          aria-label="Delete Habit"
        >
          🗑
        </button>
      </div>

      {isConfirmingDelete && (
        <div className="absolute inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center p-2 z-10 animate-in fade-in duration-200">
          <div className="text-center">
            <p className="text-sm font-bold mb-2">Delete?</p>
            <div className="flex gap-2">
              <button
                data-testid="confirm-delete-button"
                onClick={() => {
                  onDelete(habit);
                  setIsConfirmingDelete(false);
                }}
                className="px-3 py-1 bg-destructive text-destructive-foreground text-xs font-bold rounded"
              >
                Confirm
              </button>
              <button
                onClick={() => setIsConfirmingDelete(false)}
                className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-bold rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
