import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserById, updateUser, getUsers, searchUsers } from "../../services/appwrite/databases/snapgram/users/users";
import { uploadFile, deleteFile, getFilePreview } from "../../services/appwrite/storage/storage";
import { QUERY_KEYS } from "../../keys/queryKeys";

/**
 * Hook to fetch a user by their ID from the database.
 */
export const useGetUserById = (userId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
        queryFn: () => getUserById(userId),
        enabled: !!userId,
    });
};

/**
 * Hook to fetch a list of users.
 */
export const useGetUsers = (limit?: number) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_USERS],
        queryFn: () => getUsers(limit),
    });
};

/**
 * Hook to search for users.
 */
export const useSearchUsers = (searchTerm: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_USERS, searchTerm],
        queryFn: () => searchUsers(searchTerm),
        enabled: !!searchTerm,
    });
};

/**
 * Hook to update a user's profile, including photo upload handling.
 */
export const useUpdateUserDB = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            user,
            file,
        }: {
            user: { userId: string; name?: string; bio?: string; imageId: string; imageUrl: string };
            file: File[];
        }) => {
            try {
                let imageId = user.imageId;
                let imageUrl = user.imageUrl;

                // If a new file is provided, upload it and update image info
                if (file && file.length > 0) {
                    const uploadedFile = await uploadFile(file[0]);
                    if (!uploadedFile) throw new Error("File upload failed");

                    const newImageUrl = getFilePreview(uploadedFile.$id).toString();
                    if (!newImageUrl) {
                        await deleteFile(uploadedFile.$id);
                        throw new Error("Failed to get image preview");
                    }

                    // Delete old file if it exists and is different from the new one
                    if (user.imageId && user.imageId !== uploadedFile.$id) {
                        await deleteFile(user.imageId);
                    }

                    imageId = uploadedFile.$id;
                    imageUrl = newImageUrl;
                }

                // Update the user document in the database
                const updatedUser = await updateUser({
                    userId: user.userId,
                    name: user.name,
                    bio: user.bio,
                    imageId,
                    imageUrl,
                });

                return updatedUser;
            } catch (error) {
                console.error("useUpdateUserDB :: error:", error);
                throw error;
            }
        },
        onSuccess: (data) => {
            // Invalidate queries to refresh UI
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.$id],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER],
            });
        },
    });
};
