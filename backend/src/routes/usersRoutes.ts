// backend/src/routes/usersRoutes.ts
import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  getSavedParks,
  savePark,
  unsavePark,
  getTrips,
  createTrip,
  deleteTrip,
} from '../controllers/usersController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Profile: GET & PUT /api/users/me
router.get('/me', authMiddleware, getProfile);
router.put('/me', authMiddleware, updateProfile);

// Saved parks:
//   GET /api/users/saved,
//   POST /api/users/saved/:parkId,
//   DELETE /api/users/saved/:parkId
router.get('/saved', authMiddleware, getSavedParks);
router.post('/saved/:parkId', authMiddleware, savePark);
router.delete('/saved/:parkId', authMiddleware, unsavePark);

// Trips:
//   GET /api/users/trips,
//   POST /api/users/trips,
//   DELETE /api/users/trips/:id
router.get('/trips', authMiddleware, getTrips);
router.post('/trips', authMiddleware, createTrip);
router.delete('/trips/:id', authMiddleware, deleteTrip);

export default router;
