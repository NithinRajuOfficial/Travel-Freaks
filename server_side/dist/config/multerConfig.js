"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleFileUpload = void 0;
const cloudinary_1 = require("cloudinary");
const multer_1 = __importStar(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const configKeys_1 = require("./configKeys");
// Cloudinary configuration
cloudinary_1.v2.config({
    cloud_name: configKeys_1.configKeys.CLOUD_NAME,
    api_key: configKeys_1.configKeys.CLOUD_API_KEY,
    api_secret: configKeys_1.configKeys.CLOUD_API_SECRET
});
// Multer configuration
const storageOptions = {
    cloudinary: cloudinary_1.v2,
    params: {
        resource_type: 'auto',
        allowed_formats: ['jpg', 'jpeg', 'png'],
        public_id: (req, file) => {
            const fileName = file.originalname.split('.').slice(0, -1).join('.');
            return fileName;
        }
    }
};
const storage = new multer_storage_cloudinary_1.CloudinaryStorage(storageOptions);
const upload = (0, multer_1.default)({ storage: storage });
// middleware function for handling file uploads
const handleFileUpload = (fieldName) => {
    return (req, res, next) => {
        upload.single(fieldName)(req, res, (err) => {
            var _a;
            if (err instanceof multer_1.MulterError) {
                return res.status(400).json({ error: "File upload error" });
            }
            else if (err) {
                return res.status(500).json({ error: "Server Error" });
            }
            const file = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
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
exports.handleFileUpload = handleFileUpload;
