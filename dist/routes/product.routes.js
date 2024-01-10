import express from 'express';
import { addProduct, addReview, deleteProduct, deleteReview, getAllProducts, getProduct, updateProduct, updateReview, getAllReviews, } from '../controllers/product.controller.js';
import { isAuthenticatedUser, isAdmin } from '../middlewares/auth/auth.js';
export const productRoutes = express.Router();
productRoutes.route('/product').post(isAuthenticatedUser, isAdmin, addProduct);
productRoutes
    .route('/product/:id')
    .put(isAuthenticatedUser, isAdmin, updateProduct)
    .delete(isAuthenticatedUser, isAdmin, deleteProduct)
    .get(getProduct);
productRoutes.route('/products').get(getAllProducts);
/*Product-reviews routes*/
productRoutes.route('/review/:id').post(isAuthenticatedUser, addReview);
productRoutes
    .route('/review/:id')
    .put(isAuthenticatedUser, updateReview)
    .delete(isAuthenticatedUser, deleteReview)
    .get(isAuthenticatedUser, getAllReviews);
