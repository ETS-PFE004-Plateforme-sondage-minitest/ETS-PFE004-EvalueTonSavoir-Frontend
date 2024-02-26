// JoinRoom.tsx
import React, { useEffect, useState } from 'react';

import './Login.css';
import { Paper, TextField } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';


import ApiService from '../../../services/ApiService';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [connectionError, setConnectionError] = useState<string>('');
    const [isConnecting] = useState<boolean>(false);

    useEffect(() => {
        return () => {

        };
    }, []);

    const login = async () => {
        console.log(email);
        const result = await ApiService.login(email, password);
        console.log(result)

        if (!result) {
            setConnectionError("Bad login :(");
            return; // Here return error!
        }

        window.open("/teacher/Dashboard")
    };


    return (
        <div className="join-room-container">
            <h1 className="page-title mb-1">Login</h1>

            <Paper>

                <div className="login-container">
                    <img className="login-avatar" src="./people.svg" width={'20%'}></img>

                    <TextField
                        label="Email"
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Nom d'utilisateur"
                        sx={{ marginBottom: '1rem' }}
                        fullWidth
                    />

                    <TextField
                        label="Mot de passe"
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Nom de la salle"
                        sx={{ marginBottom: '1rem' }}
                        fullWidth
                    />

                    <LoadingButton
                        loading={isConnecting}
                        onClick={login}
                        variant="contained"
                        sx={{ marginBottom: `${connectionError && '2rem'}` }}
                        disabled={!email || !password}
                    >
                        Login
                    </LoadingButton>

                    <div className="error-text text-base">{connectionError}</div>
                </div>
            </Paper>
        </div>
    );
};

export default Login;
