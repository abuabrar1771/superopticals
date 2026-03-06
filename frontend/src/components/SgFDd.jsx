import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

const SgFilterDropdown = ({
  title,
  field,
  selectedFilters,
  setSelectedFilters,
  openFilter,
  setOpenFilter,
}) => {
  const { products } = useContext(ShopContext);
  
  const sunGlassProducts = products.filter(
  (item) => item.category === "SUN GLASS"
);
  // 🔹 Step 1 — Apply ALL selected filters to products
  const filteredProducts = products.filter((item) => {
    return Object.entries(selectedFilters).every(([key, values]) => {
      if (!values || values.length === 0) return true;
      return values.includes(item[key]);
    });
  });

   // 🔹 Step 3 — Show all possible options (even if count = 0)
  const allOptions = [...new Set(sunGlassProducts.map((item) => item[field]))];

  const counts = {};
sunGlassProducts.forEach((item) => {
  const value = item[field];
  counts[value] = (counts[value] || 0) + 1;
});
 
  const toggleOption = (value) => {
    setSelectedFilters((prev) => {
      const updated = prev[field]?.includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...(prev[field] || []), value];

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
        <ChevronDownIcon
          className={`${openFilter === field ? "rotate-180" : ""} w-5 h-5`}
        />
      </div>

      {openFilter === field && (
        <div className="mt-2 space-y-2">
          {allOptions.map((opt) => (
            <div key={opt} className="flex justify-between">
              <label className="flex gap-2">
                <input
                  type="checkbox"
                  onChange={() => toggleOption(opt)}
                  checked={selectedFilters[field]?.includes(opt) || false}
                />
                {opt}
              </label>

              {/* show 0 if no items */}
              <span>({counts[opt] || 0})</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SgFilterDropdown;
