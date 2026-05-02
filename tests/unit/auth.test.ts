import { describe, it, expect, beforeEach } from 'vitest';
import { getSession, setSession, removeSession, getUsers, saveUser } from '../../src/lib/auth';
import { User, Session } from '../../src/types/auth';

describe('auth utility', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    password: 'pass',
    createdAt: '2023-01-01',
  };

  const mockSession: Session = {
    userId: '1',
    email: 'test@example.com',
  };

  it('manages session correctly', () => {
    expect(getSession()).toBeNull();
    setSession(mockSession);
    expect(getSession()).toEqual(mockSession);
    removeSession();
    expect(getSession()).toBeNull();
  });

  it('manages users correctly', () => {
    expect(getUsers()).toEqual([]);
    saveUser(mockUser);
    expect(getUsers()).toEqual([mockUser]);
  });
});
