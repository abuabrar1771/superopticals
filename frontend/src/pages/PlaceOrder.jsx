import React, { useContext, useState } from "react";
import Title from "../components/Title";
import OrderSummary from "../components/OrderSummary";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom"; 
import { assets } from "../assets/assets";

const PlaceOrder = () => {
  // IMPORTANT: Hooks first
  const navigate = useNavigate();

  // Extract from Context
  const { currency, getCartAmount, cartItems, placeOrder } = useContext(ShopContext);
  
  const [method, setMethod] = useState('cod');

  const processOrder = () => {
    console.log("Button clicked...");
    
    try {
      if (cartItems && cartItems.length > 0) {
        // 1. Process order
        placeOrder(method); 
        console.log("Success: Order placed logic finished.");
        
        // 2. Navigate
        // If your route is /Orders (Capital O), this MUST match
        navigate('/Orders'); 
      } else {
        // If cart is already empty, just go to Orders to check history
        navigate('/Orders');
      }
    } catch (error) {
      console.error("CRITICAL ERROR during navigation:", error);
      // Fallback: If React Router fails, use standard browser navigation
      window.location.assign('/Orders');
    }
  };

 
  
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-10 pt-14 border-t max-w-7xl mx-auto px-4 sm:px-[5%] items-start">
      {/* ---------- LEFT SIDE: DELIVERY INFORMATION ---------- */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        {/* Title placed inside the left column */}
        <div className="text-xl sm:text-2xl mb-6">
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>

        <div className="flex gap-3">
          <input
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="First Name"
          />
          <input
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="Last Name"
          />
        </div>
        <input
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="email"
          placeholder="Email address"
        />
        <input
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="text"
          placeholder="Street"
        />
        <div className="flex gap-3">
          <input
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="City"
          />
          <input
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="State"
          />
        </div>
        <div className="flex gap-3">
          <input
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="number"
            placeholder="Zipcode"
          />
          <input
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="Country"
          />
        </div>
        <input
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="number"
          placeholder="Phone"
        />
      </div>

      {/* ---------- RIGHT SIDE: ORDER SUMMARY ---------- */}
      <div className="w-full sm:max-w-[520px]">
        {/* Title placed inside the right column to align with the left side */}
        <div className="text-xl sm:text-2xl mb-6">
          <Title text1={"ORDER"} text2={"SUMMARY"} />
        </div>

        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
          <OrderSummary
            currency={currency}
            getCartAmount={getCartAmount}
            navigate={processOrder}
            buttonText="PLACE ORDER"
          />
        </div>
        <div className="mt-8">
          <Title text1={"PAYMENT"} text2={"METHOD"} />
          {/* >>>>>>>>>>>>>>>>>>Payment method setting <<<<<<<<<<<<<<<<<<<<< */}
          <div className="flex flex-col gap-2 lg:flex-row ">
            <div
              onClick={() => setMethod("stripe")}
              className="flex items-center gap-2 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-[14px] h-[14px] border rounded-full ${method === "stripe" ? "bg-green-400" : ""}`}
              ></p>
              <img className="h-5 mx-4" src={assets.stripe_logo} alt="Stripe" />
            </div>
            <div
              onClick={() => setMethod("razorpay")}
              className="flex items-center gap-2 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-[14px] h-[14px] border rounded-full ${method === "razorpay" ? "bg-green-400" : ""}`}
              ></p>
              <img
                className="h-5 mx-2"
                src={assets.razorpay_logo}
                alt="Razorpay"
              />
            </div>
            <div
              onClick={() => setMethod("cod")}
              className="flex items-center gap-2 border p-2 px-3 cursor-pointer"
            >
              <p
                className={`min-w-[14px] h-[14px] border rounded-full ${method === "cod" ? "bg-green-400" : ""}`}
              ></p>
              <p className="text-gray-500 text-sm font-medium uppercase">
                Cash on Delivery
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PlaceOrder;
