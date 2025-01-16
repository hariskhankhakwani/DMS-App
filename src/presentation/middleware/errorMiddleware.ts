import type { Request, Response, NextFunction } from 'express';
import { BaseUserError } from '../../app/errors/userErrors';

export const errorMiddleware = (error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof BaseUserError) {
    res.status(error.code).json({
      status: 'error',
      message: error.message,
    });
    return;
  }

  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
  return;
};
