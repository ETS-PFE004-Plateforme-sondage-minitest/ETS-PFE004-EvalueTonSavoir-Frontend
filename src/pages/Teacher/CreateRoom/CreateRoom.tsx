// CreateRoom.tsx
import React, { useEffect } from 'react';

const CreateRoom: React.FC = () => {
    const generatePassword = (length = 6) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    };
    const password = generatePassword();
    
    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/set-room-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password })
        })
        .then(response => response.json())
        .then(data => {
            console.log("Response from server:", data.message);
        })
        .catch(error => console.error('Error sending password:', error));
    }, [password]);

    
    return (
        <div>
            <h1>Pawword</h1>
            <span>{password}</span>
        </div>
    );
};

export default CreateRoom;