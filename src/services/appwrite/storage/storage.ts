import { ID, ImageGravity, Permission, Role } from "appwrite";
import { storage, appwriteConfig } from "../config";

/**
 * Uploads a file to Appwrite storage and returns its resource summary.
 */
export const uploadFile = async (file: File) => {
    try {
        const uploadedFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            file,
            [
                Permission.read(Role.any()), // Allow everyone to read (needed for public profile pictures)
                Permission.write(Role.users()), // Allow any logged-in user to create/manage their files
            ]
        );

        return uploadedFile;
    } catch (error) {
        console.error("StorageService :: uploadFile error:", error);
        throw error;
    }
};

/**
 * Returns the public URL for an uploaded file.
 */
export const getFilePreview = (fileId: string) => {
    try {
        const fileUrl = storage.getFilePreview(
            appwriteConfig.storageId,
            fileId,
            2000,
            2000,
            ImageGravity.Top,
            100
        );

        return fileUrl.toString();
    } catch (error) {
        console.error("StorageService :: getFilePreview error:", error);
        return "";
    }
};

/**
 * Deletes a file from storage.
 */
export const deleteFile = async (fileId: string) => {
    try {
        await storage.deleteFile(appwriteConfig.storageId, fileId);
    } catch (error) {
        console.error("StorageService :: deleteFile error:", error);
    }
};
