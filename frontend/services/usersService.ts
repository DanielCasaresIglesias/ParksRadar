// frontend/src/services/usersService.ts
import { API_URL } from './api';
import { authFetch } from './authService';

export interface ProfileUpdatePayload {
  username?: string;
  email?: string;
  password?: string;
  // profile_pic_url?: string; // if you pass a Cloudinary URL directly
}

// Profile
export async function fetchProfile() {
  const res = await authFetch(`${API_URL}/users/me`);
  if (!res.ok) throw new Error('Failed to fetch profile');
  return res.json();
}
export async function updateProfile(payload: ProfileUpdatePayload) {
  const res = await authFetch(`${API_URL}/users/me`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update profile');
  return res.json();
}

// Saved parks
export async function fetchSavedParks() {
  const res = await authFetch(`${API_URL}/users/saved`);
  if (!res.ok) throw new Error('Failed to fetch saved parks');
  return res.json();
}
export async function savePark(parkId: number) {
  const res = await authFetch(`${API_URL}/users/saved/${parkId}`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to save park');
  return res.json();
}
export async function unsavePark(parkId: number) {
  const res = await authFetch(`${API_URL}/users/saved/${parkId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to unsave park');
  return res.json();
}

// Trips
export interface TripPayload {
  park_id: number;
  trip_date: string; // e.g. "2025-07-15"
  notes?: string;
}
export async function fetchTrips() {
  const res = await authFetch(`${API_URL}/users/trips`);
  if (!res.ok) throw new Error('Failed to fetch trips');
  return res.json();
}
export async function createTrip(payload: TripPayload) {
  const res = await authFetch(`${API_URL}/users/trips`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create trip');
  return res.json();
}
export async function deleteTrip(tripId: number) {
  const res = await authFetch(`${API_URL}/users/trips/${tripId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete trip');
  return res.json();
}
