import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import multer from 'multer';
import { Request, RequestHandler } from 'express';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { configKeys } from './configKeys';

interface CloudinaryStorageOptions {
  cloudinary: any; // Adjust the type as needed for the cloudinary object
  params: {
    resource_type: string;
    allowed_formats: string[];
    public_id: (req: Request, file: Express.Multer.File) => string;
  };
}

// Cloudinary configuration
cloudinary.config({
  cloud_name: configKeys.CLOUD_NAME,
  api_key: configKeys.CLOUD_API_KEY,
  api_secret: configKeys.CLOUD_API_SECRET
});

// Multer configuration
const storageOptions: CloudinaryStorageOptions = {
  cloudinary: cloudinary,
  params: {
    resource_type: 'auto',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    public_id: (req: Request, file: Express.Multer.File): string => {
      const fileName = file.originalname.split('.').slice(0, -1).join('.');
      return fileName;
    }
  }
};

const storage = new CloudinaryStorage(storageOptions);
const upload = multer({ storage: storage })

export { upload };