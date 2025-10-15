import express from "express";
import {
  clerkWebhooks,
  userCredits,
} from "../controllers/UserController.js";
import authUser from "../middlewares/auth.js";

const useRouter = express.Router();

useRouter.post("/webhooks", clerkWebhooks);
useRouter.get("/credits", authUser, userCredits);


export default useRouter;
