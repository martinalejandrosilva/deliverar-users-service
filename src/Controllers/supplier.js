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
const SupplierService = require("../Services/SupplierService");
const config = require("config");
const jwt = require("jsonwebtoken");
let SupplierController = class SupplierController {
    /**
     * Register a new supplier.
     * @param supplierData The supplier registration data.
     * @returns The supplier data with status code.
     */
    register(supplierData) {
        return __awaiter(this, void 0, void 0, function* () {
            const supplier = yield SupplierService.Register(supplierData);
            let token = undefined;
            if (supplier.code === 200) {
                token = yield new Promise((resolve, reject) => {
                    jwt.sign(supplier.payload, config.get("jwtSecret"), { expiresIn: 3600 }, (err, token) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(token);
                        }
                    });
                });
            }
            return {
                code: supplier.code,
                token: token,
                payload: supplier.payload,
            };
        });
    }
    /**
     * Updates supplier information.
     * @param supplierData The supplier update data.
     * @returns The updated supplier data with status code.
     */
    update(supplierData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield SupplierService.UpdateSupplier(supplierData);
        });
    }
    /**
     * Updates supplier logo.
     * @param cuit The supplier CUIT.
     * @param logo The supplier's new logo.
     * @returns The updated supplier data with status code.
     */
    updateLogo(cuit, logo) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield SupplierService.UpdateSupplierLogo(cuit, logo.buffer);
        });
    }
    /**
     * Updates supplier cover photo.
     * @param cuit The supplier CUIT.
     * @param coverPhoto The supplier's new cover photo.
     * @returns The updated supplier data with status code.
     */
    updateCoverPhoto(cuit, coverPhoto) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield SupplierService.updateSupplierCoverPhoto(cuit, coverPhoto.buffer);
        });
    }
    /**
     * Deletes supplier account.
     * @param cuit The supplier cuit.
     * @returns Status code of operation.
     */
    delete(cuit) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield SupplierService.DeleteSupplier(cuit);
        });
    }
    /**
     * Retrieves supplier information.
     * @param cuit The supplier cuit.
     * @returns The supplier data with status code.
     */
    get(cuit) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield SupplierService.GetSupplier(cuit);
        });
    }
};
__decorate([
    (0, tsoa_1.Post)("/"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SupplierController.prototype, "register", null);
__decorate([
    (0, tsoa_1.Put)("/"),
    (0, tsoa_1.Security)("BearerAuth"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SupplierController.prototype, "update", null);
__decorate([
    (0, tsoa_1.Put)("/logo/:cuit"),
    (0, tsoa_1.Security)("BearerAuth"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.UploadedFile)("logo")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SupplierController.prototype, "updateLogo", null);
__decorate([
    (0, tsoa_1.Put)("/coverPhoto/:cuit"),
    (0, tsoa_1.Security)("BearerAuth"),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.UploadedFile)("coverPhoto")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SupplierController.prototype, "updateCoverPhoto", null);
__decorate([
    (0, tsoa_1.Delete)("/:cuit"),
    (0, tsoa_1.Security)("BearerAuth"),
    __param(0, (0, tsoa_1.Path)("cuit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SupplierController.prototype, "delete", null);
__decorate([
    (0, tsoa_1.Get)("/:cuit"),
    __param(0, (0, tsoa_1.Path)("cuit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SupplierController.prototype, "get", null);
SupplierController = __decorate([
    (0, tsoa_1.Route)("api/supplier"),
    (0, tsoa_1.Tags)("Supplier")
], SupplierController);
exports.default = SupplierController;
