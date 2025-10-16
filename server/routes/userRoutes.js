import express from "express";
import {clerkWebhooks} from "../controllers/UserController.js";
const router = express.Router();

// ✅ Clerk Webhook Endpoint
router.post("/webhook", clerkWebhooks);

export default router;
