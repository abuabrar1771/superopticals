import express from "express";
import {
  addToCart,
  updateCart,
  getUserCart,
  removeFromCart,
} from "../controllers/cartController.js";
import authUser from "../middleware/Auth.js";

const cartRouter = express.Router();

cartRouter.post("/add", authUser, addToCart);
cartRouter.post("/update", authUser, updateCart);

cartRouter.post("/get", authUser, getUserCart);

cartRouter.post("/remove", authUser, removeFromCart);

export default cartRouter;
