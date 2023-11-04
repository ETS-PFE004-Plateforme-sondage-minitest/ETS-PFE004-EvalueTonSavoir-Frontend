import { QuizType } from '../Types/QuizType';

export class QuizService {
    static getQuizById(id: string | undefined): QuizType | undefined {
        if (!id) return undefined;
        const storedQuizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
        const quiz = storedQuizzes.find((q: QuizType) => q.id === id);
        return quiz;
    }
}
