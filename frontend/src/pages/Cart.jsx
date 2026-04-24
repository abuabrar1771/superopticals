import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import OrderSummary from "../components/OrderSummary";

const Cart = () => {
  const { currency, cartItems, updateQuantity, getCartAmount } =
    useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setCartData(cartItems);
  }, [cartItems]);

  return (
    <div className="border-t pt-14 px-4 max-w-7xl mx-auto">
      {cartData.length === 0 ? (
        <div className="py-10 text-center">
          <div className="text-3xl mb-10">
            <Title text1={"YOUR"} text2={"CART"} />
          </div>
          <p className="text-gray-400 text-lg">Your shopping bag is empty.</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 bg-black text-white px-8 py-2 rounded-md uppercase text-sm"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        /* MAIN FLEX CONTAINER */
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* LEFT SIDE WRAPPER */}
          <div className="flex-1 w-full">
            {/* Title for Left Side */}
            <div className="text-3xl mb-10">
              <Title text1={"YOUR"} text2={"CART"} />
            </div>

            {/* --- This container and everything below it moves left --- */}
            <div className="sm:ml-[-20px]">
              {/* Table Header */}
              <div className="hidden sm:grid grid-cols-[4fr_1fr_1fr_0.5fr] items-start py-3 px-2 border-b text-sm font-bold uppercase text-gray-500 tracking-wider">
                <p>Product Details</p>
                <p className="text-center">Price</p>
                <p className="text-center">Total</p>
                <p className="text-right">Action</p>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-100">
                {cartData.map((item, index) => (
                  <div
                    key={index}
                    className="py-6 grid grid-cols-[3fr_1fr_1fr] sm:grid-cols-[4fr_1fr_1fr_0.5fr] items-center gap-4 hover:bg-gray-50 transition-colors px-2"
                  >
                    {/* ... 1. PRODUCT INFO ... */}
                    <div className="flex items-center gap-4 sm:gap-6">
                      <div className="w-20 sm:w-24 bg-white border border-gray-100 p-2 rounded-lg flex-shrink-0">
                        <img
                          className="w-full h-full object-contain"
                          src={item.image}
                          alt={item.name}
                        />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm sm:text-base font-bold text-gray-900 truncate">
                          {item.name}
                        </p>
                        <p className="sm:hidden text-xs text-gray-500 mt-1">
                          {currency}
                          {item.unitPrice ||
                            item.totalAmount / item.quantity}{" "}
                          per unit
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2 items-center">
                          <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                            <input
                              onChange={(e) =>
                                e.target.value === "" || e.target.value === "0"
                                  ? null
                                  : updateQuantity(
                                      item.tempId || item._id,
                                      Number(e.target.value),
                                    )
                              }
                              className="w-12 sm:w-16 px-1 sm:px-2 py-1 text-center text-sm outline-none bg-white"
                              type="number"
                              min={1}
                              defaultValue={item.quantity}
                            />
                          </div>
                          {item.lens && (
                            <span className="text-[10px] bg-blue-50 px-2 py-0.5 rounded text-blue-600 font-medium">
                              {item.lens.name || item.lens}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 2. UNIT PRICE */}
                    <div className="hidden sm:block text-center">
                      <p className="text-gray-900 font-medium">
                        {currency}
                        {item.unitPrice ||
                          Number(item.totalAmount) / Number(item.quantity)}
                      </p>
                    </div>

                    {/* 3. TOTAL AMOUNT */}
                    <div className="text-center">
                      <p className="font-bold text-base sm:text-lg text-black">
                        {currency}
                        {item.totalAmount}
                      </p>
                    </div>

                    {/* 4. ACTION */}
                    <div className="text-right">
                      <button
                        onClick={() =>
                          updateQuantity(item.tempId || item._id, 0)
                        }
                        className="p-2 hover:bg-red-50 rounded-full transition-colors group"
                      >
                        <div className="relative h-5 w-5 ml-auto">
                          <img
                            src={assets.bin_icon}
                            className="h-5 w-5 block group-hover:hidden"
                            alt="delete"
                          />
                          <div className="hidden group-hover:block">
                            <Trash2 className="h-5 w-5 text-red-500" />
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: SUMMARY & CHECKOUT */}
          <div className="lg:w-[520px] w-full sticky top-10">
            {/* Title for Right Side - Now Aligned with Left Side */}
            <div className="text-3xl mb-10">
              <Title text1={"ORDER"} text2={"SUMMARY"} />
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <OrderSummary
                currency={currency}
                getCartAmount={getCartAmount}
                navigate={navigate}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
