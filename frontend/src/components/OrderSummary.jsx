import React from "react";
import Title from "./Title"; // Adjust the import path based on your folder structure

const OrderSummary = ({ currency, getCartAmount, navigate, buttonText }) => {
  const delivery_fee = 10; // Defined here for consistency

  return (
    <div className="lg:w-[520px] w-full">
      <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 sticky top-10">
        <div className="flex flex-col gap-3 border-b pb-3">
          <div className="flex justify-between text-gray-600">
            <p>Subtotal</p>
            <p>
              {currency} {getCartAmount()}.00
            </p>
          </div>
          <div className="flex justify-between text-gray-600">
            <p>Shipping Fee</p>
            <p>
              {currency} {delivery_fee}.00
            </p>
          </div>
        </div>

        <div className="flex justify-between text-xl font-bold mt-4">
          <p>Total</p>
          <p>
            {currency}{" "}
            {getCartAmount() === 0 ? 0 : getCartAmount() + delivery_fee}.00
          </p>
        </div>

        <button
        onClick={() => navigate('/PlaceOrder')} // Or your logic for placing the order
        className="bg-black text-white text-sm my-8 px-8 py-3 uppercase w-full"
      >
        {buttonText || "PROCEED TO CHECKOUT"}
      </button>

        <p className="text-center text-xs text-gray-400 italic">
          Shipping and taxes calculated at checkout
        </p>
      </div>
    </div>
  );
};

export default OrderSummary;
