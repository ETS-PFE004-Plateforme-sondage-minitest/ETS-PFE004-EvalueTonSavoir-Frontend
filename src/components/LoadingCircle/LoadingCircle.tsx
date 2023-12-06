import { CircularProgress } from '@mui/material';
import React from 'react';
import './loadingCircle.css';

interface Props {
    text: string;
}

const LoadingCircle: React.FC<Props> = ({ text }) => {
    return (
        <div className="loading-circle">
            <div className="text-base">{text}</div>
            <CircularProgress />
        </div>
    );
};

export default LoadingCircle;
