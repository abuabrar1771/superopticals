import React, { useState } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import EyeglassesDD from "./DropDowns/EyeGlassesDD";
import EGDd from "./DropDowns/EGDd";
import SGDd from "./DropDowns/SGDd";

const Navbar_New = () => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="sticky top-0 bg-white shadow-md z-50" >
    <div className="flex items-center justify-between py-7 px-4 sm:px-10 lg:px-20 font-medium">
      {" "}
      {/*main division */}
      <Link to="/">
        <img
          src={assets.superoptical}
          className="w-40 sm:w-52 lg:w-60"
          alt=""
        />
      </Link>
      <ul className="hidden lg:flex gap-2 text-sm text-black-900">
       
        <div className="relative group">
          {/* NAV ITEM */}
          <NavLink
            to="/eyeglasses"
            className="flex items-center gap-1 text-black"
          >
            <span>EYE GLASSES</span>
            <ChevronDownIcon className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
          </NavLink>

          {/* MEGA DROPDOWN */}
          <div className="fixed left-0 top-[60px] w-screen hidden group-hover:block z-50">
             <EGDd/>
          </div>
        </div>

        {/* POWER GLASSES */}
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
          <div className="fixed left-0 top-[60px] w-screen hidden group-hover:block z-50">
             <SGDd/>
          </div>
        </div>
        {/* POWER GLASSES */}
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
            <ChevronDownIcon className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
          </NavLink>
        </div>
        {/* CONTACT LENS */}
        <div className="relative group flex items-center gap-1">
          <NavLink
            to="/cotactlenses"
            className={({ isActive }) =>
              `flex items-center gap-1 ${isActive ? "text-cyan-600 font-semibold" : "text-black"}`
            }
          >
            <span>CONTACT LENSES</span>
            <ChevronDownIcon className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
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
      </ul>
      {/* ------------------END OF MAIN UL ------------------------- */}
      <div className="flex items-center gap-4">
        <img src={assets.search_icon} alt="" className="w-5 cursor-pointer" />
        <div className="group relative">
          <img
            src={assets.profile_icon}
            alt=""
            className="w-5 cursor-pointer"
          />
          <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
            <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-400 text-black rounded  ">
              <p className="cursor-pointer hover:bg-gray-600 hover:text-white px-2 py-1 rounded">
                My Profile
              </p>
              <p className="cursor-pointer hover:bg-gray-600 hover:text-white px-2 py-1 rounded">
                Orders
              </p>
              <p className="cursor-pointer hover:bg-gray-600 hover:text-white px-2 py-1 rounded">
                LogOut
              </p>
            </div>
          </div>
        </div>
        <Link to="/Cart" className="relative">
          <img src={assets.cart_icon} className="w-5 min-w-5" alt="" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
            0
          </p>
        </Link>
        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className="w-5 cursor-pointer sm:hidden"
          alt=""
        />
      </div>
      </div>
      {/* ------------------END OF iconm enuL with dropdown------------------------- */}
      {/* ------------------side bar menu for small screen --------------------------*/}
      <div
        className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-gray-400 transition-all ${visible ? "w-full" : "w-0"}`}
      >
        <div className="flex flex-col bg-gray-300 ">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center p-3 gap-4 cursor-pointer"
          >
            <img className="h-4 rotate-180" src={assets.dropdown_icon} alt="" />
            <p>Back</p>
          </div>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border  hover:bg-gray-600 hover:text-white"
            to="/"
          >
            Home
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border  hover:bg-gray-600 hover:text-white"
            to="/EyeGlasses"
          >
            EYE GLASSES
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border hover:bg-gray-600 hover:text-white"
            to="/SunGlasses"
          >
            SUN GLASSES
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border  hover:bg-gray-600 hover:text-white"
            to="/PoweredGlasses"
          >
            POWERED SUNGLASSES
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border  hover:bg-gray-600 hover:text-white"
            to="/ComputerGlasses"
          >
            COMPUTER GLASSES
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border  hover:bg-gray-600 hover:text-white"
            to="/Contactlenses"
          >
            CONTACT LENSES
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border  hover:bg-gray-600 hover:text-white"
            to="/   Accessories"
          >
            ACCESSORIES
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border  hover:bg-gray-600 hover:text-white"
            to="/Brands"
          >
            BRANDS
          </NavLink>
        </div>
      </div>
      {/* ----------      END OF THE side bar menu DIV ----------------             */}
    </div>
    // -----------      END OF THE MAIN DIV ----------------
  );
};

export default Navbar_New;
