import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(file: Express.Multer.File, folder = 'jogga-store/products'): Promise<{
    url: string;
    public_id: string;
    width: number;
    height: number;
    format: string;
  }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto',
          transformation: [
            { quality: 'auto', fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error) return reject(error);
          resolve({
            url: result!.secure_url,
            public_id: result!.public_id,
            width: result!.width,
            height: result!.height,
            format: result!.format,
          });
        },
      );

      const stream = new Readable();
      stream.push(file.buffer);
      stream.push(null);
      stream.pipe(uploadStream);
    });
  }

  async deleteImage(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }

  getUrl(publicId: string, options?: { width?: number; height?: number }): string {
    const transforms: string[] = [];
    if (options?.width) transforms.push(`w_${options.width}`);
    if (options?.height) transforms.push(`h_${options.height}`);
    transforms.push('q_auto', 'f_auto');

    const base = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`;
    if (transforms.length > 0) {
      return `${base}/${transforms.join(',')}/${publicId}`;
    }
    return `${base}/${publicId}`;
  }
}
