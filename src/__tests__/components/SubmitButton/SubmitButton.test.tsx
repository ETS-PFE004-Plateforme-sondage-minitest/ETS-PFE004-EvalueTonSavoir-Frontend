// SubmitButton.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SubmitButton from '../../../components/SubmitButton/SubmitButton';

describe('SubmitButton', () => {
    test('renders the button when not hidden', () => {
        render(<SubmitButton onClick={() => {}} disabled={false} />);
        expect(screen.getByText('Répondre')).toBeInTheDocument();
    });

    test('does not render the button when hidden', () => {
        render(<SubmitButton onClick={() => {}} hide={true} disabled={false} />);
        expect(screen.queryByText('Répondre')).toBeNull();
    });

    test('calls onClick prop when clicked', () => {
        const handleClick = jest.fn();
        render(<SubmitButton onClick={handleClick} disabled={false} />);
        fireEvent.click(screen.getByText('Répondre'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('is disabled when disabled prop is true', () => {
        render(<SubmitButton onClick={() => {}} disabled={true} />);
        expect(screen.getByText('Répondre')).toBeDisabled();
    });
});
