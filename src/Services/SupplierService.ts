import Supplier from "../Models/supplier.model";
import { ISupplier } from "../Models/types";

const bcrypt = require("bcrypt");
import cloudinaryService from "./CloudinaryService";

exports.Register = async ({
  name,
  businessName,
  cuit,
  domain,
  address,
  phone,
  category,
  email,
  primaryColor,
  secondaryColor,
  password,
}: ISupplier) => {
  try {
    console.log("here", cuit);
    let supplier = await Supplier.findOne({ cuit: cuit }).lean();

    if (supplier) {
      return { code: 400, message: "Supplier already exists" };
    }

    const NewSupplier = new Supplier({
      name,
      businessName,
      cuit,
      domain,
      address,
      phone,
      category,
      email,
      primaryColor,
      secondaryColor,
    });
    const salt = await bcrypt.genSalt(10);
    NewSupplier.password = await bcrypt.hash(password, salt);

    await NewSupplier.save();

    return {
      code: 200,
      payload: {
        name: NewSupplier.name,
        businessName: NewSupplier.businessName,
        cuit: NewSupplier.cuit,
        domain: NewSupplier.domain,
        address: NewSupplier.address,
        phone: NewSupplier.phone,
        category: NewSupplier.category,
        email: NewSupplier.email,
        primaryColor: NewSupplier.primaryColor,
        secondaryColor: NewSupplier.secondaryColor,
        isProvider: NewSupplier.isProvider,
      },
    };
  } catch (error) {
    console.log(error);
    return { code: 500, message: "Internal Server Error" };
  }
};

exports.UpdateSupplier = async ({
  email,
  name,
  businessName,
  cuit,
  domain,
  address,
  phone,
  category,
  primaryColor,
  secondaryColor,
  password,
}: ISupplier) => {
  try {
    let supplier = await Supplier.findOne({ cuit: cuit }).lean();

    if (!supplier) {
      return { code: 400, message: "Supplier does not exists" };
    }

    const salt = await bcrypt.genSalt(10);
    supplier.password = await bcrypt.hash(password, salt);

    await Supplier.updateOne(
      { cuit: cuit },
      {
        name,
        businessName,
        domain,
        address,
        phone,
        category,
        email,
        primaryColor,
        secondaryColor,
        password: supplier.password,
      }
    );

    return {
      code: 200,
      payload: {
        name,
        businessName,
        cuit,
        domain,
        address,
        phone,
        category,
        email,
        primaryColor,
        secondaryColor,
        isProvider: true,
      },
    };
  } catch (error) {
    return { code: 500, message: "Internal Server Error" };
  }
};

exports.UpdateSupplierLogo = async (cuit: string, logo: Buffer) => {
  try {
    const cloudinaryResult = await cloudinaryService.uploadImage(logo);

    const updatedSupplier = await Supplier.findOneAndUpdate(
      { cuit: cuit },
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

exports.updateSupplierCoverPhoto = async (cuit: string, coverPhoto: Buffer) => {
  try {
    const cloudinaryResult = await cloudinaryService.uploadImage(coverPhoto);

    const updatedSupplier = await Supplier.findOneAndUpdate(
      { cuit: cuit },
      { $set: { coverPhoto: cloudinaryResult.url } },
      { new: true }
    ).lean();

    if (!updatedSupplier) {
      return { code: 400, message: "Supplier does not exists" };
    }

    await Supplier.updateOne({ cuit: cuit }, { coverPhoto });

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

exports.DeleteSupplier = async (cuit: string) => {
  try {
    await Supplier.deleteOne({ cuit: cuit }).lean();
    return { code: 200, message: "Supplier Deleted" };
  } catch (error) {
    return { code: 500, message: "Internal Server Error" };
  }
};

exports.GetSupplier = async (cuit: string) => {
  try {
    const supplier = await Supplier.findOne({ cuit: cuit }).lean();

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
