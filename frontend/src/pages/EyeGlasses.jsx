import React, { useContext, useEffect, useState, useMemo } from "react";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "../components/ProductItem";
import EgFDd from "../components/EgFDd";
import { useLocation, useNavigate } from "react-router-dom";
import Title from "../components/Title";

const EyeGlasses = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { products, currency, search, showSearch } = useContext(ShopContext);

  const [selectedFilters, setSelectedFilters] = useState({});
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [openFilter, setOpenFilter] = useState(null);
  const [sortType, setSortType] = useState("relavent");
  const [pageTitle, setPageTitle] = useState("All Eyeglasses");

  // 1. Filter only Eyeglass category
  const eyeglassesProducts = useMemo(() => {
    return products.filter((item) => item.category === "EYE_GLASS");
  }, [products]);

  // 2. Sync URL Parameters to State (For Mega-Dropdown support)
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const params = ["gender", "shape", "style", "material", "brand"];
    const newFilters = {};
    let title = "All Eyeglasses";

    params.forEach((param) => {
      const value = query.get(param);
      if (value && value !== "All") {
        newFilters[param] = [value];
        title = `${value} Eyeglasses`;
      }
    });

    setSelectedFilters(newFilters);
    setPageTitle(title);
  }, [location.search]);

  // 3. Main Filter & Sort Logic
useEffect(() => {
  let filtered = [...eyeglassesProducts];

  Object.keys(selectedFilters).forEach((key) => {
    const filterValues = selectedFilters[key];
    
    if (filterValues && filterValues.length > 0) {
      filtered = filtered.filter((item) => {
        // 1. Get value from top level OR specifications OR metadata
        const rawValue = item[key] || item.specifications?.[key] || item.metadata?.[key] || "";
        
        // 2. Normalize product value: "Men" -> "men"
        const itemValue = rawValue.toString().toLowerCase().trim();

        return filterValues.some((val) => {
          // 3. Normalize filter value: "MEN" -> "men"
          const targetValue = val.toString().toLowerCase().trim();

          // 4. SMART MATCHING
          if (key === "gender") {
            // Split "Men & Women" into ["men", "women"]
            const words = itemValue.split(/[\s&/_]+/);
            // Returns true if exact word "men" is found OR if product is "unisex"
            return words.includes(targetValue) || itemValue === "unisex";
          }

          // For Shape, Style, Brand, etc., keep strict equality
          return itemValue === targetValue;
        });
      });
    }
  });

  // Apply Search Bar Logic
  if (showSearch && search?.trim()) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(
      (item) =>
        item.name?.toLowerCase().includes(searchLower) ||
        item.brand?.toLowerCase().includes(searchLower)
    );
  }

  // Apply Sorting
  if (sortType === "low-high") filtered.sort((a, b) => a.price - b.price);
  if (sortType === "high-low") filtered.sort((a, b) => b.price - a.price);

  setFilteredProducts(filtered);
}, [selectedFilters, eyeglassesProducts, sortType, search, showSearch]);

  // 4. Grouping Logic for "No Filter" view
  const shapeOrder = [
    "CATEYE",
    "RECTANGLE",
    "SQUARE",
    "OVAL",
    "ROUNDED",
    "CLUBMASTER",
    "GEOMETRIC",
  ];

  const shapeBannerConfig = {
    CATEYE: { image: assets.banner_eg_5, position: "left" },
    CLUBMASTER: { image: assets.banner_eg_6, position: "right" },
    GEOMETRIC: { image: assets.banner_eg_7, position: "left" },
    SQUARE: { image: assets.banner_eg_2, position: "right" },
    OVAL: { image: assets.banner_eg_4, position: "left" },
    RECTANGLE: { image: assets.banner_eg_3, position: "right" },
    ROUNDED: { image: assets.banner_eg_1, position: "right" },
  };

  const groupByShape = (items) => {
    return items.reduce((acc, product) => {
      const shape = product.specifications?.shape || product.shape || "Others";
      if (!acc[shape]) acc[shape] = [];
      acc[shape].push(product);
      return acc;
    }, {});
  };

  const getTextPositionClass = (pos) => {
    if (pos === "right") return "items-center justify-end text-right pr-8";
    return "items-center justify-start text-left pl-8";
  };

  const isFilterActive =
    Object.values(selectedFilters).some((v) => v?.length > 0) ||
    (showSearch && search?.trim());

  return (
    <div className="bg-white">
      {/* Top Banner */}
      <div className="w-full max-w-[1450px] mx-auto px-4 pt-10">
        <div className="relative h-[160px] sm:h-[200px] lg:h-[250px] rounded-xl overflow-hidden shadow-inner">
          <img
            src={assets.ban_eye}
            alt="Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent flex items-center justify-end pr-10">
            <div className="text-right text-orange-900">
              <h2 className="text-xl md:text-3xl font-bold">Premium Frames</h2>
              <p className="text-2xl">Starting at {currency}800</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1450px] mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-[260px] shrink-0">
            <div className="sticky top-24 space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <p className="text-xl font-bold">FILTERS</p>
                <button
                  onClick={() => {
                    setSelectedFilters({});
                    navigate("/eyeglasses");
                  }}
                  className="text-sm text-blue-600 hover:underline font-medium"
                >
                  Reset All
                </button>
              </div>

              {["gender", "shape", "material", "style", "brand"].map(
                (field) => (
                  <EgFDd
                    key={field}
                    title={field.charAt(0) + field.slice(1)}
                    field={field}
                    products={eyeglassesProducts}
                    selectedFilters={selectedFilters}
                    setSelectedFilters={setSelectedFilters}
                    openFilter={openFilter}
                    setOpenFilter={setOpenFilter}
                  />
                ),
              )}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-8">
              <Title
                text1={pageTitle.split(" ")[0]}
                text2={pageTitle.split(" ").slice(1).join(" ")}
              />
              <select
                onChange={(e) => setSortType(e.target.value)}
                className="border-2 border-gray-200 text-lg px-4 py-2 rounded-lg outline-none focus:border-blue-400"
              >
                <option value="relavent">Sort by: Relevant</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
              </select>
            </div>

            {/* Grid View (When Filtering) */}
            {isFilterActive ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((item) => (
                  <ProductItem
                    key={item._id}
                    id={item._id}
                    name={item.name}
                    images={item.images}
                    price={item.price}
                    brand={item.brand}
                    description={item.description}
                    gender={item.gender}
                  />
                ))}
              </div>
            ) : (
              /* Grouped View (Default) */
              <div className="space-y-20">
                {(() => {
                  const grouped = groupByShape(eyeglassesProducts);
                  return shapeOrder
                    .filter((shape) => grouped[shape])
                    .map((shape) => {
                      const config = shapeBannerConfig[shape] || {
                        image: assets.banner_default,
                        position: "left",
                      };
                      return (
                        <div key={shape} className="space-y-8">
                          <div className="relative h-[180px] rounded-2xl overflow-hidden group">
                            <img
                              src={config.image}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                              alt={shape}
                            />
                            <div className="absolute inset-0 bg-black/30 flex items-center px-10">
                              <div
                                className={
                                  config.position === "right"
                                    ? "ml-auto text-right"
                                    : "text-left"
                                }
                              >
                                <h2 className="text-white text-3xl font-bold uppercase tracking-widest">
                                  {shape}
                                </h2>
                                <p className="text-white/80">
                                  Expertly Crafted Frames
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {grouped[shape].slice(0, 6).map((item) => (
                              <ProductItem
                                key={item._id}
                                id={item._id}
                                name={item.name}
                                images={item.images}
                                price={item.price}
                                brand={item.brand}
                                description={item.description}
                                gender={item.gender}
                              />
                            ))}
                          </div>
                        </div>
                      );
                    });
                })()}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default EyeGlasses;
