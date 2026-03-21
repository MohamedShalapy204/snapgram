import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '../../../tests/test-utils';
import { useSignUp } from './useAuth';
import { createUserAccount, signInAccount } from '../../services/appwrite';

// Mock the internal appwrite logic so we only test the hook workflow
vi.mock('../../services/appwrite', () => ({
    createUserAccount: vi.fn(),
    signInAccount: vi.fn()
}));

describe('useSignUp Hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should successfully create account, sign in and update redux state', async () => {
        // Arrange
        const mockAccount = {
            $id: 'user_123',
            name: 'Test User',
            email: 'test@example.com'
        };

        vi.mocked(createUserAccount as unknown as () => Promise<unknown>).mockResolvedValueOnce(mockAccount);
        vi.mocked(signInAccount as unknown as () => Promise<unknown>).mockResolvedValueOnce({});

        const { result, store } = renderHook(() => useSignUp());

        // Act
        // We do not await directly here because we want to inspect intermediate states, 
        // but since we want to wait for React Query's onSuccess, we use mutateAsync
        const mutationPromise = result.current.mutateAsync({
            name: 'Test User',
            username: 'test_user',
            email: 'test@example.com',
            password: 'password123'
        });

        // Assert Redux state before resolution (still false)
        expect(store.getState().auth.isAuthenticated).toBe(false);

        await mutationPromise;

        // Assert Network calls
        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(createUserAccount).toHaveBeenCalledWith({
            name: 'Test User',
            username: 'test_user',
            email: 'test@example.com',
            password: 'password123'
        });

        expect(signInAccount).toHaveBeenCalledWith({
            email: 'test@example.com',
            password: 'password123'
        });

        // Verify Redux client state was updated correctly via onSuccess callback!
        const state = store.getState();
        expect(state.auth.isAuthenticated).toBe(true);
        expect(state.auth.user).toEqual({
            id: 'user_123',
            name: 'Test User',
            username: 'test_user',
            email: 'test@example.com',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user_123'
        });
    });

    it('should handle errors if account creation fails without updating Redux', async () => {
        // Arrange
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
        vi.mocked(createUserAccount).mockRejectedValueOnce(new Error('Network error'));

        const { result, store } = renderHook(() => useSignUp());

        // Act & Assert
        await expect(result.current.mutateAsync({
            name: 'Test User',
            username: 'test_user',
            email: 'test@example.com',
            password: 'password123'
        })).rejects.toThrow('Network error');

        expect(consoleSpy).toHaveBeenCalledWith("useSignUp :: error:", expect.any(Error));

        // Assert Redux untouched
        expect(store.getState().auth.isAuthenticated).toBe(false);
        expect(store.getState().auth.user).toBeNull();

        consoleSpy.mockRestore();
    });
});
