import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../../../../../tests/test-utils';
import VerifyEmail from './VerifyEmail';
import { useVerifyEmail } from '../../../../hooks/queries/useAuth';

// Mock the hook
vi.mock('../../../../hooks/queries/useAuth', () => ({
    useVerifyEmail: vi.fn(),
    useUser: vi.fn(() => ({ data: null }))
}));

vi.mock('../../../../hooks/useToast', () => ({
    useToast: vi.fn(() => ({
        success: vi.fn(),
        error: vi.fn(),
        info: vi.fn(),
        warning: vi.fn(),
    }))
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useSearchParams: () => [new URLSearchParams('userId=123&secret=secret')],
    };
});

describe('VerifyEmail Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should call verify on mount with params', async () => {
        const mockMutate = vi.fn();
        vi.mocked(useVerifyEmail).mockReturnValue({
            mutate: mockMutate,
            isPending: true,
            isSuccess: false,
            isError: false,
        } as unknown as ReturnType<typeof useVerifyEmail>);

        render(<VerifyEmail />);

        expect(mockMutate).toHaveBeenCalledWith(
            expect.objectContaining({ userId: '123', secret: 'secret' }),
            expect.any(Object)
        );
        expect(screen.getByText(/Verifying your account/i)).toBeInTheDocument();
    });

    it('should show success state when verification is successful', async () => {
        vi.mocked(useVerifyEmail).mockReturnValue({
            mutate: vi.fn(),
            isPending: false,
            isSuccess: true,
            isError: false,
        } as unknown as ReturnType<typeof useVerifyEmail>);

        render(<VerifyEmail />);

        expect(screen.getByText(/Verification Successful/i)).toBeInTheDocument();
        const homeBtn = screen.getByRole('button', { name: /Go to Home/i });
        homeBtn.click();
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('should show error state when verification fails', async () => {
        vi.mocked(useVerifyEmail).mockReturnValue({
            mutate: vi.fn(),
            isPending: false,
            isSuccess: false,
            isError: true,
        } as unknown as ReturnType<typeof useVerifyEmail>);

        render(<VerifyEmail />);

        expect(screen.getByText(/Verification Failed/i)).toBeInTheDocument();
    });
});
