import React from "react";
import { assets } from "../../assets/assets";
import { Link, NavLink } from "react-router-dom";

const EGDd = () => {
  return (
    <div className="bg-[#e7edeb] rounded-3xl shadow-2xl">
      <div className="max-w-[1400px] mx-auto px-16 py-10">
        <div className="grid grid-cols-[120px_120px_120px_220px_1fr] gap-x-12 ">
          {/* COLUMN 1 */}
          <div>
            <h3 className="font-semibold mb-3">GENDER</h3>
            {["All", "Men", "Women", "Kids"].map((i) => (
              <Link
                key={i}
                className="block text-sm text-gray-600 hover:text-black py-1"
              >
                {i}
              </Link>
            ))}
            {/* <p>All</p>
            <p>Men</p>
            <p>Women</p>
            <p>Kids</p> */}

            <h3 className="font-semibold mt-6 mb-3">USAGE</h3>
            {["Regular", "Power"].map((i) => (
              <Link
                key={i}
                className="block text-sm text-gray-600 hover:text-black py-1"
              >
                {i}
              </Link>
            ))}
          </div>

          {/* COLUMN 2 */}
          <div>
            <h3 className="font-semibold mb-3">SHAPE</h3>
            {["Rectangle", "Round", "CatEye", "Aviatar","Wraparound", "Wayfarer"].map(
              (i) => (
                <Link
                  key={i}
                  className="block text-sm text-gray-600 hover:text-black py-1"
                >
                  {i}
                </Link>
              ),
            )}

            <h3 className="font-semibold mt-6 mb-3">STYLE</h3>
            {["Mirrored", "Tinted", "UV Protection", "Polarized"].map((i) => (
              <Link
                key={i}
                className="block text-sm text-gray-600 hover:text-black py-1"
              >
                {i}
              </Link>
            ))}
          </div>

          {/* COLUMN 3 */}
          <div>
            <h3 className="font-semibold mb-3">TOP BRANDS</h3>
            {[
              "Ray Ban",
              "Fastrack",
              "Velocity",
              "Muller",
              "Aristo",
              "Okaley",
            ].map((i) => (
              <Link
                key={i}
                className="block text-sm text-gray-600 hover:text-black py-1"
              >
                {i}
              </Link>
            ))}
          </div>

          {/* COLUMN 4 */}
          <div>
            <h3 className="font-semibold ">FEATURED BRANDS</h3>
            {[
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
          </div>

          {/* IMAGE */}
          <div className="flex justify-end">
            <div className="w-[520px] h-[380px] rounded-3xl overflow-hidden">
              <img
                src={assets.sgdd}
                className="w-full h-full object-cover"
                alt="Sunglasses"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EGDd;
