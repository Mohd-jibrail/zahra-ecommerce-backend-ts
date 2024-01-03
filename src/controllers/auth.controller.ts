import { Request, Response } from "express";
import { User } from "../models/user.model.js";
import cookie from "cookies";
import JsonWebToken from "jsonwebtoken";
export const signUp = async(req:Request,res:Response)=>{
    try{
        const {email} = req.body;
        const user = await User.findOne({email});
        if(!user){
            const newUser = await User.create(req.body);
            res.status(201)
               .json({
                status:"Success",
                message:"User signedUp successfully",
                newUser
               });
        }

    }catch(error){
        throw new Error("Error Found");
    }
}
export const signIn = async(req:Request,res:Response)=>{
    const {email,password} = req.body;
    if(!email || !password){
        throw new Error("Please enter both email and password");
    }
    const user = await User.findOne({email});

    if(user && (await user.isPasswordMatched(password))){

        const token = JsonWebToken.sign({_id:user._id},user.email,{expiresIn:"1d"});
        console.log("toke--------------")
        res.status(200)
            .cookie("token",token,{httpOnly:true})
            .json({
                status:"Success",
                message:"signIn successfull"
            })
    } 
}
export const signOut= async(req:Request,res:Response)=>{

    res.cookie("token",null,{
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    res.status(200).json({
        status:"Success",
        message:"User log-out"
    });
    
};