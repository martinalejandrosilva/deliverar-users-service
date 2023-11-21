import Supplier from "../Models/supplier.model";
import { IEmployee, IEvent, IUserProfileUpdate, IUserRegister, UserEmployeePasswordChange, createUserEmployeePayload, createUserEventPayload } from "../Models/types";
import User from "../Models/user.model";
const bcrypt = require("bcrypt");
import cloudinaryService from "./CloudinaryService";
import { EDA } from "./EDA/EdaIntegrator";
import { UserSupplierCount } from "./SupplierService";

exports.Register = async ({
  name,
  email,
  dni,
  address,
  phone,
  password,
}: IUserRegister) => {
  try {
    let user = await User.findOne({ email }).lean();

    if (user) {
      return { code: 400, message: "User already exists" };
    }

    const NewUser = new User({
      name,
      email,
      dni,
      address,
      phone,
      createdOn: Date.now(),
    });
    const salt = await bcrypt.genSalt(10);
    NewUser.password = await bcrypt.hash(password, salt);
    const eda = EDA.getInstance();
    await NewUser.save();

    const newUserEvent: createUserEventPayload = {
      username: NewUser.name,
      password: password,
      name: NewUser.name,
      email: NewUser.email,
      document: NewUser.dni,
      address: NewUser.address ? NewUser.address : "",
    };
    
    //Guild 2 Use Case
    eda.publishMessage<createUserEventPayload>(
      "/app/send/usuarios",
      "new_user_create",
      newUserEvent
    );

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
        name: NewUser.name,
        email: NewUser.email,
        dni: NewUser.dni,
        address: NewUser.address,
        phone: NewUser.phone,
        createdOn: NewUser.createdOn,
        isProvider: NewUser.isProvider,
        isEmployee: NewUser.isEmployee,
        group: NewUser.group,
        discount: NewUser.discount,
        vip: NewUser.vip,
      },
    };
  } catch (error) {
    return { code: 500, message: "Internal Server Error" };
  }
};

exports.UpdateUser = async ({
  email,
  name,
  dni,
  address,
  phone,
  password,
}: IUserProfileUpdate) => {
  try {
    let user = await User.findOne({ email }).lean();

    if (!user) {
      return { code: 404, message: "User not found" };
    }

    const updateFields: any = {};

    if (name && name.trim() !== "") {
      updateFields.name = name;
    }

    if (dni && dni.trim() !== "") {
      updateFields.dni = dni;
    }

    if (address && address.trim() !== "") {
      updateFields.address = address;
    }

    if (phone && phone.trim() !== "") {
      updateFields.phone = phone;
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

    user = await User.findOneAndUpdate(
      { email },
      { $set: updateFields },
      { new: true }
    ).lean();

    if(password && password.trim() !== "" && user?.isEmployee){
      const eventPayload : IEvent<UserEmployeePasswordChange> = {
        sender: "usuarios",
        created_at: Date.now(),
        event_name: "user_employee_password_change",
        data: {
          username: user?.name,
          newPassword: password,
          email: user?.email,
          dni: user?.dni,
        }
      }
      const eda = EDA.getInstance();
      eda.publishMessage("/app/send/usuarios", "user_employee_password_change",eventPayload )
    }

    return {
      code: 200,
      payload: {
        name: user?.name,
        email: user?.email,
        dni: user?.dni,
        address: user?.address,
        phone: user?.phone,
        profilePicture: user?.profilePicture,
        isProvider: user?.isProvider,
        isEmployee: user?.isEmployee,
        group: user?.group,
        discount: user?.discount,
        vip: user?.vip,
      },
    };
  } catch (error) {
    return { code: 500, message: "Internal Server Error" };
  }
};

export const updateUserProfilePicture = async (
  email: string,
  profilePicture: Buffer
) => {
  try {
    const cloudinaryResult = await cloudinaryService.uploadImage(
      profilePicture
    );
    const updateUser = await User.findOneAndUpdate(
      { email },
      { $set: { profilePicture: cloudinaryResult.url } },
      { new: true }
    ).lean();

    if (!updateUser) {
      return { code: 404, message: "User not found" };
    }

    return {
      code: 200,
      payload: {
        user: updateUser,
      },
    };
  } catch (error) {
    return { code: 500, message: "Internal Server Error" };
  }
};

exports.DeleteUser = async (email: string) => {
  try {
    await User.deleteOne({ email }).lean();
    return { code: 200, message: "User Deleted" };
  } catch (error) {
    return { code: 500, message: "Internal Server Error" };
  }
};

exports.GetUserByEmail = async (email: string) => {
  try {
    let user = await User.findOne({ email }).lean();
    return { code: 200, user: user };
  } catch (error) {
    return { code: 500, message: "Internal Server Error" };
  }
};

export const GetUserCount = async () => {
  try {
    const count = await User.countDocuments();
    return { code: 200, count: count };
  } catch (error) {
    return { code: 500, message: "Internal Server Error" };
  }
}

exports.CreateUserFromEmployee = async (employee : IEmployee) => {
  try{
    const isCeo = employee.grupo === "509";

    const NewUser = new User({
      name: employee.username,
      email: employee.username,
      dni: employee.carLicense,
      address: "",
      phone: "",
      createdOn: Date.now(),
      password: employee.password,
      isProvider: false,
      isEmployee: true,
      group : employee.grupo,
      discount : isCeo? 60 : 30,
      vip : isCeo? true : false,
    });
    
    const salt = await bcrypt.genSalt(10);
    NewUser.password = await bcrypt.hash(NewUser.password, salt);
    await NewUser.save(); 

    const eventPayload : IEvent<createUserEmployeePayload> = {
      sender: "usuarios",
      created_at: Date.now(),
      event_name: "new_user_employee_create",
      data: {
        name: NewUser.name,
        email: NewUser.email,
        dni: NewUser.dni,
        address: NewUser.address ? NewUser.address : "",
        phone: NewUser.phone ? NewUser.phone : "",
        createdOn: NewUser.createdOn,
        password: NewUser.password,
        discount : NewUser.discount ? NewUser.discount : 0,
        vip : NewUser.vip ? NewUser.vip : false,
      }
    }

    const eda = EDA.getInstance();
    eda.publishMessage("/app/send/usuarios", "new_user_employee_create", NewUser);

    return { code: 200, message: "User created" };
  }catch(error){
    return { code: 500, message: "Internal Server Error" };
  }
}

