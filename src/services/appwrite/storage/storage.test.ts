import { describe, it, expect, vi, beforeEach } from 'vitest';
import { storage } from '../config';
import { uploadFile, getFilePreview, deleteFile } from './storage';
import { ImageGravity, type Models } from 'appwrite';

vi.mock('../config', () => ({
    storage: {
        createFile: vi.fn(),
        getFilePreview: vi.fn(),
        deleteFile: vi.fn(),
    },
    appwriteConfig: {
        storageId: 'test-storage',
    },
}));

describe('StorageService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('uploadFile', () => {
        it('should call createFile with correct parameters', async () => {
            const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
            const mockCreatedFile = { $id: 'file123' };
            vi.mocked(storage.createFile).mockResolvedValueOnce(mockCreatedFile as unknown as Models.File);

            const result = await uploadFile(mockFile);

            expect(storage.createFile).toHaveBeenCalledWith(
                'test-storage',
                expect.any(String),
                mockFile,
                expect.any(Array)
            );
            expect(result).toEqual(mockCreatedFile);
        });

        it('should throw error if createFile fails', async () => {
            const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
            vi.mocked(storage.createFile).mockRejectedValueOnce(new Error('Upload failed'));

            await expect(uploadFile(mockFile)).rejects.toThrow('Upload failed');
        });
    });

    describe('getFilePreview', () => {
        it('should call getFilePreview with correct parameters', () => {
            const fileId = 'file123';
            const mockUrl = 'http://test.com/preview.jpg';
            vi.mocked(storage.getFilePreview).mockReturnValueOnce(mockUrl);

            const result = getFilePreview(fileId);

            expect(storage.getFilePreview).toHaveBeenCalledWith(
                'test-storage',
                fileId,
                2000,
                2000,
                ImageGravity.Top,
                100
            );
            expect(result).toEqual(mockUrl);
        });

        it('should return empty string if getFilePreview fails', () => {
            vi.mocked(storage.getFilePreview).mockImplementationOnce(() => {
                throw new Error('Preview failed');
            });

            const result = getFilePreview('file123');

            expect(result).toBe('');
        });
    });

    describe('deleteFile', () => {
        it('should call deleteFile with correct parameters', async () => {
            const fileId = 'file123';
            // @ts-expect-error - mockResolvedValueOnce expects {} but deleteFile returns void
            vi.mocked(storage.deleteFile).mockResolvedValueOnce(undefined as unknown as void);

            await deleteFile(fileId);

            expect(storage.deleteFile).toHaveBeenCalledWith('test-storage', fileId);
        });

        it('should not throw error if deleteFile fails (silent catch)', async () => {
            vi.mocked(storage.deleteFile).mockRejectedValueOnce(new Error('Delete failed'));

            await expect(deleteFile('file123')).resolves.not.toThrow();
        });
    });
});
