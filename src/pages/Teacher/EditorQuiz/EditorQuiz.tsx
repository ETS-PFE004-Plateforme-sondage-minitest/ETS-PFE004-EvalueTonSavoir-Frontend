// EditorQuiz.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import Editor from '../../../components/Editor/Editor';
import GiftCheatSheet from '../../../components/GIFTCheatSheet/GiftCheatSheet';
import GIFTTemplatePreview from '../../../components/GiftTemplate/GIFTTemplatePreview';

//import { QuizService } from '../../../services/QuizService';
import { QuizType } from '../../../Types/QuizType';

import './editorQuiz.css';
import { Button } from '@mui/material';
import ConfirmDialog from '../../../components/ConfirmDialog/ConfirmDialog';
import ReturnButton from '../../../components/ReturnButton/ReturnButton';
import axios from 'axios'; // Import Axios for HTTP requests

interface EditQuizParams {
    id: string;
    [key: string]: string | undefined;
}
const api = "http://localhost:4400/";
const iduser = "65c92c3462badbf6d78cf406";
function getAuthToken(): string | null {

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1yb3lzdGFnZUBvdXRsb29rLmNvbSIsImlhdCI6MTcwODY1NTI1N30.xG-IumR_R4CKe4DvSJP2ZNraLoBUD1rgmbmOIFOVJBE";
    return token;
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

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const token = getAuthToken();
                const headers = {
                    Authorization: `Bearer ${token}`
                };
                const response = await axios.get(api + `quiz/getById/${id}`, {
                    headers: headers
                });
                setQuiz(response.data.results);
                setFilteredValue(response.data.results.questions);
                setValue(response.data.results.questions.join('\n\n'));
                setQuizTitle(response.data.results.title);
            } catch (error) {
                console.error('Error fetching quiz:', error);
            }
        };

        if (id === 'new') {
            setNewQuiz(true);
        } else {
            fetchQuiz();
        }
    }, [id]);

    async function handleFiles(files: FileList) {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            try {
                const id = await uploadImage(file);
                console.log('File uploaded successfully. ID:', id);
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }
    }



    document.addEventListener('DOMContentLoaded', () => {
        const fileInput = document.getElementById('file-input');

        // Event listener for file input change
        fileInput?.addEventListener('change', (event) => {
            const files = (event.target as HTMLInputElement).files;
            console.log("here");
            if (files) {
                handleFiles(files);
            }
        });
    });

    useEffect(() => {
        const dropZone = document.getElementById('drop-zone');

        const handleDrop = (event: DragEvent) => {
            event.preventDefault();
            const files = event.dataTransfer?.files;
            if (files) {
                handleFiles(files);
            }
        };

        dropZone?.addEventListener('dragover', (event) => {
            event.preventDefault();
            dropZone.classList.add('drag-over');
        });

        dropZone?.addEventListener('dragleave', () => {
            dropZone.classList.remove('drag-over');
        });

        dropZone?.addEventListener('drop', handleDrop);

        return () => {
            dropZone?.removeEventListener('dragover', (event) => {
                event.preventDefault();
                dropZone.classList.add('drag-over');
            });
            dropZone?.removeEventListener('dragleave', () => {
                dropZone.classList.remove('drag-over');
            });
            dropZone?.removeEventListener('drop', handleDrop);
        };
    }, []);






    async function uploadImage(file: File): Promise<string> {
        const formData = new FormData();
        formData.append('image', file);
        const token = getAuthToken();
        const headers = {
            Authorization: `Bearer ${token}`
        };
        const response = await fetch(api + `image/upload`, {
            method: 'POST',
            headers: headers,
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to upload image');
        }

        const data = await response.json();
        return data.id; // Assuming the backend returns the ID of the uploaded image
    }


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
            const token = getAuthToken();
            const headers = {
                Authorization: `Bearer ${token}`
            };
            if (isNewQuiz) {
                const newQuiz = {
                    id: uuidv4(),
                    title: quizTitle || 'Untitled quiz',
                    questions: filteredValue
                };
                await axios.post(api + 'quiz/create', { userId: iduser, quiz: newQuiz }, {
                    headers: headers
                });
            } else {
                await axios.put(api + `quiz/update/${id}`, { userId: iduser, title: quizTitle, questions: filteredValue }, {
                    headers: headers
                });
            }
            handleModalClose();
            navigate('/teacher/dashboard');
        } catch (error) {
            console.error('Error saving quiz:', error);
        }
    };

    if (!isNewQuiz && !quiz) {
        return <div>Chargement...</div>;
    }

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
                            <Button variant="contained" onClick={handleSaveQuiz}>
                                Enregistrer
                            </Button>
                        </div>
                        {/* Drag and drop file input */}
                        <div id="drop-zone" className="drop-zone">
                            <input type="file" id="file-input" className="file-input" accept="image/*" multiple />
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
