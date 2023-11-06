import { GIFTQuestion, parse } from 'gift-pegjs';
import React, { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import webSocketService from '../../../services/WebsocketService';
import StudentModeQuiz from '../StudentModeQuiz/StudentModeQuiz';
import TeacherModeQuiz from '../TeacherModeQuiz/TeacherModeQuiz';

const JoinRoom: React.FC = () => {
    const [roomName, setRoomName] = useState('');
    const [username, setUsername] = useState('');
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [question, setQuestion] = useState<GIFTQuestion>();
    const [quizMode, setQuizMode] = useState<string>();
    const [parsedQuestions, setParsedQuestions] = useState<Array<GIFTQuestion>>([]);

    useEffect(() => {
        const socket = webSocketService.connect();
        socket.on('join-success', () => {
            setIsLoading(true);
            console.log('Successfully joined the room.');
        });
        socket.on('next-question', (question: GIFTQuestion) => {
            setQuizMode('teacher');
            setIsLoading(false);
            setQuestion(question);
        });
        socket.on('launch-student-mode', (questions: Array<string>) => {
            setQuizMode('student');
            setIsLoading(false);
            const parsedQuestions = [] as GIFTQuestion[];
            questions.forEach((question, index) => {
                parsedQuestions.push(parse(question)[0]);
                parsedQuestions[index].id = (index + 1).toString();
            });
            if (parsedQuestions.length === 0) return;

            setParsedQuestions(parsedQuestions);
            setQuestion(parsedQuestions[0]);
        });
        socket.on('end-quiz', () => {
            console.log('end-quiz.');
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
            const socket = webSocketService.connect();
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
        return <div>En attente que le professeur lance le questionnaire...</div>;
    }

    switch (quizMode) {
        case 'student':
            return (
                <StudentModeQuiz questions={parsedQuestions} submitAnswer={handleOnSubmitAnswer} />
            );
        case 'teacher':
            return (
                question && (
                    <TeacherModeQuiz question={question} submitAnswer={handleOnSubmitAnswer} />
                )
            );
        default:
            return (
                <div>
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter username"
                    />

                    <input
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value.toUpperCase())}
                        placeholder="Enter room name"
                    />
                    <button onClick={handleSocket}>Join</button>
                </div>
            );
    }
};

export default JoinRoom;
