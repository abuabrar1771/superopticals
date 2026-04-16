import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const RelatedProducts = ({ category, shape }) => {
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      let productCopy = products.slice();

      // 1. Filter by Category
      productCopy = productCopy.filter((item) => item.category === category);

      // 2. Filter by Shape (DIG INTO SPECIFICATIONS)
      // Check both top-level and specifications for maximum compatibility
      if (shape) {
        productCopy = productCopy.filter(
          (item) =>
            item.specifications?.shape === shape || item.shape === shape,
        );
      }

      // 3. Limit to 4 products and set state
      setRelated(productCopy.slice(0, 4));
    }
    // Added [category, shape, products] to dependencies so it updates when product changes
  }, [products, category, shape]);

  return (
    <div className="mt-12 mb-2">
      {" "}
      {/* Changed my-8 to mt-12 mb-8 for better section separation */}
      <div className="text-center text-2xl mb-1">
        {" "}
        {/* Reduced text size slightly and replaced py-2 with mb-4 */}
        <Title text1={"RELATED"} text2={"PRODUCTS"} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
        {related.length > 0 ? (
          related.map((item, index) => (
            <ProductItem
              key={index}
              id={item._id}
              name={item.name}
              price={item.price}
              images={item.images}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-400 text-sm">
            No related products found.
          </p>
        )}
      </div>
    </div>
  );
};

export default RelatedProducts;
