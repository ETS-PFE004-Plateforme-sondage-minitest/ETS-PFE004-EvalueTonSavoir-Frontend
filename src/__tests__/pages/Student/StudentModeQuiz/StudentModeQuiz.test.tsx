import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QuestionType } from '../../../../Types/QuestionType';
import StudentModeQuiz from '../../../../components/StudentModeQuiz/StudentModeQuiz';

describe('StudentModeQuiz', () => {
    const mockQuestions: QuestionType[] = [
        {
            question: {
                id: '1',
                type: 'MC',
                stem: { format: 'plain', text: 'Sample Question 1' },
                title: 'Sample Question 1',
                hasEmbeddedAnswers: false,
                globalFeedback: null,
                choices: [
                    { text: { format: 'plain', text: 'Option A' }, isCorrect: true, weight: 1, feedback: null },
                    { text: { format: 'plain', text: 'Option B' }, isCorrect: false, weight: 0, feedback: null },
                ],
            },
            image: '<img src="sample-image-url" alt="Sample Image" />',
        },
        {
            question: {
                id: '2',
                type: 'MC',
                stem: { format: 'plain', text: 'Sample Question 2' },
                title: 'Sample Question 2',
                hasEmbeddedAnswers: false,
                globalFeedback: null,
                choices: [
                    { text: { format: 'plain', text: 'Option C' }, isCorrect: true, weight: 1, feedback: null },
                    { text: { format: 'plain', text: 'Option D' }, isCorrect: false, weight: 0, feedback: null },
                ],
            },
            image: '',
        },
    ];

    const mockSubmitAnswer = jest.fn();
    const mockDisconnectWebSocket = jest.fn();

    test('renders the initial question', () => {
        render(
            <StudentModeQuiz
                questions={mockQuestions}
                submitAnswer={mockSubmitAnswer}
                disconnectWebSocket={mockDisconnectWebSocket}
            />
        );

        expect(screen.getByText('Sample Question 1')).toBeInTheDocument();
    });

    test('handles disconnect button click', () => {
        render(
            <StudentModeQuiz
                questions={mockQuestions}
                submitAnswer={mockSubmitAnswer}
                disconnectWebSocket={mockDisconnectWebSocket}
            />
        );

        fireEvent.click(screen.getByText('Déconnexion'));

        expect(mockDisconnectWebSocket).toHaveBeenCalled();
    });

});
