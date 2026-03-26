/**
 * Centralized React Query keys for the entire application.
 * Prevents typos and makes managing the cache easier.
 */
export const QUERY_KEYS = {
    // Auth Keys
    GET_CURRENT_USER: 'userAccount',

    // Post Keys
    GET_POSTS: 'posts',
    GET_POST_BY_ID: 'post',
    GET_RECENT_POSTS: 'recentPosts',
    GET_RECENT_POSTS_PAGINATED: 'recentPostsPaginated',

    // User Keys
    GET_USERS: 'users',
    GET_USER_BY_ID: 'userById',
    GET_USER_POSTS: 'userPosts',

    // Search Keys
    SEARCH_POSTS: 'searchPosts',

    // Comment Keys
    GET_COMMENTS: 'comments',
    GET_COMMENTS_PAGINATED: 'commentsPaginated',

    // Reel Keys
    GET_REELS: 'reels',
    GET_REELS_PAGINATED: 'reelsPaginated',
    GET_USER_REELS: 'userReels',
    GET_USER_REELS_PAGINATED: 'userReelsPaginated',
} as const;
