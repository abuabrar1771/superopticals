import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";

import AddProduct from "./pages/Inventory/AddProduct";
import GetSingleProduct from "./pages/Inventory/GetSingleProduct";
import ProductList from "./pages/Inventory/ProductList";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const backendUrl = import.meta.env.VITE_BACKEND_URL 
export const categoryMap = {
  "EYE_GLASS": ["Full-Rim", "Half-Rim", "Rimless", "Kids"],
  "SUN_GLASS": ["Polarized", "Non-Polarized", "Mirrored", "Gradient"],
  "UV_GLASS": ["Blue-Cut", "Anti-Glare", "UV400 Clear"],
  "POWERED_GLASS": ["Single Vision", "Progressive", "Photochromic"],
  "CONTACT_LENS":["Daily","Fortnightly", "Monthly","Yearly"]
};
export const colorOptions = [
  // Neutrals
  { name: "Black", code: "#000000" },
  { name: "Brown", code: "#5C4033" },
  { name: "Grey", code: "#808080" },
  { name: "Tortoise", code: "#402005" },
  { name: "Beige", code: "#F5F5DC" },
  // Vibrant
  { name: "Red", code: "#FF0000" },
  { name: "Blue", code: "#0000FF" },
  { name: "Pink", code: "#FFC0CB" },
  { name: "Purple", code: "#800080" },
  { name: "Yellow", code: "#FFFF00" },
  { name: "Green", code: "#008000" },
  // Metallics & Finishes
  { name: "Gold", code: "#D4AF37" },
  { name: "Silver", code: "#C0C0C0" },
  { name: "Gunmetal", code: "#2a2a2a" },
  { name: "Rose Gold", code: "#B76E79" },
  { name: "Matte Black", code: "#282828" }, 
  { name: "Honey", code: "#EB9605" }
];

const App = () => {
  
  const [token, setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token'):'');

  useEffect(() => {
    localStorage.setItem('token', token);
    console.log(localStorage)
  }, [token]);

  return (
    <div className="bg-cyan-100 min-h-screen flex flex-col">
      {/* Navbar always visible */}
      <Navbar token={token} setToken={setToken} />
      <hr className="border-cyan-200" />
      
      <div className="flex flex-1">
        {/* Pass token to Sidebar to disable/enable links */}
        <ToastContainer/>
        <Sidebar token={token} />
        
        <main className="flex-1 p-6 flex justify-center items-start">
          <Routes>
            {/* If no token, any route will show the Login card in center */}
            {token === "" ? (
              <Route path="*" element={<Login setToken={setToken} />} />
            ) : (
              <>
                <Route path="/" element={<div className="text-2xl font-bold text-cyan-800">Welcome to Dashboard</div>} />
                <Route path="/addproduct" element={<AddProduct token={token} />} />
                <Route path="/getsingleproduct" element={<GetSingleProduct token={token} />} />
                <Route path="/productlist" element={<ProductList token={token} />} />
                <Route path="*" element={<Navigate to="/" />} />
              </>
            )}
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;