// Question.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Questions from '../../../components/Questions/Question';
import { GIFTQuestion } from 'gift-pegjs';

//
describe('Questions Component', () => {
    const mockHandleSubmitAnswer = jest.fn();

    const sampleTrueFalseQuestion: GIFTQuestion = {
        type: 'TF',
        stem: { format: 'plain', text: 'Sample True/False Question' },
        isTrue: true,
        incorrectFeedback: null,
        correctFeedback: null,
        title: 'True/False Question',
        hasEmbeddedAnswers: false,
        globalFeedback: null,
    };

    const sampleMultipleChoiceQuestion: GIFTQuestion = {
        type: 'MC',
        stem: { format: 'plain', text: 'Sample Multiple Choice Question' },
        title: 'Multiple Choice Question',
        hasEmbeddedAnswers: false,
        globalFeedback: null,
        choices: [
            { feedback: null, isCorrect: true, text: { format: 'plain', text: 'Choice 1' }, weight: 1 },
            { feedback: null, isCorrect: false, text: { format: 'plain', text: 'Choice 2' }, weight: 0 },
        ],
    };

    const sampleNumericalQuestion: GIFTQuestion = {
        type: 'Numerical',
        stem: { format: 'plain', text: 'Sample Numerical Question' },
        title: 'Numerical Question',
        hasEmbeddedAnswers: false,
        globalFeedback: null,
        choices: { numberHigh: 10, numberLow: 5, type: 'high-low' },
    };

    const sampleShortAnswerQuestion: GIFTQuestion = {
        type: 'Short',
        stem: { format: 'plain', text: 'Sample short answer question' },
        title: 'Short Answer Question Title',
        hasEmbeddedAnswers: false,
        globalFeedback: null,
        choices: [
            {
                feedback: { format: 'html', text: 'Correct answer feedback' },
                isCorrect: true,
                text: { format: 'html', text: 'Correct Answer' },
                weight: 1,
            },
            {
                feedback: { format: 'html', text: 'Incorrect answer feedback' },
                isCorrect: false,
                text: { format: 'html', text: 'Incorrect Answer' },
                weight: 0,
            },
        ],
    };

    const renderComponent = (question: GIFTQuestion) => {
        render(<Questions question={question} handleOnSubmitAnswer={mockHandleSubmitAnswer} />);
    };

    it('renders correctly for True/False question', () => {
        renderComponent(sampleTrueFalseQuestion);

        expect(screen.getByText('Sample True/False Question')).toBeInTheDocument();
        expect(screen.getByText('Vrai')).toBeInTheDocument();
        expect(screen.getByText('Faux')).toBeInTheDocument();
        expect(screen.getByText('Répondre')).toBeInTheDocument();
    });

    it('renders correctly for Multiple Choice question', () => {
        renderComponent(sampleMultipleChoiceQuestion);

        expect(screen.getByText('Sample Multiple Choice Question')).toBeInTheDocument();
        expect(screen.getByText('Choice 1')).toBeInTheDocument();
        expect(screen.getByText('Choice 2')).toBeInTheDocument();
        expect(screen.getByText('Répondre')).toBeInTheDocument();
    });

    it('handles selection and submission for Multiple Choice question', () => {
        renderComponent(sampleMultipleChoiceQuestion);

        const choiceButton = screen.getByText('Choice 1').closest('button')!;
        fireEvent.click(choiceButton);

        const submitButton = screen.getByText('Répondre');
        fireEvent.click(submitButton);

        expect(mockHandleSubmitAnswer).toHaveBeenCalledWith('Choice 1');
    });

    it('renders correctly for Numerical question', () => {
        renderComponent(sampleNumericalQuestion);

        expect(screen.getByText('Sample Numerical Question')).toBeInTheDocument();
        expect(screen.getByTestId('number-input')).toBeInTheDocument();
        expect(screen.getByText('Répondre')).toBeInTheDocument();
    });

    it('handles input and submission for Numerical question', () => {
        renderComponent(sampleNumericalQuestion);

        const inputElement = screen.getByTestId('number-input') as HTMLInputElement;
        fireEvent.change(inputElement, { target: { value: '7' } });

        const submitButton = screen.getByText('Répondre');
        fireEvent.click(submitButton);

        expect(mockHandleSubmitAnswer).toHaveBeenCalledWith(7);
    });

    it('renders correctly for Short Answer question', () => {
        renderComponent(sampleShortAnswerQuestion);

        expect(screen.getByText('Sample short answer question')).toBeInTheDocument();
        expect(screen.getByTestId('text-input')).toBeInTheDocument();
        expect(screen.getByText('Répondre')).toBeInTheDocument();
    });

    it('handles input and submission for Short Answer question', () => {
        renderComponent(sampleShortAnswerQuestion);

        const inputElement = screen.getByTestId('text-input') as HTMLInputElement;
        fireEvent.change(inputElement, { target: { value: 'User Input' } });

        const submitButton = screen.getByText('Répondre');
        fireEvent.click(submitButton);

        expect(mockHandleSubmitAnswer).toHaveBeenCalledWith('User Input');
    });
});


