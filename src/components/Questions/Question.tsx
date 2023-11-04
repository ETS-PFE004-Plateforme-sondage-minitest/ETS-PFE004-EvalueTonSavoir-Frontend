import { GIFTQuestion } from 'gift-pegjs';
import { Socket } from 'socket.io-client';

import TrueFalseQuestion from './TrueFalseQuestion';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import NumericalQuestion from './NumericalQuestion';
import ShortAnswerQuestion from './ShortAnswerQuestion';
import React, { useEffect, useState } from 'react';

interface QuestionsProps {
    socket: Socket | null;
    question: GIFTQuestion;
    roomName: string;
    username: string;
}
const Questions: React.FC<QuestionsProps> = ({ socket, question, roomName, username }) => {
    const [answersIsSubmitted, setAnswersIsSubmitted] = useState(false);

    const handleOnSubmitAnswer = (answer: string | number | boolean) => {
        console.log(`Sending answer to teacher server: ${answer}`);
        socket?.emit('submit-answer', {
            answer: answer,
            roomName: roomName,
            username: username,
            idQuestion: question.id
        });
        setAnswersIsSubmitted(true);
    };

    useEffect(() => {
        setAnswersIsSubmitted(false);
    }, [question]);

    let renderedQuestion;

    switch (question.type) {
        case 'TF':
            renderedQuestion = (
                <TrueFalseQuestion
                    questionTitle={question.stem.text}
                    correctAnswer={question.isTrue}
                    handleOnSubmitAnswer={handleOnSubmitAnswer}
                />
            );
            break;
        case 'MC':
            renderedQuestion = (
                <MultipleChoiceQuestion
                    questionTitle={question.stem.text}
                    choices={question.choices}
                    handleOnSubmitAnswer={handleOnSubmitAnswer}
                />
            );
            break;
        case 'Numerical':
            if (question.choices && !Array.isArray(question.choices)) {
                renderedQuestion = (
                    <NumericalQuestion
                        questionTitle={question.stem.text}
                        correctAnswers={question.choices}
                        handleOnSubmitAnswer={handleOnSubmitAnswer}
                    />
                );
            }
            break;
        case 'Short':
            renderedQuestion = (
                <ShortAnswerQuestion
                    questionTitle={question.stem.text}
                    choices={question.choices}
                    handleOnSubmitAnswer={handleOnSubmitAnswer}
                />
            );
            break;
        default:
            renderedQuestion = <div>Unknown question type</div>;
    }

    return (
        <div>
            {answersIsSubmitted ? <div>waiting for the next question...</div> : renderedQuestion}
        </div>
    );
};

export default Questions;
