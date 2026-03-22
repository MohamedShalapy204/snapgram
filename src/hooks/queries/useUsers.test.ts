import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '../../../tests/test-utils';
import { useGetUserById, useUpdateUserDB } from './useUsers';
import { getUserById, updateUser } from '../../services/appwrite/databases/snapgram/users/users';
import { uploadFile, deleteFile, getFilePreview } from '../../services/appwrite/storage/storage';
import { QUERY_KEYS } from '../../keys/queryKeys';
import type { Models } from 'appwrite';

vi.mock('../../services/appwrite/databases/snapgram/users/users', () => ({
    getUserById: vi.fn(),
    updateUser: vi.fn(),
}));

vi.mock('../../services/appwrite/storage/storage', () => ({
    uploadFile: vi.fn(),
    deleteFile: vi.fn(),
    getFilePreview: vi.fn(),
}));

describe('useUsers Hooks', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('useGetUserById', () => {
        it('should call getUserById when userId is provided', async () => {
            const userId = '123';
            const mockUser = { $id: '123', name: 'Test' };
            vi.mocked(getUserById).mockResolvedValueOnce(mockUser as unknown as Awaited<ReturnType<typeof getUserById>>);

            const { result } = renderHook(() => useGetUserById(userId));

            await waitFor(() => {
                expect(result.current.isSuccess).toBe(true);
            });

            expect(getUserById).toHaveBeenCalledWith(userId);
            expect(result.current.data).toEqual(mockUser);
        });

        it('should not call getUserById when userId is empty', () => {
            renderHook(() => useGetUserById(''));
            expect(getUserById).not.toHaveBeenCalled();
        });
    });

    describe('useUpdateUserDB', () => {
        const mockUserData = {
            userId: '123',
            name: 'New Name',
            bio: 'New Bio',
            imageId: 'oldFileId',
            imageUrl: 'http://old.url'
        };

        it('should successfully update user without new file', async () => {
            const mockUpdatedUser = { $id: '123', name: 'New Name' };
            vi.mocked(updateUser).mockResolvedValueOnce(mockUpdatedUser as unknown as Awaited<ReturnType<typeof updateUser>>);

            const { result, queryClient } = renderHook(() => useUpdateUserDB());
            const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

            await result.current.mutateAsync({ user: mockUserData, file: [] });

            expect(uploadFile).not.toHaveBeenCalled();
            expect(updateUser).toHaveBeenCalledWith({
                userId: '123',
                name: 'New Name',
                bio: 'New Bio',
                imageId: 'oldFileId',
                imageUrl: 'http://old.url'
            });
            expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: [QUERY_KEYS.GET_USER_BY_ID, mockUpdatedUser.$id] });
            expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: [QUERY_KEYS.GET_CURRENT_USER] });
        });

        it('should successfully update user with new file (upload, preview, delete old, update)', async () => {
            const mockFile = new File([''], 'new.jpg', { type: 'image/jpeg' });
            const mockUploadedFile = { $id: 'newFileId' };
            const mockNewPreview = 'http://new.url';
            const mockUpdatedUser = { $id: '123' };

            vi.mocked(uploadFile).mockResolvedValueOnce(mockUploadedFile as unknown as Models.File);
            vi.mocked(getFilePreview).mockReturnValueOnce(mockNewPreview);
            vi.mocked(updateUser).mockResolvedValueOnce(mockUpdatedUser as unknown as Awaited<ReturnType<typeof updateUser>>);

            const { result } = renderHook(() => useUpdateUserDB());

            await result.current.mutateAsync({ user: mockUserData, file: [mockFile] });

            expect(uploadFile).toHaveBeenCalledWith(mockFile);
            expect(getFilePreview).toHaveBeenCalledWith(mockUploadedFile.$id);
            expect(deleteFile).toHaveBeenCalledWith('oldFileId');
            expect(updateUser).toHaveBeenCalledWith(expect.objectContaining({
                imageId: 'newFileId',
                imageUrl: mockNewPreview
            }));
        });

        it('should cleanup and throw if upload fails', async () => {
            const mockFile = new File([''], 'new.jpg', { type: 'image/jpeg' });
            vi.mocked(uploadFile).mockResolvedValueOnce(null as unknown as Models.File);

            const { result } = renderHook(() => useUpdateUserDB());

            await expect(result.current.mutateAsync({ user: mockUserData, file: [mockFile] })).rejects.toThrow('File upload failed');
        });

        it('should delete new file and throw if preview fails', async () => {
            const mockFile = new File([''], 'new.jpg', { type: 'image/jpeg' });
            const mockUploadedFile = { $id: 'newFileId' };
            vi.mocked(uploadFile).mockResolvedValueOnce(mockUploadedFile as unknown as Models.File);
            vi.mocked(getFilePreview).mockReturnValueOnce('');

            const { result } = renderHook(() => useUpdateUserDB());

            await expect(result.current.mutateAsync({ user: mockUserData, file: [mockFile] })).rejects.toThrow('Failed to get image preview');
            expect(deleteFile).toHaveBeenCalledWith('newFileId');
        });
    });
});
