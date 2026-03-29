import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Product = () => {
  const { productId } = useParams();
  const { products } = useContext(ShopContext);

  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  // const [showLens, setShowLens] = useState(false);

  // 🔥 Refs (important for smooth zoom)
  const imgRef = useRef(null);
  const lensRef = useRef(null);
  const zoomRef = useRef(null);

  // 📦 Fetch product
  useEffect(() => {
    const item = products.find((p) => p._id === productId);
    if (item) {
      setProductData(item);
      setImage(item.image[0]);
    }
  }, [productId, products]);

  // 🖱️ Mouse move (NO state → NO blinking)
  const handleMouseEnter = () => {
    if (lensRef.current) lensRef.current.style.opacity = "1";
    if (zoomRef.current) zoomRef.current.style.opacity = "1";
  };

  const handleMouseLeave = () => {
    if (lensRef.current) lensRef.current.style.opacity = "0";
    if (zoomRef.current) zoomRef.current.style.opacity = "0";
  };

  const handleMouseMove = (e) => {
    const img = imgRef.current;
    const lens = lensRef.current;
    const zoom = zoomRef.current;

    if (!img || !lens || !zoom) return;

    const rect = img.getBoundingClientRect();

    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    // clamp inside image
    x = Math.max(0, Math.min(x, rect.width));
    y = Math.max(0, Math.min(y, rect.height));

    const lensSize = 120;

    const lensX = x - lensSize / 2;
    const lensY = y - lensSize / 2;

    // move lens
    lens.style.left = `${lensX}px`;
    lens.style.top = `${lensY}px`;

    // move zoom background
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    zoom.style.backgroundPosition = `${xPercent}% ${yPercent}%`;
  };

  if (!productData) return null;

  return (
    <div className="border-t-2 pt-10 flex justify-center">
      <div className="w-full max-w-6xl">
        <div className="flex flex-col md:flex-row gap-6">
          {/* 🔵 LEFT SECTION */}
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Thumbnails */}
            <div className="flex sm:flex-col gap-2 overflow-x-auto sm:w-[80px]">
              {productData.image.map((item, index) => (
                <img
                  key={index}
                  src={item}
                  onClick={() => setImage(item)}
                  className={`w-14 h-14 sm:w-20 sm:h-20 object-contain bg-white cursor-pointer border ${
                    image === item ? "border-black" : ""
                  }`}
                />
              ))}
            </div>

            {/* 🔍 Zoom + Image */}
            <div className="flex gap-6 items-start">
              {/* LEFT ZOOM PANEL */}
              <div
                ref={zoomRef}
                className="hidden md:block w-80 h-80 border bg-white pointer-events-none"
                style={{
                  backgroundImage: `url(${image})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "300%",
                  opacity: 0, // hidden by default
                  transition: "opacity 0.2s ease",
                }}
              />

              {/* MAIN IMAGE */}
              <div
                className="relative bg-gray-100 w-96 h-96 flex items-center justify-center overflow-hidden"
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <img
                  ref={imgRef}
                  src={image}
                  alt=""
                  className="w-full h-full object-contain"
                />

                {/* Lens */}
                <div
                  ref={lensRef}
                  className="absolute border border-black pointer-events-none"
                  style={{
                    width: "120px",
                    height: "120px",
                    opacity: 0, // hidden by default
                    transition: "opacity 0.1s ease",
                  }}
                />
              </div>
            </div>
          </div>

          {/* 🟢 RIGHT SECTION */}
          <div className="flex-1 bg-white p-6 rounded-md shadow-sm">
            <h1 className="text-xl font-semibold">
              {productData.brand} - {productData.name}
            </h1>

            <p className="text-gray-600 mt-2 text-sm">
              {productData.description}
            </p>

            <p className="text-2xl font-bold mt-4">₹ {productData.price}</p>

            <button className="mt-6 w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
