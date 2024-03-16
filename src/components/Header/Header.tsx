import { useNavigate } from 'react-router-dom';
import * as React from 'react';
import './header.css';

interface HeaderProps {

}

const Header: React.FC<HeaderProps> = ({ }) => {
    const navigate = useNavigate();

    return (
        <div className="header">
            <img
                className="logo"
                src="/logo.png"
                alt="Logo"
                onClick={() => navigate('/')}
            />
        </div>
    );
};

export default Header;
