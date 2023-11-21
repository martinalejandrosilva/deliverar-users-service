import Supplier from "../Models/supplier.model";
import { ISupplier } from "../Models/types";
import User from "../Models/user.model";

const bcrypt = require("bcrypt");
import cloudinaryService from "./CloudinaryService";
import { EDA } from "./EDA/EdaIntegrator";

type createSupplierEventPayload = {
  name: string;
  businessName: string;
  cuit: string;
  domain: string;
  address: string;
  phone: string;
  category: string;
  email: string;
  primaryColor: string;
  secondaryColor: string;
  coverPhoto?: string;
  logo?: string;
  password: string;
};

export type UserSupplierCount = {
  userCount: number;
  supplierCount: number;
};

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
    let supplier = await Supplier.findOne({ cuit: cuit }).lean();
    const eda = EDA.getInstance();

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
      createdOn: Date.now(),
      isProvider: true,
    });

    const salt = await bcrypt.genSalt(10);
    NewSupplier.password = await bcrypt.hash(password, salt);

    await NewSupplier.save();

    //Guild 1
    const newSupplierEvent: createSupplierEventPayload = {
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
      coverPhoto: NewSupplier.coverPhoto,
      logo: NewSupplier.logo,
      password: password,

    };

    eda.publishMessage<createSupplierEventPayload>(
      "/app/send/usuarios",
      "new_company_create",
      newSupplierEvent
      );

    //END Guild 1 

    //Guild 5.
    //User/Supplier Count. 

    const userCount = await User.countDocuments();
    const supplierCount = await Supplier.countDocuments();

    const userSupplierCount: UserSupplierCount = {
      userCount,
      supplierCount,
    };
    eda.publishMessage<UserSupplierCount>("/app/send/usuarios", "user_supplier_count", userSupplierCount);
    //END Guild 5.  

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
        createdOn: NewSupplier.createdOn,    
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
        createdOn: supplier.createdOn,
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

exports.GetSupplierCount = async () => {
  try {
    const count = await Supplier.countDocuments();
    return { code: 200, count: count };
  } catch (error) {
    return { code: 500, message: "Internal Server Error" };
  }
};
