import express from "express";
import { processPayment, sendStripeApiKey } from "./paymentController";
import { isAuthenticatedUser } from "../middlewares/auth";

const router = express.Router();

router.route("/payment/process").post(isAuthenticatedUser, processPayment);

router.route("/stripeapikey").get(isAuthenticatedUser, sendStripeApiKey);

// module.exports = router;
export default router;
