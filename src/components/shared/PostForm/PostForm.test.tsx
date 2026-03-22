import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PostForm from './PostForm';
import { BrowserRouter } from 'react-router-dom';

// Mocks
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

const mockCreatePost = vi.fn();
vi.mock('../../../hooks/queries/usePosts', () => ({
    useCreatePost: () => ({
        mutate: mockCreatePost,
        isPending: false,
    }),
}));

const mockUserAcc = { id: 'user123', name: 'Test User' };
let mockUseUserAccountData: { id: string, name: string } | null = mockUserAcc;
vi.mock('../../../hooks/queries/useAuth', () => ({
    useUserAccount: () => ({
        data: mockUseUserAccountData,
    }),
}));

const mockSuccessToast = vi.fn();
const mockErrorToast = vi.fn();
vi.mock('../../../hooks/useToast', () => ({
    useToast: () => ({
        success: mockSuccessToast,
        error: mockErrorToast,
    }),
}));

const renderWithRouter = (ui: React.ReactElement) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('PostForm Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockUseUserAccountData = mockUserAcc;
    });

    it('renders all form fields correctly', () => {
        renderWithRouter(<PostForm action="Create" />);

        expect(screen.getByText('Caption')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Write a catchy caption for your snap...')).toBeInTheDocument();
        expect(screen.getByText('Add Photo')).toBeInTheDocument();
        expect(screen.getByText('Add Location')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Snap city, California...')).toBeInTheDocument();
        expect(screen.getByText('Add Tags (comma separated)')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('SnapGram, Friends, SundayFunday...')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Create Post/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
    });

    it('shows validation errors when submitting an empty form', async () => {
        const user = userEvent.setup();
        renderWithRouter(<PostForm action="Create" />);

        const submitButton = screen.getByRole('button', { name: /Create Post/i });
        await user.click(submitButton);

        await waitFor(() => {
            // Zod validation errors
            expect(screen.getByText('*Caption must be at least 5 characters')).toBeInTheDocument();
        });

        expect(mockCreatePost).not.toHaveBeenCalled();
    });

    it('shows error toast if unauthenticated user tries to submit', async () => {
        mockUseUserAccountData = null; // simulate unauthenticated user
        const user = userEvent.setup();
        renderWithRouter(<PostForm action="Create" />);

        // Fill form to bypass Zod validation
        await user.type(screen.getByPlaceholderText('Write a catchy caption for your snap...'), 'Valid caption here');
        await user.type(screen.getByPlaceholderText('Snap city, California...'), 'Valid city');
        await user.type(screen.getByPlaceholderText('SnapGram, Friends, SundayFunday...'), 'Tag1');

        // Mock dropping file to bypass Zod file validation
        const file = new File(['hello'], 'hello.png', { type: 'image/png' });
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        await user.upload(fileInput, file);

        const submitButton = screen.getByRole('button', { name: /Create Post/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockErrorToast).toHaveBeenCalledWith('You must be logged in to create a post');
        });
        expect(mockCreatePost).not.toHaveBeenCalled();
    });

    it('submits successfully and calls createPost when logged in', async () => {
        const user = userEvent.setup();
        renderWithRouter(<PostForm action="Create" />);

        // Fill the form
        await user.type(screen.getByPlaceholderText('Write a catchy caption for your snap...'), 'Valid caption here');
        await user.type(screen.getByPlaceholderText('Snap city, California...'), 'Valid city');
        await user.type(screen.getByPlaceholderText('SnapGram, Friends, SundayFunday...'), 'Tag1, Tag2');

        const file = new File(['hello'], 'hello.png', { type: 'image/png' });
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        await user.upload(fileInput, file);

        const submitButton = screen.getByRole('button', { name: /Create Post/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockCreatePost).toHaveBeenCalled();
        });

        // Check payload
        const callArgs = mockCreatePost.mock.calls[0][0];
        expect(callArgs.post.caption).toBe('Valid caption here');
        expect(callArgs.post.location).toBe('Valid city');
        expect(callArgs.post.tags).toBe('Tag1, Tag2');
        expect(callArgs.post.file.length).toBeGreaterThan(0);
        expect(callArgs.userId).toBe('user123');

        // Simulate onSuccess behavior manually calling the second argument
        const mutateOptions = mockCreatePost.mock.calls[0][1];
        mutateOptions.onSuccess();

        expect(mockSuccessToast).toHaveBeenCalledWith('Post created successfully!');
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });
});
