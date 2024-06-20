import express from 'express';
import { getUserProfile, loginUser, updateUserProfile, userControllers } from './user.controller';
import { authMiddleware } from '../../middleware/auth.middleware';


const route = express.Router();

route.post('/signup', userControllers.createUser);

route.post('/login', loginUser);

route.get('/me', authMiddleware, userControllers.getUserProfile);

route.put('/me', authMiddleware, updateUserProfile);



export const UserRoute = route;
