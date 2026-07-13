// lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

export async function uploadToCloudinary(buffer: Buffer, filename: string, folder = 'luxe-agency') {
  return new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, public_id: filename.replace(/\.[^/.]+$/, '') },
      (error, result) => {
        if (error) reject(error);
        else resolve(result?.secure_url ?? '');
      }
    );
    stream.end(buffer);
  });
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };
