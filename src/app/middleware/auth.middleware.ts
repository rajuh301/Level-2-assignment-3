

import { Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../module/User/user.model';
import { AuthRequest } from '../interface';
import { TUser } from '../module/User/user.interface';

dotenv.config();



export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  let token: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else {
    token = authHeader;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'You are unauthorized',
    });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || process.env.JWT_ACCESS_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({
        success: false,
        message: 'Internal server error v1',
        error: 'JWT secret is not defined',
      });
    }

    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: 'You are not authorized to access this application',
      });
    }

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found !!',
      });
    }

    req.user = user as TUser;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'You are not authorized to access this application',
    });
  }
};



