import userModel from "../models/userModels.js";
import orderModel from "../models/OrderModel.js";
import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize with your keys (Keep Secret Key in your backend .env!)
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 1. Place Order via COD
const placeOrder = async (req, res) => {
  try {
    const userId = req.body.userId || req.userId; 
    const { address, items, amount } = req.body; 

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized access. User identity missing." });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User account not found." });
    }

    const finalItems = items && items.length > 0 ? items : user.cartData;

    if (!finalItems || finalItems.length === 0) {
      return res.status(400).json({ success: false, message: "Cannot place order: Cart data is empty." });
    }

    const order = new orderModel({
      userId,
      items: finalItems, 
      amount: amount, 
      address,
      paymentMethod: req.body.paymentMethod || "cod",
      payment: req.body.paymentMethod === "cod" ? false : true,
      status: "Processing", // Good practice to explicitly set default status
      date: Date.now()
    });

    await order.save();

    // Wipe out data from DB user profile cart
    await userModel.findByIdAndUpdate(userId, { cartData: {} }); // Adjusted to {} if your schema uses an object layout

    return res.status(200).json({ 
      success: true, 
      message: "Order processed successfully!", 
      order 
    });

  } catch (error) {
    console.error("Order System Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Get User Orders for Customer Profile Tracker
const getUserOrders = async (req, res) => {
    try {
        const userId = req.body.userId || req.userId; 

        console.log("Fetching orders for User ID:", userId);

        const orders = await orderModel.find({ userId });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error("Error in getUserOrders:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. List All Orders for Admin Panel
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({}).sort({ createdAt: -1 });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error("Error in listOrders controller:", error);
        res.status(500).json({ success: false, message: "Failed to retrieve orders", error: error.message });
    }
};

// 4. Update Order Status from Admin Dropdown Selection Menu
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        await orderModel.findByIdAndUpdate(orderId, { status });
        res.status(200).json({ success: true, message: `Order status successfully updated to "${status}"` });
    } catch (error) {
        console.error("Error in updateStatus controller:", error);
        res.status(500).json({ success: false, message: "Failed to update order status", error: error.message });
    }
};

// 5. Create Order for Razorpay Checkout
const placeOrderRazorpay = async (req, res) => {
  try {
    const { amount } = req.body; 

    const options = {
      amount: Math.round(amount * 100), // Math.round avoids subtle floating-point issues with decimals
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);
    res.json({ success: true, order });
  } catch (error) {
    console.error("Razorpay Order Creation Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 6. Verify Online Payment Signature and Formally Save Transaction
const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } = req.body;
    
    // Safely extract identity from your authentication middleware token check
    const userId = req.body.userId || req.userId;

    if (!userId) {
       return res.status(401).json({ success: false, message: "User identity missing." });
    }

    // 1. Verify Razorpay Signature legitimacy
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      
      // 2. Signature matches! Create your database order entry
      const newOrder = new orderModel({
        userId: userId, 
        items: orderData.items,
        address: orderData.address,
        amount: orderData.amount, 
        
        // ─── SAVING THE VALUE TO YOUR NEW SCHEMA FIELD ───
        paidAmount: orderData.amount, 
        
        paymentMethod: "Online (UPI / Cards)",
        payment: true, // Mark the order as paid!
        status: "Processing",
        date: Date.now()
      });

      // 3. Save the document instance to MongoDB
      await newOrder.save();

      // 4. Clear user shopping cart collection upon successful checkout validation
      await userModel.findByIdAndUpdate(userId, { cartData: [] });

      res.json({ success: true, message: "Payment verified and order placed successfully!" });
    } else {
      res.status(400).json({ success: false, message: "Payment verification failed. Security mismatch." });
    }
  } catch (error) {
    console.error("Razorpay Verification Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { placeOrder, getUserOrders, listOrders, updateStatus, placeOrderRazorpay, verifyRazorpay };