import React, { useState, DragEvent, useRef } from 'react';
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

    const handleOnSave = () => {
        const storedQuizzes = JSON.parse(localStorage.getItem('quizzes') || '[]');
        const quizzesToImportPromises = droppedFiles.map((droppedFile) => {
            return new Promise((resolve) => {
                const reader = new FileReader();

                reader.onload = (event) => {
                    if (event.target && event.target.result) {
                        const fileContent: string = event.target.result as string;
                        const questions = fileContent.split(/(?<=^|[^\\]}.*)\r?\n/);
                        if (questions[questions.length - 1] === '') questions.pop(); // Remove last empty line
                        const newQuiz = {
                            id: uuidv4(),
                            title: droppedFile.name.slice(0, -4) || 'Untitled quiz',
                            questions
                        };
                        resolve(newQuiz);
                    }
                };

                reader.readAsText(droppedFile.file);
            });
        });

        Promise.all(quizzesToImportPromises).then((quizzesToImport) => {
            const updatedQuizzes = [...storedQuizzes, ...quizzesToImport];
            localStorage.setItem('quizzes', JSON.stringify(updatedQuizzes));

            handleOnImport();
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

    return (
        <>
            <Dialog open={open} onClose={handleOnClose} fullWidth>
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
                        <div key={file.id} className="file-container">
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
                    <Button variant="outlined" onClick={handleOnClose}>
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
