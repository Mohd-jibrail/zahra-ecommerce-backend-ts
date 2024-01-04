import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    name: { type: String, require: true },
    description: { type: String, require: true },
    price: { type: Number, require: true },
    ratings: { type: Number, require: true },
    isAvailable: { type: Boolean, default: true },
}, { timestamps: true });
export const Product = mongoose.model("Product", productSchema);
