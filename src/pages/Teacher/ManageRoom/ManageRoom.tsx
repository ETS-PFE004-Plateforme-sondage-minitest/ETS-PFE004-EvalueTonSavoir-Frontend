// ManageRoom.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import { QuizService } from '../../../services/QuizService';
import { QuizType } from '../../../Types/QuizType';
import { GIFTQuestion, parse } from 'gift-pegjs';
import LiveResultsComponent from '../../../components/LiveResults/LiveResults';
import webSocketService from '../../../services/WebsocketService';
import GIFTTemplatePreview from '../../../components/GiftTemplate/GIFTTemplatePreview';
import './ManageRoom.css';

const ManageRoom: React.FC = () => {
    const [roomName, setRoomName] = useState<string>('');
    const [socket, setSocket] = useState<Socket | null>(null);
    const [users, setUsers] = useState<string[]>([]);
    const quizId = useParams<{ id: string }>();
    const [quizQuestions, setQuizQuestions] = useState<GIFTQuestion[] | undefined>();
    const [quiz, setQuiz] = useState<QuizType>();
    const [isLastQuestion, setIsLastQuestion] = useState<boolean>(false);
    const [presentQuestionString, setPresentQuestionString] = useState<string[]>();
    const [quizMode, setQuizMode] = useState<'teacher' | 'student'>('teacher');
    const [loading, setLoading] = useState<boolean>(false);

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
            setPresentQuestionString(undefined);
            setQuizQuestions(undefined);
            setIsLastQuestion(false);
            setUsers([]);
            setRoomName('');
            webSocketService.endQuiz(roomName);
        }
    };

    const createWebSocketRoom = () => {
        setLoading(true);
        console.log('allo');
        const socket = webSocketService.connect();
        socket.on('connect', () => {
            webSocketService.createRoom();
        });
        socket.on('create-success', (roomName: string) => {
            setLoading(false);
            setRoomName(roomName);
        });
        socket.on('create-failure', () => {
            setLoading(false);
            console.log('Error creating room.');
        });
        socket.on('user-joined', (username: string) => {
            setUsers((prevUsers) => [...prevUsers, username]);
        });
        setSocket(socket);
    };

    const nextQuestion = () => {
        const quizQuestionArray = quiz?.questions;
        if (!quizQuestions) {
            if (!quizQuestionArray) return;

            const parsedQuestions = [] as GIFTQuestion[];
            quizQuestionArray.forEach((question, index) => {
                parsedQuestions.push(parse(question)[0]);
                parsedQuestions[index].id = (index + 1).toString();
            });
            if (parsedQuestions.length === 0) return;

            setQuizQuestions(parsedQuestions);
            setPresentQuestionString([quizQuestionArray[0]]);
            webSocketService.nextQuestion(roomName, parsedQuestions[0]);
        } else {
            if (!presentQuestionString || !quizQuestionArray) return;
            const index = quizQuestionArray?.indexOf(presentQuestionString[0]);
            if (index !== undefined && quizQuestions) {
                if (index < quizQuestionArray.length - 1) {
                    setPresentQuestionString([quizQuestionArray[index + 1]]);
                    webSocketService.nextQuestion(roomName, quizQuestions[index + 1]);

                    if (index === quizQuestionArray.length - 2) {
                        setIsLastQuestion(true);
                    }
                } else {
                    exitRoom();
                }
            }
        }
    };

    const launchStudentMode = () => {
        const quizQuestionArray = quiz?.questions;
        if (!quizQuestionArray) return;
        const parsedQuestions = [] as GIFTQuestion[];
        quizQuestionArray.forEach((question, index) => {
            parsedQuestions.push(parse(question)[0]);
            parsedQuestions[index].id = (index + 1).toString();
        });
        if (parsedQuestions.length === 0) return;

        setQuizQuestions(parsedQuestions);
        webSocketService.launchStudentModeQuiz(roomName, quiz?.questions);
    };

    const launchQuiz = () => {
        if (!socket || !roomName || quiz?.questions.length === 0) {
            console.log('Error launching quiz. No socket, room name or no questions.');
            // TODO Add show error to user.
            return;
        }
        switch (quizMode) {
            case 'student':
                launchStudentMode();
                return;
            case 'teacher':
                nextQuestion();
                return;
        }
    };

    const exitRoom = () => {
        webSocketService.endQuiz(roomName);
        disconnectWebSocket();
    };

    return (
        <div>
            {quizQuestions ? (
                <div>
                    <h2 className="page-title">Salle : {roomName} </h2>
                    <GIFTTemplatePreview
                        questions={presentQuestionString ? presentQuestionString : []}
                        hideAnswers={true}
                    ></GIFTTemplatePreview>
                    <LiveResultsComponent
                        socket={socket}
                        questions={quizQuestions}
                    ></LiveResultsComponent>
                    <div className="bottom-btn">
                        {quizMode === 'teacher' && (
                            <button onClick={nextQuestion}>
                                {isLastQuestion ? 'Fermer le quiz' : 'Question suivante'}
                            </button>
                        )}
                        {quizMode === 'student' && (
                            <button onClick={exitRoom}>Fermer le quiz</button>
                        )}
                    </div>
                </div>
            ) : (
                <div>
                    {roomName ? (
                        <div className="manage-room-container">
                            <h2 className="page-title">Salle : {roomName} </h2>

                            <button className="quit-btn" onClick={disconnectWebSocket}>
                                Déconnexion
                            </button>
                            <div className="quiz-setup-container">
                                <div className="users-container">
                                    <h2>Users:</h2>
                                    <div>
                                        {users.map((user) => (
                                            <span className="user" key={user}>
                                                {user}{' '}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button
                                className="launch-quiz-btn big-btn-general-style"
                                onClick={launchQuiz}
                            >
                                Lancer le quiz
                            </button>
                            <div className="quiz-mode-selection">
                                <h3>Sélection du mode du quiz</h3>
                                <label className="mode-choice">
                                    <input
                                        type="radio"
                                        checked={quizMode === 'teacher'}
                                        onChange={() => {
                                            setQuizMode('teacher');
                                        }}
                                    />
                                    Au rythme du professeur
                                </label>
                                <label className="mode-choice">
                                    <input
                                        type="radio"
                                        checked={quizMode === 'student'}
                                        onChange={() => {
                                            setQuizMode('student');
                                        }}
                                    />
                                    Au rythme de l'étudiant
                                </label>
                            </div>
                        </div>
                    ) : (
                        <div className="create-room-container">
                            <h1 className="page-title">Création d'une salle</h1>
                            {loading ? (
                                <div className="loading-container">
                                    <div className="loading"></div>
                                </div>
                            ) : null}
                            <button
                                className="create-room-btn big-btn-general-style"
                                onClick={createWebSocketRoom}
                            >
                                Create Room
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ManageRoom;
