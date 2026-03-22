import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '../../../../../tests/test-utils';
import VerificationPending from './VerificationPending';
import { useUserAccount, useSendVerificationEmail } from '../../../../hooks/queries/useAuth';

vi.mock('../../../../hooks/queries/useAuth', () => ({
    useUserAccount: vi.fn(),
    useSendVerificationEmail: vi.fn(),
}));

vi.mock('../../../../hooks/useToast', () => ({
    useToast: vi.fn(() => ({
        success: vi.fn(),
        error: vi.fn(),
        info: vi.fn(),
        warning: vi.fn(),
    }))
}));

describe('VerificationPending Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render user email and instructions', () => {
        vi.mocked(useUserAccount).mockReturnValue({
            data: { email: 'test@example.com' }
        } as unknown as ReturnType<typeof useUserAccount>);

        vi.mocked(useSendVerificationEmail).mockReturnValue({
            mutate: vi.fn(),
            isPending: false,
            isSuccess: false,
        } as unknown as ReturnType<typeof useSendVerificationEmail>);

        render(<VerificationPending />);

        expect(screen.getByText('test@example.com')).toBeInTheDocument();
        expect(screen.getByText(/Verify Your Email/i)).toBeInTheDocument();
    });

    it('should call resend on button click', () => {
        const mockResend = vi.fn();
        vi.mocked(useUserAccount).mockReturnValue({
            data: { email: 'test@example.com' }
        } as unknown as ReturnType<typeof useUserAccount>);

        vi.mocked(useSendVerificationEmail).mockReturnValue({
            mutate: mockResend,
            isPending: false,
            isSuccess: false,
        } as unknown as ReturnType<typeof useSendVerificationEmail>);

        render(<VerificationPending />);

        const resendBtn = screen.getByRole('button', { name: /Resend Link/i });
        fireEvent.click(resendBtn);

        expect(mockResend).toHaveBeenCalledWith(
            expect.any(String),
            expect.any(Object)
        );
    });

    it('should show success message after successful resend', () => {
        vi.mocked(useUserAccount).mockReturnValue({
            data: { email: 'test@example.com' }
        } as unknown as ReturnType<typeof useUserAccount>);

        vi.mocked(useSendVerificationEmail).mockReturnValue({
            mutate: vi.fn(),
            isPending: false,
            isSuccess: true,
        } as unknown as ReturnType<typeof useSendVerificationEmail>);

        render(<VerificationPending />);

        expect(screen.getByText(/Email Sent Again!/i)).toBeInTheDocument();
    });
});
