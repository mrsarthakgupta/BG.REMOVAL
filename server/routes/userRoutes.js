import express from "express";
import {
  clerkWebhooks,
  paymentRazorpay,
  userCredits,
  verifyRazorPay,
} from "../controllers/UserController.js";
import authUser from "../middlewares/auth.js";

const useRouter = express.Router();

useRouter.post("/webhooks", clerkWebhooks);
useRouter.get("/credits", authUser, userCredits);
useRouter.post("/pay-razor", authUser, paymentRazorpay);
useRouter.post("/verify-razor", verifyRazorPay);

export default useRouter;
