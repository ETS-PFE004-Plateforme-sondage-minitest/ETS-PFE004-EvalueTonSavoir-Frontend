// Home.tsx
import React from 'react';
import { Link } from 'react-router-dom';

import './home.css';
import '../../index.css';

const Home: React.FC = () => {
    return (
        <div className="pageContainer">
            <h1 className="page-title">Évalue ton savoir</h1>
            <div className="btn-container">
                <Link to="/student/join-room" className="homepage-btn big-btn-general-style">
                    Espace
                    <br />
                    étudiant
                </Link>
                <Link to="/teacher/dashboard" className="homepage-btn big-btn-general-style">
                    Espace
                    <br />
                    enseignant
                </Link>
            </div>
        </div>
    );
};

export default Home;
