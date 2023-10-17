import { IUser } from "../Models/types";
import User from "../Models/user.model";
import { sendMail } from "./EmailService";
const bcrypt = require("bcrypt");

export interface IUserAuthenticate {
  email: string;
  password: string;
}
export type AuthenticateServiceResponse = {
  code: number;
  user?: IUser;
  message?: string;
};

exports.Authenticate = async ({
  email,
  password,
}: IUserAuthenticate): Promise<AuthenticateServiceResponse> => {
  try {
    let user = await User.findOne({ email }).lean();

    if (!user) {
      return { message: "Ha Ocurrido un Error.!", code: 500 };
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return {
        message: "Email o Contraseña Incorrecta",
        code: 400,
      };
    }
    return { code: 200, user: user };
  } catch (err) {
    return { message: "Ha Ocurrido un Error", code: 500 };
  }
};

exports.RecoverPassword = async (
  email: string
): Promise<AuthenticateServiceResponse> => {
  try {
    const user = await User.findOne({ email }).lean();

    if (!user) {
      return {
        message: "Se enviara un correo con la nueva contraseña",
        code: 200,
      };
    }

    // Generate a new password
    const newPassword = Math.random().toString(36).slice(-8);

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password in the database
    await User.updateOne({ email }, { password: hashedPassword });

    // Send the new password to the user's email
    // (code for sending email not included)
    await sendMail(
      email,
      "Recuperacion de Contraseña",
      `<p>Esta es su nueva contraseña: ${newPassword}</p>`
    );

    return {
      code: 200,
      message: "Se enviara un correo con la nueva contraseña",
    };
  } catch (err) {
    console.log(err);
    return { message: "Ha Ocurrido un Error", code: 500 };
  }
};
