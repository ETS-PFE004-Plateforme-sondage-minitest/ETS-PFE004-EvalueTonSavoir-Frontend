// TrueFalseQuestion.tsx
import React, { useState } from 'react';
import Latex from 'react-latex';
import '../questionStyle.css';
import { Button } from '@mui/material';

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
            <div className="title mb-1">
                <Latex>{questionTitle}</Latex>
            </div>
            <div className="choices-container">
                <Button className="button-wrapper" onClick={() => !showAnswer && setAnswer(true)}>
                    {showAnswer && (correctAnswer ? '✅' : '❌')}
                    <div className={`circle ${selectedTrue}`}>T</div>
                    <div className={`answer-text ${selectedTrue}`}>Vrai</div>
                </Button>
                <Button className="button-wrapper" onClick={() => !showAnswer && setAnswer(false)}>
                    {showAnswer && (!correctAnswer ? '✅' : '❌')}
                    <div className={`circle ${selectedFalse}`}>F</div>
                    <div className={`answer-text ${selectedFalse}`}>Faux</div>
                </Button>
            </div>
            {!showAnswer && (
                <Button
                    variant="contained"
                    onClick={() => answer !== undefined && handleOnSubmitAnswer(answer)}
                    disabled={answer === undefined}
                >
                    Répondre
                </Button>
            )}
        </div>
    );
};

export default TrueFalseQuestion;
