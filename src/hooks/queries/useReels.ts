import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import {
    getRecentReels,
    getRecentReelsPaginated,
    getUserReels,
    getUserReelsPaginated,
    createReel,
    deleteReel,
} from "../../services/appwrite";
import { QUERY_KEYS } from "../../keys/queryKeys";

const REELS_PAGE_SIZE = 5;

/**
 * useGetReels - Fetches latest reels (non-paginated, for small feeds).
 */
export const useGetReels = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_REELS],
        queryFn: getRecentReels,
    });
};

/**
 * useGetReelsInfinite - Infinite scroll for global reels feed.
 * Usage:
 *   const { data, fetchNextPage, hasNextPage } = useGetReelsInfinite()
 *   const reels = data?.pages.flatMap(p => p.documents) ?? []
 */
export const useGetReelsInfinite = () => {
    return useInfiniteQuery({
        queryKey: [QUERY_KEYS.GET_REELS_PAGINATED],
        queryFn: ({ pageParam }: { pageParam?: string }) => getRecentReelsPaginated(pageParam),
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (lastPage) => {
            const docs = lastPage.documents;
            if (docs.length < REELS_PAGE_SIZE) return undefined;
            return docs[docs.length - 1].$id;
        },
    });
};

/**
 * useGetUserReels - Fetches all reels for a specific user (non-paginated).
 */
export const useGetUserReels = (userId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_USER_REELS, userId],
        queryFn: () => getUserReels(userId),
        enabled: !!userId,
    });
};

/**
 * useGetUserReelsInfinite - Infinite scroll for a user's reels (profile page).
 * Usage:
 *   const { data, fetchNextPage, hasNextPage } = useGetUserReelsInfinite(userId)
 *   const reels = data?.pages.flatMap(p => p.documents) ?? []
 */
export const useGetUserReelsInfinite = (userId: string) => {
    return useInfiniteQuery({
        queryKey: [QUERY_KEYS.GET_USER_REELS_PAGINATED, userId],
        queryFn: ({ pageParam }: { pageParam?: string }) => getUserReelsPaginated(userId, pageParam),
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (lastPage) => {
            const docs = lastPage.documents;
            if (docs.length < REELS_PAGE_SIZE) return undefined;
            return docs[docs.length - 1].$id;
        },
        enabled: !!userId,
    });
};

/**
 * useCreateReel - Hook to create a new reel.
 */
export const useCreateReel = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (reel: {
            userId: string;
            caption: string;
            videoUrl: string;
            videoId: string;
            audio?: string;
            tags?: string[];
        }) => createReel(reel),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_REELS] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_REELS_PAGINATED] });
        },
    });
};

/**
 * useDeleteReel - Hook to delete a reel.
 */
export const useDeleteReel = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (reelId: string) => deleteReel(reelId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_REELS] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_REELS_PAGINATED] });
        },
    });
};
