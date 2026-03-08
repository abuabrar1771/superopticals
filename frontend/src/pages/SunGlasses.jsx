import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "../components/ProductItem";
import SgFDd from "../components/SgFDd";
import { useMemo } from "react";

const SunGlasses = () => {
  const { products } = useContext(ShopContext);

  const [selectedFilters, setSelectedFilters] = useState({});
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [openFilter, setOpenFilter] = useState(null);

 useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const sunglassesProducts = useMemo(() => {
    return products.filter((item) => item.category === "SUN GLASS");
  }, [products]);

  // ✅ STEP 2 — APPLY SELECTED FILTERS
  useEffect(() => {
    let filtered = sunglassesProducts;

    Object.keys(selectedFilters).forEach((key) => {
      if (selectedFilters[key]?.length > 0) {
        filtered = filtered.filter((item) =>
          selectedFilters[key].includes(item[key]),
        );
      }
    });

    setFilteredProducts(filtered);
  }, [selectedFilters, sunglassesProducts]);

  const isFilterActive = Object.values(selectedFilters).some(
    (value) => value && value.length > 0,
  );

  // ✅ GROUP ONLY SUNGLASSES
  const groupByShape = (items) => {
    return items.reduce((acc, product) => {
      const shape = product.shape || "Others";
      if (!acc[shape]) acc[shape] = [];
      acc[shape].push(product);
      return acc;
    }, {});
  };

  return (
    <>
      {/* PAGE HEADER */}
      <div>
        <p className="lg:ml-6 lg:px-20 mt-5 lg:text-3xl sm:text-xl">
          Premium Sunglasses for Every Style
        </p>
      </div>

      {/* HERO BANNER */}
      <div className="w-full max-w-[1450px] mx-auto px-4 my-10">
        <div className="relative h-[160px] sm:h-[200px] lg:h-[250px] rounded-xl overflow-hidden">
          <img
            src={assets.sg_banner}
            alt="Sunglasses Banner"
            className="w-full h-full object-cover"
          />

         <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

          <div className="absolute inset-0 flex items-center justify-end sm:justify-end text-orange-800 sm:pr-8">
            <div className="text-center sm:text-right">
              <h2 className="text-2xl sm:text-sm md:text-xl font-semibold">Sun Glasses</h2>
              <p className="text-sm sm:text-lg md:text-xl px-5">Starting at ₹2800</p>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN SECTION */}
      <div className="w-full flex justify-center pt-10 border-t">
        <div className="w-full max-w-[1450px] px-4 md:px-0 flex flex-col lg:flex-row gap-6 lg:gap-10">
          {/* FILTER SIDEBAR */}
          <aside className="w-full lg:w-[260px] lg:sticky lg:top-24 h-fit">
            <p className="text-xl font-medium flex justify-between mt-8">
              FILTERS
              <button
                onClick={() => setSelectedFilters({})}
                className="text-sm text-green-400 font-bold"
              >
                Reset
              </button>
            </p>

            {/* PASS SUNGLASSES PRODUCTS */}
            <SgFDd
              title="Gender"
              field="gender"
              products={sunglassesProducts}
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
              openFilter={openFilter}
              setOpenFilter={setOpenFilter}
            />

            <SgFDd
              title="Frame Shape"
              field="shape"
              products={sunglassesProducts}
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
              openFilter={openFilter}
              setOpenFilter={setOpenFilter}
            />

            <SgFDd
              title="Material"
              field="material"
              products={sunglassesProducts}
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
              openFilter={openFilter}
              setOpenFilter={setOpenFilter}
            />

            <SgFDd
              title="Frame Style"
              field="style"
              products={sunglassesProducts}
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
              openFilter={openFilter}
              setOpenFilter={setOpenFilter}
            />
          </aside>

          {/* PRODUCTS AREA */}
          <main className="w-full mt-6 lg:mt-0">
            {/* WHEN FILTER ACTIVE */}
            {isFilterActive && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map((item) => (
                  <div key={item._id} className="border rounded-xl p-4">
                    <ProductItem
                      id={item._id}
                      name={item.name}
                      image={item.image}
                      description={item.description}
                      price={item.price}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* WHEN NO FILTER → GROUP BY SHAPE */}
            {!isFilterActive && (
              <div className="space-y-16">
                {Object.entries(groupByShape(sunglassesProducts)).map(
                  ([shape, items]) => (
                    <div key={shape}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {items.map((item) => (
                          <div key={item._id} className="border rounded-xl p-4">
                            <ProductItem
                              id={item._id}
                              name={item.name}
                              image={item.image}
                              description={item.description}
                              price={item.price}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default SunGlasses;
