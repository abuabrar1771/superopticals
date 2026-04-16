import React, { useContext, useMemo } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

const SgFilterDropdown = ({
  title,
  field,
  products,
  selectedFilters,
  setSelectedFilters,
  openFilter,
  setOpenFilter,
}) => {
  // 🔹 Helper: Extracts value from top-level, specifications, OR metadata
  const getProductValue = (item, key) => {
    return (
      item[key] || item.specifications?.[key] || item.metadata?.[key] || null
    );
  };

  // 🔹 Step 1 — Calculate dynamic counts based on CURRENT selected filters
  const counts = useMemo(() => {
    const filtered = products.filter((item) => {
      return Object.entries(selectedFilters).every(([key, values]) => {
        if (!values || values.length === 0 || key === field) return true;

        const rawValue = getProductValue(item, key);
        if (!rawValue) return false;

        const itemValue = rawValue.toString().toLowerCase().trim();

        return values.some((val) => {
          const target = val.toString().toLowerCase().trim();

          // ✅ FIX: Gender specific logic for Sunglasses
          if (key === "gender") {
            // Split strings like "Men & Women" or "Men/Women" into an array
            const genderWords = itemValue.split(/[\s&/_]+/);
            // Check for exact word match or "unisex"
            return genderWords.includes(target) || itemValue === "unisex";
          }

          // Strict equality for Shape, Material, etc.
          return itemValue === target;
        });
      });
    });

    return filtered.reduce((acc, item) => {
      const value = getProductValue(item, field);
      if (value) {
        acc[value] = (acc[value] || 0) + 1;
      }
      return acc;
    }, {});
  }, [products, selectedFilters, field]);

  // 🔹 Step 2 — Get all unique options for this field
  const allOptions = useMemo(() => {
    const uniqueValues = [
      ...new Set(
        products
          .map((item) => getProductValue(item, field))
          .filter(Boolean)
      ),
    ];
    return uniqueValues.sort();
  }, [products, field]);

  const toggleOption = (value) => {
    setSelectedFilters((prev) => {
      const current = prev[field] || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];

      return { ...prev, [field]: updated };
    });
  };

  if (allOptions.length === 0) return null;

  return (
    <div className="border-b border-gray-100 py-4">
      <div
        className="flex justify-between items-center cursor-pointer group"
        onClick={() => setOpenFilter(openFilter === field ? null : field)}
      >
        <h3 className="font-bold text-xs uppercase tracking-widest text-gray-700 group-hover:text-blue-600">
          {title}
        </h3>
        <ChevronDownIcon
          className={`w-4 h-4 transition-transform duration-300 ${
            openFilter === field ? "rotate-180 text-blue-600" : "text-gray-400"
          }`}
        />
      </div>

      {openFilter === field && (
        <div className="mt-4 space-y-2.5 max-h-56 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
          {allOptions.map((opt) => (
            <div key={opt} className="flex justify-between items-center group/item">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-600 text-blue-800 focus:ring-offset-0 focus:ring-blue-800 cursor-pointer"
                  onChange={() => toggleOption(opt)}
                  checked={selectedFilters[field]?.includes(opt) || false}
                />
                <span className="text-lg text-gray-800 group-hover/item:text-black transition-colors capitalize">
                  {opt.toString().toLowerCase()}
                </span>
              </label>

              <span className="text-[14px] font-bold text-gray-800 bg-gray-350 px-1.5 py-0.5 rounded">
                {counts[opt] || 0}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SgFilterDropdown;