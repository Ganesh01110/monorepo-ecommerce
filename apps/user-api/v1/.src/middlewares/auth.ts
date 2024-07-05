import ErrorHandler from '../utils/errorhandler';
import { Request, Response, NextFunction } from 'express';
import catchAsyncErrors from './catchAsyncError';
import jwt from 'jsonwebtoken';
import User from '../user/userModel';
import {config} from '../config/config'

interface DecodedData {
  id: string;
  // Add other properties from decoded JWT if necessary
}

interface CustomRequest extends Request {
  user?: {
    id: string;
  };
}
const isAuthenticatedUser = catchAsyncErrors(async (req: CustomRequest, res: Response, next: NextFunction) => {

  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Please Login to access this resource", 401));
  }

  try {
  
    const decodedData: any = jwt.verify(token, config.jwtSecret) as DecodedData;
    
    if (!decodedData || !decodedData.id) {
      return next(new ErrorHandler('Invalid token format, please login again', 401));
    }

    const user = await User.findById(decodedData.id);

    if (!user) {
      return next(new ErrorHandler('User not found', 404));
    }

    // Assign user to req.user
    req.user = { id: user._id.toString() }; // Ensure req.user matches your expected type

    next();
    
  } catch (error) {
      return next(new ErrorHandler("Authentication failed", 500));
    }
  
});

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    try {
    
      if (!roles.includes(req.user.role)) {
        return next(
          new ErrorHandler(
            `Role: ${req.user.role} is not allowed to access this resouce `,
            403
          )
        );
      }
  
      next();

    } catch (error) {
        return next(new ErrorHandler("Authentication failed", 500));
      }
   
  };
};

export { isAuthenticatedUser , authorizeRoles };
