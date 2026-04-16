import React, { useState } from "react";
import { assets, lensetype, lensFeatures } from "../assets/assets";

// We MUST destructure the props here to talk to Product.jsx
const LensSelector = ({ onUpdateLens, onUpdateFeatures }) => {
  const [activeLensId, setActiveLensId] = useState("");
  const [selectedAddOns, setSelectedAddOns] = useState([]);

  // Map your asset images to the lensetype data
  const lensOptions = lensetype.map((item) => {
    const imgMap = {
      "00001": assets.sv_lens,
      "00002": assets.bf_lens,
      "00003": assets.prog_lens,
      "00004": assets.tf_lens,
      "00005": assets.mf_lens,
    };
    return { ...item, img: imgMap[item._id] };
  });

  const handleLensSelect = (lens) => {
    setActiveLensId(lens._id);
    // CRITICAL: This sends the whole object {name, price, etc.} to the parent
    if (onUpdateLens) onUpdateLens(lens); 
  };

  const toggleFeature = (feature) => {
    const isAlreadySelected = selectedAddOns.find(f => f._id === feature._id);
    let updated;

    if (isAlreadySelected) {
      updated = selectedAddOns.filter((f) => f._id !== feature._id);
    } else {
      updated = [...selectedAddOns, feature];
    }

    setSelectedAddOns(updated);
    // CRITICAL: This sends the array of feature objects to the parent
    if (onUpdateFeatures) onUpdateFeatures(updated);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white border rounded-2xl shadow-sm">
      <h2 className="text-xl font-bold mb-6">Select Lens Type</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
        {lensOptions.map((lens) => (
          <button
            key={lens._id}
            onClick={() => handleLensSelect(lens)}
            className={`flex flex-col items-center p-3 border-2 rounded-xl transition-all ${
              activeLensId === lens._id
                ? "border-blue-600 bg-blue-50"
                : "border-gray-100 hover:border-gray-300"
            }`}
          >
            <div className="w-full h-20 mb-2 overflow-hidden rounded-lg">
              <img src={lens.img} alt={lens.name} className="w-full h-full object-contain" />
            </div>
            <span className="text-sm font-bold text-gray-800">{lens.name}</span>
            <span className="text-xs text-blue-600 font-semibold">₹{lens.price}</span>
          </button>
        ))}
      </div>

      <h2 className="text-xl font-bold mb-6">Add Lens Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {lensFeatures.map((item) => (
          <label
            key={item._id}
            className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
              selectedAddOns.some(f => f._id === item._id) ? "border-blue-500 bg-blue-50" : "border-gray-200"
            }`}
          >
            <div className="flex flex-col">
              <span className="font-medium text-gray-700">{item.name}</span>
              <span className="text-xs text-green-600 font-bold">+₹{item.price}</span>
            </div>
            <input 
              type="checkbox" 
              className="w-5 h-5 accent-blue-600" 
              checked={selectedAddOns.some(f => f._id === item._id)}
              onChange={() => toggleFeature(item)}
            />
          </label>
        ))}
      </div>
    </div>
  );
};

export default LensSelector;