// ShortAnswerQuestion.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ShortAnswerQuestion from '../../../../components/Questions/ShortAnswerQuestion/ShortAnswerQuestion';

describe('ShortAnswerQuestion Component', () => {
    const mockHandleSubmitAnswer = jest.fn();

    const sampleProps = {
        questionTitle: 'Sample Question',
        choices: [
            {
                feedback: {
                    format: 'text',
                    text: 'Correct answer feedback'
                },
                isCorrect: true,
                text: {
                    format: 'text',
                    text: 'Correct Answer'
                }
            },
            {
                feedback: null,
                isCorrect: false,
                text: {
                    format: 'text',
                    text: 'Incorrect Answer'
                }
            }
        ],
        handleOnSubmitAnswer: mockHandleSubmitAnswer,
        showAnswer: false
    };

    beforeEach(() => {
        render(<ShortAnswerQuestion {...sampleProps} />);
    });

    it('renders correctly', () => {
        expect(screen.getByText('Sample Question')).toBeInTheDocument();

        expect(screen.getByTestId('text-input')).toBeInTheDocument();

        expect(screen.getByText('Répondre')).toBeInTheDocument();
    });

    it('handles input change correctly', () => {
        const inputElement = screen.getByTestId('text-input') as HTMLInputElement;

        fireEvent.change(inputElement, { target: { value: 'User Input' } });

        expect(inputElement.value).toBe('User Input');
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
        const inputElement = screen.getByTestId('text-input') as HTMLInputElement;
        const submitButton = screen.getByText('Répondre');

        fireEvent.change(inputElement, { target: { value: 'User Input' } });

        fireEvent.click(submitButton);

        expect(mockHandleSubmitAnswer).toHaveBeenCalledWith('User Input');
    });
});
