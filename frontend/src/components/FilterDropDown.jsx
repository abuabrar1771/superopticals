import { ChevronDownIcon } from "@heroicons/react/24/solid";

const FilterDropdown = ({
  title,
  field,
  products,
  selectedFilters,
  setSelectedFilters,
  openFilter,
  setOpenFilter,
}) => {
  // Apply all selected filters
  const filteredProducts = products.filter((item) => {
    return Object.entries(selectedFilters).every(([key, values]) => {
      if (!values || values.length === 0) return true;
      return values.includes(item[key]);
    });
  });

  // Count values based on filtered products
  const counts = filteredProducts.reduce((acc, item) => {
    const value = item[field];
    if (!value) return acc;
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});

  // All possible options
  const allOptions = [...new Set(products.map((item) => item[field]))];

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
              <span>({counts[opt] || 0})</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;