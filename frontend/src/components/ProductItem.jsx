import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const ProductItem = ({ id, name, image, price }) => {
  const { currency } = useContext(ShopContext);

  return (
    <Link className="text-blue-800 cursor-pointer" to={`/product/${id}`}>
      <div className="bg-gradient-to-b from-[#f7f8f9] to-[#b1b1fd] shadow-lg flex flex-col items-center justify-end p-6 relative overflow-hidden rounded-3xl">
        {/* Image */}
        <div className="h-56 overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-contain mix-blend-multiply hover:scale-105 transition duration-300"/>
        </div>

        {/* Content */}
        <div className="p-4 text-center">
          <h3 className="text-sm font-semibold text-gray-800">{name}</h3>
          <p className="text-black font-bold mt-1">₹{price}</p>
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;
