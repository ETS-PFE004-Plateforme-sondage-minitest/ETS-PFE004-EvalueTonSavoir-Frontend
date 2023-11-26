// TeacherModeQuiz.tsx
import React, { useEffect, useState } from 'react';

import QuestionComponent from '../Questions/Question';

import '../../pages/Student/JoinRoom/joinRoom.css';
import { QuestionType } from '../../Types/QuestionType';
import { QuestionService } from '../../services/QuestionService';
import { Button } from '@mui/material';

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
        setImageUrl(QuestionService.getImageSource(questionInfos.image));
        console.log(imageUrl);
    }, [questionInfos]);

    const handleOnSubmitAnswer = (answer: string | number | boolean) => {
        const idQuestion = questionInfos.question.id || '-1';
        submitAnswer(answer, idQuestion);
        setIsAnswerSubmitted(true);
    };

    return (
        <div className="question-component-container">
            <Button variant="outlined" className="quit-btn" onClick={disconnectWebSocket}>
                Déconnexion
            </Button>
            <div className="page-title mb-5">Question {questionInfos.question.id}</div>
            {isAnswerSubmitted ? (
                <div className="wait-text">En attente pour la prochaine question... </div>
            ) : (
                <QuestionComponent
                    imageUrl={imageUrl}
                    handleOnSubmitAnswer={handleOnSubmitAnswer}
                    question={questionInfos.question}
                />
            )}
        </div>
    );
};

export default TeacherModeQuiz;
