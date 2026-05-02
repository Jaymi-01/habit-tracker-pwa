export function calculateCurrentStreak(completions: string[], todayArg?: string): number {
  if (!completions.length) return 0;
  
  const today = todayArg || new Date().toISOString().split('T')[0];
  
  if (!completions.includes(today)) {
    return 0;
  }
  
  const uniqueDates = Array.from(new Set(completions)).sort((a, b) => b.localeCompare(a));
  
  let streak = 0;
  let currentDate = new Date(today);
  
  while (true) {
    const dateString = currentDate.toISOString().split('T')[0];
    if (uniqueDates.includes(dateString)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
}
