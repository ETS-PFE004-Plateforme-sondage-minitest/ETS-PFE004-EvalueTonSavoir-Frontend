
import { useNavigate } from 'react-router-dom';

// JoinRoom.tsx
import React, { useEffect, useState } from 'react';

import { TextField } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import LoginContainer from '../../../components/LoginContainer/LoginContainer'
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
        <LoginContainer
            title='Récupération du compte'
            error={connectionError}>

            <TextField
                label="Email"
                variant="outlined"
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
                Réinitialiser le mot de passe
            </LoadingButton>

        </LoginContainer>
    );
};

export default ResetPassword;
