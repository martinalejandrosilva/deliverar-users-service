"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const userAddressSchema = new mongoose_1.Schema({
    street: { type: String, required: true },
    number: { type: Number, required: true },
    city: { type: String, required: true },
});
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    dni: { type: String, required: false },
    password: { type: String, required: false },
    createdOn: { type: Date, default: Date.now },
    dateOfBirth: { type: Date, required: false },
    address: { type: String, required: false },
    phone: { type: String, required: false },
    profilePicture: { type: String, required: false },
    isProvider: { type: Boolean, default: false },
    isEmployee: { type: Boolean, default: false },
});
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
