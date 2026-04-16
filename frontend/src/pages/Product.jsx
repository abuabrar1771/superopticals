import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import PrescriptionForm from "./PrescriptionForm";
import LensSelector from "./LensSelector";
import RelatedProducts from "./RelatedProducts";
import ProductSpecifications from "../components/ProductSpecifications";

const Product = () => {
  const { productId } = useParams();
  const { products } = useContext(ShopContext);

  const [showLensConfig, setShowLensConfig] = useState(false);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");

  // Calculation States
  const [selectedLens, setSelectedLens] = useState(null);
  const [selectedFeatures, setSelectedFeatures] = useState([]);

  useEffect(() => {
    if (products && products.length > 0) {
      const item = products.find((p) => p._id === productId);
      if (item) {
        setProductData(item);
        // ✅ Match your data key: "images"
        setImage(item.images?.[0] || "");
      }
    }
  }, [productId, products]);

  // Logic for your specific categories
  const isLensRequired =
    productData?.category === "EYE_GLASS" ||
    productData?.category === "POWERED_GLASS";

  const framePrice = productData?.price || 0;
  const lensPrice = selectedLens?.price || 0;
  const featuresTotal = selectedFeatures.reduce(
    (acc, curr) => acc + curr.price,
    0,
  );
  const grandTotal = framePrice + lensPrice + featuresTotal;

  if (!productData)
    return <div className="p-20 text-center">Loading Product...</div>;

  return (
    <div className="border-t-2 pt-10 flex justify-center bg-gray-50 min-h-screen">
      <div className="w-full max-w-7xl px-4 pb-20">
        {!showLensConfig ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
            {/* LEFT SECTION (Gallery) */}
            <div className="md:col-span-5 md:sticky md:top-10 self-start flex flex-col sm:flex-row gap-4">
              <div className="flex sm:flex-col gap-3 order-2 sm:order-1 overflow-x-auto sm:w-20">
                {/* ✅ FIXED: Use plural .images to avoid the 'map' error */}
                {productData.images?.map((item, index) => (
                  <img
                    key={index}
                    src={item}
                    onClick={() => setImage(item)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 object-contain bg-white cursor-pointer border-2 rounded-md transition-all ${
                      image === item
                        ? "border-black scale-105"
                        : "border-gray-200"
                    }`}
                  />
                ))}
              </div>

              <div className="flex-1 order-1 sm:order-2 bg-white rounded-xl border aspect-square flex items-center justify-center overflow-hidden p-6 shadow-sm">
                <img
                  src={image}
                  alt={productData.name}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* RIGHT SECTION (Details) */}
            <div className="md:col-span-7 flex flex-col bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <span className="text-gray-400 uppercase tracking-widest text-xs font-bold">
                {productData.brand}
              </span>
              <h1 className="text-3xl font-bold text-gray-900 mt-1">
                {productData.name}
              </h1>

              <p className="text-3xl font-bold mt-6 text-black">
                ₹{productData.price}
              </p>

              <hr className="my-6 border-gray-100" />

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 uppercase">
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {productData.description}
                </p>

                {/* ✅ Extra Details from specifications
                <div className="grid grid-cols-2 gap-y-2 pt-4 text-sm">
                  <p><span className="font-bold">Shape:</span> {productData.specifications?.shape}</p>
                  <p><span className="font-bold">Material:</span> {productData.specifications?.material}</p>
                  <p><span className="font-bold">Gender:</span> {productData.metadata?.gender}</p>
                </div> */}
              </div>

              <div className="flex gap-4 mt-8">
                {isLensRequired ? (
                  <button
                    onClick={() => {
                      setShowLensConfig(true);
                      window.scrollTo(0, 0);
                    }}
                    className="flex-1 bg-black text-white py-4 rounded-full font-bold hover:bg-gray-800 transition-all"
                  >
                    Select Lens & Power
                  </button>
                ) : (
                  <button className="flex-1 bg-black text-white py-4 rounded-full font-bold hover:bg-gray-800 transition-all">
                    Add to Cart — ₹{framePrice}
                  </button>
                )}
              </div>
              {/* PRODUCT INFORMATION */}
              <div className="mt-3">
                <ProductSpecifications productData={productData} />
              </div>
              {/* RELATED PRODDUCTS */}
              <div className="mt-3">
                <RelatedProducts
                  category={productData.category}
                  shape={productData.specifications?.shape}
                />
              </div>
            </div>
          </div>
        ) : (
          /* CONFIG VIEW (Lens Selector) */
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <button
              onClick={() => setShowLensConfig(false)}
              className="mb-6 font-medium text-gray-500 hover:text-black"
            >
              ← Back to Product
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-10">
                <PrescriptionForm />
                <LensSelector
                  onUpdateLens={(lens) => setSelectedLens(lens)}
                  onUpdateFeatures={(feats) => setSelectedFeatures(feats)}
                />
              </div>

              {/* LIVE BILLING SUMMARY */}
              <div className="lg:col-span-1">
                <div className="sticky top-10 bg-white p-6 rounded-2xl border shadow-xl">
                  <h3 className="text-lg font-bold border-b pb-4 mb-4">
                    Summary
                  </h3>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Frame Price</span>
                    <span>₹{framePrice}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">
                      Lens: {selectedLens?.name || "Not Selected"}
                    </span>
                    <span>₹{lensPrice}</span>
                  </div>
                  <div className="border-t-2 border-dashed pt-4 mt-6 flex justify-between items-center">
                    <span className="text-lg font-bold">Total Amount</span>
                    <span className="text-3xl font-black text-blue-600">
                      ₹{grandTotal}
                    </span>
                  </div>
                  <button className="w-full bg-black text-white py-4 rounded-xl font-bold mt-6 hover:bg-gray-800">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;
