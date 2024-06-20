// routes/index.ts
import { Router } from 'express';
import { UserRoute } from '../module/User/user.route';
import { bikeRoutes } from '../module/Bike/bike.route';
import { rentalRoute } from '../module/Rental/rental.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: UserRoute,
  },


  {
    path: '/users',
    route: UserRoute,
  },

  {
    path: '/bikes',
    route: bikeRoutes
  },
  {
    path: '/rentals',
    route: rentalRoute
  }

];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
