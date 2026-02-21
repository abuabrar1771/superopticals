import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "../components/ProductItem";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import EgFDd from "../components/EgFDd";

const EyeGlasses = () => {
  const { products } = useContext(ShopContext);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [filteredProducts, setFilteredProducts] = useState(products);

  const [openFilter, setOpenFilter] = useState(null);

  useEffect(() => {
    let filtered = products;

    Object.keys(selectedFilters).forEach((key) => {
      if (selectedFilters[key]?.length > 0) {
        filtered = filtered.filter((item) =>
          selectedFilters[key].includes(item[key]),
        );
      }
    });

    setFilteredProducts(filtered);
  }, [selectedFilters, products]);

  // GROUPING PRODUCTS
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
  (value) => value && value.length > 0
);

  const groupByShape = (products) => {
    return products.reduce((acc, product) => {
      const shape = product.shape || "Others";
      if (!acc[shape]) acc[shape] = [];
      acc[shape].push(product);
      return acc;
    }, {});
  };

  return (
    <>
      <div>
        <p className="lg:ml-6 lg:px-20 mt-5 lg:text-3xl sm:text-xl ">
          Stylish Eyeglasses for Every Face
        </p>
      </div>
      <div className="w-full max-w-[1450px] mx-auto px-4 my-10">
        <div className="relative h-[220px] rounded-xl overflow-hidden">
          <img
            src={assets.ban_eye}
            alt="Eyeglasses Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>

          <div className="absolute inset-0 flex items-center justify-end text-white">
            <div className="text-center">
              <h2 className="text-2xl font-semibold">Frames</h2>
              <p className="text-xl">Starting at ₹800</p>
            </div>
          </div>
        </div>
      </div>

      <div className=" ">
        <p className="lg:px-24 font-bold lg:text-3xl sm:text-xl mt-2">
          Eyeglasses
        </p>
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
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
              openFilter={openFilter}
              setOpenFilter={setOpenFilter}
            />

            <EgFDd
              title="Frame Shape"
              field="shape"
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
              openFilter={openFilter}
              setOpenFilter={setOpenFilter}
            />

            <EgFDd
              title="Material"
              field="material"
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
              openFilter={openFilter}
              setOpenFilter={setOpenFilter}
            />

            <EgFDd
              title="Frame Style"
              field="style"
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
              openFilter={openFilter}
              setOpenFilter={setOpenFilter}
            />
          </aside>
          {/* <section className="max-w-7xl mx-auto px-4 py-10 border border-blue-400 shadow-lg rounded-3xl"> */}
          <main className="w-full mt-6 lg:mt-0">
            {/* ✅ WHEN FILTER IS ACTIVE → NORMAL GRID */}
            {isFilterActive && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map((item) => (
                  <div
                    key={item._id}
                    className="border rounded-xl p-4 shadow-sm"
                  >
                    <ProductItem
                      id={item._id}
                      name={item.shape}
                      image={item.image}
                      price={item.price}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* ✅ WHEN NO FILTER → GROUP BY SHAPE */}
            {!isFilterActive &&
              (() => {
                const groupedProducts = groupByShape(products);
                const shapeNames = Object.keys(groupedProducts);

                return (
                  <div className="space-y-16">
                    {shapeNames.map((shape, index) => (
                      <div key={shape}>
                        {/* BANNER BETWEEN SHAPES */}
                        {index !== shapeNames.length - 1 &&
                          (() => {
                            const config = shapeBannerConfig[shape] || {};
                            const bannerImage =
                              config.image || assets.banner_default;
                            const textPosition = config.position || "left";

                            return (
                              <div className="mt-10">
                                <div className="relative w-full h-[150px] sm:h-[170px] md:h-[190px] rounded-2xl overflow-hidden">
                                  {/* IMAGE */}
                                  <img
                                    src={bannerImage}
                                    alt={`${shape} banner`}
                                    className="w-full h-full object-cover"
                                  />

                                  {/* OPTIONAL OVERLAY */}
                                  <div className="absolute inset-0 bg-black/30"></div>

                                  {/* TEXT */}
                                  <div
                                    className={`absolute inset-0 flex ${getTextPositionClass(textPosition)}`}
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
                            );
                          })()}

                        {/* PRODUCTS OF THAT SHAPE */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {groupedProducts[shape].map((item) => (
                            <div
                              key={item._id}
                              className="border rounded-xl p-4 shadow-sm"
                            >
                              <ProductItem
                                id={item._id}
                                name={item.shape}
                                image={item.image}
                                price={item.price}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
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
