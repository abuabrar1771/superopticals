// backend/middleware/authUser.js
import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers;

    if (!token) {
      return res.json({ success: false, message: "Not Authorized. Login Again" });
    }

    const token_decode = jwt.verify(token, process.env.JWT_SECRET);

    // 🌟 FIX: Check if it's the Admin token first!
    if (token_decode.role === 'admin') {
      req.body.userId = "ADMIN_USER"; // Give it a mock string so it passes the check
      req.body.isAdmin = true;        // Flag it as an admin
      return next();
    }

    // Standard Customer path
    req.body.userId = token_decode.id; 
    next();

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default authUser;