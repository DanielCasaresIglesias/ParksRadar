// frontend/src/services/reviewsService.ts
import { API_URL } from './api';
import { authFetch } from './authService';

export interface ReviewPayload {
  park_id: number;
  rating: number;
  review_text?: string;
}

export async function postReview(payload: ReviewPayload) {
  const res = await authFetch(`${API_URL}/reviews`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to post review');
  return res.json();
}

export async function fetchReviewsByPark(parkId: number) {
  const res = await fetch(`${API_URL}/reviews/park/${parkId}`);
  if (!res.ok) throw new Error('Failed to fetch reviews');
  return res.json();
}
