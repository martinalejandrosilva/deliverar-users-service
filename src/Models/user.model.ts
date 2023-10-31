import mongoose, { Schema } from "mongoose";
import { IUser } from "./types";

const userAddressSchema = new Schema({
  street: { type: String, required: true },
  number: { type: Number, required: true },
  city: { type: String, required: true },
});

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: false },
  isProvider: { type: Boolean, required: true },
  createdOn: { type: Date, default: Date.now },
  dateOfBirth: { type: Date, required: false },
  address: { type: userAddressSchema, required: false },
  phone: { type: String, required: false },
  profilePicture: { type: String, required: false },
  authMethods: {
    type: [String],
    enum: ["local", "google"],
    required: true,
  },
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
