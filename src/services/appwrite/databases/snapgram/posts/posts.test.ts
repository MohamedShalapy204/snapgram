import { describe, it, expect, vi, beforeEach } from 'vitest';
import { databases } from '../../../config';
import { uploadFile, deleteFile, getFilePreview } from '../../../storage/storage';
import { createPost, getRecentPosts } from './posts';
import { Query, type Models } from 'appwrite';

vi.mock('../../../config', () => ({
    databases: {
        createDocument: vi.fn(),
        listDocuments: vi.fn(),
    },
    appwriteConfig: {
        databaseId: 'test-db',
        postsCollectionId: 'test-posts',
    },
}));

vi.mock('../../../storage/storage', () => ({
    uploadFile: vi.fn(),
    deleteFile: vi.fn(),
    getFilePreview: vi.fn(),
}));

describe('PostService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('createPost', () => {
        const mockNewPost = {
            caption: 'Test Caption',
            file: [new File([''], 'test.jpg', { type: 'image/jpeg' })],
            location: 'Test Location',
            tags: 'tag1, tag2',
        };
        const userId = 'user123';

        it('should successfully create a post', async () => {
            const mockFile = { $id: 'file123' };
            const mockFileUrl = 'http://test.com/preview.jpg';
            const mockCreatedPost = { $id: 'post123', caption: 'Test Caption' };

            vi.mocked(uploadFile).mockResolvedValueOnce(mockFile as unknown as Models.File);
            vi.mocked(getFilePreview).mockReturnValueOnce(mockFileUrl);
            vi.mocked(databases.createDocument).mockResolvedValueOnce(mockCreatedPost as unknown as Models.Document);

            const result = await createPost(mockNewPost, userId);

            expect(uploadFile).toHaveBeenCalledWith(mockNewPost.file[0]);
            expect(getFilePreview).toHaveBeenCalledWith(mockFile.$id);
            expect(databases.createDocument).toHaveBeenCalledWith(
                'test-db',
                'test-posts',
                expect.any(String),
                expect.objectContaining({
                    creator: userId,
                    caption: mockNewPost.caption,
                    imageUrl: mockFileUrl,
                    tags: ['tag1', 'tag2'],
                    imageId: mockFile.$id,
                })
            );
            expect(result).toEqual(mockCreatedPost);
        });

        it('should throw error if file upload fails', async () => {
            vi.mocked(uploadFile).mockResolvedValueOnce(null as unknown as Models.File);

            await expect(createPost(mockNewPost, userId)).rejects.toThrow('File upload failed');
            expect(databases.createDocument).not.toHaveBeenCalled();
        });

        it('should delete file and throw error if getFilePreview fails', async () => {
            const mockFile = { $id: 'file123' };
            vi.mocked(uploadFile).mockResolvedValueOnce(mockFile as unknown as Models.File);
            vi.mocked(getFilePreview).mockReturnValueOnce('');

            await expect(createPost(mockNewPost, userId)).rejects.toThrow('Could not retrieve file URL');
            expect(deleteFile).toHaveBeenCalledWith(mockFile.$id);
            expect(databases.createDocument).not.toHaveBeenCalled();
        });

        it('should delete file and throw error if document creation fails', async () => {
            const mockFile = { $id: 'file123' };
            vi.mocked(uploadFile).mockResolvedValueOnce(mockFile as unknown as Models.File);
            vi.mocked(getFilePreview).mockReturnValueOnce('http://file.url');
            vi.mocked(databases.createDocument).mockResolvedValueOnce(null as unknown as Models.Document);

            await expect(createPost(mockNewPost, userId)).rejects.toThrow('Failed to create post document');
            expect(deleteFile).toHaveBeenCalledWith(mockFile.$id);
        });
    });

    describe('getRecentPosts', () => {
        it('should fetch posts with correct queries', async () => {
            const mockPosts = { documents: [], total: 0 };
            vi.mocked(databases.listDocuments).mockResolvedValueOnce(mockPosts as unknown as Models.DocumentList<Models.Document>);

            const result = await getRecentPosts();

            expect(databases.listDocuments).toHaveBeenCalledWith(
                'test-db',
                'test-posts',
                [
                    Query.orderDesc("$createdAt"),
                    Query.limit(20)
                ]
            );
            expect(result).toEqual(mockPosts);
        });

        it('should throw error if listDocuments fails', async () => {
            vi.mocked(databases.listDocuments).mockResolvedValueOnce(null as unknown as Models.DocumentList<Models.Document>);

            await expect(getRecentPosts()).rejects.toThrow('Failed to fetch posts');
        });
    });
});
