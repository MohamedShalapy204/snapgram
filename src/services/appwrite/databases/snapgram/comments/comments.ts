import { ID, Query } from "appwrite";
import { databases, appwriteConfig } from "../../../config";
import type { NewComment } from "../../../../../types";

/**
 * Creates a new comment document for a post.
 */
export const createComment = async (comment: NewComment) => {
    try {
        const payload: {
            userId: string;
            text: string;
            postId?: string;
            reelId?: string;
        } = {
            userId: comment.userId,
            text: comment.text,
        };

        if (comment.postId) payload.postId = comment.postId;
        if (comment.reelId) payload.reelId = comment.reelId;

        return await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.commentsCollectionId,
            ID.unique(),
            payload
        );
    } catch (error) {
        console.error("CommentService :: createComment error:", error);
        throw error;
    }
};

/**
 * Fetches all comments for a given post or reel, ordered oldest first.
 */
export const getComments = async (postId?: string, reelId?: string) => {
    try {
        const queries = [
            Query.orderAsc("$createdAt"),
            Query.limit(100),
        ];

        if (postId) queries.push(Query.equal("postId", postId));
        if (reelId) queries.push(Query.equal("reelId", reelId));

        return await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.commentsCollectionId,
            queries
        );
    } catch (error) {
        console.error("CommentService :: getComments error:", error);
        throw error;
    }
};

/**
 * Deletes a comment by its document ID.
 */
export const deleteComment = async (commentId: string) => {
    try {
        return await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.commentsCollectionId,
            commentId
        );
    } catch (error) {
        console.error("CommentService :: deleteComment error:", error);
        throw error;
    }
};
