import { IUserRegister } from "../Models/types";
import User from "../Models/user.model";
const bcrypt = require('bcrypt');


exports.Register = async ({ name, email, password }: IUserRegister) => {
  try {
    let user = await User.findOne({ email }).lean();

    if (user) {
      return { code: 400, message: "User already exists" };
    }

    const NewUser = new User({ name, email });
    const salt = await bcrypt.genSalt(10);
    NewUser.password = await bcrypt.hash(password, salt);

    await NewUser.save();

    return { code: 200, payload: {
      name: NewUser.name,
      email: NewUser.email,
    } };
  } catch (error) {
    return { code: 500, message: "Internal Server Error" };
  }
};
