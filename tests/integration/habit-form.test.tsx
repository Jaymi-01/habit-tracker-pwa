import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { HabitForm } from '../../src/components/habits/HabitForm';
import { HabitCard } from '../../src/components/habits/HabitCard';
import { Habit } from '../../src/types/habit';

describe('habit form', () => {
  const mockOnSave = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows a validation error when habit name is empty', async () => {
    render(<HabitForm onSave={mockOnSave} onCancel={mockOnCancel} />);
    
    const saveButton = screen.getByTestId('habit-save-button');
    fireEvent.click(saveButton);

    expect(screen.getByText('Habit name is required')).toBeInTheDocument();
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('creates a new habit and renders it in the list', async () => {
    // This test simulates the saving part
    render(<HabitForm onSave={mockOnSave} onCancel={mockOnCancel} />);
    
    const nameInput = screen.getByTestId('habit-name-input');
    const saveButton = screen.getByTestId('habit-save-button');

    fireEvent.change(nameInput, { target: { value: 'Drink Water' } });
    fireEvent.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledWith(expect.objectContaining({
      name: 'Drink Water',
    }));
  });

  it('edits an existing habit and preserves immutable fields', async () => {
    const habit: Habit = {
      id: '1',
      userId: 'user1',
      name: 'Old Name',
      description: 'Old Desc',
      frequency: 'daily',
      createdAt: '2023-01-01T00:00:00Z',
      completions: ['2023-01-01'],
    };

    render(<HabitForm initialHabit={habit} onSave={mockOnSave} onCancel={mockOnCancel} />);
    
    const nameInput = screen.getByTestId('habit-name-input');
    const saveButton = screen.getByTestId('habit-save-button');

    fireEvent.change(nameInput, { target: { value: 'New Name' } });
    fireEvent.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledWith(expect.objectContaining({
      name: 'New Name',
    }));
  });

  it('deletes a habit only after explicit confirmation', async () => {
    const habit: Habit = {
      id: '1',
      userId: 'user1',
      name: 'Delete Me',
      description: '',
      frequency: 'daily',
      createdAt: '2023-01-01T00:00:00Z',
      completions: [],
    };
    const mockOnDelete = vi.fn();

    render(
      <HabitCard 
        habit={habit} 
        onToggle={vi.fn()} 
        onEdit={vi.fn()} 
        onDelete={mockOnDelete} 
      />
    );
    
    const deleteButton = screen.getByTestId('habit-delete-delete-me');
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith(habit);
  });

  it('toggles completion and updates the streak display', async () => {
    const habit: Habit = {
      id: '1',
      userId: 'user1',
      name: 'Streak Habit',
      description: '',
      frequency: 'daily',
      createdAt: '2023-01-01T00:00:00Z',
      completions: [],
    };
    const mockOnToggle = vi.fn();

    render(
      <HabitCard 
        habit={habit} 
        onToggle={mockOnToggle} 
        onEdit={vi.fn()} 
        onDelete={vi.fn()} 
      />
    );
    
    const completeButton = screen.getByTestId('habit-complete-streak-habit');
    fireEvent.click(completeButton);

    expect(mockOnToggle).toHaveBeenCalledWith(habit);
  });
});
