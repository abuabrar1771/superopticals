import React from "react";
import Title from "./Title";
import { assets } from "../assets/assets";

const ShopByCategory = () => {
  return (
    <div className="w-full bg-[#dfbfa3] py-8 flex flex-col items-center">
      {/* TITLE */}
      <div className="text-center text-xl md:text-2xl mb-6">
        <Title text1="SHOP BY" text2="CATEGORY" />
      </div>

      <div className="relative w-[300px] sm:w-[420px] md:w-[600px] h-[220px] sm:h-[300px] md:h-[400px] mx-auto">

  <img
    src={assets.eye_sun_glasses}
    className="w-full h-full object-contain"
  />

  {/* LEFT */}
  <div className="absolute top-[35%] left-[25%] -translate-x-1/2">
    <div className="w-[120px] sm:w-[150px] md:w-[260px] h-[120px] sm:h-[150px] md:h-[200px] bg-white/40 rounded-2xl flex flex-col justify-end items-center pb-3 shadow-xl">
      <p>Shop</p>
      <h2>Sunglasses</h2>
    </div>
  </div>

  {/* RIGHT */}
  <div className="absolute top-[35%] left-[75%] -translate-x-1/2">
    <div className="w-[120px] sm:w-[150px] md:w-[260px] h-[120px] sm:h-[150px] md:h-[200px] bg-white/40 rounded-2xl flex flex-col justify-end items-center pb-3 shadow-xl">
      <p>Shop</p>
      <h2>Eyeglasses</h2>
    </div>
  </div>

</div>
      {/* SPACE TO PREVENT COLLAPSE */}
      <div className="h-[60px] sm:h-[110px] md:h-[40px]" />

      {/* SMALL CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 px-4">
        {[
          { img: assets.computer_glass, name: "Computer" },
          { img: assets.clip_on, name: "Clip On" },
          { img: assets.contact_lens, name: "Contact Lens" },
          { img: assets.smart_glass, name: "Smart" },
          { img: assets.powered_sunglass, name: "Powered" },
        ].map((item, i) => (
          <div
            key={i}
            className="w-[110px] sm:w-[130px] md:w-[160px]
            h-[90px] sm:h-[100px] md:h-[110px]
            rounded-xl p-[1px]
            bg-gradient-to-br from-white/40 via-[#dfbfa3]/40 to-[#cfa77f]/40
            shadow-md hover:scale-105 transition"
          >
            <div
              className="w-full h-full rounded-xl relative flex flex-col justify-end items-center pb-2
              bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.7),_rgba(223,191,163,0.4))]"
            >
              <img
                src={item.img}
                className="w-[40px] sm:w-[50px] md:w-[60px] absolute top-2 object-contain"
              />

              <p className="text-[10px] sm:text-xs text-gray-900">Shop</p>
              <h3 className="text-xs sm:text-sm italic font-serif text-gray-900">
                {item.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
</div>
  );
};

export default ShopByCategory;
