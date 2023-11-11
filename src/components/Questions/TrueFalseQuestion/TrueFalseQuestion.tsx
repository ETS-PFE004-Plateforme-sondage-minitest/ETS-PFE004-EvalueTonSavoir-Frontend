import React, { useState } from 'react';
import '../questionStyle.css';
import SubmitButton from '../../SubmitButton';

interface Props {
    questionTitle: string;
    correctAnswer: boolean;
    handleOnSubmitAnswer: (answer: boolean) => void;
    showAnswer?: boolean;
}

const TrueFalseQuestion: React.FC<Props> = (props) => {
    const { questionTitle, correctAnswer, showAnswer, handleOnSubmitAnswer } = props;
    const [answer, setAnswer] = useState<boolean>();

    const selectedTrue = answer ? 'selected' : '';
    const selectedFalse = answer !== undefined && !answer ? 'selected' : '';
    return (
        <div className="question-container">
            <div className="title">{questionTitle}</div>
            <div className="choice-container">
                <button
                    className="button-wrapper"
                    disabled={showAnswer}
                    onClick={() => setAnswer(true)}
                >
                    {showAnswer && (correctAnswer ? '✅' : '❌')}
                    <div className={`circle ${selectedTrue}`}>T</div>
                    <div className={`answer-text ${selectedTrue}`}>Vrai</div>
                </button>
                <button
                    className="button-wrapper"
                    disabled={showAnswer}
                    onClick={() => setAnswer(false)}
                >
                    {showAnswer && (!correctAnswer ? '✅' : '❌')}
                    <div className={`circle ${selectedFalse}`}>F</div>
                    <div className={`answer-text ${selectedFalse}`}>Faux</div>
                </button>
            </div>
            <SubmitButton
                hide={showAnswer}
                onClick={() => answer !== undefined && handleOnSubmitAnswer(answer)}
                disabled={answer === undefined}
            />
        </div>
    );
};

export default TrueFalseQuestion;
