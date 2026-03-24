import { Query } from "appwrite";
import { databases, appwriteConfig } from "../../../config";
import type { User } from "../../../../../types";

/**
 * Saves a new user document to the Appwrite database.
 */
export const saveUserToDB = async (user: {
    userId: string;
    email: string;
    name: string;
    username: string;
    imageUrl: string;
    imageId: string;
}) => {
    try {
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            user.userId,
            {
                email: user.email,
                name: user.name,
                username: user.username,
                imageUrl: user.imageUrl,
                imageId: user.imageId,
            }
        );

        return newUser;
    } catch (error) {
        console.error("UserService :: saveUserToDB error:", error);
        throw error;
    }
};

/**
 * Retrieves a user document by its ID.
 */
export const getUserById = async (userId: string) => {
    try {
        const user = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            userId
        );

        return user as unknown as User;
    } catch (error) {
        console.error("UserService :: getUserById error:", error);
        throw error;
    }
};

/**
 * Updates an existing user document.
 */
export const updateUser = async (user: {
    userId: string;
    name?: string;
    bio?: string;
    imageUrl?: string;
    imageId?: string;
}) => {
    try {
        const updatedUser = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            user.userId,
            {
                ...(user.name !== undefined && { name: user.name }),
                ...(user.bio !== undefined && { bio: user.bio }),
                ...(user.imageUrl !== undefined && { imageUrl: user.imageUrl }),
                ...(user.imageId !== undefined && { imageId: user.imageId }),
            }
        );

        return updatedUser as unknown as User;
    } catch (error) {
        console.error("UserService :: updateUser error:", error);
        throw error;
    }
};

/**
 * Fetches a list of users, with an optional limit.
 */
export const getUsers = async (limit?: number) => {
    try {
        const users = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            limit ? [Query.limit(limit)] : []
        );

        return users;
    } catch (error) {
        console.error("UserService :: getUsers error:", error);
        throw error;
    }
};

/**
 * Searches for users by their name or username.
 */
export const searchUsers = async (searchTerm: string) => {
    try {
        const users = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            [Query.or([Query.contains("name", searchTerm), Query.contains("username", searchTerm)])]
        );

        return users;
    } catch (error) {
        console.error("UserService :: searchUsers error:", error);
        throw error;
    }
};

/**
 * Retrieves a user document by exact username match (for uniqueness validation).
 */
export const getUserByUsername = async (username: string) => {
    try {
        const users = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            [Query.equal("username", username)]
        );

        if (users.total > 0) return users.documents[0] as unknown as User;
        return null;
    } catch (error) {
        console.error("UserService :: getUserByUsername error:", error);
        throw error;
    }
};

/**
 * Retrieves a user document by exact email match (for uniqueness validation).
 */
export const getUserByEmail = async (email: string) => {
    try {
        const users = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            [Query.equal("email", email)]
        );

        if (users.total > 0) return users.documents[0] as unknown as User;
        return null;
    } catch (error) {
        console.error("UserService :: getUserByEmail error:", error);
        throw error;
    }
};
