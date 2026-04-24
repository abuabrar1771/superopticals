import { createContext, useContext, useState } from "react";
import { products } from "../assets/assets";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "₹";
  const delivery_fee = 10;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const [orders, setOrders] = useState([]);

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const addToCart = (cartData) => {
    // Calculate the price for 1 single unit at the time of adding
    const unitPrice =
      Number(cartData.totalAmount) / (Number(cartData.quantity) || 1);

    const cartEntry = {
      tempId: Date.now(),
      _id: cartData._id,
      name: cartData.name,
      image: cartData.image,
      lens: cartData.lens,
      features: cartData.features,
      prescription: cartData.prescription,
      unitPrice: unitPrice, // Store the price for one unit
      totalAmount: Number(cartData.totalAmount),
      quantity: Number(cartData.quantity) || 1,
    };

    setCartItems((prev) => [...prev, cartEntry]);
  };

  const updateQuantity = async (itemId, quantity) => {
    setCartItems((prev) => {
      if (quantity === 0) {
        return prev.filter((item) => (item.tempId || item._id) !== itemId);
      }

      return prev.map((item) => {
        if ((item.tempId || item._id) === itemId) {
          return {
            ...item,
            quantity: quantity,
            // Update totalAmount by multiplying unitPrice by the new quantity
            totalAmount: item.unitPrice * quantity,
          };
        }
        return item;
      });
    });
  };

  const getCartAmount = () => {
    // This will now sum up the correctly updated totalAmounts
    return cartItems.reduce((total, item) => total + item.totalAmount, 0);
  };

  const placeOrder = (method) => {
    if (!cartItems || cartItems.length === 0) return;

    const orderId = `#${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const orderDate = new Date().toLocaleDateString();

    const orderedItems = cartItems.map((item) => ({
      ...item,
      orderId: orderId,
      date: orderDate,
      paymentMethod: method,
      status: "Order Placed",
    }));

    setOrders((prev) => [...orderedItems, ...prev]);
    setCartItems([]);
  };

  const value = {
    products,
    currency,
    delivery_fee,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    orders, 
    placeOrder,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
