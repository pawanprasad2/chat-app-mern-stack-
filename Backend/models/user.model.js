import mongoose from 'mongoose'
import jwt from "jsonwebtoken"
import bcrypt from 'bcryptjs'
const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    fullName:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
        minlength:[6,"password must be 6 characters"]
    },
    profilePic:{
        type:String,
        default:""
    }
},{timestamps:true})


userSchema.methods.generateAuthToken= function (){
    const token =jwt.sign({_id:this._id},process.env.JWT_SECRET,{expiresIn:"24h"})
    return token
} 

userSchema.methods.comparePassword= async function (password){
    return await bcrypt.compare(password,this.password)

}

userSchema.statics.hashpassword= async function(password){
    return await bcrypt.hash(password,10)
}


const user= mongoose.model("User",userSchema)

export default user