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
const UserService = require("../Services/UserService");
const config = require("config");
const jwt = require("jsonwebtoken");
let UserController = class UserController {
    /**
     * Register a new user.
     * @param name The user name.
     * @param email The user email.
     * @param dni The user dni.
     * @param address The user address.
     * @param phone The user phone.
     * @param password The user password.
     * @returns The user data.
     */
    register({ name, email, dni, address, phone, password }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserService.Register({
                name,
                email,
                dni,
                address,
                phone,
                password,
            });
            if (user.code === 200) {
                const token = yield new Promise((resolve, reject) => {
                    jwt.sign(user.payload, config.get("jwtSecret"), { expiresIn: 3600 }, (err, token) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(token);
                        }
                    });
                });
                user.payload.token = token;
            }
            return { code: user.code, payload: user.payload };
        });
    }
    /**
     * Update a new user.
     * @param name The user name.
     * @param email The user email.
     * @param dni The user dni.
     * @param address The user address.
     * @param phone The user phone.
     * @param password The user password.
     * @returns The user data.
     */
    update({ name, email, dni, address, phone, password }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserService.UpdateUser({
                name,
                email,
                dni,
                address,
                phone,
                password,
            });
            if (user.code === 200) {
                const token = yield new Promise((resolve, reject) => {
                    jwt.sign(user.payload, config.get("jwtSecret"), { expiresIn: 3600 }, (err, token) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(token);
                        }
                    });
                });
                user.payload.token = token;
            }
            return { code: user.code, payload: user.payload };
        });
    }
    UpdateProfilePicture(email, profilePicture) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!profilePicture) {
                return { code: 400 };
            }
            const userResponse = yield UserService.updateUserProfilePicture(email, profilePicture.buffer);
            return userResponse; // Assuming the service returns an object of IUserResponse type
        });
    }
    /**
     * Deletes User Account.
     * @param email The user email.
     */
    delete(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserService.DeleteUser(email);
            return { code: user.code };
        });
    }
};
__decorate([
    (0, tsoa_1.Post)("/"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "register", null);
__decorate([
    (0, tsoa_1.Put)("/"),
    (0, tsoa_1.Security)("BearerAuth"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "update", null);
__decorate([
    (0, tsoa_1.Put)("/profilePicture/:email"),
    (0, tsoa_1.Security)("BearerAuth"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.UploadedFile)("profilePicture")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "UpdateProfilePicture", null);
__decorate([
    (0, tsoa_1.Delete)("/:email"),
    (0, tsoa_1.Security)("BearerAuth"),
    __param(0, (0, tsoa_1.Path)("email")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "delete", null);
UserController = __decorate([
    (0, tsoa_1.Route)("api/user"),
    (0, tsoa_1.Tags)("User")
], UserController);
exports.default = UserController;
