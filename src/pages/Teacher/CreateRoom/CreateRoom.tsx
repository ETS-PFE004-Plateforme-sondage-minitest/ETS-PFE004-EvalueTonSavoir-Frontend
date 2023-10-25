// CreateRoom.tsx
import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {io, Socket} from 'socket.io-client';


const CreateRoom: React.FC = () => {
    const [roomName, setRoomName] = useState<string>('');
    const [socket, setSocket] = useState<Socket | null>(null);
    const [users, setUsers] = useState<string[]>([]);
    const quiz = useParams<{ id: string }>();

    const disconnectWebSocket = () => {
        if (socket) {
            socket.disconnect();
            setSocket(null);
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

    const launchQuiz = () => {
        console.log(`go to room : /teacher/teacherRoom/${roomName}:quiz-id=${quiz.id}`);
    }
    
    return (
        <div>
            <h1>Room name</h1>
            <span>{roomName}</span>
            {roomName 
                ? <div>
                        <button onClick={launchQuiz}>Launch Quiz</button> 
                    </div>
                :<button onClick={createWebSocketRoom}>Create Room</button>
            }

            <button onClick={disconnectWebSocket}>Quit</button>

            <div>
                <h2>Users:</h2>
                {users.map(user => (
                    <span key={user}>{user}</span>
                ))}
            </div>

        </div>
    );
};

export default CreateRoom;