import messageModel from "../models/message.model.js";
import user from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import mongoose from "mongoose";

export const getUser = async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const filteredUser = await user
      .find({ _id: { $ne: loggedInUser } })
      .select("-password");
    res.status(200).json(filteredUser);
  } catch (error) {
    console.error("error in getuser".error);
    res.status(500).json({ error: "internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: otherUserId } = req.params;
    const currentUserId = req.user._id;

    const messages = await messageModel.find({
      $or: [
        { senderId: currentUserId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: currentUserId },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    console.error("error in get message controller", error);
    res.status(500).json({ error: "internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl=null;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }
    const newMessage = new messageModel({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });
    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("error sending messages", error);
    res.status(500).json({ error: "internal server error" });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const counts = await messageModel.aggregate([
      { $match: { receiverId: userId, read: false } },
      { $group: { _id: "$senderId", count: { $sum: 1 } } },
    ]);

   
    const unreadMap = {};
    counts.forEach((c) => {
      unreadMap[c._id.toString()] = c.count;
    });

    res.status(200).json(unreadMap);
  } catch (error) {
    console.error("error in getUnreadCount:", error);
    res.status(500).json({ error: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id: senderId } = req.params;
    const receiverId = req.user._id;

    await messageModel.updateMany(
      { senderId, receiverId, read: false },
      { $set: { read: true } }
    );

    res.status(200).json({ message: "Messages marked as read" });
  } catch (error) {
    console.error("error in markAsRead:", error);
    res.status(500).json({ error: "internal server error" });
  }
};
