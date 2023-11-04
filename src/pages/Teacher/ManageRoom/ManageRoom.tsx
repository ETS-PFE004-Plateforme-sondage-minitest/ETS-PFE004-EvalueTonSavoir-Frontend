// ManageRoom.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import { QuizService } from '../../../services/QuizService';
import { QuizType } from '../../../Types/QuizType';
import { GIFTQuestion, parse } from 'gift-pegjs';
import LiveResultsComponent from '../../../components/LiveResults/LiveResults';
import PreviewComponent from '../../../components/EditorPreview/Preview';
import webSocketService from '../../../services/WebsocketService';

const ManageRoom: React.FC = () => {
    const [roomName, setRoomName] = useState<string>('');
    const [socket, setSocket] = useState<Socket | null>(null);
    const [users, setUsers] = useState<string[]>([]);
    const quizId = useParams<{ id: string }>();
    const [quizQuestions, setQuizQuestions] = useState<GIFTQuestion[] | undefined>();
    const [quiz, setQuiz] = useState<QuizType>();
    const [presentQuestion, setPresentQuestion] = useState<GIFTQuestion[]>();
    const [isLastQuestion, setIsLastQuestion] = useState<boolean>(false);

    useEffect(() => {
        setQuiz(QuizService.getQuizById(quizId.id));

        return () => {
            webSocketService.disconnect();
        };
    }, [quizId.id]);

    const disconnectWebSocket = () => {
        if (socket) {
            webSocketService.disconnect();
            setSocket(null);
            setPresentQuestion(undefined);
            setQuizQuestions(undefined);
            setIsLastQuestion(false);
            setUsers([]);
            setRoomName('');
            webSocketService.endQuiz(roomName);
        }
    };

    const createWebSocketRoom = () => {
        const socket = webSocketService.connect();
        socket.on('connect', () => {
            webSocketService.createRoom();
        });
        socket.on('create-success', (roomName: string) => {
            setRoomName(roomName);
        });
        socket.on('user-joined', (username: string) => {
            setUsers((prevUsers) => [...prevUsers, username]);
        });
        setSocket(socket);
    };

    const nextQuestion = () => {
        if (socket && roomName) {
            if (!quizQuestions) {
                const quizQuestionArray = quiz?.questions;
                if (!quizQuestionArray) return;

                const parsedQuestions = [] as GIFTQuestion[];
                quizQuestionArray.forEach((question, index) => {
                    parsedQuestions.push(parse(question)[0]);
                    parsedQuestions[index].id = (index + 1).toString();
                });
                if (parsedQuestions.length === 0) return;

                setQuizQuestions(parsedQuestions);
                setPresentQuestion([parsedQuestions[0]]);
                webSocketService.nextQuestion(roomName, parsedQuestions[0]);
            } else {
                if (!presentQuestion) return;
                const index = quizQuestions?.indexOf(presentQuestion[0] as GIFTQuestion);
                if (index !== undefined && quizQuestions) {
                    if (index < quizQuestions.length - 1) {
                        setPresentQuestion([quizQuestions[index + 1]]);
                        webSocketService.nextQuestion(roomName, quizQuestions[index + 1]);

                        if (index === quizQuestions.length - 2) {
                            setIsLastQuestion(true);
                        }
                    } else {
                        webSocketService.endQuiz(roomName);
                        disconnectWebSocket();
                    }
                }
            }
        }
    };

    return (
        <div>
            {quizQuestions ? (
                <div>
                    <PreviewComponent
                        questions={'none'}
                        showAnswers={false}
                        giftQuestions={presentQuestion}
                    ></PreviewComponent>
                    <LiveResultsComponent
                        socket={socket}
                        questions={quizQuestions}
                    ></LiveResultsComponent>
                    <button onClick={nextQuestion}>
                        {isLastQuestion ? 'End Quiz' : 'NextQuestion'}
                    </button>
                </div>
            ) : (
                <div>
                    {roomName ? (
                        <div>
                            <div>
                                <h2>Room name : {roomName}</h2>
                                <h2>Users:</h2>
                                {users.map((user) => (
                                    <span key={user}>{user} </span>
                                ))}
                            </div>
                            <div>
                                <button onClick={nextQuestion}>Launch Quiz</button>
                                <button onClick={disconnectWebSocket}>Quit</button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h1>Room name</h1>

                            <button onClick={createWebSocketRoom}>Create Room</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ManageRoom;
