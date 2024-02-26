/*//QuizType.test.tsx
import { QuizType } from "../../Types/QuizType";
export function isQuizValid(quiz: QuizType): boolean {
    return quiz.title.length > 0 && quiz.content.length > 0;
}

describe('isQuizValid function', () => {
    it('returns true for a valid quiz', () => {
        const validQuiz: QuizType = {
            _id: '1',
            title: 'Sample Quiz',
            content: ['Question 1', 'Question 2'],
        };

        const result = isQuizValid(validQuiz);
        expect(result).toBe(true);
    });

    it('returns false for an invalid quiz with an empty title', () => {
        const invalidQuiz: QuizType = {
            _id: '2',
            title: '',
            content: ['Question 1', 'Question 2'],
        };

        const result = isQuizValid(invalidQuiz);
        expect(result).toBe(false);
    });

    it('returns false for an invalid quiz with no questions', () => {
        const invalidQuiz: QuizType = {
            _id: '3',
            title: 'Sample Quiz',
            content: [],
        };

        const result = isQuizValid(invalidQuiz);
        expect(result).toBe(false);
    });
});*/
