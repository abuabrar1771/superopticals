import React, { useContext } from "react";
import { Search, User, MapPin, Phone, X, LogOut, Package } from "lucide-react";
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
          {/* AUTH SECTION (DYNAMIC) */}
          <div
            className={`relative group items-center gap-2 border-l border-gray-800 pl-6 whitespace-nowrap ${showSearch ? "hidden sm:flex" : "flex"}`}
          >
            {/* ✅ FIX: Depend primarily on token availability. Fallback gracefully if userProfile is loading. */}
            {token ? (
              /* LOGGED IN VIEW */
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-[10px] font-bold">
                  {userProfile?.fullname
                    ? userProfile.fullname.charAt(0).toUpperCase()
                    : "U"}
                </div>
                <span className="uppercase tracking-[0.15em] font-medium text-[13px] text-blue-400">
                  Hi,{" "}
                  {userProfile?.fullname
                    ? userProfile.fullname.split(" ")[0]
                    : "Customer"}
                </span>

                {/* DROPDOWN MENU */}
                <div className="absolute top-full right-0 hidden group-hover:block pt-2 z-[999]">
                  {/* Adjusted background classes to make it dark and text white/gray for a premium look */}
                  <div className="bg-black text-white shadow-2xl rounded-md py-2 w-40 border border-gray-800">
                    <div
                      onClick={() => navigate("/orders")}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-900 cursor-pointer text-xs"
                    >
                      <Package size={14} /> My Orders
                    </div>
                    <hr className="my-1 border-gray-800" />
                    <div
                      onClick={logout}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-red-950/40 text-red-500 cursor-pointer text-xs font-semibold"
                    >
                      <LogOut size={14} /> Logout
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* LOGGED OUT VIEW */
              <div
                onClick={() => navigate("/login")}
                className="flex items-center gap-2 cursor-pointer hover:text-gray-300 transition-all"
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
