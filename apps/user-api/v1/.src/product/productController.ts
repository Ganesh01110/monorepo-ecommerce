import Product from './productModel';
import { IProduct , IReview } from './productTypes'
import ErrorHandler from '../utils/errorhandler';
import catchAsyncError from '../middlewares/catchAsyncError';
import ApiFeatures from '../utils/apifeatures';
import cloudinary from 'cloudinary';
import User from '../user/userModel';
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

interface AuthenticatedRequest extends Request {
  user?: any; // Define the type of 'user' according to your authentication setup
}

// Define an interface for the user property on the request object
interface CustomRequest extends Request {
  user?: {
    _id: mongoose.Types.ObjectId;
    id: mongoose.Types.ObjectId;
    name?: string;
  };
}

// Type guard to ensure `_id` is defined
function hasId(review: IReview): review is IReview & { _id: string } {
  return (review as IReview & { _id: string })._id !== undefined;
}

// Create Product -- Admin
const createProduct = catchAsyncError(async (req: AuthenticatedRequest, res, next) => {
  let images:string[] = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLinks: { public_id: string; url: string }[] = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;
  req.body.user = req.user?.id;

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

// Get All Product
const getAllProducts = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const resultPerPage = 8;
  const productsCount = await Product.countDocuments();

  const apiFeature = new ApiFeatures(Product.find<IProduct>(), req.query)
    .search()
    .filter();

  let products = await apiFeature.executeQuery();
  const filteredProductsCount = products.length;

  apiFeature.pagination(resultPerPage);

  products = await apiFeature.executeQuery();

  res.status(200).json({
    success: true,
    products,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  });
});


// Get All Product (Admin)
const getAdminProducts = catchAsyncError(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    products,
  });
});

// Get Product Details
const getProductDetails = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// Update Product -- Admin

const updateProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  // Images Start Here
  let images: string[] = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // Deleting Images From Cloudinary
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    const imagesLinks: { public_id: string; url: string }[] = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

// Delete Product

const deleteProduct = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  // Deleting Images From Cloudinary
  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }

  // await product.remove();
  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product Delete Successfully",
  });
});

// Create New Review or Update the review
const createProductReview = catchAsyncError(async (req: CustomRequest, res: Response, next: NextFunction)=> {

  const { rating, comment, productId } = req.body;

  // Fetch user details
  const user = await User.findById(req.user!._id); // Fetch user details

  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }

  const review: IReview = {
    // user: new mongoose.Types.ObjectId(user!.id),
    user: user!._id.toString(),
    name: user!.name,
    rating: Number(rating),
    comment,
  };


 // Fetch product details
  const product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user!._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user!._id.toString()) 
        {
          rev.rating = rating;
          rev.comment = comment;
        }
       
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length;


  // Save product with updated reviews and ratings
  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    review,
  });
});

// Get All Reviews of a product
const getProductReviews = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// Delete Review
const deleteReview = catchAsyncError(async (req: CustomRequest, res: Response, next: NextFunction) => {

  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id?.toString() !== req.query.id?.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});

export {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  createProductReview,
  getProductReviews,
  deleteReview,
  getAdminProducts,
}
