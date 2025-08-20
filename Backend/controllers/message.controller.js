import messageModel from "../models/message.model.js";
import user from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js"

export const getUser = async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const filteredUser = await user
      .find({ _id: { $ne: loggedInUser } })
      .select("-password");
    res.status(200).json(filteredUser);
  } catch (error) {
    console.error("error in getuser".error.message);
    res.status(500).json({ error: "internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await messageModel.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    console.log("error in get message controller", error.message);
    res.status(500).json({ error: "internal server error" });
  }
};


export const sendMessage= async (req,res)=>{
    try{
        const {text,image}= req.body
        const {id:receiverId} = req.params
        const senderId= req.user._id

        let imageUrl
        if(image){
            //upload base64  image to cloudinary
            const uploadResponse =await cloudinary.uploader.upload(image)
            imageUrl=uploadResponse.secure_url
        }
        const newMessage = new message({
            senderId,
            receiverId,
            text,
            image:imageUrl
        })
        await newMessage.save()

        res.status(201).json(newMessage)
    }catch(error){
        console.log("error in send messages controller",error.message)
        res.status(500).json({error:"internal server error"})
    }
}