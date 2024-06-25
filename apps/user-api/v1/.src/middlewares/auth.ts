import ErrorHandler from '../utils/errorhandler';
import catchAsyncErrors from './catchAsyncError';
import jwt from 'jsonwebtoken';
import User from '../user/userModel';
import {config} from '../config/config'

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {

  try {

    const { token } = req.cookies;

    if (!token) {
      return next(new ErrorHandler("Please Login to access this resource", 401));
    }
  
    const decodedData = jwt.verify(token, config.jwtSecret);
  
    req.user = await User.findById(decodedData.id);
  
    next();
    
  } catch (error) {
      return next(new ErrorHandler("Authentication failed", 500));
    }
  
});

exports.authorizeRoles = (...roles) => {
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
