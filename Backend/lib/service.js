import userModel from "../models/user.model.js";

const createUser = async ({ firstName, lastName, email, password }) => {
  if (!firstName || !email || !password) {
    throw new Error("All fileds are required");
  }

  const user = await userModel.create({
    firstName,
    lastName,
    email,
    password,
  });
  return user;
};

export default createUser;
