import { Request, Response } from 'express'
import { User } from '../models/user.model.js'
import JsonWebToken from 'jsonwebtoken'
import dotEnv from 'dotenv'
dotEnv.config()
export const signUp = async (req: Request, res: Response) => {
  const { email } = req.body
  try {
    const user = await User.findOne({ email })

    if (!user) {
      const newUser = await User.create(req.body)
      res.status(201).json({
        status: 'Success',
        message: 'User signedUp successfully',
        newUser,
      })
    } else {
      res.status(400).json({
        status: 'Failed',
        message: 'User already existed',
      })
    }
  } catch (error) {
    throw new Error('Error found')
  }
}

export const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })

    if (user && (await user.isPasswordMatched(password))) {
      const SECRATE_KEY = process.env.SECRATE_KEY
      if (!SECRATE_KEY) {
        throw new Error('SECRATE KEY NOT FOUND')
      }
      const token = JsonWebToken.sign({ _id: user._id }, SECRATE_KEY, { expiresIn: '1d' })
      console.log(token);
      res.status(200).cookie('token', token,{signed:true}).json({
        status: 'Success',
        message: 'signIn successfull',
      })
    } else if (user) {
      res.status(400).json({
        status: 'Failed',
        message: 'Wrong email or password',
      })
    } else {
      res.status(400).json({
        status: 'Failed',
        message: 'Not such user found',
      })
    }
  } catch (error) {
    throw new Error('Error Found')
  }
}
export const signOut = async (req: Request, res: Response) => {
  try {
    res.cookie('token', null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    res.status(200).json({
      status: 'Success',
      message: 'User log-out',
    })
  } catch (error) {
    throw new Error('Error Found')
  }
}
