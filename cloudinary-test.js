const cloudinary = require("cloudinary").v2;
require("dotenv").config({ path: require("path").resolve(__dirname, ".env") });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "iuml8lxh",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function runCloudinaryWorkflow() {
  try {
    console.log("Starting Cloudinary Workflow...");

    const sampleImageUrl = "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg";
    const uploadResult = await cloudinary.uploader.upload(sampleImageUrl);

    console.log("\n--- UPLOAD SUCCESS ---");
    console.log(`Secure URL: ${uploadResult.secure_url}`);
    console.log(`Public ID: ${uploadResult.public_id}`);

    console.log("\n--- IMAGE DETAILS ---");
    console.log(`Width: ${uploadResult.width}px`);
    console.log(`Height: ${uploadResult.height}px`);
    console.log(`Format: ${uploadResult.format}`);
    console.log(`File Size: ${uploadResult.bytes} bytes`);

    const transformedUrl = cloudinary.url(uploadResult.public_id, {
      fetch_format: "auto",
      quality: "auto",
      secure: true,
    });

    console.log("\n--- TRANSFORMATION SUCCESS ---");
    console.log(`Transformed URL: ${transformedUrl}\n`);
  } catch (error) {
    console.error("Cloudinary Workflow Failed:", error);
  }
}

runCloudinaryWorkflow();
