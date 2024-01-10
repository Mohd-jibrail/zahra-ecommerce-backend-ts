import { Product } from '../models/proudct.model.js'
import { Request, Response } from 'express'
import { CustomRequest } from '../types/request.js'

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
export const addReview = async (req: CustomRequest, res: Response) => {
  const product_id = req.params.id
  const product = await Product.findById({ _id: product_id })
  const isReviewAlreadyAdded = product?.reviews.some(
    (review) => JSON.stringify(review.userId) == JSON.stringify(req.user?._id),
  )
  if (isReviewAlreadyAdded) {
    res.status(200).json({
      status: 'Failed',
      message: 'Reviewd already added',
    })
  } else {
    if (req.user?._id) {
      const review = {
        userId: req.user?._id,
        comments: req?.body?.comments,
        rating: req?.body?.rating,
        recommend: req?.body?.recommend,
      }
      if (product) {
        product.reviews.push(review)
        product?.save()
      } else {
        throw new Error('Product not found')
      }
      res.status(200).json({
        status: 'Success',
        message: 'Review Added',
      })
    }
  }
}
export const updateReview = async (req: CustomRequest, res: Response) => {
  const _id = req.params.id
  try {
    await Product.findOneAndUpdate(
      { 'reviews._id': _id },
      {
        $set: {
          //'reviews.$.comments': req?.body?.comments,
          'reviews?.$.rating': req?.body?.rating,
          'reviews?.$.recommend': req?.body?.recommend,
        },
      },
    )
    res.status(200).json({
      status: 'Success',
      message: 'Review Updated',
    })
  } catch (err) {
    res.status(200).json({
      status: 'Failed',
      message: 'Technical Error',
    })
  }
}
export const deleteReview = async (req: CustomRequest, res: Response) => {
  const _id = req.params.id
  try {
    await Product.findOneAndUpdate(
      { 'reviews._id': _id },
      {
        $pull: {
          reviews: { _id: _id },
        },
      },
      { new: true },
    )
    res.status(200).json({
      status: 'Success',
      message: 'Review Deleted',
    })
  } catch (err) {
    res.status(500).json({
      status: 'Failed',
      message: 'Technical Error',
    })
  }
}
export const getAllReviews = async (req: CustomRequest, res: Response) => {
  const prodcut_id = req.params.id
  const reviewsObj = await Product.findOne({ _id: prodcut_id }).select({ reviews: 1, _id: 0 })
  res.status(200).json({
    status: 'Success',
    message: 'All Reviews',
    reviewsObj,
  })
}
