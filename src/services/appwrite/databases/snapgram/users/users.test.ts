import { describe, it, expect, vi, beforeEach } from 'vitest';
import { databases } from '../../../config';
import { saveUserToDB, getUserById, updateUser, getUsers, searchUsers } from './users';
import { Query, type Models } from 'appwrite';

vi.mock('../../../config', () => ({
    databases: {
        createDocument: vi.fn(),
        getDocument: vi.fn(),
        updateDocument: vi.fn(),
        listDocuments: vi.fn(),
    },
    appwriteConfig: {
        endpoint: 'test-endpoint',
        projectId: 'test-project',
        databaseId: 'test-db',
        storageId: 'test-storage',
        usersCollectionId: 'test-users',
        postsCollectionId: 'test-posts',
        savesCollectionId: 'test-saves',
    },
}));

describe('UserService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('saveUserToDB', () => {
        it('should call createDocument with correct parameters', async () => {
            const mockUser = {
                userId: '123',
                email: 'test@test.com',
                name: 'Test User',
                username: 'testuser',
                imageUrl: 'http://test.com/image.jpg',
                imageId: 'img123',
            };

            vi.mocked(databases.createDocument).mockResolvedValueOnce({ $id: '123' } as unknown as Models.Document);

            await saveUserToDB(mockUser);

            expect(databases.createDocument).toHaveBeenCalledWith(
                'test-db',
                'test-users',
                '123',
                {
                    email: mockUser.email,
                    name: mockUser.name,
                    username: mockUser.username,
                    imageUrl: mockUser.imageUrl,
                    imageId: mockUser.imageId,
                }
            );
        });
    });

    describe('getUserById', () => {
        it('should call getDocument with correct ID', async () => {
            const mockUser = { $id: '123', name: 'Test' };
            vi.mocked(databases.getDocument).mockResolvedValueOnce(mockUser as unknown as Models.Document);

            const result = await getUserById('123');

            expect(databases.getDocument).toHaveBeenCalledWith('test-db', 'test-users', '123');
            expect(result).toEqual(mockUser);
        });
    });

    describe('updateUser', () => {
        it('should call updateDocument with provided fields', async () => {
            const updateData = { userId: '123', bio: 'New Bio' };
            vi.mocked(databases.updateDocument).mockResolvedValueOnce({ $id: '123', ...updateData } as unknown as Models.Document);

            await updateUser(updateData);

            expect(databases.updateDocument).toHaveBeenCalledWith(
                'test-db',
                'test-users',
                '123',
                { bio: 'New Bio' }
            );
        });
    });

    describe('getUsers', () => {
        it('should call listDocuments with limit query if provided', async () => {
            vi.mocked(databases.listDocuments).mockResolvedValueOnce({ documents: [], total: 0 } as unknown as Models.DocumentList<Models.Document>);

            await getUsers(10);

            expect(databases.listDocuments).toHaveBeenCalledWith(
                'test-db',
                'test-users',
                [Query.limit(10)]
            );
        });
    });

    describe('searchUsers', () => {
        it('should call listDocuments with OR query for name and username', async () => {
            vi.mocked(databases.listDocuments).mockResolvedValueOnce({ documents: [], total: 0 } as unknown as Models.DocumentList<Models.Document>);

            await searchUsers('test');

            expect(databases.listDocuments).toHaveBeenCalledWith(
                'test-db',
                'test-users',
                [Query.or([Query.search("name", "test"), Query.search("username", "test")])]
            );
        });
    });
});
