// Dashboard.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { parse } from 'gift-pegjs';
import { v4 as uuidv4 } from 'uuid';

import Modal from '../../../components/ConfirmDialog/ConfirmDialog';
import Template from '../../../components/GiftTemplate/templates';
import { QuizType } from '../../../Types/QuizType';
import { QuestionService } from '../../../services/QuestionService';

import './dashboard.css';
import ImportModal from '../../../components/ImportModal/ImportModal';
//import useCheckMobileScreen from '../../../services/useCheckMobileScreen';
import {
    TextField,
    IconButton,
    InputAdornment,
    Button,
    Tooltip,
    Checkbox,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import {
    Search,
    DeleteOutline,
    FileDownload,
    Add,
    Upload,
    ContentCopy,
    Edit
} from '@mui/icons-material';
import ConfirmDialog from '../../../components/ConfirmDialog/ConfirmDialog';

const Dashboard: React.FC = () => {
    const [quizzes, setQuizzes] = useState<QuizType[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [quizIdsToRemove, setQuizIdsToRemove] = useState<string[]>([]);
    const [quizTitleToRemove, setQuizTitleToRemove] = useState<string>('');
    const [showImportModal, setShowImportModal] = useState<boolean>(false);
    const [selectedQuizes, setSelectedQuizes] = useState<string[]>([]);
    const [isSelectAll, setIsSelectAll] = useState<boolean>(false);

    //const isMobile = useCheckMobileScreen();

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
        <>
            <div className="dashboard-container">
                <div className="action-bar">
                    <h1 className="page-title">Tableau de bord</h1>
                    <div className="button-group">
                        <Button
                            component={Link}
                            to="/teacher/editor-quiz/new"
                            variant="outlined"
                            color="primary"
                            startIcon={<Add />}
                        >
                            Ajouter
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<Upload />}
                            onClick={() => setShowImportModal(true)}
                        >
                            Importer
                        </Button>
                    </div>
                </div>
                <div className="search-bar">
                    <TextField
                        onChange={handleSearch}
                        value={searchTerm}
                        placeholder="Rechercher un quiz"
                        fullWidth
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton>
                                        <Search />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                </div>
                <div className="button-group">
                    <Checkbox checked={isSelectAll} onChange={handleSelectAll} />
                    <Tooltip title="Exporter">
                        <IconButton color="secondary" onClick={downloadTxtFile}>
                            <FileDownload />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer">
                        <IconButton
                            color="secondary"
                            onClick={() => handleRemoveQuiz(selectedQuizes)}
                        >
                            <DeleteOutline />
                        </IconButton>
                    </Tooltip>
                </div>

                <List disablePadding>
                    {filteredQuizzes.map((quiz: QuizType) => (
                        <ListItem key={quiz.id} disablePadding>
                            <ListItemButton
                                role={undefined}
                                onClick={() => handleOnCheckQuiz(quiz.id)}
                                dense
                            >
                                <ListItemIcon>
                                    <Checkbox
                                        edge="start"
                                        checked={selectedQuizes.includes(quiz.id)}
                                        tabIndex={-1}
                                        disableRipple
                                    />
                                </ListItemIcon>
                                <ListItemText id={quiz.id + quiz.title} primary={quiz.title} />
                                <div className="button-group">
                                    <IconButton
                                        component={Link}
                                        to={`/teacher/editor-quiz/${quiz.id}`}
                                    >
                                        <Edit />
                                    </IconButton>
                                    <IconButton onClick={() => handleDuplicateQuiz(quiz.id)}>
                                        <ContentCopy />
                                    </IconButton>
                                    <Button
                                        component={Link}
                                        to={`/teacher/manage-room/${quiz.id}`}
                                        variant="contained"
                                        disabled={!validQuiz(quiz.questions)}
                                    >
                                        {validQuiz(quiz.questions) ? 'Lancer' : 'Quiz invalide'}
                                    </Button>
                                </div>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </div>
            <ConfirmDialog
                open={quizIdsToRemove.length > 0}
                title="Confirmation"
                message={quizRemoveMessage}
                onConfirm={handleConfirmRemoveQuiz}
                onCancel={handleCancelRemoveQuiz}
                buttonOrderType="warning"
            />
            <ImportModal
                open={showImportModal}
                handleOnClose={() => setShowImportModal(false)}
                handleOnImport={handleOnImport}
            />
        </>
    );
};

export default Dashboard;
