import { STORAGE_KEYS } from './constants';
import type { User, Baby } from './types';

// Token Management
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
};

export const setToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
};

export const removeToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
};

// User Management
export const getUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const userData = localStorage.getItem(STORAGE_KEYS.USER);
  return userData ? JSON.parse(userData) : null;
};

export const setUser = (user: User): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

export const removeUser = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.USER);
};

// Baby Profile Management
export const getSelectedBaby = (): Baby | null => {
  if (typeof window === 'undefined') return null;
  const babyData = localStorage.getItem(STORAGE_KEYS.SELECTED_BABY);
  return babyData ? JSON.parse(babyData) : null;
};

export const setSelectedBaby = (baby: Baby): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.SELECTED_BABY, JSON.stringify(baby));
};

export const removeSelectedBaby = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.SELECTED_BABY);
};

// Clear All Storage
export const clearStorage = (): void => {
  if (typeof window === 'undefined') return;
  removeToken();
  removeUser();
  removeSelectedBaby();
};
