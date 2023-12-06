// Home.tsx
import React from 'react';

import './home.css';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    return (
        <div className="page-container">
            <div className="btn-container">
                <Link to="/student/join-room" className="student-btn">
                    <div className="big-title">
                        Espace
                        <br />
                        étudiant
                    </div>
                    <div className="right-component">
                        <img src="student.svg" />
                    </div>
                </Link>
                <Link to="/teacher/dashboard" className="teacher-btn">
                    <div>
                        <img src="teacher.svg" />
                    </div>
                    <div className="right-component big-title">
                        Espace <br />
                        enseignant
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default Home;
