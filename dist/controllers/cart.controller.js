import { Product } from "../models/proudct.model.js";
import { Cart } from "../models/cart.model.js";
export const addToCart = async (req, res) => {
    const _id = req.params.id;
    try {
        const product = await Product.findById({ _id });
        if (!product) {
            res.status(400)
                .json({
                status: "Failed",
                message: "Product Not Found",
            });
        }
        await Cart.create({
            userId: req?.user?._id,
            productId: product?._id,
            productName: product?.name,
            productPrice: product?.price,
            productCount: 1
        });
        res.status(400)
            .json({
            status: "Success",
            message: "Product Added To Cart",
        });
    }
    catch (err) {
        res.status(400)
            .json({
            status: "Failed",
            message: "Technical Error",
        });
    }
};
