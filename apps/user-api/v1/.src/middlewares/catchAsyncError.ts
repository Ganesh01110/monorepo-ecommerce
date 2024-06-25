import { Request, Response, NextFunction } from 'express';

type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<any>;

const catchAsyncError = (fn: AsyncFunction) => (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
};

export default catchAsyncError;

// module.exports = (theFunc) => (req, res, next) => {
//     Promise.resolve(theFunc(req, res, next)).catch(next);
//   };
  