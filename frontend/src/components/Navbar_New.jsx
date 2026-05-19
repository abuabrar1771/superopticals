import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import EGDd from "./DropDowns/EGDd";
import SGDd from "./DropDowns/SGDd";
import { ShopContext } from "../context/ShopContext";

const Navbar_New = () => {
  const [visible, setVisible] = useState(false);
  
  const { getCartCount, token, logout } = useContext(ShopContext);
  const navigate = useNavigate();

  // 🌟 DERIVED STATE: Safe, real-time fallback estimation instead of delayed useEffect sync loops
  const isAdmin = (() => {
    if (!token) return false;
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) return false;
      const parsedUser = JSON.parse(storedUser);
      return parsedUser.role === 'admin';
    } catch (error) {
      console.error("Failed to parse user role data:", error);
      return false;
    }
  })();

  const handleAdminRedirect = () => {
    // 🚀 Opens your Admin Vercel cloud web application workspace seamlessly
    window.open("http://localhost:5174", "_blank");
  setVisible(false); // Closes the mobile layout sidebar drawer view
  };

  return (
    <div className="sticky top-0 bg-white shadow-md z-50">
      <div className="flex items-center justify-between py-7 px-4 sm:px-10 lg:px-20 font-medium">
        
        {/* Main Logo Division */}
        <Link to="/">
          <img
            src={assets.superoptical}
            className="w-40 sm:w-52 lg:w-60"
            alt="SuperOpticals"
          />
        </Link>
        
        <ul className="hidden lg:flex gap-2 text-sm text-black-900 items-center">
          <div className="relative group">
            {/* NAV ITEM */}
            <NavLink
              to="/eyeglasses"
              className={({ isActive }) =>
                `flex items-center gap-1 cursor-pointer z-10 ${
                  isActive ? "text-cyan-600 font-semibold" : "text-black"
                }`
              }
            >
              <span className="relative z-10">EYE GLASSES</span>
              <ChevronDownIcon className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
            </NavLink>

            {/* MEGA DROPDOWN */}
            <div className="fixed left-0 top-[112px] w-screen hidden group-hover:block z-50 pt-4">
              <EGDd />
            </div>
          </div>

          {/* SUN GLASSES */}
          <div className="relative group">
            {/* NAV ITEM */}
            <NavLink
              to="/sunglasses"
              className="flex items-center gap-1 text-black"
            >
              <span>SUN GLASSES</span>
              <ChevronDownIcon className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
            </NavLink>

            {/* MEGA DROPDOWN */}
            <div className="fixed left-0 top-[112px] w-screen hidden group-hover:block z-50 pt-4">
              <SGDd />
            </div>
          </div>

          {/* POWER SUNGLASSES */}
          <div className="relative group flex items-center gap-1">
            <NavLink
              to="/poweredsunglasses"
              className={({ isActive }) =>
                `flex items-center gap-1 ${isActive ? "text-cyan-600 font-semibold" : "text-black"}`
              }
            >
              <span>POWER SUNGLASSES</span>
            </NavLink>
          </div>

          {/* COMPUTER GLASSES */}
          <div className="relative group flex items-center gap-1">
            <NavLink
              to="/computerglasses"
              className={({ isActive }) =>
                `flex items-center gap-1 ${isActive ? "text-cyan-600 font-semibold" : "text-black"}`
              }
            >
              <span>COMPUTER GLASSES</span>
            </NavLink>
          </div>

          {/* CONTACT LENS */}
          <div className="relative group flex items-center gap-1">
            <NavLink
              to="/contactlenses"
              className={({ isActive }) =>
                `flex items-center gap-1 ${isActive ? "text-cyan-600 font-semibold" : "text-black"}`
              }
            >
              <span>CONTACT LENSES</span>
            </NavLink>
          </div>

          {/* ACCESSORIES */}
          <div className="relative group flex items-center gap-1">
            <NavLink
              to="/Accessories"
              className={({ isActive }) =>
                `flex items-center gap-1 ${isActive ? "text-cyan-600 font-semibold" : "text-black"}`
              }
            >
              <span>ACCESSORIES</span>
              <ChevronDownIcon className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
            </NavLink>
          </div>

          {/* BRANDS */}
          <div className="relative group flex items-center gap-1">
            <NavLink
              to="/brands"
              className={({ isActive }) =>
                `flex items-center gap-1 ${isActive ? "text-cyan-600 font-semibold" : "text-black"}`
              }
            >
              <span>BRANDS</span>
              <ChevronDownIcon className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
            </NavLink>
          </div>

          {/* 🌟 DESKTOP ADMIN LINK IN NAV BAR 🌟 */}
          {token && isAdmin && (
            <button
              onClick={handleAdminRedirect}
              className="ml-4 bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded-md font-bold uppercase tracking-wider transition-colors duration-200 shadow-sm"
            >
              Admin Panel ⚙️
            </button>
          )}
        </ul>

        {/* Action Items Corner Container */}
        <div className="flex items-center gap-4">
          
          <div className="group relative">
            <img
              onClick={() => token ? null : navigate("/Login")}
              src={assets.profile_icon}
              alt="Profile"
              className="w-5 cursor-pointer"
            />
            {/* profile context target dropdown menu */}
            {token && (
              <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
                <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-400 text-black rounded">
                  <p onClick={() => navigate('/profile')} className="cursor-pointer hover:bg-gray-600 hover:text-white px-2 py-1 rounded text-sm">
                    My Profile
                  </p>
                  <p onClick={() => navigate('/orders')} className="cursor-pointer hover:bg-gray-600 hover:text-white px-2 py-1 rounded text-sm">
                    Orders
                  </p>
                  
                  {/* 🌟 DUPLICATE SHORTCUT OPTION INSIDE PROFILE MENU 🌟 */}
                  {isAdmin && (
                    <p onClick={handleAdminRedirect} className="cursor-pointer text-red-800 font-bold hover:bg-red-600 hover:text-white px-2 py-1 rounded text-sm border-t border-slate-500 mt-1 pt-2">
                      Admin Panel ⚙️
                    </p>
                  )}

                  <p onClick={logout} className="cursor-pointer hover:bg-gray-600 hover:text-white px-2 py-1 rounded text-sm">
                    LogOut
                  </p>
                </div>
              </div>
            )}
          </div>

          <Link to="/cart" className="relative">
            <img src={assets.cart_icon} className="w-5 min-w-5" alt="Cart" />
            {getCartCount() > 0 && (
              <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white font-bold aspect-square rounded-full text-[9px]">
                {getCartCount()}
              </p>
            )}
          </Link>
          <img
            onClick={() => setVisible(true)}
            src={assets.menu_icon}
            className="w-5 cursor-pointer sm:hidden"
            alt="Menu"
          />
        </div>
      </div>

      {/* Side bar menu drawer layout viewport tracking for compact devices */}
      {visible && (
        <div className="fixed inset-0 z-[9999] bg-black/40">
          <div className="absolute right-0 top-0 h-full w-72 bg-gray-300 overflow-y-auto">
            <div
              onClick={() => setVisible(false)}
              className="flex items-center p-3 gap-4 cursor-pointer border-b bg-gray-400"
            >
              <img
                className="h-4 rotate-180"
                src={assets.dropdown_icon}
                alt="Back"
              />
              <p className="font-bold">Back</p>
            </div>

            {/* 🌟 MOBILE SIDEBAR DYNAMIC ACTION BUTTON FOR LOGGED IN ADMINS 🌟 */}
            {token && isAdmin && (
              <div className="p-4 bg-red-100 border-b border-red-300">
                <button
                  onClick={handleAdminRedirect}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-4 rounded shadow-md text-center block text-sm uppercase tracking-wide"
                >
                  Open Admin Panel ⚙️
                </button>
              </div>
            )}

            <NavLink
              onClick={() => setVisible(false)}
              className="block py-3 pl-6 border-b"
              to="/"
            >
              Home
            </NavLink>
            <NavLink
              onClick={() => setVisible(false)}
              className="block py-3 pl-6 border-b"
              to="/eyeglasses"
            >
              EYE GLASSES
            </NavLink>
            <NavLink
              onClick={() => setVisible(false)}
              className="block py-3 pl-6 border-b"
              to="/sunglasses"
            >
              SUN GLASSES
            </NavLink>
            <NavLink
              onClick={() => setVisible(false)}
              className="block py-3 pl-6 border-b"
              to="/poweredsunglasses"
            >
              POWERED SUNGLASSES
            </NavLink>
            <NavLink
              onClick={() => setVisible(false)}
              className="block py-3 pl-6 border-b"
              to="/computerglasses"
            >
              COMPUTER GLASSES
            </NavLink>
            <NavLink
              onClick={() => setVisible(false)}
              className="block py-3 pl-6 border-b"
              to="/contactlenses"
            >
              CONTACT LENSES
            </NavLink>
            <NavLink
              onClick={() => setVisible(false)}
              className="block py-3 pl-6 border-b"
              to="/accessories"
            >
              ACCESSORIES
            </NavLink>
            <NavLink
              onClick={() => setVisible(false)}
              className="block py-3 pl-6 border-b"
              to="/brands"
            >
              BRANDS
            </NavLink>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar_New;