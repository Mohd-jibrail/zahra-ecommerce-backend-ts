import mongoose from "mongoose";
import bcrypt from "bcrypt";
interface IUser extends Document
{
    _id:string
    firstName:string;
    lastName:string;
    email:string;
    contact:string;
    password:string;
    isPasswordMatched(enterPassword:string):Promise<boolean>;
}
const userSchema = new mongoose.Schema({
    firstName:{type:String,require:true},
    lastName:{type:String,require:true},
    email:{type:String,require:true},
    contact:{type:Number,require:true},
    password:{type:String,require:true}
});
userSchema.pre<IUser>("save", async function(next){
   const salt = await bcrypt.genSaltSync(10);
   this.password = await bcrypt.hash(this.password,salt);

});
userSchema.methods.isPasswordMatched=async function(enterPassword:any){
    return await bcrypt.compare(enterPassword,this.password);
}

export const User = mongoose.model<IUser>("User",userSchema);
