import { useNavigate } from 'react-router-dom';
import * as React from 'react';
import './header.css';
import { Button } from '@mui/material';

interface HeaderProps {
    isLoggedIn: () => boolean;
    handleLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, handleLogout }) => {
    const navigate = useNavigate();

    return (
        <div className="header">
            <img
                className="logo"
                src="/logo.png"
                alt="Logo"
                onClick={() => navigate('/')}
            />

            {isLoggedIn() && (
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                        handleLogout();
                        navigate('/');
                    }}
                >
                    Logout
                </Button>
            )}
        </div>
    );
};

export default Header;
