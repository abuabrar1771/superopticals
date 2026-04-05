import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const ProductItem = ({ id, name, image, price, description, brand }) => {
  const { currency } = useContext(ShopContext);

  return (
    <Link className="text-blue-800 cursor-pointer" to={`/product/${id}`}>
      <div className="px-4">
        
        <div
          className="w-full max-w-md p-[12px] 
                     bg-gradient-to-r from-[#c8a27a] via-[#fff3e0] to-[#c8a27a] 
                     "
          style={{
            borderTopLeftRadius: "70% 120px",
            borderTopRightRadius: "70% 120px",
          }}
        >
          {/* Inner Card */}
         <div
            className="h-[320px] flex flex-col bg-gray-400 overflow-hidden"
            style={{
              borderTopLeftRadius: "70% 120px",
              borderTopRightRadius: "70% 120px",
            }}
          >
            <div className="h-40 flex-shrink-0 overflow-hidden">
              <img
                src={image[0]}
                alt={name}
                className="w-full h-full bg-white object-contain mix-blend-multiply hover:scale-105 transition duration-300"
              />
            </div>

            {/* 📦 Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-4 pb-8 py-4 text-center">

              <h3 className="text-sm font-semibold text-gray-800">
                {brand}
              </h3>

              <h3 className="text-sm font-semibold text-gray-800">
                {name}
              </h3>

              {/* ❗ VERY IMPORTANT */}
              <p className="text-xs text-gray-700 mt-1 break-words">
                {description}
              </p>

              <p className="text-black font-bold mt-2">
                {currency}{price}
              </p>

            </div>
            </div>
          </div>
        </div>
    </Link>
  );
};

export default ProductItem;
