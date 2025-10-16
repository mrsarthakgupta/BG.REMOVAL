import { Webhook } from "svix";
import userModel from "../models/userModel.js";

/**
 * Clerk Webhook Controller
 * Handles user.created, user.updated, user.deleted
 * Uses raw body verification to prevent signature failure
 */
export const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // ✅ Verify webhook using raw body (req.body is a Buffer)
    await whook.verify(req.body, {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    // ✅ Parse the raw JSON body
    const { data, type } = JSON.parse(req.body);

    switch (type) {
      case "user.created": {
        const userData = {
          clerkId: data.id,
          email: data.email_addresses[0].email_address,
          firstName: data.first_name,
          lastName: data.last_name,
          photo: data.image_url,
        };
        await userModel.create(userData);
        console.log(`🟢 User created: ${data.id}`);
        break;
      }

      case "user.updated": {
        const updatedData = {
          email: data.email_addresses[0].email_address,
          firstName: data.first_name,
          lastName: data.last_name,
          photo: data.image_url,
        };
        await userModel.findOneAndUpdate({ clerkId: data.id }, updatedData);
        console.log(`🟡 User updated: ${data.id}`);
        break;
      }

      case "user.deleted": {
        await userModel.findOneAndDelete({ clerkId: data.id });
        console.log(`🔴 User deleted: ${data.id}`);
        break;
      }

      default:
        console.log("⚪ Unhandled Clerk webhook event:", type);
        break;
    }

    // ✅ Respond with 200 to acknowledge webhook
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Clerk webhook error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
