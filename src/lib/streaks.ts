export function calculateCurrentStreak(completions: string[], today?: string): number {
  if (!completions.length) return 0;
  
  const targetToday = today || new Date().toISOString().split('T')[0];
  
  // Remove duplicates and sort descending
  const uniqueDates = Array.from(new Set(completions)).sort((a, b) => b.localeCompare(a));
  
  if (!uniqueDates.includes(targetToday)) {
    return 0;
  }
  
  let streak = 0;
  let currentDate = new Date(targetToday);
  
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
