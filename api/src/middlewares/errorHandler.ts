import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
    err: any, 
    req: Request, 
    res: Response, 
    _: NextFunction
) => {
  console.error('[Error]', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  });
};
