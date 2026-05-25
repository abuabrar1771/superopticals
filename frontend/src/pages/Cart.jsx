import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Added for seamless UI toast notifications

const Cart = () => {
  // 🌟 Added 'token' extraction out of context to check user login status natively
  const { cartItems, currency, getCartAmount, delivery_fee, updateCartQuantity, setCartItems, token } = useContext(ShopContext);
  const navigate = useNavigate();

  const removeItem = (index) => {
    const updated = cartItems.filter((_, i) => i !== index);
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // 🛡️ Secure Gatekeeper Handler for the Checkout Trigger
  const handleCheckoutClick = () => {
    // Check if the cart is completely empty first
    if (cartItems.length === 0) {
      toast.error("Your cart is empty. Please add items before checking out.");
      return;
    }

    if (!token) {
      // 🚀 Redirect Strategy: Send unknown guests to login, appending a tracking redirect parameter
      toast.info("Please sign in or create an account to secure your order details.");
      navigate('/login?redirect=checkout');
    } else {
      // 🛒 Logged-in Customer: Route them directly to your standard checkout screen path
      navigate('/PlaceOrder');
    }
  };

  return (
    <div className="pt-14 px-4 sm:px-[5vw] md:px-[7vw]">
      <h2 className="text-2xl font-bold mb-10 uppercase tracking-tight">Your Shopping Cart</h2>

      {/* MAIN CONTAINER: Flex/Grid for Side-by-Side */}
      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* LEFT SIDE: CART ITEMS (66% Width) */}
        <div className="flex-1 lg:w-2/3 space-y-6">
          {cartItems.length === 0 ? (
            <div className="p-10 border-2 border-dashed rounded-xl text-center text-gray-400">
              Your cart is empty
            </div>
          ) : (
            cartItems.map((item, index) => (
              <div key={index} className="flex gap-4 p-4 bg-white border rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <img src={item.image} className="w-24 h-24 object-cover rounded-lg border" alt="" />
                
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900">{item.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{item.lens?.name || "Standard Lens"}</p>
                  </div>

                  {/* Quantity Controller & Price */}
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center border rounded-lg overflow-hidden">
                      <button 
                        onClick={() => updateCartQuantity(index, item.quantity - 1)}
                        className="px-3 py-1 bg-gray-50 hover:bg-gray-200 border-r"
                      > – </button>
                      <span className="px-4 font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => updateCartQuantity(index, item.quantity + 1)}
                        className="px-3 py-1 bg-gray-50 hover:bg-gray-200 border-l"
                      > + </button>
                    </div>
                    <p className="font-bold text-lg">{currency}{item.totalAmount}</p>
                  </div>
                </div>

                <button onClick={() => removeItem(index)} className="text-gray-300 hover:text-red-500 self-start">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                   </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* RIGHT SIDE: ORDER SUMMARY (33% Width) */}
        <div className="lg:w-1/3">
          <div className="bg-gray-50 p-6 rounded-2xl border sticky top-10">
            <h3 className="text-xl font-bold mb-6 border-b pb-4">Order Summary</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{currency}{getCartAmount()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping Fee</span>
                <span>{currency}{delivery_fee}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (GST)</span>
                <span>Calculated at checkout</span>
              </div>
              
              <hr className="my-4" />
              
              <div className="flex justify-between text-xl font-black">
                <span>Total</span>
                <span className="text-blue-600">{currency}{getCartAmount() + delivery_fee}</span>
              </div>

              {/* 🔄 CHANGED: Replaced native anonymous arrow navigation with our secure handler function */}
              <button 
                onClick={handleCheckoutClick}
                className="w-full bg-black text-white py-4 rounded-xl font-bold mt-6 hover:bg-gray-800 transition-all shadow-lg active:scale-95"
              >
                Checkout Now
              </button>

              <p className="text-[10px] text-center text-gray-400 mt-4 px-4 uppercase tracking-widest">
                Safe & Secure Payments Only
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Cart;