import { Question } from 'gift-pegjs';
import React, { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

const JoinRoom: React.FC = () => {
    const [roomName, setRoomName] = useState('');
    const [username, setUsername] = useState('');
    const [socket , setSocket] = useState<Socket | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [question, setQuestion] = useState<Question>();

    useEffect(() => {
    },[question,isLoading]);

    const disconnect= () => {
        setSocket(null);
        setQuestion(undefined);
        setIsLoading(false);
        setRoomName('');
        setUsername('');
    };


    const handleSocket = () => {
        if(!socket){
            const socket = io(`${import.meta.env.VITE_BACKEND_URL}`, {
                transports: ['websocket'],
                reconnectionAttempts: 1
            });
            socket.on('connect', () => {
                socket.emit('join-room', { enteredRoomName: roomName, username: username });
            });
            socket.on('join-success', () => {
                setIsLoading(true);
                console.log('Successfully joined the room.');
            });
            socket.on('next-question', (question: Question) => {
                console.log(question)
                setIsLoading(false);
                setQuestion(question);
            });
            socket.on('end-quiz', () => {
                console.log('end-quiz.');
                socket.disconnect();
                disconnect()
            });
            socket.on('join-failure', () => {
                console.log('Failed to join the room.');
            });
            socket.on('connect_error', (error) => {
                console.log("Connection Error:", error);
            });
            setSocket(socket); 
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
                            {question.stem.text}
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
