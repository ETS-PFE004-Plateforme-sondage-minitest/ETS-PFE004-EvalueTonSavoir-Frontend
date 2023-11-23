// StudentModeQuiz.tsx
import React, { useEffect, useState } from 'react';
import QuestionComponent from '../Questions/Question';

import '../../pages/Student/JoinRoom.css';
import { QuestionType } from '../../Types/QuestionType';
import { QuestionService } from '../../services/QuestionService';

interface StudentModeQuizProps {
    questions: QuestionType[];
    submitAnswer: (answer: string | number | boolean, idQuestion: string) => void;
    disconnectWebSocket: () => void;
}

const StudentModeQuiz: React.FC<StudentModeQuizProps> = ({
    questions,
    submitAnswer,
    disconnectWebSocket
}) => {
    const [questionInfos, setQuestion] = useState<QuestionType>(questions[0]);
    const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

    // TODO
    // const previousQuestion = () => {
    //     setQuestion(questions[Number(question?.id) - 2]);
    // };

    useEffect(() => {
        setImageUrl(QuestionService.getImageSource(questionInfos.image));
    }, [questionInfos]);

    const nextQuestion = () => {
        setQuestion(questions[Number(questionInfos.question?.id)]);
        setIsAnswerSubmitted(false);
    };

    const handleOnSubmitAnswer = (answer: string | number | boolean) => {
        const idQuestion = questionInfos.question.id || '-1';
        submitAnswer(answer, idQuestion);
        setIsAnswerSubmitted(true);
    };

    return (
        <div className="question-component-container">
            <h2 className="page-title">Question {questionInfos.question.id}</h2>
            <button className="quit-btn" onClick={disconnectWebSocket}>
                Déconnexion
            </button>
            {imageUrl ? <img src={imageUrl} alt="QuestionImage" style={{ width: '20vw' }} /> : null}
            <QuestionComponent
                handleOnSubmitAnswer={handleOnSubmitAnswer}
                question={questionInfos.question}
                showAnswer={isAnswerSubmitted}
            />
            {/* TODO {Number(question.id) > 1 && (
                <button onClick={previousQuestion}>Question précédente</button>
            )} */}
            {Number(questionInfos.question.id) < questions.length && isAnswerSubmitted && (
                <button onClick={nextQuestion}>Question suivante</button>
            )}
        </div>
    );
};

export default StudentModeQuiz;
