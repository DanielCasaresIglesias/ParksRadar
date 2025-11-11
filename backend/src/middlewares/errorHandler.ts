// backend/src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from 'express';

export default function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err.stack);
  if (res.headersSent) {
    return next(err); // forward to default Express handler
  }
  res.status(500).json({ message: 'Internal Server Error' });
}
