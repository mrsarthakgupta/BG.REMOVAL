import express from "express";
import {clerkWebhooks} from "../controllers/UserController.js";


const useRouter = express.Router();

useRouter.post("/webhooks", clerkWebhooks);

export default useRouter;
