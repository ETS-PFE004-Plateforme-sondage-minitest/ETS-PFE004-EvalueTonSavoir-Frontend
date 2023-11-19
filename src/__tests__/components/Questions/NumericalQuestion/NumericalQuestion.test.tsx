// NumericalQuestion.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import NumericalQuestion from '../../../../components/Questions/NumericalQuestion/NumericalQuestion';

describe('NumericalQuestion Component', () => {
    const mockHandleSubmitAnswer = jest.fn();

    const sampleProps = {
        questionTitle: 'Sample Question',
        correctAnswers: {
            numberHigh: 10,
            numberLow: 5,
            type: 'high-low'
        },
        handleOnSubmitAnswer: mockHandleSubmitAnswer,
        showAnswer: false
    };

    beforeEach(() => {
        render(<NumericalQuestion {...sampleProps} />);
    });

    it('renders correctly', () => {
        expect(screen.getByText('Sample Question')).toBeInTheDocument();
        expect(screen.getByTestId('number-input')).toBeInTheDocument();
        expect(screen.getByText('Répondre')).toBeInTheDocument();
    });

    it('handles input change correctly', () => {
        const inputElement = screen.getByTestId('number-input') as HTMLInputElement;

        fireEvent.change(inputElement, { target: { value: '7' } });

        expect(inputElement.value).toBe('7');
    });

    it('Submit button should be disable if nothing is entered', () => {
        const submitButton = screen.getByText('Répondre');

        expect(submitButton).toBeDisabled();
    });

    it('not submited answer if nothing is entered', () => {
        const submitButton = screen.getByText('Répondre');

        fireEvent.click(submitButton);

        expect(mockHandleSubmitAnswer).not.toHaveBeenCalled();
    });

    it('submits answer correctly', () => {
        const inputElement = screen.getByTestId('number-input');
        const submitButton = screen.getByText('Répondre');

        fireEvent.change(inputElement, { target: { value: '7' } });

        fireEvent.click(submitButton);

        expect(mockHandleSubmitAnswer).toHaveBeenCalledWith(7);
    });
});
