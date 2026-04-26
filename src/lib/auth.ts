import { Session, User } from '@/types/auth';
import { STORAGE_KEYS, getFromStorage, saveToStorage, removeFromStorage } from './storage';

export function getSession(): Session | null {
  return getFromStorage<Session>(STORAGE_KEYS.SESSION);
}

export function setSession(session: Session): void {
  saveToStorage(STORAGE_KEYS.SESSION, session);
}

export function removeSession(): void {
  removeFromStorage(STORAGE_KEYS.SESSION);
}

export function getUsers(): User[] {
  return getFromStorage<User[]>(STORAGE_KEYS.USERS) || [];
}

export function saveUser(user: User): void {
  const users = getUsers();
  saveToStorage(STORAGE_KEYS.USERS, [...users, user]);
}
