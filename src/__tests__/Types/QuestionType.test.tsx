//QuestionType.test.tsx
import { GIFTQuestion } from 'gift-pegjs';
import { QuestionType } from '../../Types/QuestionType';

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

const mockQuestionType: QuestionType = {
    question: mockQuestion,
    image: 'sample-image-url',
};

describe('QuestionType', () => {
    test('has the expected structure', () => {
        expect(mockQuestionType).toEqual(expect.objectContaining({
            question: expect.any(Object),
            image: expect.any(String),
        }));

        expect(mockQuestionType.question).toEqual(expect.objectContaining({
            id: expect.any(String),
            type: expect.any(String),
            stem: expect.objectContaining({
                format: expect.any(String),
                text: expect.any(String),
            }),
            title: expect.any(String),
            hasEmbeddedAnswers: expect.any(Boolean),
            globalFeedback: expect.any(Object),
            choices: expect.any(Array),
        }));
    });
});
