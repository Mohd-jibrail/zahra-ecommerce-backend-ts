import { Response, Request, NextFunction } from 'express'
import jsonWebToken from 'jsonwebtoken'
import { User } from '../../models/user.model.js'
import { jwtpayload, CustomRequest, CustomSessionData } from '../../types/request.js'
import zod from 'zod'

const userSignIn = zod.object({
  email: zod.string().email(),
  password: zod.string().min(10).max(20),
})
export const isValidSignIn = (req: Request, res: Response, next: NextFunction) => {
  const isValidSignInResult = userSignIn.safeParse(req.body)
  if (!isValidSignInResult.success) {
    res.status(400).json({
      status: 'Failed',
      message: 'Validation failed',
      error: isValidSignInResult.error.errors,
    })
  } else {
    next()
  }
}
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
    .refine(
      (value) => {
        const date = new Date(value)
        const currentDate = new Date()
        return currentDate.getFullYear() - date.getFullYear() >= 12
      },
      {
        message: 'Age mus be 12 or Older',
      },
    )
    .optional(),
})
export const isValidSignUp = (req: Request, res: Response, next: NextFunction) => {
  const isValidSignInResult = userSignUp.safeParse(req.body)
  if (!isValidSignInResult.success) {
    res.status(400).json({
      status: 'Failed',
      message: 'Validation failed',
      error: isValidSignInResult.error.errors,
    })
  } else {
    next()
  }
}

export const isAuthenticatedUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const signedCookieToken = req.signedCookies.token
  const sessionToken = (req.session as CustomSessionData).token

  if (!signedCookieToken && !sessionToken?.trim()) {
    res.status(404).json({
      status: 'Failed',
      message: 'User Not Authenticated',
    })
  } else {
    const SECRATE_KEY = process.env.SECRATE_KEY
    if (!SECRATE_KEY) {
      throw new Error('SECRATE KEY NOT FOUND')
    }
    const token = signedCookieToken || sessionToken
    const decoded = jsonWebToken.verify(token, SECRATE_KEY) as jwtpayload
    const user = await User.findById({ _id: decoded._id })
    if (user) {
      req.user = user
    }
    next()
  }
}
export const isAdmin = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const user = req.user

  if (user && user.role == 'admin') {
    next()
  } else {
    res.status(400).json({
      status: 'Failed',
      message: 'Accedd denied',
    })
  }
}
