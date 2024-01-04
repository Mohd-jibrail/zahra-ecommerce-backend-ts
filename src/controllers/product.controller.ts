import { Product } from '../models/proudct.model.js'
import { Request, Response } from 'express'
export const addProduct = async (req: Request, res: Response) => {
  const newProduct = await Product.create(req.body)
  res.status(201).json({
    status: 'Success',
    message: 'Product Added',
    newProduct,
  })
}
