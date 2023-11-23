// Home.tsx
import React from 'react';

import './Home.css';
import '../../index.css';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    return (
        <div className="page-container">
            <div className="btn-container">
                <Button component={Link} to="/student/join-room" variant="contained">
                    <div className="btn-student">
                        <h1>
                            Espace
                            <br />
                            étudiant
                        </h1>
                        <div className="right-component">
                            <img src="student.svg" width="50%" />
                        </div>
                    </div>
                </Button>
                <Button component={Link} to="/teacher/dashboard" variant="contained">
                    <div className="btn-teacher">
                        <img src="teacher.svg" width="50%" />
                        <h1 className="right-component">
                            Espace <br />
                            enseignant
                        </h1>
                    </div>
                </Button>
            </div>
        </div>
    );
};

export default Home;
