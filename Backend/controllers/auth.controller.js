import userModel from "../models/user.model.js";
import { validationResult } from "express-validator";
// import userService from "../lib/service.js";
import blacklistedToken from "../models/blacklisted.model.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { firstName, lastName, email, password } = req.body;
  try {
    const isUserAlready = await userModel.findOne({ email });
    if (isUserAlready) {
      return res.status(400).json({ message: "user is already exist" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "password must be at least 6 characters long" });
    }
    const hashedPassword = await userModel.hashPassword(password);

    const user = await userModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const token = user.generateAuthToken();
    res.cookie("token", token, {
      httpOnly: true,
    });
    res.status(201).json({ token, user });
  } catch (error) {
    console.error({ "Singup error": error });
    res.status(500).json({ message: "internal server error" });
  }
};

export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "invalide credetials" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "invalide credentials" });
    }
    const token = user.generateAuthToken();
    res.cookie("token", token);
    res.status(200).json({ token, user });
  } catch (error) {
    console.error({ "Login error": error });
    res.status(500).json({ message: "internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token")
    const token= req.cookies.token|| req.headers.authorization?.split(" ")[1]

    if(token){
      await blacklistedToken.create({ token });
    }
    res.status(200).json({ message: "logged out successfully" });
  } catch (error) {
    console.error("logout error",error)
    res.status(500).json({message:"internal server error"})
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;
    if (!profilePic) {
      res.status(400).json({ message: "profile pic is required" });
    }
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("error in updated profile", error);
    res.status(500).json({ message: "internal serever error" });
  }
};

export const checkAuth = (req, res) => {
    res.status(200).json(req.user);
};
