import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";

const Orders = () => {
  const {
    products = [],
    currency,
    backendUrl,
    token,
  } = useContext(ShopContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedTrackingId, setExpandedTrackingId] = useState(null);

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!token) {
          setLoading(false);
          return;
        }

        const response = await axios.post(
          `${backendUrl}/api/order/myorders`,
          {},
          { headers: { token } },
        );

        if (response.data.success) {
          const sortedOrders = response.data.orders.reverse();
          setOrders(sortedOrders);
        } else {
          setError(response.data.message || "Failed to load orders.");
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("An error occurred while loading your orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, [token, backendUrl]);

  // 1. Dynamic Status Calculator based on 24h / 48h rules
  const getDynamicStatus = (orderDate, currentBackendStatus) => {
    if (currentBackendStatus?.toLowerCase().includes("delivered")) {
      return "Delivered";
    }

    const placedTime = new Date(orderDate).getTime();
    const currentTime = new Date().getTime();
    const hoursPassed = (currentTime - placedTime) / (1000 * 60 * 60);

    if (hoursPassed >= 72) {
      return "Out for Delivery";
    } else if (hoursPassed >= 24) {
      return "Shipped";
    }

    return currentBackendStatus || "Order Placed";
  };

  // Helper function to map statuses to step index numbers (0 to 3)
  const getTrackingStepIndex = (statusText) => {
    const normalStatus = statusText?.toLowerCase() || "";
    if (normalStatus.includes("delivered")) return 3;
    if (normalStatus.includes("delivery") || normalStatus.includes("out"))
      return 2;
    if (normalStatus.includes("ship")) return 1;
    return 0;
  };

  const toggleTracking = (orderId) => {
    setExpandedTrackingId(expandedTrackingId === orderId ? null : orderId);
  };

  if (loading || !products?.length) {
    return (
      <div className="p-10 text-center text-gray-600">
        Loading your orders...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center text-red-500 font-medium">{error}</div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-10 text-center text-gray-500">
        You have no placed orders yet.
      </div>
    );
  }

  return (
    <div className="border-t pt-16 max-w-5xl mx-auto px-4 sm:px-6 mb-20">
      <h2 className="text-2xl font-medium tracking-wide mb-8">MY ORDERS</h2>

      <div className="flex flex-col gap-6">
        {orders.map((order, index) => {
          // Calculate the real-time dynamic status for this specific order
          const calculatedStatus = getDynamicStatus(order.date, order.status);
          const currentStep = getTrackingStepIndex(calculatedStatus);
          const isTrackingOpen = expandedTrackingId === order._id;

          return (
            <div
              key={order._id || index}
              className="border border-gray-200 rounded-lg shadow-sm bg-white overflow-hidden"
            >
              {/* Header section: Uses the calculated status text */}
              <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 sm:px-6 flex flex-wrap justify-between items-center gap-2 text-xs sm:text-sm text-gray-600">
                <div className="flex flex-col sm:flex-row sm:gap-6">
                  <p>
                    Order ID:{" "}
                    <span className="font-semibold text-gray-800">
                      {order._id}
                    </span>
                  </p>
                  <p>
                    Date:{" "}
                    <span className="font-medium text-gray-800">
                      {new Date(order.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${currentStep === 3 ? "bg-blue-500" : "bg-green-500"}`}
                  ></span>
                  <p>
                    Status:{" "}
                    <span className="text-green-600 font-semibold">
                      {calculatedStatus}
                    </span>
                  </p>
                </div>
              </div>

              {/* Body section: Products list map container */}
              <div className="px-4 py-2 sm:px-6 divide-y divide-gray-100">
                {order.items?.map((item, itemIndex) => {
                  const targetId = item._id || item.id || item.productId;
                  const matchedProduct = products.find(
                    (p) => p._id === targetId || p.id === targetId,
                  );

                  const productName =
                    matchedProduct?.name ||
                    item.name ||
                    "Stylish Optical Glasses";
                  const productImage =
                    matchedProduct?.image?.[0] ||
                    item.image ||
                    "https://via.placeholder.com/150";

                  let productPrice = matchedProduct?.price || item.price;
                  if (!productPrice || productPrice === 0) {
                    productPrice =
                      order.items.length === 1
                        ? order.amount
                        : order.amount / item.quantity;
                  }

                  return (
                    <div
                      key={itemIndex}
                      className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={productImage}
                          alt={productName}
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded border border-gray-100 bg-gray-50 flex-shrink-0"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/150";
                          }}
                        />
                        <div>
                          <p className="font-medium text-gray-900 text-sm sm:text-base mb-1">
                            {productName}
                          </p>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-gray-500">
                            <p>
                              Rate:{" "}
                              <span className="text-gray-700 font-medium">
                                {currency}
                                {productPrice}
                              </span>
                            </p>
                            <p>
                              Qty:{" "}
                              <span className="text-gray-700 font-medium">
                                {item.quantity}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex sm:flex-col justify-between sm:justify-center items-center sm:items-end border-t sm:border-0 pt-2 sm:pt-0 border-gray-100">
                        <span className="text-xs text-gray-400 sm:hidden">
                          Subtotal:
                        </span>
                        <p className="font-medium text-gray-800 text-sm sm:text-base">
                          {currency}
                          {productPrice * item.quantity}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Dynamic Tracker Progress Timeline component */}
              {isTrackingOpen && (
                <div className="bg-gray-50/70 border-t border-gray-100 px-4 py-8 sm:px-12 transition-all duration-300">
                  <div className="relative flex items-center justify-between w-full max-w-3xl mx-auto">
                    {/* Background line bar */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 z-0">
                      <div
                        className="h-full bg-green-500 transition-all duration-500"
                        style={{ width: `${(currentStep / 3) * 100}%` }}
                      ></div>
                    </div>

                    {/* Step 1 */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm transition-colors ${currentStep >= 0 ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"}`}
                      >
                        ✓
                      </div>
                      <span className="text-xs font-medium text-gray-700 mt-2 text-center">
                        Order Placed
                      </span>
                    </div>

                    {/* Step 2 */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm transition-colors ${currentStep >= 1 ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"}`}
                      >
                        {currentStep >= 1 ? "✓" : "2"}
                      </div>
                      <span className="text-xs font-medium text-gray-700 mt-2 text-center">
                        Shipped
                      </span>
                    </div>

                    {/* Step 3 */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm transition-colors ${currentStep >= 2 ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"}`}
                      >
                        {currentStep >= 2 ? "✓" : "3"}
                      </div>
                      <span className="text-xs font-medium text-gray-700 mt-2 text-center">
                        Out for Delivery
                      </span>
                    </div>

                    {/* Step 4 */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm transition-colors ${currentStep >= 3 ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"}`}
                      >
                        {currentStep >= 3 ? "✓" : "4"}
                      </div>
                      <span className="text-xs font-medium text-gray-700 mt-2 text-center">
                        Delivered
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Card Footer layout */}
              <div className="bg-gray-50/50 border-t border-gray-100 px-4 py-3 sm:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-sm">
                <div className="flex flex-col gap-1">
                  <p className="text-gray-500">
                    Payment Method:{" "}
                    <span className="font-medium text-gray-700 uppercase">
                      {order.paymentMethod ||
                        (order.payment ? "Online Payment" : "Cash On Delivery")}
                    </span>
                  </p>
                  <p className="text-gray-700 font-medium">
                    Total Amount Paid:{" "}
                    <span className="text-base sm:text-lg font-bold text-gray-900 ml-1">
                      {currency}
                      {order.amount}
                    </span>
                  </p>
                </div>

                <button
                  onClick={() => toggleTracking(order._id)}
                  className="w-full sm:w-auto px-5 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-900 hover:text-white transition-all text-xs font-medium tracking-wide shadow-sm"
                >
                  {isTrackingOpen ? "Hide Tracking" : "Track Order"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
