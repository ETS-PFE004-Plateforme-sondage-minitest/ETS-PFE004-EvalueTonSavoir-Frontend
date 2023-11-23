// LiveResults.tsx
import React, { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { GIFTQuestion } from 'gift-pegjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { QuestionType } from '../../Types/QuestionType';

import './LiveResult.css';
import {
    FormControlLabel,
    FormGroup,
    Paper,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableRow
} from '@mui/material';

interface LiveResultsProps {
    socket: Socket | null;
    questions: QuestionType[];
    showSelectedQuestion: (index: number) => void;
}

interface Answer {
    answer: string | number | boolean;
    isCorrect: boolean;
    idQuestion: number;
}

interface StudentResult {
    username: string;
    idUser: string;
    answers: Answer[];
}

const LiveResults: React.FC<LiveResultsProps> = ({ socket, questions, showSelectedQuestion }) => {
    const [showUsernames, setShowUsernames] = useState<boolean>(false);
    const [showCorrectAnswers, setShowCorrectAnswers] = useState<boolean>(false);
    const [studentResults, setStudentResults] = useState<StudentResult[]>([]);

    const maxQuestions = questions.length;

    useEffect(() => {
        if (socket) {
            const submitAnswerHandler = ({
                idUser,
                username,
                answer,
                idQuestion
            }: {
                idUser: string;
                username: string;
                answer: string | number | boolean;
                idQuestion: number;
            }) => {
                setStudentResults((currentResults) => {
                    const userIndex = currentResults.findIndex(
                        (result) => result.idUser === idUser
                    );
                    const isCorrect = checkIfIsCorrect(answer, idQuestion);
                    if (userIndex !== -1) {
                        const newResults = [...currentResults];
                        newResults[userIndex].answers.push({ answer, isCorrect, idQuestion });
                        return newResults;
                    } else {
                        return [
                            ...currentResults,
                            { idUser, username, answers: [{ answer, isCorrect, idQuestion }] }
                        ];
                    }
                });
            };

            socket.on('submit-answer', submitAnswerHandler);
            return () => {
                socket.off('submit-answer');
            };
        }
    }, [socket]);

    function checkIfIsCorrect(answer: string | number | boolean, idQuestion: number): boolean {
        const questionInfo = questions.find((q) =>
            q.question.id ? q.question.id === idQuestion.toString() : false
        ) as QuestionType | undefined;

        const answerText = answer.toString();
        if (questionInfo) {
            const question = questionInfo.question as GIFTQuestion;
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
            <div className="action-bar">
                <div className="text-lg text-bold">Résultats du quiz</div>
                <FormGroup row>
                    <FormControlLabel
                        label="Afficher les noms"
                        control={
                            <Switch
                                value={showUsernames}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setShowUsernames(e.target.checked)
                                }
                            />
                        }
                    />
                    <FormControlLabel
                        label="Afficher les réponses"
                        control={
                            <Switch
                                value={showCorrectAnswers}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setShowCorrectAnswers(e.target.checked)
                                }
                            />
                        }
                    />
                </FormGroup>
            </div>

            <Table size="small" stickyHeader component={Paper}>
                <TableHead>
                    <TableRow>
                        <TableCell>Nom d'utilisateur</TableCell>
                        {Array.from({ length: maxQuestions }, (_, index) => (
                            <TableCell
                                key={index}
                                sx={{ textAlign: 'center' }}
                                onClick={() => showSelectedQuestion(index)}
                            >{`Q${index + 1}`}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {studentResults.map((student) => (
                        <TableRow key={student.idUser}>
                            <TableCell>{showUsernames ? student.username : '******'}</TableCell>
                            {Array.from({ length: maxQuestions }, (_, index) => {
                                const answer = student.answers.find(
                                    (answer) => parseInt(answer.idQuestion.toString()) === index + 1
                                );
                                const answerText = answer ? answer.answer.toString() : '';
                                const isCorrect = answer ? answer.isCorrect : false;
                                return (
                                    <TableCell
                                        key={index}
                                        className={
                                            answerText === ''
                                                ? ''
                                                : isCorrect
                                                ? 'correct-answer'
                                                : 'incorrect-answer'
                                        }
                                    >
                                        {showCorrectAnswers ? (
                                            answerText
                                        ) : isCorrect ? (
                                            <FontAwesomeIcon icon={faCheck} />
                                        ) : (
                                            answerText !== '' && (
                                                <FontAwesomeIcon icon={faCircleXmark} />
                                            )
                                        )}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell>% réussite</TableCell>
                        {Array.from({ length: maxQuestions }, (_, index) => (
                            <TableCell key={index} sx={{ textAlign: 'center' }}>
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
                            </TableCell>
                        ))}
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    );
};

export default LiveResults;
