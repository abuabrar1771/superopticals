import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [bestseller, setBestSeller] = useState([]);

  useEffect(() => {
    const bestProduct = products.filter((item) => item.bestseller);
    setBestSeller(bestProduct.slice(0, 10));
  }, [products]);
  return (
    <>
      <div className="text-center text-3xl py-8">
        <Title text1={"BEST"} text2={"SELLERS"} />
        <p className="w-3/4 m-auto text-sm sm:text-md md:text-base text-blue-600 ">
          Explore our top-selling frames crafted with precision and elegance.
          Designed to deliver superior comfort and unmatched style for every
          occasion.
        </p>
      </div>
      {/* PRODUCTS */}
     <section className="max-w-7xl mx-auto px-4 py-10 border border-blue-400 shadow-lg rounded-3xl">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">

          {bestseller.map((item) => (
            <ProductItem
              key={item._id}       // ✅ Correct key usage
              name={item.name}
              image={item.image}
              price={item.price}
            />
          ))}

        </div>
      </section>
    </>
  );
};

export default BestSeller;
