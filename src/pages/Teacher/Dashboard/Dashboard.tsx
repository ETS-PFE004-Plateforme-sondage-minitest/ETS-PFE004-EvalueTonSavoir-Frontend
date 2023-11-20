// Dashboard.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { parse } from 'gift-pegjs';
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashCan, faClone, faPencil, faPlay } from '@fortawesome/free-solid-svg-icons';

import Modal from '../../../components/Modal/Modal';
import Template from '../../../components/GiftTemplate/templates';
import { QuizType } from '../../../Types/QuizType';

import './dashboard.css';
import ImportModal from '../../../components/ImportModal/ImportModal';

const Dashboard: React.FC = () => {
    const [quizzes, setQuizzes] = useState<QuizType[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [quizToRemove, setQuizToRemove] = useState<QuizType | null>(null);
    const [showImportModal, setShowImportModal] = useState<boolean>(false);

    useEffect(() => {
        // Fetch quizzes from local storage
        const storedQuizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
        setQuizzes(storedQuizzes);
    }, []);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleRemoveQuiz = (quiz: QuizType) => {
        setQuizToRemove(quiz);
    };

    const handleConfirmRemoveQuiz = () => {
        const updatedQuizzes = quizzes.filter((quiz: QuizType) => quiz.id !== quizToRemove?.id);
        localStorage.setItem('quizzes', JSON.stringify(updatedQuizzes));
        setQuizzes(updatedQuizzes);
        setQuizToRemove(null);
    };

    const handleCancelRemoveQuiz = () => {
        setQuizToRemove(null);
    };

    const handleDuplicateQuiz = (id: string) => {
        const quizToDuplicate = quizzes.find((quiz: QuizType) => quiz.id === id);
        if (!quizToDuplicate) return;

        const existingQuizzesWithTitle = Object.values(quizzes).filter(
            (quiz: QuizType) =>
                quiz.title === quizToDuplicate.title ||
                quiz.title.match(new RegExp(`${quizToDuplicate.title} \\(\\d+\\)$`))
        );
        const titleSuffix =
            existingQuizzesWithTitle.length > 0 ? ` (${existingQuizzesWithTitle.length})` : '';

        const duplicatedQuiz: QuizType = {
            ...quizToDuplicate,
            id: uuidv4(),
            title: quizToDuplicate.title + titleSuffix || 'Untitled Quiz'
        };
        const updatedQuizzes: QuizType[] = [...quizzes, duplicatedQuiz];
        localStorage.setItem('quizzes', JSON.stringify(updatedQuizzes));
        setQuizzes(updatedQuizzes);
    };

    const filteredQuizzes = useMemo(() => {
        return quizzes.filter(
            (quiz) =>
                quiz && quiz.title && quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [quizzes, searchTerm]);

    const handleOnImport = () => {
        const storedQuizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
        setQuizzes(storedQuizzes);
        setShowImportModal(false);
    };

    const validQuiz = (questions: string[]) => {
        if (questions.length === 0) {
            return false;
        }

        // Check if I can generate the Template for each question
        // Otherwise the quiz is invalid
        for (let i = 0; i < questions.length; i++) {
            try {
                const parsedItem = parse(questions[i]);
                Template(parsedItem[0]);
            } catch (error) {
                return false;
            }
        }

        return true;
    };

    return (
        <div>
            <div className="dashboardContainer">
                <h1 className="page-title">Tableau de bord</h1>
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Rechercher un quiz"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <Link to="/teacher/editor-quiz/new">
                        <FontAwesomeIcon icon={faPlus} />
                    </Link>
                    <button onClick={() => setShowImportModal(true)}>Import</button>
                </div>
                <ul>
                    {filteredQuizzes.map((quiz: QuizType) => (
                        <li key={quiz.id}>
                            <div className="quiz-card-control">
                                <h3 className="quizTitle">{quiz.title}</h3>
                                <div>
                                    <a
                                        className="red-btn"
                                        onClick={() => handleRemoveQuiz(quiz)}
                                        title="Supprimer le quiz"
                                    >
                                        <FontAwesomeIcon icon={faTrashCan} />
                                    </a>
                                    <a
                                        className="blue-btn"
                                        onClick={() => handleDuplicateQuiz(quiz.id)}
                                        title="Dupliquer le quiz"
                                    >
                                        <FontAwesomeIcon icon={faClone} />
                                    </a>
                                    <Link
                                        className="blue-btn"
                                        to={`/teacher/editor-quiz/${quiz.id}`}
                                        title="Modifier le quiz"
                                    >
                                        <FontAwesomeIcon icon={faPencil} />
                                    </Link>
                                </div>
                            </div>
                            {validQuiz(quiz.questions) ? (
                                <Link
                                    className="green-btn"
                                    to={`/teacher/manage-room/${quiz.id}`}
                                    title="Démarrer une session"
                                >
                                    <FontAwesomeIcon icon={faPlay} />
                                </Link>
                            ) : (
                                <div className="invalid-quiz">Quiz invalide</div>
                            )}
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
            {showImportModal && (
                <ImportModal
                    handleOnClose={() => setShowImportModal(false)}
                    handleOnImport={handleOnImport}
                />
            )}
        </div>
    );
};

export default Dashboard;
