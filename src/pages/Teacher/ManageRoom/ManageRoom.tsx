// ManageRoom.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {io, Socket} from 'socket.io-client';
import { QuizService } from '../../../services/QuizService';
import { QuizType } from '../../../Types/QuizType';
import { GIFTQuestion, parse } from 'gift-pegjs'
import LiveResultsComponent from '../../../components/LiveResults/LiveResults';
import PreviewComponent from '../../../components/EditorPreview/Preview';


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
    }, [quizId.id]);


    const disconnectWebSocket = () => {
        if (socket) {
            socket.disconnect();
            setSocket(null);
            setPresentQuestion(undefined);
            setQuizQuestions(undefined);
            setIsLastQuestion(false);
            setUsers([]);
            setRoomName('');
        }
    };

    const createWebSocketRoom = () => {
            const socket = io(`${import.meta.env.VITE_BACKEND_URL}`, {
                transports: ['websocket'],
                reconnectionAttempts: 1
            });
            socket.on('connect', () => {
                socket.emit('create-room');
            });
            socket.on('create-success', (roomName: string ) => {
                setRoomName(roomName);
            });
            socket.on('user-joined', (username: string) => {
                setUsers(prevUsers => [...prevUsers, username]);
            });
            setSocket(socket);
    };

    const nextQuestion = () => {
       if(socket && roomName){
            if(!quizQuestions){
                let quizQuestionString = quiz?.questions;
                if(!quizQuestionString) return;
                let questions = parse(quizQuestionString); //TODO - move the logic in the editor (we should just get the right info from the cookie)
                questions?.forEach((question, index) => {
                    question.id = (index + 1).toString();
                });
                setQuizQuestions(questions);
                setPresentQuestion([questions[0]]); 
                socket.emit('next-question', {roomName : roomName, question : questions[0]});
            }
            else{
                console.log(quizQuestions)
                if(!presentQuestion) return;
                let index = quizQuestions?.indexOf(presentQuestion[0] as GIFTQuestion);
                if(index !== undefined && quizQuestions){
                    if(index < quizQuestions.length - 1){
                        setPresentQuestion([quizQuestions[index + 1]]);
                        socket.emit('next-question', {roomName: roomName, question : quizQuestions[index + 1]});

                        if(index === quizQuestions.length - 2){
                            setIsLastQuestion(true);
                        }
                    }
                    else{
                        console.log('end quiz');
                        socket.emit('end-quiz', {roomName: roomName});
                        disconnectWebSocket ();
                    }
                }
            }
        }
    };

    return (
        <div>
            {quizQuestions ? 
                <div>
                    <PreviewComponent questions={"none"}  showAnswers={false} giftQuestions={presentQuestion}></PreviewComponent>
                    <LiveResultsComponent socket={socket} questions={quizQuestions}></LiveResultsComponent>
                    <button onClick={nextQuestion}>{isLastQuestion ? "End Quiz" : "NextQuestion"}</button>
                </div>
            :
                <div>
                    {
                        roomName ?
                            <div>
                                <div>
                                    <h2>Room name : {roomName}</h2>
                                    <h2>Users:</h2>
                                    {users.map(user => (
                                        <span key={user}>{user} </span>
                                    ))}
                                </div>
                                <div>
                                    <button onClick={nextQuestion}>Launch Quiz</button>
                                    <button onClick={disconnectWebSocket}>Quit</button>
                                </div>
                            </div>
                        :
                            <div>
                                <h1>Room name</h1>

                                <button onClick={createWebSocketRoom}>Create Room</button>
                            </div>  
                    }
                </div>
            }
            
        </div>
    );
};

export default ManageRoom;