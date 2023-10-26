import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import multer ,{MulterError} from 'multer';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { configKeys } from './configKeys';

declare global {
  namespace Express {
    interface Request {
      uploadedFile?: Express.Multer.File;
    }
  }
}

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

// middleware function for handling file uploads
const handleFileUpload = (fieldName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    upload.single(fieldName)(req, res, (err: any) => {
      if (err instanceof MulterError) {
        return res.status(400).json({ error: "File upload error" });
      } else if (err) {
        return res.status(500).json({ error: "Server Error" });
      }

       const file = req.file?.path as unknown as Express.Multer.File;      

      // // Check if a file was uploaded
      // if (!file) {
      //    return res.status(400).json({ error: "No Files uploaded" });
      // }

      // Attach the file to the request object
      req.uploadedFile = file;

      next();
    });
  };
};

export { handleFileUpload };