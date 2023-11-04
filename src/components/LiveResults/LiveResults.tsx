import React, { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import './results.css';
import { GIFTQuestion } from 'gift-pegjs';

interface LiveResultsProps {
    socket: Socket | null;
    questions: GIFTQuestion[];
}

interface Answer {
    answer: string | number | boolean;
    idQuestion: number;
}

interface StudentResult {
    username: string;
    answers: Answer[];
}

const LiveResults: React.FC<LiveResultsProps> = ({ socket, questions }) => {
    const [hideUsernames, setHideUsernames] = useState<boolean>(false);
    const [ShowCorrectAnswers, setShowCorrectAnswers] = useState<boolean>(false);
    const [studentResults, setStudentResults] = useState<StudentResult[]>([]);

    useEffect(() => {
        if (socket) {
            socket.on('submit-answer', ({ username, answer, idQuestion }) => {
                const userIndex = studentResults.findIndex(
                    (result) => result.username === username
                );
                if (userIndex !== -1) {
                    const newStudentResults = [...studentResults];
                    newStudentResults[userIndex].answers.push({ answer: answer, idQuestion });
                    setStudentResults(newStudentResults);
                } else {
                    const newStudentResults = [
                        ...studentResults,
                        { username, answers: [{ answer, idQuestion }] }
                    ];
                    setStudentResults(newStudentResults);
                }
            });
            return () => {
                socket.off('submit-answer');
            };
        }
    }, [socket, studentResults]);

    const maxQuestions = questions.length;

    return (
        <div>
            <h2>Résultats du quiz</h2>
            <label>
                Cacher les noms d'utilisateurs:
                <input
                    type="checkbox"
                    checked={hideUsernames}
                    onChange={() => setHideUsernames((prev) => !prev)}
                />
            </label>
            <label>
                Montrer les réponses correctes:
                <input
                    type="checkbox"
                    checked={ShowCorrectAnswers}
                    onChange={() => setShowCorrectAnswers((prev) => !prev)}
                />
            </label>
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
                                const questionId = index + 1;
                                const answerObj = student.answers.find(
                                    (ans) => parseInt(ans.idQuestion.toString()) === index + 1
                                );
                                let answerText = '';
                                let isCorrect = false;

                                if (answerObj) {
                                    answerText = answerObj.answer.toString();
                                    const question = questions.find(
                                        (q) => parseInt(q.id ? q.id : '') === questionId
                                    );
                                    if (question) {
                                        if (question.type === 'TF') {
                                            isCorrect =
                                                (question.isTrue && answerText === 'true') ||
                                                (!question.isTrue && answerText === 'false');
                                        } else if (question.type === 'MC') {
                                            isCorrect = question.choices.some(
                                                (choice) =>
                                                    choice.isCorrect &&
                                                    choice.text.text === answerText
                                            );
                                        }
                                    }
                                }
                                if (ShowCorrectAnswers) {
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
                                            {answerText}
                                        </td>
                                    );
                                } else if (!ShowCorrectAnswers) {
                                    return <td key={index}>{answerText}</td>;
                                }
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default LiveResults;
