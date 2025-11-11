// frontend/src/services/authService.ts
import { API_URL } from './api';
import type { LoginData } from '../src/types/loginData';

export interface SignupData {
  username: string;
  email: string;
  password: string;
}

export async function login(data: LoginData) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json(); // { user, token }
}

export async function signup(data: SignupData) {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Signup failed');
  return res.json(); // { user, token }
}

// For protected requests:
export function authFetch(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
}
