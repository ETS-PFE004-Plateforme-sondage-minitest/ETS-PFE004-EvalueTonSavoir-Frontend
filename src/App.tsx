import { Routes, Route } from "react-router-dom";

// Pages
import Home from './pages/Home/Home';
// Pages espace enseignant
import Dashboard from './pages/Teacher/Dashboard/Dashboard';
import ManageRoom from './pages/Teacher/ManageRoom/ManageRoom';
import TeacherRoom from './pages/Teacher/TeacherRoom/TeacherRoom';
import CreateQuiz from './pages/Teacher/CreateQuiz/CreateQuiz';
import EditQuiz from './pages/Teacher/EditQuiz/EditQuiz';
// Pages espace étudiant
import JoinRoom from './pages/Student/JoinRoom/JoinRoom';
import StudentPage from './pages/Student/StudentPage/StudentPage';


function App() {
    return (
        <div className="wrapper">
            <div className="app">
                <main>
                    <Routes>
                        <Route path="/" element={<Home />} />

                        {/* Pages espace enseignant */}
                        <Route path="/teacher/dashboard" element={<Dashboard />} />
                        <Route path="/teacher/create-quiz" element={<CreateQuiz />} />
                        <Route path="/teacher/edit-quiz/:id" element={<EditQuiz />} />
                        <Route path="/teacher/manage-room/:id" element={<ManageRoom />} />
                        <Route path="/teacher/room/:room/:id" element={<TeacherRoom />} />
                        {/* Pages espace étudiant */}
                        <Route path="/student/join-room" element={<JoinRoom />} />
                        <Route path="/student/mock-quiz" element={<StudentPage />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
}

export default App;