// Dashboard.tsx
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useMemo, ChangeEventHandler } from 'react';
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
    Divider,
    MenuItem,
    NativeSelect,
    InputLabel,
    SelectChangeEvent
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

    useEffect(() => {
        const fetchData = async () => {
            if (!ApiService.isLogedIn()) {
                navigate("/teacher/login");
            }
            else {
                let userFolders = await ApiService.getUserFolders();

                setFolders(userFolders as FolderType[]);
            }

        };

        fetchData();
    }, []);



















    const handleSelectFolder = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedFolder(event.target.value);
    };


    useEffect(() => {
        const fetchQuizzesForFolder = async () => {

            if (selectedFolder == '') {
                const folders = await ApiService.getUserFolders(); // HACK force user folders to load on first load
                console.log("show all quizes")
                var quizzes: QuizType[] = [];

                for (const folder of folders as FolderType[]) {
                    const folderQuizzes = await ApiService.getFolderContent(folder._id);
                    console.log("folder: ", folder.title, " quiz: ", folderQuizzes);
                    quizzes = quizzes.concat(folderQuizzes as QuizType[])
                }

                setQuizzes(quizzes as QuizType[]);
            }
            else {
                console.log("show some quizes")
                const folderQuizzes = await ApiService.getFolderContent(selectedFolder);
                setQuizzes(folderQuizzes as QuizType[]);

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

    const handleRemoveQuiz = async (quiz: QuizType) => {
        // on le fait juste une fois 
        await ApiService.deleteQuiz(quizId);

        // try {
        //     // Send DELETE request for each quiz to be removed
        //     for (const quizId of quizIds) {
        //         await ApiService.deleteQuiz(quizId);
        //     }

        //     // Update the state to remove the deleted quizzes
        //     const updatedQuizzes = quizzes.filter((quiz) => !quizIds.includes(quiz._id));
        //     setQuizzes(updatedQuizzes);
        //     setSelectedQuizes([]);
        //     setQuizIdsToRemove([]);
        //     setQuizTitleToRemove('');
        // } catch (error) {
        //     console.error('Error removing quizzes:', error);
        //     throw error; // Optional: rethrow the error to handle it elsewhere
        // }
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
    const handleDuplicateQuiz = async (quiz: QuizType) => {
        try {
            const quizToDuplicate = quizzes.find((quiz) => quiz._id === quizId);
            if (!quizToDuplicate) {
                console.error(`Quiz with ID ${quizId} not found.`);
                return;
            }

            const selectedFolderId = selectedFolder;
            await ApiService.duplicateQuiz(quizId, selectedFolderId, "X");
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

    const handleCreateFolder = async () => {
        try {
            const folderTitle = prompt('Titre du dossier');
            if (folderTitle) {
                await ApiService.createFolder(folderTitle);
                const userFolders = await ApiService.getUserFolders();
                setFolders(userFolders as FolderType[]);
            }
        } catch (error) {
            console.error('Error creating folder:', error);
        }
    };
    const handleDeleteFolder = async () => {

        // GET folder id from selected folder
        try {
            const confirmed = window.confirm('AVoulez-vous vraiment supprimer ce dossier?');
            if (confirmed) {
                await ApiService.deleteFolder(folderId);
                const userFolders = await ApiService.getUserFolders();
                setFolders(userFolders as FolderType[]);
            }
        } catch (error) {
            console.error('Error deleting folder:', error);
        }
    };
    const handleRenameFolder = async () => {
        try {
            // folderId: string GET THIS FROM CURRENT FOLDER
            // currentTitle: string GET THIS FROM CURRENT FOLDER
            const newTitle = prompt('Entrée le nouveau nom du fichier', currentTitle);
            if (newTitle) {
                await ApiService.renameFolder(folderId, newTitle);
                const userFolders = await ApiService.getUserFolders();
                setFolders(userFolders as FolderType[]);
            }
        } catch (error) {
            console.error('Error renaming folder:', error);
        }
    };
    const handleDuplicateFolder = async () => {
        try {
            // folderId: string GET THIS FROM CURRENT FOLDER
            await ApiService.duplicateFolder(folderId);
            const userFolders = await ApiService.getUserFolders();
            setFolders(userFolders as FolderType[]);

        } catch (error) {
            console.error('Error duplicating folder:', error);
        }
    };

    const handleCreateQuiz = () => {
        navigate("/teacher/editor-quiz/new");
    }

    const handleEditQuiz = (quiz: QuizType) => {
        navigate(`/teacher/editor-quiz/${quiz._id}`);
    }

    const handleLancerQuiz = (quiz: QuizType) => {
        navigate(`/teacher/manage-room/${quiz._id}`);
    }




    return (

        <div className="dashboard">

            <div className="title">Tableau de bord</div>

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

            <div className='folder'>
                <div className='select'>
                    <NativeSelect
                        id="select-folder"
                        color="primary"
                        value={selectedFolder}
                        onChange={handleSelectFolder}
                    >
                        <option value=""> Tous... </option>

                        {folders.map((folder: FolderType) => (
                            <option value={folder._id} key={folder._id}> {folder.title} </option>
                        ))}
                    </NativeSelect>
                </div>

                <div className='actions'>
                    <IconButton
                        color="primary"
                        onClick={handleCreateFolder}
                    > <Add /> </IconButton>

                    <IconButton
                        color="primary"
                        onClick={handleRenameFolder}
                        disabled={selectedFolder == ''} // cannot action on all
                    > <Edit /> </IconButton>

                    <IconButton
                        color="primary"
                        onClick={handleDuplicateFolder}
                        disabled={selectedFolder == ''} // cannot action on all
                    > <ContentCopy /> </IconButton>

                    <IconButton
                        aria-label="delete"
                        color="primary"
                        onClick={handleDeleteFolder}
                        disabled={selectedFolder == ''} // cannot action on all
                    > <DeleteOutline /> </IconButton>
                </div>

            </div>

            <div className='list'>
                <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<Add />}
                    onClick={handleCreateQuiz}
                    disabled={folders.length < 1} // Cannot create quiz if no folder created
                >
                    Ajouter un nouveau quiz
                </Button>

                {quizzes.map((quiz: QuizType) => (
                    <div className='quiz'>
                        <div className='title'>
                            <Button
                                variant="outlined"
                                onClick={() => handleLancerQuiz(quiz)}
                            >
                                {quiz.title}
                            </Button>
                        </div>

                        <div className='actions'>
                            <IconButton
                                color="primary"
                                onClick={() => handleEditQuiz(quiz)}
                            > <Edit /> </IconButton>

                            <IconButton
                                color="primary"
                                onClick={() => handleDuplicateQuiz(quiz)}
                            > <ContentCopy /> </IconButton>

                            <IconButton
                                aria-label="delete"
                                color="primary"
                                onClick={() => handleRemoveQuiz(quiz)}
                            > <DeleteOutline /> </IconButton>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
