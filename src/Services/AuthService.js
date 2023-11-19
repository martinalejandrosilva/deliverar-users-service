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
const user_model_1 = __importDefault(require("../Models/user.model"));
const EmailService_1 = require("./EmailService");
const supplier_model_1 = __importDefault(require("../Models/supplier.model"));
const bcrypt = require("bcrypt");
const generatePassword = () => {
    const length = 8;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let retVal = "";
    while (!(/[A-Z]/.test(retVal) && /[\W_]/.test(retVal))) {
        retVal = "";
        for (let i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
    }
    return retVal;
};
exports.Authenticate = ({ email, password, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield user_model_1.default.findOne({ email }).lean();
        if (!user) {
            return { message: "Ha Ocurrido un Error.!", code: 500 };
        }
        const isMatch = yield bcrypt.compare(password, user.password);
        if (!isMatch) {
            return {
                message: "Email o Contraseña Incorrecta",
                code: 400,
            };
        }
        return { code: 200, user: user };
    }
    catch (err) {
        return { message: "Ha Ocurrido un Error", code: 500 };
    }
});
exports.AuthenticateSupplier = ({ cuit, password, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let supplier = yield supplier_model_1.default.findOne({ cuit: cuit }).lean();
        if (!supplier) {
            return { message: "Ha Ocurrido un Error.!", code: 500 };
        }
        const isMatch = yield bcrypt.compare(password, supplier.password);
        if (!isMatch) {
            return {
                message: "cuit o Contraseña Incorrecta",
                code: 400,
            };
        }
        return { code: 200, supplier: supplier };
    }
    catch (err) {
        return { message: "Ha Ocurrido un Error", code: 500 };
    }
});
exports.RecoverPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findOne({ email }).lean();
        if (!user) {
            return {
                message: "Se enviara un correo con la nueva contraseña",
                code: 200,
            };
        }
        // Generate a new password
        const newPassword = generatePassword();
        // Hash the new password
        const salt = yield bcrypt.genSalt(10);
        const hashedPassword = yield bcrypt.hash(newPassword, salt);
        // Update the user's password in the database
        yield user_model_1.default.updateOne({ email }, { password: hashedPassword });
        // Send the new password to the user's email
        // (code for sending email not included)
        yield (0, EmailService_1.sendMail)(email, "Recuperacion de Contraseña", `<p>Esta es su nueva contraseña: ${newPassword}</p>`);
        return {
            code: 200,
            message: "Se enviara un correo con la nueva contraseña",
        };
    }
    catch (err) {
        return { message: "Ha Ocurrido un Error", code: 500 };
    }
});
exports.RegisterOrLoginGoogleUser = (profile) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield user_model_1.default.findOne({ email: profile.emails[0].value }).lean();
        // If user doesn't exist, create a new one
        if (!user) {
            const newUser = new user_model_1.default({
                name: profile.displayName,
                email: profile.emails[0].value,
                profilePicture: profile.photos[0].value,
                createdOn: Date.now(),
            });
            user = yield newUser.save();
        }
        return { code: 200, user: user };
    }
    catch (err) {
        return { code: 500, user: null };
    }
});
