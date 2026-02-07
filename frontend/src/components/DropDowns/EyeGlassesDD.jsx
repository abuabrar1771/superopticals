import React from "react";
import { assets } from "../../assets/assets";
import { Link, NavLink } from "react-router-dom";

const EyeGlassesDD = () => {
  return (
    // <div className="absolute left-0 top-full z-50 w-screen">
    <div className="w-screen">
      {/* left-20 right-16 */}
      {/* OUTER SHELL */}
      <div className="bg-[#e7edeb] shadow-xl rounded-3xl">
       
          {/* MAIN GRID */}
          <div className="px-12 pt-6">
            {/* TEXT AREA */}
            <div className="grid grid-cols-5 min-h-[420px]">    
              {/* "p-5 mt-3 grid grid-cols-5 gap-1"> */}
              {/* GENDER + COLLECTION */}
              <div className="col-span-2">
 {/* p-6 grid grid-cols-4 gap-x-8 */}
                <h3 className="text-sm font-semibold ">GENDER</h3>
                {["All", "Men", "Women", "Kids"].map((i) => (
                  <Link key={i} className="block text-sm text-gray-600 hover:text-black py-1">{i}
                  </Link>
                ))}

                <h3 className="text-sm font-semibold mt-2">COLLECTION</h3>
                {["EyeX", "Tees", "Signature", "Spiderman", "Hipster"].map(
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
                {["Rectangle", "Round", "Cat Eye", "Geometric", "Wayfarer"].map(
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
                {["Rimmed", "Semi-Rimmed", "Rimless"].map((i) => (
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
                <h3 className="font-semibold ">TOP BRANDS</h3>
                {[
                  "Zefr",
                  "Titan",
                  "Fastrack",
                  "Rayban",
                  "Muller",
                  "Aristo",
                  "ZESIS",
                  "Dash for Kids",
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
                <h3 className="font-semibold ">FEATURED BRANDS</h3>
                {[
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
                ))}
              {/* </div> */}
               {/* IMAGE COLUMN */}
            {/* <div className="col-span-2 relative rounded-3xl">
            {/* // "overflow-hidden"> */}
              {/* <img
                src={assets.banner_5}
                alt="Eyeglasses"
                className="absolute inset-0 w-full h-full object-cover" */}
                {/* // className="w-full h-full object-cover rounded-3xl "
              /> */}
            </div>
            {/* </div> */} 
            <div className="col-span-2 flex items-center justify-center">
              <div className="w-[520px] h-[300px] overflow-hidden rounded-3xl">
                <img
                 src={assets.banner_5}
                  alt="Eyeglasses"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

          </div>           
          </div>
        
      </div>
    </div>
  );
};
export default EyeGlassesDD;
