import productModel from "../models/productModels.js";
import { v2 as cloudinary } from "cloudinary";

const addProduct = async (req, res) => {
  try {
    // 1. Destructure the fields sent by FormData
    const {
      name,
      description,
      price,
      category,
      subCategory,
      stock,
      sku,
      brand,
      specifications,
      metadata,
      currency,
    } = req.body;

    // 2. Access images from req.files (Object format for upload.fields)
    const image1 = req.files.image1 ? req.files.image1[0] : null;
    const image2 = req.files.image2 ? req.files.image2[0] : null;
    const image3 = req.files.image3 ? req.files.image3[0] : null;
    const image4 = req.files.image4 ? req.files.image4[0] : null;
    const image5 = req.files.image5 ? req.files.image5[0] : null;

    const imageFiles = [image1, image2, image3, image4, image5].filter(
      (item) => item !== null,
    );

    // 3. Upload to Cloudinary
    let imagesUrl = await Promise.all(
      imageFiles.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      }),
    );

    // 4. Prepare data for Database
    const productData = {
      name,
      description,
      sku,
      brand,
      category,
      subCategory,
      price: Number(price),
      stock: Number(stock),
      images: imagesUrl,
      currency: currency || "₹",
      // Parse strings back to objects
      specifications:
        typeof specifications === "string"
          ? JSON.parse(specifications)
          : specifications,
      metadata: typeof metadata === "string" ? JSON.parse(metadata) : metadata,
      date: Date.now(),
    };

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: "Product Added Successfully" });
  } catch (error) {
    console.log("Backend Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// Product list
const totalProductList = async (req, res) => {
  try {
    const products = await productModel.find({});

    res.json({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

//Update Single Product

const updateProduct = async (req, res) => {
  try {
    const { id, ...updates } = req.body; // Separate ID from the rest of the data

    // This block handles nested objects automatically
    const finalUpdate = {};
    for (const key in updates) {
      if (
        typeof updates[key] === "object" &&
        updates[key] !== null &&
        !Array.isArray(updates[key])
      ) {
        // If it's an object (like specifications), loop through it
        for (const nestedKey in updates[key]) {
          finalUpdate[`${key}.${nestedKey}`] = updates[key][nestedKey];
        }
      } else {
        // If it's a normal field (like price or name)
        finalUpdate[key] = updates[key];
      }
    }

    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      { $set: finalUpdate }, // $set ensures we only change what's provided
      { new: true, runValidators: true },
    );

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product Not Found" });
    }

    res.json({
      success: true,
      message: "Updated Successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// Delete Product
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({
      success: true,
      message: "Product removed Successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
// get single product
const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.body;
    const product = await productModel.findById(id);

    if (!product) {
      res.json({
        success: false,
        message: "Product Not Found",
      });
    }
    res.json({
      success: true,
      ProductData: product,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export {
  addProduct,
  totalProductList,
  updateProduct,
  removeProduct,
  getSingleProduct,
};
