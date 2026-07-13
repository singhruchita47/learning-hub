const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ?? "j9wsxc4f";
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET ?? "learning_hub_preset";

export async function uploadToCloudinary(file: File, preset = UPLOAD_PRESET): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", preset);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(errorBody || "Cloudinary upload failed");
  }

  const data = await response.json() as { secure_url: string };
  return data.secure_url;
}
