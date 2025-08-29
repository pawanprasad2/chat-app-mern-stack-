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

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      //upload base64  image to cloudinary
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
    console.log("error in send messages controller", error.message);
    res.status(500).json({ error: "internal server error" });
  }
};

// ==================== NEW: getUnreadCount ====================

export const getUnreadCount = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const counts = await messageModel.aggregate([
      { $match: { receiverId: userId, read: false } },
      { $group: { _id: "$senderId", count: { $sum: 1 } } },
    ]);

    // format result into { userId: count }
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

// ==================== NEW: markAsRead ====================
export const markAsRead = async (req, res) => {
  try {
    const { id: senderId } = req.params;
    const userId = req.user._id;

    await messageModel.updateMany(
      { senderId, receiverId: userId, read: false },
      { $set: { read: true } }
    );

    res.status(200).json({ message: "Messages marked as read" });
  } catch (error) {
    console.error("error in markAsRead:", error.message);
    res.status(500).json({ error: "internal server error" });
  }
};
