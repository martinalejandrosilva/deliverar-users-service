import cloudinary, {
  UploadApiErrorResponse,
  UploadApiResponse,
} from "cloudinary";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: "dvebbfaxj",
  api_key: "286186161524829",
  api_secret: "tfjQVhNGF4HAxqZWzQLoM2kKz5A",
});

export class CloudinaryService {
  async uploadImage(buffer: Buffer): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.v2.uploader.upload_stream(
        { resource_type: "image" },
        (
          error: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined
        ) => {
          if (error) {
            reject(error);
          } else if (!result) {
            reject(new Error("No result returned from Cloudinary"));
          } else {
            resolve(result);
          }
        }
      );

      uploadStream.end(buffer);
    });
  }
}

const cloudinaryService = new CloudinaryService();
export default cloudinaryService;
