import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { createPost, getRecentPosts, getRecentPostsPaginated, getUserPosts, searchPosts } from "../../services/appwrite";
import { QUERY_KEYS } from "../../keys/queryKeys";
import type { NewPost } from "../../types";

/**
 * Hook for creating a new post.
 */
export const useCreatePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ post, userId }: { post: NewPost; userId: string }) =>
            createPost(post, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_POSTS] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_RECENT_POSTS] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_RECENT_POSTS_PAGINATED] });
        },
        onError: (error: Error) => {
            console.error("useCreatePost :: error:", error);
        }
    });
};

/**
 * Hook for fetching recent posts (non-paginated, legacy).
 */
export const useGetRecentPosts = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        queryFn: getRecentPosts,
        staleTime: 1000 * 60 * 5,
    });
};

/**
 * Hook for infinite-scroll paginated posts feed.
 * Usage:
 *   const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetRecentPostsInfinite()
 *   const posts = data?.pages.flatMap(p => p.documents) ?? []
 */
export const useGetRecentPostsInfinite = () => {
    return useInfiniteQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS_PAGINATED],
        queryFn: ({ pageParam }: { pageParam?: string }) => getRecentPostsPaginated(pageParam),
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (lastPage) => {
            const docs = lastPage.documents;
            if (docs.length < 10) return undefined; // reached last page
            return docs[docs.length - 1].$id;       // cursor = last doc id
        },
        staleTime: 1000 * 60 * 5,
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
        staleTime: 1000 * 60 * 5,
    });
};

/**
 * useSearchPosts - Full-text search over post captions.
 * Only fires when the search term has at least 2 characters.
 * Requires a full-text index on `caption` in Appwrite.
 */
export const useSearchPosts = (searchTerm: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
        queryFn: () => searchPosts(searchTerm),
        enabled: searchTerm.trim().length >= 2,
        staleTime: 1000 * 30, // 30s — search results can go stale quickly
    });
};
