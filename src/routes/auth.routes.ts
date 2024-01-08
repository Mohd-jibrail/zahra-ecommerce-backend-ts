import express from 'express'
import { signUp, signIn, signOut } from '../controllers/auth.controller.js'
import { isValidSignIn, isAuthenticatedUser, isValidSignUp } from '../middlewares/auth/auth.js'
export const authRoutes = express.Router()

authRoutes.route('/signUp').post(isValidSignUp, signUp)
authRoutes.route('/signIn').post(isValidSignIn, signIn)
authRoutes.route('/signOut').post(isAuthenticatedUser, signOut)
