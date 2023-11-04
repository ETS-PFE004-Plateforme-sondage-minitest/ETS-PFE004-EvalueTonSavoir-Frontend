// Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../../../components/Modal/Modal';
import { v4 as uuidv4 } from 'uuid';
import './dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashCan, faClone, faPencil, faPlay } from '@fortawesome/free-solid-svg-icons';

interface Quiz {
    id: string;
    title: string;
    questions: string;
}

const Dashboard: React.FC = () => {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [quizToRemove, setQuizToRemove] = useState<Quiz | null>(null);

    useEffect(() => {
        // Fetch quizzes from local storage
        const storedQuizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
        setQuizzes(storedQuizzes);
    }, []);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleRemoveQuiz = (quiz: Quiz) => {
        setQuizToRemove(quiz);
    };

    const handleConfirmRemoveQuiz = () => {
        const updatedQuizzes = quizzes.filter((quiz: Quiz) => quiz.id !== quizToRemove?.id);
        localStorage.setItem('quizzes', JSON.stringify(updatedQuizzes));
        setQuizzes(updatedQuizzes);
        setQuizToRemove(null);
    };

    const handleCancelRemoveQuiz = () => {
        setQuizToRemove(null);
    };

    const handleDuplicateQuiz = (id: string) => {
        const quizToDuplicate = quizzes.find((quiz: Quiz) => quiz.id === id);
        if (!quizToDuplicate) return;

        const existingQuizzesWithTitle = Object.values(quizzes).filter(
            (quiz: Quiz) =>
                quiz.title === quizToDuplicate.title ||
                quiz.title.match(new RegExp(`${quizToDuplicate.title} \\(\\d+\\)$`))
        );
        const titleSuffix =
            existingQuizzesWithTitle.length > 0 ? ` (${existingQuizzesWithTitle.length})` : '';

        const duplicatedQuiz: Quiz = {
            ...quizToDuplicate,
            id: uuidv4(),
            title: quizToDuplicate.title + titleSuffix || 'Untitled Quiz'
        };
        const updatedQuizzes: Quiz[] = [...quizzes, duplicatedQuiz];
        localStorage.setItem('quizzes', JSON.stringify(updatedQuizzes));
        setQuizzes(updatedQuizzes);
    };

    const filteredQuizzes: Quiz[] = quizzes.filter((quiz: Quiz) =>
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="wrapper">
            <div>
                <h2>Quiz Dashboard</h2>
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search quizzes"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <Link to="/teacher/create-quiz">
                        <FontAwesomeIcon icon={faPlus} />
                    </Link>
                </div>
                <ul>
                    {filteredQuizzes.map((quiz: Quiz) => (
                        <li key={quiz.id}>
                            <h3>{quiz.title}</h3>
                            <a
                                className="red-btn"
                                onClick={() => handleRemoveQuiz(quiz)}
                                title="Supprimer"
                            >
                                <FontAwesomeIcon icon={faTrashCan} />
                            </a>
                            <a
                                className="blue-btn"
                                onClick={() => handleDuplicateQuiz(quiz.id)}
                                title="Dupliquer"
                            >
                                <FontAwesomeIcon icon={faClone} />
                            </a>
                            <Link
                                className="blue-btn"
                                to={`/teacher/edit-quiz/${quiz.id}`}
                                title="Modifier"
                            >
                                <FontAwesomeIcon icon={faPencil} />
                            </Link>
                            <Link
                                className="green-btn"
                                to={`/teacher/manage-room/${quiz.id}`}
                                title="Démarrer"
                            >
                                <FontAwesomeIcon icon={faPlay} />
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            {quizToRemove && (
                <Modal
                    title="Confirmation"
                    message={`Êtes-vous sûr de vouloir supprimer le quiz "${quizToRemove.title}" ?`}
                    onConfirm={handleConfirmRemoveQuiz}
                    onCancel={handleCancelRemoveQuiz}
                />
            )}
        </div>
    );
};

export default Dashboard;
