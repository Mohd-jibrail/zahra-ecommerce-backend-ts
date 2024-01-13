import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
export interface IUser extends Document {
  _id: string
  firstName: string
  lastName: string
  email: string
  contact: string
  password: string
  gender: 'male' | 'female'
  role: 'user' | 'admin'
  dob: Date
  address: [
    {
      h_No: string
      city: string
      zipcode: string
      state: string
    },
  ]
  cart: [
    {
      prodId: string
      name: string
      price: number
      count: number
    },
  ]
  createdAt: Date
  updatedAt: Date
  age: number /*virtua element*/
  isPasswordMatched(enterPassword: string): Promise<boolean>
}
const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, require: true },
    lastName: { type: String, require: true },
    email: { type: String, require: true },
    contact: { type: Number, require: true },
    password: { type: String, require: true },
    gender: { type: String, enum: ['male', 'female'], require: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    dob: { type: Date, require: true },
    address: [
      {
        h_No: { type: String, require: true },
        city: { type: String, require: true },
        zipcode: { type: Number, require: true },
        state: { type: String, require: true },
      },
    ],
    cart: [
      {
        prodId: { type: mongoose.Schema.ObjectId, ref: 'Product' },
        name: { type: String, require: true },
        price: { type: Number, require: true },
        count: { type: Number, require: true },
      },
    ],
  },
  { timestamps: true },
)
userSchema.pre<IUser>('save', async function () {
  const salt = await bcrypt.genSaltSync(10)
  this.password = await bcrypt.hash(this.password, salt)
})
userSchema.methods.isPasswordMatched = async function (enterPassword: string): Promise<boolean> {
  return await bcrypt.compare(enterPassword, this.password)
}
userSchema.virtual('age').get(function (this: IUser) {
  const today = new Date()
  const dob = this.dob
  let age = today.getFullYear() - dob.getFullYear()

  if (today.getMonth() < dob.getMonth() || (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) {
    age--
  }
  return age
})

export const User = mongoose.model<IUser>('User', userSchema)
