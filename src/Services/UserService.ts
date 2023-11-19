import { IUserProfileUpdate, IUserRegister } from "../Models/types";
import User from "../Models/user.model";
const bcrypt = require("bcrypt");
import cloudinaryService from "./CloudinaryService";
import { EDA } from "./EDA/EdaIntegrator";

type createUserEventPayload = {
  username: string;
  password: string;
  name: string;
  email: string;
  document: string;
};

exports.Register = async ({
  name,
  email,
  dni,
  address,
  phone,
  password,
}: IUserRegister) => {
  try {
    let user = await User.findOne({ email }).lean();

    if (user) {
      return { code: 400, message: "User already exists" };
    }

    const NewUser = new User({
      name,
      email,
      dni,
      address,
      phone,
      createdOn: Date.now(),
    });
    const salt = await bcrypt.genSalt(10);
    NewUser.password = await bcrypt.hash(password, salt);
    const eda = EDA.getInstance();
    await NewUser.save();

    const newUserEvent: createUserEventPayload = {
      username: NewUser.name,
      password: password,
      name: NewUser.name,
      email: NewUser.email,
      document: NewUser.dni,
    };
    //Guild 2 Use Case
    eda.publishMessage<createUserEventPayload>(
      "/app/send/usuarios",
      newUserEvent
    );

    return {
      code: 200,
      payload: {
        name: NewUser.name,
        email: NewUser.email,
        dni: NewUser.dni,
        address: NewUser.address,
        phone: NewUser.phone,
        createdOn: NewUser.createdOn,
        isProvider: NewUser.isProvider,
      },
    };
  } catch (error) {
    return { code: 500, message: "Internal Server Error" };
  }
};

exports.UpdateUser = async ({
  email,
  name,
  dni,
  address,
  phone,
  password,
}: IUserProfileUpdate) => {
  try {
    let user = await User.findOne({ email }).lean();

    if (!user) {
      return { code: 404, message: "User not found" };
    }

    const updateFields: any = {};

    if (name && name.trim() !== "") {
      updateFields.name = name;
    }

    if (dni && dni.trim() !== "") {
      updateFields.dni = dni;
    }

    if (address && address.trim() !== "") {
      updateFields.address = address;
    }

    if (phone && phone.trim() !== "") {
      updateFields.phone = phone;
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
        dni: user?.dni,
        address: user?.address,
        phone: user?.phone,
        profilePicture: user?.profilePicture,
        isProvider: user?.isProvider,
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
    await User.deleteOne({ email }).lean();
    return { code: 200, message: "User Deleted" };
  } catch (error) {
    return { code: 500, message: "Internal Server Error" };
  }
};

exports.GetUserByEmail = async (email: string) => {
  try {
    let user = await User.findOne({ email }).lean();
    return { code: 200, user: user };
  } catch (error) {
    return { code: 500, message: "Internal Server Error" };
  }
};
