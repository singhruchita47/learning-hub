const cloudinary = require('cloudinary').v2;

// STEP 2 & 3.1: Configure Cloudinary with Inline Credentials
cloudinary.config({
  cloud_name: 'iuml8lxh',
  api_key: '779785661497217',
  api_secret: 'Bny6Zea69k5496OlNKXAAV7QxXk'
});

async function runCloudinaryWorkflow() {
  try {
    console.log("Starting Cloudinary Workflow...");

    // 3.2: Upload an image from demo domain
    const sampleImageUrl = 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg';
    console.log(`Uploading image from: ${sampleImageUrl}`);
    
    const uploadResult = await cloudinary.uploader.upload(sampleImageUrl);
    
    console.log("\n--- UPLOAD SUCCESS ---");
    console.log(`Secure URL: ${uploadResult.secure_url}`);
    console.log(`Public ID: ${uploadResult.public_id}`);

    // 3.3: Get and print image metadata details
    console.log("\n--- IMAGE DETAILS ---");
    console.log(`Width: ${uploadResult.width}px`);
    console.log(`Height: ${uploadResult.height}px`);
    console.log(`Format: ${uploadResult.format}`);
    console.log(`File Size: ${uploadResult.bytes} bytes`);

    // 3.4: Transform the image (f_auto for format, q_auto for quality optimization)
    const transformedUrl = cloudinary.url(uploadResult.public_id, {
      fetch_format: 'auto', // Automatically delivers WebP/AVIF depending on browser
      quality: 'auto',      // Compresses the image perfectly without losing visible quality
      secure: true
    });

    console.log("\n--- TRANSFORMATION SUCCESS ---");
    console.log("Done! Click link below to see optimized version of the image. Check the size and the format.");
    console.log(`Transformed URL: ${transformedUrl}\n`);

  } catch (error) {
    console.error("Cloudinary Workflow Failed:", error);
  }
}

runCloudinaryWorkflow();