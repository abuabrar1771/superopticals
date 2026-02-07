import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "../components/ProductItem"
import { ChevronDownIcon } from "@heroicons/react/24/solid";

const EyeGlasses = () => {
  const { products } = useContext(ShopContext);
  const [open, setOpen] = useState(false);
  const [selectedShapes, setSelectedShapes] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState(products);
  
  const shapeCounts = products.reduce((acc, item) => {
    acc[item.shape] = (acc[item.shape] || 0) + 1;
    return acc;
  }, {});

  const shapes = Object.keys(shapeCounts);

  // Handle checkbox selection
  const toggleShape = (shape) => {
    let updated = selectedShapes.includes(shape)
      ? selectedShapes.filter((s) => s !== shape)
      : [...selectedShapes, shape];

    setSelectedShapes(updated);

    if (updated.length === 0) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((p) => updated.includes(p.shape));
      setFilteredProducts(filtered);
    }
  };
  return (
    <>
      <p className="px-20 text-3xl">Eyeglasses at Affordable Prices</p>
      <div className="w-full flex justify-center px-4 md:px-0">
        <div className="relative w-full max-w-[1350px] h-[120px] sm:h-[280px] md:h-[380px] lg:h-[420px] rounded-2xl overflow-hidden">
          {/* Banner Image */}

          <img
            src={assets.ban_eye}
            alt="Eyeglasses Banner"
            className="w-full h-full object-cover object-right"
          />

          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>

          {/* Text Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="px-6 sm:px-10 max-w-md text-white">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
                Frames
              </h2>
              <p className="mt-2 text-lg sm:text-xl">Starting at ₹800</p>
            </div>
          </div>
        </div>
      </div>
      <div className=" ">
        <p className="px-24 font-bold text-3xl mt-2">Eyeglasses</p>
        <p className="px-32 italic mb-4">
          Eyeglasses that blend style and comfort for every face.
        </p>
      </div>

      <div className="w-full flex justify-center pt-10 border-t">
        <div className="w-full max-w-[1350px] px-4 md:px-0 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
          {/* Filter Options */}
          <div className="w-full sm:w-60">
            <p className="text-xl font-medium flex items-center gap-2 cursor-pointer">
              FILTERS
            </p>
            <div className="flex justify-between cursor-pointer mt-4" 
                 onClick={() => setOpen(!open)}>
                  <h3 className="font-semibold">Frame Shape</h3>
                  <ChevronDownIcon className={`${open ? "rotate-180" : ""} w-4 h-4`} />
            </div>

            {/* Dropdown */}
              {open && (
              <div className="mt-3 space-y-2">
                  {shapes.map((shape) => (
                  <div key={shape} className="flex justify-between">
                      <label className="flex gap-2">
                        <input type="checkbox" onChange={() => toggleShape(shape)}/>
                        {shape}
                      </label>
                      <span>({shapeCounts[shape]})</span>
                   </div>
                  ))}
                </div>
                )}
          </div>
      </div>
      </div>
    </>
  );
};

export default EyeGlasses;
