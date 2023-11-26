// Home.tsx
import React from 'react';

import './home.css';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    return (
        <div className="page-container">
            <div className="btn-container">
                <Button component={Link} to="/student/join-room" variant="contained">
                    <div className="btn-student">
                        <div className="big-title">
                            Espace
                            <br />
                            étudiant
                        </div>
                        <div className="right-component">
                            <img src="student.svg" width="50%" />
                        </div>
                    </div>
                </Button>
                <Button component={Link} to="/teacher/dashboard" variant="contained">
                    <div className="btn-teacher">
                        <img src="teacher.svg" width="50%" />
                        <div className="right-component big-title">
                            Espace <br />
                            enseignant
                        </div>
                    </div>
                </Button>
            </div>
        </div>
    );
};

export default Home;
