import React, { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

const ProductSpecifications = ({ productData }) => {
  // ✅ State to track if the table is open or closed
  const [isOpen, setIsOpen] = useState(false);

  if (!productData) return null;

  const SpecRow = ({ label, value }) => (
    <div className="flex justify-between py-3 border-b border-gray-100 items-center hover:bg-gray-50 transition-colors px-2">
      <span className="text-gray-600 font-medium">{label}</span>
      <span className="text-gray-400">{value || "N/A"}</span>
    </div>
  );

  return (
    <div className="w-full mt-10 border-t pt-8">
      {/* ✅ CLICKABLE HEADER */}
      <div 
        className="flex justify-between items-center mb-6 cursor-pointer group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
          Product Information
        </h3>
        
        {/* ✅ ROTATING ARROW */}
        <div className={`transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}>
          <ChevronDownIcon className="w-6 h-6 text-gray-500" />
        </div>
      </div>

      {/* ✅ TOGGLEABLE CONTENT */}
      {isOpen && (
        <div className="space-y-0 border-t animate-in fade-in slide-in-from-top-2 duration-300">
          <SpecRow label="SKU" value={productData.sku} />
          <SpecRow label="Brand" value={productData.brand} />
          <SpecRow label="Gender" value={productData.metadata?.gender} />
          <SpecRow label="Size" value={productData.specifications?.size} />
          <SpecRow
            label="Frame Color"
            value={productData.specifications?.color}
          />
          <SpecRow
            label="Frame Material"
            value={productData.specifications?.material}
          />
          <SpecRow
            label="Frame Shape"
            value={productData.specifications?.shape}
          />
          <SpecRow
            label="Rim Details"
            value={productData.specifications?.style}
          />
          <SpecRow label="Warranty" value={productData.metadata?.warranty} />
          <SpecRow label="Country of Origin" value="India" />
        </div>
      )}
    </div>
  );
};

export default ProductSpecifications;