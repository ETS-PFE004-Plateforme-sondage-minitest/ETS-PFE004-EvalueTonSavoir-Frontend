import { GIFTQuestion } from 'gift-pegjs';
import React, { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import QuestionComponent from '../../components/Questions/Question';
import webSocketService from '../../services/WebsocketService';
import JoinRoomComponent from '../../components/JoinRoom/JoinRoom';

const StudentPage: React.FC = () => {
    const [roomName, setRoomName] = useState('');
    const [username, setUsername] = useState('');
    const [socket , setSocket] = useState<Socket | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [question, setQuestion] = useState<GIFTQuestion>();

    useEffect(() => {
        const socket = webSocketService.connect();
        socket.on('join-success', () => {
            setIsLoading(true);
            console.log('Successfully joined the room.');
        });
        socket.on('next-question', (question: GIFTQuestion) => {
            setIsLoading(false);
            setQuestion(question);
        });
        socket.on('end-quiz', () => {
            console.log('end-quiz.');
            disconnect()
        });
        socket.on('join-failure', () => {
            console.log('Failed to join the room.');
        });
        socket.on('connect_error', (error) => {
            console.log("Connection Error:", error);
        });
        setSocket(socket);
        return () => { 
            webSocketService.disconnect();
        };
    },[]);

    const disconnect= () => {
        setSocket(null);
        setQuestion(undefined);
        setIsLoading(false);
        setRoomName('');
        setUsername('');
        setSocket(null);
    };

    return (
        <div>
            { isLoading ?
                <div>
                    Waiting for question...
                </div>
                
            :
                <div>
                    { question ? 
                        <QuestionComponent socket={socket} question={question} roomName={roomName} username={username} disconnect={disconnect} />
                    :
                        <JoinRoomComponent 
                            socket={socket} 
                            username={username}
                            setUsername={setUsername}
                            roomName={roomName}
                            setRoomName={setRoomName}
                            setSocket={setSocket}
                        />
                    }
                </div>
            }
        </div>
    );
};

export default StudentPage;
