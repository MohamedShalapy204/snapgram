import { ID, Query } from "appwrite";
import { databases, appwriteConfig } from "../../../config";
import { uploadFile, deleteFile, getFilePreview } from "../../../storage/storage";
import type { NewPost } from "../../../../../types";

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
            appwriteConfig.postsCollectionId,
            ID.unique(),
            {
                creator: userId,
                caption: post.caption,
                imageUrl: fileUrl,
                location: post.location,
                tags: tags,
                imageId: uploadedFile.$id,
                likes: [],
                save: [],
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
            appwriteConfig.postsCollectionId,
            [Query.orderDesc("$createdAt"), Query.limit(20)]
        );

        if (!posts) throw new Error("Failed to fetch posts");

        return posts;
    } catch (error) {
        console.error("PostService :: getRecentPosts error:", error);
        throw error;
    }
};
