import { Router } from 'express';
import { createRental, getAllRentalsForUser, returnBike } from './rental.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { adminMiddleware } from '../Bike/bike.admin.midlewere';


const router = Router();

router.post('/', authMiddleware, createRental);
router.put('/:id/return', authMiddleware, adminMiddleware, returnBike);
router.get('/', authMiddleware, getAllRentalsForUser);



export const rentalRoute = router;
  