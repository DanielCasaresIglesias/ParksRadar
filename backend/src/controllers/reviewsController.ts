// backend/src/controllers/reviewsController.ts

import { Request, Response, NextFunction } from 'express';
import pool from '../db';

export async function getReviewsByPark(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const parkId = parseInt(req.params.parkId, 10);
    const { rows } = await pool.query(
      `
      SELECT
        r.review_id,
        r.review_rating AS rating,
        r.review_contents AS review_text,
        r.review_posting_date AS created_at,
        u.user_name AS author
      FROM reviews r
      JOIN users u ON r.user_id = u.user_id
      WHERE r.park_id = $1
      ORDER BY r.review_posting_date DESC
      `,
      [parkId]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

export async function createReview(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = (req as any).userId;
    const { park_id, rating, review_text } = req.body;

    if (!park_id || rating === undefined) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    const { rows } = await pool.query(
      `INSERT INTO reviews (user_id, park_id, review_rating, review_contents)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, park_id, rating, review_text]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
}

export async function updateReview(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const reviewId = parseInt(req.params.id, 10);
    const userId = (req as any).userId;
    const { rating, review_text } = req.body;

    // Check ownership
    const { rows: existing } = await pool.query(
      'SELECT user_id FROM reviews WHERE review_id = $1',
      [reviewId]
    );
    if (!existing.length) {
      res.status(404).json({ message: 'Review not found' });
      return;
    }
    if (existing[0].user_id !== userId) {
      res.status(403).json({ message: 'Not authorized to edit this review' });
      return;
    }

    const { rows } = await pool.query(
      `UPDATE reviews
       SET review_rating = $1, review_contents = $2
       WHERE review_id = $3
       RETURNING *`,
      [rating, review_text, reviewId]
    );

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

export async function deleteReview(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const reviewId = parseInt(req.params.id, 10);
    const userId = (req as any).userId;

    // Check ownership
    const { rows: existing } = await pool.query(
      'SELECT user_id FROM reviews WHERE review_id = $1',
      [reviewId]
    );
    if (!existing.length) {
      res.status(404).json({ message: 'Review not found' });
      return;
    }
    if (existing[0].user_id !== userId) {
      res.status(403).json({ message: 'Not authorized to delete this review' });
      return;
    }

    await pool.query('DELETE FROM reviews WHERE review_id = $1', [reviewId]);
    res.json({ message: 'Review deleted' });
  } catch (err) {
    next(err);
  }
}
