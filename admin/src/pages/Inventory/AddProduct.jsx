import React, { useEffect, useState } from "react";
import {
  HiOutlineCloudUpload,
  HiOutlineTrash,
  HiPlus,
  HiTrash,
} from "react-icons/hi";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { categoryMap, colorOptions } from "../../App";

const AddProduct = ({ token }) => {
  const [color, setColor] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const mainCategories = Object.keys(categoryMap);

  const [category, setCategory] = useState(mainCategories[0]);
  const [subCategory, setSubCategory] = useState(
    categoryMap[mainCategories[0]][0],
  );
  const [images, setImages] = useState([]);

  // Managed template for local nested variations
  const [variantList, setVariantList] = useState([]);

  const emptyForm = {
    sku: "",
    name: "",
    brand: "",
    category: mainCategories[0],
    subCategory: categoryMap[mainCategories[0]][0],
    description: "",
    price: "",
    currency: "INR",
    stock: "",
    minStockAlert: "3",
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
  };

  const [formData, setFormData] = useState(emptyForm);

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

  // Helper logic to see if matrix tracking is required
  const isPrescriptionCategory =
    category === "Lenses" || category === "Contact Lenses";

  useEffect(() => {
    const fetchGeneratedSKU = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/product/next-sku",
        );
        if (response.data.success) {
          setFormData((prev) => ({ ...prev, sku: response.data.sku }));
        }
      } catch (error) {
        console.error("Error pre-fetching SKU:", error);
      }
    };
    fetchGeneratedSKU();
  }, []);

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
    const firstSub = categoryMap[selectedCategory]?.[0] || "";
    setSubCategory(firstSub);

    setFormData((prev) => ({
      ...prev,
      category: selectedCategory,
      subCategory: firstSub,
    }));

    // If switching to prescription, seed an initial blank variant matrix row
    if (
      selectedCategory === "Lenses" ||
      selectedCategory === "Contact Lenses"
    ) {
      setVariantList([
        {
          sku: "",
          stock: "0",
          specifications: {
            sphere: "",
            cylinder: "",
            axis: "",
            baseCurve: "",
            diameter: "",
            addition: "",
          },
        },
      ]);
    } else {
      setVariantList([]);
    }
  };

  const handleSelect = (name) => {
    const selectedColor = name.toUpperCase();
    setColor(selectedColor);
    setFormData((prev) => ({
      ...prev,
      specifications: { ...prev.specifications, color: selectedColor },
    }));
    setIsOpen(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;

    if (name.includes(".")) {
      const keys = name.split(".");
      setFormData((prev) => {
        let updated = JSON.parse(JSON.stringify(prev));
        if (keys.length === 3) {
          if (!updated[keys[0]][keys[1]]) updated[keys[0]][keys[1]] = {};
          updated[keys[0]][keys[1]][keys[2]] = val;
        } else {
          if (!updated[keys[0]]) updated[keys[0]] = {};
          updated[keys[0]][keys[1]] = val;
        }
        return updated;
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: val }));
    }
  };

  // Matrix form changes helper
  const handleVariantChange = (index, field, subField, value) => {
    setVariantList((prev) => {
      const updated = [...prev];
      if (subField) {
        updated[index].specifications[subField] = value;
      } else {
        updated[index][field] = value;
      }
      return updated;
    });
  };

  const addVariantRow = () => {
    setVariantList((prev) => [
      ...prev,
      {
        sku: "",
        stock: "0",
        specifications: {
          sphere: "",
          cylinder: "",
          axis: "",
          baseCurve: "",
          diameter: "",
          addition: "",
        },
      },
    ]);
  };

  const removeVariantRow = (index) => {
    setVariantList((prev) => prev.filter((_, i) => i !== index));
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
    
    // 1. Initialize the loading status indicator immediately
    const toastId = toast.loading("Uploading product...");
    
    // Fallback definition for backend url string path matching
    const backendUrl = "http://localhost:4000"; 
// 🌟 FIX: Force your form to look for the explicit adminToken first so customer sessions can't hijack it
const activeToken = localStorage.getItem("adminToken") || localStorage.getItem("token") || token || "";

    try {
      const data = new FormData();

      // 2. Safely Append Top-Level Core Strings
      data.append("sku", formData?.sku || "");
      data.append("name", formData?.name || "");
      data.append("brand", formData?.brand || "");
      data.append("category", category || ""); 
      data.append("subCategory", subCategory || "");
      data.append("price", formData?.price || "0");
      data.append("currency", formData?.currency || "INR");
      data.append("description", formData?.description || "");
      data.append("minStockAlert", formData?.minStockAlert || "3");
      data.append("stock", isPrescriptionCategory ? "0" : (formData?.stock || "0"));

      // 🌟 STRUCTURAL FIX 1: Map specifications using Optional Chaining to prevent undefined object extraction crashes
      const safeSpecifications = {
        shape: formData?.specifications?.shape || "",
        material: formData?.specifications?.material || "",
        size: formData?.specifications?.size || "",
        color: color || "", 
        dimensions: {
          lensWidth: formData?.specifications?.dimensions?.lensWidth || undefined,
          bridgeWidth: formData?.specifications?.dimensions?.bridgeWidth || undefined,
          templeLength: formData?.specifications?.dimensions?.templeLength || undefined,
        }
      };
      // Pack object array payload metadata directly as regular flat text strings so Multer does not split them
      data.append("specifications", JSON.stringify(safeSpecifications));

      // Map metadata settings safely
      const safeMetadata = {
        gender: formData?.metadata?.gender || "Unisex",
        warranty: formData?.metadata?.warranty || "No Warranty",
        bestseller: !!formData?.metadata?.bestseller,
        newArrival: !!formData?.metadata?.newArrival,
      };
      data.append("metadata", JSON.stringify(safeMetadata));

      // Append Matrix rows tracking parameters array if working with prescription items (Lenses / Contacts)
      if (isPrescriptionCategory && Array.isArray(variantList)) {
        data.append("variants", JSON.stringify(variantList));
      }

      // 3. Append physical raw image instances safely if present
      if (Array.isArray(images)) {
        images.forEach((img, index) => {
          if (img?.file) {
            data.append(`image${index + 1}`, img.file);
          }
        });
      }

      // 🌟 STRUCTURAL FIX 2: Prioritize token extraction tracking strings from Admin Storage Keys first
      const activeToken = localStorage.getItem("adminToken") || localStorage.getItem("token") || token || "";

      console.log("Data Payload Assembly Completed. Submitting to server...");

      // 4. Send asynchronous request bundle with explicit timeout safety constraints
      const response = await axios.post(`${backendUrl}/api/product/add`, data, {
        timeout: 20000, // Forces timeout drop out if Cloudinary / server blocks indefinitely
        headers: {
          "Content-Type": "multipart/form-data",
          token: activeToken, // Passes standard tracking string verification field to req.headers.token
          Authorization: `Bearer ${activeToken}` // Production standard format fallback string
        },
      });

      // 5. Evaluate response success patterns
      if (response.data && response.data.success) {
        toast.dismiss(toastId); // Clear loading spinner
        toast.success("Added Product Details Successfully!");

        // Safely reset form input elements back to initial empty arrays/objects
        setFormData({ ...emptyForm });
        setImages([]);
        setColor("");
        if (typeof setVariantList === "function") {
          setVariantList([]);
        }

        // Calculate and fetch next SKU state dynamically right after successful addition
        const lastSku = response.data.sku || formData.sku;
        const lastNumber = parseInt(lastSku.split("-")[1]) || 0;
        const nextSku = `SO-${(lastNumber + 1).toString().padStart(4, "0")}`;
        
        setFormData(prev => ({ ...emptyForm, sku: nextSku }));

      } else {
        // Handle explicit backend functional failure branches without freezing
        toast.dismiss(toastId);
        toast.error(response.data?.message || "Failed to commit inventory additions.");
      }

    } catch (error) {
      console.error("CRITICAL FRONTEND SUBMIT BLOCK CRASH:", error);
      
      // 🌟 STRUCTURAL FIX 3: Unconditional spinner dismissal callback path
      toast.dismiss(toastId); 

      let userDisplayError = "Network connection timeout: Server layer took too long to respond.";
      if (error.response && error.response.data && error.response.data.message) {
        userDisplayError = error.response.data.message;
      } else if (error.message) {
        userDisplayError = error.message;
      }

      toast.error(userDisplayError);
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
            Manage your SuperOpticals inventory aligned with DB Schema rules.
          </p>
        </div>

        <div className="p-6 space-y-8">
          {/* Gallery Row */}
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

          {/* Primary Info Rows */}
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
                placeholder="e.g. CatEye Computer Glasses for men"
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
                readOnly
                className="w-full mt-1 p-2.5 border border-slate-300 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed"
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-slate-700">
                Product Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full mt-1 p-2.5 border border-slate-500 rounded-lg outline-none"
                placeholder="Describe your lenses, prescription elements, or custom features..."
              />
            </div>
          </section>

          {/* Categorization and Base Parameters */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
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
                Sub-Category
              </label>
              <select
                value={subCategory}
                onChange={(e) => {
                  setSubCategory(e.target.value);
                  setFormData((prev) => ({
                    ...prev,
                    subCategory: e.target.value,
                  }));
                }}
                className="w-full mt-1 p-2.5 border border-slate-500 rounded-lg bg-white"
                required
              >
                {(categoryMap[category] || []).map((sub) => (
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
                required
                placeholder="650"
              />
            </div>
            {!isPrescriptionCategory ? (
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
                  required={!isPrescriptionCategory}
                  placeholder="3"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-slate-400">
                  Stock Units
                </label>
                <input
                  disabled
                  className="w-full mt-1 p-2.5 border border-slate-200 text-slate-400 bg-slate-50 rounded-lg cursor-not-allowed"
                  value="Tracked via Matrix"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Min Stock Alert
              </label>
              <input
                type="number"
                name="minStockAlert"
                value={formData.minStockAlert}
                onChange={handleChange}
                className="w-full mt-1 p-2.5 border border-slate-500 rounded-lg"
              />
            </div>
          </section>

          {/* DYNAMIC VARIANT MATRIX SECTION FOR LENSES & CONTACTS */}
          {isPrescriptionCategory && (
            <section className="p-5 bg-cyan-50 border border-cyan-200 rounded-xl space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-cyan-800 uppercase tracking-wider">
                    Prescription Variation Matrix
                  </h3>
                  <p className="text-xs text-cyan-600">
                    Map specific inventory directly to physical correction
                    targets.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addVariantRow}
                  className="flex items-center gap-1 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold py-2 px-3 rounded-md"
                >
                  <HiPlus /> Add Target Row
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="border-b border-cyan-200 text-xs text-cyan-700 font-bold bg-cyan-100/50">
                      <th className="p-2">Variant SKU (Opt)</th>
                      <th className="p-2 w-20">Stock</th>
                      <th className="p-2">SPH (Sphere)</th>
                      <th className="p-2">CYL (Cyl)</th>
                      <th className="p-2">AXIS</th>
                      <th className="p-2">BC (Base Curve)</th>
                      <th className="p-2">DIA (Diam.)</th>
                      <th className="p-2">ADD (Progressive)</th>
                      <th className="p-2 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {variantList.map((variant, index) => (
                      <tr
                        key={index}
                        className="border-b border-cyan-100 text-sm hover:bg-cyan-100/30"
                      >
                        <td className="p-1">
                          <input
                            type="text"
                            placeholder="Auto-generated"
                            value={variant.sku}
                            onChange={(e) =>
                              handleVariantChange(
                                index,
                                "sku",
                                null,
                                e.target.value,
                              )
                            }
                            className="w-full p-1.5 border border-slate-300 rounded text-xs"
                          />
                        </td>
                        <td className="p-1">
                          <input
                            type="number"
                            required
                            value={variant.stock}
                            onChange={(e) =>
                              handleVariantChange(
                                index,
                                "stock",
                                null,
                                e.target.value,
                              )
                            }
                            className="w-full p-1.5 border border-slate-300 rounded text-xs"
                          />
                        </td>
                        <td className="p-1">
                          <input
                            type="text"
                            placeholder="-2.50"
                            value={variant.specifications.sphere}
                            onChange={(e) =>
                              handleVariantChange(
                                index,
                                "specifications",
                                "sphere",
                                e.target.value,
                              )
                            }
                            className="w-full p-1.5 border border-slate-300 rounded text-xs"
                          />
                        </td>
                        <td className="p-1">
                          <input
                            type="text"
                            placeholder="-1.25"
                            value={variant.specifications.cylinder}
                            onChange={(e) =>
                              handleVariantChange(
                                index,
                                "specifications",
                                "cylinder",
                                e.target.value,
                              )
                            }
                            className="w-full p-1.5 border border-slate-300 rounded text-xs"
                          />
                        </td>
                        <td className="p-1">
                          <input
                            type="text"
                            placeholder="180"
                            value={variant.specifications.axis}
                            onChange={(e) =>
                              handleVariantChange(
                                index,
                                "specifications",
                                "axis",
                                e.target.value,
                              )
                            }
                            className="w-full p-1.5 border border-slate-300 rounded text-xs"
                          />
                        </td>
                        <td className="p-1">
                          <input
                            type="text"
                            placeholder="8.6"
                            value={variant.specifications.baseCurve}
                            onChange={(e) =>
                              handleVariantChange(
                                index,
                                "specifications",
                                "baseCurve",
                                e.target.value,
                              )
                            }
                            className="w-full p-1.5 border border-slate-300 rounded text-xs"
                          />
                        </td>
                        <td className="p-1">
                          <input
                            type="text"
                            placeholder="14.2"
                            value={variant.specifications.diameter}
                            onChange={(e) =>
                              handleVariantChange(
                                index,
                                "specifications",
                                "diameter",
                                e.target.value,
                              )
                            }
                            className="w-full p-1.5 border border-slate-300 rounded text-xs"
                          />
                        </td>
                        <td className="p-1">
                          <input
                            type="text"
                            placeholder="+1.50"
                            value={variant.specifications.addition}
                            onChange={(e) =>
                              handleVariantChange(
                                index,
                                "specifications",
                                "addition",
                                e.target.value,
                              )
                            }
                            className="w-full p-1.5 border border-slate-300 rounded text-xs"
                          />
                        </td>
                        <td className="p-1 text-center">
                          <button
                            type="button"
                            disabled={variantList.length === 1}
                            onClick={() => removeVariantRow(index)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded disabled:opacity-30"
                          >
                            <HiTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Technical Specifications Subform */}
          <section className="p-5 bg-slate-50 rounded-xl space-y-4 border border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Physical & Framework Specifications
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <label className="text-xs text-slate-500 font-semibold">
                  Brand
                </label>
                <select
                  name="brand"
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
                  value={formData.specifications?.shape || ""}
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
                  value={formData.specifications?.size || ""}
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
                  name="specifications.material"
                  value={formData.specifications?.material || ""}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border border-slate-500 rounded-md bg-white"
                >
                  <option value="">Select</option>
                  {MATERIAL.map((m) => (
                    <option key={m} value={m.toUpperCase()}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <label className="text-xs text-slate-500 font-semibold mb-1 block">
                  Select Color
                </label>
                <div
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-full mt-1 p-2 border border-slate-500 rounded-md flex items-center justify-between cursor-pointer bg-white"
                >
                  <span
                    className={
                      color ? "text-black text-xs" : "text-gray-400 text-xs"
                    }
                  >
                    {color ? color : "Select Color"}
                  </span>
                  <span>▼</span>
                </div>
                {isOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-[200px] overflow-y-auto left-0">
                    {colorOptions.map((item) => (
                      <div
                        key={item.name}
                        onClick={() => handleSelect(item.name)}
                        className="flex items-center gap-2 p-2 hover:bg-slate-50 border-b border-slate-50 cursor-pointer text-xs"
                      >
                        <div
                          style={{ background: item.code }}
                          className="w-4 h-4 rounded-full border border-slate-200 shrink-0"
                        />
                        <span>{item.name}</span>
                        {color === item.name.toUpperCase() && (
                          <span className="ml-auto text-blue-600 font-bold">
                            ✓
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Physical Frame Measurements Block */}
              <div className="col-span-2 md:col-span-5 grid grid-cols-3 gap-4 pt-4 border-t border-dashed border-slate-200">
                <div>
                  <label className="text-xs text-slate-500 font-semibold">
                    Lens Width (mm)
                  </label>
                  <input
                    type="number"
                    name="specifications.dimensions.lensWidth"
                    value={formData.specifications?.dimensions?.lensWidth || ""}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 border border-slate-300 rounded-md text-xs"
                    placeholder="e.g. 52"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 font-semibold">
                    Bridge Width (mm)
                  </label>
                  <input
                    type="number"
                    name="specifications.dimensions.bridgeWidth"
                    value={
                      formData.specifications?.dimensions?.bridgeWidth || ""
                    }
                    onChange={handleChange}
                    className="w-full mt-1 p-2 border border-slate-300 rounded-md text-xs"
                    placeholder="e.g. 18"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 font-semibold">
                    Temple Length (mm)
                  </label>
                  <input
                    type="number"
                    name="specifications.dimensions.templeLength"
                    value={
                      formData.specifications?.dimensions?.templeLength || ""
                    }
                    onChange={handleChange}
                    className="w-full mt-1 p-2 border border-slate-300 rounded-md text-xs"
                    placeholder="e.g. 145"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Target Metadata Options */}
          <section className="flex flex-wrap items-center gap-6 border-t border-slate-100 pt-6">
            <div className="flex flex-col min-w-[180px]">
              <label className="text-sm font-medium text-slate-700">
                Target Gender
              </label>
              <select
                name="metadata.gender"
                value={formData.metadata?.gender || ""}
                onChange={handleChange}
                className="mt-1 p-2.5 border border-slate-500 rounded-lg bg-white"
                required
              >
                <option value="">Select</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Unisex">Unisex</option>
                <option value="Kids">Kids</option>
              </select>
            </div>
            <div className="flex flex-col min-w-[180px]">
              <label className="text-sm font-medium text-slate-700">
                Warranty Period
              </label>
              <select
                name="metadata.warranty"
                value={formData.metadata?.warranty || ""}
                onChange={handleChange}
                className="mt-1 p-2.5 border border-slate-500 rounded-lg bg-white"
                required
              >
                <option value="">Select</option>
                <option value="No Warranty">No Warranty</option>
                <option value="6 Months">6 Months</option>
                <option value="1 Year">1 Year</option>
                <option value="2 Years">2 Years</option>
              </select>
            </div>

            <div className="flex items-center gap-6 self-end pb-3 ml-auto">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  name="metadata.bestseller"
                  onChange={handleChange}
                  checked={formData.metadata?.bestseller || false}
                  className="w-5 h-5 rounded border-slate-500 text-cyan-600"
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
                  checked={formData.metadata?.newArrival || false}
                  className="w-5 h-5 rounded border-slate-500 text-cyan-600"
                />
                <span className="text-sm text-slate-700 font-medium group-hover:text-cyan-600">
                  New Arrival
                </span>
              </label>
            </div>
          </section>

          <button
            type="submit"
            className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg active:scale-[0.98]"
          >
            Confirm and Add to Inventory
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
