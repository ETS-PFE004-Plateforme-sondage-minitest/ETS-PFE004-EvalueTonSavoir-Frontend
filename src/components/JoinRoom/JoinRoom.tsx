import {Socket} from 'socket.io-client';
import React from 'react';
import webSocketService from '../../services/WebsocketService';
import './JoinRoomStyles.css';


interface JoinRoomProps {
    socket: Socket | null;
    username: string;
    setUsername: (value: string) => void;
    roomName: string;
    setRoomName: (value: string) => void;
    setSocket: (value: Socket) => void;
}


const JoinRoom : React.FC<JoinRoomProps> = ({socket, username, setUsername, roomName, setRoomName, setSocket}) => {

    const joinRoom = () => {
        if(!socket){
            const socket = webSocketService.connect();  
            setSocket(socket); 
        }
        
        if (username && roomName) {
            webSocketService.joinRoom(roomName, username);
        }
    };

    
    return (
        <div className='container'>
            <img className="logo" src="/Logo.svg" alt="Logo" />
            <img className="title" src="/EvalueTonSavoirText.svg" alt="Titre" />
            <input 
                value={username}  
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="Enter username" 
            />
            <input 
                value={roomName} 
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Enter room name"
            />
            <button className='joinBtn' onClick={joinRoom}>Join</button>
        </div>
    );
}

export default JoinRoom;