import { Request, Response, NextFunction } from 'express';
import ErrorHandler from '../utils/errorhander';
import { config } from '../config/config';

interface CustomError extends Error {
  statusCode?: number;
  code?: number;
  keyValue?: Record<string, unknown>;
  path?: string;
  name: string;
}


const errorMiddleware = (err: CustomError , req:Request, res:Response, next:NextFunction) => {

  let error = { ...err }as CustomError;

  // default message and statuscode
  error.message = err.message|| 'Internal Server Error';

  error.statusCode = err.statusCode || 500;
  

  // Wrong Mongodb Id error
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue!)} Entered`;
    err = new ErrorHandler(message, 400);
  }

  // Wrong JWT error
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid, Try again `;
    err = new ErrorHandler(message, 400);
  }

  // JWT EXPIRE error
  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is Expired, Try again `;
    err = new ErrorHandler(message, 400);
  }

  res.status(error.statusCode).json({
    success: false,
    message: err.message,
    errorStack: config.env === 'development' ? err.stack : undefined,
  });
};

export default errorMiddleware;
