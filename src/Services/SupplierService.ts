import Supplier from "../Models/supplier.model";
import { ISupplier } from "../Models/types";

const bcrypt = require("bcrypt");
import cloudinaryService from "./CloudinaryService";

exports.Register = async ({
  name,
  businessName,
  cuil,
  domain,
  address,
  phone,
  category,
  email,
  brandingColors,
  password,
}: ISupplier) => {
  try {
    let supplier = await Supplier.findOne({ cuil }).lean();

    if (supplier) {
      return { code: 400, message: "Supplier already exists" };
    }

    const NewSupplier = new Supplier({
      name,
      businessName,
      cuil,
      domain,
      address,
      phone,
      category,
      email,
      brandingColors,
    });
    const salt = await bcrypt.genSalt(10);
    NewSupplier.password = await bcrypt.hash(password, salt);

    await NewSupplier.save();

    return {
      code: 200,
      payload: {
        name: NewSupplier.name,
        businessName: NewSupplier.businessName,
        cuil: NewSupplier.cuil,
        domain: NewSupplier.domain,
        address: NewSupplier.address,
        phone: NewSupplier.phone,
        category: NewSupplier.category,
        email: NewSupplier.email,
        brandingColors: NewSupplier.brandingColors,
      },
    };
  } catch (error) {
    return { code: 500, message: "Internal Server Error" };
  }
};

exports.UpdateSupplier = async ({
  email,
  name,
  businessName,
  cuil,
  domain,
  address,
  phone,
  category,
  brandingColors,
  password,
}: ISupplier) => {
  try {
    let supplier = await Supplier.findOne({ cuil }).lean();

    if (!supplier) {
      return { code: 400, message: "Supplier does not exists" };
    }

    const salt = await bcrypt.genSalt(10);
    supplier.password = await bcrypt.hash(password, salt);

    await Supplier.updateOne(
      { cuil },
      {
        name,
        businessName,
        domain,
        address,
        phone,
        category,
        email,
        brandingColors,
        password: supplier.password,
      }
    );

    return {
      code: 200,
      payload: {
        name,
        businessName,
        cuil,
        domain,
        address,
        phone,
        category,
        email,
        brandingColors,
      },
    };
  } catch (error) {
    return { code: 500, message: "Internal Server Error" };
  }
};

exports.UpdateSupplierLogo = async (cuil: string, logo: Buffer) => {
  try {
    const cloudinaryResult = await cloudinaryService.uploadImage(logo);

    const updatedSupplier = await Supplier.findOneAndUpdate(
      { cuil },
      { $set: { logo: cloudinaryResult.url } },
      { new: true }
    ).lean();

    if (!updatedSupplier) {
      return { code: 400, message: "Supplier does not exists" };
    }

    return {
      code: 200,
      payload: {
        supplier: updatedSupplier,
      },
    };
  } catch (error) {
    return { code: 500, message: "Internal Server Error" };
  }
};

exports.updateSupplierCoverPhoto = async (cuil: string, coverPhoto: Buffer) => {
  try {
    const cloudinaryResult = await cloudinaryService.uploadImage(coverPhoto);

    const updatedSupplier = await Supplier.findOneAndUpdate(
      { cuil },
      { $set: { coverPhoto: cloudinaryResult.url } },
      { new: true }
    ).lean();

    if (!updatedSupplier) {
      return { code: 400, message: "Supplier does not exists" };
    }

    await Supplier.updateOne({ cuil }, { coverPhoto });

    return {
      code: 200,
      payload: {
        supplier: updatedSupplier,
      },
    };
  } catch (error) {
    return { code: 500, message: "Internal Server Error" };
  }
};

exports.DeleteSupplier = async (cuil: string) => {
  try {
    await Supplier.deleteOne({ cuil }).lean();
    return { code: 200, message: "Supplier Deleted" };
  } catch (error) {
    return { code: 500, message: "Internal Server Error" };
  }
};

exports.GetSupplier = async (cuil: string) => {
  try {
    const supplier = await Supplier.findOne({ cuil }).lean();

    if (!supplier) {
      return { code: 404, message: "Supplier not found" };
    }

    return {
      code: 200,
      payload: {
        supplier,
      },
    };
  } catch (error) {
    return { code: 500, message: "Internal Server Error" };
  }
};
