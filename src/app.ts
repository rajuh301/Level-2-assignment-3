import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './app/routes';
import AppError from './app/errors/AppError';
import globalErrorHandler from './app/errors/errorMiddleware';


const app: Application = express();

// Parsers
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ['http://localhost:5173'] }));

// Application route
app.use('/api', router);

// Test route
app.get('/', (req: Request, res: Response) => {
  const a = 10;
  res.send(a.toString());
});

// Not found handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new AppError(404,'You have no access to this route'));
});

// Global error handler
app.use(globalErrorHandler);

export default app;
