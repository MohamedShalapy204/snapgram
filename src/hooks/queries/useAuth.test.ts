import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '../../../tests/test-utils';
import { useSignUp, useSignIn, useUserAccount, useSignOut, useVerifyEmail, useSendVerificationEmail, useUpdateUser } from './useAuth';
import type { Models } from 'appwrite';
import { createUserAccount, signInAccount, getCurrentAccount, signOutAccount, updateVerificationStatus, sendVerificationEmail, updateAccountName, getUserByUsername } from '../../services/appwrite';
import { QUERY_KEYS } from '../../keys/queryKeys';

// Mock the internal appwrite logic so we only test the hook workflow
vi.mock('../../services/appwrite', () => ({
    createUserAccount: vi.fn(),
    signInAccount: vi.fn(),
    getCurrentAccount: vi.fn(),
    signOutAccount: vi.fn(),
    updateVerificationStatus: vi.fn(),
    sendVerificationEmail: vi.fn(),
    updateAccountName: vi.fn(),
    saveUserToDB: vi.fn(),
    getUserByUsername: vi.fn()
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

        vi.mocked(getUserByUsername as unknown as () => Promise<unknown>).mockResolvedValueOnce(null);
        vi.mocked(createUserAccount as unknown as () => Promise<unknown>).mockResolvedValueOnce(mockAccount);
        vi.mocked(signInAccount as unknown as () => Promise<unknown>).mockResolvedValueOnce({});

        const { result, queryClient } = renderHook(() => useSignUp());

        // Act
        // We do not await directly here because we want to inspect intermediate states, 
        // but since we want to wait for React Query's onSuccess, we use mutateAsync
        const mutationPromise = result.current.mutateAsync({
            name: 'Test User',
            username: 'test_user',
            email: 'test@example.com',
            password: 'password123'
        });

        // Assert cache empty before resolution
        expect(queryClient.getQueryData([QUERY_KEYS.GET_CURRENT_USER])).toBeUndefined();

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

        // Verify cache was updated correctly via onSuccess callback!
        const user = queryClient.getQueryData([QUERY_KEYS.GET_CURRENT_USER]);
        expect(user).toEqual({
            id: 'user_123',
            name: 'Test User',
            username: 'test_user',
            email: 'test@example.com',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user_123',
            verified: false
        });
    });

    it('should handle errors if account creation fails without updating Redux', async () => {
        // Arrange
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
        vi.mocked(getUserByUsername as unknown as () => Promise<unknown>).mockResolvedValueOnce(null);
        vi.mocked(createUserAccount).mockRejectedValueOnce(new Error('Network error'));

        const { result, queryClient } = renderHook(() => useSignUp());

        // Act & Assert
        await expect(result.current.mutateAsync({
            name: 'Test User',
            username: 'test_user',
            email: 'test@example.com',
            password: 'password123'
        })).rejects.toThrow('Network error');

        expect(consoleSpy).toHaveBeenCalledWith("useSignUp :: error:", expect.any(Error));

        // Assert cache untouched
        expect(queryClient.getQueryData([QUERY_KEYS.GET_CURRENT_USER])).toBeUndefined();

        consoleSpy.mockRestore();
    });

    it('should throw an error and abort if username is already taken', async () => {
        // Arrange
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
        vi.mocked(getUserByUsername as unknown as () => Promise<unknown>).mockResolvedValueOnce({ $id: 'existing_user' });

        const { result, queryClient } = renderHook(() => useSignUp());

        // Act & Assert
        await expect(result.current.mutateAsync({
            name: 'Test',
            username: 'taken_username',
            email: 'test@example.com',
            password: 'password123'
        })).rejects.toThrow('Username already taken. Please choose another one.');

        expect(getUserByUsername).toHaveBeenCalledWith('taken_username');
        expect(createUserAccount).not.toHaveBeenCalled();

        expect(consoleSpy).toHaveBeenCalledWith("useSignUp :: error:", expect.any(Error));

        // Assert cache untouched
        expect(queryClient.getQueryData([QUERY_KEYS.GET_CURRENT_USER])).toBeUndefined();

        consoleSpy.mockRestore();
    });
});

describe('useSignIn Hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should successfully sign in, fetch current account, and update redux state', async () => {
        // Arrange
        const mockCurrentAccount = {
            $id: 'user_456',
            name: 'Jane Doe',
            email: 'jane@example.com',
            emailVerification: true
        };

        vi.mocked(signInAccount as unknown as () => Promise<unknown>).mockResolvedValueOnce({});
        vi.mocked(getCurrentAccount as unknown as () => Promise<unknown>).mockResolvedValueOnce(mockCurrentAccount);

        const { result, queryClient } = renderHook(() => useSignIn());

        // Act
        const mutationPromise = result.current.mutateAsync({
            email: 'jane@example.com',
            password: 'password123'
        });

        // Assert cache empty before resolution
        expect(queryClient.getQueryData([QUERY_KEYS.GET_CURRENT_USER])).toBeUndefined();

        await mutationPromise;

        // Assert Network calls
        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(signInAccount).toHaveBeenCalledWith({
            email: 'jane@example.com',
            password: 'password123'
        });
        expect(getCurrentAccount).toHaveBeenCalled();

        // Verify cache updated via onSuccess callback
        const user = queryClient.getQueryData([QUERY_KEYS.GET_CURRENT_USER]);
        expect(user).toEqual({
            id: 'user_456',
            name: 'Jane Doe',
            username: 'janedoe',
            email: 'jane@example.com',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user_456',
            verified: true
        });
    });

    it('should throw an error if account retrieval fails post-login', async () => {
        // Arrange
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
        vi.mocked(signInAccount as unknown as () => Promise<unknown>).mockResolvedValueOnce({});
        vi.mocked(getCurrentAccount as unknown as () => Promise<unknown>).mockResolvedValueOnce(null);

        const { result, queryClient } = renderHook(() => useSignIn());

        // Act & Assert
        await expect(result.current.mutateAsync({
            email: 'fail@example.com',
            password: 'password123'
        })).rejects.toThrow("Could not retrieve account details");

        expect(consoleSpy).toHaveBeenCalledWith("useSignIn :: error:", expect.any(Error));

        // Assert cache untouched
        expect(queryClient.getQueryData([QUERY_KEYS.GET_CURRENT_USER])).toBeUndefined();

        consoleSpy.mockRestore();
    });
});

describe('useUserAccount Hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should successfully fetch current user and return formatted data', async () => {
        // Arrange
        const mockAccount = {
            $id: 'user_123',
            name: 'Test User',
            email: 'test@example.com',
            emailVerification: true
        };
        vi.mocked(getCurrentAccount as unknown as () => Promise<unknown>).mockResolvedValueOnce(mockAccount);

        const { result } = renderHook(() => useUserAccount());

        // Assert
        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(result.current.data).toEqual({
            id: 'user_123',
            name: 'Test User',
            username: 'testuser',
            email: 'test@example.com',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user_123',
            verified: true
        });
    });

    it('should return null if no session exists', async () => {
        // Arrange
        vi.mocked(getCurrentAccount as unknown as () => Promise<unknown>).mockResolvedValueOnce(null);

        const { result } = renderHook(() => useUserAccount());

        // Assert
        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(result.current.data).toBeNull();
    });

    it('should return null and not throw if getCurrentAccount fails', async () => {
        // Arrange
        vi.mocked(getCurrentAccount).mockRejectedValueOnce(new Error('Missing scope'));

        const { result } = renderHook(() => useUserAccount());

        // Assert
        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });

        expect(result.current.data).toBeNull();
    });
});

describe('useSignOut Hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should successfully sign out and clear query cache', async () => {
        // Arrange
        vi.mocked(signOutAccount).mockResolvedValueOnce(undefined);

        const { result, queryClient } = renderHook(() => useSignOut());

        // Pre-fill the cache
        queryClient.setQueryData([QUERY_KEYS.GET_CURRENT_USER], { id: '123', name: 'Test', verified: true });
        expect(queryClient.getQueryData([QUERY_KEYS.GET_CURRENT_USER])).toBeDefined();

        // Act
        await result.current.mutateAsync();

        // Assert
        expect(signOutAccount).toHaveBeenCalled();
        expect(queryClient.getQueryData([QUERY_KEYS.GET_CURRENT_USER])).toBeNull();
    });

    it('should log error if sign out fails', async () => {
        // Arrange
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
        vi.mocked(signOutAccount).mockRejectedValueOnce(new Error('Network error'));

        const { result } = renderHook(() => useSignOut());

        // Act & Assert
        await expect(result.current.mutateAsync()).rejects.toThrow('Network error');
        expect(consoleSpy).toHaveBeenCalledWith("useSignOut :: error:", expect.any(Error));

        consoleSpy.mockRestore();
    });
});

describe('useVerifyEmail Hook', () => {
    it('should successfully update verification and invalidate user query', async () => {
        // Arrange
        vi.mocked(updateVerificationStatus).mockResolvedValueOnce({} as Models.Token);
        const { result, queryClient } = renderHook(() => useVerifyEmail());
        const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

        // Act
        await result.current.mutateAsync({ userId: '123', secret: 'secret' });

        // Assert
        expect(updateVerificationStatus).toHaveBeenCalledWith('123', 'secret');
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: [QUERY_KEYS.GET_CURRENT_USER] });
    });
});

describe('useSendVerificationEmail Hook', () => {
    it('should successfully call send service', async () => {
        // Arrange
        vi.mocked(sendVerificationEmail).mockResolvedValueOnce({} as Models.Token);
        const { result } = renderHook(() => useSendVerificationEmail());

        // Act
        await result.current.mutateAsync('http://localhost/verify');

        // Assert
        expect(sendVerificationEmail).toHaveBeenCalledWith('http://localhost/verify');
    });
});

describe('useUpdateUser Hook', () => {
    it('should successfully update user name and invalidate cache', async () => {
        // Arrange
        const mockUser = { $id: '123', name: 'New Name' };
        vi.mocked(updateAccountName).mockResolvedValueOnce(mockUser as unknown as Awaited<ReturnType<typeof updateAccountName>>);
        const { result, queryClient } = renderHook(() => useUpdateUser());
        const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

        // Act
        await result.current.mutateAsync('New Name');

        // Assert
        expect(updateAccountName).toHaveBeenCalledWith('New Name');
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: [QUERY_KEYS.GET_CURRENT_USER] });
    });

    it('should log error if update fails', async () => {
        // Arrange
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
        vi.mocked(updateAccountName).mockRejectedValueOnce(new Error('Update failed'));
        const { result } = renderHook(() => useUpdateUser());

        // Act & Assert
        await expect(result.current.mutateAsync('Name')).rejects.toThrow('Update failed');
        expect(consoleSpy).toHaveBeenCalledWith("useUpdateUser :: error:", expect.any(Error));

        consoleSpy.mockRestore();
    });
});
