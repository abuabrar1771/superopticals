import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const LatestCollections = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setlatestProducts]  = useState([]);

  useEffect(() => {
    setlatestProducts(products.slice(0, 10));
  }, [products]);

  return (
    <>
    {/* <div className="my-10"> */}
      <div className="py-8 text-center text-3xl">
        <Title text1={"LATEST"} text2={"COLLECTIONS"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-blue-800">
          Explore the latest trends in eyewear with our newest collection.
          Designed to match your personality and lifestyle, these frames offer
          comfort, clarity, and elegance in every look.
        </p>
      </div>
      <section className="max-w-7xl mx-auto px-4 py-10 border border-blue-400 shadow-lg rounded-3xl">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {
        latestProducts.map((items, index) => (
          <ProductItem
            key={index}
            id={items._id}
            name={items.name}
            image={items.image}
            price={items.price}
          />
        ))
        }
      </div>
      </section>
    {/* </div> */}
    
    </>
  );
};

export default LatestCollections;
