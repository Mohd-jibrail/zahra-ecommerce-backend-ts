import express from 'express';
import { addProduct, deleteProduct, getAllProducts, getProduct, updateProduct, } from '../controllers/product.controller.js';
import { isAuthenticatedUser, isAdmin } from '../middlewares/auth/auth.js';
export const productRoutes = express.Router();
productRoutes.route('/product').post(isAuthenticatedUser, isAdmin, addProduct);
productRoutes
    .route('/product/:id')
    .put(isAuthenticatedUser, isAdmin, updateProduct)
    .delete(isAuthenticatedUser, isAdmin, deleteProduct)
    .get(getProduct);
productRoutes.route('/products').get(getAllProducts);
