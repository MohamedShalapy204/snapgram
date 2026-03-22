import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '../../../../../tests/test-utils';
import VerificationPending from './VerificationPending';
import { useUser, useSendVerificationEmail } from '../../../../hooks/queries/useAuth';

vi.mock('../../../../hooks/queries/useAuth', () => ({
    useUser: vi.fn(),
    useSendVerificationEmail: vi.fn(),
}));

describe('VerificationPending Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render user email and instructions', () => {
        vi.mocked(useUser).mockReturnValue({
            data: { email: 'test@example.com' }
        } as any);

        vi.mocked(useSendVerificationEmail).mockReturnValue({
            mutate: vi.fn(),
            isPending: false,
            isSuccess: false,
        } as any);

        render(<VerificationPending />);

        expect(screen.getByText('test@example.com')).toBeInTheDocument();
        expect(screen.getByText(/Verify Your Email/i)).toBeInTheDocument();
    });

    it('should call resend on button click', () => {
        const mockResend = vi.fn();
        vi.mocked(useUser).mockReturnValue({
            data: { email: 'test@example.com' }
        } as any);

        vi.mocked(useSendVerificationEmail).mockReturnValue({
            mutate: mockResend,
            isPending: false,
            isSuccess: false,
        } as any);

        render(<VerificationPending />);

        const resendBtn = screen.getByRole('button', { name: /Resend Link/i });
        fireEvent.click(resendBtn);

        expect(mockResend).toHaveBeenCalled();
    });

    it('should show success message after successful resend', () => {
        vi.mocked(useUser).mockReturnValue({
            data: { email: 'test@example.com' }
        } as any);

        vi.mocked(useSendVerificationEmail).mockReturnValue({
            mutate: vi.fn(),
            isPending: false,
            isSuccess: true,
        } as any);

        render(<VerificationPending />);

        expect(screen.getByText(/Email Sent Again!/i)).toBeInTheDocument();
    });
});
