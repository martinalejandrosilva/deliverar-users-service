import { IUserProfileUpdate, IUserRegister } from "../Models/types";
import User from "../Models/user.model";
const bcrypt = require("bcrypt");

exports.Register = async ({
  name,
  email,
  password,
  isProvider,
}: IUserRegister) => {
  try {
    let user = await User.findOne({ email }).lean();

    if (user) {
      return { code: 400, message: "User already exists" };
    }

    const NewUser = new User({ name, email, isProvider });
    const salt = await bcrypt.genSalt(10);
    NewUser.password = await bcrypt.hash(password, salt);

    await NewUser.save();

    return {
      code: 200,
      payload: {
        name: NewUser.name,
        email: NewUser.email,
        isProvider: NewUser.isProvider,
      },
    };
  } catch (error) {
    console.log(error);
    return { code: 500, message: "Internal Server Error" };
  }
};

exports.UpdateUser = async ({
  email,
  name,
  password,
  profilePicture,
}: IUserProfileUpdate) => {
  try {
    let user = await User.findOne({ email }).lean();

    if (!user) {
      return { code: 404, message: "User not found" };
    }

    const updateFields: any = {};

    if (name) updateFields.name = name;
    if (profilePicture) updateFields.profilePicture = profilePicture;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(password, salt);
    }

    user = await User.findOneAndUpdate(
      { email },
      { $set: updateFields },
      { new: true }
    ).lean();

    return {
      code: 200,
      payload: {
        name: user?.name,
        email: user?.email,
        profilePicture: user?.profilePicture,
      },
    };
  } catch (error) {
    return { code: 500, message: "Internal Server Error" };
  }
};
