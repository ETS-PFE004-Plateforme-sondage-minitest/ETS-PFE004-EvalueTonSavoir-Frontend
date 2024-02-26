// Dashboard.tsx
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { parse } from 'gift-pegjs';

import Template from '../../../components/GiftTemplate/templates';
import { QuizType } from '../../../Types/QuizType';
import { FolderType } from '../../../Types/FolderType';
import { QuestionService } from '../../../services/QuestionService';
import ApiService from '../../../services/ApiService';

import './dashboard.css';
import ImportModal from '../../../components/ImportModal/ImportModal';
//import axios from 'axios';

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

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [quizzes, setQuizzes] = useState<QuizType[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [quizIdsToRemove, setQuizIdsToRemove] = useState<string[]>([]);
    const [quizTitleToRemove, setQuizTitleToRemove] = useState<string>('');
    const [showImportModal, setShowImportModal] = useState<boolean>(false);
    const [selectedQuizes, setSelectedQuizes] = useState<string[]>([]);
    const [isSelectAll, setIsSelectAll] = useState<boolean>(false);

    const [folders, setFolders] = useState<FolderType[]>([]);
    const [selectedFolder, setSelectedFolder] = useState<string>(''); // Selected folder

    const isMobile = useCheckMobileScreen();

    useEffect(() => {
        const fetchData = async () => {
            if (!await ApiService.isLogedIn()) {
                navigate("/teacher/login");
            }
            
            const userFolders = await ApiService.getUserFolders();
            setFolders(userFolders);
        };

        fetchData();
    }, []);

    const handleSelectFolder = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedFolder(event.target.value);
    };


    useEffect(() => {
        const fetchQuizzesForFolder = async () => {            
            if (selectedFolder) {
                const folderQuizzes = await ApiService.getFolderContent(selectedFolder);
                setQuizzes(folderQuizzes);
            }
        };

        fetchQuizzesForFolder();
    }, [selectedFolder]);

    useEffect(() => {
        if (selectedQuizes.length === 0) setIsSelectAll(false);
    }, [selectedQuizes]);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleRemoveQuiz = async (quizIds: string[]) => {
        try {
            // Send DELETE request for each quiz to be removed
            for (const quizId of quizIds) {
                await ApiService.deleteQuiz(quizId);
            }

            // Update the state to remove the deleted quizzes
            const updatedQuizzes = quizzes.filter((quiz) => !quizIds.includes(quiz._id));
            setQuizzes(updatedQuizzes);
            setSelectedQuizes([]);
            setQuizIdsToRemove([]);
            setQuizTitleToRemove('');
        } catch (error) {
            console.error('Error removing quizzes:', error);
            throw error; // Optional: rethrow the error to handle it elsewhere
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

    /* const handleDuplicateQuiz = async (id: string) => {
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
     };*/
    const handleDuplicateQuiz = async (quizId: string) => {
        try {
            const quizToDuplicate = quizzes.find((quiz) => quiz._id === quizId);
            if (!quizToDuplicate) {
                console.error(`Quiz with ID ${quizId} not found.`);
                return;
            }

            const selectedFolderId = selectedFolder;
            await ApiService.duplicateQuiz(quizId, selectedFolderId);
        } catch (error) {
            console.error('Error duplicating quiz:', error);
            throw error;
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
        if (!questions || questions.length === 0) {
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
                const { title, content } = quiz;
                let quizContent = '';

                content.forEach((question, qIndex) => {
                    const formattedQuestion = question.trim();
                    if (formattedQuestion !== '') {
                        quizContent += formattedQuestion;
                        if (qIndex !== content.length - 1) {
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
                <div>
                    <select value={selectedFolder} onChange={handleSelectFolder} required>
                        <option value="" disabled>Select a folder</option>
                        {folders.map((folder) => (
                            <option key={folder._id} value={folder._id}>{folder.title}</option>
                        ))}
                    </select>
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
                                                disabled={!validQuiz(quiz.content)}
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
