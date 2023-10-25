import React, { useState } from 'react';
import io from 'socket.io-client';

const JoinRoom: React.FC = () => {
    const [roomName, setRoomName] = useState('');
    const [username, setUsername] = useState('');

    const handleJoin = () => {

        const socket = io(`${import.meta.env.VITE_BACKEND_URL}`, {
            transports: ['websocket'],
            reconnectionAttempts: 1
        });
        socket.on('connect', () => {
            socket.emit('join-room', { enteredRoomName: roomName, username: username });
        });

        socket.on('join-success', () => {
            console.log('Successfully joined the room.');
        });

        socket.on('join-failure', () => {
            console.log('Failed to join the room.');
        });
        socket.on('connect_error', (error) => {
            console.log("Connection Error:", error);
        });
    };

    return (
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
            <button onClick={handleJoin}>Join</button>
        </div>
    );
};

export default JoinRoom;
