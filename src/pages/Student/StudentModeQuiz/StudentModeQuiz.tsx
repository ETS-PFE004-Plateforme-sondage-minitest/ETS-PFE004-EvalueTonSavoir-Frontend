// StudentModeQuiz.tsx
import React, { useState } from 'react';
import { GIFTQuestion } from 'gift-pegjs';

import QuestionComponent from '../../../components/Questions/Question';

import '../styles.css';

interface StudentModeQuizProps {
    questions: GIFTQuestion[];
    submitAnswer: (answer: string | number | boolean, idQuestion: string) => void;
    disconnectWebSocket: () => void;
}

const StudentModeQuiz: React.FC<StudentModeQuizProps> = ({
    questions,
    submitAnswer,
    disconnectWebSocket
}) => {
    const [question, setQuestion] = useState<GIFTQuestion>(questions[0]);
    const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);

    // TODO
    // const previousQuestion = () => {
    //     setQuestion(questions[Number(question?.id) - 2]);
    // };

    const nextQuestion = () => {
        setQuestion(questions[Number(question?.id)]);
        setIsAnswerSubmitted(false);
    };

    const handleOnSubmitAnswer = (answer: string | number | boolean) => {
        const idQuestion = question.id || '-1';
        submitAnswer(answer, idQuestion);
        setIsAnswerSubmitted(true);
    };

    return (
        <div className="question-component-container">
            <h2 className="page-title">Question {question.id}</h2>
            <button className="quit-btn" onClick={disconnectWebSocket}>
                Déconnexion
            </button>
            <QuestionComponent
                handleOnSubmitAnswer={handleOnSubmitAnswer}
                question={question}
                showAnswer={isAnswerSubmitted}
            />
            {/* TODO {Number(question.id) > 1 && (
                <button onClick={previousQuestion}>Question précédente</button>
            )} */}
            {Number(question.id) < questions.length && isAnswerSubmitted && (
                <button onClick={nextQuestion}>Question suivante</button>
            )}
        </div>
    );
};

export default StudentModeQuiz;
