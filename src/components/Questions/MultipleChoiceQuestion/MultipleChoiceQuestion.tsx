// MultipleChoiceQuestion.tsx
import React, { useState } from 'react';
import SubmitButton from '../../SubmitButton/SubmitButton';
import '../questionStyle.css';

type Choices = {
    feedback: { format: string; text: string } | null;
    isCorrect: boolean;
    text: { format: string; text: string };
    weigth?: number;
};

interface Props {
    questionTitle: string;
    choices: Choices[];
    handleOnSubmitAnswer: (answer: string) => void;
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
            <div className="title">{questionTitle}</div>
            {choices.map((choice, i) => {
                const selected = answer === choice.text.text ? 'selected' : '';
                return (
                    <div key={choice.text.text + i} className="choices-container">
                        <button
                            className="button-wrapper"
                            onClick={() => handleOnClickAnswer(choice.text.text)}
                            disabled={showAnswer}
                        >
                            {showAnswer && (choice.isCorrect ? '✅' : '❌')}
                            <div className={`circle ${selected}`}>{alphabet[i]}</div>
                            <div className={`answer-text ${selected}`}>{choice.text.text}</div>
                        </button>
                    </div>
                );
            })}
            <SubmitButton
                hide={showAnswer}
                onClick={() => answer !== undefined && handleOnSubmitAnswer(answer)}
                disabled={answer === undefined}
            />
        </div>
    );
};

export default MultipleChoiceQuestion;
