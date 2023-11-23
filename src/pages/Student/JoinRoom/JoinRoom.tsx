// JoinRoom.tsx
import React, { useEffect, useState } from 'react';
import { parse } from 'gift-pegjs';
import { Socket } from 'socket.io-client';
import { ENV_VARIABLES } from '../../../constants';

import StudentModeQuiz from '../StudentModeQuiz/StudentModeQuiz';
import TeacherModeQuiz from '../TeacherModeQuiz/TeacherModeQuiz';
import webSocketService from '../../../services/WebsocketService';

import './JoinRoom.css';
import { QuestionType } from '../../../Types/QuestionType';
import { QuestionService } from '../../../services/QuestionService';
import { Button, FormControl, FormControlLabel, Paper, TextField } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

const JoinRoom: React.FC = () => {
    const [roomName, setRoomName] = useState('');
    const [username, setUsername] = useState('');
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [question, setQuestion] = useState<QuestionType>();
    const [quizMode, setQuizMode] = useState<string>();
    const [parsedQuestions, setParsedQuestions] = useState<Array<QuestionType>>([]);
    const [connectionError, setConnectionError] = useState<string>('');
    const [isConnecting, setIsConnecting] = useState<boolean>(false);

    useEffect(() => {
        handleCreateSocket();
        return () => {
            webSocketService.disconnect();
        };
    }, []);

    const handleCreateSocket = () => {
        const socket = webSocketService.connect(ENV_VARIABLES.VITE_BACKEND_URL);
        socket.on('join-success', () => {
            setIsLoading(true);
            setIsConnecting(false);
            console.log('Successfully joined the room.');
        });
        socket.on('next-question', (question: QuestionType) => {
            setQuizMode('teacher');
            setIsLoading(false);
            setQuestion(question);
        });
        socket.on('launch-student-mode', (questions: Array<string>) => {
            setQuizMode('student');
            setIsLoading(false);
            const parsedQuestions = [] as QuestionType[];
            questions.forEach((question, index) => {
                const image = QuestionService.getImage(question);
                question = QuestionService.ignoreImgTags(question);

                parsedQuestions.push({ question: parse(question)[0], image: image });
                parsedQuestions[index].question.id = (index + 1).toString();
            });
            if (parsedQuestions.length === 0) return;

            setParsedQuestions(parsedQuestions);
            setQuestion(parsedQuestions[0]);
        });
        socket.on('end-quiz', () => {
            disconnect();
        });
        socket.on('join-failure', (message) => {
            console.log('Failed to join the room.');
            setConnectionError(`Erreure de connexion: ${message}`);
            setIsConnecting(false);
        });
        socket.on('connect_error', (error) => {
            console.log('error');
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
        setSocket(null);
        setQuestion(undefined);
        setIsLoading(false);
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
        socket?.emit('submit-answer', {
            answer: answer,
            roomName: roomName,
            username: username,
            idQuestion: idQuestion
        });
    };

    if (isLoading) {
        return (
            <div className="waiting-text">
                En attente que le professeur lance le questionnaire...
            </div>
        );
    }

    switch (quizMode) {
        case 'student':
            return (
                <StudentModeQuiz
                    questions={parsedQuestions}
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
                    <h1 className="title">Rejoindre une salle</h1>
                    <Paper>
                        <div className="login-container">
                            <img className="login-avatar" src="./people.svg" width={'30%'}></img>
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
                                label="Numéro de la salle"
                                variant="outlined"
                                value={roomName}
                                onChange={(e) => setRoomName(e.target.value.toUpperCase())}
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
