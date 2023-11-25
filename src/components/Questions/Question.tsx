// Question;tsx
import React from 'react';
import { GIFTQuestion } from 'gift-pegjs';

import TrueFalseQuestion from './TrueFalseQuestion/TrueFalseQuestion';
import MultipleChoiceQuestion from './MultipleChoiceQuestion/MultipleChoiceQuestion';
import NumericalQuestion from './NumericalQuestion/NumericalQuestion';
import ShortAnswerQuestion from './ShortAnswerQuestion/ShortAnswerQuestion';

interface QuestionsProps {
    question: GIFTQuestion;
    handleOnSubmitAnswer: (answer: string | number | boolean) => void;
    showAnswer?: boolean;
    imageUrl?: string;
}
const Questions: React.FC<QuestionsProps> = ({
    question,
    handleOnSubmitAnswer,
    showAnswer,
    imageUrl
}) => {
    let questionTypeComponent = null;
    console.log(imageUrl);
    switch (question.type) {
        case 'TF':
            questionTypeComponent = (
                <TrueFalseQuestion
                    questionTitle={question.stem.text}
                    correctAnswer={question.isTrue}
                    handleOnSubmitAnswer={handleOnSubmitAnswer}
                    showAnswer={showAnswer}
                />
            );
            break;
        case 'MC':
            questionTypeComponent = (
                <MultipleChoiceQuestion
                    questionTitle={question.stem.text}
                    choices={question.choices}
                    handleOnSubmitAnswer={handleOnSubmitAnswer}
                    showAnswer={showAnswer}
                />
            );
            break;
        case 'Numerical':
            if (question.choices && !Array.isArray(question.choices)) {
                questionTypeComponent = (
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
            questionTypeComponent = (
                <ShortAnswerQuestion
                    questionTitle={question.stem.text}
                    choices={question.choices}
                    handleOnSubmitAnswer={handleOnSubmitAnswer}
                    showAnswer={showAnswer}
                />
            );
            break;
    }
    return (
        <div className="question-container">
            {questionTypeComponent ? (
                <>
                    {imageUrl && (
                        <img src={imageUrl} alt="QuestionImage" style={{ width: '12vw' }} />
                    )}
                    {questionTypeComponent}{' '}
                </>
            ) : (
                <div>Question de type inconnue</div>
            )}
        </div>
    );
};

export default Questions;
