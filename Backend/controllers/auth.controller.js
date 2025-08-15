import userModel from "../models/user.model.js";
import { validationResult } from "express-validator";
import userService from "../lib/service.js";
import blacklistedToken from "../models/blacklisted.model.js";

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
        .json({ message: "password must be 6 characters long" });
    }
    const hashedpassword = await userModel.hashpassword(password);

    const user = await userService({
      firstName,
      lastName,
      email,
      password: hashedpassword,
    });

    const token = user.generateAuthToken();
    res.status(201).json({ token, user });
  } catch (error) {
    console.log({ message: error.message });
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
    console.log({ message: error.message });
    res.status(500).json({ message: "internal server error" });
    
  }
};

export const logout = async (req, res) => {
   res.clearCookie("token");
  const token = req.cookies.token || req.headers.authorization.split(" ")[1];

  await blacklistedToken.create({ token });

  res.status(200).json({ message: "logged out" });
};
