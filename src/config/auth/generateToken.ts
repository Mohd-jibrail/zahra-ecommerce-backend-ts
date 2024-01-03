import  JsonWebToken from "jsonwebtoken"
import mongoose from "mongoose"
export const generateToken=(_id:typeof mongoose.Schema.ObjectId, email:string):String=>{
    return JsonWebToken.sign(_id,email,{expiresIn:"1d"});
}