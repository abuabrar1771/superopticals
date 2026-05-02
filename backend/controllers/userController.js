import validator from "validator";
import bcrypt, { genSalt } from "bcrypt";
import userModel from "../models/userModels.js";
import jwt from "jsonwebtoken";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};
// route for user login
const loginUser = async (req, res) => {
  try {
    const { mobileNum, password } = req.body;
    const user = await userModel.findOne({ mobileNum });

    if (!user) {
      res.json({
        success: false,
        message: "User doesn't exists",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = createToken(user._id);
      res.json({
        success: true,
        token,
      });
    } else {
      res.json({
        success: false,
        message: "Invalid Credential",
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

//route for user signup
const registerUser = async (req, res) => {
  try {
    const { fullname, mobileNum, password } = req.body;
    //checking mobilenumber already exisits or not
    const exists = await userModel.findOne({ mobileNum });

    if (exists) {
      return res.json({
        success: false,
        message: "The User already exists",
      });
    }

    // validating mobilenumber format & strong password
    if (!validator.isMobilePhone(mobileNum, "en-IN")) {
      return res.json({
        success: false,
        message: "Please Enter Valid Mobile Number",
      });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please Enter minimum 8 charactor ",
      });
    }
    // Hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      fullname,
      mobileNum,
      password: hashedPassword,
    });

    const user = await newUser.save();

    const token = createToken(user._id);

    res.json({
      success: true,
      message: `Token Genrated ${token}`,
    });
  } catch (error) {
    console.log("catch error - " + error);
    res.json({
      success: false,
      message: "Catch error - " + error.message,
    });
  }
};
//route for admin login
const adminLogin = async (req, res) => {
  try {
    const { mobileNum, password } = req.body;

    if (
      mobileNum === process.env.ADMIN_MOBILENUM &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(mobileNum+password , process.env.JWT_SECRET);
      
      res.json({
        success: true,
        message: "Admin Loggedin Successfully",
        token
      });
    } else {
        console.log("user mobile number"+mobileNum)
      res.json({
        success: false,
        message: "Invalid Credential",
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

export { loginUser, registerUser, adminLogin };
