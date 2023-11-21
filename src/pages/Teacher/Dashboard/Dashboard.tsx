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
import { QuestionService } from '../../../services/QuestionService';

import './dashboard.css';
import ImportModal from '../../../components/ImportModal/ImportModal';
import useCheckMobileScreen from '../../../services/useCheckMobileScreen';

const Dashboard: React.FC = () => {
    const [quizzes, setQuizzes] = useState<QuizType[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [quizIdsToRemove, setQuizIdsToRemove] = useState<string[]>([]);
    const [quizTitleToRemove, setQuizTitleToRemove] = useState<string>('');
    const [showImportModal, setShowImportModal] = useState<boolean>(false);
    const [selectedQuizes, setSelectedQuizes] = useState<string[]>([]);
    const [isSelectAll, setIsSelectAll] = useState<boolean>(false);

    const isMobile = useCheckMobileScreen();

    useEffect(() => {
        // Fetch quizzes from local storage
        const storedQuizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
        setQuizzes(storedQuizzes);
    }, []);

    useEffect(() => {
        if (selectedQuizes.length === 0) setIsSelectAll(false);
    }, [selectedQuizes]);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleRemoveQuiz = (quizIds: string[]) => {
        setQuizIdsToRemove(quizIds);
        if (quizIds.length === 1) {
            const selectedQuiz = quizzes.find((quiz) => quizIds[0] === quiz.id);
            setQuizTitleToRemove(selectedQuiz?.title || '');
        }
    };

    const handleConfirmRemoveQuiz = () => {
        const updatedQuizzes = quizzes.filter(
            (quiz: QuizType) => !quizIdsToRemove.includes(quiz.id)
        );
        localStorage.setItem('quizzes', JSON.stringify(updatedQuizzes));
        setQuizzes(updatedQuizzes);
        setSelectedQuizes([]);
        setQuizIdsToRemove([]);
        setQuizTitleToRemove('');
    };

    const handleCancelRemoveQuiz = () => {
        setQuizIdsToRemove([]);
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
                questions[i] = QuestionService.ignoreImgTags(questions[i]);
                const parsedItem = parse(questions[i]);
                Template(parsedItem[0]);
            } catch (error) {
                return false;
            }
        }

        return true;
    };

    const handleOnCheckQuiz = (selectedQuizId: string) => {
        const quizSelected = selectedQuizes.includes(selectedQuizId);

        if (quizSelected) {
            setSelectedQuizes((prevQuizes) =>
                prevQuizes.filter((quizId) => selectedQuizId !== quizId)
            );
        } else {
            setSelectedQuizes((prevItems) => [...prevItems, selectedQuizId]);
        }
    };

    const downloadTxtFile = () => {
        quizzes
            .filter((quiz) => selectedQuizes.includes(quiz.id))
            .forEach((quiz) => {
                const quizQuestionsString = quiz.questions.join('\n');
                const blob = new Blob([quizQuestionsString], { type: 'text/plain' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `${quiz.title}.txt`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
    };

    const handleSelectAll = () => {
        if (isSelectAll) {
            setIsSelectAll(false);
            setSelectedQuizes([]);
        } else {
            setIsSelectAll(true);
            setSelectedQuizes(quizzes.map((quiz) => quiz.id));
        }
    };

    const quizRemoveMessage =
        quizIdsToRemove.length > 1
            ? `Êtes-vous sûr de vouloir supprimer ${quizIdsToRemove.length} quiz?`
            : `Êtes-vous sûr de vouloir supprimer le quiz ${quizTitleToRemove}?`;
    return (
        <div>
            <div className="dashboardContainer">
                <h1 className="page-title">Tableau de bord</h1>
                <div className="action-bar">
                    {!isMobile && (
                        <div className="select-all-checkbox">
                            <input
                                type="checkbox"
                                checked={isSelectAll}
                                onChange={handleSelectAll}
                            />
                        </div>
                    )}
                    <input
                        className="search-bar"
                        type="text"
                        placeholder="Rechercher un quiz"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <Link to="/teacher/editor-quiz/new">
                        <FontAwesomeIcon icon={faPlus} />
                    </Link>
                    <button onClick={() => setShowImportModal(true)}>Import</button>
                    {selectedQuizes.length > 0 && (
                        <>
                            <button onClick={downloadTxtFile}>Export</button>
                            <a
                                className="red-btn"
                                onClick={() => handleRemoveQuiz(selectedQuizes)}
                                title="Supprimer les quiz"
                            >
                                <FontAwesomeIcon icon={faTrashCan} />
                            </a>
                        </>
                    )}
                </div>
                <ul>
                    {filteredQuizzes.map((quiz: QuizType) => (
                        <li key={quiz.id}>
                            <input
                                type="checkbox"
                                checked={selectedQuizes.includes(quiz.id)}
                                onChange={() => handleOnCheckQuiz(quiz.id)}
                            />
                            <div className="quiz-card-control">
                                <h3 className="quizTitle selectable-text">{quiz.title}</h3>
                                <div>
                                    <a
                                        className="red-btn"
                                        onClick={() => handleRemoveQuiz([quiz.id])}
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
            {quizIdsToRemove.length > 0 && (
                <Modal
                    title="Confirmation"
                    message={quizRemoveMessage}
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
