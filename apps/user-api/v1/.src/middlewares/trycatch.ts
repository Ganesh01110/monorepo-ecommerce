try {
    
} catch (error) {
    return next(new ErrorHandler("Authentication failed", 500));
  }