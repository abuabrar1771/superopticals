import React, { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const PlaceOrder = () => {
  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    getCartAmount,
    delivery_fee,
    clearCart,
    currency,
  } = useContext(ShopContext);
  const [method, setMethod] = useState("cod"); // state management for tracking payment card selection
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!token) {
      toast.error("Please login to place an order");
      navigate("/Login");
      return;
    }

    try {
      // Build formatting array to match backend expectations
      const orderItems = [];
      for (const itemsId in cartItems) {
        for (const size in cartItems[itemsId]) {
          if (cartItems[itemsId][size] > 0) {
            orderItems.push({
              _id: itemsId,
              size: size,
              quantity: cartItems[itemsId][size],
            });
          }
        }
      }

      const orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      };

      // ─── COD BRANCH ───────────────────────────────────────────────
      if (method === "cod") {
        const response = await axios.post(
          `${backendUrl}/api/order/place`,
          orderData,
          { headers: { token } },
        );
        if (response.data.success) {
          toast.success("Order Placed Successfully via COD!");
          if (clearCart) clearCart();
          navigate("/Orders");
        } else {
          toast.error(response.data.message);
        }
      }

      // ─── ONLINE RAZORPAY BRANCH ───────────────────────────────────
      else if (method === "online") {
        // Step 1: Create transaction instance order ID on backend
        const response = await axios.post(
          `${backendUrl}/api/order/razorpay`,
          { amount: orderData.amount },
          { headers: { token } },
        );

        if (response.data.success) {
          const razorpayOrder = response.data.order;

          // Step 2: Establish configuration object options (IMAGE FIELD REMOVED)
          const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            name: "Super Opticals",
            description: "Payment for placed cart order",
            order_id: razorpayOrder.id,
            // ❌ No 'image' property here to eliminate local network asset crashes

            handler: async function (paymentResponse) {
              try {
                // Step 3: Forward signatures to verification logic endpoint
                const verifyResponse = await axios.post(
                  `${backendUrl}/api/order/verifyRazorpay`,
                  {
                    razorpay_order_id: paymentResponse.razorpay_order_id,
                    razorpay_payment_id: paymentResponse.razorpay_payment_id,
                    razorpay_signature: paymentResponse.razorpay_signature,
                    orderData: orderData, // Pass down payload properties to populate MongoDB
                  },
                  { headers: { token } },
                );

                if (verifyResponse.data.success) {
                  toast.success("Payment verified! Order completed.");
                  if (clearCart) clearCart();
                  navigate("/Orders");
                } else {
                  toast.error(
                    verifyResponse.data.message || "Verification Failed",
                  );
                }
              } catch (err) {
                console.error("Verification error context:", err);
                toast.error(
                  "Unable to verify payment signature with backend server.",
                );
              }
            },
            prefill: {
              name: `${formData.firstName} ${formData.lastName}`,
              email: formData.email,
              contact: formData.phone,
            },
            theme: { color: "#3399cc" },
          };

          // Step 4: Construct window instance and call view mount methods
          const rzp = new window.Razorpay(options);
          rzp.open();
        } else {
          toast.error(response.data.message || "Failed to initialize payment.");
        }
      }
    } catch (error) {
      console.error("Order process crash log:", error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col sm:flex-row justify-between gap-10 pt-5 sm:pt-14 min-h-[80vh] border-t"
    >
      {/* ------------- LEFT SIDE: DELIVERY DETAILS ------------- */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>
        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            name="firstName"
            value={formData.firstName}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="First name"
          />
          <input
            required
            onChange={onChangeHandler}
            name="lastName"
            value={formData.lastName}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="Last name"
          />
        </div>
        <input
          required
          onChange={onChangeHandler}
          name="email"
          value={formData.email}
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="email"
          placeholder="Email address"
        />
        <input
          required
          onChange={onChangeHandler}
          name="street"
          value={formData.street}
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="text"
          placeholder="Street"
        />
        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            name="city"
            value={formData.city}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="City"
          />
          <input
            required
            onChange={onChangeHandler}
            name="state"
            value={formData.state}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="State"
          />
        </div>
        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            name="zipcode"
            value={formData.zipcode}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="number"
            placeholder="Zipcode"
          />
          <input
            required
            onChange={onChangeHandler}
            name="country"
            value={formData.country}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="Country"
          />
        </div>
        <input
          required
          onChange={onChangeHandler}
          name="phone"
          value={formData.phone}
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          type="number"
          placeholder="Phone"
        />
      </div>

      {/* ------------- RIGHT SIDE: PAYMENT & TOTAL ------------- */}
      <div className="flex-1 max-w-[500px]">
        <div className="min-w-full">
          <div className="text-xl sm:text-2xl my-3">
            <Title text1={"CART"} text2={"TOTALS"} />
          </div>
          <div className="flex flex-col gap-2 mt-2 text-sm">
            <div className="flex justify-between font-bold text-xl border-b pb-2">
              <p>Total Amount</p>
              <p>
                {currency}
                {getCartAmount() + delivery_fee}.00
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <div className="text-xl sm:text-2xl my-3">
            <Title text1={"PAYMENT"} text2={"METHOD"} />
          </div>

          <div className="flex gap-3 flex-col lg:flex-row">
            {/* UPDATED: Online Payments Option Card */}
            <div
              onClick={() => setMethod("online")}
              className={`flex items-center gap-3 border p-3 px-4 cursor-pointer rounded-lg w-full transition-all ${method === "online" ? "border-green-500 bg-green-50/30" : "border-gray-200"}`}
            >
              <div
                className={`w-4 h-4 border rounded-full flex items-center justify-center ${method === "online" ? "border-green-500" : "border-gray-400"}`}
              >
                {method === "online" && (
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                )}
              </div>
              <div>
                <p className="text-gray-900 text-sm font-semibold uppercase">
                  UPI / Cards
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Google Pay, PhonePe, Cards, Netbanking
                </p>
              </div>
            </div>

            {/* Cash on Delivery Card */}
            <div
              onClick={() => setMethod("cod")}
              className={`flex items-center gap-3 border p-3 px-4 cursor-pointer rounded-lg w-full transition-all ${method === "cod" ? "border-green-500 bg-green-50/30" : "border-gray-200"}`}
            >
              <div
                className={`w-4 h-4 border rounded-full flex items-center justify-center ${method === "cod" ? "border-green-500" : "border-gray-400"}`}
              >
                {method === "cod" && (
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                )}
              </div>
              <div>
                <p className="text-gray-900 text-sm font-semibold uppercase">
                  Cash On Delivery
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Pay with cash when order arrives
                </p>
              </div>
            </div>
          </div>

          <div className="w-full text-end mt-8">
            <button
              type="submit"
              className="bg-black text-white px-16 py-3.5 text-sm font-bold uppercase tracking-wider hover:bg-slate-800 active:scale-95 transition-all w-full sm:w-auto rounded shadow-sm"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
