'use client';

import React from 'react';
import { Habit } from '@/src/types/habit';
import { HabitCard } from './HabitCard';

interface HabitListProps {
  habits: Habit[];
  onToggle: (habit: Habit) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habit: Habit) => void;
}

export const HabitList: React.FC<HabitListProps> = ({ habits, onToggle, onEdit, onDelete }) => {
  if (habits.length === 0) {
    return (
      <div 
        data-testid="empty-state"
        className="text-center py-12 border-2 border-dashed border-border rounded-lg"
      >
        <p className="text-foreground/60">No habits yet. Start by creating one!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
