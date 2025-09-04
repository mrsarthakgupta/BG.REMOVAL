import jwt from "jsonwebtoken";

// Middleware funciton to decode jwt token to clerkId
const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers;

    console.log("token :>> ", token);

    if (!token) {
      return res.json({
        success: false,
        message: "Not Authorized Login Again",
      });
    }

    const token_decode = jwt.decode(token);
    req.body.clerkId = token_decode.clerkId;
    next();
  } catch (error) {
    console.log("error :>> ", error.message);
    res.json({ success: false, message: error.message });
  }
};

export default authUser;
