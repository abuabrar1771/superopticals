import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    sku: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    subCategory: { type: String },
    description: { type: String },
    price: { type: Number, required: true },
    currency: { type: String, required: true },
    stock: { type: Number, required: true },
    images: [{ type: String, required: true }],
    specifications: {
        shape: { type: String, required: true },
        material: { type: String, required: true },
        size: { type: String, required: true },
        color: { type: String, required: true },
        dimensions: {
            lensWidth: { type: Number },
            bridgeWidth: { type: Number },
            templeLength: { type: Number },
        }
    },
    metadata: {
        gender: { type: String, required: true },
        warranty: { type: String, required: true },
        bestseller: { type: Boolean, default: false },
        newArrival: { type: Boolean, default: false },
    }
}, { 
    timestamps: true,
    minimize: false // Ensures empty objects are still saved to DB
});

// FORCE the collection name to 'products' by adding it as the 3rd argument
const productModel = mongoose.models.product || mongoose.model("product", productSchema, "products");

export default productModel;