import mongoose from 'mongoose'

export const  blacklistedTokenSchema = new mongoose.Schema({
token:{
    type:String,
    required:true,
    unique:true
},
createdAt:{
    type:Date,
    default:Date.now,
    expries:86400 //24hrs
}
})

const blacklistedToken= mongoose.model("BlacklistToken",blacklistedTokenSchema)

export default blacklistedToken