'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Session } from '@/types/auth';
import { Habit } from '@/types/habit';
import { HabitCard } from '@/components/habits/HabitCard';
import { HabitForm } from '@/components/habits/HabitForm';
import { toggleHabitCompletion } from '@/lib/habits';
import { calculateCurrentStreak } from '@/lib/streaks';
import { SplashScreen } from '@/components/shared/SplashScreen';

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [deletingHabit, setDeletingHabit] = useState<Habit | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const sessionJson = localStorage.getItem('habit-tracker-session');
    if (!sessionJson) {
      router.push('/login');
      return;
    }
    const currentSession = JSON.parse(sessionJson);
    setSession(currentSession);

    const habitsJson = localStorage.getItem('habit-tracker-habits');
    const allHabits: Habit[] = habitsJson ? JSON.parse(habitsJson) : [];
    const userHabits = allHabits.filter((h) => h.userId === currentSession.userId);
    setHabits(userHabits);
    setIsLoading(false);
  }, [router]);

  const saveHabitsToLocalStorage = (updatedHabits: Habit[]) => {
    const habitsJson = localStorage.getItem('habit-tracker-habits');
    const allHabits: Habit[] = habitsJson ? JSON.parse(habitsJson) : [];
    
    // Filter out current user's old habits and add new ones
    const otherUsersHabits = allHabits.filter((h) => h.userId !== session?.userId);
    const newAllHabits = [...otherUsersHabits, ...updatedHabits];
    
    localStorage.setItem('habit-tracker-habits', JSON.stringify(newAllHabits));
    setHabits(updatedHabits);
  };

  const handleCreateHabit = (habitData: Partial<Habit>) => {
    if (!session) return;
    
    const newHabit: Habit = {
      id: Math.random().toString(36).substr(2, 9),
      userId: session.userId,
      name: habitData.name!,
      description: habitData.description || '',
      frequency: 'daily',
      createdAt: new Date().toISOString(),
      completions: [],
    };

    saveHabitsToLocalStorage([...habits, newHabit]);
    setIsFormOpen(false);
  };

  const handleUpdateHabit = (habitData: Partial<Habit>) => {
    if (!editingHabit) return;

    const updatedHabits = habits.map((h) =>
      h.id === editingHabit.id
        ? { ...h, name: habitData.name!, description: habitData.description || '' }
        : h
    );

    saveHabitsToLocalStorage(updatedHabits);
    setEditingHabit(null);
  };

  const handleDeleteHabit = () => {
    if (!deletingHabit) return;

    const updatedHabits = habits.filter((h) => h.id !== deletingHabit.id);
    saveHabitsToLocalStorage(updatedHabits);
    setDeletingHabit(null);
  };

  const handleToggleCompletion = (habit: Habit) => {
    const today = new Date().toISOString().split('T')[0];
    const updatedHabit = toggleHabitCompletion(habit, today);
    const updatedHabits = habits.map((h) => (h.id === habit.id ? updatedHabit : h));
    saveHabitsToLocalStorage(updatedHabits);
  };

  const handleLogout = () => {
    localStorage.removeItem('habit-tracker-session');
    router.push('/login');
  };

  const today = new Date().toISOString().split('T')[0];
  const completedTodayCount = habits.filter((h) => h.completions.includes(today)).length;
  
  const totalMaxStreak = habits.reduce((max, habit) => {
    const streak = calculateCurrentStreak(habit.completions, today);
    return Math.max(max, streak);
  }, 0);

  if (isLoading) return <SplashScreen />;

  return (
    <div data-testid="dashboard-page" className="min-h-screen bg-background p-4 sm:p-8">
      <header className="max-w-4xl mx-auto flex justify-between items-start mb-8">
        <div className="pr-4">
          <h1 className="text-2xl font-bold text-primary">Habit Tracker</h1>
          <p className="text-xs sm:text-sm text-foreground/60 break-all">{session?.email}</p>
        </div>
        <button
          data-testid="auth-logout-button"
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm font-medium text-foreground/60 hover:text-destructive transition-colors shrink-0"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <span className="hidden sm:inline">Logout</span>
        </button>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8">
          <div>
            <h2 className="text-xl font-bold">Your Habits</h2>
            {habits.length > 0 && (
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm mt-1 animate-in fade-in slide-in-from-top-1 duration-300">
                <span className="text-primary font-bold whitespace-nowrap">
                  {completedTodayCount} of {habits.length} done today
                </span>
                <span className="hidden sm:inline text-foreground/20">•</span>
                <span className="text-primary font-bold whitespace-nowrap">
                  {totalMaxStreak} 🔥 Best Streak
                </span>
              </div>
            )}
          </div>
          <button
            data-testid="create-habit-button"
            onClick={() => setIsFormOpen(true)}
            className="w-full sm:w-auto px-6 py-2.5 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-all active:scale-95 shadow-sm"
          >
            + Add Habit
          </button>
        </div>

        {habits.length === 0 ? (
          <div 
            data-testid="empty-state"
            className="text-center py-12 border-2 border-dashed border-border rounded-lg"
          >
            <p className="text-foreground/60">No habits yet. Start by creating one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onToggle={handleToggleCompletion}
                onEdit={setEditingHabit}
                onDelete={setDeletingHabit}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      {(isFormOpen || editingHabit) && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <HabitForm
            initialHabit={editingHabit || undefined}
            onSave={editingHabit ? handleUpdateHabit : handleCreateHabit}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingHabit(null);
            }}
          />
        </div>
      )}

      {deletingHabit && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-background border border-border rounded-lg p-6 max-w-sm w-full shadow-lg">
            <h2 className="text-xl font-bold mb-2">Delete Habit?</h2>
            <p className="text-foreground/60 mb-6">
              Are you sure you want to delete "{deletingHabit.name}"? This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                data-testid="confirm-delete-button"
                onClick={handleDeleteHabit}
                className="flex-1 py-2 bg-destructive text-destructive-foreground font-semibold rounded-md hover:bg-destructive/90 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setDeletingHabit(null)}
                className="flex-1 py-2 bg-secondary text-secondary-foreground font-semibold rounded-md hover:bg-secondary/80 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
