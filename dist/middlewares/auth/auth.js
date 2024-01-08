import jsonWebToken from 'jsonwebtoken';
import { User } from '../../models/user.model.js';
import zod from 'zod';
const userSignIn = zod.object({
    email: zod.string().email(),
    password: zod.string().min(10).max(20),
});
export const isValidSignIn = (req, res, next) => {
    const isValidSignInResult = userSignIn.safeParse(req.body);
    if (!isValidSignInResult.success) {
        res.status(400).json({
            status: 'Failed',
            message: 'Validation failed',
            error: isValidSignInResult.error.errors,
        });
    }
    else {
        next();
    }
};
const userSignUp = zod.object({
    firstName: zod.string().refine((value) => /^[A-Za-z]+$/.test(value)),
    lastName: zod.string().refine((value) => /^[A-Za-z]+$/.test(value)),
    email: zod.string().min(10).max(20).email(),
    contact: zod
        .string()
        .regex(/^\d{10}$/)
        .min(10)
        .max(10),
    password: zod.string().min(10).max(20),
    gender: zod.string().refine((value) => ['male', 'female'].includes(value.toLowerCase())),
    dob: zod
        .string()
        .refine((value) => {
        const date = new Date(value);
        const currentDate = new Date();
        return currentDate.getFullYear() - date.getFullYear() >= 12;
    }, {
        message: 'Age mus be 12 or Older',
    })
        .optional(),
});
export const isValidSignUp = (req, res, next) => {
    const isValidSignInResult = userSignUp.safeParse(req.body);
    if (!isValidSignInResult.success) {
        res.status(400).json({
            status: 'Failed',
            message: 'Validation failed',
            error: isValidSignInResult.error.errors,
        });
    }
    else {
        next();
    }
};
export const isAuthenticatedUser = async (req, res, next) => {
    const tokenObj = req.cookies;
    if (!tokenObj) {
        res.status(404).json({
            status: 'Failed',
            message: 'User Not Authenticated',
        });
    }
    else {
        const SECRATE_KEY = process.env.SECRATE_KEY;
        if (!SECRATE_KEY) {
            throw new Error('SECRATE KEY NOT FOUND');
        }
        const decoded = jsonWebToken.verify(tokenObj.token, SECRATE_KEY);
        const user = await User.findById({ _id: decoded._id });
        if (user) {
            req.user = user;
        }
    }
    next();
};
export const isAdmin = async (req, res, next) => {
    const user = req.user;
    if (user && user.role == 'admin') {
        next();
    }
    else {
        res.status(400).json({
            status: 'Failed',
            message: 'Accedd denied',
        });
    }
};
