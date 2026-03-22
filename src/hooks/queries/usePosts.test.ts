import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '../../../tests/test-utils';
import { useCreatePost, useGetRecentPosts } from './usePosts';
import { createPost, getRecentPosts } from '../../services/appwrite';
import { QUERY_KEYS } from '../../keys/queryKeys';
import type { NewPost } from '../../types';

vi.mock('../../services/appwrite', () => ({
    createPost: vi.fn(),
    getRecentPosts: vi.fn(),
}));

describe('usePosts Hooks', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('useCreatePost', () => {
        it('should call createPost and invalidate queries on success', async () => {
            const mockPost = { caption: 'Test', file: [], location: '', tags: '' };
            const userId = '123';
            const mockCreatedPost = { $id: 'post123' };
            vi.mocked(createPost).mockResolvedValueOnce(mockCreatedPost as unknown as Awaited<ReturnType<typeof createPost>>);

            const { result, queryClient } = renderHook(() => useCreatePost());
            const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

            await result.current.mutateAsync({ post: mockPost, userId });

            expect(createPost).toHaveBeenCalledWith(mockPost, userId);
            expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: [QUERY_KEYS.GET_POSTS] });
            expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: [QUERY_KEYS.GET_RECENT_POSTS] });
        });

        it('should log error on failure', async () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
            vi.mocked(createPost).mockRejectedValueOnce(new Error('Post failed'));

            const { result } = renderHook(() => useCreatePost());

            await expect(result.current.mutateAsync({ post: {} as unknown as NewPost, userId: '123' })).rejects.toThrow('Post failed');
            expect(consoleSpy).toHaveBeenCalledWith("useCreatePost :: error:", expect.any(Error));

            consoleSpy.mockRestore();
        });
    });

    describe('useGetRecentPosts', () => {
        it('should fetch recent posts', async () => {
            const mockPosts = { documents: [], total: 0 };
            vi.mocked(getRecentPosts).mockResolvedValueOnce(mockPosts as unknown as Awaited<ReturnType<typeof getRecentPosts>>);

            const { result } = renderHook(() => useGetRecentPosts());

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(getRecentPosts).toHaveBeenCalled();
            expect(result.current.data).toEqual(mockPosts);
        });
    });
});
