// LiveResults.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { Socket } from 'socket.io-client';
import { GIFTQuestion } from 'gift-pegjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { QuestionType } from '../../Types/QuestionType';

import './liveResult.css';
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
import Latex from 'react-latex';
import { UserType } from '../../Types/UserType';

interface LiveResultsProps {
    socket: Socket | null;
    questions: QuestionType[];
    showSelectedQuestion: (index: number) => void;
    quizMode: 'teacher' | 'student';
    students: UserType[]
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

const LiveResults: React.FC<LiveResultsProps> = ({ socket, questions, showSelectedQuestion, students }) => {
    const [showUsernames, setShowUsernames] = useState<boolean>(false);
    const [showCorrectAnswers, setShowCorrectAnswers] = useState<boolean>(false);
    const [studentResults, setStudentResults] = useState<StudentResult[]>([]);

    const maxQuestions = questions.length;

    useEffect(() => {
        // Set student list before starting
        let newStudents:StudentResult[] = [];

        for (const student of students as UserType[]) {
            newStudents.push( { username: student.name, idUser: student.id, answers: [] } )
        }

        setStudentResults(newStudents);
        
    }, [])

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

    const getStudentGrade = (student: StudentResult): number => {
        if (student.answers.length === 0) {
            return 0;
        }

        const uniqueQuestions = new Set();
        let correctAnswers = 0;

        for (const answer of student.answers) {
            const { idQuestion, isCorrect } = answer;

            if (!uniqueQuestions.has(idQuestion)) {
                uniqueQuestions.add(idQuestion);

                if (isCorrect) {
                    correctAnswers++;
                }
            }
        }

        return (correctAnswers / questions.length) * 100;
    };

    const classAverage: number = useMemo(() => {
        let classTotal = 0;
        studentResults.forEach((student) => {
            classTotal += getStudentGrade(student);
        });

        return classTotal / studentResults.length;
    }, [studentResults]);

    const getCorrectAnswersPerQuestion = (index: number): number => {
        return (
            (studentResults.filter((student) =>
                student.answers.some(
                    (answer) =>
                        parseInt(answer.idQuestion.toString()) === index + 1 && answer.isCorrect
                )
            ).length /
                studentResults.length) *
            100
        );
    };

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
                }
                if (question.choices && Array.isArray(question.choices)) {
                    if (
                        question.choices[0].text.type === 'range' &&
                        question.choices[0].text.number &&
                        question.choices[0].text.range
                    ) {
                        const answerNumber = parseFloat(answerText);
                        const range = question.choices[0].text.range;
                        const correctAnswer = question.choices[0].text.number;
                        if (!isNaN(answerNumber)) {
                            return (
                                answerNumber <= correctAnswer + range &&
                                answerNumber >= correctAnswer - range
                            );
                        }
                    }
                    if (
                        question.choices[0].text.type === 'simple' &&
                        question.choices[0].text.number
                    ) {
                        const answerNumber = parseFloat(answerText);
                        if (!isNaN(answerNumber)) {
                            return answerNumber === question.choices[0].text.number;
                        }
                    }
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
            <div className="action-bar mb-1">
                <div className="text-2xl text-bold">Résultats du quiz</div>
                <FormGroup row>
                    <FormControlLabel
                        label={<div className="text-sm">Afficher les noms</div>}
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
                        label={<div className="text-sm">Afficher les réponses</div>}
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
                        <TableCell
                            sx={{
                                borderStyle: 'solid',
                                borderWidth: 1,
                                borderColor: 'rgba(224, 224, 224, 1)'
                            }}
                        >
                            <div className="text-base text-bold">Nom d'utilisateur</div>
                        </TableCell>
                        {Array.from({ length: maxQuestions }, (_, index) => (
                            <TableCell
                                key={index}
                                sx={{
                                    textAlign: 'center',
                                    cursor: `pointer`,
                                    borderStyle: 'solid',
                                    borderWidth: 1,
                                    borderColor: 'rgba(224, 224, 224, 1)'
                                }}
                                onClick={() => showSelectedQuestion(index)}
                            >
                                <div className="text-base text-bold blue">{`Q${index + 1}`}</div>
                            </TableCell>
                        ))}
                        <TableCell
                            sx={{
                                textAlign: 'center',
                                borderStyle: 'solid',
                                borderWidth: 1,
                                borderColor: 'rgba(224, 224, 224, 1)'
                            }}
                        >
                            <div className="text-base text-bold">% réussite</div>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {studentResults.map((student) => (
                        <TableRow key={student.idUser}>
                            <TableCell
                                sx={{
                                    borderStyle: 'solid',
                                    borderWidth: 1,
                                    borderColor: 'rgba(224, 224, 224, 1)'
                                }}
                            >
                                <div className="text-base">
                                    {showUsernames ? student.username : '******'}
                                </div>
                            </TableCell>
                            {Array.from({ length: maxQuestions }, (_, index) => {
                                const answer = student.answers.find(
                                    (answer) => parseInt(answer.idQuestion.toString()) === index + 1
                                );
                                const answerText = answer ? answer.answer.toString() : '';
                                const isCorrect = answer ? answer.isCorrect : false;
                                return (
                                    <TableCell
                                        key={index}
                                        sx={{
                                            textAlign: 'center',
                                            borderStyle: 'solid',
                                            borderWidth: 1,
                                            borderColor: 'rgba(224, 224, 224, 1)'
                                        }}
                                        className={
                                            answerText === ''
                                                ? ''
                                                : isCorrect
                                                ? 'correct-answer'
                                                : 'incorrect-answer'
                                        }
                                    >
                                        {showCorrectAnswers ? (
                                            <Latex>{answerText}</Latex>
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
                            <TableCell
                                sx={{
                                    textAlign: 'center',
                                    borderStyle: 'solid',
                                    borderWidth: 1,
                                    borderColor: 'rgba(224, 224, 224, 1)',
                                    fontWeight: 'bold',
                                    color: 'rgba(0, 0, 0)'
                                }}
                            >
                                {getStudentGrade(student).toFixed()} %
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow sx={{ backgroundColor: '#d3d3d34f' }}>
                        <TableCell sx={{ color: 'black' }}>
                            <div className="text-base text-bold">% réussite</div>
                        </TableCell>
                        {Array.from({ length: maxQuestions }, (_, index) => (
                            <TableCell
                                key={index}
                                sx={{
                                    textAlign: 'center',
                                    borderStyle: 'solid',
                                    borderWidth: 1,
                                    borderColor: 'rgba(224, 224, 224, 1)',
                                    fontWeight: 'bold',
                                    color: 'rgba(0, 0, 0)'
                                }}
                            >
                                {studentResults.length > 0
                                    ? `${getCorrectAnswersPerQuestion(index).toFixed()} %`
                                    : '-'}
                            </TableCell>
                        ))}
                        <TableCell
                            sx={{
                                textAlign: 'center',
                                borderStyle: 'solid',
                                borderWidth: 1,
                                borderColor: 'rgba(224, 224, 224, 1)',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                color: 'rgba(0, 0, 0)'
                            }}
                        >
                            {studentResults.length > 0 ? `${classAverage.toFixed()} %` : '-'}
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    );
};

export default LiveResults;
