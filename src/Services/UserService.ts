import { IUserProfileUpdate, IUserRegister } from "../Models/types";
import User from "../Models/user.model";
const bcrypt = require("bcrypt");
import multer from "multer";
import cloudinaryService from "./CloudinaryService";

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

    const NewUser = new User({
      name,
      email,
      isProvider,
      createdOn: Date.now(),
    });
    const salt = await bcrypt.genSalt(10);
    NewUser.password = await bcrypt.hash(password, salt);

    await NewUser.save();

    return {
      code: 200,
      payload: {
        name: NewUser.name,
        email: NewUser.email,
        isProvider: NewUser.isProvider,
        createdOn: NewUser.createdOn,
      },
    };
  } catch (error) {
    return { code: 500, message: "Internal Server Error" };
  }
};

exports.UpdateUser = async ({ email, name, password }: IUserProfileUpdate) => {
  try {
    let user = await User.findOne({ email }).lean();

    if (!user) {
      return { code: 404, message: "User not found" };
    }

    const updateFields: any = {};

    if (name && name.trim() !== "") {
      updateFields.name = name;
    }

    // Check if password is provided and is not an empty string
    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(password, salt);
    }

    // If there are no fields to update, you can immediately return
    if (Object.keys(updateFields).length === 0) {
      return {
        code: 400,
        message: "No valid fields provided for update.",
      };
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

export const updateUserProfilePicture = async (
  email: string,
  profilePicture: Buffer
) => {
  try {
    const cloudinaryResult = await cloudinaryService.uploadImage(
      profilePicture
    );
    const updateUser = await User.findOneAndUpdate(
      { email },
      { $set: { profilePicture: cloudinaryResult.url } },
      { new: true }
    ).lean();

    if (!updateUser) {
      return { code: 404, message: "User not found" };
    }

    return {
      code: 200,
      payload: {
        user: updateUser,
      },
    };
  } catch (error) {
    return { code: 500, message: "Internal Server Error" };
  }
};

exports.DeleteUser = async (email: string) => {
  try {
    let user = await User.deleteOne({ email }).lean();
    return { code: 200, message: "User Deleted" };
  } catch (error) {
    return { code: 500, message: "Internal Server Error" };
  }
};
