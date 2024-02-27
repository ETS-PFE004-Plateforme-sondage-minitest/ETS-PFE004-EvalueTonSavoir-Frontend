// EditorQuiz.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { FolderType } from '../../../Types/FolderType';

import Editor from '../../../components/Editor/Editor';
import GiftCheatSheet from '../../../components/GIFTCheatSheet/GiftCheatSheet';
import GIFTTemplatePreview from '../../../components/GiftTemplate/GIFTTemplatePreview';

//import { QuizService } from '../../../services/QuizService';
import { QuizType } from '../../../Types/QuizType';

import './editorQuiz.css';
import { Button } from '@mui/material';
import ConfirmDialog from '../../../components/ConfirmDialog/ConfirmDialog';
import ReturnButton from '../../../components/ReturnButton/ReturnButton';
//import axios from 'axios'; // Import Axios for HTTP requests
import ApiService from '../../../services/ApiService';

interface EditQuizParams {
    id: string;
    [key: string]: string | undefined;
}

const QuizForm: React.FC = () => {
    const { id } = useParams<EditQuizParams>();
    const [value, setValue] = useState('');
    const [filteredValue, setFilteredValue] = useState<string[]>([]);
    const [quizToSave, setQuizToSave] = useState(false);
    const [quizTitle, setQuizTitle] = useState('');
    const [isNewQuiz, setNewQuiz] = useState(false);
    const [quiz, setQuiz] = useState<QuizType | null>(null);
    const navigate = useNavigate();
    const [folders, setFolders] = useState<FolderType[]>([]);
    const [selectedFolder, setSelectedFolder] = useState<string>(''); // Selected folder
    const [imageLinks, setImageLinks] = useState<string[]>([]);
    const handleSelectFolder = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedFolder(event.target.value);
    };
    useEffect(() => {
        const fetchData = async () => {
            const userFolders = await ApiService.getUserFolders();
            setFolders(userFolders);
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!id || id === 'new') {
                    setNewQuiz(true);
                    return; // Exit early if id is undefined or 'new'
                }

                const quiz = await ApiService.getQuiz(id);
                if (!quiz) {
                    console.error('Quiz not found for id:', id);
                    return;
                }
                setQuiz(quiz);

                setFilteredValue(quiz.content);
                setValue(quiz.content.join('\n\n'));


                setQuizTitle(quiz.title);
            } catch (error) {
                console.error('Error fetching quiz:', error);
            }
        };


        fetchData();
    }, [id]);



    function handleEditorChange(value: string) {
        setValue(value);
    }

    function handleUpdatePreview(value: string) {
        if (value !== '') {
            handleEditorChange(value);
        }
        const linesArray = value.split(/(?<=^|[^\\]}.*)[\n]+/);
        if (linesArray[linesArray.length - 1] === '') linesArray.pop();
        setFilteredValue(linesArray);
    }

    const handleSaveQuiz = () => {
        setQuizToSave(true);
    };

    const handleQuizTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuizTitle(event.target.value);
    };

    const handleModalClose = () => {
        setQuizToSave(false);
        setQuizTitle('');
    };

    const handleQuizSave = async () => {
        try {
            if (isNewQuiz) {
                if (!selectedFolder) {
                    // If no folder is selected, display a message to the user
                    alert("Veuillez choisir un dossier");
                    return; // Exit the function early
                }
                // Call the createQuiz method with the appropriate parameters
                await ApiService.createQuiz(quizTitle || 'Untitled quiz', filteredValue, selectedFolder);
            } else {
                console.log(quiz);
                if (quiz)
                    await ApiService.updateQuiz(quiz._id, quizTitle, filteredValue);
            }

            handleModalClose();
            navigate('/teacher/dashboard');
        } catch (error) {
            console.error('Error saving quiz:', error);
            // Handle error here (e.g., show error message to user)
        }
    };

    if (!isNewQuiz && !quiz) {
        return <div>Chargement...</div>;
    }
    

    const handleSaveImage = async () => {
        try {
            const inputElement = document.getElementById('file-input') as HTMLInputElement;
            if (!inputElement.files || inputElement.files.length === 0) {
                console.error('No files selected.');
                return;
            }

            const image = inputElement.files[0];
            const imageUrl = await ApiService.uploadImage(image);
            console.log('Image uploaded:', imageUrl);

            // Ajouter l'URL de l'image téléchargée à la liste des liens d'images
            setImageLinks(prevLinks => [...prevLinks, imageUrl]);
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    return (
        <div className="editor-page-wrapper">
            <div className="edit-page-container">
                <div className="return-button-wrapper">
                    <ReturnButton
                        askConfirm
                        message={`Êtes-vous sûr de vouloir quitter l'éditeur sans sauvegarder le questionnaire ?`}
                    />
                </div>
                <h1 className="page-title">Éditeur de quiz</h1>

                <div className="container">
                    <div>
                        <h2 className="subtitle">Éditeur</h2>
                        <div className="editor-container">
                            <Editor initialValue={value} onEditorChange={handleUpdatePreview} />
                            <div>
                                <select value={selectedFolder} onChange={handleSelectFolder} required>
                                    <option value="" disabled>Select a folder</option>
                                    {folders.map((folder) => (
                                        <option key={folder._id} value={folder._id}>{folder.title}</option>
                                    ))}
                                </select>
                            </div>

                            <Button variant="contained" onClick={handleSaveQuiz}>
                                Enregistrer
                            </Button>
                        </div>
                        {/* Drag and drop file input */}
                        <div id="drop-zone" className="drop-zone">
                            <input type="file" id="file-input" className="file-input" accept="image/*" multiple />
                        </div>
                        <Button variant="contained" onClick={handleSaveImage}>
                            Envoyer image
                        </Button>
                        <div>
                            <h2>Liens d'images utilisés :</h2>
                            <ul>
                                {imageLinks.map((link, index) => (
                                    <li key={index}>{link}</li>
                                ))}
                            </ul>
                        </div>
                        <GiftCheatSheet />
                    </div>
                    <div className="preview-column">
                        <h2 className="subtitle">Prévisualisation</h2>
                        <div>
                            <GIFTTemplatePreview questions={filteredValue} />
                        </div>
                    </div>
                </div>
                <ConfirmDialog
                    open={quizToSave}
                    title="Sauvegarder le questionnaire"
                    message="Entrez un titre pour votre questionnaire:"
                    hasOptionalInput
                    optionalInputValue={quizTitle}
                    onOptionalInputChange={handleQuizTitleChange}
                    onConfirm={handleQuizSave}
                    onCancel={handleModalClose}
                />
            </div>
        </div>
    );
};

export default QuizForm;
