import { GoogleProfile, IEvent, ISupplier, IUser, UserEmployeePasswordChange, createUserEventPayload } from "../Models/types";
import User from "../Models/user.model";
import { sendMail } from "./EmailService";
import Supplier from "../Models/supplier.model";
import { EDA } from "./EDA/EdaIntegrator";
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

export type AuthenticateServiceSupplierResponse = {
  code: number;
  supplier?: ISupplier;
  message?: string;
};

export type AuthenticateSupplier = {
  cuit: string;
  password: string;
};

const generatePassword = () => {
  const length = 8;
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  let retVal = "";
  while (!(/[A-Z]/.test(retVal) && /[\W_]/.test(retVal))) {
    retVal = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
  }
  return retVal;
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

    const eda = EDA.getInstance();
    const eventPayload : IEvent<createUserEventPayload> = {
      sender: "usuarios",
      created_at: Date.now(),
      event_name: "login_user",
      data: {
        username: user?.name,
        name: user?.name,
        password: password,
        email: user?.email,
        document: user?.dni,
        address: user?.address ? user?.address : "",
      }
    }
    eda.publishMessage("/app/send/usuarios", "login_user",eventPayload)

    return { code: 200, user: user };
  } catch (err) {
    return { message: "Ha Ocurrido un Error", code: 500 };
  }
};

exports.AuthenticateSupplier = async ({
  cuit,
  password,
}: AuthenticateSupplier): Promise<AuthenticateServiceSupplierResponse> => {
  try {
    let supplier = await Supplier.findOne({ cuit: cuit }).lean();

    if (!supplier) {
      return { message: "Ha Ocurrido un Error.!", code: 500 };
    }

    const isMatch = await bcrypt.compare(password, supplier.password);

    if (!isMatch) {
      return {
        message: "cuit o Contraseña Incorrecta",
        code: 400,
      };
    }
    return { code: 200, supplier: supplier };
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
    const newPassword = generatePassword();

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password in the database
    await User.updateOne({ email }, { password: hashedPassword });

    if(user?.isEmployee){
      const eventPayload : IEvent<UserEmployeePasswordChange> = {
        sender: "usuarios",
        created_at: Date.now(),
        event_name: "user_employee_password_change",
        data: {
          username: user?.name,
          newPassword: newPassword,
          email: user?.email,
          dni: user?.dni,
        }
      }
      const eda = EDA.getInstance();
      eda.publishMessage("/app/send/usuarios", "user_employee_password_change",eventPayload )
    }
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
    return { message: "Ha Ocurrido un Error", code: 500 };
  }
};

exports.RegisterOrLoginGoogleUser = async (profile: GoogleProfile) => {
  try {
    let user = await User.findOne({ email: profile.emails[0].value }).lean();
    // If user doesn't exist, create a new one
    if (!user) {
      const newUser = new User({
        name: profile.displayName,
        email: profile.emails[0].value,
        profilePicture: profile.photos[0].value,
        createdOn: Date.now(),
      });
      user = await newUser.save();
    }
    return { code: 200, user: user };
  } catch (err) {
    return { code: 500, user: null };
  }
};
