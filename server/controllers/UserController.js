import { Webhook } from "svix";
import userModel from "../models/userModel.js";

export const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // ✅ Use raw body buffer for verification
    await whook.verify(req.body, {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    // ✅ Parse raw JSON after verification
    const { type, data } = JSON.parse(req.body);

    switch (type) {
      case "user.created":
        await userModel.create({
          clerkId: data.id,
          email: data.email_addresses[0].email_address,
          firstName: data.first_name,
          lastName: data.last_name,
          photo: data.image_url,
        });
        console.log("🟢 User created:", data.id);
        break;

      case "user.updated":
        await userModel.findOneAndUpdate(
          { clerkId: data.id },
          {
            email: data.email_addresses[0].email_address,
            firstName: data.first_name,
            lastName: data.last_name,
            photo: data.image_url,
          }
        );
        console.log("🟡 User updated:", data.id);
        break;

      case "user.deleted":
        await userModel.findOneAndDelete({ clerkId: data.id });
        console.log("🔴 User deleted:", data.id);
        break;

      default:
        console.log("⚪ Unhandled webhook type:", type);
        break;
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Clerk webhook error:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};
