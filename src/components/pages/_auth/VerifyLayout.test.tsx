import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../../../../tests/test-utils';
import VerifyLayout from './VerifyLayout';
import { useUser } from '../../../hooks/queries/useAuth';
import { Route, Routes } from 'react-router-dom';

vi.mock('../../../hooks/queries/useAuth', () => ({
    useUser: vi.fn()
}));

describe('VerifyLayout', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should show loading spinner when data is pending', () => {
        vi.mocked(useUser).mockReturnValue({
            data: null,
            isPending: true
        } as any);

        render(<VerifyLayout />);

        expect(screen.getByRole('status')).toBeInTheDocument();
        expect(screen.queryByText('Child Content')).not.toBeInTheDocument();
    });

    it('should render children when data is loaded', () => {
        vi.mocked(useUser).mockReturnValue({
            data: { id: '123' },
            isPending: false
        } as any);

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
