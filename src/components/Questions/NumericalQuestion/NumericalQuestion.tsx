import React, { useState } from 'react';
import '../questionStyle.css';
import SubmitButton from '../../SubmitButton';

type CorrectAnswer = {
    numberHigh?: number;
    numberLow?: number;
    number?: number;
    type: string;
};

interface Props {
    questionTitle: string;
    correctAnswers: CorrectAnswer;
    handleOnSubmitAnswer: (answer: number) => void;
    showAnswer?: boolean;
}

const NumericalQuestion: React.FC<Props> = (props) => {
    const { questionTitle, correctAnswers, showAnswer, handleOnSubmitAnswer } = props;

    const [answer, setAnswer] = useState<number>();

    const correctAnswer =
        correctAnswers.type === 'high-low'
            ? `Entre ${correctAnswers.numberLow} et ${correctAnswers.numberHigh}`
            : correctAnswers.number;

    return (
        <div className="question-wrapper">
            <div className="title">{questionTitle}</div>
            {showAnswer ? (
                <div className="correct-answer-text">{correctAnswer}</div>
            ) : (
                <div className="answer-wrapper">
                    <input
                        className="number-input"
                        type="number"
                        id={questionTitle}
                        name={questionTitle}
                        onChange={(e) => {
                            setAnswer(e.target.valueAsNumber);
                        }}
                    />
                </div>
            )}
            <SubmitButton
                hide={showAnswer}
                onClick={() => answer !== undefined && handleOnSubmitAnswer(answer)}
                disabled={answer === undefined || isNaN(answer)}
            />
        </div>
    );
};

export default NumericalQuestion;