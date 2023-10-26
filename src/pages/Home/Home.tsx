// Home.tsx
import React from 'react';
import { Link } from 'react-router-dom';

import './home.css';

const Home: React.FC = () => {
    return (
        <div>
            <h2 className='page-title centered'>Évalue Ton Savoir</h2>
            <div className='btn-container'>
                <Link to='/student/join-room' className='homepage-btn'>Espace<br />étudiant</Link>
                <Link to='/teacher/dashboard' className='homepage-btn'>Espace<br />enseignant</Link>
            </div>
        </div>
    );
};

export default Home;