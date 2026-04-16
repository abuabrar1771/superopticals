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

  // Filter by category based on your data: UV_GLASS
  const uvglassesProducts = useMemo(() => {
    return products.filter((item) => item.category === "UV_GLASS");
  }, [products]);

  // ✅ UPDATED FILTER LOGIC FOR NESTED DATA
  useEffect(() => {
    let filtered = [...uvglassesProducts];

    Object.keys(selectedFilters).forEach((key) => {
      if (selectedFilters[key]?.length > 0) {
        filtered = filtered.filter((item) => {
          // 🔹 HELPER: Check top level, then specifications, then metadata
          const itemValue = item[key] || item.specifications?.[key] || item.metadata?.[key];
          
          return selectedFilters[key].some(
            (filterValue) => itemValue?.toString().toUpperCase() === filterValue.toUpperCase()
          );
        });
      }
    });

    // Apply Search
    if (search?.trim() !== "") {
      filtered = filtered.filter((item) =>
        (item.name + item.brand + item.description)
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    // Sort - copy array first to avoid mutating state directly
    let sortedProducts = [...filtered];
    if (sortType === "low-high") {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sortType === "high-low") {
      sortedProducts.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(sortedProducts);
  }, [selectedFilters, uvglassesProducts, sortType, search]);

  const isFilterActive = Object.values(selectedFilters).some(
    (value) => value && value.length > 0
  );

  // ✅ GROUP BY SHAPE (Updated for nested data)
  const groupByShape = (items) => {
    return items.reduce((acc, product) => {
      const shape = product.specifications?.shape || product.shape || "Others";
      if (!acc[shape]) acc[shape] = [];
      acc[shape].push(product);
      return acc;
    }, {});
  };

  return (
    <>
      {/* PAGE HEADER */}
      <div>
        <p className="lg:ml-6 lg:px-20 mt-5 lg:text-3xl sm:text-xl font-medium">
          Computer Glasses at Affordable Prices
        </p>
      </div>

      {/* HERO BANNER */}
      <div className="w-full max-w-[1450px] mx-auto px-4 my-10">
        <div className="relative h-[120px] sm:h-[150px] md:h-[180px] lg:h-[250px] rounded-xl overflow-hidden shadow-lg">
          <img
            src={assets.cg_banner_1}
            alt="Computer Glasses Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
            <h2 className="text-sm md:text-2xl font-bold text-white drop-shadow-md">
              Computer UV Glasses
            </h2>
            <p className="text-xs md:text-lg text-white font-medium">
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
            <div className="flex justify-between items-center mt-8 mb-4">
              <p className="text-xl font-semibold">FILTERS</p>
              <button
                onClick={() => setSelectedFilters({})}
                className="text-sm text-green-600 font-bold hover:underline"
              >
                Reset
              </button>
            </div>

            <CgFDd title="Gender" field="gender" products={uvglassesProducts} selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters} openFilter={openFilter} setOpenFilter={setOpenFilter} />
            <CgFDd title="Frame Shape" field="shape" products={uvglassesProducts} selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters} openFilter={openFilter} setOpenFilter={setOpenFilter} />
            <CgFDd title="Material" field="material" products={uvglassesProducts} selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters} openFilter={openFilter} setOpenFilter={setOpenFilter} />
            <CgFDd title="Frame Style" field="style" products={uvglassesProducts} selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters} openFilter={openFilter} setOpenFilter={setOpenFilter} />
          </aside>

          {/* PRODUCTS AREA */}
          <main className="w-full mt-6 lg:mt-0 self-start">
            <div className="z-10 bg-white flex justify-between items-center mb-6 py-2 border-b">
              <Title text1={"ALL"} text2={"COLLECTIONS"} />
              <select
                onChange={(e) => setSortType(e.target.value)}
                className="border border-gray-300 text-sm px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
              >
                <option value="relavent">Sort by Relevant</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
              </select>
            </div>

            {isFilterActive || isSearchActive ? (
              filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 gap-y-10">
                  {filteredProducts.map((item) => (
                    <ProductItem key={item._id} id={item._id} name={item.name} images={item.images} description={item.description} price={item.price} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center mt-20 text-gray-500">
                  <p className="text-xl font-semibold">No products match your criteria</p>
                  <p className="text-sm">Try clearing some filters</p>
                </div>
              )
            ) : (
              <div className="space-y-20">
                {Object.entries(groupByShape(uvglassesProducts)).map(([category, items]) => (
                  <div key={category}>
                    <h2 className="text-2xl font-bold mb-6 capitalize border-l-4 border-gray-800 pl-3">
                      {category.toLowerCase()} Frames
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 gap-y-10">
                      {items.map((item) => (
                        <ProductItem key={item._id} id={item._id} name={item.name} images={item.images} description={item.description} price={item.price} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default ComputerGlasses;
