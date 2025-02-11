import Order from './orderModel';
import Product from '../product/productModel';
import ErrorHandler from "../utils/errorhandler";
import catchAsyncErrors from "../middlewares/catchAsyncError"
import { Request, Response, NextFunction } from 'express';

// custom request interface
interface CustomRequest extends Request {
  user?: {
    _id: string;
  };
}

// Create new Order
const newOrder = catchAsyncErrors(async (req:CustomRequest, res:Response, next:NextFunction) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (!req.user) {
    return next(new ErrorHandler("User not authenticated", 401));
  }

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user!._id,
  });

  res.status(201).json({
    success: true,
    order,
  });
});

// get Single Order
const getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// get logged in user  Orders
const myOrders = catchAsyncErrors(async (req: CustomRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new ErrorHandler("User not authenticated", 401));
  }
  
  const orders = await Order.find({ user: req.user!._id });

  res.status(200).json({
    success: true,
    orders,
  });
});

// get all Orders -- Admin
const getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find();

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

// update Order Status -- Admin
const updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("You have already delivered this order", 400));
  }

  if (req.body.status === "Shipped") {
    order.orderItems.forEach(async (o) => {
      //await updateStock(o.product, o.quantity);
      try {
        await updateStock(o.product , o.quantity);
      } catch (error) {
        console.error(error.message);
         return next(new ErrorHandler("update process for order got some error", 500));
        // Handle the error appropriately
      }
    });
  }
  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

async function updateStock(id, quantity: number) {
  const product = await Product.findById(id);

  if (!product) {
    return (new ErrorHandler("product not found", 404));
    // throw new Error("Product not found",404);
  }

  product.stock -= quantity;

  await product.save({ validateBeforeSave: false });
}

// delete Order -- Admin
const deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  await order.remove();

  res.status(200).json({
    success: true,
  });
});


export {
  newOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
} ;