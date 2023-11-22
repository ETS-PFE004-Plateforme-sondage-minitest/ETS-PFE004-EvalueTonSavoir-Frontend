// TeacherModeQuiz.tsx
import React, { useEffect, useState } from 'react';

import QuestionComponent from '../../../components/Questions/Question';

import '../styles.css';
import { QuestionType } from '../../../Types/QuestionType';

interface TeacherModeQuizProps {
    questionInfos: QuestionType;
    submitAnswer: (answer: string | number | boolean, idQuestion: string) => void;
    disconnectWebSocket: () => void;
}

const TeacherModeQuiz: React.FC<TeacherModeQuizProps> = ({
    questionInfos,
    submitAnswer,
    disconnectWebSocket
}) => {
    const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        setIsAnswerSubmitted(false);
        setImageUrl(getImageSource(questionInfos.image));
    }, [questionInfos]);

    const handleOnSubmitAnswer = (answer: string | number | boolean) => {
        const idQuestion = questionInfos.question.id || '-1';
        submitAnswer(answer, idQuestion);
        setIsAnswerSubmitted(true);
    };

    const getImageSource = (text: string): string => {
        const regex = /src="([^"]*)"/;
        const match = regex.exec(text);
        if (match) {
            return match[1];
        }
        return '';
    };

    return (
        <div className="question-component-container">
            <h2 className="page-title">Question {questionInfos.question.id}</h2>
            <button className="quit-btn" onClick={disconnectWebSocket}>
                Déconnexion
            </button>
            {isAnswerSubmitted ? (
                <div className="wait-text">En attente pour la prochaine question... </div>
            ) : (
                <>
                    {imageUrl ? (
                        <img src={imageUrl} alt="QuestionImage" style={{ width: '20vw' }} />
                    ) : null}
                    <QuestionComponent
                        handleOnSubmitAnswer={handleOnSubmitAnswer}
                        question={questionInfos.question}
                    />
                </>
            )}
        </div>
    );
};

export default TeacherModeQuiz;
