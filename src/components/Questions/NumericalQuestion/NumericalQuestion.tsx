// NumericalQuestion.tsx
import React, { useState } from 'react';
import Latex from 'react-latex';
import '../questionStyle.css';
import { Button, TextField } from '@mui/material';

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
            <div className="title mb-1 text-center center-h-align">
                <Latex>{questionTitle}</Latex>
            </div>
            {showAnswer ? (
                <div className="correct-answer-text">{correctAnswer}</div>
            ) : (
                <>
                    <div className="answer-wrapper mb-1">
                        <TextField
                            type="number"
                            id={questionTitle}
                            name={questionTitle}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setAnswer(e.target.valueAsNumber);
                            }}
                            data-testid="number-input"
                        />
                    </div>
                    <Button
                        variant="contained"
                        onClick={() => answer !== undefined && handleOnSubmitAnswer(answer)}
                        disabled={answer === undefined || isNaN(answer)}
                    >
                        Répondre
                    </Button>
                </>
            )}
        </div>
    );
};

export default NumericalQuestion;
