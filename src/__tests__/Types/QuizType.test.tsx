//QuizType.test.tsx
import { QuizType } from "../../Types/QuizType";
export function isQuizValid(quiz: QuizType): boolean {
    return quiz.title.length > 0 && quiz.questions.length > 0;
}

describe('isQuizValid function', () => {
    it('returns true for a valid quiz', () => {
        const validQuiz: QuizType = {
            id: '1',
            title: 'Sample Quiz',
            questions: ['Question 1', 'Question 2'],
        };

        const result = isQuizValid(validQuiz);
        expect(result).toBe(true);
    });

    it('returns false for an invalid quiz with an empty title', () => {
        const invalidQuiz: QuizType = {
            id: '2',
            title: '',
            questions: ['Question 1', 'Question 2'],
        };

        const result = isQuizValid(invalidQuiz);
        expect(result).toBe(false);
    });

    it('returns false for an invalid quiz with no questions', () => {
        const invalidQuiz: QuizType = {
            id: '3',
            title: 'Sample Quiz',
            questions: [],
        };

        const result = isQuizValid(invalidQuiz);
        expect(result).toBe(false);
    });
});
