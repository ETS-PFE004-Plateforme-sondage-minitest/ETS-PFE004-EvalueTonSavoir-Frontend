import React, { useState } from 'react';
import io from 'socket.io-client';

const JoinRoom: React.FC = () => {
    const [password, setPassword] = useState('');

    const handleJoin = () => {

        const socket = io('http://localhost:4400', {
            transports: ['websocket'],
            reconnectionAttempts: 1
        });
        socket.on('connect', () => {
            socket.emit('join-room', password);
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
            hello world
            <input 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter room password"
            />
            <button onClick={handleJoin}>Join</button>
        </div>
    );
};

export default JoinRoom;
