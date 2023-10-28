import { GIFTQuestion } from 'gift-pegjs';
import React, { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import QuestionComponent from '../../../components/Questions/Question';
import webSocketService from '../../../services/WebsocketService';

const JoinRoom: React.FC = () => {
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
            //socket.disconnect();
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
    };


    const handleSocket = () => {
        if(!socket){
            const socket = webSocketService.connect();  
            setSocket(socket); 
        }
        
        if (username && roomName) {
            webSocketService.joinRoom(roomName, username);
        }
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
                        <div>
                            <QuestionComponent socket={socket} question={question} roomName={roomName} username={username} />
                        </div> 
                    :
                        <div>
                            <input 
                            value={username}  
                            onChange={(e) => setUsername(e.target.value)} 
                            placeholder="Enter username" />
                    
                            <input 
                                value={roomName} 
                                onChange={(e) => setRoomName(e.target.value)}
                                placeholder="Enter room name"
                            />
                            <button onClick={handleSocket}>Join</button>
                        </div>
                    }
                </div>
            }
        </div>
    );
};

export default JoinRoom;
