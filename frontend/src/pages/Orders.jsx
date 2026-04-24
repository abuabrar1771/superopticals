import React, { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import Login from "./Login"; // Import your Login component

const Orders = () => {
  const { orders, currency } = useContext(ShopContext);

  return (
    <div className="border-t pt-16 px-4 max-w-7xl mx-auto">
      {/* MAIN FLEX CONTAINER */}
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* LEFT SIDE: ORDERS LIST (Takes up more space) */}
        <div className="flex-1 w-full">
          <div className="text-2xl mb-8">
            <Title text1={"MY"} text2={"ORDERS"} />
          </div>

          <div className="flex flex-col gap-4">
            {orders.length === 0 ? (
              <p className="text-gray-500 italic">No order history found.</p>
            ) : (
              orders.map((item, index) => (
                <div
                  key={index}
                  className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div className="flex items-start gap-6 text-sm">
                    <img className="w-16 sm:w-20" src={item.image} alt="" />
                    <div>
                      <p className="sm:text-base font-medium">{item.name}</p>
                      <div className="flex items-center gap-3 mt-2 text-base text-gray-700">
                        <p className="text-blue-600 font-bold">
                          {item.orderId}
                        </p>
                        <p>Qty: {item.quantity}</p>
                      </div>
                      <p className="mt-1 text-xs text-gray-400">{item.date}</p>
                    </div>
                  </div>
                  <div className="md:w-1/2 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                      <p className="text-sm">Order Placed</p>
                    </div>
                    <button className="border px-4 py-2 text-sm font-medium rounded-sm">
                      Track Order
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT SIDE: LOGIN / SIGNUP FORM (Sticky so it stays visible) */}
        <div className="w-full lg:w-[400px] sticky top-2 bg-cyan-200 p-4 rounded-xl border border-cyan-900">
          {/* If user is logged in, you could show "Profile Summary" here instead */}
          <Login />
        </div>
      </div>
      
    </div>
  );
};

export default Orders;
