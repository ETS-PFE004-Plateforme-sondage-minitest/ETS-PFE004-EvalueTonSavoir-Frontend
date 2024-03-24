import * as React from 'react';
import './loginContainer.css';

interface LoginContainerProps {
    title: string;
    error: string;
    children: React.ReactNode;
}

const LoginContainer: React.FC<LoginContainerProps> = ({ title, error, children}) => {
    return (
        <div className="login-container">

            <h1 className="title">{title}</h1>

            <div className="inputs">
                <img className="avatar" src="./people.svg"></img>

                <div className="error-text">{error}</div>

                {children}

            </div>
            
        </div>
    );
};

export default LoginContainer;