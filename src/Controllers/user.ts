import { Body, Post, Route, Tags } from "tsoa";
import { IUserRegister } from "../Models/types";
const UserService = require("../Services/UserService");
const config = require("config");
const jwt = require("jsonwebtoken");

interface IUserResponse {
  code: number;
  payload?: {
    token: string;
    name: string;
    email: string;
    isProvider: boolean;
  };
}

@Route("api/user")
@Tags("User")
export default class UserController {
  /**
   * Register a new user.
   * @param name The user name.
   * @param email The user email.
   * @param password The user password.
   * @param isProvider Represents if the user is a provider or Not.
   * @returns The user data.
   */
  @Post("/")
  public async register(
    @Body() { name, email, password, isProvider }: IUserRegister,
  ): Promise<IUserResponse> {
    const user = await UserService.Register({
      name,
      email,
      password,
      isProvider,
    });
    if (user.code === 200) {
      const token = await new Promise<string | undefined>((resolve, reject) => {
        jwt.sign(
          user.payload, //Right now the token is returning the user and email define what should return.
          config.get("jwtSecret"),
          { expiresIn: 3600 },
          (err: any, token: string | undefined) => {
            if (err) {
              reject(err);
            } else {
              resolve(token);
            }
          },
        );
      });
      user.payload.token = token;
    }
    return { code: user.code, payload: user.payload };
  }
}
