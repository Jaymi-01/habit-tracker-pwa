export const STORAGE_KEYS = {
  USERS: 'habit-tracker-users',
  SESSION: 'habit-tracker-session',
  HABITS: 'habit-tracker-habits',
} as const;

export function getFromStorage<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  const item = window.localStorage.getItem(key);
  if (!item) return null;
  try {
    return JSON.parse(item) as T;
  } catch {
    return null;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function removeFromStorage(key: string): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(key);
}

export function clearStorage(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.clear();
}
