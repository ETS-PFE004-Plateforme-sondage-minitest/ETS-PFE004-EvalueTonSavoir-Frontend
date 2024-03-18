import React, { useEffect, useState } from 'react';

import { Socket } from 'socket.io-client';
import { ENV_VARIABLES } from '../../../constants';

import StudentModeQuiz from '../../../components/StudentModeQuiz/StudentModeQuiz';
import TeacherModeQuiz from '../../../components/TeacherModeQuiz/TeacherModeQuiz';
import webSocketService from '../../../services/WebsocketService';
import DisconnectButton from '../../../components/DisconnectButton/DisconnectButton';

import './joinRoom.css';
import { QuestionType } from '../../../Types/QuestionType';
import { TextField } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import LoginContainer from '../../../components/LoginContainer/LoginContainer'

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
            console.log("NEXT MODE!")
            setQuizMode('teacher');
            setIsWaitingForTeacher(false);
            setQuestion(question);
        });
        socket.on('launch-student-mode', (questions: QuestionType[]) => {
            console.log("STODENT MODE!")
            setQuizMode('student');
            setIsWaitingForTeacher(false);
            setQuestions(questions);
            setQuestion(questions[0]);
        });
        socket.on('end-quiz', () => {
            console.log("END!")
            disconnect();
        });
        socket.on('join-failure', (message) => {
            console.log("BIG FAIL!")
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
            <div className='room'>
                <div className='roomHeader'>

                    <DisconnectButton
                        onReturn={disconnect}
                        message={`Êtes-vous sûr de vouloir quitter?`} />

                    <div className='centerTitle'>
                        <div className='title'>Salle: {roomName}</div>
                        <div className='userCount subtitle'>
                            En attente que le professeur lance le questionnaire...
                        </div>
                    </div>

                    <div className='dumb'></div>

                </div>
            </div>
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
                <LoginContainer
                    title='Rejoindre une salle'
                    error={connectionError}>

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
                    >Rejoindre</LoadingButton>

                </LoginContainer>
            );
    }
};

export default JoinRoom;
