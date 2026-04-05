import React from "react";
import Title from "./Title";
import { assets } from "../assets/assets";

const ShopByCategory = () => {
  return (
    <div className="relative h-[50vh] md:h-[80vh] w-full overflow-hidden z-10 flex flex-col items-center justify-center  bg-[#dfbfa3] gap-12">
      
        {/* Title */}
        <div className="text-center text-3xl py-8">
          <Title text1="SHOP BY" text2="CATEGORY" />
        </div>

        {/* 🌑 Dark Blur */}
        <div
          className="absolute bottom-[-150px] right-[-150px] w-[600px] h-[600px] 
          bg-[radial-gradient(circle,_rgba(0,0,0,0.8),_transparent_70%)] 
          blur-3xl opacity-90 pointer-events-none"
        />

        {/* 🔥 STACKED BACKGROUND */}
        <div
          className="absolute top-[40px] left-[60px] w-[260px] h-[340px] 
          bg-white/30 backdrop-blur-sm rounded-xl rotate-[-12deg] shadow-2xl opacity-50"
        />

        <div
          className="absolute top-[120px] left-[160px] w-[280px] h-[360px] 
          bg-white/20 backdrop-blur-sm rounded-xl rotate-[8deg] shadow-2xl opacity-40"
        />

        <div
          className="absolute bottom-[60px] left-[80px] w-[240px] h-[320px] 
          bg-white/20 backdrop-blur-sm rounded-xl rotate-[-6deg] shadow-2xl opacity-30"
        />

        <div
          className="absolute top-[10px] right-[80px] w-[260px] h-[340px] 
          bg-white/20 backdrop-blur-sm rounded-xl rotate-[10deg] shadow-2xl opacity-40"
        />

        {/* 🔥 MAIN CONTENT */}
        <div className="flex items-center justify-start ">
          

          {/* RIGHT SIDE */}
          <div className="flex justify-start ">
            <div className="relative -ml-32">
              {/* 👓 Glass */}
              <img
                src={assets.eye_sun_glasses}
                className="h-[70%] md:h-[80%] object-contain w-[400px] md:w-[550px] lg:w-[650px] relative z-20 drop-shadow-[0_25px_50px_rgba(0,0,0,0.25)]"
              />

              {/* 🟤 LEFT BIG CARD */}
              <div
                className="absolute top-1/4 left-[65px] -translate-y-1/4 translate-y-4
                w-[240px] h-[260px] rounded-2xl p-[1px]
                bg-gradient-to-br from-white/40 via-[#dfbfa3]/40 to-[#cfa77f]/40 backdrop-blur-md
                shadow-[0_20px_40px_rgba(0,0,0,0.15)]"
              >
                <div
                  className="w-full h-full rounded-2xl 
                  bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.7),_rgba(223,191,163,0.4))]
                  flex flex-col justify-end items-center pb-6"
                >
                  <p className="text-md text-gray-900">Shop</p>
                  <h2 className="text-2xl italic font-serif text-gray-900">
                    Sunglasses
                  </h2>
                </div>
              </div>

              {/* 🟤 RIGHT BIG CARD */}
              <div
                className="absolute top-1/4 right-[65px] -translate-y-1/4 translate-y-4
                w-[240px] h-[260px] rounded-2xl p-[1px]
                bg-gradient-to-br from-white/40 via-[#dfbfa3]/40 to-[#cfa77f]/40 backdrop-blur-md
                shadow-[0_20px_40px_rgba(0,0,0,0.15)]"
              >
                <div
                  className="w-full h-full rounded-2xl 
                  bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.7),_rgba(223,191,163,0.4))]
                  flex flex-col justify-end items-center pb-6"
                >
                  <p className="text-md text-gray-900">Shop</p>
                  <h2 className="text-2xl italic font-serif text-gray-900">
                    Eyeglasses
                  </h2>
                </div>
              </div>

              {/* 🔥 RIGHT SMALL CARDS (FIXED GAP) */}
              <div className="absolute top-1/4 -translate-y-1/4 left-full ml-1 flex flex-col gap-3">
                {/* Smart */}
                <div
                  className="w-[180px] h-[120px] rounded-xl p-[1px]
                  bg-gradient-to-br from-white/40 via-[#dfbfa3]/40 to-[#cfa77f]/40 backdrop-blur-md
                  shadow-xl hover:scale-105 transition"
                >
                  <div
                    className="w-full h-full rounded-xl 
                    bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.7),_rgba(223,191,163,0.4))]
                    flex flex-col justify-end items-center pb-4"
                  >
                    <img
                      src={assets.computer_glass}
                      className="w-[90px] object-contain absolute top-4 drop-shadow-lg"
                    />

                    <p className="text-sm text-gray-900 mt-3">Shop</p>
                    <h3 className="text-md italic font-serif text-gray-900">
                      Computer Glass
                    </h3>
                  </div>
                </div>
                <div
                  className="w-[180px] h-[120px] rounded-xl p-[1px]
                  bg-gradient-to-br from-white/40 via-[#dfbfa3]/40 to-[#cfa77f]/40 backdrop-blur-md
                  shadow-xl hover:scale-105 transition"
                >
                  <div
                    className="w-full h-full rounded-xl 
                    bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.7),_rgba(223,191,163,0.4))]
                    flex flex-col justify-end items-center pb-4"
                  >
                    <img
                      src={assets.clip_on}
                      className="w-[90px] object-contain absolute top-4 drop-shadow-lg"
                    />

                    <p className="text-sm text-gray-900">Shop</p>
                    <h3 className="text-md italic font-serif text-gray-900">
                      Clip on Eyeglass
                    </h3>
                  </div>
                </div>

                {/* Powered */}
                <div
                  className="w-[180px] h-[120px] rounded-xl p-[1px]
                  bg-gradient-to-br from-white/40 via-[#dfbfa3]/40 to-[#cfa77f]/40 backdrop-blur-md
                  shadow-xl hover:scale-105 transition"
                >
                  <div
                    className="w-full h-full rounded-xl 
                    bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.7),_rgba(223,191,163,0.4))]
                    flex flex-col justify-end items-center pb-4"
                  >
                    <img
                      src={assets.contact_lens}
                      className="w-[90px] object-contain absolute top-4 drop-shadow-lg"
                    />

                    <p className="text-sm text-gray-900">Shop</p>
                    <h3 className="text-md italic font-serif text-gray-900">
                      Contact Lens
                    </h3>
                  </div>
                </div>
                
              </div>
              {/* 🔥 RIGHT 2nd SMALL CARDS (FIXED GAP) */}
              <div className="absolute top-1/4 -translate-y-1/4 -right-96 flex flex-col gap-3">
                {/* Smart */}
                <div
                  className="w-[180px] h-[120px] rounded-xl p-[1px]
                  bg-gradient-to-br from-white/40 via-[#dfbfa3]/40 to-[#cfa77f]/40 backdrop-blur-md
                  shadow-xl hover:scale-105 transition"
                >
                  <div
                    className="w-full h-full rounded-xl 
                    bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.7),_rgba(223,191,163,0.4))]
                    flex flex-col justify-end items-center pb-4"
                  >
                    <img
                      src={assets.smart_glass}
                      className="w-[90px] object-contain absolute top-4 drop-shadow-lg"
                    />

                    <p className="text-sm text-gray-900">Shop</p>
                    <h3 className="text-md italic font-serif text-gray-900">
                      Smart
                    </h3>
                  </div>
                </div>
               

                {/* Powered */}
                <div
                  className="w-[180px] h-[120px] rounded-xl p-[1px]
                  bg-gradient-to-br from-white/40 via-[#dfbfa3]/40 to-[#cfa77f]/40 backdrop-blur-md
                  shadow-xl hover:scale-105 transition"
                >
                  <div
                    className="w-full h-full rounded-xl 
                    bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.7),_rgba(223,191,163,0.4))]
                    flex flex-col justify-end items-center pb-4"
                  >
                    <img
                      src={assets.powered_sunglass}
                      className="w-[90px] object-contain absolute top-4 drop-shadow-lg"
                    />

                    <p className="text-sm text-gray-900">Shop</p>
                    <h3 className="text-md italic font-serif text-gray-900">
                      Powered
                    </h3>
                  </div>
                </div>
                
              </div>
              
            </div>
          </div>
          
        </div>
        
      </div>
  );
};

export default ShopByCategory;