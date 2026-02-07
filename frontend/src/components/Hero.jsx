import React from "react";
import { assets } from "../assets/assets";

const Hero = () => {
  return (
    <section className="max-w-7xl mx-auto border border-blue-400 items-center shadow-lg rounded-3xl mt-24">
      <div className="flex flex-col md:flex-row items-center h-[420px]">

        {/* LEFT CONTENT */}
        <div className="w-full md:w-1/2 px-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-10 h-[2px] bg-gray-400"></span>
            <p className="text-sm tracking-widest text-gray-800">
              OUR BESTSELLERS
            </p>
          </div>

          <h1 className="prata-regular text-4xl md:text-5xl font-light text-gray-800 mb-6">
            Latest Arrivals
          </h1>

          <div className="flex items-center gap-3">
            <p className="text-sm font-medium tracking-widest">
              SHOP NOW
            </p>
            <span className="w-10 h-[2px] bg-gray-400"></span>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="w-full md:w-1/2 h-full overflow-hidden">
          <img
            src={assets.hero_5}
            alt="Hero"
            className="w-full h-full object-cover rounded-3xl"
          />
        </div>

      </div>
    </section>
  );
};

export default Hero;
