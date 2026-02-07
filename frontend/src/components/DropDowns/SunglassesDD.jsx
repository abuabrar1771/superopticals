import React from "react";
import { assets } from "../../assets/assets";
import { Link, NavLink } from "react-router-dom";

const SunGlassesDD = () => {
  return (
    // <div className="absolute left-0 top-full z-50 w-screen">
    <div className="fixed left-20 right-16 top-[64px] z-50 ">
      {/* OUTER SHELL */}
      <div className="bg-[#e7edeb] shadow-xl rounded-3xl">
       
          {/* MAIN GRID */}
          <div className=" ">
            {/* TEXT AREA */}
            <div className="p-5 mt-3 grid grid-cols-5 gap-1">
              {/* GENDER + COLLECTION */}
              <div>
                <h3 className="text-sm font-semibold ">GENDER</h3>
                {["All", "Men", "Women", "Kids"].map((i) => (
                  <Link key={i} className="block text-sm text-gray-600 hover:text-black py-1">{i}
                  </Link>
                ))}

                <h3 className="text-sm font-semibold mt-2">COLLECTION</h3>
                {["Smart Sunglasses", "Donald","GlowUp", "Whiplash","Vivid Geometry"].map(
                  (i) => (
                    <Link
                      key={i}
                      className="block text-sm text-gray-600 hover:text-black py-1"
                    >
                      {i}
                    </Link>
                  ),
                )}
              </div>

              {/* SHAPE + STYLE */}
              <div>
                <h3 className="font-semibold">SHAPE</h3>
                {["Rectangle", "Round", "Avitar", "Wraparound", "Wayfarer"].map(
                  (i) => (
                    <Link
                      key={i}
                      className="block text-sm text-gray-600 hover:text-black py-1"
                    >
                      {i}
                    </Link>
                  ),
                )}

                <h3 className="font-semibold">STYLE</h3>
                {["mirrored", "Tinted", "UV Protections","Polaized"].map((i) => (
                  <Link
                    key={i}
                    className="block text-sm text-gray-600 hover:text-black py-1"
                  >
                    {i}
                  </Link>
                ))}
              </div>

              {/* FEATURED BRANDS */}
              <div>
                <h3 className="font-semibold ">USAGE</h3>
                {[
                  "Refular",
                  "Power",
                ].map((i) => (
                  <Link
                    key={i}
                    className="block text-sm text-gray-600 hover:text-black py-1"
                  >
                    {i}
                  </Link>
                ))}
              </div>

              {/* FEATURED BRANDS 2 */}
              <div>
                <h3 className="font-semibold bg-"></h3>
                {/* {[
                  "Oakley",
                  "Carrera",
                  "Stepper",
                  "Burberry",
                  "Tom Ford",
                  "Ted Baker",
                  "Silhouette",
                  "Swarovski",
                  "Mont Blanc",
                  "Calvin Klein",
                ].map((i) => (
                  <Link
                    key={i}
                    className="block text-sm text-gray-600 hover:text-black py-1"
                  >
                    {i}
                  </Link>
                ))} */}
              </div>
               {/* IMAGE COLUMN */}
            <div className="overflow-hidden">
              <img
                src={assets.banner_1}
                alt="Eyeglasses"
                className="w-full h-full object-cover rounded-3xl items-center"
              />
            </div>
            </div>
           
          </div>
        
      </div>
    </div>
  );
};
export default SunGlassesDD;
