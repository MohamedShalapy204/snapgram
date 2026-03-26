import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { createComment, getComments, getCommentsPaginated, deleteComment } from "../../services/appwrite";
import { QUERY_KEYS } from "../../keys/queryKeys";
import type { NewComment } from "../../types";

const COMMENTS_PAGE_SIZE = 15;

/**
 * useGetComments - Fetches all comments for a post or reel (non-paginated).
 */
export const useGetComments = (postId?: string, reelId?: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_COMMENTS, postId || reelId],
        queryFn: () => getComments(postId, reelId),
        enabled: !!(postId || reelId),
        staleTime: 1000 * 60 * 5,
    });
};

/**
 * useGetCommentsInfinite - Infinite scroll for comments sidebar.
 * Usage:
 *   const { data, fetchNextPage, hasNextPage } = useGetCommentsInfinite(postId)
 *   const comments = data?.pages.flatMap(p => p.documents) ?? []
 */
export const useGetCommentsInfinite = (postId?: string, reelId?: string) => {
    return useInfiniteQuery({
        queryKey: [QUERY_KEYS.GET_COMMENTS_PAGINATED, postId || reelId],
        queryFn: ({ pageParam }: { pageParam?: string }) =>
            getCommentsPaginated(postId, reelId, pageParam),
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (lastPage) => {
            const docs = lastPage.documents;
            if (docs.length < COMMENTS_PAGE_SIZE) return undefined;
            return docs[docs.length - 1].$id;
        },
        enabled: !!(postId || reelId),
        staleTime: 1000 * 60 * 2,
    });
};

/**
 * useCreateComment - Hook for creating a new comment.
 */
export const useCreateComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (comment: NewComment) => createComment(comment),
        onSuccess: (_, variables) => {
            const key = variables.postId || variables.reelId;
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_COMMENTS, key] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_COMMENTS_PAGINATED, key] });
        },
        onError: (error: Error) => {
            console.error("useCreateComment :: error:", error);
        }
    });
};

/**
 * useDeleteComment - Hook for deleting a comment.
 */
export const useDeleteComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ commentId }: { commentId: string; postId?: string; reelId?: string }) =>
            deleteComment(commentId),
        onSuccess: (_, variables) => {
            const key = variables.postId || variables.reelId;
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_COMMENTS, key] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_COMMENTS_PAGINATED, key] });
        },
        onError: (error: Error) => {
            console.error("useDeleteComment :: error:", error);
        }
    });
};
