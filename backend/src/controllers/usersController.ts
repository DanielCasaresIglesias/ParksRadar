// backend/src/controllers/usersController.ts

import { Request, Response, NextFunction } from 'express';
import pool from '../db';
import bcrypt from 'bcrypt';
// import cloudinary from '../services/cloudinaryService';
// import fs from 'fs';

// 1) getProfile
export async function getProfile(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = (req as any).userId;
    const { rows } = await pool.query(
      'SELECT id, username, email, profile_pic_url, created_at FROM users WHERE id=$1',
      [userId]
    );

    if (!rows.length) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

// 2) updateProfile
export async function updateProfile(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = (req as any).userId;
    const { username, email, password } = req.body;
    let profile_pic_url = req.body.profile_pic_url as string | undefined;

    // Hash new password if provided
    let password_hash: string | null = null;
    if (password) {
      password_hash = await bcrypt.hash(password, 10);
    }

    // Build dynamic update
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (username) {
      fields.push(`username = $${idx}`);
      values.push(username);
      idx++;
    }
    if (email) {
      fields.push(`email = $${idx}`);
      values.push(email);
      idx++;
    }
    if (password_hash) {
      fields.push(`password_hash = $${idx}`);
      values.push(password_hash);
      idx++;
    }
    if (profile_pic_url) {
      fields.push(`profile_pic_url = $${idx}`);
      values.push(profile_pic_url);
      idx++;
    }

    if (fields.length === 0) {
      res.status(400).json({ message: 'No fields to update' });
      return;
    }

    const query = `
      UPDATE users
      SET ${fields.join(', ')}
      WHERE id=$${idx}
      RETURNING id, username, email, profile_pic_url
    `;
    values.push(userId);

    const { rows } = await pool.query(query, values);
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

// 3) getSavedParks
export async function getSavedParks(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = (req as any).userId;
    const { rows } = await pool.query(
      `SELECT p.* FROM saved_parks sp
       JOIN parks p ON sp.park_id = p.park_id
       WHERE sp.user_id = $1`,
      [userId]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

// 4) savePark
export async function savePark(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = (req as any).userId;
    const parkId = parseInt(req.params.parkId, 10);
    await pool.query(
      `INSERT INTO saved_parks (user_id, park_id)
       VALUES ($1, $2)
       ON CONFLICT DO NOTHING`,
      [userId, parkId]
    );
    res.status(201).json({ message: 'Park saved' });
  } catch (err) {
    next(err);
  }
}

// 5) unsavePark
export async function unsavePark(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = (req as any).userId;
    const parkId = parseInt(req.params.parkId, 10);
    await pool.query(
      'DELETE FROM saved_parks WHERE user_id=$1 AND park_id=$2',
      [userId, parkId]
    );
    res.json({ message: 'Park unsaved' });
  } catch (err) {
    next(err);
  }
}

// 6) getTrips
export async function getTrips(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = (req as any).userId;
    const { rows } = await pool.query(
      `
      SELECT
        t.*,
        p.park_name AS park_name,
        p.park_state AS park_state,
        p.park_region AS park_region
      FROM trips t
      JOIN parks p ON t.park_id = p.park_id
      WHERE t.user_id = $1
      ORDER BY t.trip_date DESC`,
      [userId]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

// 7) createTrip
export async function createTrip(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = (req as any).userId;
    const { park_id, trip_date, notes } = req.body;

    if (!park_id || !trip_date) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    const { rows } = await pool.query(
      `INSERT INTO trips (user_id, park_id, trip_date, notes)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, park_id, trip_date, notes]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
}

// 8) deleteTrip
export async function deleteTrip(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = (req as any).userId;
    const tripId = parseInt(req.params.id, 10);

    const { rows: checkRows } = await pool.query(
      'SELECT user_id FROM trips WHERE id=$1',
      [tripId]
    );
    if (!checkRows.length) {
      res.status(404).json({ message: 'Trip not found' });
      return;
    }
    if (checkRows[0].user_id !== userId) {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    await pool.query('DELETE FROM trips WHERE id=$1', [tripId]);
    res.json({ message: 'Trip deleted' });
  } catch (err) {
    next(err);
  }
}
