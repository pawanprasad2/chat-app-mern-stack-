import userModel from "../models/user.model.js";
import { validationResult } from "express-validator";
import userService from "../lib/service.js";

export const signup = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { fullName, email, password } = req.body;

    const isUserAlready = await userModel.findOne({ email });
    if (isUserAlready) {
      return res.status(400).json({ message: "user is already exist" });
    }

    const hashedpassword = await userModel.hashpassword(password);

    const user = await userService({
      fullName,
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
