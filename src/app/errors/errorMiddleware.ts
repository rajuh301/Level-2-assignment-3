// app/middleware/globalErrorHandler.ts
import { Request, Response, NextFunction } from 'express';
import AppError from './AppError';

const globalErrorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    errorMessages: [
      {
        path: req.path,
        message: err.message,
      },
    ],
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

export default globalErrorHandler;
