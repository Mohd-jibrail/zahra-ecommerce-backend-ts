import { Request, Response } from 'express'
import { User } from '../models/user.model.js'
import JsonWebToken from 'jsonwebtoken'
import { CustomRequest, CustomSessionData } from '../types/request.js'

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

      if (user.role == 'admin') {
        ;(req.session as CustomSessionData).token = token
        res.status(200).json({
          status: 'Success',
          message: 'SignIn Successfull:: Admin',
        })
      } else {
        res.status(200).cookie('token', token, { signed: true }).json({
          status: 'Success',
          message: 'signIn successfull ',
        })
      }
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
export const addToAddress = async (req: CustomRequest, res: Response) => {
  const _id = req?.user?._id
  try {
    const user = await User.findById({ _id })
    if (user?.address && user?.address?.length > 0) {
      res.status(400).json({
        status: 'Success',
        message: 'Address is already added',
      })
    } else {
      const newAddress = {
        h_No: req.body.h_No,
        city: req.body.city,
        zipcode: req.body.zipcode,
        state: req.body.state,
      }
      if (user) {
        user.address.push(newAddress)
        user?.save()
      } else {
        throw new Error('User not found')
      }
      res.status(200).json({
        status: 'Success',
        message: 'Review Added',
      })
    }
  } catch (err) {
    res.status(500).json({
      status: 'Failed',
      message: 'Technical Error',
    })
  }
}
export const updateAddress = async (req: CustomRequest, res: Response) => {
  const _id = req.params.id
  try {
    const user = await User.findOneAndUpdate(
      { 'address._id': _id },
      {
        $set: {
          'address.$.h_No': req?.body?.h_No,
          'address.$.city': req?.body?.city,
          'address.$.zipcode': req?.body?.zipcode,
          'address.$.state': req?.body?.state
        },
      },{new:true}
    )
    res.status(200).json({
      status: 'Success',
      message: 'Address Updated',
      user
    })
  } catch (err) {
    res.status(200).json({
      status: 'Failed',
      message: 'Technical Error',
    })
  }
}
export const removeAddress = async (req: CustomRequest, res: Response) => {
  const _id = req?.user?._id
  const _addressId = req.params.id
  try{
    await User.findByIdAndUpdate({_id},{
      $pull:{
        address:{_id:_addressId}
      }
    },{new:true})

    res.status(200).json({
      status: 'Success',
      message: 'Address Removed',
    })
  } catch (err) {
    res.status(500).json({
      status: 'Failed',
      message: 'Technical Error',
    })
  }
}
