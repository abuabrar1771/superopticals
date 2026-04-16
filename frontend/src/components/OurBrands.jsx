import React from "react";
import { assets } from "../assets/assets";
import Title from "./Title";

const OurBrands = () => {
  return (
    <>
    {/* Title */}
      <div className="text-center text-3xl py-8">
        <Title text1="OUR" text2="BRANDS" />
      </div>

    <section className="max-w-7xl mx-auto px-4 py-10 border border-blue-400 shadow-lg rounded-3xl">

      

      {/* Brand Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        <div className="overflow-hidden rounded-lg shadow">
          <img src={assets.ob_fastrack} alt="Fastrack" className="w-full h-full object-cover" />
        </div>

        <div className="overflow-hidden rounded-lg shadow">
          <img src={assets.ob_rayban} alt="Rayban" className="w-full h-full object-cover" />
        </div>

        <div className="overflow-hidden rounded-lg shadow">
          <img src={assets.ob_velocity} alt="Velocity" className="w-full h-full object-cover" />
        </div>

        <div className="overflow-hidden rounded-lg shadow">
          <img src={assets.ob_kodak} alt="Kodak" className="w-full h-full object-cover" />
        </div>

        <div className="overflow-hidden rounded-lg shadow">
          <img src={assets.ob_nikon} alt="Nikon" className="w-full h-full object-cover" />
        </div>

        <div className="overflow-hidden rounded-lg shadow">
          <img src={assets.ob_zeiss} alt="Zeiss" className="w-full h-full object-cover" />
        </div>

      </div>
    </section>
    </>
  );
};

export default OurBrands;
