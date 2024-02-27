
import { useNavigate } from 'react-router-dom';

// JoinRoom.tsx
import React, { useEffect, useState } from 'react';

import './ResetPassword.css';
import { Paper, TextField } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';


import ApiService from '../../../services/ApiService';

const ResetPassword: React.FC = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');

    const [connectionError, setConnectionError] = useState<string>('');
    const [isConnecting] = useState<boolean>(false);

    useEffect(() => {
        return () => {

        };
    }, []);

    const reset = async () => {
        const result = await ApiService.resetPassword(email);

        if (result != true) {
            setConnectionError(result);
            return;
        }

        navigate("/teacher/login")
    };


    return (
        <div className="join-room-container">
            <h1 className="page-title mb-1">Reset Password</h1>

            <Paper>

                <div className="login-container">
                    <img className="login-avatar" src="./people.svg" width={'20%'}></img>

                    <TextField
                        label="Email"
                        variant="outlined"
                        type="password"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Nom d'utilisateur"
                        sx={{ marginBottom: '1rem' }}
                        fullWidth
                    />

                    <LoadingButton
                        loading={isConnecting}
                        onClick={reset}
                        variant="contained"
                        sx={{ marginBottom: `${connectionError && '2rem'}` }}
                        disabled={!email}
                    >
                        Reset
                    </LoadingButton>

                    <div className="error-text text-base">{connectionError}</div>
                </div>
            </Paper>
        </div>
    );
};

export default ResetPassword;
