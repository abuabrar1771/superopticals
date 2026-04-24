import React, { useContext } from "react";
import { Search, User, MapPin, Phone, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const TopHeader = () => {
  const navigate = useNavigate();
  const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);

  return (
    // Replaced 'py-2' with 'h-12' (48px) for a fixed height
    // Added 'flex items-center' to keep everything centered vertically
    <div className="bg-black text-white text-[12px] sm:text-sm h-12 px-4 sm:px-[5%] transition-all duration-300 flex items-center">
      <div className="max-w-7xl mx-auto flex justify-between items-center gap-4 w-full">
        
        {/* LEFT SIDE: Contact & Locator */}
        <div
          className={`flex items-center gap-5 ${showSearch ? "hidden md:flex" : "flex"}`}
        >
          <div className="flex items-center gap-1.5 cursor-pointer hover:text-gray-300 transition-all">
            <Phone size={13} />
            <span className="hidden sm:inline">+91 98765 43210</span>
          </div>
          <div className="flex items-center gap-1.5 cursor-pointer hover:text-gray-300 transition-all">
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
              // Fixed height for the input container as well to prevent jitter
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

          {/* LOGIN / SIGNUP SECTION */}
          {/* Replaced JS window width check with CSS 'hidden sm:flex' for reliability */}
          <div
            onClick={() => navigate("/Orders")}
            className={`items-center gap-2 cursor-pointer hover:text-gray-300 transition-all border-l border-gray-800 pl-6 whitespace-nowrap 
              ${showSearch ? "hidden sm:flex" : "flex"}`}
          >
            <User size={15} />
            <span className="uppercase tracking-[0.15em] font-medium text-[13px]">
              Login / Signup
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopHeader;