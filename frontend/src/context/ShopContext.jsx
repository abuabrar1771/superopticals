import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const currency = "₹";
  const delivery_fee = 10;
  const navigate = useNavigate();

  // ---------------- STATE DECLARATIONS ----------------
  const [token, setToken] = useState(localStorage.getItem("token") ? localStorage.getItem("token") : null);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]); // Array layout for cart lists
  const [userProfile, setUserProfile] = useState(null); // Stores full database user information
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // ---------------- FETCH MASTER PRODUCTS ----------------
  const getProductsData = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/product/list`);
      if (res.data.success) {
        setProducts(res.data.products);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error("Product fetch failure:", err);
      toast.error(err.message);
    }
  };

  
  // ---------------- FETCH USER PROFILE ----------------
const getUserProfile = async (currentToken) => {
  // Use the explicitly passed token first, otherwise fall back to state token
  const activeToken = currentToken || token;
  
  if (!activeToken) {
    console.log("No token available to fetch user profile.");
    return;
  }

  try {
    // ✅ Axios POST syntax: URL -> Empty Body -> Headers Config Object
    const res = await axios.post(
      `${backendUrl}/api/user/profile`, 
      {}, 
      {
        headers: { token: activeToken },
      }
    );

    if (res.data.success) {
      // 1. Update global user profile state
      setUserProfile(res.data.user);
    } else {
      // 2. Handle cases where backend sends success: false with an error message
      console.log("Backend profile sync failed:", res.data.message);
      toast.error(res.data.message || "Failed to load user profile data.");
    }
  } catch (err) {
    // 3. Handle network errors or server crashes
    console.error("Network error fetching user profile:", err.message);
    
    // Fallback: extract backend specific messages if available
    const errorMessage = err.response?.data?.message || "Error syncing user details.";
    toast.error(errorMessage);
    
    // Automatically log out if the backend returns an unauthorized status code (expired token)
    if (err.response?.status === 401) {
      logout();
    }
  }
};

  // ---------------- ADD TO CART (ARRAY BASED) ----------------
  const addToCart = (itemDetail) => {
    setCartItems((prev) => {
      const updatedCart = [...prev, itemDetail];
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
    return { data: { success: true } };
  };

  // ---------------- UPDATE CART QUANTITY ----------------
  const updateCartQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return; // Block negative quantities

    setCartItems((prev) => {
      const updatedCart = [...prev];
      const item = updatedCart[index];

      if (item) {
        // Calculate unit price from current total / current quantity tracking parameters
        const unitPrice = item.totalAmount / (item.quantity || 1);

        // Mutate array indices safely
        item.quantity = newQuantity;
        item.totalAmount = unitPrice * newQuantity;
      }

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  // ---------------- CART TOTALS CALCULATORS ----------------
  const getCartAmount = () => {
    return cartItems.reduce((total, item) => total + (Number(item.totalAmount) || 0), 0);
  };

  const getCartCount = () => {
    return cartItems.length;
  };

  // ---------------- CLEAR CART DATA ----------------
  const clearCart = () => {
    setCartItems([]); // Correctly maintains structural state array integrity
    localStorage.removeItem("cart"); // Purges browser local memory traces entirely
  };

  // ---------------- AUTHENTICATION LOGOUT ----------------
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("cart");
    setToken(null);
    setUserProfile(null); // Resets username layout rendering targets back to default values
    setCartItems([]);
    toast.success("Logged out successfully");
    navigate("/");
  };

  // ---------------- LIFECYCLE RUNTIME MANAGEMENT ----------------
  useEffect(() => {
    getProductsData();

    // Check, parse and hydrate browser local memory components on initial page mount
    const localCart = localStorage.getItem("cart");
    if (localCart) {
      try {
        setCartItems(JSON.parse(localCart));
      } catch (error) {
        console.error("Cart hydration execution exception:", error);
        setCartItems([]);
      }
    }
  }, []);

  // Sync profile data retrieval dependencies instantly upon authentication transitions
  // Inside ShopContext.jsx

useEffect(() => {
  getProductsData();

  // Restore cart from memory
  const localCart = localStorage.getItem("cart");
  if (localCart) {
    try {
      setCartItems(JSON.parse(localCart));
    } catch (error) {
      setCartItems([]);
    }
  }

  // ✅ Run ONLY ONCE when the app first loads in the browser
  const savedToken = localStorage.getItem("token");
  if (savedToken) {
    getUserProfile(savedToken);
  }
}, []); // 💡 Empty array means it won't fire again when token state changes dynamically

  // ---------------- VALUE INJECTION DISPATCH MAPPING ----------------
  const value = {
    navigate,
    backendUrl,
    currency,
    delivery_fee,
    token,
    setToken,
    products,
    cartItems,
    setCartItems,
    addToCart,
    getCartAmount,
    getCartCount,
    logout,
    updateCartQuantity,
    clearCart,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    userProfile,
    setUserProfile,
    getUserProfile,
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;