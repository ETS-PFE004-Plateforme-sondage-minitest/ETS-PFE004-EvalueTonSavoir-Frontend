// Modal.test.tsx
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ConfirmDialog from '../../../components/ConfirmDialog/ConfirmDialog';

describe('Modal Component', () => {
    const mockOnConfirm = jest.fn();
    const mockOnCancel = jest.fn();
    const mockOnOptionalInputChange = jest.fn();

    const sampleProps = {
        open: true,
        title: 'Sample Modal Title',
        message: 'Sample Modal Message',
        onConfirm: mockOnConfirm,
        onCancel: mockOnCancel,
        hasOptionalInput: true,
        optionalInputValue: 'Optional Input Value',
        onOptionalInputChange: mockOnOptionalInputChange
    };

    beforeEach(() => {
        render(<ConfirmDialog {...sampleProps} />);
    });

    it('renders correctly', () => {
        expect(screen.getByText('Sample Modal Title')).toBeInTheDocument();
        expect(screen.getByText('Sample Modal Message')).toBeInTheDocument();

        const optionalInput = screen.getByTestId('optional-input') as HTMLInputElement;
        expect(optionalInput).toBeInTheDocument();
        expect(optionalInput.value).toBe('Optional Input Value');

        expect(screen.getByText('Confirmer')).toBeInTheDocument();
        expect(screen.getByText('Annuler')).toBeInTheDocument();
    });

    it('calls onConfirm callback when "Confirmer" button is clicked', () => {
        const confirmButton = screen.getByText('Confirmer');
        fireEvent.click(confirmButton);
        expect(mockOnConfirm).toHaveBeenCalled();
    });

    it('calls onCancel callback when "Annuler" button is clicked', () => {
        const cancelButton = screen.getByText('Annuler');
        fireEvent.click(cancelButton);
        expect(mockOnCancel).toHaveBeenCalled();
    });

    it('calls onOptionalInputChange callback when optional input changes', () => {
        const optionalInput = screen.getByTestId('optional-input') as HTMLInputElement;
        fireEvent.change(optionalInput, { target: { value: 'Updated Value' } });
        expect(mockOnOptionalInputChange).toHaveBeenCalled();
    });
});
