import { Body, Path, Post, Route, Tags } from "tsoa";
import { IUserAuthenticate } from "../Services/AuthService";
import { IUserAuthenticated } from "../Models/types";
const AuthService = require("../Services/AuthService");
const config = require("config");
const jwt = require("jsonwebtoken");

export type AuthenticatedResponse = {
  code: number;
  token?: string;
  user?: IUserAuthenticated;
  message?: string;
};

@Route("api/auth")
@Tags("Auth")
export default class AuthController {
  /**
   * Authenticate a user.
   * @param email The user email.
   * @param password The user password.
   * @returns The user data.
   */
  @Post("/login")
  public async login(
    @Body() { email, password }: IUserAuthenticate
  ): Promise<AuthenticatedResponse> {
    const user = await AuthService.Authenticate({ email, password });
    if (user.code === 200) {
      const token = await new Promise<string | undefined>((resolve, reject) => {
        jwt.sign(
          user.user, //Right now the token is returning the user and email define what should return.
          config.get("jwtSecret"),
          { expiresIn: 3600 },
          (err: any, token: string | undefined) => {
            if (err) {
              reject(err);
            } else {
              resolve(token);
            }
          }
        );
      });
      return { code: user.code, token: token, user: user.user };
    }
    return { code: user.code, message: user.message };
  }

  /**
   * Initiates User Password Recovery Process.
   * @param email The user email.
   */
  @Post("/password-recovery/:email")
  public async recovery(
    @Path("email") email: string
  ): Promise<AuthenticatedResponse> {
    const user = await AuthService.RecoverPassword(email);
    return { code: user.code, message: user.message };
  }
}
