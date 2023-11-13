// App.tsx
import { Routes, Route } from 'react-router-dom';

// Pages
import Home from './pages/Home/Home';
// Pages espace enseignant
import Dashboard from './pages/Teacher/Dashboard/Dashboard';
import ManageRoom from './pages/Teacher/ManageRoom/ManageRoom';
import QuizForm from './pages/Teacher/EditorQuiz/EditorQuiz';
// Pages espace étudiant
import JoinRoom from './pages/Student/JoinRoom/JoinRoom';

function App() {
    return (
        <div className="wrapper">
            <img className="logo" src="/Logo.svg" alt="Logo" />
            <div className="app">
                <main>
                    <Routes>
                        <Route path="/" element={<Home />} />

                        {/* Pages espace enseignant */}
                        <Route path="/teacher/dashboard" element={<Dashboard />} />
                        <Route path="/teacher/editor-quiz/:id" element={<QuizForm />} />
                        <Route path="/teacher/manage-room/:id" element={<ManageRoom />} />
                        {/* Pages espace étudiant */}
                        <Route path="/student/join-room" element={<JoinRoom />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
}

export default App;
