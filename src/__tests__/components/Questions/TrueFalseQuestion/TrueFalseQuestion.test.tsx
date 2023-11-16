// TrueFalseQuestion.test.tsx
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TrueFalseQuestion from '../../../../components/Questions/TrueFalseQuestion/TrueFalseQuestion';

describe('TrueFalseQuestion Component', () => {
    const mockHandleSubmitAnswer = jest.fn();

    const sampleProps = {
        questionTitle: 'Sample True/False Question',
        correctAnswer: true,
        handleOnSubmitAnswer: mockHandleSubmitAnswer,
        showAnswer: false
    };

    beforeEach(() => {
        render(<TrueFalseQuestion {...sampleProps} />);
    });

    it('renders correctly', () => {
        expect(screen.getByText('Sample True/False Question')).toBeInTheDocument();

        expect(screen.getByText('Vrai')).toBeInTheDocument();
        expect(screen.getByText('Faux')).toBeInTheDocument();

        expect(screen.getByText('Répondre')).toBeInTheDocument();
    });

    it('selects True option correctly', () => {
        const trueButton = screen.getByText('Vrai');

        fireEvent.click(trueButton);

        expect(trueButton).toHaveClass('selected');
        expect(screen.getByText('Faux')).not.toHaveClass('selected');
    });

    it('selects False option correctly', () => {
        const falseButton = screen.getByText('Faux');

        fireEvent.click(falseButton);

        expect(falseButton).toHaveClass('selected');
        expect(screen.getByText('Vrai')).not.toHaveClass('selected');
    });

    it('Submit button should be disabled if no option is selected', () => {
        const submitButton = screen.getByText('Répondre');

        expect(submitButton).toBeDisabled();
    });

    it('not submit answer if no option is selected', () => {
        const submitButton = screen.getByText('Répondre');

        fireEvent.click(submitButton);

        expect(mockHandleSubmitAnswer).not.toHaveBeenCalled();
    });

    it('submits answer correctly for True', () => {
        const trueButton = screen.getByText('Vrai');
        const submitButton = screen.getByText('Répondre');

        fireEvent.click(trueButton);

        fireEvent.click(submitButton);

        expect(mockHandleSubmitAnswer).toHaveBeenCalledWith(true);
    });

    it('submits answer correctly for False', () => {
        const falseButton = screen.getByText('Faux');
        const submitButton = screen.getByText('Répondre');

        fireEvent.click(falseButton);

        fireEvent.click(submitButton);

        expect(mockHandleSubmitAnswer).toHaveBeenCalledWith(false);
    });
});
