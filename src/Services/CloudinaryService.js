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
exports.CloudinaryService = void 0;
const cloudinary_1 = __importDefault(require("cloudinary"));
// Configure Cloudinary
cloudinary_1.default.v2.config({
    cloud_name: "dvebbfaxj",
    api_key: "286186161524829",
    api_secret: "tfjQVhNGF4HAxqZWzQLoM2kKz5A",
});
class CloudinaryService {
    uploadImage(buffer) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary_1.default.v2.uploader.upload_stream({ resource_type: "image" }, (error, result) => {
                    if (error) {
                        reject(error);
                    }
                    else if (!result) {
                        reject(new Error("No result returned from Cloudinary"));
                    }
                    else {
                        resolve(result);
                    }
                });
                uploadStream.end(buffer);
            });
        });
    }
}
exports.CloudinaryService = CloudinaryService;
const cloudinaryService = new CloudinaryService();
exports.default = cloudinaryService;
