import React, { useState } from "react";
import { HiOutlineCloudUpload, HiOutlineTrash } from "react-icons/hi";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios"; // Added axios for better request handling
import "react-toastify/dist/ReactToastify.css";
import { categoryMap, colorOptions } from "../../App";

const AddProduct = ({ token }) => {
  const [color, setColor] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const handleSelect = (name) => {
    const selectedColor = name.toUpperCase();
    setColor(selectedColor); // Keep for UI display

    // Update formData directly
    setFormData((prev) => ({
      ...prev,
      specifications: { ...prev.specifications, color: selectedColor },
    }));
    setIsOpen(false);
  };
  const mainCategories = Object.keys(categoryMap);

  // for matching category and getting subcategory items
  const [category, setCategory] = useState(mainCategories[0]);
  const [subCategory, setSubCategory] = useState(
    categoryMap[mainCategories[0]][0],
  );

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
    const firstSub = categoryMap[selectedCategory][0];

    // Update both top-level and sub-category in one go
    setFormData((prev) => ({
      ...prev,
      category: selectedCategory,
      subCategory: firstSub,
    }));
  };
  //

  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    brand: "",
    category: "",
    subCategory: "",
    description: "",
    price: "",
    currency: "INR",
    stock: "",
    specifications: {
      shape: "",
      material: "",
      size: "",
      color: "",
      dimensions: { lensWidth: "", bridgeWidth: "", templeLength: "" },
    },
    metadata: {
      gender: "",
      warranty: "",
      bestseller: false,
      newArrival: false,
    },
  });

  const FRAME_SHAPES = [
    "Round",
    "Rectangle",
    "CatEye",
    "Aviator",
    "Square",
    "ClubMaster",
    "Geometric",
    "Oval",
  ].sort();

  const MATERIAL = [
    "Acetate",
    "Metal",
    "Titanium",
    "TR90",
    "Wood",
    "SPX",
  ].sort();

  const BRANDS = [
    "FASTRACK",
    "RAYBAN",
    "OAKLEY",
    "TOM FORD",
    "BURBERRY",
    "PRADA",
    "VERSACE",
    "MONTBLANC",
    "MICHAEL KORS",
    "CARTIER",
    "VOGUE",
  ].sort();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;

    if (name.includes(".")) {
      const keys = name.split(".");
      setFormData((prev) => {
        let updated = JSON.parse(JSON.stringify(prev));
        if (keys.length === 3) {
          updated[keys[0]][keys[1]][keys[2]] = val;
        } else {
          updated[keys[0]][keys[1]] = val;
        }
        return updated;
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: val }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const fileArray = files.map((file) => ({
      file: file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...fileArray].slice(0, 5));
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Uploading product...");

    try {
      const data = new FormData();

      // 1. Append Top-Level Fields
      data.append("sku", formData.sku);
      data.append("name", formData.name);
      data.append("brand", formData.brand);
      data.append("category", category); // From your local state
      data.append("subCategory", subCategory);
      data.append("price", formData.price);
      data.append("currency", formData.currency);
      data.append("stock", formData.stock);

      // 2. Append Nested Fields Individually (Bracket Notation)
      // This avoids "Cannot convert object to primitive value"
      data.append("specifications[shape]", formData.specifications.shape);
      data.append("specifications[material]", formData.specifications.material);
      data.append("specifications[size]", formData.specifications.size);
      data.append("specifications[color]", color); // From your local color state

      data.append("metadata[gender]", formData.metadata.gender);
      data.append(
        "metadata[warranty]",
        formData.metadata.warranty || "No Warranty",
      );
      data.append("metadata[bestseller]", formData.metadata.bestseller);
      data.append("metadata[newArrival]", formData.metadata.newArrival);

      // 3. Append Images
      images.forEach((img, index) => {
        if (img.file) {
          data.append(`image${index + 1}`, img.file);
        }
      });

      // 4. Send Request
      const response = await axios.post(
        "http://localhost:4000/api/product/add",
        data,
        {
          headers: {
            token: token || localStorage.getItem("token"),
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data.success) {
        toast.update(toastId, {
          render: "Success!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        // Reset logic here
      }
    } catch (error) {
      console.error("Submission Error:", error);
      toast.update(toastId, {
        render: "Check console for errors",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto bg-cyan-100">
      <ToastContainer position="top-right" theme="colored" />

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
      >
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">
            Add New Optical Product
          </h2>
          <p className="text-sm text-slate-500">
            Manage your SuperOpticals inventory.
          </p>
        </div>

        <div className="p-6 space-y-8">
          {/* Image Upload Section */}
          <section>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Product Gallery (Up to 5 images)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {images.map((img, index) => (
                <div
                  key={index}
                  className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200"
                >
                  <img
                    src={img.preview}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <HiOutlineTrash />
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-slate-500 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
                  <HiOutlineCloudUpload className="text-3xl text-slate-400" />
                  <span className="text-xs text-slate-500 mt-2 text-center">
                    Add Image {images.length + 1}
                  </span>
                  <input
                    type="file"
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/*"
                  />
                </label>
              )}
            </div>
          </section>

          {/* Basic Info */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700">
                Product Name
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full mt-1 p-2.5 border border-slate-500 rounded-lg outline-none focus:border-cyan-500"
                placeholder="e.g. Aviator Classic"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                SKU Code
              </label>
              <input
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className="w-full mt-1 p-2.5 border border-slate-500 rounded-lg outline-none focus:border-cyan-500"
                placeholder="SO-123"
                required
              />
            </div>
          </section>

          {/* Pricing & Category */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Category
              </label>
              <select
                value={category}
                onChange={handleCategoryChange}
                className="w-full mt-1 p-2.5 border border-slate-500 rounded-lg bg-white"
                required
              >
                {mainCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Sub-Category(Frame Style)
              </label>
              <select
                name="subCategory"
                value={formData.subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                className="w-full mt-1 p-2.5 border border-slate-500 rounded-lg bg-white"
                required
              >
                {categoryMap[category].map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Price (INR)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full mt-1 p-2.5 border border-slate-500 rounded-lg"
                placeholder="₹ 0.00"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Stock Units
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full mt-1 p-2.5 border border-slate-500 rounded-lg"
                placeholder="0"
                required
              />
            </div>
          </section>

          {/* Specifications */}
          <section className="p-5 bg-slate-50 rounded-xl space-y-4 border border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Technical Specifications
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <label className="text-xs text-slate-500 font-semibold">
                  Brand
                </label>
                <select
                  name="brand" // Change from specifications.shape to brand
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border border-slate-500 rounded-md bg-white"
                  required
                >
                  <option value="">Select</option>
                  {BRANDS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 font-semibold">
                  Frame Shape
                </label>
                <select
                  name="specifications.shape"
                  value={formData.specifications.shape}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border border-slate-500 rounded-md bg-white"
                >
                  <option value="">Select</option>
                  {FRAME_SHAPES.map((shape) => (
                    <option key={shape} value={shape.toUpperCase()}>
                      {shape}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 font-semibold">
                  Size
                </label>
                <select
                  name="specifications.size"
                  value={formData.specifications.size}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border border-slate-500 rounded-md bg-white"
                >
                  <option value="">Size</option>
                  <option value="Small">Small</option>
                  <option value="Medium">Medium</option>
                  <option value="Large">Large</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 font-semibold">
                  Material
                </label>
                <select
                  name="specifications.material" // Change from specifications.size
                  value={formData.specifications.material}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border border-slate-500 rounded-md bg-white"
                  required
                >
                  <option value="">Select</option>
                  {MATERIAL.map((m) => (
                    <option key={m} value={m.toUpperCase()}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 font-semibold mb-1 block">
                  Select Color
                </label>

                {/* The "Box" users click to open the list */}

                <div
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-full mt-1 p-2 border border-slate-500 rounded-md flex items-center justify-between  cursor-pointer bg-white"
                >
                  <span className={color ? "text-black" : "text-gray-600"}>
                    {color ? color : "Select Color"}
                  </span>
                  <span
                    className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                  >
                    ▼
                  </span>
                </div>

                {/* The Dropdown List (Only shows when isOpen is true) */}
                {isOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-[300px] overflow-y-auto">
                    {colorOptions.map((item) => (
                      <div
                        key={item.name}
                        onClick={() => handleSelect(item.name)}
                        className="flex items-center gap-4 p-3 hover:bg-slate-50 border-b border-slate-50 last:border-none cursor-pointer"
                      >
                        {/* Color Circle from cololr.png */}
                        <div
                          style={{ background: item.code }}
                          className="w-8 h-8 rounded-full border border-slate-200 shadow-sm shrink-0"
                        />

                        {/* Color Name */}
                        <span className="text-lg text-slate-700">
                          {item.name}
                        </span>

                        {/* Checkmark for selection */}
                        {color === item.name.toUpperCase() && (
                          <span className="ml-auto text-blue-600 font-bold">
                            ✓
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Hidden input for your form data */}
                <input type="hidden" name="color" value={color} />
              </div>
            </div>
          </section>

          {/* Metadata */}
          <section className="flex flex-wrap items-center gap-8 border-t border-slate-100 pt-6">
            <div className="flex flex-col min-w-[150px]">
              <label className="text-sm font-medium text-slate-700">
                Target Gender
              </label>
              <select
                name="metadata.gender"
                value={formData.metadata.gender}
                onChange={handleChange}
                className="mt-1 p-2.5 border border-slate-500 rounded-lg bg-white"
                required
              >
                <option value="">Select</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Unisex">Unisex</option>
                <option value="Unisex">Kids</option>
              </select>
            </div>

            <div className="flex items-center gap-6 self-end pb-3">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  name="metadata.bestseller"
                  onChange={handleChange}
                  checked={formData.metadata.bestseller}
                  className="w-5 h-5 rounded border-slate-500 text-cyan-600 focus:ring-cyan-500"
                />
                <span className="text-sm text-slate-700 font-medium group-hover:text-cyan-600">
                  Bestseller
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  name="metadata.newArrival"
                  onChange={handleChange}
                  checked={formData.metadata.newArrival}
                  className="w-5 h-5 rounded border-slate-500 text-cyan-600 focus:ring-cyan-500"
                />
                <span className="text-sm text-slate-700 font-medium group-hover:text-cyan-600">
                  New Arrival
                </span>
              </label>
            </div>
          </section>

          <button
            type="submit"
            className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg hover:shadow-xl transform active:scale-[0.95]"
          >
            Confirm and Add to Inventory
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
