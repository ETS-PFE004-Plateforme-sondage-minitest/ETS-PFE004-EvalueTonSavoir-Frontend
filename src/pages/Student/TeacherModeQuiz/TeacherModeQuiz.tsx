// TeacherModeQuiz.tsx
import React, { useEffect, useState } from 'react';
import { GIFTQuestion } from 'gift-pegjs';

import QuestionComponent from '../../../components/Questions/Question';

import '../styles.css';

interface TeacherModeQuizProps {
    question: GIFTQuestion;
    submitAnswer: (answer: string | number | boolean, idQuestion: string) => void;
    disconnectWebSocket: () => void;
}

const TeacherModeQuiz: React.FC<TeacherModeQuizProps> = ({
    question,
    submitAnswer,
    disconnectWebSocket
}) => {
    const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);

    useEffect(() => {
        setIsAnswerSubmitted(false);
    }, [question]);

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
            {isAnswerSubmitted ? (
                <div className="wait-text">En attente pour la prochaine question... </div>
            ) : (
                <QuestionComponent
                    handleOnSubmitAnswer={handleOnSubmitAnswer}
                    question={question}
                />
            )}
        </div>
    );
};

export default TeacherModeQuiz;
