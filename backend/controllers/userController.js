import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModels.js";
import jwt from "jsonwebtoken";

// Helper function to create JWT token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// ---------------- 1. USER LOGIN ----------------
const loginUser = async (req, res) => {
  try {
    const { mobileNum, password } = req.body;

    // 1. Check if the user trying to sign in on the storefront is the Admin
    if (mobileNum === process.env.ADMIN_MOBILENUM && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign({ mobileNum, role: 'admin' }, process.env.JWT_SECRET);
      return res.json({
        success: true,
        token,
        user: {
          fullname: "System Administrator",
          mobileNum: mobileNum,
          role: "admin" // 🔑 Tells Navbar_New to show the red button
        }
      });
    }

    // 2. Otherwise, check standard customers database entries
    const user = await userModel.findOne({ mobileNum });
    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ id: user._id, role: 'customer' }, process.env.JWT_SECRET);
      return res.json({
        success: true,
        token,
        user: {
          fullname: user.fullname,
          mobileNum: user.mobileNum,
          role: "customer" // 🔒 Standard buyer, button remains hidden
        }
      });
    } else {
      return res.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ---------------- 2. USER SIGNUP / REGISTER ----------------
const registerUser = async (req, res) => {
  try {
    const { fullname, mobileNum, password } = req.body;
    
    // Checking mobile number already exists or not
    const exists = await userModel.findOne({ mobileNum });
    if (exists) {
      return res.json({
        success: false,
        message: "The User already exists",
      });
    }

    // Validating mobile number format & strong password
    if (!validator.isMobilePhone(mobileNum, "en-IN")) {
      return res.json({
        success: false,
        message: "Please Enter Valid Mobile Number",
      });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please Enter minimum 8 characters",
      });
    }

    // Hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      fullname,
      mobileNum,
      password: hashedPassword,
      roll:'user'
    });

    const user = await newUser.save();
    const token = createToken(user._id);

    // ✅ FIX: Pass down the token properties directly so signups log in instantly
    res.json({
      success: true,
      message: "Account Created Successfully",
      token,
      user: {
        fullname: user.fullname,
        mobileNum: user.mobileNum
      }
    });
  } catch (error) {
    console.log("catch error - " + error);
    res.json({
      success: false,
      message: "Catch error - " + error.message,
    });
  }
};

// ---------------- 3. ADMIN LOGIN ----------------
const adminLogin = async (req, res) => {
  try {
    const { mobileNum, password } = req.body;

    if (
      mobileNum === process.env.ADMIN_MOBILENUM &&
      password === process.env.ADMIN_PASSWORD
    ) {
      // It is best practice to pass an object payload into jwt.sign
      const token = jwt.sign({ mobileNum, role: 'admin' }, process.env.JWT_SECRET);
      
      res.json({
        success: true,
        message: "Admin Logged in Successfully",
        token,
        user: {
          fullname: "System Administrator",
          mobileNum: mobileNum,
          role: "admin" // 🌟 Sending this tells frontend to reveal the button
        }
      });
    } else {
      res.json({
        success: false,
        message: "Invalid Credentials",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// ---------------- 4. GET USER DATA ----------------
// backend/controllers/userController.js -> getUserData
const getUserData = async (req, res) => {
  try {
    const userId = req.body.userId; 

    if (!userId) {
      return res.json({ success: false, message: "Authorization Failed. User ID missing." });
    }

    // 🌟 FIX: If the middleware flagged this as the Admin, return static admin details instantly
    if (userId === "ADMIN_USER" || req.body.isAdmin) {
      return res.json({
        success: true,
        user: {
          fullname: "System Administrator",
          mobileNum: process.env.ADMIN_MOBILENUM,
          role: "admin"
        }
      });
    }

    // Standard Customer database lookup
    const user = await userModel.findById(userId).select("-password");
    if (!user) {
      return res.json({ success: false, message: "User not found in database." });
    }

    res.json({ success: true, user });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export { loginUser, registerUser, adminLogin, getUserData };