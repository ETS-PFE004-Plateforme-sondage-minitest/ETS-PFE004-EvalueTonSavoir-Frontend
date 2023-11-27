// MultipleChoiceQuestion.tsx
import React, { useState } from 'react';
import Latex from 'react-latex';
import '../questionStyle.css';
import { Button } from '@mui/material';

type Choices = {
    feedback: { format: string; text: string } | null;
    isCorrect: boolean;
    text: { format: string; text: string };
    weigth?: number;
};

interface Props {
    questionTitle: string;
    choices: Choices[];
    handleOnSubmitAnswer?: (answer: string) => void;
    showAnswer?: boolean;
}

const MultipleChoiceQuestion: React.FC<Props> = (props) => {
    const { questionTitle, choices, showAnswer, handleOnSubmitAnswer } = props;
    const [answer, setAnswer] = useState<string>();

    const handleOnClickAnswer = (choice: string) => {
        setAnswer(choice);
    };

    const alpha = Array.from(Array(26)).map((_e, i) => i + 65);
    const alphabet = alpha.map((x) => String.fromCharCode(x));

    return (
        <div className="question-container">
            <div className="title mb-1 text-center align-h-center">
                <Latex>{questionTitle}</Latex>
            </div>
            <div className="choices-wrapper mb-1">
                {choices.map((choice, i) => {
                    const selected = answer === choice.text.text ? 'selected' : '';
                    return (
                        <div key={choice.text.text + i}>
                            <Button
                                variant="text"
                                fullWidth
                                className="button-wrapper"
                                onClick={() => !showAnswer && handleOnClickAnswer(choice.text.text)}
                            >
                                {showAnswer && (choice.isCorrect ? '✅' : '❌')}
                                <div className={`circle ${selected}`}>{alphabet[i]}</div>
                                <div className={`answer-text ${selected}`}>
                                    <Latex>{choice.text.text}</Latex>
                                </div>
                            </Button>
                        </div>
                    );
                })}
            </div>
            {!showAnswer && handleOnSubmitAnswer && (
                <Button
                    variant="contained"
                    onClick={() =>
                        answer !== undefined && handleOnSubmitAnswer && handleOnSubmitAnswer(answer)
                    }
                    disabled={answer === undefined}
                >
                    Répondre
                </Button>
            )}
        </div>
    );
};

export default MultipleChoiceQuestion;
