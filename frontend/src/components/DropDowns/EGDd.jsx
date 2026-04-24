import React from "react";
import { assets } from "../../assets/assets";
import { Link, NavLink } from "react-router-dom";

const EGDd = () => {
  return (
    <div className="bg-[#e7edeb] rounded-3xl shadow-2xl">
      <div className="max-w-[1400px] mx-auto px-16 py-10 mt-6">
        <div className="grid grid-cols-[120px_120px_120px_220px_1fr] gap-x-12 ">
          {/* COLUMN 1 */}
          <div>
            <h3 className="font-semibold mb-3">GENDER</h3>
            {["All", "Men", "Women", "Kids"].map((i) => (
              <Link
                key={i}
                to={`/eyeglasses?gender=${i}`}
                className="group block py-1 text-sm text-gray-600 hover:text-black"
              >
                <span className="relative inline-block after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full">
                  {i}
                </span>
              </Link>
            ))}
          </div>
          {/* COLUMN 2 */}
          <div>
            <h3 className="font-semibold mb-3">SHAPE</h3>
            {[
              { label: "Rectangle", value: "RECTANGLE" },
              { label: "Round", value: "ROUNDED" },
              { label: "CatEye", value: "CATEYE" },
              { label: "Geometric", value: "GEOMETRIC" },
              { label: "Wayfarer", value: "WAYFARER" },
            ].map((item) => (
              <Link
                key={item.value}
                to={`/eyeglasses?shape=${item.value}`}
                className="block text-sm text-gray-600 hover:text-black py-1"
              >
                <span className="relative inline-block after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full">
                  {item.label}
                </span>
              </Link>
            ))}

            <h3 className="font-semibold mt-6 mb-3">STYLE</h3>
            {[
              { label: "Rimmed", value: "RIMMED" },
              { label: "Semi-Rimmed", value: "SEMI-RIMMED" },
              { label: "Rimless", value: "RIMLESS" },
            ].map((item) => (
              <Link
                key={item.value}
                to={`/eyeglasses?style=${item.value}`}
                className="block text-sm text-gray-600 hover:text-black py-1"
              >
                <span className="relative inline-block after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>

          {/* COLUMN 3 */}
          <div>
            <h3 className="font-semibold mb-3">TOP BRANDS</h3>
            {[
              { label: "Oakley", value:"OAKLEY"},
              { label: "Fastrack", value: "FASTRACK"},
              { label: "Rayban", value: "RAYBAN"},
              { label: "ZEISS", value: "ZEISS"},].map((item) => (
              <Link
                key={item.value}
                to={`/eyeglasses?brand=${item.value}`}
                className="block text-sm text-gray-600 hover:text-black py-1"
              >
                <span className="relative inline-block after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>

          {/* COLUMN 4 */}
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
                <span className="relative inline-block after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full">
                  {i}
                </span>
              </Link>
            ))}
          </div>

          {/* IMAGE */}
          <div className="flex justify-end">
            <div className="w-[630px] h-[320px] rounded-3xl overflow-hidden">
              <img
                src={assets.egdd}
                className="w-full h-full object-cover"
                alt="Eyeglasses"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EGDd;
