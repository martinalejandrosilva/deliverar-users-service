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
const supplier_model_1 = __importDefault(require("../Models/supplier.model"));
const bcrypt = require("bcrypt");
const CloudinaryService_1 = __importDefault(require("./CloudinaryService"));
exports.Register = ({ name, businessName, cuit, domain, address, phone, category, email, primaryColor, secondaryColor, password, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("here", cuit);
        let supplier = yield supplier_model_1.default.findOne({ cuit: cuit }).lean();
        if (supplier) {
            return { code: 400, message: "Supplier already exists" };
        }
        const NewSupplier = new supplier_model_1.default({
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
        const salt = yield bcrypt.genSalt(10);
        NewSupplier.password = yield bcrypt.hash(password, salt);
        yield NewSupplier.save();
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
    }
    catch (error) {
        console.log(error);
        return { code: 500, message: "Internal Server Error" };
    }
});
exports.UpdateSupplier = ({ email, name, businessName, cuit, domain, address, phone, category, primaryColor, secondaryColor, password, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let supplier = yield supplier_model_1.default.findOne({ cuit: cuit }).lean();
        if (!supplier) {
            return { code: 400, message: "Supplier does not exists" };
        }
        const salt = yield bcrypt.genSalt(10);
        supplier.password = yield bcrypt.hash(password, salt);
        yield supplier_model_1.default.updateOne({ cuit: cuit }, {
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
        });
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
    }
    catch (error) {
        return { code: 500, message: "Internal Server Error" };
    }
});
exports.UpdateSupplierLogo = (cuit, logo) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cloudinaryResult = yield CloudinaryService_1.default.uploadImage(logo);
        const updatedSupplier = yield supplier_model_1.default.findOneAndUpdate({ cuit: cuit }, { $set: { logo: cloudinaryResult.url } }, { new: true }).lean();
        if (!updatedSupplier) {
            return { code: 400, message: "Supplier does not exists" };
        }
        return {
            code: 200,
            payload: {
                supplier: updatedSupplier,
            },
        };
    }
    catch (error) {
        return { code: 500, message: "Internal Server Error" };
    }
});
exports.updateSupplierCoverPhoto = (cuit, coverPhoto) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cloudinaryResult = yield CloudinaryService_1.default.uploadImage(coverPhoto);
        const updatedSupplier = yield supplier_model_1.default.findOneAndUpdate({ cuit: cuit }, { $set: { coverPhoto: cloudinaryResult.url } }, { new: true }).lean();
        if (!updatedSupplier) {
            return { code: 400, message: "Supplier does not exists" };
        }
        return {
            code: 200,
            payload: {
                supplier: updatedSupplier,
            },
        };
    }
    catch (error) {
        return { code: 500, message: "Internal Server Error" };
    }
});
exports.DeleteSupplier = (cuit) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield supplier_model_1.default.deleteOne({ cuit: cuit }).lean();
        return { code: 200, message: "Supplier Deleted" };
    }
    catch (error) {
        return { code: 500, message: "Internal Server Error" };
    }
});
exports.GetSupplier = (cuit) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const supplier = yield supplier_model_1.default.findOne({ cuit: cuit }).lean();
        if (!supplier) {
            return { code: 404, message: "Supplier not found" };
        }
        return {
            code: 200,
            payload: {
                supplier,
            },
        };
    }
    catch (error) {
        return { code: 500, message: "Internal Server Error" };
    }
});
