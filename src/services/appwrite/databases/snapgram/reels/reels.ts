import { ID, Query, type Models } from "appwrite";
import { databases, appwriteConfig } from "../../../config";
import type { Reel } from "../../../../../types";

const REELS_PAGE_SIZE = 5;

/**
 * getRecentReels - Fetches the latest reels (non-paginated, for global feed).
 */
export const getRecentReels = async (): Promise<Models.DocumentList<Models.Document & Reel>> => {
    try {
        const reels = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.reelsCollectionId,
            [Query.orderDesc("$createdAt"), Query.limit(20)]
        ) as Models.DocumentList<Models.Document & Reel>;
        if (!reels) throw Error;
        return reels;
    } catch (error) {
        console.error("ReelService :: getRecentReels error:", error);
        throw error;
    }
};

/**
 * getRecentReelsPaginated - Fetches paginated global reels feed.
 * @param cursor - The $id of the last document on the previous page.
 */
export const getRecentReelsPaginated = async (cursor?: string): Promise<Models.DocumentList<Models.Document & Reel>> => {
    try {
        const queries = [Query.orderDesc("$createdAt"), Query.limit(REELS_PAGE_SIZE)];
        if (cursor) queries.push(Query.cursorAfter(cursor));
        const reels = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.reelsCollectionId,
            queries
        ) as Models.DocumentList<Models.Document & Reel>;
        if (!reels) throw Error;
        return reels;
    } catch (error) {
        console.error("ReelService :: getRecentReelsPaginated error:", error);
        throw error;
    }
};

/**
 * getUserReels - Fetches all reels created by a specific user.
 */
export const getUserReels = async (userId: string): Promise<Models.DocumentList<Models.Document & Reel>> => {
    try {
        const reels = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.reelsCollectionId,
            [Query.equal("creator", userId), Query.orderDesc("$createdAt"), Query.limit(50)]
        ) as Models.DocumentList<Models.Document & Reel>;
        if (!reels) throw Error;
        return reels;
    } catch (error) {
        console.error("ReelService :: getUserReels error:", error);
        throw error;
    }
};

/**
 * getUserReelsPaginated - Fetches paginated reels for a specific user.
 * @param userId - Creator user ID.
 * @param cursor - The $id of the last document on the previous page.
 */
export const getUserReelsPaginated = async (userId: string, cursor?: string): Promise<Models.DocumentList<Models.Document & Reel>> => {
    try {
        const queries = [
            Query.equal("creator", userId),
            Query.orderDesc("$createdAt"),
            Query.limit(REELS_PAGE_SIZE),
        ];
        if (cursor) queries.push(Query.cursorAfter(cursor));
        const reels = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.reelsCollectionId,
            queries
        ) as Models.DocumentList<Models.Document & Reel>;
        if (!reels) throw Error;
        return reels;
    } catch (error) {
        console.error("ReelService :: getUserReelsPaginated error:", error);
        throw error;
    }
};


export const createReel = async (reel: {
    userId: string;
    caption: string;
    videoUrl: string;
    videoId: string;
    audio?: string;
    tags?: string[];
}) => {
    try {
        const newReel = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.reelsCollectionId,
            ID.unique(),
            {
                creator: reel.userId,
                caption: reel.caption,
                videoUrl: reel.videoUrl,
                videoId: reel.videoId,
                audio: reel.audio || "Original Audio",
                tags: reel.tags || [],
                likes: []
            }
        );

        if (!newReel) throw Error;

        return newReel;
    } catch (error) {
        console.error("ReelService :: createReel error:", error);
        throw error;
    }
};

/**
 * deleteReel - Deletes a reel document.
 */
export const deleteReel = async (reelId: string) => {
    try {
        const result = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.reelsCollectionId,
            reelId
        );

        if (!result) throw Error;

        return { status: "ok" };
    } catch (error) {
        console.error("ReelService :: deleteReel error:", error);
        throw error;
    }
};
