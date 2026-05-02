'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Session } from '@/src/types/auth';
import { Habit } from '@/src/types/habit';
import { HabitList } from '@/src/components/habits/HabitList';
import { HabitForm } from '@/src/components/habits/HabitForm';
import { toggleHabitCompletion } from '@/src/lib/habits';
import { calculateCurrentStreak } from '@/src/lib/streaks';
import { SplashScreen } from '@/src/components/shared/SplashScreen';
import { ProtectedRoute } from '@/src/components/shared/ProtectedRoute';
import { getSession, removeSession } from '@/src/lib/auth';
import { STORAGE_KEYS, getFromStorage, saveToStorage } from '@/src/lib/storage';
import { ROUTES } from '@/src/lib/constants';

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentSession = getSession();
    if (!currentSession) {
      setIsLoading(false);
      return;
    }
    setSession(currentSession);

    const allHabits = getFromStorage<Habit[]>(STORAGE_KEYS.HABITS) || [];
    const userHabits = allHabits.filter((h) => h.userId === currentSession.userId);
    setHabits(userHabits);
    setIsLoading(false);
  }, []);

  const saveHabitsToLocalStorage = (updatedHabits: Habit[]) => {
    const allHabits = getFromStorage<Habit[]>(STORAGE_KEYS.HABITS) || [];
    const otherUsersHabits = allHabits.filter((h) => h.userId !== session?.userId);
    const newAllHabits = [...otherUsersHabits, ...updatedHabits];
    
    saveToStorage(STORAGE_KEYS.HABITS, newAllHabits);
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

  const handleDeleteHabit = (habit: Habit) => {
    const updatedHabits = habits.filter((h) => h.id !== habit.id);
    saveHabitsToLocalStorage(updatedHabits);
  };

  const handleToggleCompletion = (habit: Habit) => {
    const today = new Date().toISOString().split('T')[0];
    const updatedHabit = toggleHabitCompletion(habit, today);
    const updatedHabits = habits.map((h) => (h.id === habit.id ? updatedHabit : h));
    saveHabitsToLocalStorage(updatedHabits);
  };

  const handleLogout = () => {
    removeSession();
    window.localStorage.removeItem('habit-tracker-session');
    router.replace("/login");
  };

  const today = new Date().toISOString().split('T')[0];
  const completedTodayCount = habits.filter((h) => h.completions.includes(today)).length;
  
  const totalMaxStreak = habits.reduce((max, habit) => {
    const streak = calculateCurrentStreak(habit.completions, today);
    return Math.max(max, streak);
  }, 0);

  if (isLoading) return <SplashScreen />;

  return (
    <ProtectedRoute>
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

          <HabitList
            habits={habits}
            onToggle={handleToggleCompletion}
            onEdit={setEditingHabit}
            onDelete={handleDeleteHabit}
          />
        </main>

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
      </div>
    </ProtectedRoute>
  );
}
