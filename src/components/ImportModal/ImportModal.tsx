import React, { useState, DragEvent } from 'react';
import './importModal.css';
import { v4 as uuidv4 } from 'uuid';

type DroppedFile = {
    id: number;
    name: string;
    icon: string;
    file: File;
};
interface Props {
    handleOnClose: () => void;
    handleOnImport: () => void;
}
const DragAndDrop: React.FC<Props> = ({ handleOnClose, handleOnImport }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [droppedFiles, setDroppedFiles] = useState<DroppedFile[]>([]);

    const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        // Handle the dropped files, e.g., upload or process them
        if (files.length > 0) {
            const newDroppedFiles = Array.from(files)
                .filter((file) => file.name.endsWith('.txt'))
                .map((file, index) => ({
                    id: index,
                    name: file.name,
                    icon: '📄',
                    file
                }));

            setDroppedFiles((prevFiles) => [...prevFiles, ...newDroppedFiles]);
        }
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

            alert('Quiz saved!');
            handleOnImport();
        });
    };

    const handleRemoveFile = (id: number) => {
        setDroppedFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>{'Importation de quiz'}</h2>
                <div
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    style={{
                        border: isDragging ? '2px dashed #0087F7' : '2px solid #C0C0C0',
                        borderRadius: '4px',
                        padding: '20px',
                        textAlign: 'center',
                        cursor: 'pointer'
                    }}
                >
                    {isDragging ? (
                        <p>Déposez les fichiers ici</p>
                    ) : (
                        <p>Glissez et déposez les fichiers ici</p>
                    )}

                    <div style={{ marginTop: '20px' }}>
                        {droppedFiles.map((file) => (
                            <div
                                key={file.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginBottom: '10px'
                                }}
                            >
                                <span style={{ marginRight: '10px' }}>{file.icon}</span>
                                <span>{file.name}</span>
                                <button
                                    style={{ marginLeft: '10px', cursor: 'pointer' }}
                                    onClick={() => handleRemoveFile(file.id)}
                                >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="modal-buttons">
                    <button className="modal-cancel" onClick={handleOnClose}>
                        Annuler
                    </button>
                    <button className="modal-confirm" onClick={handleOnSave}>
                        Importer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DragAndDrop;
