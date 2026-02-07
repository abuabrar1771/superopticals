import React, { useState } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="flex items-center justify-between py-7 px-4 sm:px-10 lg:px-20 font-medium">
      <Link to="/">
        <img
          src={assets.superoptical}
          className="w-40 sm:w-52 lg:w-60 "
          alt=""
        />
      </Link>
      <ul className="hidden lg:flex gap-2 text-sm text-black-900">
        <div className="relative group flex items-center gap-1">
          {/* COLLECTIONS */}
          <NavLink
            to="/eyeglasses"
            className={({ isActive }) =>
              `flex items-center gap-1 ${isActive ? "text-cyan-600 font-semibold" : "text-black"}`
            }
          >
            <span>EYE GLASSES</span>
            <ChevronDownIcon className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
          </NavLink>

          {/* -------------------------------------------           DROPDOWN -------------------------------------------------- */}
          <div className="absolute left-0 top-full hidden group-hover:block z-50">
            {/* OUTER SHELL */}
            <div className="w-[1400px] bg-white shadow-xl rounded-xl overflow-hidden">
              <div className="grid grid-cols-5 min-h-[360px]">
                {/* TEXT AREA (padded) */}
                <div className="col-span-4 p-8 grid grid-cols-4 gap-10">
                  {/* GENDER + COLLECTION */}
                  <div className="space-y-1">
                    <div>
                      <h3 className="text-sm font-semibold mb-4 tracking-wide">
                        GENDER
                      </h3>
                      <p className="py-0.5 text-sm text-gray-600 hover:text-black">
                        All
                      </p>
                      <p className="py-0.5 text-sm text-gray-600 hover:text-black">
                        Men
                      </p>
                      <p className="py-0.5 text-sm text-gray-600 hover:text-black">
                        Women
                      </p>
                      <p className="py-0.5 text-sm text-gray-600 hover:text-black">
                        Kids
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3">COLLECTION</h3>
                      <p className="py-0.5 text-sm text-gray-600 hover:text-black">
                        EyeX
                      </p>
                      <p className="py-0.5 text-sm text-gray-600 hover:text-black">
                        Tees
                      </p>
                      <p className="py-0.5 text-sm text-gray-600 hover:text-black">
                        Signature
                      </p>
                      <p className="py-0.5 text-sm text-gray-600 hover:text-black">
                        Spiderman
                      </p>
                      <p className="py-0.5 text-sm text-gray-600 hover:text-black">
                        Hipster
                      </p>
                    </div>
                  </div>
                  {/* SHAPE + STYLE */}
                  <div className="space-y-8">
                    <div>
                      <h3 className="font-semibold mb-3">SHAPE</h3>
                      <p className="py-0.5 text-sm text-gray-600 hover:text-black">
                        Rectangle
                      </p>
                      <p className="py-0.5 text-sm text-gray-600 hover:text-black">
                        Round
                      </p>
                      <p className="py-0.5 text-sm text-gray-600 hover:text-black">
                        Cat Eye
                      </p>
                      <p className="py-0.5 text-sm text-gray-600 hover:text-black">
                        Geometric
                      </p>
                      <p className="py-0.5 text-sm text-gray-600 hover:text-black">
                        Wayfarer
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3">STYLE</h3>
                      <p className="py-0.5 text-sm text-gray-600 hover:text-black">
                        Rimmed
                      </p>
                      <p className="py-0.5 text-sm text-gray-600 hover:text-black">
                        Semi-Rimmed
                      </p>
                      <p className="py-0.5 text-sm text-gray-600 hover:text-black">
                        Rimless
                      </p>
                    </div>
                  </div>
                  {/* TOP BRANDS */}
                  <div>
                    <h3 className="font-semibold mb-3">FEATURED BRANDS</h3>
                    <p className="py-0.5 text-sm text-gray-600 hover:text-black">
                      Oakley
                    </p>
                    <p className="py-0.5 text-sm text-gray-600 hover:text-black">
                      Carrera
                    </p>
                    <p className="py-0.5 text-sm text-gray-600 hover:text-black">
                      Stepper
                    </p>
                    <p className="py-0.5 text-sm text-gray-600 hover:text-black">
                      Burberry
                    </p>
                    <p className="py-0.5 text-sm text-gray-600 hover:text-black">
                      Tom Ford
                    </p>
                    <p className="py-0.5 text-sm text-gray-600 hover:text-black">
                      Ted Baker
                    </p>
                    <p className="py-0.5 text-sm text-gray-600 hover:text-black">
                      Silhouette
                    </p>
                    <p className="py-0.5 text-sm text-gray-600 hover:text-black">
                      Swarovski
                    </p>
                    <p className="py-0.5 text-sm text-gray-600 hover:text-black">
                      Mont Blanc
                    </p>
                    <p className="py-0.5 text-sm text-gray-600 hover:text-black">
                      Calvin Klein
                    </p>
                  </div>
                  {/* FEATURED BRANDS */}
                  <div>
                    <h3 className="font-semibold mb-3">FEATURED BRANDS</h3>
                    <p className="py-0.5 text-sm text-gray-600 hover:text-black">
                      Oakley
                    </p>
                    <p className="py-0.5 text-sm text-gray-600 hover:text-black">
                      Carrera
                    </p>
                    <p className="py-0.5 text-sm text-gray-600 hover:text-black">
                      Stepper
                    </p>
                    <p className="py-0.5 text-sm text-gray-600 hover:text-black">
                      Burberry
                    </p>
                    <p className="py-0.5 text-sm text-gray-600 hover:text-black">
                      Tom ord
                    </p>
                    <p className="py-0.5 text-sm text-gray-600 hover:text-black">
                      Ted Baker
                    </p>
                    <p className="py-0.5 text-sm text-gray-600 hover:text-black">
                      Silhouette
                    </p>
                    <p className="py-0.5 text-sm text-gray-600 hover:text-black">
                      Swarovski
                    </p>
                    <p className="py-0.5 text-sm text-gray-600 hover:text-black">
                      Mont Blanc
                    </p>
                    <p className="py-0.5 text-sm text-gray-600 hover:text-black">
                      Calvin Klein
                    </p>
                  </div>
                </div>

                {/* IMAGE AREA (NO padding) */}
                <div className="relative min-h-[360px]">
                  <img
                    src={assets.banner_1}
                    alt="Eyeglasses"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative group flex items-center gap-1">
          {/* COLLECTIONS */}
          <NavLink
            to="/sunglasses"
            className={({ isActive }) =>
              `flex items-center gap-1 ${isActive ? "text-cyan-600 font-semibold" : "text-black"}`
            }
          >
            <span>SUNGLASSES</span>
            <ChevronDownIcon className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
          </NavLink>

          {/* DROPDOWN */}
          <div className="absolute top-5 left-0 hidden group-hover:block bg-white text-black rounded shadow-md w-40 z-50">
            <p className="px-4 py-2 hover:bg-gray-200 cursor-pointer">Men</p>
            <p className="px-4 py-2 hover:bg-gray-200 cursor-pointer">Women</p>
            <p className="px-4 py-2 hover:bg-gray-200 cursor-pointer">Kids</p>
          </div>
        </div>

        <NavLink
          to="/poweredsunglasses"
          className={({ isActive }) =>
            `flex items-center gap-1 ${isActive ? "text-cyan-600 font-semibold" : "text-black"}`
          }
        >
          <p>POWERED SUNGLASSES</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-cyan-800 hidden" />
        </NavLink>
        <NavLink
          to="/computerglasses"
          className={({ isActive }) =>
            `flex items-center gap-1 ${isActive ? "text-cyan-600 font-semibold" : "text-black"}`
          }
        >
          <p>COMPUTER GLASSES</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-cyan-800 hidden" />
        </NavLink>
        <div className="relative group flex items-center gap-1">
          {/* COLLECTIONS */}
          <NavLink
            to="/contactlenses"
            className={({ isActive }) =>
              `flex items-center gap-1 ${isActive ? "text-cyan-600 font-semibold" : "text-black"}`
            }
          >
            <span>CONTACT LENSE</span>
            <ChevronDownIcon className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
          </NavLink>

          {/* DROPDOWN */}
          <div className="absolute top-5 left-0 hidden group-hover:block bg-white text-black rounded shadow-md w-40 z-50">
            <p className="px-4 py-2 hover:bg-gray-200 cursor-pointer">Men</p>
            <p className="px-4 py-2 hover:bg-gray-200 cursor-pointer">Women</p>
            <p className="px-4 py-2 hover:bg-gray-200 cursor-pointer">Kids</p>
          </div>
        </div>
        <div className="relative group flex items-center gap-1">
          {/* COLLECTIONS */}
          <NavLink
            to="/accessories"
            className={({ isActive }) =>
              `flex items-center gap-1 ${isActive ? "text-cyan-600 font-semibold" : "text-black"}`
            }
          >
            <span>ACCESSORIES</span>
            <ChevronDownIcon className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
          </NavLink>

          {/* DROPDOWN */}
          <div className="absolute top-5 left-0 hidden group-hover:block bg-white text-black rounded shadow-md w-40 z-50">
            <p className="px-4 py-2 hover:bg-gray-200 cursor-pointer">Men</p>
            <p className="px-4 py-2 hover:bg-gray-200 cursor-pointer">Women</p>
            <p className="px-4 py-2 hover:bg-gray-200 cursor-pointer">Kids</p>
          </div>
        </div>
        <div className="relative group flex items-center gap-1">
          {/* COLLECTIONS */}
          <NavLink
            to="/brands"
            className={({ isActive }) =>
              `flex items-center gap-1 ${isActive ? "text-cyan-600 font-semibold" : "text-black"}`
            }
          >
            <span>BRANDS</span>
            <ChevronDownIcon className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
          </NavLink>

          {/* DROPDOWN */}
          <div className="absolute top-5 left-0 hidden group-hover:block bg-white text-black rounded shadow-md w-40 z-50">
            <p className="px-4 py-2 hover:bg-gray-200 cursor-pointer">Men</p>
            <p className="px-4 py-2 hover:bg-gray-200 cursor-pointer">Women</p>
            <p className="px-4 py-2 hover:bg-gray-200 cursor-pointer">Kids</p>
          </div>
        </div>
      </ul>
      <div className="flex items-center gap-6">
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
      {/* side bar menu for small screen */}
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
    </div>
  );
};

export default Navbar;
