import { User } from '../models/user.model.js';
import { Product } from '../models/proudct.model.js';
import JsonWebToken from 'jsonwebtoken';
export const signUp = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            const newUser = await User.create(req.body);
            res.status(201).json({
                status: 'Success',
                message: 'User signedUp successfully',
                newUser,
            });
        }
        else {
            res.status(400).json({
                status: 'Failed',
                message: 'User already existed',
            });
        }
    }
    catch (error) {
        throw new Error('Error found');
    }
};
export const signIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await user.isPasswordMatched(password))) {
            const SECRATE_KEY = process.env.SECRATE_KEY;
            if (!SECRATE_KEY) {
                throw new Error('SECRATE KEY NOT FOUND');
            }
            const token = JsonWebToken.sign({ _id: user._id }, SECRATE_KEY, { expiresIn: '1d' });
            if (user.role == 'admin') {
                ;
                req.session.token = token;
                res.status(200).json({
                    status: 'Success',
                    message: 'SignIn Successfull:: Admin',
                });
            }
            else {
                res.status(200).cookie('token', token, { signed: true }).json({
                    status: 'Success',
                    message: 'signIn successfull ',
                });
            }
        }
        else if (user) {
            res.status(400).json({
                status: 'Failed',
                message: 'Wrong email or password',
            });
        }
        else {
            res.status(400).json({
                status: 'Failed',
                message: 'Not such user found',
            });
        }
    }
    catch (error) {
        throw new Error('Error Found');
    }
};
export const signOut = async (req, res) => {
    try {
        res.cookie('token', null, {
            expires: new Date(Date.now()),
            httpOnly: true,
        });
        res.status(200).json({
            status: 'Success',
            message: 'User log-out',
        });
    }
    catch (error) {
        throw new Error('Error Found');
    }
};
/* User Address CRUD functionality implementation */
export const addToAddress = async (req, res) => {
    const _id = req?.user?._id;
    try {
        const user = await User.findById({ _id });
        if (user?.address && user?.address?.length > 0) {
            res.status(400).json({
                status: 'Success',
                message: 'Address is already added',
            });
        }
        else {
            const newAddress = {
                h_No: req.body.h_No,
                city: req.body.city,
                zipcode: req.body.zipcode,
                state: req.body.state,
            };
            if (user) {
                user.address.push(newAddress);
                user?.save();
            }
            else {
                throw new Error('User not found');
            }
            res.status(200).json({
                status: 'Success',
                message: 'Review Added',
            });
        }
    }
    catch (err) {
        res.status(500).json({
            status: 'Failed',
            message: 'Technical Error',
        });
    }
};
export const updateAddress = async (req, res) => {
    const _id = req.params.id;
    try {
        const user = await User.findOneAndUpdate({ 'address._id': _id }, {
            $set: {
                'address.$.h_No': req?.body?.h_No,
                'address.$.city': req?.body?.city,
                'address.$.zipcode': req?.body?.zipcode,
                'address.$.state': req?.body?.state,
            },
        }, { new: true });
        res.status(200).json({
            status: 'Success',
            message: 'Address Updated',
            user,
        });
    }
    catch (err) {
        res.status(200).json({
            status: 'Failed',
            message: 'Technical Error',
        });
    }
};
export const removeAddress = async (req, res) => {
    const _id = req?.user?._id;
    const _addressId = req.params.id;
    try {
        await User.findByIdAndUpdate({ _id }, {
            $pull: {
                address: { _id: _addressId },
            },
        }, { new: true });
        res.status(200).json({
            status: 'Success',
            message: 'Address Removed',
        });
    }
    catch (err) {
        res.status(500).json({
            status: 'Failed',
            message: 'Technical Error',
        });
    }
};
/* User Cart CRUD functionality implementation */
export const addToCart = async (req, res) => {
    const _id = req.params.id;
    const user = req?.user;
    try {
        const isProductAlreadyAddedToCart = user?.cart.some((cartItem) => JSON.stringify(cartItem.prodId) == JSON.stringify(_id));
        if (isProductAlreadyAddedToCart) {
            res.status(404).json({
                status: 'Success',
                message: 'Product already added to Cart',
            });
        }
        else {
            const product = await Product.findById({ _id });
            if (!product) {
                res.status(404).json({
                    status: 'Success',
                    message: 'Product Not found',
                });
            }
            else {
                const newCart = {
                    prodId: product?._id,
                    name: product?.name,
                    price: product?.price,
                    count: 1,
                };
                const user = await User.findById({ _id: req?.user?._id });
                user?.cart.push(newCart);
                user?.save();
                res.status(404).json({
                    status: 'Success',
                    message: 'Product Added to Cart',
                });
            }
        }
    }
    catch (err) {
        res.status(500).json({
            status: 'Failed',
            message: 'Technical Error',
            error: err,
        });
    }
};
export const removeFromCart = async (req, res) => {
    const _id = req.params.id;
    const user = req?.user;
    try {
        const isProductAlreadyRemovedCart = user?.cart.some((cartItem) => JSON.stringify(cartItem.prodId) == JSON.stringify(_id));
        if (!isProductAlreadyRemovedCart) {
            res.status(404).json({
                status: 'Success',
                message: 'Product already Removed from Cart',
            });
        }
        else {
            await User.findOneAndUpdate({ 'cart.prodId': _id }, {
                $pull: {
                    cart: { prodId: _id },
                },
            }, { new: true });
            res.status(200).json({
                status: 'Success',
                message: 'Product removed from Cart',
            });
        }
    }
    catch (err) {
        res.status(500).json({
            status: 'Failed',
            message: 'Technical Error',
        });
    }
};
