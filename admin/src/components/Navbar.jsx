import React from "react";
import {
  HiOutlineViewGrid,
  HiOutlineShoppingBag,
  HiOutlinePlusCircle,
  HiOutlineBeaker, // For Lens Types
  HiOutlineSparkles, // For Lens Features
  HiOutlineLogout,
} from "react-icons/hi"; // Heroicons set
import { Link, NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const Navbar = ({ setToken }) => {
  const navigate = useNavigate();

  const logout = () => {
    // 1. Remove from LocalStorage
    localStorage.removeItem('token');

    // 2. Clear state so the App knows we are logged out
    setToken('');

    // 3. Notify and Redirect
    toast.success("Logged out successfully");
    navigate('/login');
  };

  return (
    <div className="flex items-center py-2 px-[4%] justify-between border-b bg-white">
      <Link to="/">
        <img src={assets.logo} className="w-40 sm:w-52 lg:w-60" alt="Logo" />
      </Link>
      
      <button 
        onClick={logout}
        className="flex items-center gap-2 px-5 py-2 sm:px-7 sm:py-2 rounded-full text-slate-800 hover:text-red-400 hover:font-bold transition-colors border border-slate-800 bg-cyan-200"
      >
        <HiOutlineLogout className="text-xl" />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Navbar;
