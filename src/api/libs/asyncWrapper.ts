import { NextFunction, Request, RequestHandler, Response } from 'express';

/**
 * @see https://expressjs.com/ja/advanced/best-practice-performance.html#promises
 */
export const wrap = (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler => {
  return (req, res, next) => fn(req, res, next).catch(next);
};
