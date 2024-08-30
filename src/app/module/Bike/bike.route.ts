import express from 'express';
import { createBike, deleteBike, getAllBikes, updateBike } from './bike.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { adminMiddleware } from './bike.admin.midlewere';

const router = express.Router();

router.post('/', authMiddleware, adminMiddleware, createBike);
router.get('/', getAllBikes);
router.put('/:id', authMiddleware, adminMiddleware, updateBike);
router.delete('/:id', authMiddleware, adminMiddleware, deleteBike);


export const bikeRoutes = router;
