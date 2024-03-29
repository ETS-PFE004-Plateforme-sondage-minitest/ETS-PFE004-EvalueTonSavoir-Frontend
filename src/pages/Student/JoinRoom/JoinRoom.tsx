// JoinRoom.tsx
import React, { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { ENV_VARIABLES } from '../../../constants';

import StudentModeQuiz from '../../../components/StudentModeQuiz/StudentModeQuiz';
import TeacherModeQuiz from '../../../components/TeacherModeQuiz/TeacherModeQuiz';
import webSocketService from '../../../services/WebsocketService';

import './joinRoom.css';
import { QuestionType } from '../../../Types/QuestionType';
import { Button, Paper, TextField } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

const JoinRoom: React.FC = () => {
    const [roomName, setRoomName] = useState('');
    const [username, setUsername] = useState('');
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isWaitingForTeacher, setIsWaitingForTeacher] = useState(false);
    const [question, setQuestion] = useState<QuestionType>();
    const [quizMode, setQuizMode] = useState<string>();
    const [questions, setQuestions] = useState<QuestionType[]>([]);
    const [connectionError, setConnectionError] = useState<string>('');
    const [isConnecting, setIsConnecting] = useState<boolean>(false);

    useEffect(() => {
        handleCreateSocket();
        return () => {
            disconnect();
        };
    }, []);

    const handleCreateSocket = () => {
        const socket = webSocketService.connect(ENV_VARIABLES.VITE_BACKEND_URL);
        socket.on('join-success', () => {
            setIsWaitingForTeacher(true);
            setIsConnecting(false);
            console.log('Successfully joined the room.');
        });
        socket.on('next-question', (question: QuestionType) => {
            setQuizMode('teacher');
            setIsWaitingForTeacher(false);
            setQuestion(question);
        });
        socket.on('launch-student-mode', (questions: QuestionType[]) => {
            setQuizMode('student');
            setIsWaitingForTeacher(false);
            setQuestions(questions);
            setQuestion(questions[0]);
        });
        socket.on('end-quiz', () => {
            disconnect();
        });
        socket.on('join-failure', (message) => {
            console.log('Failed to join the room.');
            setConnectionError(`Erreur de connexion : ${message}`);
            setIsConnecting(false);
        });
        socket.on('connect_error', (error) => {
            switch (error.message) {
                case 'timeout':
                    setConnectionError("Le serveur n'est pas disponible");
                    break;
                case 'websocket error':
                    setConnectionError("Le serveur n'est pas disponible");
                    break;
            }
            setIsConnecting(false);
            console.log('Connection Error:', error.message);
        });
        setSocket(socket);
    };

    const disconnect = () => {
        webSocketService.disconnect();
        setSocket(null);
        setQuestion(undefined);
        setIsWaitingForTeacher(false);
        setQuizMode('');
        setRoomName('');
        setUsername('');
        setIsConnecting(false);
    };

    const handleSocket = () => {
        setIsConnecting(true);
        setConnectionError('');
        if (!socket?.connected) {
            handleCreateSocket();
        }

        if (username && roomName) {
            webSocketService.joinRoom(roomName, username);
        }
    };

    const handleOnSubmitAnswer = (answer: string | number | boolean, idQuestion: string) => {
        webSocketService.submitAnswer(roomName, answer, username, idQuestion);
    };

    if (isWaitingForTeacher) {
        return (
            <>
                <div className="quit-btn">
                    <Button variant="outlined" onClick={disconnect}>
                        Déconnexion
                    </Button>
                </div>
                <div className="waiting-text text-xl text-bold">
                    En attente que le professeur lance le questionnaire...
                </div>
            </>
        );
    }

    switch (quizMode) {
        case 'student':
            return (
                <StudentModeQuiz
                    questions={questions}
                    submitAnswer={handleOnSubmitAnswer}
                    disconnectWebSocket={disconnect}
                />
            );
        case 'teacher':
            return (
                question && (
                    <TeacherModeQuiz
                        questionInfos={question}
                        submitAnswer={handleOnSubmitAnswer}
                        disconnectWebSocket={disconnect}
                    />
                )
            );
        default:
            return (
                <div className="join-room-container">
                    <h1 className="page-title mb-1">Rejoindre une salle</h1>
                    <Paper>
                        <div className="login-container">
                            <img className="login-avatar" src="./people.svg" width={'20%'}></img>
                            <TextField
                                label="Nom d'utilisateur"
                                variant="outlined"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Nom d'utilisateur"
                                sx={{ marginBottom: '1rem' }}
                                fullWidth
                            />
                            <TextField
                                type="number"
                                label="Numéro de la salle"
                                variant="outlined"
                                value={roomName}
                                onChange={(e) => setRoomName(e.target.value)}
                                placeholder="Nom de la salle"
                                sx={{ marginBottom: '1rem' }}
                                fullWidth
                            />
                            <LoadingButton
                                loading={isConnecting}
                                onClick={handleSocket}
                                variant="contained"
                                sx={{ marginBottom: `${connectionError && '2rem'}` }}
                                disabled={!username || !roomName}
                            >
                                Rejoindre
                            </LoadingButton>
                            <div className="error-text text-base">{connectionError}</div>
                        </div>
                    </Paper>
                </div>
            );
    }
};

export default JoinRoom;
