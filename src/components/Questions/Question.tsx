import { GIFTQuestion } from 'gift-pegjs';

import TrueFalseQuestion from './TrueFalseQuestion/TrueFalseQuestion';
import MultipleChoiceQuestion from './MultipleChoiceQuestion/MultipleChoiceQuestion';
import NumericalQuestion from './NumericalQuestion/NumericalQuestion';
import ShortAnswerQuestion from './ShortAnswerQuestion/ShortAnswerQuestion';
import React from 'react';

interface QuestionsProps {
    question: GIFTQuestion;
    handleOnSubmitAnswer: (answer: string | number | boolean) => void;
    showAnswer?: boolean;
}
const Questions: React.FC<QuestionsProps> = ({ question, handleOnSubmitAnswer, showAnswer }) => {
    switch (question.type) {
        case 'TF':
            return (
                <TrueFalseQuestion
                    questionTitle={question.stem.text}
                    correctAnswer={question.isTrue}
                    handleOnSubmitAnswer={handleOnSubmitAnswer}
                    showAnswer={showAnswer}
                />
            );
        case 'MC':
            return (
                <MultipleChoiceQuestion
                    questionTitle={question.stem.text}
                    choices={question.choices}
                    handleOnSubmitAnswer={handleOnSubmitAnswer}
                    showAnswer={showAnswer}
                />
            );
        case 'Numerical':
            if (question.choices && !Array.isArray(question.choices)) {
                return (
                    <NumericalQuestion
                        questionTitle={question.stem.text}
                        correctAnswers={question.choices}
                        handleOnSubmitAnswer={handleOnSubmitAnswer}
                        showAnswer={showAnswer}
                    />
                );
            }
            break;
        case 'Short':
            return (
                <ShortAnswerQuestion
                    questionTitle={question.stem.text}
                    choices={question.choices}
                    handleOnSubmitAnswer={handleOnSubmitAnswer}
                    showAnswer={showAnswer}
                />
            );
        default:
            return <div>Question de type inconnu</div>;
    }
};

export default Questions;
