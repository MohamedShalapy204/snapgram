import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Models } from 'appwrite';
import {
    createUserAccount,
    signInAccount,
    getCurrentAccount,
    signOutAccount,
    sendVerificationEmail,
    updateVerificationStatus,
    updateAccountName,
} from './auth';
import { account } from '../config';
import type { SignupSchema, SigninSchema } from '../../../utils/validation';

// Mock the Appwrite account service properties we use
vi.mock('../config', () => ({
    account: {
        create: vi.fn(),
        createEmailPasswordSession: vi.fn(),
        get: vi.fn(),
        deleteSession: vi.fn(),
        createVerification: vi.fn(),
        updateVerification: vi.fn(),
        updateName: vi.fn(),
    },
}));

describe('AuthService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('createUserAccount', () => {
        const mockUser: SignupSchema = {
            name: 'John Doe',
            username: 'johndoe',
            email: 'john@example.com',
            password: 'password123',
        };

        it('should successfully create user and return new account object', async () => {
            // Arrange
            const mockResponse = {
                $id: 'user_123',
                email: 'john@example.com',
                name: 'John Doe',
            };
            vi.mocked(account.create).mockResolvedValueOnce(mockResponse as unknown as Models.User<Models.Preferences>);

            // Act
            const result = await createUserAccount(mockUser);

            // Assert
            expect(account.create).toHaveBeenCalledWith(
                expect.any(String), // ID.unique() generates a string
                mockUser.email,
                mockUser.password,
                mockUser.name,
            );
            expect(result).toEqual(mockResponse);
        });

        it('should throw an error if account creation fails', async () => {
            // Arrange
            vi.mocked(account.create).mockRejectedValueOnce(
                new Error('Network Error'),
            );

            // Act & Assert
            await expect(createUserAccount(mockUser)).rejects.toThrow(
                'Network Error',
            );
        });
    });

    describe('signInAccount', () => {
        const mockCredentials: SigninSchema = {
            email: 'john@example.com',
            password: 'password123',
        };

        it('should create a new email password session', async () => {
            // Arrange
            const mockSession = { $id: 'session_123', userId: 'user_123' };
            vi.mocked(account.createEmailPasswordSession).mockResolvedValueOnce(
                mockSession as unknown as Models.Session,
            );

            // Act
            const result = await signInAccount(mockCredentials);

            // Assert
            expect(account.createEmailPasswordSession).toHaveBeenCalledWith(
                mockCredentials.email,
                mockCredentials.password,
            );
            expect(result).toEqual(mockSession);
        });

        it('should throw an error on invalid credentials', async () => {
            // Arrange
            vi.mocked(account.createEmailPasswordSession).mockRejectedValueOnce(
                new Error('Invalid credentials'),
            );

            // Act & Assert
            await expect(signInAccount(mockCredentials)).rejects.toThrow(
                'Invalid credentials',
            );
        });
    });

    describe('getCurrentAccount', () => {
        it('should return the account object if authenticated', async () => {
            // Arrange
            const mockAccount = { $id: 'user_123', name: 'John Doe' };
            vi.mocked(account.get).mockResolvedValueOnce(mockAccount as unknown as Models.User<Models.Preferences>);

            // Act
            const result = await getCurrentAccount();

            // Assert
            expect(account.get).toHaveBeenCalled();
            expect(result).toEqual(mockAccount);
        });

        it('should return null if there is no active session and NOT log an error', async () => {
            // Arrange
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
            vi.mocked(account.get).mockRejectedValueOnce(new Error('Missing scope'));

            // Act
            const result = await getCurrentAccount();

            // Assert
            expect(result).toBeNull();
            expect(consoleSpy).not.toHaveBeenCalled();
            consoleSpy.mockRestore();
        });
    });

    describe('signOutAccount', () => {
        it('should delete the current session', async () => {
            // Arrange
            vi.mocked(account.deleteSession).mockResolvedValueOnce({} as unknown as Record<string, never>);

            // Act
            await signOutAccount();

            // Assert
            expect(account.deleteSession).toHaveBeenCalledWith('current');
        });
    });

    describe('sendVerificationEmail', () => {
        it('should call createVerification with the provided URL', async () => {
            // Arrange
            const mockUrl = 'https://example.com/verify';
            const mockResponse = { $id: 'token_123' };
            vi.mocked(account.createVerification).mockResolvedValueOnce(mockResponse as unknown as Models.Token);

            // Act
            const result = await sendVerificationEmail(mockUrl);

            // Assert
            expect(account.createVerification).toHaveBeenCalledWith(mockUrl);
            expect(result).toEqual(mockResponse);
        });

        it('should throw error if createVerification fails', async () => {
            vi.mocked(account.createVerification).mockRejectedValueOnce(new Error('Verification error'));
            await expect(sendVerificationEmail('url')).rejects.toThrow('Verification error');
        });
    });

    describe('updateVerificationStatus', () => {
        it('should call updateVerification with userId and secret', async () => {
            // Arrange
            const mockToken = { $id: 'token_123' };
            vi.mocked(account.updateVerification).mockResolvedValueOnce(mockToken as unknown as Models.Token);

            // Act
            const result = await updateVerificationStatus('user123', 'secret123');

            // Assert
            expect(account.updateVerification).toHaveBeenCalledWith('user123', 'secret123');
            expect(result).toEqual(mockToken);
        });

        it('should throw error if updateVerification fails', async () => {
            vi.mocked(account.updateVerification).mockRejectedValueOnce(new Error('Update failed'));
            await expect(updateVerificationStatus('u', 's')).rejects.toThrow('Update failed');
        });
    });

    describe('updateAccountName', () => {
        it('should call updateName with the new name', async () => {
            // Arrange
            const mockUser = { $id: '123', name: 'New Name' };
            vi.mocked(account.updateName).mockResolvedValueOnce(mockUser as unknown as Models.User<Models.Preferences>);

            // Act
            const result = await updateAccountName('New Name');

            // Assert
            expect(account.updateName).toHaveBeenCalledWith('New Name');
            expect(result).toEqual(mockUser);
        });

        it('should throw error if updateName fails', async () => {
            vi.mocked(account.updateName).mockRejectedValueOnce(new Error('Update name failed'));
            await expect(updateAccountName('Name')).rejects.toThrow('Update name failed');
        });
    });
});
