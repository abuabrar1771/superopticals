import React, { useState } from 'react';
import { lensetype } from './assets'; // Import your data
import { lensFeatures } from './assets'; 
import { assets } from "../assets/assets";

const LensOrderForm = () => {
  // State for the single lens selection (stores the whole object or just ID)
  const [selectedLens, setSelectedLens] = useState(lensetype[0]);
  // State for multiple feature selections (stores an array of IDs)
  const [selectedFeatureIds, setSelectedFeatureIds] = useState([]);

  // Toggle features logic
  const toggleFeature = (id) => {
    setSelectedFeatureIds(prev => 
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
  };

  // Calculations
  const featuresPrice = lensFeatures
    .filter(f => selectedFeatureIds.includes(f._id))
    .reduce((sum, f) => sum + f.price, 0);

  const totalPrice = selectedLens.price + featuresPrice;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      
      {/* 1. LENS TYPE SECTION (Selection) */}
      <section>
        <h3 className="text-lg font-bold mb-4">1. Select Lens Type</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {lensetype.map((lens) => (
            <div 
              key={lens._id}
              onClick={() => setSelectedLens(lens)}
              className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                selectedLens._id === lens._id ? "border-blue-600 bg-blue-50" : "border-gray-200"
              }`}
            >
              <p className="font-bold">{lens.name}</p>
              <p className="text-sm text-gray-500">{lens.brand}</p>
              <p className="mt-2 text-blue-600 font-semibold">₹{lens.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 2. FEATURES SECTION (Multi-select) */}
      <section>
        <h3 className="text-lg font-bold mb-4">2. Add Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {lensFeatures.map((item) => (
            <label
              key={item._id}
              className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer ${
                selectedFeatureIds.includes(item._id) ? "bg-slate-50 border-blue-400" : "border-gray-200"
              }`}
            >
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-green-600">+₹{item.price}</p>
              </div>
              <input
                type="checkbox"
                className="w-5 h-5 accent-blue-600"
                checked={selectedFeatureIds.includes(item._id)}
                onChange={() => toggleFeature(item._id)}
              />
            </label>
          ))}
        </div>
      </section>

      {/* 3. PRICE SUMMARY */}
      <div className="bg-gray-900 text-white p-6 rounded-2xl flex justify-between items-center">
        <div>
          <p className="text-gray-400 text-sm">Selected: {selectedLens.name}</p>
          <p className="text-2xl font-bold">Total: ₹{totalPrice}</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-lg font-bold transition-colors">
          Buy Now
        </button>
      </div>
    </div>
  );
};