import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';

interface ErrorResponse {
  status: string;
  message: string;
  statusCode: number;
  stack?: string;
  error?: any;
}

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong!';
  let status = err.status || 'error';

  console.error('GLOBAL ERROR HANDLER:', err);

  if (err.name === 'CastError') { 
    message = `Invalid ${err.path}: ${err.value}.`;
    statusCode = 400;
    status = 'fail';
    err = new AppError(message, statusCode); 
  } else if (err.code === 11000) { 
    const value = err.keyValue ? Object.values(err.keyValue).join('') : 'duplicate value';
    message = `Duplicate field value: ${value}. Please use another value.`;
    statusCode = 400;
    status = 'fail';
    err = new AppError(message, statusCode); 
  } else if (err.name === 'ValidationError') { 
    const errors = Object.values(err.errors).map((el: any) => el.message);
    message = `Invalid input data: ${errors.join('. ')}`;
    statusCode = 400;
    status = 'fail';
    err = new AppError(message, statusCode); 
  } else if (err.name === 'JsonWebTokenError') {
    message = 'Invalid token. Please log in again!';
    statusCode = 401;
    status = 'fail';
    err = new AppError(message, statusCode);
  } else if (err.name === 'TokenExpiredError') {
    message = 'Your token has expired! Please log in again.';
    statusCode = 401;
    status = 'fail';
    err = new AppError(message, statusCode);
  } else if (!(err instanceof AppError)) {
    statusCode = 500;
    message = 'Something went very wrong!';
    status = 'error';
  }

  const errorResponse: ErrorResponse = {
    status: status,
    message: message,
    statusCode: statusCode,
  };

  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
    errorResponse.error = err;
  }

  res.status(statusCode).json(errorResponse);
};

export default errorHandler;
