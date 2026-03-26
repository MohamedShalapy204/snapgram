import { ID, Query } from "appwrite";
import { databases, appwriteConfig } from "../../../config";
import { uploadFile, deleteFile, getFilePreview } from "../../../storage/storage";
import type { NewPost } from "../../../../../types";

const POSTS_PAGE_SIZE = 10;

/**
 * Creates a new post document in the database and uploads the image.
 */
export const createPost = async (post: NewPost, userId: string) => {
    try {
        let imageUrl: string | null = null;
        let imageId: string | null = null;

        // Only upload a file if one was provided
        if (post.file && post.file.length > 0) {
            const uploadedFile = await uploadFile(post.file[0]);
            if (!uploadedFile) throw new Error("File upload failed");

            const fileUrl = getFilePreview(uploadedFile.$id);
            if (!fileUrl) {
                await deleteFile(uploadedFile.$id);
                throw new Error("Could not retrieve file URL");
            }

            imageUrl = fileUrl;
            imageId = uploadedFile.$id;
        }

        const tags = post.tags?.replace(/ /g, '').split(',') || [];

        const newPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postsCollectionId,
            ID.unique(),
            {
                creator: userId,
                caption: post.caption,
                imageUrl,
                location: post.location,
                tags,
                imageId,
                likes: [],
                save: [],
            }
        );

        if (!newPost) {
            if (imageId) await deleteFile(imageId);
            throw new Error("Failed to create post document");
        }

        return newPost;
    } catch (error) {
        console.error("PostService :: createPost error:", error);
        throw error;
    }
};

/**
 * Fetches the recent posts for the home feed (non-paginated, legacy).
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

/**
 * Fetches paginated posts for the home feed.
 * @param cursor - The $id of the last document on the previous page.
 */
export const getRecentPostsPaginated = async (cursor?: string) => {
    try {
        const queries = [
            Query.orderDesc("$createdAt"),
            Query.limit(POSTS_PAGE_SIZE),
        ];
        if (cursor) queries.push(Query.cursorAfter(cursor));

        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postsCollectionId,
            queries
        );
        if (!posts) throw new Error("Failed to fetch paginated posts");
        return posts;
    } catch (error) {
        console.error("PostService :: getRecentPostsPaginated error:", error);
        throw error;
    }
};

/**
 * Fetches posts for a specific user.
 */
export const getUserPosts = async (userId: string, order: "asc" | "desc" = "desc") => {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postsCollectionId,
            [
                Query.equal("creator", userId),
                order === "desc" ? Query.orderDesc("$createdAt") : Query.orderAsc("$createdAt"),
                Query.limit(50)
            ]
        );
        if (!posts) throw new Error("Failed to fetch user posts");
        return posts;
    } catch (error) {
        console.error("PostService :: getUserPosts error:", error);
        throw error;
    }
};

/**
 * Searches posts by caption text using Appwrite full-text search.
 * Requires a full-text index on the `caption` attribute in Appwrite.
 */
export const searchPosts = async (query: string) => {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postsCollectionId,
            [
                Query.contains("caption", query),
                Query.orderDesc("$createdAt"),
                Query.limit(10),
            ]
        );
        return posts;
    } catch (error) {
        console.error("PostService :: searchPosts error:", error);
        throw error;
    }
};
