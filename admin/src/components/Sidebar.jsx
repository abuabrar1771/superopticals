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

const Sidebar = () => {
  const navItems = [
    { 
      name: "Dashboard", 
      path: "/", 
      icon: <HiOutlineViewGrid /> },
    
    {
      name: "Add Product",
      path: "/AddProduct",
      icon: <HiOutlinePlusCircle />,
    },
    {
      name: "All Products",
      path: "/ProductList",
      icon: <HiOutlineShoppingBag />,
    },
    { 
      name: "Lens Types", 
      path: "/LensType", 
      icon: <HiOutlineBeaker /> },
    {
      name: "Lens Features",
      path: "/LensFeature",
      icon: <HiOutlineSparkles />,
    },
  ];
  return (
    <div className="w-64 h-screen bg-cyan-200 text-slate-900 flex flex-col p-4">
      <h1 className="text-2xl font-bold mb-8 px-2 mt-3 text-slate-900">
        Admin Panel
      </h1>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center justify-start md:justify-start gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-800 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            {/* Icon: Always visible */}
            <span className="text-xl">{item.icon}</span>

            {/* Text: Hidden on small screens, shown on medium+ screens */}
            <span className="font-medium hidden md:block">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
