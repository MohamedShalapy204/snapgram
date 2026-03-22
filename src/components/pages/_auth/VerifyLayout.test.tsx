import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../../../../tests/test-utils';
import VerifyLayout from './VerifyLayout';
import { useUserAccount } from '../../../hooks/queries/useAuth';
import { Route, Routes } from 'react-router-dom';

vi.mock('../../../hooks/queries/useAuth', () => ({
    useUserAccount: vi.fn()
}));

describe('VerifyLayout', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should show loading spinner when data is pending', () => {
        vi.mocked(useUserAccount).mockReturnValue({
            data: null,
            isPending: true
        } as unknown as ReturnType<typeof useUserAccount>);

        render(<VerifyLayout />);

        expect(screen.getByRole('status')).toBeInTheDocument();
        expect(screen.queryByText('Child Content')).not.toBeInTheDocument();
    });

    it('should render children when data is loaded', () => {
        vi.mocked(useUserAccount).mockReturnValue({
            data: { id: '123' },
            isPending: false
        } as unknown as ReturnType<typeof useUserAccount>);

        render(
            <Routes>
                <Route element={<VerifyLayout />}>
                    <Route path="/" element={<div>Child Content</div>} />
                </Route>
            </Routes>
        );

        expect(screen.getByText('Child Content')).toBeInTheDocument();
    });
});
