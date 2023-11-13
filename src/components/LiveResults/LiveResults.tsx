// LiveResults.tsx
import React, { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { GIFTQuestion } from 'gift-pegjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';

import './results.css';

interface LiveResultsProps {
    socket: Socket | null;
    questions: GIFTQuestion[];
}

interface Answer {
    answer: string | number | boolean;
    isCorrect: boolean;
    idQuestion: number;
}

interface StudentResult {
    username: string;
    answers: Answer[];
}

const LiveResults: React.FC<LiveResultsProps> = ({ socket, questions }) => {
    const [hideUsernames, setHideUsernames] = useState<boolean>(true);
    const [ShowCorrectAnswers, setShowCorrectAnswers] = useState<boolean>(false);
    const [studentResults, setStudentResults] = useState<StudentResult[]>([]);

    const maxQuestions = questions.length;

    useEffect(() => {
        if (socket) {
            socket.on('submit-answer', ({ username, answer, idQuestion }) => {
                const userIndex = studentResults.findIndex(
                    (result) => result.username === username
                );
                const isCorrect = checkIfIsCorrect(answer, idQuestion);
                if (userIndex !== -1) {
                    const newStudentResults = [...studentResults];
                    newStudentResults[userIndex].answers.push({
                        answer: answer,
                        isCorrect,
                        idQuestion
                    });
                    setStudentResults(newStudentResults);
                } else {
                    const newStudentResults = [
                        ...studentResults,
                        { username, answers: [{ answer, isCorrect, idQuestion }] }
                    ];
                    setStudentResults(newStudentResults);
                }
            });
            return () => {
                socket.off('submit-answer');
            };
        }
    }, [socket, studentResults]);

    function checkIfIsCorrect(answer: string | number | boolean, idQuestion: number): boolean {
        const question = questions.find((q) => (q.id ? q.id === idQuestion.toString() : false));
        const answerText = answer.toString();
        if (question) {
            if (question.type === 'TF') {
                return (
                    (question.isTrue && answerText == 'true') ||
                    (!question.isTrue && answerText == 'false')
                );
            } else if (question.type === 'MC') {
                return question.choices.some(
                    (choice) => choice.isCorrect && choice.text.text === answerText
                );
            } else if (question.type === 'Numerical') {
                if (question.choices && !Array.isArray(question.choices)) {
                    if (
                        question.choices.type === 'high-low' &&
                        question.choices.numberHigh &&
                        question.choices.numberLow
                    ) {
                        const answerNumber = parseFloat(answerText);
                        if (!isNaN(answerNumber)) {
                            return (
                                answerNumber <= question.choices.numberHigh &&
                                answerNumber >= question.choices.numberLow
                            );
                        }
                    }
                    if (question.choices.type === 'simple' && question.choices.number) {
                        const answerNumber = parseFloat(answerText);
                        if (!isNaN(answerNumber)) {
                            return answerNumber === question.choices.number;
                        }
                    }
                    //TODO add support for type range ?
                }
            } else if (question.type === 'Short') {
                return question.choices.some(
                    (choice) => choice.text.text.toUpperCase() === answerText.toUpperCase()
                );
            }
        }
        return false;
    }

    return (
        <div>
            <h4 className="present-results-title ">Résultats du quiz</h4>
            <div className="live-result-control-container">
                <label className="live-result-control">
                    Cacher les noms d'utilisateurs:
                    <input
                        type="checkbox"
                        checked={hideUsernames}
                        onChange={() => setHideUsernames((prev) => !prev)}
                    />
                </label>
                <label className="live-result-control">
                    Montrer les réponses correctes:
                    <input
                        type="checkbox"
                        checked={ShowCorrectAnswers}
                        onChange={() => setShowCorrectAnswers((prev) => !prev)}
                    />
                </label>
            </div>
            <table className="table-bordered">
                <thead>
                    <tr>
                        <th>Nom d'utilisateur</th>
                        {Array.from({ length: maxQuestions }, (_, index) => (
                            <th key={index}>{`Q${index + 1}`}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {studentResults.map((student) => (
                        <tr key={student.username}>
                            <td>{hideUsernames ? '******' : student.username}</td>
                            {Array.from({ length: maxQuestions }, (_, index) => {
                                const answer = student.answers.find(
                                    (answer) => parseInt(answer.idQuestion.toString()) === index + 1
                                );
                                const answerText = answer ? answer.answer.toString() : '';
                                const isCorrect = answer ? answer.isCorrect : false;
                                return (
                                    <td
                                        key={index}
                                        className={
                                            answerText === ''
                                                ? ''
                                                : isCorrect
                                                ? 'correct-answer'
                                                : 'incorrect-answer'
                                        }
                                    >
                                        {ShowCorrectAnswers ? (
                                            answerText
                                        ) : isCorrect ? (
                                            <FontAwesomeIcon icon={faCheck} />
                                        ) : (
                                            answerText !== '' && (
                                                <FontAwesomeIcon icon={faCircleXmark} />
                                            )
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr className="grayed-table-row">
                        <th>% réussite</th>
                        {Array.from({ length: maxQuestions }, (_, index) => (
                            <th key={index}>
                                {studentResults.length > 0
                                    ? (
                                          (studentResults.filter((student) =>
                                              student.answers.some(
                                                  (answer) =>
                                                      parseInt(answer.idQuestion.toString()) ===
                                                          index + 1 && answer.isCorrect
                                              )
                                          ).length /
                                              studentResults.length) *
                                          100
                                      ).toFixed(0)
                                    : 0}
                                %
                            </th>
                        ))}
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};

export default LiveResults;
