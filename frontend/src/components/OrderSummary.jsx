import React from "react";

const OrderSummary = ({
  cartData = [],
  currency,
  getCartAmount,
  navigate,
  buttonText,
  hideBtn,
  products = [],
}) => {
  const delivery_fee = 10;

  return (
    <div className="w-full flex flex-col lg:flex-row gap-10 p-5">
      {/* LEFT SIDE - ITEMS */}
      <div className="flex-1">
        <h2 className="text-2xl font-medium mb-5">Your Items</h2>

        <div className="flex flex-col gap-4">
          {Array.isArray(cartData) && cartData.length > 0 ? (
            cartData.map((item, index) => {
              const product = products.find((p) => p._id === item._id);

              if (!product) return null;

              return (
                <div
                  key={index}
                  className="py-4 border-b flex items-center gap-4"
                >
                  {/* IMAGE */}
                  <img
                    src={product.images?.[0]}
                    alt={product.name}
                    className="w-16 sm:w-20 h-20 object-cover rounded"
                  />

                  {/* PRODUCT INFO */}
                  <div className="flex-1">
                    <p className="text-sm sm:text-lg font-medium">
                      {product.name}
                    </p>

                    <div className="flex items-center gap-5 mt-2">
                      <p>
                        {currency}
                        {item.price}
                      </p>

                      <p className="px-2 border bg-gray-50">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-400 italic">No items found in your cart.</p>
          )}
        </div>
      </div>

      {/* RIGHT SIDE - SUMMARY */}
      <div className="lg:w-[350px] w-full">
        <div className="bg-white p-6 rounded-lg border shadow-sm sticky top-5">
          <h2 className="text-xl font-bold mb-4">Summary</h2>

          <div className="space-y-3 border-b pb-3">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>
                {currency}
                {typeof getCartAmount === "function" ? getCartAmount() : 0}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>
                {currency}
                {delivery_fee}
              </span>
            </div>
          </div>

          <div className="flex justify-between text-xl font-bold mt-4">
            <span>Total</span>
            <span>
              {currency}
              {(typeof getCartAmount === "function" ? getCartAmount() : 0) > 0
                ? getCartAmount() + delivery_fee
                : 0}
            </span>
          </div>

          {!hideBtn && (
            <button
              onClick={() => navigate("/PlaceOrder")}
              className="w-full bg-black text-white py-3 mt-6 hover:opacity-90 transition uppercase text-sm tracking-widest"
            >
              {buttonText || "Checkout"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
