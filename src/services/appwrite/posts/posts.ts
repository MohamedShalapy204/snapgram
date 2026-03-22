import { ID, Query, ImageGravity } from "appwrite";
import { databases, storage, appwriteConfig } from "../config";
import type { NewPost } from "../../../types";

/**
 * Uploads a file to Appwrite storage and returns its resource summary.
 */
export const uploadFile = async (file: File) => {
    try {
        const uploadedFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            file
        );

        return uploadedFile;
    } catch (error) {
        console.error("PostService :: uploadFile error:", error);
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

        return fileUrl;
    } catch (error) {
        console.error("PostService :: getFilePreview error:", error);
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
        console.error("PostService :: deleteFile error:", error);
    }
};

/**
 * Creates a new post document in the database and uploads the image.
 */
export const createPost = async (post: NewPost, userId: string) => {
    try {
        // First, upload the file to storage
        const uploadedFile = await uploadFile(post.file[0]);

        if (!uploadedFile) throw new Error("File upload failed");

        // Get the preview URL
        const fileUrl = getFilePreview(uploadedFile.$id);

        if (!fileUrl) {
            await deleteFile(uploadedFile.$id);
            throw new Error("Could not retrieve file URL");
        }

        // Convert tags string to array
        const tags = post.tags?.replace(/ /g, '').split(',') || [];

        // Create the document in Appwrite Database
        const newPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            ID.unique(),
            {
                creator: userId,
                caption: post.caption,
                imageUrl: fileUrl,
                location: post.location,
                tags: tags,
                imageId: uploadedFile.$id,
            }
        );

        if (!newPost) {
            await deleteFile(uploadedFile.$id);
            throw new Error("Failed to create post document");
        }

        return newPost;
    } catch (error) {
        console.error("PostService :: createPost error:", error);
        throw error;
    }
};

/**
 * Fetches the recent posts for the home feed.
 */
export const getRecentPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            [Query.orderDesc("$createdAt"), Query.limit(20)]
        );

        if (!posts) throw new Error("Failed to fetch posts");

        return posts;
    } catch (error) {
        console.error("PostService :: getRecentPosts error:", error);
        throw error;
    }
};
