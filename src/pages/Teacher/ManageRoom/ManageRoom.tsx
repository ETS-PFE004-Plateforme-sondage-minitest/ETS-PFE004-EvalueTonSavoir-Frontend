// ManageRoom.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogTitle,
    Grid,
    IconButton
} from '@mui/material';
import LoadingCircle from '../../../components/LoadingCircle/LoadingCircle';
import { Refresh, Error, PlayArrow, ChevronLeft, ChevronRight } from '@mui/icons-material';
import UserWaitPage from '../../../components/UserWaitPage/UserWaitPage';
import ConfirmDialog from '../../../components/ConfirmDialog/ConfirmDialog';
import ReturnButton from '../../../components/ReturnButton/ReturnButton';

const ManageRoom: React.FC = () => {
    const navigate = useNavigate();
    const [roomName, setRoomName] = useState<string>('');
    const [socket, setSocket] = useState<Socket | null>(null);
    const [users, setUsers] = useState<UserType[]>([]);
    const quizId = useParams<{ id: string }>();
    const [quizQuestions, setQuizQuestions] = useState<QuestionType[] | undefined>();
    const [quiz, setQuiz] = useState<QuizType>();
    const [displayedQuestionString, setDisplayedQuestionString] = useState<string | undefined>();
    const [quizMode, setQuizMode] = useState<'teacher' | 'student'>('teacher');
    const [loading, setLoading] = useState<boolean>(false);
    const [connectingError, setConnectingError] = useState<string>('');
    const [currentQuestion, setCurrentQuestion] = useState<QuestionType | undefined>(undefined);

    useEffect(() => {
        setQuiz(QuizService.getQuizById(quizId.id));
        createWebSocketRoom();
        const temp = [];
        for (let i = 0; i < 25; i++) {
            temp.push({ name: `name ${i}`, id: i + '' });
        }
        setUsers(temp);
        return () => {
            webSocketService.disconnect();
        };
    }, [quizId.id]);

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
        setLoading(true);
        setConnectingError('');
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

    const initializeQuizQuestion = () => {
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
        setCurrentQuestion(parsedQuestions[0]);
        setDisplayedQuestionString(quizQuestionArray[0]);

        webSocketService.nextQuestion(roomName, parsedQuestions[0]);
    };
    const nextQuestion = () => {
        if (!quizQuestions || !currentQuestion || !quiz?.questions) return;

        const nextQuestionIndex = Number(currentQuestion?.question.id);

        if (nextQuestionIndex === undefined || nextQuestionIndex > quizQuestions.length - 1) return;

        setCurrentQuestion(quizQuestions[nextQuestionIndex]);
        setDisplayedQuestionString(quiz?.questions[nextQuestionIndex]);
        webSocketService.nextQuestion(roomName, quizQuestions[nextQuestionIndex]);
    };

    const previousQuestion = () => {
        if (!quizQuestions || !currentQuestion || !quiz?.questions) return;

        const prevQuestionIndex = Number(currentQuestion?.question.id) - 2; // -2 because question.id starts at index 1

        if (prevQuestionIndex === undefined || prevQuestionIndex < 0) return;

        setCurrentQuestion(quizQuestions[prevQuestionIndex]);
        setDisplayedQuestionString(quiz?.questions[prevQuestionIndex]);
        webSocketService.nextQuestion(roomName, quizQuestions[prevQuestionIndex]);
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
        webSocketService.launchStudentModeQuiz(roomName, parsedQuestions);
    };

    const launchQuiz = () => {
        if (!socket || !roomName || quiz?.questions.length === 0) {
            console.log('Error launching quiz. No socket, room name or no questions.');
            // TODO Add show error to user.
            return;
        }
        switch (quizMode) {
            case 'student':
                return launchStudentMode();
            case 'teacher':
                return initializeQuizQuestion();
        }
    };

    const showSelectedQuestion = (questionIndex: number) => {
        //set presentQuestionString to the question at index questionIndex
        if (quiz?.questions && quizQuestions) {
            setDisplayedQuestionString(quiz?.questions[questionIndex]);
            setCurrentQuestion(quizQuestions[questionIndex]);
            webSocketService.nextQuestion(roomName, quizQuestions[questionIndex]);
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
        <div className="room-container">
            <ReturnButton onReturn={handleReturn} askConfirm={!!quizQuestions} />
            {quizQuestions ? (
                <div>
                    <div className="text-lg blue selectable-text room-name-wrapper">
                        Salle : {roomName}
                    </div>
                    <div className="title center-h-align">{quiz?.title}</div>
                    {quizMode === 'teacher' && (
                        <>
                            <div className="center-h-align">
                                <IconButton
                                    onClick={previousQuestion}
                                    disabled={
                                        quizQuestions && Number(currentQuestion?.question.id) <= 1
                                    }
                                >
                                    <ChevronLeft />
                                </IconButton>
                                <div className="text-base text-bold">
                                    {`Questions ${currentQuestion?.question.id}/${quizQuestions.length}`}
                                </div>
                                <IconButton
                                    onClick={nextQuestion}
                                    disabled={
                                        quizQuestions &&
                                        Number(currentQuestion?.question.id) >=
                                            quizQuestions?.length
                                    }
                                >
                                    <ChevronRight />
                                </IconButton>
                            </div>
                            <GIFTTemplatePreview
                                questions={displayedQuestionString ? [displayedQuestionString] : []}
                                hideAnswers={true}
                            />
                        </>
                    )}
                    <LiveResultsComponent
                        socket={socket}
                        questions={quizQuestions}
                        showSelectedQuestion={showSelectedQuestion}
                    ></LiveResultsComponent>
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
    );
};

export default ManageRoom;
