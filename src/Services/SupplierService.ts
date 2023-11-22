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
    eda.publishMessage<UserSupplierCount>(
      "/app/send/usuarios",
      "user_supplier_count",
      userSupplierCount
    );
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
  cuit,
  name,
  businessName,
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
    let supplier = await Supplier.findOne({ cuit });

    if (!supplier) {
      return { code: 400, message: "Supplier does not exist" };
    }

    const updateFields: any = {};

    if (name && name.trim() !== "") {
      updateFields.name = name;
    }

    if (businessName && businessName.trim() !== "") {
      updateFields.businessName = businessName;
    }

    if (domain && domain.trim() !== "") {
      updateFields.domain = domain;
    }

    if (address && address.trim() !== "") {
      updateFields.address = address;
    }

    if (phone && phone.trim() !== "") {
      updateFields.phone = phone;
    }

    if (category && category.trim() !== "") {
      updateFields.category = category;
    }

    if (email && email.trim() !== "") {
      updateFields.email = email;
    }

    if (primaryColor && primaryColor.trim() !== "") {
      updateFields.primaryColor = primaryColor;
    }

    if (secondaryColor && secondaryColor.trim() !== "") {
      updateFields.secondaryColor = secondaryColor;
    }

    // Check if password is provided and is not an empty string
    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(password, salt);
    }

    // If there are no fields to update, you can immediately return
    if (Object.keys(updateFields).length === 0) {
      return {
        code: 400,
        message: "No valid fields provided for update.",
      };
    }

    await Supplier.updateOne({ cuit }, { $set: updateFields });

    supplier = await Supplier.findOne({ cuit }).lean();

    return {
      code: 200,
      payload: {
        name: supplier?.name,
        businessName: supplier?.businessName,
        cuit,
        domain: supplier?.domain,
        address: supplier?.address,
        phone: supplier?.phone,
        category: supplier?.category,
        email: supplier?.email,
        primaryColor: supplier?.primaryColor,
        secondaryColor: supplier?.secondaryColor,
        isProvider: true,
        createdOn: supplier?.createdOn,
      },
    };
  } catch (error) {
    console.log(error);
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
