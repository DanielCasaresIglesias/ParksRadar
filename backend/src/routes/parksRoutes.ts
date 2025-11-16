// backend/src/routes/parksRoutes.ts
import { Router, Request, Response, NextFunction } from 'express';
import pool from '../db';
import { buildParksFilterQuery } from '../services/parksService';
import { ParksFilterParams } from '../types/parkFilters';

const router = Router();

function splitAndClean(value?: string): string[] {
  return value
    ? value
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean)
    : [];
}

function parseBool(value: unknown): boolean | null {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return null;
}

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters: ParksFilterParams = {
      states: splitAndClean(req.query.parkState as string),
      regions: splitAndClean(req.query.region as string),
      trails: splitAndClean(req.query.trails as string),
      camps: splitAndClean(req.query.camps as string),
      activities: splitAndClean(req.query.activities as string),
      facilities: splitAndClean(req.query.facilities as string),
      features: splitAndClean(req.query.features as string),
      ratingMin: req.query.ratingMin
        ? parseFloat(req.query.ratingMin as string)
        : null,
      entryFeeMin: req.query.entryFeeMin
        ? parseFloat(req.query.entryFeeMin as string)
        : null,
      entryFeeMax: req.query.entryFeeMax
        ? parseFloat(req.query.entryFeeMax as string)
        : null,
      accessibility: splitAndClean(req.query.accessibility as string),
      permits: {
        drone: parseBool(req.query['permits[drone]']),
        fishing: parseBool(req.query['permits[fishing]']),
        hunting: parseBool(req.query['permits[hunting]']),
        backcountry: parseBool(req.query['permits[backcountry]']),
      },
      distanceAddress: (req.query.distanceAddress as string) || null,
      distanceMiles: req.query.distanceMiles
        ? parseFloat(req.query.distanceMiles as string)
        : null,
    };

    const { text, values } = buildParksFilterQuery(filters);
    const { rows } = await pool.query(text, values);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

export default router;
