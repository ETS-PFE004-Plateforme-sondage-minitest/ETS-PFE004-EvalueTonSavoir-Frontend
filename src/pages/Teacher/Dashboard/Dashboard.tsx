// Dashboard.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { parse } from 'gift-pegjs';
import { v4 as uuidv4 } from 'uuid';

import Template from '../../../components/GiftTemplate/templates';
import { QuizType } from '../../../Types/QuizType';
import { QuestionService } from '../../../services/QuestionService';

import './dashboard.css';
import ImportModal from '../../../components/ImportModal/ImportModal';
import axios from 'axios';

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
    ListItemText,
    Divider
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
import useCheckMobileScreen from '../../../services/useCheckMobileScreen';
const api = "http://localhost:4400/";
const iduser = "65c92c3462badbf6d78cf406";
function getAuthToken(): string | null {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1yb3lzdGFnZUBvdXRsb29rLmNvbSIsImlhdCI6MTcwODY1NTI1N30.xG-IumR_R4CKe4DvSJP2ZNraLoBUD1rgmbmOIFOVJBE";
    return token;
}
//const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1yb3lzdGFnZUBvdXRsb29rLmNvbSIsImlhdCI6MTcwODY1NDAzM30.1TdXVUJMvuaE0cZ_oBihT6AddzyQlCRcek9iKnhlTkA";
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
        const fetchQuizzes = async () => {
            try {
                const token = getAuthToken();
                const headers = {
                    Authorization: `Bearer ${token}`
                };
                const response = await axios.get(api + `quiz/getAllByUserId/` + iduser, {
                    headers: headers
                });
                //const response = await axios.get(api + 'quiz/getAllByUserId/' + iduser);
                setQuizzes(response.data.quizzes);
            } catch (error) {
                console.error('Error fetching quizzes:', error);
            }
        };
        fetchQuizzes();
    }, []);

    useEffect(() => {
        if (selectedQuizes.length === 0) setIsSelectAll(false);
    }, [selectedQuizes]);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    /* const handleRemoveQuiz = (quizIds: string[]) => {
         setQuizIdsToRemove(quizIds);
         if (quizIds.length === 1) {
             const selectedQuiz = quizzes.find((quiz) => quizIds[0] === quiz._id);
             setQuizTitleToRemove(selectedQuiz?.title || '');
         }
     };*/
    const handleRemoveQuiz = async (quizIds: string[]) => {
        try {
            // Send DELETE request for each quiz to be removed
            for (const quizId of quizIds) {
                const token = getAuthToken();
                const headers = {
                    Authorization: `Bearer ${token}`
                };
                await axios.delete(api + 'quiz/delete/' + quizId, {
                    headers: headers
                });
            }

            // Update the state to remove the deleted quizzes
            const updatedQuizzes = quizzes.filter((quiz) => !quizIds.includes(quiz._id));
            setQuizzes(updatedQuizzes);
            setSelectedQuizes([]);
            setQuizIdsToRemove([]);
            setQuizTitleToRemove('');
        } catch (error) {
            console.error('Error removing quizzes:', error);
        }
    };

    const handleConfirmRemoveQuiz = () => {
        const updatedQuizzes = quizzes.filter(
            (quiz: QuizType) => !quizIdsToRemove.includes(quiz._id)
        );
        setQuizzes(updatedQuizzes);
        setSelectedQuizes([]);
        setQuizIdsToRemove([]);
        setQuizTitleToRemove('');
    };

    const handleCancelRemoveQuiz = () => {
        setQuizIdsToRemove([]);
    };

    const handleDuplicateQuiz = async (id: string) => {
        try {
            const quizToDuplicate = quizzes.find((quiz: QuizType) => quiz._id === id);
            if (!quizToDuplicate) return;

            const existingQuizzesWithTitle = quizzes.filter(
                (quiz: QuizType) =>
                    quiz.title === quizToDuplicate.title ||
                    quiz.title.match(new RegExp(`${quizToDuplicate.title} \\(\\d+\\)$`))
            );
            const titleSuffix =
                existingQuizzesWithTitle.length > 0 ? ` (${existingQuizzesWithTitle.length})` : '';

            const duplicatedQuiz: QuizType = {
                ...quizToDuplicate,
                _id: uuidv4(),
                title: quizToDuplicate.title + titleSuffix || 'Untitled Quiz'
            };
            const token = getAuthToken();
            const headers = {
                Authorization: `Bearer ${token}`
            };
            const response = await axios.post(api + 'quiz/duplicate/' + id, { iduser: iduser, quiz: duplicatedQuiz }, {
                headers: headers
            });
            setQuizzes([...quizzes, response.data]);
            window.location.reload();
        } catch (error) {
            console.error('Error duplicating quiz:', error);
        }
    };

    const filteredQuizzes = useMemo(() => {
        return quizzes.filter(
            (quiz) =>
                quiz && quiz.title && quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [quizzes, searchTerm]);

    const handleOnImport = () => {
        setShowImportModal(true);

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

    const downloadTxtFile = async (quizIds: string[]) => {
        try {
            const selectedQuizzes = quizzes.filter((quiz) => quizIds.includes(quiz._id));

            selectedQuizzes.forEach((quiz, index) => {
                const { title, questions } = quiz;
                let quizContent = '';

                questions.forEach((question, qIndex) => {
                    const formattedQuestion = question.trim();
                    if (formattedQuestion !== '') {
                        quizContent += formattedQuestion;
                        if (qIndex !== questions.length - 1) {
                            quizContent += '\n';
                        }
                    }
                });

                const blob = new Blob([quizContent], { type: 'text/plain' });
                const a = document.createElement('a');
                const filename = title || `quiz_${index}`;
                a.download = `${filename}.txt`;
                a.href = window.URL.createObjectURL(blob);
                a.click();
            });
        } catch (error) {
            console.error('Error exporting selected quizzes:', error);
        }
    };






    const handleSelectAll = () => {
        if (isSelectAll) {
            setIsSelectAll(false);
            setSelectedQuizes([]);
        } else {
            setIsSelectAll(true);
            setSelectedQuizes(quizzes.map((quiz) => quiz._id));
        }
    };

    const quizRemoveMessage =
        quizIdsToRemove.length > 1
            ? `Êtes-vous sûr de vouloir supprimer ${quizIdsToRemove.length} quiz?`
            : `Êtes-vous sûr de vouloir supprimer le quiz ${quizTitleToRemove}?`;
    return (
        <div className="dashboard-wrapper">
            <div className="dashboard-container">
                {isMobile && <div className="page-title mb-1">Tableau de bord</div>}
                <div className="action-bar">
                    {!isMobile && <div className="page-title">Tableau de bord</div>}
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
                            onClick={handleOnImport}
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
                    <Tooltip title="Tout sélectionner" placement="top">
                        <Checkbox checked={isSelectAll} onChange={handleSelectAll} />
                    </Tooltip>
                    <Tooltip title="Exporter" placement="top">
                        <IconButton color="secondary" onClick={() => downloadTxtFile(selectedQuizes)}>
                            <FileDownload />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer" placement="top">
                        <IconButton
                            color="secondary"
                            onClick={() => handleRemoveQuiz(selectedQuizes)}
                        >
                            <DeleteOutline />
                        </IconButton>
                    </Tooltip>
                </div>

                <List disablePadding sx={{ overflowY: 'auto', height: '100%' }}>
                    {filteredQuizzes.map((quiz: QuizType) => (
                        <div key={`key-${quiz._id}`}>
                            <Divider />
                            <ListItem key={quiz._id} disablePadding>
                                <ListItemButton
                                    role={undefined}
                                    onClick={() => handleOnCheckQuiz(quiz._id)}
                                    dense
                                >
                                    <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            checked={selectedQuizes.includes(quiz._id)}
                                            tabIndex={-1}
                                            disableRipple
                                        />
                                    </ListItemIcon>
                                    <ListItemText id={quiz._id + quiz.title} primary={quiz.title} />
                                    <div className="button-group">
                                        <Tooltip title="Modifier" placement="top">
                                            <IconButton
                                                component={Link}
                                                to={`/teacher/editor-quiz/${quiz._id}`}
                                            >
                                                <Edit />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Dupliquer" placement="top">
                                            <IconButton
                                                onClick={() => handleDuplicateQuiz(quiz._id)}
                                            >
                                                <ContentCopy />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Lancer" placement="top">
                                            <Button
                                                component={Link}
                                                to={`/teacher/manage-room/${quiz._id}`}
                                                variant="contained"
                                                disabled={!validQuiz(quiz.questions)}
                                            >
                                                Lancer
                                            </Button>
                                        </Tooltip>
                                    </div>
                                </ListItemButton>
                            </ListItem>
                        </div>
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
        </div>
    );
};

export default Dashboard;
