import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { Heart, Share2 } from "lucide-react";

// Use 'images' (plural) to match your new JSON key
const ProductItem = ({
  id,
  name,
  images,
  price,
  description,
  brand,
  gender,
}) => {
  const { currency } = useContext(ShopContext);

  return (
    <div className="relative group border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <Link className="text-blue-800 cursor-pointer" to={`/product/${id}`}>
        <div className="h-[320px] flex flex-col overflow-hidden">
          {/* Image Section */}
          <div className="h-[140px] sm:h-[160px] md:h-[180px] bg-white flex items-center justify-center overflow-hidden relative mt-6 group">
            <div className="absolute top-2 right-2 z-10 flex flex-row gap-2 transition-opacity duration-300 opacity-100 md:opacity-0 md:group-hover:opacity-100">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white hover:text-red-500 transition-colors"
              >
                <Heart size={20} />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white hover:text-blue-500 transition-colors"
              >
                <Share2 size={20} />
              </button>
            </div>

            {/* 📍 FIX: Added optional chaining and a fallback placeholder */}
            <img
              src={
                images && images.length > 0
                  ? images[0]
                  : "https://via.placeholder.com/300"
              }
              alt={name}
              className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {/* Content Section */}
          <div className="flex-1 overflow-y-auto px-4 pb-8 py-4 text-center bg-white border-t border-gray-50">
            <h3 className="text-xs uppercase tracking-wider text-gray-400 font-bold">
              {brand || "Brand"}
            </h3>
            <h3 className="text-sm font-semibold text-gray-800 line-clamp-1">
              {name}
            </h3>
            <p className="text-xs text-gray-600 mt-1 break-words line-clamp-2">
              {gender}
            </p>
            <p className="text-xs text-gray-600 mt-1 break-words line-clamp-2">
              {description}
            </p>

            <p className="text-black font-bold mt-2">
              {currency}
              {price}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductItem;
