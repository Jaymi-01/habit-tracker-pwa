import { describe, it, expect, beforeEach } from 'vitest';
import { STORAGE_KEYS, getFromStorage, saveToStorage, removeFromStorage, clearStorage } from '../../src/lib/storage';

describe('storage utility', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('saves and retrieves data from localStorage', () => {
    const data = { test: 'value' };
    saveToStorage(STORAGE_KEYS.USERS, data);
    const retrieved = getFromStorage(STORAGE_KEYS.USERS);
    expect(retrieved).toEqual(data);
  });

  it('returns null for non-existent keys', () => {
    expect(getFromStorage('non-existent')).toBeNull();
  });

  it('removes items from localStorage', () => {
    saveToStorage('test-key', 'value');
    removeFromStorage('test-key');
    expect(getFromStorage('test-key')).toBeNull();
  });

  it('returns null for invalid JSON', () => {
    window.localStorage.setItem('invalid', 'not-json');
    expect(getFromStorage('invalid')).toBeNull();
  });

  it('clears all items from localStorage', () => {
    saveToStorage('key1', 'value1');
    saveToStorage('key2', 'value2');
    clearStorage();
    expect(getFromStorage('key1')).toBeNull();
    expect(getFromStorage('key2')).toBeNull();
  });
});
