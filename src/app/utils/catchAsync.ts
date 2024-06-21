import { Request, Response, NextFunction } from 'express';

// Define a specific type for the handler function
type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

const catchAsync = (fn: AsyncRequestHandler) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export default catchAsync;
