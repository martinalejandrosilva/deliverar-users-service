import {
  Body,
  Delete,
  Path,
  Post,
  Put,
  Route,
  Security,
  Tags,
  UploadedFile,
} from "tsoa";
import { IUserProfileUpdate, IUserRegister } from "../Models/types";
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
    profilePicture?: string;
    createdOn?: Date;
    dni?: string;
    isEmployee?: boolean;
    address?: string;
    phone?: string;
    group?: string;
    discount?: number;
    vip?: boolean;
  };
}

@Route("api/user")
@Tags("User")
export default class UserController {
  /**
   * Register a new user.
   * @param name The user name.
   * @param email The user email.
   * @param dni The user dni.
   * @param address The user address.
   * @param phone The user phone.
   * @param password The user password.
   * @returns The user data.
   */
  @Post("/")
  public async register(
    @Body()
    { name, email, dni, address, phone, password }: IUserRegister
  ): Promise<IUserResponse> {
    const user = await UserService.Register({
      name,
      email,
      dni,
      address,
      phone,
      password,
    });
    if (user.code === 200) {
      const token = await new Promise<string | undefined>((resolve, reject) => {
        jwt.sign(
          user.payload,
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
      user.payload.token = token;
    }
    return { code: user.code, payload: user.payload };
  }

  /**
   * Update a new user.
   * @param name The user name.
   * @param email The user email.
   * @param dni The user dni.
   * @param address The user address.
   * @param phone The user phone.
   * @param password The user password.
   * @returns The user data.
   */
  @Put("/")
  @Security("BearerAuth")
  public async update(
    @Body() { name, email, dni, address, phone, password }: IUserProfileUpdate
  ): Promise<IUserResponse> {
    const user = await UserService.UpdateUser({
      name,
      email,
      dni,
      address,
      phone,
      password,
    });
    if (user.code === 200) {
      const token = await new Promise<string | undefined>((resolve, reject) => {
        jwt.sign(
          user.payload,
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
      user.payload.token = token;
    }
    return { code: user.code, payload: user.payload };
  }

  @Put("/profilePicture/:email")
  @Security("BearerAuth")
  public async UpdateProfilePicture(
    @Path() email: string,
    @UploadedFile("profilePicture") profilePicture: Express.Multer.File
  ): Promise<IUserResponse> {
    if (!profilePicture) {
      return { code: 400 };
    }

    const userResponse = await UserService.updateUserProfilePicture(
      email,
      profilePicture.buffer
    );

    return userResponse; // Assuming the service returns an object of IUserResponse type
  }

  /**
   * Deletes User Account.
   * @param email The user email.
   */
  @Delete("/:email")
  @Security("BearerAuth")
  public async delete(@Path("email") email: string): Promise<IUserResponse> {
    const user = await UserService.DeleteUser(email);
    return { code: user.code };
  }
}
