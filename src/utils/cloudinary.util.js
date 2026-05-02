import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

export const initCloudinary = () => {
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
}

export const cloudinaryUploader = async (filePath) => {
    try {
        const response = await cloudinary.uploader.upload(filePath, {resource_type : "auto"});
        fs.unlinkSync(filePath);
        return response;
    } catch (error) {
        fs.unlinkSync(filePath);
        throw error;
    }
}

export const cloudinaryDestroyar = async (public_id) => {
    try {
        await cloudinary.uploader.destroy(public_id);
    } catch (error) {
        throw error;
    }
}