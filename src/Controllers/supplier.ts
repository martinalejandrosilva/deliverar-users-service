import {
  Body,
  Delete,
  Get,
  Path,
  Post,
  Put,
  Route,
  Security,
  Tags,
  UploadedFile,
} from "tsoa";
import { ISupplier, ISupplierRegister, ISupplierUpdate } from "../Models/types";
const SupplierService = require("../Services/SupplierService");
const config = require("config");
const jwt = require("jsonwebtoken");

interface ISupplierResponse {
  code: number;
  token?: string;
  payload?: ISupplier;
}

@Route("api/supplier")
@Tags("Supplier")
export default class SupplierController {
  /**
   * Register a new supplier.
   * @param supplierData The supplier registration data.
   * @returns The supplier data with status code.
   */
  @Post("/")
  public async register(
    @Body() supplierData: ISupplierRegister
  ): Promise<ISupplierResponse> {
    const supplier = await SupplierService.Register(supplierData);
    let token = undefined;
    if (supplier.code === 200) {
      token = await new Promise<string | undefined>((resolve, reject) => {
        jwt.sign(
          supplier.payload,
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
    }
    return {
      code: supplier.code,
      token: token,
      payload: supplier.payload,
    };
  }

  /**
   * Updates supplier information.
   * @param supplierData The supplier update data.
   * @returns The updated supplier data with status code.
   */
  @Put("/")
  @Security("BearerAuth")
  public async update(
    @Body() supplierData: ISupplierUpdate
  ): Promise<ISupplierResponse> {
    return await SupplierService.UpdateSupplier(supplierData);
  }

  /**
   * Updates supplier logo.
   * @param cuit The supplier CUIT.
   * @param logo The supplier's new logo.
   * @returns The updated supplier data with status code.
   */
  @Put("/logo/:cuit")
  @Security("BearerAuth")
  public async updateLogo(
    @Path() cuit: string,
    @UploadedFile("logo") logo: Express.Multer.File
  ): Promise<ISupplierResponse> {
    return await SupplierService.UpdateSupplierLogo(cuit, logo.buffer);
  }

  /**
   * Updates supplier cover photo.
   * @param cuit The supplier CUIT.
   * @param coverPhoto The supplier's new cover photo.
   * @returns The updated supplier data with status code.
   */
  @Put("/coverPhoto/:cuit")
  @Security("BearerAuth")
  public async updateCoverPhoto(
    @Path() cuit: string,
    @UploadedFile("coverPhoto") coverPhoto: Express.Multer.File
  ): Promise<ISupplierResponse> {
    return await SupplierService.updateSupplierCoverPhoto(
      cuit,
      coverPhoto.buffer
    );
  }

  /**
   * Deletes supplier account.
   * @param cuit The supplier cuit.
   * @returns Status code of operation.
   */
  @Delete("/:cuit")
  @Security("BearerAuth")
  public async delete(@Path("cuit") cuit: string): Promise<ISupplierResponse> {
    return await SupplierService.DeleteSupplier(cuit);
  }

  /**
   * Retrieves supplier information.
   * @param cuit The supplier cuit.
   * @returns The supplier data with status code.
   */
  @Get("/:cuit")
  public async get(@Path("cuit") cuit: string): Promise<ISupplierResponse> {
    return await SupplierService.GetSupplier(cuit);
  }
}
