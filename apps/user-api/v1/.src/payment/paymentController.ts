import catchAsyncError from "../middlewares/catchAsyncError";
import Stripe from "stripe";
import {config} from '../config/config';
import { Request, Response, NextFunction } from 'express';


const stripeInstance = new Stripe(config.stripeSecretKey, { apiVersion: '2020-08-27' });

// const stripeInstance = stripe(config.stripeSecretKey);

const processPayment = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const myPayment = await Stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "inr",
    metadata: {
      company: "Ecommerce",
    },
  });

  res
    .status(200)
    .json({ success: true, client_secret: myPayment.client_secret });
});

const sendStripeApiKey = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ stripeApiKey: config.cloudinaryApiKey });
});

export {stripeInstance,sendStripeApiKey , processPayment}
