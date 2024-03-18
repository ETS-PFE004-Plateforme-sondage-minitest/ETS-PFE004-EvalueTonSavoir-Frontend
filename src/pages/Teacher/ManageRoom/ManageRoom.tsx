// ManageRoom.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import { parse } from 'gift-pegjs';
import { QuestionType } from '../../../Types/QuestionType';
import LiveResultsComponent from '../../../components/LiveResults/LiveResults';
import { QuestionService } from '../../../services/QuestionService';
import webSocketService from '../../../services/WebsocketService';
import { QuizType } from '../../../Types/QuizType';

import './manageRoom.css';
import { ENV_VARIABLES } from '../../../constants';
import { UserType } from '../../../Types/UserType';
import { Button } from '@mui/material';
import LoadingCircle from '../../../components/LoadingCircle/LoadingCircle';
import { Refresh, Error } from '@mui/icons-material';
import UserWaitPage from '../../../components/UserWaitPage/UserWaitPage';
import DisconnectButton from '../../../components/DisconnectButton/DisconnectButton';
import QuestionNavigation from '../../../components/QuestionNavigation/QuestionNavigation';
import Question from '../../../components/Questions/Question';
import ApiService from '../../../services/ApiService';

const ManageRoom: React.FC = () => {
    const navigate = useNavigate();
    const [roomName, setRoomName] = useState<string>('');
    const [socket, setSocket] = useState<Socket | null>(null);
    const [users, setUsers] = useState<UserType[]>([]);
    const quizId = useParams<{ id: string }>();
    const [quizQuestions, setQuizQuestions] = useState<QuestionType[] | undefined>();
    const [quiz, setQuiz] = useState<QuizType | null>(null);
    const [quizMode, setQuizMode] = useState<'teacher' | 'student'>('teacher');
    const [connectingError, setConnectingError] = useState<string>('');
    const [currentQuestion, setCurrentQuestion] = useState<QuestionType | undefined>(undefined);

    useEffect(() => {
        if (quizId.id) {
            const fetchquiz = async () => {

                const quiz = await ApiService.getQuiz(quizId.id as string);

                if (!quiz) {
                    window.alert(`Une erreur est survenue.\n Le quiz ${quizId.id} n'a pas été trouvé\nVeuillez réessayer plus tard`)
                    console.error('Quiz not found for id:', quizId.id);
                    navigate('/teacher/dashboard');
                    return;
                }

                setQuiz(quiz as QuizType);

                if (!socket) {
                    createWebSocketRoom();
                }

                // return () => {
                //     webSocketService.disconnect();
                // };
            };

            fetchquiz();

        } else {
            window.alert(`Une erreur est survenue.\n Le quiz ${quizId.id} n'a pas été trouvé\nVeuillez réessayer plus tard`)
            console.error('Quiz not found for id:', quizId.id);
            navigate('/teacher/dashboard');
            return;
        }
    }, [quizId]);

    const disconnectWebSocket = () => {
        if (socket) {
            webSocketService.endQuiz(roomName);
            webSocketService.disconnect();
            setSocket(null);
            setQuizQuestions(undefined);
            setCurrentQuestion(undefined);
            setUsers([]);
            setRoomName('');
        }
    };

    const createWebSocketRoom = () => {
        setConnectingError('');
        const socket = webSocketService.connect(ENV_VARIABLES.VITE_BACKEND_URL);
        console.log(socket);
        socket.on('connect', () => {
            webSocketService.createRoom();
        });
        socket.on('connect_error', (error) => {
            setConnectingError('Erreur lors de la connexion... Veuillez réessayer');
            console.error('WebSocket connection error:', error);
        });
        socket.on('create-success', (roomName: string) => {
            setRoomName(roomName);
        });
        socket.on('create-failure', () => {
            console.log('Error creating room.');
        });
        
        socket.on('user-joined', (user: UserType) => {
            console.log("USER JOINED ! ")
            console.log("quizMode: ", quizMode)

            setUsers((prevUsers) => [...prevUsers, user]);

            // This doesn't relaunch the quiz for users that connected late
            if (quizMode === 'teacher') {
                console.log("TEACHER")

                webSocketService.nextQuestion(roomName, currentQuestion);

            } else if (quizMode === 'student') {

                console.log(quizQuestions);
                webSocketService.launchStudentModeQuiz(roomName, quizQuestions);

            }
        });
        socket.on('join-failure', (message) => {
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
        if (!quizQuestions || !currentQuestion || !quiz?.content) return;

        const nextQuestionIndex = Number(currentQuestion?.question.id);

        if (nextQuestionIndex === undefined || nextQuestionIndex > quizQuestions.length - 1) return;

        setCurrentQuestion(quizQuestions[nextQuestionIndex]);
        webSocketService.nextQuestion(roomName, quizQuestions[nextQuestionIndex]);
    };

    const previousQuestion = () => {
        if (!quizQuestions || !currentQuestion || !quiz?.content) return;

        const prevQuestionIndex = Number(currentQuestion?.question.id) - 2; // -2 because question.id starts at index 1

        if (prevQuestionIndex === undefined || prevQuestionIndex < 0) return;

        setCurrentQuestion(quizQuestions[prevQuestionIndex]);
        webSocketService.nextQuestion(roomName, quizQuestions[prevQuestionIndex]);
    };

    const initializeQuizQuestion = () => {
        const quizQuestionArray = quiz?.content;
        if (!quizQuestionArray) return null;
        const parsedQuestions = [] as QuestionType[];

        quizQuestionArray.forEach((question, index) => {
            const imageTag = QuestionService.getImage(question);
            const imageUrl = QuestionService.getImageSource(imageTag);
            question = QuestionService.ignoreImgTags(question);
            parsedQuestions.push({ question: parse(question)[0], image: imageUrl });
            parsedQuestions[index].question.id = (index + 1).toString();
        });
        if (parsedQuestions.length === 0) return null;

        setQuizQuestions(parsedQuestions);
        return parsedQuestions;
    };

    const launchTeacherMode = () => {
        const quizQuestions = initializeQuizQuestion();

        if (!quizQuestions) return;

        setCurrentQuestion(quizQuestions[0]);
        webSocketService.nextQuestion(roomName, quizQuestions[0]);
    };

    const launchStudentMode = () => {
        const quizQuestions = initializeQuizQuestion();

        if (!quizQuestions) {
            return;
        }

        webSocketService.launchStudentModeQuiz(roomName, quizQuestions);
    };

    const launchQuiz = () => {
        if (!socket || !roomName || quiz?.content.length === 0) {
            console.log('Error launching quiz. No socket, room name or no questions.');
            return;
        }
        switch (quizMode) {
            case 'student':
                return launchStudentMode();
            case 'teacher':
                return launchTeacherMode();
        }
    };

    const showSelectedQuestion = (questionIndex: number) => {
        if (quiz?.content && quizQuestions) {
            setCurrentQuestion(quizQuestions[questionIndex]);
            console.log(quizQuestions[questionIndex]);
            if (quizMode === 'teacher') {
                webSocketService.nextQuestion(roomName, quizQuestions[questionIndex]);
            }
        }
    };

    const handleReturn = () => {
        disconnectWebSocket();
        navigate('/teacher/dashboard');
    };

    if (!roomName) {
        return (
            <div className="center">
                {!connectingError ? (
                    <LoadingCircle text="Veuillez attendre la connexion au serveur..." />
                ) : (
                    <div className="center-v-align">
                        <Error sx={{ padding: 0 }} />
                        <div className="text-base">{connectingError}</div>
                        <Button
                            variant="contained"
                            startIcon={<Refresh />}
                            onClick={createWebSocketRoom}
                        >
                            Reconnecter
                        </Button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className='room'>
            <div className='roomHeader'>

                <DisconnectButton
                    onReturn={handleReturn}
                    askConfirm
                    message={`Êtes-vous sûr de vouloir quitter?`} />

                <div className='centerTitle'>
                    <div className='title'>Salle: {roomName}</div>
                    <div className='userCount subtitle'>Utilisateurs: {users.length}/60</div>
                </div>

                <div className='dumb'></div>

            </div>

            <div className='room'>

                {quizQuestions ? (

                    <div style={{ display: 'flex', flexDirection: 'column' }}>

                        <div className="title center-h-align mb-2">{quiz?.title}</div>

                        {quizMode === 'teacher' && (

                            <div className="mb-1">
                                <QuestionNavigation
                                    currentQuestionId={Number(currentQuestion?.question.id)}
                                    questionsLength={quizQuestions?.length}
                                    previousQuestion={previousQuestion}
                                    nextQuestion={nextQuestion}
                                />
                            </div>

                        )}

                        <div className="mb-2 flex-column-wrapper">
                            <div className="preview-and-result-container">

                                {currentQuestion && (
                                    <Question
                                        imageUrl={currentQuestion?.image}
                                        showAnswer={false}
                                        question={currentQuestion?.question}
                                    />
                                )}

                                <LiveResultsComponent
                                    quizMode={quizMode}
                                    socket={socket}
                                    questions={quizQuestions}
                                    showSelectedQuestion={showSelectedQuestion}
                                    students={users}
                                ></LiveResultsComponent>

                            </div>
                        </div>

                        {quizMode === 'teacher' && (
                            <div className="nextQuestionButton">
                                <Button onClick={nextQuestion} variant="contained">
                                    Prochaine question
                                </Button>
                            </div>
                        )}

                    </div>

                ) : (

                    <UserWaitPage
                        users={users}
                        launchQuiz={launchQuiz}
                        roomName={roomName}
                        setQuizMode={setQuizMode}
                    />

                )}
            </div>

        </div>
    );
};

export default ManageRoom;
