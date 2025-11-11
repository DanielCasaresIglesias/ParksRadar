// backend/src/routes/parksRoutes.ts
import { Router, Request, Response, NextFunction } from 'express';
import pool from '../db';
import { buildParksFilterQuery } from '../services/parksService';
import { ParksFilterParams } from '../types/parkFilters';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters: ParksFilterParams = {
      states: (req.query.parkState as string | undefined)?.split(',') || [],
      regions: (req.query.region as string | undefined)?.split(',') || [],
      trails: (req.query.trails as string | undefined)?.split(',') || [],
      camps: (req.query.camps as string | undefined)?.split(',') || [],
      activities:
        (req.query.activities as string | undefined)?.split(',') || [],
      facilities:
        (req.query.facilities as string | undefined)?.split(',') || [],
      features: (req.query.features as string | undefined)?.split(',') || [],
      ratingMin: req.query.ratingMin
        ? parseFloat(req.query.ratingMin as string)
        : null,
      entryFeeMin: req.query.entryFeeMin
        ? parseFloat(req.query.entryFeeMin as string)
        : null,
      entryFeeMax: req.query.entryFeeMax
        ? parseFloat(req.query.entryFeeMax as string)
        : null,
      parkingFeeMin: req.query.parkingFeeMin
        ? parseFloat(req.query.parkingFeeMin as string)
        : null,
      parkingFeeMax: req.query.parkingFeeMax
        ? parseFloat(req.query.parkingFeeMax as string)
        : null,
      accessibility:
        (req.query.accessibility as string | undefined)?.split(',') || [],
      permits: {
        drone: req.query['permits[drone]'] as string | null | undefined,
        fishing: req.query['permits[fishing]'] as string | null | undefined,
        hunting: req.query['permits[hunting]'] as string | null | undefined,
        backcountry: req.query['permits[backcountry]'] as
          | string
          | null
          | undefined,
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
