import mongoose from 'mongoose';
const productSchema = new mongoose.Schema({
    name: { type: String, require: true },
    description: { type: String, require: true },
    prodType: { type: String, require: true },
    price: { type: Number, require: true },
    stock: { type: Number, default: 5 },
    ratings: { type: Number, require: true },
    isAvailable: { type: Boolean, default: true },
    reviews: [
        {
            userId: { type: mongoose.Schema.ObjectId, ref: 'User' },
            comments: { type: String, require: true },
            rating: { type: Number, require: true },
            recommend: { type: Boolean, default: false },
        },
    ],
}, { timestamps: true });
export const Product = mongoose.model('Product', productSchema);
