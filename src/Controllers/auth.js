"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsoa_1 = require("tsoa");
const AuthService = require("../Services/AuthService");
const config = require("config");
const jwt = require("jsonwebtoken");
let AuthController = class AuthController {
    /**
     * Authenticate a user.
     * @param email The user email.
     * @param password The user password.
     * @returns The user data.
     */
    login({ email, password }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield AuthService.Authenticate({ email, password });
            if (user.code === 200) {
                const token = yield new Promise((resolve, reject) => {
                    jwt.sign(user.user, //Right now the token is returning the user and email define what should return.
                    config.get("jwtSecret"), { expiresIn: 3600 }, (err, token) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(token);
                        }
                    });
                });
                return { code: user.code, token: token, user: user.user };
            }
            return { code: user.code, message: user.message };
        });
    }
    /**
     * Authenticate a supplier.
     * @param cuit The supplier cuit.
     * @param password The supplier password.
     * @returns The supplier data.
     */
    loginSupplier({ cuit, password }) {
        return __awaiter(this, void 0, void 0, function* () {
            const supplier = yield AuthService.AuthenticateSupplier({ cuit, password });
            if (supplier.code === 200) {
                const token = yield new Promise((resolve, reject) => {
                    jwt.sign(supplier.supplier, config.get("jwtSecret"), { expiresIn: 3600 }, (err, token) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(token);
                        }
                    });
                });
                return { code: supplier.code, token: token, supplier: supplier.supplier };
            }
            return { code: supplier.code, message: supplier.message };
        });
    }
    /**
     * Initiates User Password Recovery Process.
     * @param email The user email.
     */
    recovery(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield AuthService.RecoverPassword(email);
            return { code: user.code, message: user.message };
        });
    }
};
__decorate([
    (0, tsoa_1.Post)("/login"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, tsoa_1.Post)("/login-supplier"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginSupplier", null);
__decorate([
    (0, tsoa_1.Post)("/password-recovery/:email"),
    __param(0, (0, tsoa_1.Path)("email")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "recovery", null);
AuthController = __decorate([
    (0, tsoa_1.Route)("api/auth"),
    (0, tsoa_1.Tags)("Auth")
], AuthController);
exports.default = AuthController;
