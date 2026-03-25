import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createComment, getComments, deleteComment } from "../../services/appwrite";
import { QUERY_KEYS } from "../../keys/queryKeys";
import type { NewComment } from "../../types";

/**
 * Hook for fetching comments for a specific post or reel.
 */
export const useGetComments = (postId?: string, reelId?: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_COMMENTS, postId || reelId],
        queryFn: () => getComments(postId, reelId),
        enabled: !!(postId || reelId),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

/**
 * Hook for creating a new comment.
 */
export const useCreateComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (comment: NewComment) => createComment(comment),
        onSuccess: (_, variables) => {
            // Invalidate the comments list for the post or reel
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_COMMENTS, variables.postId || variables.reelId]
            });
        },
        onError: (error: Error) => {
            console.error("useCreateComment :: error:", error);
        }
    });
};

/**
 * Hook for deleting a comment.
 */
export const useDeleteComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ commentId }: { commentId: string, postId?: string, reelId?: string }) =>
            deleteComment(commentId),
        onSuccess: (_, variables) => {
            // Invalidate the comments list for the post or reel
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_COMMENTS, variables.postId || variables.reelId]
            });
        },
        onError: (error: Error) => {
            console.error("useDeleteComment :: error:", error);
        }
    });
};
