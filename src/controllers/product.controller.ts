import { Product } from '../models/proudct.model.js'
import { Request, Response } from 'express'

export const addProduct = async (req: Request, res: Response) => {
  try {
    const newProduct = await Product.create(req.body)
    if (!newProduct) {
      res.status(400).json({
        status: 'Failed',
        message: 'Something went wrong, try again',
      })
    } else {
      res.status(201).json({
        status: 'Success',
        message: 'Product Added Successfully',
        newProduct,
      })
    }
  } catch (err: any) {
    res.status(400).json({
      status: 'Failed',
      message: 'Technical Error',
    })
  }
}
export const updateProduct = async (req: Request, res: Response) => {
  const _id = req.params.id
  try {
    const prod = await Product.findByIdAndUpdate(
      { _id },
      {
        name: req?.body?.name,
        description: req?.body?.description,
        prodType: req?.body?.prodType,
        price: req?.body?.price,
        stock: req?.body?.stock,
      },
      {
        new: true,
        useFindAndModify: false,
      },
    )
    if (prod) {
      res.status(201).json({
        status: 'Success',
        message: 'Product Updated',
        prod,
      })
    } else {
      res.status(400).json({
        status: 'Failed',
        message: 'Product Not Found',
      })
    }
  } catch (error) {
    res.status(500).json({
      status: 'Failed',
      message: 'Technical error',
    })
  }
}
export const deleteProduct = async (req: Request, res: Response) => {
  const _id = req.params.id
  try {
    const prod = await Product.findByIdAndDelete({ _id })
    if (!prod) {
      res.status(400).json({
        status: 'Failed',
        message: 'Product Not Found',
      })
    } else {
      res.status(200).json({
        status: 'Success',
        message: 'Product Removed succssfully',
      })
    }
  } catch (error) {
    res.status(400).json({
      status: 'Failed',
      message: 'Technical Error',
    })
  }
}
export const getProduct = async (req: Request, res: Response) => {
  const _id = req.params.id
  try {
    const product = await Product.findById({ _id })
    if (!product) {
      res.status(200).json({
        status: 'Failed',
        message: 'Product Not Found',
      })
    } else {
      res.status(200).json({
        status: 'Success',
        message: 'Product Found',
        product,
      })
    }
  } catch (error) {
    res.status(500).json({
      status: 'Failed',
      message: 'Technical Error',
    })
  }
}
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find().select({ reviews: 0, __v: 0 })
    if (!products) {
      res.status(400).json({
        status: 'Failed',
        message: 'No Product Found',
      })
    } else {
      res.status(200).json({
        status: 'Success',
        message: 'All The Products',
        products,
      })
    }
  } catch (error) {
    res.status(200).json({
      status: 'Failed',
      message: 'Technical Error',
    })
  }
}
