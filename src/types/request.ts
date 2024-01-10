import { Request } from 'express'
import { SessionData } from 'express-session'
import { IUser } from '../models/user.model.js'
export interface jwtpayload {
  _id: string
  iat: number
  exp: number
}
export interface CustomRequest extends Request {
  user?: IUser
}
export interface CustomSessionData extends SessionData {
  token?: string
}
