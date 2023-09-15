import { IUser } from "../Models/types";
import User from "../Models/user.model";
const bcrypt = require('bcrypt');


export interface IUserAuthenticate {
  email:  string,
  password: string
}
export type AuthenticateServiceResponse = {
  code : number,
  user? : IUser,
  message ? : string,
}

exports.Authenticate = async ({email, password} : IUserAuthenticate) : Promise<AuthenticateServiceResponse> =>  {
  
  try {
    let user = await User.findOne({ email }).lean();
  
    if (!user) {
      return { message: "An Error has ocurred!", code: 500 };
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return {
        message: "Email o Contraseña Incorrecta",
        code: 400,
      };
    }
    return {code : 200, user : user};

  } catch (err) {
    return { message: "Ha Ocurrido un Error", code: 500 };
  }
};