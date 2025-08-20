import mongoose, { model, Schema } from "mongoose";
export const messageSchema = new mongoose.Schema({
 senderId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user",
    required:true,
 },
 receiverId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user",
    required:true
 },
 text:{
    type:String
 },
 image:{
    type:String
 }   
},{timestamps:true})

const messageModel = new mongoose.model("Message",messageSchema)

export default messageModel