import { GIFTQuestion } from 'gift-pegjs';
import React, { useEffect, useState } from 'react';
import QuestionComponent from '../../../components/Questions/Question';

interface TeacherModeQuizProps {
    question: GIFTQuestion;
    submitAnswer: (answer: string | number | boolean, idQuestion: string) => void;
}

const TeacherModeQuiz: React.FC<TeacherModeQuizProps> = ({ question, submitAnswer }) => {
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
        <div>
            {isAnswerSubmitted ? (
                <div>En attente pour la prochaine question... </div>
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
