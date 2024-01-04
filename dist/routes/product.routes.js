import express from "express";
import { addProduct } from "../controllers/product.controller.js";
export const productRoutes = express.Router();
productRoutes.route("/add").post(addProduct);
