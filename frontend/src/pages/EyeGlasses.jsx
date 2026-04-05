import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "../components/ProductItem";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import EgFDd from "../components/EgFDd";
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Title from "../components/Title";

const EyeGlasses = () => {
 const navigate = useNavigate();

useEffect(() => {
  if (location.search) {
    navigate("/eyeglasses", { replace: true });
  }
}, []);
  const location = useLocation();
  const { products } = useContext(ShopContext);
  const [selectedFilters, setSelectedFilters] = useState({});
  // const [filteredProducts, setFilteredProducts] = useState(products);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [openFilter, setOpenFilter] = useState(null);
  const [sortType, setSortType] = useState("relavent");
  const { search, showSearch } = useContext(ShopContext);

  const isSearchActive = showSearch && search?.trim() !== "";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const eyeglassesProducts = useMemo(() => {
    return products.filter((item) => item.category === "EYE GLASS");
  }, [products]);
  // ....................MENU ITEM PRODUCTS SHOW <<<<<<<<<<<<<<<<<<<<<
  useEffect(() => {
    const query = new URLSearchParams(location.search);

    const gender = query.get("gender");
    const shape = query.get("shape");
    const style = query.get("style");
    const material = query.get("material");
    const brand = query.get("brand");

    const newFilters = {};

    if (gender && gender !== "All") newFilters.gender = [gender];
    if (shape) newFilters.shape = [shape];
    if (style) newFilters.style = [style];
    if (material) newFilters.material = [material];
    if (brand) newFilters.brand = [brand];

    if (Object.keys(newFilters).length > 0) {
      setSelectedFilters((prev) =>
        JSON.stringify(prev) === JSON.stringify(newFilters) ? prev : newFilters,
      );
    }
  }, [location.search]);
  // ....................MENU ITEM PRODUCTS SHOW END <<<<<<<<<<<<<<<<<<<<<
  useEffect(() => {
    let filtered = eyeglassesProducts;

    Object.keys(selectedFilters).forEach((key) => {
      if (selectedFilters[key]?.length > 0) {
        filtered = filtered.filter((item) =>
          selectedFilters[key].some((value) => {
            if (key === "gender") {
              // return item.gender === `FOR ${value.toUpperCase()}`;
              return item.gender?.toUpperCase().includes(value.toUpperCase());
            }

            return item[key]?.toUpperCase() === value.toUpperCase();
          }),
        );
      }
    });
    if (sortType === "low-high") {
      filtered = filtered.sort((a, b) => a.price - b.price);
    }

    if (sortType === "high-low") {
      filtered = filtered.sort((a, b) => b.price - a.price);
    }
    //APPLY search bar control to search the product

    if (showSearch && search && search.trim() !== "") {
      filtered = filtered.filter(
        (item) =>
          item.name?.toLowerCase().includes(search.toLowerCase()) ||
          item.brand?.toLowerCase().includes(search.toLowerCase()) ||
          item.shape?.toLowerCase().includes(search.toLowerCase()) ||
          item.description?.toLowerCase().includes(search.toLowerCase()),
      );
    }

    setFilteredProducts([...filtered]);
  }, [selectedFilters, eyeglassesProducts, sortType, search, showSearch]);

  // GROUPING PRODUCTS
  const shapeOrder = [
    "CATEYE",
    "RECTANGLE",
    "SQUARE",
    "OVAL",
    "ROUNDED",
    "CLUBMASTER",
    "GEOMETRIC",
  ];
  const shapeBanners = {
    ROUND: assets.banner_eg_1,
    SQUARE: assets.banner_eg_2,
    RECTANGLE: assets.banner_eg_3,
    OVAL: assets.banner_eg_4,
    CATEYE: assets.banner_eg_5,
    CLUBMASTER: assets.banner_eg_6,
    GEOMETRIC: assets.banner_eg_7,
    ROUNDED: assets.banner_eg_8,
  };
  const shapeBannerConfig = {
    CATEYE: {
      image: assets.banner_eg_5,
      position: "left",
    },
    CLUBMASTER: {
      image: assets.banner_eg_6,
      position: "right",
    },
    GEOMETRIC: {
      image: assets.banner_eg_7,
      position: "left",
    },
    SQUARE: {
      image: assets.banner_eg_2,
      position: "right",
    },
    OVAL: {
      image: assets.banner_eg_4,
      position: "left",
    },
    RECTANGLE: {
      image: assets.banner_eg_3,
      position: "right",
    },
    ROUNDED: {
      image: assets.banner_eg_1,
      position: "right",
    },
  };
  const getTextPositionClass = (position) => {
    switch (position) {
      case "left":
        return "items-center justify-start text-left pl-8";
      case "right":
        return "items-center justify-end text-right pr-8";
      case "center":
        return "items-center justify-center text-center";
      default:
        return "items-center justify-start text-left pl-8";
    }
  };

  // const isFilterActive = selectedFilters.length > 0; // adjust to your filters
  const isFilterActive = Object.values(selectedFilters).some(
    (value) => value && value.length > 0,
  );

  const groupByShape = (products) => {
    return products.reduce((acc, product) => {
      const shape = product.shape || "Others";
      if (!acc[shape]) acc[shape] = [];
      acc[shape].push(product);
      return acc;
    }, {});
  };
  const [pageTitle, setPageTitle] = useState("All Eyeglasses");
  useEffect(() => {
    const query = new URLSearchParams(location.search);

    const gender = query.get("gender");
    const shape = query.get("shape");
    const style = query.get("style");
    const material = query.get("material");
    const brand = query.get("brand");

    const newFilters = {};
    let title = "All Eyeglasses";

    if (gender && gender !== "All") {
      newFilters.gender = [gender];
      title = `${gender} Eyeglasses`;
    }

    if (shape) {
      newFilters.shape = [shape];
      title = `${shape} Eyeglasses`;
    }

    if (style) {
      newFilters.style = [style];
      title = `${style} Eyeglasses`;
    }

    if (material) {
      newFilters.material = [material];
      title = `${material} Eyeglasses`;
    }
    if (brand) {
      newFilters.brand = [brand];
      title = `${brand} Eyeglasses`;
    }

    setSelectedFilters(newFilters);
    setPageTitle(title);
  }, [location.search]);

  return (
    <>
      <div>
        <p className="lg:ml-6 lg:px-20 mt-5 lg:text-3xl sm:text-xl ">
          Stylish Eyeglasses for Every Face
        </p>
      </div>
      <div className="w-full max-w-[1450px] mx-auto px-4 my-10">
        <div className="relative h-[160px] sm:h-[200px] lg:h-[250px] rounded-xl overflow-hidden">
          <img
            src={assets.ban_eye}
            alt="Eyeglasses Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

          <div className="absolute inset-0 flex items-center justify-end sm:justify-end text-orange-800 sm:pr-8">
            <div className="text-center sm:text-right">
              <h2 className="text-2xl sm:text-sm md:text-xl font-semibold">
                Frames
              </h2>
              <p className="text-sm sm:text-lg md:text-xl px-5">
                Starting at ₹800
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className=" ">
        <h1 className="text-2xl mb-4 lg:px-24 font-bold lg:text-3xl sm:text-xl mt-2">
          {pageTitle}
        </h1>

        <p className="lg:px-32 italic mb-4 sm:text-sm">
          Eyeglasses that blend style and comfort for every face.
        </p>
      </div>

      <div className="w-full flex justify-center pt-10 border-t">
        <div className="w-full max-w-[1450px] px-4 md:px-0 flex flex-col lg:flex-row gap-6 lg:gap-10 ">
          {/* Filter Options */}
          <aside className="w-full lg:w-[260px] lg:shrink-0 lg:sticky lg:top-24 h-fit">
            {/* lg:shrink-0 lg:sticky lg:top-24 h-fit */}
            <p className="text-xl font-medium flex justify-between gap-2 cursor-pointer mt-8">
              FILTERS
              <button
                onClick={() => setSelectedFilters({})}
                className="text-sm text-green-400 hover:underline font-bold"
              >
                Reset
              </button>
            </p>

            {/* ***************************************************** */}
            <EgFDd
              title="Gender"
              field="gender"
              products={eyeglassesProducts}
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
              openFilter={openFilter}
              setOpenFilter={setOpenFilter}
            />

            <EgFDd
              title="Frame Shape"
              field="shape"
              products={eyeglassesProducts}
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
              openFilter={openFilter}
              setOpenFilter={setOpenFilter}
            />

            <EgFDd
              title="Material"
              field="material"
              products={eyeglassesProducts}
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
              openFilter={openFilter}
              setOpenFilter={setOpenFilter}
            />

            <EgFDd
              title="Frame Style"
              field="style"
              products={eyeglassesProducts}
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
              openFilter={openFilter}
              setOpenFilter={setOpenFilter}
            />
            <EgFDd
              title="Brand"
              field="brand"
              products={eyeglassesProducts}
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
              openFilter={openFilter}
              setOpenFilter={setOpenFilter}
            />
          </aside>
          {/* <section className="max-w-7xl mx-auto px-4 py-10 border border-blue-400 shadow-lg rounded-3xl"> */}
          <main className="w-full mt-6 lg:mt-0 self-start">
            <div className=" z-50 bg-white flex justify-between items-center text-base sm:text-2xl mb-6 py-2">
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
            {/* WHEN FILTER IS ACTIVE → NORMAL GRID */}

            {(isFilterActive || isSearchActive) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map((item) => (
                  <div key={item._id}>
                    <ProductItem
                      id={item._id}
                      name={item.shape}
                      image={item.image}
                      description={item.description}
                      brand={item.brand}
                      price={item.price}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* ✅ WHEN NO FILTER → GROUP BY SHAPE */}
            {(!isFilterActive && !isSearchActive) && 
              (() => {
                // const groupedProducts = groupByShape(products);
                const groupedProducts = groupByShape(eyeglassesProducts);
                const shapeNames = Object.keys(groupedProducts).sort((a, b) => {
                  const indexA = shapeOrder.indexOf(a);
                  const indexB = shapeOrder.indexOf(b);

                  return (
                    (indexA === -1 ? 999 : indexA) -
                    (indexB === -1 ? 999 : indexB)
                  );
                });

                return (
                  <div className="space-y-16">
                    {shapeOrder
                      .filter((shape) => groupedProducts[shape])
                      .map((shape) => {
                        const config = shapeBannerConfig[shape] || {};
                        const bannerImage =
                          config.image || assets.banner_default;
                        const textPosition = config.position || "left";

                        return (
                          <div key={shape}>
                            {/* ✅ BANNER */}
                            <div className="mt-10">
                              <div className="relative w-full h-[150px] sm:h-[170px] md:h-[190px] rounded-2xl overflow-hidden">
                                <img
                                  src={bannerImage}
                                  alt={`${shape} banner`}
                                  className="w-full h-full object-cover"
                                />

                                <div className="absolute inset-0 bg-black/30"></div>

                                <div
                                  className={`absolute inset-0 flex ${getTextPositionClass(
                                    textPosition,
                                  )}`}
                                >
                                  <div className="text-white">
                                    <h2 className="text-2xl md:text-3xl font-semibold">
                                      {shape} Frames
                                    </h2>
                                    <p className="text-sm opacity-90">
                                      Starting at ₹800
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* ✅ PRODUCTS */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 gap-y-6">
                              {groupedProducts[shape].map((item) => (
                                <ProductItem
                                  key={item._id}
                                  id={item._id}
                                  name={item.shape}
                                  image={item.image}
                                  brand={item.brand}
                                  description={item.description}
                                  price={item.price}
                                />
                              ))}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                );
              })()}
          </main>
          {/* </section> */}
        </div>
      </div>
    </>
  );
};

export default EyeGlasses;
