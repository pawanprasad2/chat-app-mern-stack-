import usermodel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import blacklistedToken from "../models/blacklisted.model.js";

export  const protectRoute = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "unauthorized" });
  }
  const isBlacklisted = await blacklistedToken.findOne({ token: token });

  if (isBlacklisted) {
    return res.status(401).json({ message: "unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await usermodel.findById(decoded._id);
    req.user = user;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "unauthorized" });
  }
};
