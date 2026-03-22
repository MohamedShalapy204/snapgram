import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import FileUploader from './FileUploader';

describe('FileUploader Component', () => {
    it('should render initial upload state when no mediaUrl is provided', () => {
        const mockFieldChange = vi.fn();
        render(<FileUploader fieldChange={mockFieldChange} mediaUrl="" />);

        expect(screen.getByText('Select a photo')).toBeInTheDocument();
        expect(screen.getByText('SVG, PNG, JPG (Max 5MB)')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Choose from folder/i })).toBeInTheDocument();
    });

    it('should render image preview when mediaUrl is provided', () => {
        const mockFieldChange = vi.fn();
        const testUrl = 'http://example.com/test.jpg';
        render(<FileUploader fieldChange={mockFieldChange} mediaUrl={testUrl} />);

        const image = screen.getByRole('img', { name: /Preview/i });
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute('src', testUrl);
        expect(screen.getByText('Click or drag photo to replace')).toBeInTheDocument();
    });

    it('should call fieldChange and show preview when a file is dropped', async () => {
        const user = userEvent.setup();
        const mockFieldChange = vi.fn();

        render(<FileUploader fieldChange={mockFieldChange} mediaUrl="" />);

        const file = new File(['hello'], 'hello.png', { type: 'image/png' });

        // react-dropzone sets the input type="file" inside
        // Since the input is hidden by dropzone, container.querySelector can find it
        // Or we can get it by role
        const input = document.querySelector('input[type="file"]') as HTMLInputElement;

        await user.upload(input, file);

        await waitFor(() => {
            expect(mockFieldChange).toHaveBeenCalledWith(expect.arrayContaining([file]));
        });

        // The preview image should now be in the document
        expect(screen.getByRole('img', { name: /Preview/i })).toBeInTheDocument();
        expect(screen.queryByText('Select a photo')).not.toBeInTheDocument();
    });
});
