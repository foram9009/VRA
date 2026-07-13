// lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

export async function uploadToCloudinary(buffer: Buffer, filename: string, folder = 'luxe-agency') {
  return new Promise<{ url: string; publicId: string }>((resolve, reject) => {
    const cleanName = filename.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9-_]/g, '_');
    const uniqueName = `${cleanName}_${Date.now()}`;
    
    const stream = cloudinary.uploader.upload_stream(
      { folder, public_id: uniqueName },
      (error, result) => {
        if (error) reject(error);
        else resolve({
          url: result?.secure_url ?? '',
          publicId: result?.public_id ?? '',
        });
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
