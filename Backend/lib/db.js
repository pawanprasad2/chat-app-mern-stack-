import mongoose from "mongoose";

export const connectoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("connected to DB");
  } catch (error) {
    console.error("connection error", error);
  }
};
