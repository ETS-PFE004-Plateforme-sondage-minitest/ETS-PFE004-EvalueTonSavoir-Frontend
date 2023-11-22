//TeacherModeQuiz.test.tsx
import { render, screen, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import { GIFTQuestion } from 'gift-pegjs';

import TeacherModeQuiz from '../../../../pages/Student/TeacherModeQuiz/TeacherModeQuiz';

describe('TeacherModeQuiz', () => {
    const mockQuestion: GIFTQuestion = {
        id: '1',
        type: 'MC',
        stem: { format: 'plain', text: 'Sample Question' },
        title: 'Sample Question',
        hasEmbeddedAnswers: false,
        globalFeedback: null,
        choices: [
            { text: { format: 'plain', text: 'Option A' }, isCorrect: true, weight: 1, feedback: null },
            { text: { format: 'plain', text: 'Option B' }, isCorrect: false, weight: 0, feedback: null },
        ],
    };

    const mockSubmitAnswer = jest.fn();
    const mockDisconnectWebSocket = jest.fn();

    beforeEach(() => {
        render(
            <TeacherModeQuiz
                questionInfos={{ question: mockQuestion, image: 'sample-image-url' }}
                submitAnswer={mockSubmitAnswer}
                disconnectWebSocket={mockDisconnectWebSocket}
            />
        );
    });

    test('renders the initial question', () => {
        expect(screen.getByText('Question 1')).toBeInTheDocument();
        expect(screen.getByText('Sample Question')).toBeInTheDocument();
        expect(screen.getByText('Option A')).toBeInTheDocument();
        expect(screen.getByText('Option B')).toBeInTheDocument();
        expect(screen.getByText('Déconnexion')).toBeInTheDocument();
        expect(screen.getByText('Répondre')).toBeInTheDocument();
    });

    test('handles answer submission and displays wait text', () => {
        fireEvent.click(screen.getByText('Option A'));
        fireEvent.click(screen.getByText('Répondre'));

        expect(mockSubmitAnswer).toHaveBeenCalledWith('Option A', '1');
        expect(screen.getByText('En attente pour la prochaine question...')).toBeInTheDocument();
    });

    test('handles disconnect button click', () => {
        fireEvent.click(screen.getByText('Déconnexion'));

        expect(mockDisconnectWebSocket).toHaveBeenCalled();
    });
});