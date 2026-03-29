import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "../components/ProductItem";
import CgFDd from "../components/CGFDd.jsx";
import { useMemo } from "react";

import Title from "../components/Title";

const ComputerGlasses = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [sortType, setSortType] = useState("relavent");

  const [selectedFilters, setSelectedFilters] = useState({});
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [openFilter, setOpenFilter] = useState(null);

  const isSearchActive = showSearch && search?.trim() !== "";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const uvglassesProducts = useMemo(() => {
    return products.filter((item) => item.category === "UV GLASS");
  }, [products]);

  // ✅ STEP 2 — APPLY SELECTED FILTERS
  useEffect(() => {
    let filtered = uvglassesProducts;

    Object.keys(selectedFilters).forEach((key) => {
      if (selectedFilters[key]?.length > 0) {
        filtered = filtered.filter((item) =>
          selectedFilters[key].some(
            (value) => item[key]?.toUpperCase() === value.toUpperCase(),
          ),
        );
      }
    });
    //APPLY SEARCH
    if (search?.trim() !== "") {
      filtered = filtered.filter((item) =>
        (item.name + item.brand + item.description)
          .toLowerCase()
          .includes(search.toLowerCase()),
      );
    }

    if (sortType === "low-high") {
      filtered = filtered.sort((a, b) => a.price - b.price);
    }

    if (sortType === "high-low") {
      filtered = filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts([...filtered]);
  }, [selectedFilters, uvglassesProducts, sortType, search]);

  const isFilterActive = Object.values(selectedFilters).some(
    (value) => value && value.length > 0,
  );

  // ✅ GROUP ONLY SHAPE
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
          Computer Glasses at Affordable Prices
        </p>
      </div>

      {/* HERO BANNER */}
      <div className="w-full max-w-[1450px] mx-auto px-4 my-10">
        <div className="relative h-[120px] sm:h-[150px] md:h-[180px] lg:h-[250px] rounded-xl overflow-hidden">
          <img
            src={assets.cg_banner_1}
            alt="Contact Lens Banner"
            className="w-full h-full object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-center">
            <h2 className="text-[10px] sm:text-xs md:text-sm lg:text-2xl font-semibold text-blue-800">
              Computer UV Glasses
            </h2>

            <p className="text-[9px] sm:text-[10px] md:text-xs lg:text-lg text-blue-800">
              Starting at ₹1500
            </p>
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
            <CgFDd
              title="Gender"
              field="gender"
              products={uvglassesProducts}
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
              openFilter={openFilter}
              setOpenFilter={setOpenFilter}
            />

            <CgFDd
              title="Frame Shape"
              field="shape"
              products={uvglassesProducts}
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
              openFilter={openFilter}
              setOpenFilter={setOpenFilter}
            />

            <CgFDd
              title="Material"
              field="material"
              products={uvglassesProducts}
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
              openFilter={openFilter}
              setOpenFilter={setOpenFilter}
            />

            <CgFDd
              title="Frame Style"
              field="style"
              products={uvglassesProducts}
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
              openFilter={openFilter}
              setOpenFilter={setOpenFilter}
            />
          </aside>

          {/* PRODUCTS AREA */}
          <main className="w-full mt-6 lg:mt-0 self-start">
            <div className="z-50 bg-white flex justify-between items-center text-base sm:text-2xl mb-6 py-2">
              <Title text1={"ALL"} text2={"COLLECTIONS"} />

              <select
                onChange={(e) => setSortType(e.target.value)}
                className="border-2 border-gray-300 text-sm px-2 py-1 rounded"
              >
                <option value="relavent">Sort by Relevant</option>
                <option value="low-high">Sort by Low to High</option>
                <option value="high-low">Sort by High to Low</option>
              </select>
            </div>
            {/* WHEN FILTER ACTIVE */}
            {isFilterActive || isSearchActive ? (
              // 🔹 FILTER / SEARCH VIEW
              filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 gap-y-6">
                  {filteredProducts.map((item) => (
                    <div key={item._id}>
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
              ) : (
                // NO RESULTS
                <div className="flex flex-col items-center justify-center mt-16 text-gray-500">
                  <p className="text-lg font-medium">No products found</p>
                  <p className="text-sm">Try changing filters or search</p>
                </div>
              )
            ) : (
              //  DEFAULT GROUPED VIEW
              <div className="space-y-16">
                {Object.entries(groupByShape(uvglassesProducts)).map(
                  ([category, items]) => (
                    <div key={category}>
                      {/* OPTIONAL CATEGORY TITLE */}
                      <h2 className="text-xl font-semibold mb-4 capitalize">
                        {category.replace("_", " ").toLowerCase()}
                      </h2>

                      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 gap-y-6">
                        {items.map((item) => (
                          <div key={item._id}>
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

export default ComputerGlasses;
