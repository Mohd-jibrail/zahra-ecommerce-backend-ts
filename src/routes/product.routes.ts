import express from 'express'
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct,
} from '../controllers/product.controller.js'
export const productRoutes = express.Router()

productRoutes.route('/product').post(addProduct)
productRoutes.route('/product/:id').put(updateProduct).delete(deleteProduct).get(getProduct)
productRoutes.route('/products').get(getAllProducts)
