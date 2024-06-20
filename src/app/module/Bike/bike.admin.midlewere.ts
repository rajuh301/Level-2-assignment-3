
import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../../interface';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    return next(new AppError(httpStatus.FORBIDDEN, 'Access denied !'));
  }
  next();
};
