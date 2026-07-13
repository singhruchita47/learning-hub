import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env["CLOUDINARY_CLOUD_NAME"];
const apiKey = process.env["CLOUDINARY_API_KEY"];
const apiSecret = process.env["CLOUDINARY_API_SECRET"];

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

export function isCloudinaryConfigured() {
  return Boolean(cloudName && apiKey && apiSecret);
}

export async function uploadBufferToCloudinary(
  buffer: Buffer,
  fileName: string,
  folder = "learning-hub",
): Promise<string> {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary is not configured on the server.");
  }

  const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
        public_id: fileName.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9.\-_]/g, "_"),
      },
      (error, uploadResult) => {
        if (error || !uploadResult?.secure_url) {
          reject(error ?? new Error("Cloudinary upload failed"));
          return;
        }
        resolve({ secure_url: uploadResult.secure_url });
      },
    );

    upload.end(buffer);
  });

  return result.secure_url;
}
