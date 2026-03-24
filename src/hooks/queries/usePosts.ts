import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPost, getRecentPosts, getUserPosts } from "../../services/appwrite";
import { QUERY_KEYS } from "../../keys/queryKeys";
import type { NewPost } from "../../types";

/**
 * Hook for creating a new post.
 * Following React Query patterns and service pattern.
 */
export const useCreatePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ post, userId }: { post: NewPost; userId: string }) =>
            createPost(post, userId),
        onSuccess: () => {
            // Invalidate the post feed to trigger a refresh
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS]
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            });
        },
        onError: (error: Error) => {
            console.error("useCreatePost :: error:", error);
        }
    });
};

/**
 * Hook for fetching recent posts.
 */
export const useGetRecentPosts = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        queryFn: getRecentPosts,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

/**
 * Hook for fetching user specific posts.
 */
export const useGetUserPosts = (userId: string, order: "asc" | "desc" = "desc") => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_USER_POSTS, userId, order],
        queryFn: () => getUserPosts(userId, order),
        enabled: !!userId,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};
