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
import { ISupplier, ISupplierUpdate } from "../Models/types";
const SupplierService = require("../Services/SupplierService");

interface ISupplierResponse {
  code: number;
  payload?: any; // Define the payload according to your supplier payload structure
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
    @Body() supplierData: ISupplier
  ): Promise<ISupplierResponse> {
    return await SupplierService.Register(supplierData);
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
   * @param cuil The supplier CUIL.
   * @param logo The supplier's new logo.
   * @returns The updated supplier data with status code.
   */
  @Put("/logo/:cuil")
  @Security("BearerAuth")
  public async updateLogo(
    @Path() cuil: string,
    @UploadedFile("logo") logo: Express.Multer.File
  ): Promise<ISupplierResponse> {
    return await SupplierService.UpdateSupplierLogo(cuil, logo.buffer);
  }

  /**
   * Updates supplier cover photo.
   * @param cuil The supplier CUIL.
   * @param coverPhoto The supplier's new cover photo.
   * @returns The updated supplier data with status code.
   */
  @Put("/coverPhoto/:cuil")
  @Security("BearerAuth")
  public async updateCoverPhoto(
    @Path() cuil: string,
    @UploadedFile("coverPhoto") coverPhoto: Express.Multer.File
  ): Promise<ISupplierResponse> {
    return await SupplierService.updateSupplierCoverPhoto(
      cuil,
      coverPhoto.buffer
    );
  }

  /**
   * Deletes supplier account.
   * @param cuil The supplier CUIL.
   * @returns Status code of operation.
   */
  @Delete("/:cuil")
  @Security("BearerAuth")
  public async delete(@Path("cuil") cuil: string): Promise<ISupplierResponse> {
    return await SupplierService.DeleteSupplier(cuil);
  }

  /**
   * Retrieves supplier information.
   * @param cuil The supplier CUIL.
   * @returns The supplier data with status code.
   */
  @Get("/:cuil")
  public async get(@Path("cuil") cuil: string): Promise<ISupplierResponse> {
    return await SupplierService.GetSupplier(cuil);
  }
}
