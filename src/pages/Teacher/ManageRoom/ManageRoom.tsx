// ManageRoom.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import { parse } from 'gift-pegjs';
import { QuestionType } from '../../../Types/QuestionType';
import GIFTTemplatePreview from '../../../components/GiftTemplate/GIFTTemplatePreview';
import LiveResultsComponent from '../../../components/LiveResults/LiveResults';
import { QuizService } from '../../../services/QuizService';
import { QuestionService } from '../../../services/QuestionService';
import webSocketService from '../../../services/WebsocketService';
import { QuizType } from '../../../Types/QuizType';

import './ManageRoom.css';
import { ENV_VARIABLES } from '../../../constants';
import { UserType } from '../../../Types/UserType';

const ManageRoom: React.FC = () => {
    const [roomName, setRoomName] = useState<string>('');
    const [socket, setSocket] = useState<Socket | null>(null);
    const [users, setUsers] = useState<UserType[]>([]);
    const quizId = useParams<{ id: string }>();
    const [quizQuestions, setQuizQuestions] = useState<QuestionType[] | undefined>();
    const [quiz, setQuiz] = useState<QuizType>();
    const [isLastQuestion, setIsLastQuestion] = useState<boolean>(false);
    const [presentQuestionString, setPresentQuestionString] = useState<string[]>();
    const [displayedQuestionString, setDisplayedQuestionString] = useState<string[] | undefined>(
        []
    );
    const [quizMode, setQuizMode] = useState<'teacher' | 'student'>('teacher');
    const [loading, setLoading] = useState<boolean>(false);
    const [connectingError, setConnectingError] = useState<string>('');

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
        const socket = webSocketService.connect(ENV_VARIABLES.VITE_BACKEND_URL);
        socket.on('connect', () => {
            webSocketService.createRoom();
        });
        socket.on('connect_error', (error) => {
            setLoading(false);
            setConnectingError('Erreure lors de la connexion... Veuillez réessayer');
            console.error('WebSocket connection error:', error);
        });
        socket.on('create-success', (roomName: string) => {
            setLoading(false);
            setRoomName(roomName);
        });
        socket.on('create-failure', () => {
            setLoading(false);
            console.log('Error creating room.');
        });
        socket.on('user-joined', (user: UserType) => {
            setUsers((prevUsers) => [...prevUsers, user]);
        });
        socket.on('join-failure', (message) => {
            setLoading(false);
            setConnectingError(message);
            setSocket(null);
        });
        socket.on('user-disconnected', (userId: string) => {
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
            console.log(userId);
        });
        setSocket(socket);
    };

    const nextQuestion = () => {
        const quizQuestionArray = quiz?.questions;
        if (!quizQuestions) {
            if (!quizQuestionArray) return;
            const parsedQuestions = [] as QuestionType[];
            quizQuestionArray.forEach((question, index) => {
                const image = QuestionService.getImage(question);
                question = QuestionService.ignoreImgTags(question);
                parsedQuestions.push({ question: parse(question)[0], image: image });
                parsedQuestions[index].question.id = (index + 1).toString();
            });
            if (parsedQuestions.length === 0) return;

            setQuizQuestions(parsedQuestions);
            setPresentQuestionString([quizQuestionArray[0]]);
            setDisplayedQuestionString([quizQuestionArray[0]]);
            webSocketService.nextQuestion(roomName, parsedQuestions[0]);
        } else {
            if (!presentQuestionString || !quizQuestionArray) return;
            const index = quizQuestionArray?.indexOf(presentQuestionString[0]);
            if (index !== undefined && quizQuestions) {
                if (index < quizQuestionArray.length - 1) {
                    setPresentQuestionString([quizQuestionArray[index + 1]]);
                    setDisplayedQuestionString([quizQuestionArray[index + 1]]);
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
        const parsedQuestions = [] as QuestionType[];
        quizQuestionArray.forEach((question, index) => {
            const image = QuestionService.getImage(question);
            question = QuestionService.ignoreImgTags(question);

            parsedQuestions.push({ question: parse(question)[0], image: image });
            parsedQuestions[index].question.id = (index + 1).toString();
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

    const showSelectedQuestion = (questionIndex: number) => {
        //set presentQuestionString to the question at index questionIndex
        if (quiz?.questions) setDisplayedQuestionString([quiz?.questions[questionIndex]]);
    };

    return (
        <div>
            {quizQuestions ? (
                <div>
                    <h2 className="page-title">Salle : {roomName} </h2>
                    <button className="quit-btn" onClick={exitRoom}>
                        Déconnexion
                    </button>
                    <GIFTTemplatePreview
                        questions={displayedQuestionString ? displayedQuestionString : []}
                        hideAnswers={true}
                    ></GIFTTemplatePreview>
                    <LiveResultsComponent
                        socket={socket}
                        questions={quizQuestions}
                        showSelectedQuestion={showSelectedQuestion}
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
                                    <h2>Utilisateurs:</h2>
                                    <div>
                                        {users.map((user) => (
                                            <span className="user" key={user.name}>
                                                {user.name}{' '}
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
                                <>
                                    En attente pour la connexion....
                                    <div className="loading-container">
                                        <div className="loading" />
                                    </div>
                                </>
                            ) : (
                                <>
                                    {connectingError && <div>{connectingError}</div>}
                                    <button
                                        className="create-room-btn big-btn-general-style"
                                        onClick={createWebSocketRoom}
                                    >
                                        Créer une salle
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ManageRoom;
