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
                type: 'TF',
                stem: { format: 'plain', text: 'Sample Question 2' },
                isTrue: true,
                incorrectFeedback: null,
                correctFeedback: null,
                title: 'Question 2',
                hasEmbeddedAnswers: false,
                globalFeedback: null,
            },
            image: 'sample-image-url-2',
        },
    ];

    const mockSubmitAnswer = jest.fn();
    const mockDisconnectWebSocket = jest.fn();


    test('renders the initial question', async () => {
        render(
            <StudentModeQuiz
                questions={mockQuestions}
                submitAnswer={mockSubmitAnswer}
                disconnectWebSocket={mockDisconnectWebSocket}
            />
        );

        expect(screen.getByText('Sample Question 1')).toBeInTheDocument();
        expect(screen.getByText('Option A')).toBeInTheDocument();
        expect(screen.getByText('Option B')).toBeInTheDocument();
        expect(screen.getByText('Déconnexion')).toBeInTheDocument();

    });

    test('handles answer submission text', () => {

        render(
            <StudentModeQuiz
                questions={mockQuestions}
                submitAnswer={mockSubmitAnswer}
                disconnectWebSocket={mockDisconnectWebSocket}
            />
        );

        fireEvent.click(screen.getByText('Option A'));
        fireEvent.click(screen.getByText('Répondre'));

        expect(mockSubmitAnswer).toHaveBeenCalledWith('Option A', '1');
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

    test('navigates to the next question', () => {
        render(
            <StudentModeQuiz
                questions={mockQuestions}
                submitAnswer={mockSubmitAnswer}
                disconnectWebSocket={mockDisconnectWebSocket}
            />
        );

        fireEvent.click(screen.getByText('Option A'));
        fireEvent.click(screen.getByText('Répondre'));
        fireEvent.click(screen.getByText('Question suivante'));


        expect(screen.getByText('Sample Question 2')).toBeInTheDocument();
        expect(screen.getByText('T')).toBeInTheDocument();
    });

    test('navigates to the previous question', () => {

        render(
            <StudentModeQuiz
                questions={mockQuestions}
                submitAnswer={mockSubmitAnswer}
                disconnectWebSocket={mockDisconnectWebSocket}
            />
        );

        fireEvent.click(screen.getByText('Option A'));
        fireEvent.click(screen.getByText('Répondre'));

        fireEvent.click(screen.getByText('Question précédente'));


        expect(screen.getByText('Sample Question 1')).toBeInTheDocument();
        expect(screen.getByText('Option B')).toBeInTheDocument();
    });

});

