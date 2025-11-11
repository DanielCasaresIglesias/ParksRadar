// backend/src/controllers/authController.ts

import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db';

interface UserRow {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  profile_pic_url: string | null;
}

export async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    const password_hash = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      `INSERT INTO users (username, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, username, email, profile_pic_url`,
      [username, email, password_hash]
    );
    const newUser = rows[0];
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      // If JWT_SECRET not set, throw an error so it goes to your error handler
      throw new Error('Missing JWT_SECRET in environment');
    }
    const token = jwt.sign({ id: newUser.id }, secret, { expiresIn: '7d' });

    res.status(201).json({
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        profile_pic_url: newUser.profile_pic_url,
      },
      token,
    });
  } catch (err: any) {
    // Unique violation: duplicate email or username
    if (err.code === '23505') {
      res.status(400).json({ message: 'Username or email already exists' });
      return;
    }
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: 'Missing email or password' });
      return;
    }

    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);
    if (!rows.length) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const user: UserRow = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('Missing JWT_SECRET in environment');
    }
    const token = jwt.sign({ id: user.id }, secret, { expiresIn: '7d' });

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        profile_pic_url: user.profile_pic_url,
      },
      token,
    });
  } catch (err) {
    next(err);
  }
}

export async function getCurrentUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = (req as any).userId;
    const { rows } = await pool.query(
      'SELECT id, username, email, profile_pic_url FROM users WHERE id = $1',
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
