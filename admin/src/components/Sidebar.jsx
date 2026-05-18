import React from "react";
import {
  HiOutlineViewGrid,
  HiOutlineShoppingBag,
  HiOutlinePlusCircle,
  HiOutlineBeaker,
  HiOutlineSparkles,
} from "react-icons/hi";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const navItems = [
    { name: "Dashboard", path: "/", icon: <HiOutlineViewGrid /> },
    { name: "Add Product", path: "/addproduct", icon: <HiOutlinePlusCircle /> },
    { name: "All Products", path: "/productlist", icon: <HiOutlineShoppingBag /> },
    { name: "Lens Config", path: "/updateLensPrice", icon: <HiOutlineBeaker /> },
    { name: "Orders", path: "/Orders", icon: <HiOutlineViewGrid /> },
  ];

  return (
    <div className="w-64 h-screen bg-cyan-200 text-slate-900 flex flex-col p-4 shadow-lg sticky top-0">
      <div className="flex items-center gap-2 mb-8 px-2 mt-3 border-b border-cyan-300 pb-4">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          SuperOptical
        </h1>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            title={item.name}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg translate-x-2"
                  : "text-slate-800 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
            <span className="font-semibold">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="pt-4 border-t border-cyan-300 text-[10px] uppercase tracking-widest text-center text-slate-600 font-bold">
        Admin Console v1.0.4
      </div>
    </div>
  );
};

export default Sidebar;