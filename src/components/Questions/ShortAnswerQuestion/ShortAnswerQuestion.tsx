// ShortAnswerQuestion.tsx
import React, { useState } from 'react';
import Latex from 'react-latex';
import '../questionStyle.css';
import { Button, TextField } from '@mui/material';

type Choices = {
    feedback: { format: string; text: string } | null;
    isCorrect: boolean;
    text: { format: string; text: string };
    weigth?: number;
};

interface Props {
    questionTitle: string;
    choices: Choices[];
    globalFeedback?: string | undefined;
    handleOnSubmitAnswer?: (answer: string) => void;
    showAnswer?: boolean;
}

const ShortAnswerQuestion: React.FC<Props> = (props) => {
    const { questionTitle, choices, showAnswer, handleOnSubmitAnswer, globalFeedback } = props;
    const [answer, setAnswer] = useState<string>();

    return (
        <div className="question-wrapper">
            <div className="title mb-1 text-center center-h-align">
                <Latex>{questionTitle}</Latex>
            </div>
            {showAnswer ? (
                <div className="correct-answer-text">
                    {choices.map((choice) => (
                        <div>{choice.text.text}</div>
                    ))}
                </div>
            ) : (
                <>
                    <div className="answer-wrapper mb-1">
                        <TextField
                            type="text"
                            id={questionTitle}
                            name={questionTitle}
                            onChange={(e) => {
                                setAnswer(e.target.value);
                            }}
                            disabled={showAnswer}
                            data-testid="text-input"
                        />
                    </div>
                    {globalFeedback && showAnswer && (
                        <div className="global-feedback mb-2">{globalFeedback}</div>
                    )}
                    {handleOnSubmitAnswer && (
                        <Button
                            variant="contained"
                            onClick={() =>
                                answer !== undefined &&
                                handleOnSubmitAnswer &&
                                handleOnSubmitAnswer(answer)
                            }
                            disabled={answer === undefined || answer === ''}
                        >
                            Répondre
                        </Button>
                    )}
                </>
            )}
        </div>
    );
};

export default ShortAnswerQuestion;
