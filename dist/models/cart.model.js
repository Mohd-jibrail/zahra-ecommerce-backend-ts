import mongoose from "mongoose";
const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.ObjectId, ref: "User" },
    productId: { type: mongoose.Schema.ObjectId, ref: "Product" },
    productName: { type: String, require: true },
    productPrice: { type: Number, require: true },
    productCount: { type: Number, default: 1 },
});
export const Cart = mongoose.model("Cart", cartSchema);
