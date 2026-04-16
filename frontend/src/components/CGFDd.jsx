import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { ChevronDownIcon } from "@heroicons/react/24/solid";


const CgFilterDropdown = ({
  title,
  field,
  products,
  selectedFilters,
  setSelectedFilters,
  openFilter,
  setOpenFilter,
}) => {
  
  // ✅ HELPER: Dig into nested data (specifications or metadata)
  const getValue = (item, key) => {
    return item[key] || item.specifications?.[key] || item.metadata?.[key];
  };

  // 🔹 Step 1 — Apply ALL selected filters to products for accurate counts
  const filteredProducts = products.filter((item) => {
    return Object.entries(selectedFilters).every(([key, values]) => {
      if (!values || values.length === 0) return true;
      
      const itemValue = getValue(item, key);
      
      return values.some(
        (val) => itemValue?.toString().toUpperCase() === val.toUpperCase()
      );
    });
  });

  // 🔹 Step 2 — Count values for this field from filtered products
  const counts = filteredProducts.reduce((acc, item) => {
    const value = getValue(item, field);
    if (!value) return acc;
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});

  // 🔹 Step 3 — Show all possible options from the initial products list
  // Added .filter(Boolean) to remove undefined/null options
  const allOptions = [...new Set(products.map((item) => getValue(item, field)).filter(Boolean))];

  const toggleOption = (value) => {
    setSelectedFilters((prev) => {
      const currentFieldFilters = prev[field] || [];
      const updated = currentFieldFilters.includes(value)
        ? currentFieldFilters.filter((v) => v !== value)
        : [...currentFieldFilters, value];

      return { ...prev, [field]: updated };
    });
  };

  return (
    <div className="border-b py-3">
      <div
        className="flex justify-between cursor-pointer"
        onClick={() => setOpenFilter(openFilter === field ? null : field)}
      >
        <h3 className="font-semibold text-gray-700">{title}</h3>
        <ChevronDownIcon
          className={`${openFilter === field ? "rotate-180" : ""} w-5 h-5 transition-transform`}
        />
      </div>

      {openFilter === field && (
        <div className="mt-2 space-y-2">
          {allOptions.length > 0 ? (
            allOptions.map((opt) => (
              <div key={opt} className="flex justify-between items-center text-sm">
                <label className="flex gap-2 cursor-pointer hover:text-blue-600">
                  <input
                    type="checkbox"
                    onChange={() => toggleOption(opt)}
                    checked={selectedFilters[field]?.includes(opt) || false}
                    className="cursor-pointer"
                  />
                  {opt}
                </label>
                <span className="text-gray-900">({counts[opt] || 0})</span>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-400">No options available</p>
          )}
        </div>
      )}
    </div>
  );
};
export default CgFilterDropdown