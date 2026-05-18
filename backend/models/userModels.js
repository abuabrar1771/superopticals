import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true },
    mobileNum: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // ✅ FIXED CART STRUCTURE
    // cartData: [
    //   {
    //     itemId: String,
    //     name: String,
    //     image: String,
    //     lens: Object,
    //     features: Array,
    //     prescription: Object,
    //     totalAmount: Number,
    //     quantity: Number,
    //   },
    // ],
  },
  {
    minimize: false,
    timestamps: true,
  },
);

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
