import React, { useState, DragEvent, useRef, useEffect } from 'react';
import './importModal.css';
import { v4 as uuidv4 } from 'uuid';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton
} from '@mui/material';
import { Clear, Download } from '@mui/icons-material';
import axios from 'axios'; // Import Axios for HTTP requests

type DroppedFile = {
    id: number;
    name: string;
    icon: string;
    file: File;
};

interface Props {
    handleOnClose: () => void;
    handleOnImport: () => void;
    open: boolean;
}

const DragAndDrop: React.FC<Props> = ({ handleOnClose, handleOnImport, open }) => {
    const [droppedFiles, setDroppedFiles] = useState<DroppedFile[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        return () => {
            setDroppedFiles([]);
        };
    }, []);

    const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();

        const files = e.dataTransfer.files;
        handleFiles(files);
    };

    const handleFiles = (files: FileList) => {
        const newDroppedFiles = Array.from(files)
            .filter((file) => file.name.endsWith('.txt'))
            .map((file, index) => ({
                id: index,
                name: file.name,
                icon: '📄',
                file
            }));

        setDroppedFiles((prevFiles) => [...prevFiles, ...newDroppedFiles]);
    };

    const api = "http://localhost:4400/";
    const iduser = "65c92c3462badbf6d78cf406";
    function getAuthToken(): string | null {
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1yb3lzdGFnZUBvdXRsb29rLmNvbSIsImlhdCI6MTcwODY1NTI1N30.xG-IumR_R4CKe4DvSJP2ZNraLoBUD1rgmbmOIFOVJBE";
        return token;
    }

    const handleOnSave = async () => {
        const storedQuizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
        const quizzesToImportPromises = droppedFiles.map((droppedFile) => {
            return new Promise((resolve) => {
                const reader = new FileReader();

                reader.onload = async (event) => {
                    if (event.target && event.target.result) {
                        const fileContent = event.target.result as string;
                        console.log(fileContent);
                        if (fileContent.trim() === '') {
                            resolve(null);
                        }
                        const questions = fileContent.split(/\r?\n/)
                            .map(question => {
                                const sanitizedQuestion = question.replace(/\\\\/g, '\\');
                                return sanitizedQuestion.trim();
                            });

                        const newQuiz = {
                            id: uuidv4(),
                            title: droppedFile.name.slice(0, -4) || 'Untitled quiz',
                            questions
                        };

                        try {
                            await axios.post(api + 'quiz/create', { userId: iduser, quiz: newQuiz }, {
                                headers: {
                                    Authorization: `Bearer ${getAuthToken()}`
                                }
                            });
                            resolve(newQuiz);
                        } catch (error) {
                            console.error('Error saving quiz:', error);
                            resolve(null);
                        }
                    } else {
                        resolve(null);
                    }
                };

                reader.readAsText(droppedFile.file);
            });
        });

        Promise.all(quizzesToImportPromises).then((quizzesToImport) => {
            const verifiedQuizzesToImport = quizzesToImport.filter((quiz) => {
                return quiz !== null;
            });

            const updatedQuizzes = [...storedQuizzes, ...verifiedQuizzesToImport];
            localStorage.setItem('quizzes', JSON.stringify(updatedQuizzes));

            setDroppedFiles([]);
            handleOnImport();
            handleOnClose();
            window.location.reload();
        });
    };







    const handleRemoveFile = (id: number) => {
        setDroppedFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            handleFiles(files);
        }
    };

    const handleBrowseButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleOnCancel = () => {
        setDroppedFiles([]);
        handleOnClose();
    };

    return (
        <>
            <Dialog open={open} onClose={handleOnCancel} fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold', fontSize: 24 }}>
                    {'Importation de quiz'}
                </DialogTitle>
                <DialogContent
                    className="import-container"
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={handleBrowseButtonClick}
                >
                    <div className="mb-1">
                        <DialogContentText sx={{ textAlign: 'center' }}>
                            Déposer des fichiers ici ou
                            <br />
                            cliquez pour ouvrir l'explorateur des fichiers
                        </DialogContentText>
                    </div>
                    <Download color="primary" />
                </DialogContent>
                <DialogContent>
                    {droppedFiles.map((file) => (
                        <div key={file.id + file.name} className="file-container">
                            <span>{file.icon}</span>
                            <span>{file.name}</span>
                            <IconButton
                                sx={{ padding: 0 }}
                                onClick={() => handleRemoveFile(file.id)}
                            >
                                <Clear />
                            </IconButton>
                        </div>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={handleOnCancel}>
                        Annuler
                    </Button>
                    <Button variant="contained" onClick={handleOnSave}>
                        Importer
                    </Button>
                </DialogActions>
            </Dialog>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileInputChange}
                multiple
            />
        </>
    );
};

export default DragAndDrop;
