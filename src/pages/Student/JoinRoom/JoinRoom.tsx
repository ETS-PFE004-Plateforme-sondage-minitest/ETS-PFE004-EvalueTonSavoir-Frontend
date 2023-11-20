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

const JoinRoom: React.FC = () => {
    const [roomName, setRoomName] = useState('');
    const [username, setUsername] = useState('');
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [question, setQuestion] = useState<QuestionType>();
    const [quizMode, setQuizMode] = useState<string>();
    const [parsedQuestions, setParsedQuestions] = useState<Array<QuestionType>>([]);

    useEffect(() => {
        const socket = webSocketService.connect(ENV_VARIABLES.VITE_BACKEND_URL);
        socket.on('join-success', () => {
            setIsLoading(true);
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
        socket.on('join-failure', () => {
            console.log('Failed to join the room.');
        });
        socket.on('connect_error', (error) => {
            console.log('Connection Error:', error);
        });
        setSocket(socket);
        return () => {
            webSocketService.disconnect();
        };
    }, []);

    const disconnect = () => {
        setSocket(null);
        setQuestion(undefined);
        setIsLoading(false);
        setQuizMode('');
        setRoomName('');
        setUsername('');
    };

    const handleSocket = () => {
        if (!socket) {
            const socket = webSocketService.connect(ENV_VARIABLES.VITE_BACKEND_URL);
            setSocket(socket);
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
                    <h1 className="page-title">Rejoindre une salle</h1>
                    <div className="student-info-input-container">
                        <input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Nom d'utilisateur"
                            className="student-info-input"
                        />

                        <input
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value.toUpperCase())}
                            placeholder="Nom de la salle"
                            className="student-info-input"
                        />
                        <button className="join-btn" onClick={handleSocket}>
                            Join
                        </button>
                    </div>
                </div>
            );
    }
};

export default JoinRoom;
