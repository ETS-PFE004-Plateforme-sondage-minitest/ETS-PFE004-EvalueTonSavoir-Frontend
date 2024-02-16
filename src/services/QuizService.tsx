// QuizService.tsx
import { QuizType } from '../Types/QuizType';

export class QuizService {
    static getQuizById(id: string | undefined, storage?: any): QuizType | undefined {
        if (!id) return undefined;
        if (!storage) {
            storage = localStorage;
        }

        const storedQuizzes = JSON.parse(storage.getItem('quizzes') || '[]');
        const quiz = storedQuizzes.find((q: QuizType) => q._id === id);
        return quiz;
    }
}
