import express from "express";
import StripeController from "../Controllers/StripeController.js";
const router = express.Router();

router.get("/config", StripeController.stripeConfig);
router.post("/create-payment-intent", StripeController.createPaymentIntent);
router.post("/confirmation", StripeController.confitmation);

export default router;
