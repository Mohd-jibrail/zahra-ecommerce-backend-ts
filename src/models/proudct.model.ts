import mongoose from 'mongoose'
interface IProduct extends Document {
  name: string
  description: string
  price: number
  ratings: number
  isAvailable: boolean
  createdAt: Date
  updatedAt: Date
}
const productSchema = new mongoose.Schema(
  {
    name: { type: String, require: true },
    description: { type: String, require: true },
    price: { type: Number, require: true },
    ratings: { type: Number, require: true },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true },
)
export const Product = mongoose.model<IProduct>('Product', productSchema)
