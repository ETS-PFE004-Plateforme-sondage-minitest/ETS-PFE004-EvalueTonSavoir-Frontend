// App.tsx
import { Routes, Route } from 'react-router-dom';

// Page main
import Home from './pages/Home/Home';

// Pages espace enseignant
import Dashboard from './pages/Teacher/Dashboard/Dashboard';
import Login from './pages/Teacher/Login/Login';
import Register from './pages/Teacher/Register/Register';
import ResetPassword from './pages/Teacher/ResetPassword/ResetPassword';
import ManageRoom from './pages/Teacher/ManageRoom/ManageRoom';
import QuizForm from './pages/Teacher/EditorQuiz/EditorQuiz';

// Pages espace étudiant
import JoinRoom from './pages/Student/JoinRoom/JoinRoom';

// Header/Footer import
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

import ApiService from './services/ApiService';

const handleLogout = () => {
    ApiService.logout();
}

const isLoggedIn = () => {
    return ApiService.isLogedIn();
}

function App() {
    return (
        <div className="content">
                <Header
                isLoggedIn={isLoggedIn}
                handleLogout={handleLogout}/>
            <div className="app">
                <main>
                    <Routes>
                        {/* Page main */}
                        <Route path="/" element={<Home />} />

                        {/* Pages espace enseignant */}
                        <Route path="/teacher/login" element={<Login />} />
                        <Route path="/teacher/register" element={<Register />} />
                        <Route path="/teacher/resetPassword" element={<ResetPassword />} />
                        <Route path="/teacher/dashboard" element={<Dashboard />} />
                        <Route path="/teacher/editor-quiz/:id" element={<QuizForm />} />
                        <Route path="/teacher/manage-room/:id" element={<ManageRoom />} />

                        {/* Pages espace étudiant */}
                        <Route path="/student/join-room" element={<JoinRoom />} />
                    </Routes>
                </main>
            </div>
                <Footer/>
        </div>
    );
}

export default App;
