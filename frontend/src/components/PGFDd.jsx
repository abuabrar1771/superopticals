import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import EgFDd from "../components/EgFDd";

const PgFilterDropdown = ({ title, field, products, selectedFilters, setSelectedFilters, openFilter, setOpenFilter }) => {
  
  // Helper to get value from nested structure
  const getValue = (item, key) => item[key] || item.specifications?.[key] || item.metadata?.[key];

  // 🔹 Step 1 — Apply filters
  const filteredProducts = products.filter((item) => {
    return Object.entries(selectedFilters).every(([key, values]) => {
      if (!values || values.length === 0) return true;
      const itemValue = getValue(item, key);
      return values.some((val) => itemValue?.toString().toLowerCase() === val.toLowerCase());
    });
  });

  // 🔹 Step 2 — Count values
  const counts = filteredProducts.reduce((acc, item) => {
    const value = getValue(item, field);
    if (!value) return acc;
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});

  // 🔹 Step 3 — Get all unique options
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
        <h3 className="font-semibold">{title}</h3>
        <ChevronDownIcon className={`${openFilter === field ? "rotate-180" : ""} w-5 h-5`} />
      </div>

      {openFilter === field && (
        <div className="mt-2 space-y-2">
          {allOptions.map((opt) => (
            <div key={opt} className="flex justify-between items-center text-sm">
              <label className="flex gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  onChange={() => toggleOption(opt)}
                  checked={selectedFilters[field]?.includes(opt) || false}
                />
                {opt}
              </label>
              <span className="text-gray-400">({counts[opt] || 0})</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default PgFilterDropdown