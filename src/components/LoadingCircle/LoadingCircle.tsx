import { CircularProgress } from '@mui/material';
import React from 'react';
import './LoadingCircle.css';

interface Props {
    text: string;
}

const LoadingCircle: React.FC<Props> = ({ text }) => {
    return (
        <div className="loading-circle">
            <CircularProgress />
            <div className="text-base">{text}</div>
        </div>
    );
};

export default LoadingCircle;
