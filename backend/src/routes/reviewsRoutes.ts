// backend/src/routes/reviewsRoutes.ts
import { Router } from 'express';
import {
  getReviewsByPark,
  createReview,
  updateReview,
  deleteReview,
} from '../controllers/reviewsController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.get('/park/:parkId', getReviewsByPark);
router.post('/', authMiddleware, createReview);
router.put('/:id', authMiddleware, updateReview);
router.delete('/:id', authMiddleware, deleteReview);

export default router;
