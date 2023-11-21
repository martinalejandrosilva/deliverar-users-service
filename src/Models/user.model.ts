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
  dni: { type: String, required: false },
  password: { type: String, required: false },
  createdOn: { type: Date, default: Date.now },
  dateOfBirth: { type: Date, required: false },
  address: { type: String, required: false },
  phone: { type: String, required: false },
  profilePicture: { type: String, required: false },
  isProvider: { type: Boolean, default: false },
  isEmployee: { type: Boolean, default: false },
  group : { type: String, required: false },
  discount : { type: Number, required: false , default: 0 },
  vip : { type: Boolean, required: false, default: false },
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
