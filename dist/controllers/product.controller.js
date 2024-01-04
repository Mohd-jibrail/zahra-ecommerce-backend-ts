import { Product } from "../models/proudct.model.js";
export const addProduct = async (req, res) => {
    const newProduct = await Product.create(req.body);
    res.status(201)
        .json({
        status: "Success",
        message: "Product Added",
        newProduct
    });
};
