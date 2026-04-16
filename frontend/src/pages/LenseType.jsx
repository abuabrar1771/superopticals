import React, { useState } from "react";
import { assets } from "../assets/assets";

const LenseType = () => {
  const [lensType, setLensType] = useState("single");

  
  const lensOptions = [
    {
      id: "single",
      title: "Single Vision",
      img: assets.sv_lens, // Accessing from your file
    },
    {
      id: "bifocal",
      title: "Bifocal",
      img: assets.bf_lens,
    },
    {
      id: "progressive",
      title: "Progressive",
      img: assets.prog_lens,
    },
    {
      id: "trifocal",
      title: "Trifocal",
      img: assets.tf_lens,
    },
    {
      id: "mffocal",
      title: "Multifocal",
      img: assets.mf_lens,
    },
  ];

  const features = [
    "Scratch Resistant",
    "Anti-Reflection",
    "UV Protection",
    "Blue Filter",
    "Dust & Water Resistant",
  ];

  const toggleAddOn = (feature) => {
    setAddOns((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature],
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h2 className="text-xl font-bold mb-6">Select Lens Type</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {lensOptions.map((lens) => (
          <button
            key={lens.id}
            onClick={() => setLensType(lens.id)}
            className={`flex flex-col items-center p-4 border-2 rounded-xl transition-all ${
              lensType === lens.id
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200"
            }`}
          >
            {/* 3. THE IMAGE IS RENDERED HERE */}
            <div className="w-full h-32 mb-3 overflow-hidden rounded-lg">
              <img
                src={lens.img}
                alt={lens.title}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-semibold text-gray-700">{lens.title}</span>
          </button>
        ))}
      </div>

      {/* Feature List (Same as before) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {[
    "Scratch Resistant",
    "Anti-Reflection",
    "UV Protection",
    "Blue Filter",
    "Dust & Water Resistant",
    "Auto Cool",
  ].map((item) => (
    <label
      key={item}
      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
    >
      <span className="font-medium text-gray-700">{item}</span>
      <input 
        type="checkbox" 
        className="w-5 h-5 accent-blue-600 cursor-pointer" 
      />
    </label>
  ))}
</div>
    </div>
  );
};

export default LenseType;
