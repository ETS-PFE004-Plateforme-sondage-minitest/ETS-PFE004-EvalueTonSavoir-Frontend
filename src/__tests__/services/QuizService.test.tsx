/*import { QuizService } from '../../services/QuizService';
import { QuizType } from '../../Types/QuizType';

// we need to mock localStorage for this test
if (typeof window === 'undefined') {
    global.window = {} as Window & typeof globalThis;
}

const localStorageMock = (() => {
    let store: { [key: string]: string } = {};
    return {
        getItem(key: string) {
            return store[key] || null;
        },
        setItem(key: string, value: string) {
            store[key] = value.toString();
        },
        removeItem(key: string) {
            delete store[key];
        },
        clear() {
            store = {};
        }
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
});

/*describe('QuizService', () => {
    const mockQuizzes: QuizType[] = [
        { _id: 'quiz1', title: 'Quiz One', content: ['Q1', 'Q2'] },
        { _id: 'quiz2', title: 'Quiz Two', content: ['Q3', 'Q4'] }
    ];

    beforeEach(() => {
        localStorageMock.setItem('quizzes', JSON.stringify(mockQuizzes));
    });

    afterEach(() => {
        localStorageMock.removeItem('quizzes');
    });

    test('should return quiz for valid id', () => {
        const quiz = QuizService.getQuizById('quiz1', localStorageMock);
        expect(quiz).toEqual(mockQuizzes[0]);
    });

    test('should return undefined for invalid id', () => {
        const quiz = QuizService.getQuizById('nonexistent', localStorageMock);
        expect(quiz).toBeUndefined();
    });

    test('should return undefined for undefined id', () => {
        const quiz = QuizService.getQuizById(undefined, localStorageMock);
        expect(quiz).toBeUndefined();
    });

    test('should handle empty localStorage', () => {
        localStorageMock.removeItem('quizzes');
        const quiz = QuizService.getQuizById('quiz1', localStorageMock);
        expect(quiz).toBeUndefined();
    });
});*/
