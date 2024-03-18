// EditorQuiz.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { FolderType } from '../../../Types/FolderType';

import Editor from '../../../components/Editor/Editor';
import GiftCheatSheet from '../../../components/GIFTCheatSheet/GiftCheatSheet';
import GIFTTemplatePreview from '../../../components/GiftTemplate/GIFTTemplatePreview';

import { QuizType } from '../../../Types/QuizType';

import './editorQuiz.css';
import { Button, TextField, NativeSelect, IconButton } from '@mui/material';
import { Send } from '@mui/icons-material';
import ReturnButton from '../../../components/ReturnButton/ReturnButton';

import ApiService from '../../../services/ApiService';

interface EditQuizParams {
    id: string;
    [key: string]: string | undefined;
}

const QuizForm: React.FC = () => {
    const [quizTitle, setQuizTitle] = useState('');
    const [selectedFolder, setSelectedFolder] = useState<string>('');
    const [filteredValue, setFilteredValue] = useState<string[]>([]);

    const { id } = useParams<EditQuizParams>();
    const [value, setValue] = useState('');
    const [isNewQuiz, setNewQuiz] = useState(false);
    const [quiz, setQuiz] = useState<QuizType | null>(null);
    const navigate = useNavigate();
    const [folders, setFolders] = useState<FolderType[]>([]);
    const [imageLinks, setImageLinks] = useState<string[]>([]);
    const handleSelectFolder = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedFolder(event.target.value);
    };

    useEffect(() => {
        const fetchData = async () => {
            const userFolders = await ApiService.getUserFolders();
            setFolders(userFolders as FolderType[]);
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!id || id === 'new') {
                    setNewQuiz(true);
                    return;
                }

                const quiz = await ApiService.getQuiz(id) as QuizType;

                if (!quiz) {
                    window.alert(`Une erreur est survenue.\n Le quiz ${id} n'a pas été trouvé\nVeuillez réessayer plus tard`)
                    console.error('Quiz not found for id:', id);
                    navigate('/teacher/dashboard');
                    return;
                }

                setQuiz(quiz as QuizType);
                const { title, content, folderId } = quiz;

                setQuizTitle(title);
                setSelectedFolder(folderId);
                setFilteredValue(content);
                setValue(quiz.content.join('\n\n'));

            } catch (error) {
                window.alert(`Une erreur est survenue.\n Veuillez réessayer plus tard`)
                console.error('Error fetching quiz:', error);
                navigate('/teacher/dashboard');
            }
        };

        fetchData();
    }, [id]);

    function handleUpdatePreview(value: string) {
        if (value !== '') {
            setValue(value);
        }

        const linesArray = value.split(/(?<=^|[^\\]}.*)[\n]+/);

        if (linesArray[linesArray.length - 1] === '') linesArray.pop();

        setFilteredValue(linesArray);
    }

    const handleQuizTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuizTitle(event.target.value);
    };

    const handleQuizSave = async () => {
        try {
            // check if everything is there
            if (quizTitle == '') {
                alert("Veuillez choisir un titre");
                return;
            }

            if (selectedFolder == '') {
                alert("Veuillez choisir un dossier");
                return;
            }

            if (isNewQuiz) {
                await ApiService.createQuiz(quizTitle, filteredValue, selectedFolder);
            } else {
                if (quiz) {
                    await ApiService.updateQuiz(quiz._id, quizTitle, filteredValue);
                }
            }

            navigate('/teacher/dashboard');
        } catch (error) {
            window.alert(`Une erreur est survenue.\n Veuillez réessayer plus tard`)
            console.log(error)
        }
    };

    // I do not know what this does but do not remove
    if (!isNewQuiz && !quiz) {
        return <div>Chargement...</div>;
    }

    const handleSaveImage = async () => {
        try {
            const inputElement = document.getElementById('file-input') as HTMLInputElement;
            
            if (!inputElement.files || inputElement.files.length === 0) {
                window.alert("Veuillez d'abord choisir un fichier à télécharger")
                return;
            }

            const imageUrl = await ApiService.uploadImage(inputElement.files[0]);

            // Check for errors
            if(imageUrl.indexOf("ERROR") >= 0) {
                window.alert(`Une erreur est survenue.\n Veuillez réessayer plus tard`)
                return;
            }

            setImageLinks(prevLinks => [...prevLinks, imageUrl]);
        } catch (error) {
            window.alert(`Une erreur est survenue.\n Veuillez réessayer plus tard`)
        }
    };

    const handleCopyToClipboard = async (link: string) => {
        navigator.clipboard.writeText(link);
    }

    return (
        <div className='quizEditor'>

            <div className='editHeader'>
                <ReturnButton
                    askConfirm
                    message={`Êtes-vous sûr de vouloir quitter l'éditeur sans sauvegarder le questionnaire?`}
                />

                <div className='title'>Éditeur de quiz</div>

                <div className='dumb'></div>
            </div>

            <div className='editSection'>

                <div className='edit'>
                    <h2 className="subtitle">Éditeur</h2>
                    <TextField
                        onChange={handleQuizTitleChange}
                        value={quizTitle}
                        placeholder="Titre du quiz"
                        fullWidth
                    />

                    <NativeSelect
                        id="select-folder"
                        color="primary"
                        value={selectedFolder}
                        onChange={handleSelectFolder}
                        disabled={!isNewQuiz}
                    >
                        <option disabled value=""> Choisir un dossier... </option>

                        {folders.map((folder: FolderType) => (
                            <option value={folder._id} key={folder._id}> {folder.title} </option>
                        ))}
                    </NativeSelect>

                    <Editor initialValue={value} onEditorChange={handleUpdatePreview} />

                    <div className='images'>
                        <div className='upload'>
                            <label className="dropArea">
                                <input type="file" id="file-input" className="file-input" accept="image/*" multiple />
                            </label>

                            <IconButton
                                color="primary"
                                onClick={handleSaveImage}
                            > <Send /> </IconButton>

                        </div>

                        <h2 className="subtitle">Mes images :</h2>

                        <div>
                            <ul>
                                {imageLinks.map((link, index) => (
                                    <li key={index}>
                                        <code
                                            onClick={() => handleCopyToClipboard(`<img ${link} >`)}>
                                            {`<img ${link} >`}
                                        </code>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <Button variant="contained" onClick={handleQuizSave}>
                        Enregistrer
                    </Button>

                    <GiftCheatSheet />

                </div>

                <div className='preview'>
                    <div className="preview-column">
                        <h2 className="subtitle">Prévisualisation</h2>
                        <div>
                            <GIFTTemplatePreview questions={filteredValue} />
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default QuizForm;
