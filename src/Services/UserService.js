"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserProfilePicture = void 0;
const user_model_1 = __importDefault(require("../Models/user.model"));
const bcrypt = require("bcrypt");
const CloudinaryService_1 = __importDefault(require("./CloudinaryService"));
const EdaIntegrator_1 = require("./EDA/EdaIntegrator");
exports.Register = ({ name, email, dni, address, phone, password, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield user_model_1.default.findOne({ email }).lean();
        if (user) {
            return { code: 400, message: "User already exists" };
        }
        const NewUser = new user_model_1.default({
            name,
            email,
            dni,
            address,
            phone,
            createdOn: Date.now(),
        });
        const salt = yield bcrypt.genSalt(10);
        NewUser.password = yield bcrypt.hash(password, salt);
        const eda = EdaIntegrator_1.EDA.getInstance();
        yield NewUser.save();
        const newUserEvent = {
            username: NewUser.name,
            password: password,
            name: NewUser.name,
            email: NewUser.email,
            document: NewUser.dni,
        };
        //Guild 2 Use Case
        eda.publishMessage("/app/send/usuarios", newUserEvent);
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
            },
        };
    }
    catch (error) {
        return { code: 500, message: "Internal Server Error" };
    }
});
exports.UpdateUser = ({ email, name, dni, address, phone, password, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield user_model_1.default.findOne({ email }).lean();
        if (!user) {
            return { code: 404, message: "User not found" };
        }
        const updateFields = {};
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
            const salt = yield bcrypt.genSalt(10);
            updateFields.password = yield bcrypt.hash(password, salt);
        }
        // If there are no fields to update, you can immediately return
        if (Object.keys(updateFields).length === 0) {
            return {
                code: 400,
                message: "No valid fields provided for update.",
            };
        }
        user = yield user_model_1.default.findOneAndUpdate({ email }, { $set: updateFields }, { new: true }).lean();
        return {
            code: 200,
            payload: {
                name: user === null || user === void 0 ? void 0 : user.name,
                email: user === null || user === void 0 ? void 0 : user.email,
                dni: user === null || user === void 0 ? void 0 : user.dni,
                address: user === null || user === void 0 ? void 0 : user.address,
                phone: user === null || user === void 0 ? void 0 : user.phone,
                profilePicture: user === null || user === void 0 ? void 0 : user.profilePicture,
                isProvider: user === null || user === void 0 ? void 0 : user.isProvider,
            },
        };
    }
    catch (error) {
        return { code: 500, message: "Internal Server Error" };
    }
});
const updateUserProfilePicture = (email, profilePicture) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cloudinaryResult = yield CloudinaryService_1.default.uploadImage(profilePicture);
        const updateUser = yield user_model_1.default.findOneAndUpdate({ email }, { $set: { profilePicture: cloudinaryResult.url } }, { new: true }).lean();
        if (!updateUser) {
            return { code: 404, message: "User not found" };
        }
        return {
            code: 200,
            payload: {
                user: updateUser,
            },
        };
    }
    catch (error) {
        return { code: 500, message: "Internal Server Error" };
    }
});
exports.updateUserProfilePicture = updateUserProfilePicture;
exports.DeleteUser = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield user_model_1.default.deleteOne({ email }).lean();
        return { code: 200, message: "User Deleted" };
    }
    catch (error) {
        return { code: 500, message: "Internal Server Error" };
    }
});
exports.GetUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield user_model_1.default.findOne({ email }).lean();
        return { code: 200, user: user };
    }
    catch (error) {
        return { code: 500, message: "Internal Server Error" };
    }
});
