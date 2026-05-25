import React, { useContext } from "react";
import {
  Search,
  User,
  MapPin,
  Phone,
  X,
  LogOut,
  Package,
  ShieldCheck,
} from "lucide-react"; 
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const TopHeader = () => {
  const navigate = useNavigate();
  const {
    search,
    setSearch,
    showSearch,
    setShowSearch,
    token,
    userProfile,
    logout,
  } = useContext(ShopContext);

  // 🛡️ Determine if the currently logged-in account is an administrator
  const isAdmin = userProfile?.role === "admin";

  return (
    <div className="bg-black text-white text-[12px] sm:text-sm h-12 px-4 sm:px-[5%] transition-all duration-300 flex items-center">
      <div className="max-w-7xl mx-auto flex justify-between items-center gap-4 w-full">
        {/* LEFT SIDE: Contact & Locator */}
        <div
          className={`flex items-center gap-5 ${showSearch ? "hidden md:flex" : "flex"}`}
        >
          <div className="flex items-center gap-1.5 cursor-pointer hover:text-gray-300 transition-all text-gray-400">
            <Phone size={13} />
            <span className="hidden sm:inline">+91 98765 43210</span>
          </div>
          <div className="flex items-center gap-1.5 cursor-pointer hover:text-gray-300 transition-all text-gray-400">
            <MapPin size={13} />
            <span className="hidden sm:inline">Shop Locator</span>
          </div>
        </div>

        {/* RIGHT SIDE: Search & Auth Container */}
        <div
          className={`flex items-center justify-end gap-6 ${showSearch ? "flex-1" : ""}`}
        >
          {/* SEARCH SECTION */}
          <div
            className={`flex items-center gap-3 ${showSearch ? "flex-1 max-w-[500px]" : ""}`}
          >
            {showSearch ? (
              <div className="flex items-center w-full bg-white/10 border border-gray-600 rounded-full px-4 h-8">
                <Search size={14} className="text-gray-400 mr-2" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  type="text"
                  placeholder="Search products..."
                  className="bg-transparent outline-none text-white text-sm w-full"
                  autoFocus
                />
                <X
                  size={14}
                  className="cursor-pointer text-gray-400 hover:text-white ml-2"
                  onClick={() => {
                    setShowSearch(false);
                    setSearch("");
                  }}
                />
              </div>
            ) : (
              <div
                onClick={() => setShowSearch(true)}
                className="flex items-center gap-2 cursor-pointer hover:text-gray-300 transition-all group"
              >
                <Search
                  size={15}
                  className="group-hover:scale-110 transition-transform"
                />
                <span className="uppercase tracking-[0.15em] font-medium text-[13px]">
                  Search
                </span>
              </div>
            )}
          </div>

          {/* AUTH SECTION (DYNAMIC POP-UP ON HOVER) */}
          <div
            className={`relative group flex items-center gap-2 border-l border-gray-800 pl-6 h-12 cursor-pointer whitespace-nowrap ${showSearch ? "hidden sm:flex" : "flex"}`}
          >
            {/* 🌟 Check both token or profile memory to render logged-in layout */}
            {token || userProfile ? (
              <div className="flex items-center gap-2 h-full relative group">
                {/* Profile avatar avatar badge icon */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${isAdmin ? "bg-amber-500" : "bg-blue-600"}`}
                >
                  {userProfile
                    ? (userProfile.fullname || userProfile.name || "U").charAt(0).toUpperCase()
                    : "U"}
                </div>

                {/* 🌟 Dynamic Username display */}
                <span
                  className={`uppercase tracking-[0.15em] font-medium text-[13px] ${isAdmin ? "text-amber-400" : "text-blue-400"}`}
                >
                  Hi,{" "}
                  {userProfile
                    ? (userProfile.fullname || userProfile.name || "Customer").split(" ")[0]
                    : "User"}
                </span>

                {/* 🌟 POP-UP DROPDOWN MENU (FIXED MECHANICS) */}
                {/* Changed top alignment to top-10 to perfectly anchor beneath cursor pathing */}
                <div className="absolute top-10 right-0 invisible opacity-0 group-hover:visible group-hover:opacity-100 pt-2 z-[99999] transition-all duration-200">
                  <div className="bg-neutral-900 text-white border border-neutral-800 shadow-2xl rounded-lg py-1.5 w-40 pointer-events-auto">
                    {/* Admin Redirect Link */}
                    {isAdmin && (
                      <a
                        href="http://localhost:5174"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 text-amber-400 hover:bg-neutral-800 cursor-pointer text-xs font-semibold transition-colors"
                      >
                        <ShieldCheck size={13} /> Admin Panel
                      </a>
                    )}

                    <div
                      onClick={() => navigate("/orders")}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-800 cursor-pointer text-xs text-gray-200 transition-colors"
                    >
                      <Package size={13} /> My Orders
                    </div>

                    <hr className="border-neutral-800 my-1" />

                    <div
                      onClick={logout}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-red-950/30 text-red-400 cursor-pointer text-xs font-semibold transition-colors"
                    >
                      <LogOut size={13} /> Logout
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* USER IS LOGGED OUT VIEW */
              <div
                onClick={() => navigate("/login")}
                className="flex items-center gap-2 cursor-pointer hover:text-gray-300 transition-all h-full"
              >
                <User size={15} />
                <span className="uppercase tracking-[0.15em] font-medium text-[13px]">
                  Login / Signup
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopHeader;