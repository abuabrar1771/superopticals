import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import PrescriptionForm from "./PrescriptionForm";
import LensSelector from "./LensSelector";
import RelatedProducts from "./RelatedProducts";
import ProductSpecifications from "../components/ProductSpecifications";
import { toast } from "react-toastify";


const Product = () => {
  const { productId } = useParams();

  // ✅ 1. Combine all context needs into one line at the very top
  const { products, addToCart } = useContext(ShopContext);

  const [showLensConfig, setShowLensConfig] = useState(false);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");

  // Calculation States
  const [selectedLens, setSelectedLens] = useState(null);
  const [selectedFeatures, setSelectedFeatures] = useState([]);

  const [quantity, setQuantity] = useState(1);
  
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
    productData?.category === "EYE_GLASS"
    

  const framePrice = productData?.price || 0;
  const lensPrice = selectedLens?.price || 0;
  const feautersPrice = selectedFeatures?.price || 0;
  const featuresTotal = selectedFeatures.reduce(
    (acc, curr) => acc + curr.price,
    0,
  );
  const unitPrice = framePrice + lensPrice + featuresTotal;
  const grandTotal = unitPrice * quantity

  // ✅ New state for prescription
  const [prescription, setPrescription] = useState(null);

  const handleAddToCart = async () => {
  // 1. Validation for eyeglasses
  if (isLensRequired && showLensConfig) {
    if (!selectedLens || !prescription) {
      toast.error("Please complete lens and prescription selection.");
      return;
    }
  }

  // 2. Prepare the object (Match the keys exactly)
  const dataForCart = {
    _id: productData._id,
    name: productData.name,
    image: image, // Use the 'image' state from your component
    lens: isLensRequired ? selectedLens : { name: "Standard UV Lens", price: 0 },
    features: selectedFeatures,
    prescription: prescription,
    totalAmount: grandTotal, // Your price * quantity
    quantity: quantity       // Your quantity state
  };

  // 3. Call the function
  
  addToCart(dataForCart); 

  console.log("Items added to cart ")

  toast.success("Added to Cart Successfully!", {
  position: "top-center",
  autoClose: 2000,
  theme: "colored",
  });
  }
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
                  <div className="flex flex-col gap-4 w-full">
                    {/* Quantity Selector */}
                    <div className="flex items-center gap-3 mb-2">
                      <p className="text-sm font-semibold uppercase text-gray-500">
                        Quantity:
                      </p>
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() =>
                            setQuantity((prev) => Math.max(1, prev - 1))
                          }
                          className="px-4 py-2 hover:bg-gray-100 border-r"
                        >
                          –
                        </button>
                        <span className="px-6 font-bold">{quantity}</span>
                        <button
                          onClick={() => setQuantity((prev) => prev + 1)}
                          className="px-4 py-2 hover:bg-gray-100 border-l"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 bg-black text-white py-4 rounded-full font-bold hover:bg-gray-800 transition-all"
                    >
                      Add to Cart — ₹{framePrice * quantity}
                    </button>
                  </div>
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
                <PrescriptionForm
                  onUpdatePrescription={(data) => {
                    setPrescription(data);
                  }}
                />
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

                  {/* 1. Frame Price */}
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Frame Price</span>
                    <span className="font-medium">₹{framePrice}</span>
                  </div>

                  {/* 2. Lens Price */}
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">
                      Lens: {selectedLens?.name || "Not Selected"}
                    </span>
                    <span className="font-medium">₹{lensPrice}</span>
                  </div>

                  {/* 3. Individual Features List */}
                  {selectedFeatures.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-50">
                      <p className="text-xs font-bold text-gray-400 uppercase mb-2">
                        Selected Features
                      </p>
                      {selectedFeatures.map((feature, index) => (
                        <div
                          key={index}
                          className="flex justify-between mb-2 text-sm"
                        >
                          <span className="text-gray-600">{feature.name}</span>
                          <span className="text-gray-900">
                            + ₹{feature.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 4. Total Calculation */}
                  <div className="border-t-2 border-dashed pt-4 mt-6 flex justify-between items-center">
                    <span className="text-lg font-bold">Total Amount</span>
                    <span className="text-3xl font-black text-blue-600">
                      ₹{grandTotal}
                    </span>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-black text-white py-4 rounded-xl font-bold mt-6 hover:bg-gray-800 transition-colors"
                  >
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
