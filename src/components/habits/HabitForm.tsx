'use client';

import React, { useState, useEffect } from 'react';
import { Habit } from '@/src/types/habit';
import { validateHabitName } from '@/src/lib/validators';

interface HabitFormProps {
  initialHabit?: Habit;
  onSave: (habitData: Partial<Habit>) => void;
  onCancel: () => void;
}

export const HabitForm: React.FC<HabitFormProps> = ({ initialHabit, onSave, onCancel }) => {
  const [name, setName] = useState(initialHabit?.name || '');
  const [description, setDescription] = useState(initialHabit?.description || '');
  const [frequency, setFrequency] = useState<'daily'>(initialHabit?.frequency || 'daily');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialHabit) {
      setName(initialHabit.name);
      setDescription(initialHabit.description);
      setFrequency(initialHabit.frequency);
    }
  }, [initialHabit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateHabitName(name);
    
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    onSave({
      name: validation.value,
      description,
      frequency,
    });
  };

  return (
    <div className="p-6 bg-background border border-border rounded-lg shadow-lg max-w-md w-full mx-auto">
      <h2 className="text-xl font-bold mb-4">{initialHabit ? 'Edit Habit' : 'Create New Habit'}</h2>
      <form onSubmit={handleSubmit} data-testid="habit-form" className="space-y-4">
        <div>
          <label htmlFor="habit-name" className="block text-sm font-medium mb-1">Name</label>
          <input
            id="habit-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            data-testid="habit-name-input"
            className="w-full px-3 py-2 bg-background border border-input rounded-md focus:ring-ring focus:border-ring outline-none"
            placeholder="e.g. Drink Water"
          />
          {error && <p className="text-destructive text-sm mt-1">{error}</p>}
        </div>
        <div>
          <label htmlFor="habit-description" className="block text-sm font-medium mb-1">Description (Optional)</label>
          <textarea
            id="habit-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            data-testid="habit-description-input"
            className="w-full px-3 py-2 bg-background border border-input rounded-md focus:ring-ring focus:border-ring outline-none h-24"
            placeholder="Why do you want to do this?"
          />
        </div>
        <div>
          <label htmlFor="habit-frequency" className="block text-sm font-medium mb-1">Frequency</label>
          <select
            id="habit-frequency"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value as 'daily')}
            data-testid="habit-frequency-select"
            className="w-full px-3 py-2 bg-background border border-input rounded-md focus:ring-ring focus:border-ring outline-none"
          >
            <option value="daily">Daily</option>
          </select>
        </div>
        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            data-testid="habit-save-button"
            className="flex-1 py-2 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-colors"
          >
            {initialHabit ? 'Update Habit' : 'Save Habit'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2 bg-secondary text-secondary-foreground font-semibold rounded-md hover:bg-secondary/80 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
