import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "../components/ProductItem";
import SgFDd from "../components/SgFDd";
import { useMemo } from "react";
import Title from "../components/Title";
import { useLocation, useNavigate } from "react-router-dom";

const SunGlasses = () => {
 const location = useLocation();
  const { products, currency, search, showSearch  } = useContext(ShopContext);
  
  const [selectedFilters, setSelectedFilters] = useState({});
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [openFilter, setOpenFilter] = useState(null);
  const [sortType, setSortType] = useState("relavent");

  // 1. Get ONLY Sunglasses from Context
  const sunglassesProducts = useMemo(() => {
    return products.filter((item) => item.category === "SUN_GLASS");
  }, [products]);

  // 2. Sync URL (Mega Dropdown) to State
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const newFilters = {};
    
    ["gender", "shape", "style", "brand"].forEach((key) => {
      const val = query.get(key);
      if (val) newFilters[key] = [val];
    });

    setSelectedFilters(newFilters);
  }, [location.search]);
  // Apply Search Bar Logic
    if (showSearch && search?.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name?.toLowerCase().includes(searchLower) ||
          item.brand?.toLowerCase().includes(searchLower) ||
          item.description?.toLowerCase().includes(searchLower) ||
          item.specifications?.shape?.toLowerCase().includes(searchLower),
      );
    }

 useEffect(() => {
  // 1. Start with the correct category (Match your database string exactly)
  // For Eyeglasses: "EYE_GLASS", For Sunglasses: "SUN_GLASSES"
  let filtered = products.filter((item) => item.category === "SUN_GLASS"); 

  // 2. Main Filtering Loop
  Object.keys(selectedFilters).forEach((key) => {
    const filterValues = selectedFilters[key];

    // If a filter is selected and it isn't "All"
    if (filterValues && filterValues.length > 0 && !filterValues.includes("All")) {
      filtered = filtered.filter((item) => {
        
        // 🔹 FIX: Look in all 3 possible places (Top Level, Specs, Metadata)
        const rawValue = 
          item[key] || 
          item.specifications?.[key] || 
          item.metadata?.[key] || 
          "";

        const itemValue = rawValue.toString().toLowerCase().trim();

        // 🔹 Check if this product matches ANY of the selected checkboxes
        return filterValues.some((val) => {
          const targetValue = val.toString().toLowerCase().trim();

          if (key === "gender") {
            // ✅ SPLIT MATCH: Handles "Men & Women", "Men/Women"
            const words = itemValue.split(/[\s&/_]+/); 
            return words.includes(targetValue) || itemValue === "unisex";
          }

          // ✅ STRICT MATCH: For Shape, Style, etc.
          return itemValue === targetValue;
        });
      });
    }
  });

  // 3. Search Bar
  if (showSearch && search?.trim()) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(
      (item) =>
        item.name?.toLowerCase().includes(searchLower) ||
        item.brand?.toLowerCase().includes(searchLower)
    );
  }

  // 4. Sort
  if (sortType === "low-high") filtered.sort((a, b) => a.price - b.price);
  if (sortType === "high-low") filtered.sort((a, b) => b.price - a.price);

  setFilteredProducts(filtered);
}, [selectedFilters, products, sortType, search, showSearch]);

const isFilterActive =
    Object.values(selectedFilters).some((v) => v?.length > 0) ||
    (showSearch && search?.trim());
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
        {/* <div className="relative w-full rounded-xl overflow-hidden"> */}
        {/* <div className="relative w-full aspect-[6/1] rounded-xl overflow-hidden"> */}
        {/* <div className="relative h-[160px] sm:h-[200px] lg:h-[250px] rounded-xl overflow-hidden"> */}
        {/* <div className="relative h-[160px] sm:h-[200px] lg:h-[250px] rounded-xl overflow-hidden"> */}
        <div className="relative h-[120px] sm:h-[150px] md:h-[180px] lg:h-[250px] rounded-xl overflow-hidden">
          <img
            src={assets.sg_banner_3}
            alt="Sunglasses Banner"
            className="w-full h-full object-center"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

          <div className="absolute inset-0 flex items-center justify-end sm:justify-end text-black sm:pr-8">
            <div className="text-center sm:text-right">
              <h2 className="text-2xl sm:text-sm md:text-xl font-semibold">
                Sun Glasses
              </h2>
              <p className="text-sm sm:text-lg md:text-xl px-5">
                Starting at ₹2800
              </p>
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
            {isFilterActive && (
              <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 gap-y-6">
                {filteredProducts.map((item) => (
                  <div key={item._id}>
                    <ProductItem
                      id={item._id}
                      name={item.name}
                      images={item.images}
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
                 <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 gap-y-6">
                        {sunglassesProducts.map((item) => (
                          <div key={item._id}>
                            <ProductItem
                              id={item._id}
                              name={item.name}
                              images={item.images}
                              description={item.description}
                              price={item.price}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                )}
          </main>
        </div>
      </div>
    </>
  );
};

export default SunGlasses;
