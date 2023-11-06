import { GIFTQuestion } from 'gift-pegjs';
import React, { useState } from 'react';
import QuestionComponent from '../../../components/Questions/Question';

interface StudentModeQuizProps {
    questions: GIFTQuestion[];
    submitAnswer: (answer: string | number | boolean, idQuestion: string) => void;
}

const StudentModeQuiz: React.FC<StudentModeQuizProps> = ({ questions, submitAnswer }) => {
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
        <div>
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
